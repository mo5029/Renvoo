import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

import { synthesizeSource } from "../src/lib/openai.js";
import { searchArchive, upsertSourceToArchive, validatePineconeHost } from "../src/lib/pinecone.js";
import { assertSafeRemoteUrl, loadSource } from "../src/lib/source-loader.js";
import { INGEST_EXTERNAL_EXPORT_MODE_ENV, type AppConfig } from "../src/lib/types.js";

function createConfig(rootDir: string): AppConfig {
  const vaultDir = path.join(rootDir, "memory");

  return {
    rootDir,
    vendorDir: path.join(rootDir, "vendor"),
    vaultDir,
    rawDir: path.join(vaultDir, "raw"),
    assetsDir: path.join(vaultDir, "assets"),
    archiveDir: path.join(vaultDir, "archive"),
    archiveCacheDir: path.join(vaultDir, "archive", "cache"),
    systemDir: path.join(vaultDir, "system"),
    wikiDir: path.join(vaultDir, "wiki"),
    maintenanceDir: path.join(vaultDir, "wiki", "maintenance"),
    queryDir: path.join(vaultDir, "wiki", "queries"),
    indexDir: path.join(vaultDir, "wiki", "indexes"),
    logDir: path.join(vaultDir, "wiki", "logs"),
    stateDir: path.join(vaultDir, "state"),
    openAi: {
      apiKey: "test-openai-key",
      model: "gpt-5-mini",
      reasoningEffort: "minimal",
    },
    pinecone: {
      apiKey: "test-pinecone-key",
      indexName: "renvoo-memory",
      namespace: "renvoo-memory",
      cloud: "aws",
      region: "us-east-1",
      embedModel: "llama-text-embed-v2",
    },
    budgets: {
      noteTokens: 2400,
      contextTokens: 12000,
    },
  };
}

afterEach(() => {
  delete process.env[INGEST_EXTERNAL_EXPORT_MODE_ENV];
  vi.restoreAllMocks();
});

describe("safe ingest URL validation", () => {
  it("rejects loopback addresses and credentialed URLs", async () => {
    await expect(assertSafeRemoteUrl("http://127.0.0.1:8000/private")).rejects.toThrow(
      /private or loopback/i,
    );
    await expect(assertSafeRemoteUrl("http://[::1]/private")).rejects.toThrow(
      /private or loopback/i,
    );
    await expect(assertSafeRemoteUrl("https://user:pass@example.com/")).rejects.toThrow(
      /credentials/i,
    );
  });
});

describe("external export defaults", () => {
  it("loads text sources with blocked export mode and a redacted export payload by default", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "renvoo-source-"));
    const config = createConfig(rootDir);
    const source = await loadSource(config, {
      kind: "text",
      title: "Clinic notes",
      text: "Reach alice@example.com or +31 6 1234 5678. Internal URL: https://renvoo.local",
      tags: [],
    });

    expect(source.externalExportMode).toBe("blocked");
    expect(source.externalExportRedacted).toBe(true);
    expect(source.externalExportText).toContain("[redacted-email]");
    expect(source.externalExportText).toContain("[redacted-phone]");
    expect(source.externalExportText).toContain("[redacted-url]");
    expect(source.externalExportText).not.toContain("alice@example.com");
  });

  it("skips OpenAI synthesis when ingest export is blocked", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "renvoo-openai-"));
    const config = createConfig(rootDir);
    const source = await loadSource(config, {
      kind: "text",
      title: "Blocked source",
      text: "A compact private note.",
      tags: [],
    });
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const synthesis = await synthesizeSource(config, source, [], []);

    expect(fetchSpy).not.toHaveBeenCalled();
    expect(synthesis.topics[0]?.title).toBe("Blocked source");
  });
});

describe("pinecone hardening", () => {
  it("validates cached and live Pinecone hosts", () => {
    expect(validatePineconeHost("renvoo-abcd.svc.us-east-1-aws.pinecone.io")).toBe(
      "renvoo-abcd.svc.us-east-1-aws.pinecone.io",
    );
    expect(() => validatePineconeHost("https://evil.example.com")).toThrow(/non-Pinecone host/i);
  });

  it("skips archive search entirely when ingest export is blocked", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "renvoo-search-"));
    const config = createConfig(rootDir);
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    process.env[INGEST_EXTERNAL_EXPORT_MODE_ENV] = "blocked";

    const hits = await searchArchive(config, "clinic follow-up");

    expect(hits).toEqual([]);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("upserts redacted content and strips sensitive metadata by default", async () => {
    const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "renvoo-pinecone-"));
    const config = createConfig(rootDir);
    await fs.mkdir(config.archiveCacheDir, { recursive: true });
    await fs.writeFile(
      path.join(config.archiveCacheDir, "pinecone-index.json"),
      JSON.stringify({ host: "renvoo-abcd.svc.us-east-1-aws.pinecone.io" }, null, 2),
      "utf8",
    );

    const source = await loadSource(config, {
      kind: "text",
      title: "Alice private notes",
      text: "Reach alice@example.com about invoice 1234567890.",
      externalExportMode: "redacted",
      tags: ["ops"],
    });

    const fetchSpy = vi
      .spyOn(globalThis, "fetch")
      .mockResolvedValue(new Response("", { status: 200 }));

    const result = await upsertSourceToArchive(config, source);
    const [, init] = fetchSpy.mock.calls[0] ?? [];
    const body = String(init?.body ?? "");

    expect(result).toEqual({ synced: true, chunks: 1 });
    expect(body).toContain("[redacted-email]");
    expect(body).toContain("[redacted-id]");
    expect(body).not.toContain("alice@example.com");
    expect(body).not.toContain("Alice private notes");
    expect(body).not.toContain("source_path");
    expect(body).not.toContain("source_url");
  });
});
