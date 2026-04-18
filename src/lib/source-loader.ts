import fs from "node:fs/promises";
import path from "node:path";
import { URL } from "node:url";
import { Buffer } from "node:buffer";
import * as cheerio from "cheerio";
import pdf from "pdf-parse";
import TurndownService from "turndown";

import { ensureDir, writeText, copyFile } from "./fs-utils.js";
import { fileStem, stableId, toSlug } from "./slug.js";
import type { AppConfig, LoadedSource, RawSourceInput } from "./types.js";

function nowParts(timestamp: string): { year: string; month: string; day: string } {
  const date = new Date(timestamp);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return { year, month, day };
}

function guessExtensionFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname);
  return ext || ".bin";
}

async function downloadAssets(
  config: AppConfig,
  sourceUrl: string,
  imageUrls: string[],
  sourceSlug: string,
): Promise<string[]> {
  const downloaded: string[] = [];

  for (let index = 0; index < imageUrls.length; index += 1) {
    const url = imageUrls[index];
    try {
      const response = await fetch(url);
      if (!response.ok) {
        continue;
      }

      const bytes = Buffer.from(await response.arrayBuffer());
      const ext = guessExtensionFromUrl(url);
      const filePath = path.join(config.assetsDir, `${sourceSlug}-${index + 1}${ext}`);
      await fs.writeFile(filePath, bytes);
      downloaded.push(filePath);
    } catch {
      // Asset download is best-effort only.
    }
  }

  return downloaded;
}

async function loadFromUrl(config: AppConfig, input: RawSourceInput): Promise<LoadedSource> {
  if (!input.url) {
    throw new Error("URL input is missing a url value.");
  }

  const response = await fetch(input.url);
  if (!response.ok) {
    throw new Error(`Failed to fetch URL: ${input.url} (${response.status})`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);
  const articleHtml =
    $("article").first().html() ??
    $("main").first().html() ??
    $("body").first().html() ??
    "";
  const title =
    input.title?.trim() ||
    $("meta[property='og:title']").attr("content") ||
    $("title").first().text().trim() ||
    input.url;
  const turndown = new TurndownService();
  const markdown = turndown.turndown(articleHtml);
  const imageUrls = Array.from(
    new Set(
      $("img")
        .map((_, element) => $(element).attr("src"))
        .get()
        .filter(Boolean)
        .map((url) => new URL(url!, input.url!).toString()),
    ),
  );

  const createdAt = new Date().toISOString();
  const slug = `${nowParts(createdAt).day}-${toSlug(title)}`;
  const assetPaths = await downloadAssets(config, input.url, imageUrls.slice(0, 12), slug);
  const sourceId = stableId(`${input.url}:${markdown}`);
  const { year, month } = nowParts(createdAt);
  const rawNotePath = path.join(config.rawDir, year, month, `${slug}.md`);

  await writeText(
    rawNotePath,
    `---\nsource_id: ${sourceId}\nkind: url\ntitle: ${JSON.stringify(title)}\nurl: ${
      input.url
    }\ncreated_at: ${createdAt}\nasset_count: ${assetPaths.length}\n---\n\n${markdown}\n`,
  );

  return {
    id: sourceId,
    kind: "url",
    title,
    domain: input.domain ?? "renvoo-startup",
    text: markdown.trim(),
    url: input.url,
    rawNotePath,
    assetPaths,
    tags: input.tags,
    createdAt,
  };
}

async function extractFileText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  if (ext === ".pdf") {
    const data = await fs.readFile(filePath);
    const parsed = await pdf(data);
    return parsed.text.trim();
  }

  return fs.readFile(filePath, "utf8");
}

async function loadFromFile(config: AppConfig, input: RawSourceInput): Promise<LoadedSource> {
  if (!input.filePath) {
    throw new Error("File input is missing a file path.");
  }

  const title = input.title?.trim() || fileStem(input.filePath);
  const createdAt = new Date().toISOString();
  const sourceText = await extractFileText(input.filePath);
  const sourceId = stableId(`${input.filePath}:${sourceText}`);
  const { year, month } = nowParts(createdAt);
  const slug = `${nowParts(createdAt).day}-${toSlug(title)}`;
  const destinationDir = path.join(config.rawDir, year, month);
  const originalCopyPath = path.join(destinationDir, `original-${path.basename(input.filePath)}`);
  const rawNotePath = path.join(destinationDir, `${slug}.md`);

  await ensureDir(destinationDir);
  await copyFile(input.filePath, originalCopyPath);
  await writeText(
    rawNotePath,
    `---\nsource_id: ${sourceId}\nkind: file\ntitle: ${JSON.stringify(title)}\noriginal_file: ${JSON.stringify(
      path.relative(config.vaultDir, originalCopyPath),
    )}\ncreated_at: ${createdAt}\n---\n\n${sourceText}\n`,
  );

  return {
    id: sourceId,
    kind: "file",
    title,
    domain: input.domain ?? "renvoo-startup",
    text: sourceText.trim(),
    originalFilePath: input.filePath,
    rawNotePath,
    originalCopyPath,
    assetPaths: [],
    tags: input.tags,
    createdAt,
  };
}

async function loadFromText(config: AppConfig, input: RawSourceInput): Promise<LoadedSource> {
  if (!input.text) {
    throw new Error("Text input is missing text.");
  }

  const title = input.title?.trim() || "untitled-renvoo-note";
  const createdAt = new Date().toISOString();
  const { year, month, day } = nowParts(createdAt);
  const sourceId = stableId(`${title}:${input.text}`);
  const slug = `${day}-${toSlug(title)}`;
  const rawNotePath = path.join(config.rawDir, year, month, `${slug}.md`);

  await writeText(
    rawNotePath,
    `---\nsource_id: ${sourceId}\nkind: text\ntitle: ${JSON.stringify(title)}\ncreated_at: ${createdAt}\n---\n\n${input.text}\n`,
  );

  return {
    id: sourceId,
    kind: "text",
    title,
    domain: input.domain ?? "renvoo-startup",
    text: input.text.trim(),
    rawNotePath,
    assetPaths: [],
    tags: input.tags,
    createdAt,
  };
}

export async function loadSource(config: AppConfig, input: RawSourceInput): Promise<LoadedSource> {
  switch (input.kind) {
    case "url":
      return loadFromUrl(config, input);
    case "file":
      return loadFromFile(config, input);
    case "text":
      return loadFromText(config, input);
    default:
      throw new Error(`Unsupported source kind: ${(input as RawSourceInput).kind}`);
  }
}
