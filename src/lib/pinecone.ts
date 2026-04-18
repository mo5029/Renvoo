import path from "node:path";

import { chunkText } from "./chunking.js";
import { fileExists, readText, writeText } from "./fs-utils.js";
import type { AppConfig, ArchiveHit, ArchiveRecord, LoadedSource } from "./types.js";

const API_VERSION = "2026-04";

interface IndexDescription {
  host: string;
  status?: {
    ready?: boolean;
    state?: string;
  };
}

function hasPinecone(config: AppConfig): boolean {
  return Boolean(config.pinecone.apiKey && config.pinecone.indexName);
}

async function controlRequest(
  config: AppConfig,
  requestPath: string,
  init: RequestInit = {},
): Promise<Response> {
  return fetch(`https://api.pinecone.io${requestPath}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      "Api-Key": config.pinecone.apiKey!,
      "X-Pinecone-Api-Version": API_VERSION,
      ...(init.headers ?? {}),
    },
  });
}

async function describeIndex(config: AppConfig): Promise<IndexDescription | null> {
  const response = await controlRequest(config, `/indexes/${config.pinecone.indexName}`);
  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Pinecone describe index failed (${response.status}): ${await response.text()}`);
  }

  return (await response.json()) as IndexDescription;
}

async function createIndex(config: AppConfig): Promise<void> {
  const response = await controlRequest(config, "/indexes/create-for-model", {
    method: "POST",
    body: JSON.stringify({
      name: config.pinecone.indexName,
      cloud: config.pinecone.cloud,
      region: config.pinecone.region,
      embed: {
        model: config.pinecone.embedModel,
        field_map: {
          text: "chunk_text",
        },
        metric: "cosine",
        write_parameters: {
          input_type: "passage",
          truncate: "END",
        },
        read_parameters: {
          input_type: "query",
          truncate: "END",
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Pinecone create index failed (${response.status}): ${await response.text()}`);
  }
}

async function sleep(ms: number): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, ms));
}

async function getIndexHost(config: AppConfig): Promise<string | null> {
  if (!hasPinecone(config)) {
    return null;
  }

  const cachePath = path.join(config.archiveCacheDir, "pinecone-index.json");
  if (await fileExists(cachePath)) {
    const cached = JSON.parse(await readText(cachePath)) as IndexDescription;
    if (cached.host) {
      return cached.host;
    }
  }

  let description = await describeIndex(config);
  if (!description) {
    await createIndex(config);
    for (let attempt = 0; attempt < 20; attempt += 1) {
      await sleep(1500);
      description = await describeIndex(config);
      if (description?.status?.ready) {
        break;
      }
    }
  }

  if (!description?.host) {
    throw new Error("Pinecone index host is unavailable.");
  }

  await writeText(cachePath, JSON.stringify(description, null, 2));
  return description.host;
}

async function dataRequest(
  config: AppConfig,
  requestPath: string,
  init: RequestInit,
): Promise<Response> {
  const host = await getIndexHost(config);
  if (!host) {
    throw new Error("Pinecone is not configured.");
  }

  return fetch(`https://${host}${requestPath}`, {
    ...init,
    headers: {
      "Api-Key": config.pinecone.apiKey!,
      "X-Pinecone-Api-Version": API_VERSION,
      ...(init.headers ?? {}),
    },
  });
}

export async function upsertSourceToArchive(
  config: AppConfig,
  source: LoadedSource,
): Promise<{ synced: boolean; chunks: number }> {
  if (!hasPinecone(config)) {
    return { synced: false, chunks: 0 };
  }

  const chunks = chunkText(source.text, { maxChars: 2800, overlapChars: 250 });
  const records: ArchiveRecord[] = chunks.map((chunk, index) => ({
    _id: `${source.id}-${index + 1}`,
    chunk_text: chunk,
    document_id: source.id,
    document_title: source.title,
    source_kind: source.kind,
    source_path: path.relative(config.vaultDir, source.rawNotePath),
    source_url: source.url,
    domain: source.domain,
    tags: source.tags.join(", "),
  }));

  const ndjson = `${records.map((record) => JSON.stringify(record)).join("\n")}\n`;
  const response = await dataRequest(
    config,
    `/records/namespaces/${config.pinecone.namespace}/upsert`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-ndjson",
      },
      body: ndjson,
    },
  );

  if (!response.ok) {
    throw new Error(`Pinecone upsert failed (${response.status}): ${await response.text()}`);
  }

  return { synced: true, chunks: records.length };
}

export async function searchArchive(
  config: AppConfig,
  question: string,
  limit = 6,
): Promise<ArchiveHit[]> {
  if (!hasPinecone(config)) {
    return [];
  }

  const response = await dataRequest(
    config,
    `/records/namespaces/${config.pinecone.namespace}/search`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: {
          inputs: {
            text: question,
          },
          top_k: limit,
        },
        fields: ["chunk_text", "document_title", "source_path", "source_url"],
      }),
    },
  );

  if (!response.ok) {
    throw new Error(`Pinecone search failed (${response.status}): ${await response.text()}`);
  }

  const payload = (await response.json()) as {
    result?: {
      hits?: Array<{
        _id: string;
        _score: number;
        fields?: Record<string, string>;
      }>;
    };
  };

  return (payload.result?.hits ?? []).map((hit) => ({
    id: hit._id,
    score: hit._score,
    text: hit.fields?.chunk_text ?? "",
    title: hit.fields?.document_title ?? hit._id,
    sourcePath: hit.fields?.source_path,
    sourceUrl: hit.fields?.source_url,
  }));
}
