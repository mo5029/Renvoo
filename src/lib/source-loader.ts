import { Buffer } from "node:buffer";
import * as dns from "node:dns/promises";
import fs from "node:fs/promises";
import net from "node:net";
import path from "node:path";
import { URL } from "node:url";
import * as cheerio from "cheerio";
import pdf from "pdf-parse";
import TurndownService from "turndown";

import { copyFile, ensureDir, writeText } from "./fs-utils.js";
import { fileStem, stableId, toSlug } from "./slug.js";
import {
  resolveExternalExportMode,
  type AppConfig,
  type ExternalExportMode,
  type LoadedSource,
  type RawSourceInput,
} from "./types.js";

const REQUEST_TIMEOUT_MS = 10_000;
const DOCUMENT_MAX_BYTES = 2_000_000;
const ASSET_MAX_BYTES = 5_000_000;
const MAX_ASSET_DOWNLOADS = 12;
const MAX_REDIRECTS = 4;
const urlSafetyCache = new Map<string, Promise<void>>();
const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".avif"]);
const CONTENT_TYPE_TO_EXTENSION = new Map<string, string>([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/gif", ".gif"],
  ["image/webp", ".webp"],
  ["image/svg+xml", ".svg"],
  ["image/avif", ".avif"],
]);

interface RemoteFetchOptions {
  description: string;
  maxBytes: number;
  timeoutMs?: number;
  allowedContentTypes?: RegExp[];
}

interface RemoteFetchResult {
  finalUrl: string;
  contentType: string | null;
  bytes: Buffer;
}

function nowParts(timestamp: string): { year: string; month: string; day: string } {
  const date = new Date(timestamp);
  const year = String(date.getUTCFullYear());
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return { year, month, day };
}

function normalizeContentType(value: string | null): string {
  return (value ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
}

function isRedirectStatus(status: number): boolean {
  return status === 301 || status === 302 || status === 303 || status === 307 || status === 308;
}

function guessExtensionFromUrl(url: string): string {
  const pathname = new URL(url).pathname;
  const ext = path.extname(pathname);
  return ext || ".bin";
}

function guessExtensionFromContentType(contentType: string | null): string | null {
  return CONTENT_TYPE_TO_EXTENSION.get(normalizeContentType(contentType)) ?? null;
}

function isForbiddenHostName(hostname: string): boolean {
  const normalized = hostname.toLowerCase();
  return (
    normalized === "localhost" ||
    normalized === "host.docker.internal" ||
    normalized.endsWith(".localhost") ||
    normalized.endsWith(".local") ||
    normalized.endsWith(".internal")
  );
}

export function isForbiddenIpAddress(value: string): boolean {
  const normalized = value.toLowerCase().replace(/^\[|\]$/g, "").split("%")[0] ?? "";
  const version = net.isIP(normalized);

  if (version === 0) {
    return false;
  }

  if (normalized.startsWith("::ffff:")) {
    return isForbiddenIpAddress(normalized.slice(7));
  }

  if (version === 4) {
    const [first = 0, second = 0] = normalized.split(".").map((part) => Number.parseInt(part, 10));
    return (
      first === 0 ||
      first === 10 ||
      first === 127 ||
      (first === 169 && second === 254) ||
      (first === 172 && second >= 16 && second <= 31) ||
      (first === 192 && second === 168) ||
      (first === 100 && second >= 64 && second <= 127) ||
      (first === 198 && (second === 18 || second === 19)) ||
      first >= 224
    );
  }

  if (normalized === "::" || normalized === "::1") {
    return true;
  }

  const firstSegment = normalized
    .split(":")
    .find((segment) => segment.length > 0 && !segment.includes("."));
  const firstWord = Number.parseInt(firstSegment ?? "0", 16);

  return (
    (firstWord & 0xfe00) === 0xfc00 ||
    (firstWord & 0xffc0) === 0xfe80 ||
    (firstWord & 0xff00) === 0xff00
  );
}

async function ensurePublicRemoteHost(hostname: string): Promise<void> {
  const cacheKey = hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const existing = urlSafetyCache.get(cacheKey);
  if (existing) {
    await existing;
    return;
  }

  const pending = (async () => {
    if (isForbiddenHostName(cacheKey)) {
      throw new Error(`Refusing to fetch local host: ${hostname}`);
    }

    const ipCandidate = cacheKey.split("%")[0] ?? "";
    if (net.isIP(ipCandidate)) {
      if (isForbiddenIpAddress(ipCandidate)) {
        throw new Error(`Refusing to fetch private or loopback address: ${hostname}`);
      }
      return;
    }

    const addresses = await dns.lookup(cacheKey, { all: true, verbatim: true });
    if (!addresses.length) {
      throw new Error(`No public DNS records found for ${hostname}`);
    }

    if (addresses.some((address) => isForbiddenIpAddress(address.address))) {
      throw new Error(`Refusing to fetch private or loopback destination for ${hostname}`);
    }
  })();

  urlSafetyCache.set(cacheKey, pending);

  try {
    await pending;
  } catch (error) {
    urlSafetyCache.delete(cacheKey);
    throw error;
  }
}

export async function assertSafeRemoteUrl(rawUrl: string): Promise<URL> {
  let parsed: URL;

  try {
    parsed = new URL(rawUrl);
  } catch {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`Only http and https URLs are allowed: ${rawUrl}`);
  }

  if (parsed.username || parsed.password) {
    throw new Error(`Credentials are not allowed in ingest URLs: ${rawUrl}`);
  }

  if (!parsed.hostname) {
    throw new Error(`URL is missing a hostname: ${rawUrl}`);
  }

  await ensurePublicRemoteHost(parsed.hostname);
  return parsed;
}

async function readResponseBytes(response: Response, maxBytes: number): Promise<Buffer> {
  const body = response.body;
  if (!body) {
    const bytes = Buffer.from(await response.arrayBuffer());
    if (bytes.byteLength > maxBytes) {
      throw new Error(`Response exceeded ${maxBytes} bytes.`);
    }
    return bytes;
  }

  const reader = body.getReader();
  const chunks: Buffer[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    const chunk = Buffer.from(value);
    totalBytes += chunk.byteLength;

    if (totalBytes > maxBytes) {
      await reader.cancel().catch(() => undefined);
      throw new Error(`Response exceeded ${maxBytes} bytes.`);
    }

    chunks.push(chunk);
  }

  return Buffer.concat(chunks);
}

function isAllowedContentType(contentType: string | null, allowedContentTypes?: RegExp[]): boolean {
  if (!allowedContentTypes?.length) {
    return true;
  }

  const normalized = normalizeContentType(contentType);
  return allowedContentTypes.some((pattern) => pattern.test(normalized));
}

async function fetchRemoteResource(
  rawUrl: string,
  options: RemoteFetchOptions,
): Promise<RemoteFetchResult> {
  let currentUrl = await assertSafeRemoteUrl(rawUrl);

  for (let redirectCount = 0; redirectCount <= MAX_REDIRECTS; redirectCount += 1) {
    const response = await fetch(currentUrl, {
      headers: {
        "User-Agent": "renvoo-memory/0.1",
      },
      redirect: "manual",
      signal: AbortSignal.timeout(options.timeoutMs ?? REQUEST_TIMEOUT_MS),
    });

    if (isRedirectStatus(response.status)) {
      const location = response.headers.get("location");
      if (!location) {
        throw new Error(`${options.description} redirected without a location header.`);
      }

      currentUrl = await assertSafeRemoteUrl(new URL(location, currentUrl).toString());
      continue;
    }

    if (!response.ok) {
      throw new Error(
        `Failed to fetch ${options.description}: ${currentUrl.toString()} (${response.status})`,
      );
    }

    const contentLength = Number.parseInt(response.headers.get("content-length") ?? "", 10);
    if (Number.isFinite(contentLength) && contentLength > options.maxBytes) {
      throw new Error(
        `${options.description} exceeded the ${options.maxBytes} byte limit before download.`,
      );
    }

    const contentType = response.headers.get("content-type");
    if (!isAllowedContentType(contentType, options.allowedContentTypes)) {
      throw new Error(
        `Unsupported content type for ${options.description}: ${normalizeContentType(contentType)}`,
      );
    }

    const bytes = await readResponseBytes(response, options.maxBytes);
    return {
      finalUrl: currentUrl.toString(),
      contentType,
      bytes,
    };
  }

  throw new Error(`${options.description} exceeded the redirect limit.`);
}

export function redactForExternalExport(text: string): string {
  const redacted = text
    .replace(
      /-----BEGIN [A-Z ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z ]*PRIVATE KEY-----/g,
      "[redacted-private-key]",
    )
    .replace(/\bsk-[A-Za-z0-9]{16,}\b/g, "[redacted-openai-key]")
    .replace(
      /\b(api[_-]?key|client[_-]?secret|access[_-]?token|refresh[_-]?token|password|secret)\b(\s*[:=]\s*)(["']?)[^\s"',]+/gi,
      "$1$2$3[redacted-secret]",
    )
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\+\d[\d\s().-]{6,}\d/g, "[redacted-phone]")
    .replace(/\b(?:\d[ -]?){8,}\b/g, "[redacted-id]")
    .replace(/\b(?:https?:\/\/|www\.)\S+\b/gi, "[redacted-url]")
    .replace(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g, "[redacted-ip]")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return redacted || "[redacted for external export]";
}

function buildExternalExport(text: string, mode: ExternalExportMode): string {
  return mode === "raw" ? text.trim() : redactForExternalExport(text);
}

async function downloadAssets(
  config: AppConfig,
  sourceUrl: string,
  imageUrls: string[],
  sourceSlug: string,
): Promise<string[]> {
  const downloaded: string[] = [];

  for (let index = 0; index < imageUrls.length; index += 1) {
    const rawUrl = imageUrls[index];
    try {
      const remote = await fetchRemoteResource(rawUrl, {
        description: `asset ${index + 1} for ${sourceUrl}`,
        maxBytes: ASSET_MAX_BYTES,
      });
      const contentType = normalizeContentType(remote.contentType);
      const ext =
        guessExtensionFromContentType(remote.contentType) ?? guessExtensionFromUrl(remote.finalUrl);

      if (contentType && !contentType.startsWith("image/")) {
        continue;
      }

      if (!IMAGE_EXTENSIONS.has(ext.toLowerCase())) {
        continue;
      }

      const filePath = path.join(config.assetsDir, `${sourceSlug}-${index + 1}${ext}`);
      await fs.writeFile(filePath, remote.bytes);
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

  const remote = await fetchRemoteResource(input.url, {
    description: "source URL",
    maxBytes: DOCUMENT_MAX_BYTES,
    allowedContentTypes: [/^text\/html$/, /^application\/xhtml\+xml$/, /^text\/plain$/],
  });

  const contentType = normalizeContentType(remote.contentType);
  const rawText = remote.bytes.toString("utf8");
  const $ = cheerio.load(rawText);
  const articleHtml =
    $("article").first().html() ??
    $("main").first().html() ??
    $("body").first().html() ??
    $("body").first().text() ??
    "";
  const title =
    input.title?.trim() ||
    $("meta[property='og:title']").attr("content") ||
    $("title").first().text().trim() ||
    remote.finalUrl;
  const markdown =
    contentType === "text/plain" ? rawText.trim() : new TurndownService().turndown(articleHtml);
  const imageUrls =
    contentType === "text/plain"
      ? []
      : Array.from(
          new Set(
            $("img")
              .map((_, element) => $(element).attr("src"))
              .get()
              .filter(Boolean)
              .map((url) => new URL(url!, remote.finalUrl).toString()),
          ),
        );

  const createdAt = new Date().toISOString();
  const slug = `${nowParts(createdAt).day}-${toSlug(title)}`;
  const assetPaths = await downloadAssets(
    config,
    remote.finalUrl,
    imageUrls.slice(0, MAX_ASSET_DOWNLOADS),
    slug,
  );
  const sourceId = stableId(`${remote.finalUrl}:${markdown}`);
  const { year, month } = nowParts(createdAt);
  const rawNotePath = path.join(config.rawDir, year, month, `${slug}.md`);
  const externalExportMode = resolveExternalExportMode(input.externalExportMode, "blocked");

  await writeText(
    rawNotePath,
    `---\nsource_id: ${sourceId}\nkind: url\ntitle: ${JSON.stringify(title)}\nurl: ${
      remote.finalUrl
    }\ncreated_at: ${createdAt}\nasset_count: ${assetPaths.length}\n---\n\n${markdown}\n`,
  );

  return {
    id: sourceId,
    kind: "url",
    title,
    domain: input.domain ?? "renvoo-startup",
    text: markdown.trim(),
    url: remote.finalUrl,
    rawNotePath,
    assetPaths,
    tags: input.tags,
    createdAt,
    externalExportMode,
    externalExportText: buildExternalExport(markdown, externalExportMode),
    externalExportRedacted: externalExportMode !== "raw",
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
  const externalExportMode = resolveExternalExportMode(input.externalExportMode, "blocked");

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
    externalExportMode,
    externalExportText: buildExternalExport(sourceText, externalExportMode),
    externalExportRedacted: externalExportMode !== "raw",
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
  const externalExportMode = resolveExternalExportMode(input.externalExportMode, "blocked");

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
    externalExportMode,
    externalExportText: buildExternalExport(input.text, externalExportMode),
    externalExportRedacted: externalExportMode !== "raw",
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
