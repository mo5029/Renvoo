import path from "node:path";
import matter from "gray-matter";

import { estimateTokens } from "./chunking.js";
import {
  appendText,
  ensureDir,
  fileExists,
  listFiles,
  readText,
  toPosix,
  writeIfMissing,
  writeText,
} from "./fs-utils.js";
import { bucketForLabel, toSlug } from "./slug.js";
import type { AppConfig, Claim, ContradictionAlert, LoadedSource, NoteType, SourceSynthesis } from "./types.js";

const HUMAN_NOTES_MARKER = "## Human Notes";

const CATEGORY_DIRS: Record<NoteType, string> = {
  topic: "topics",
  entity: "entities",
  decision: "decisions",
  source: "sources",
};

function uniq(values: string[]): string[] {
  return Array.from(new Set(values.filter(Boolean)));
}

function omitUndefined<T extends Record<string, unknown>>(value: T): Record<string, unknown> {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== undefined));
}

function noteDirFor(config: AppConfig, noteType: NoteType): string {
  return path.join(config.wikiDir, CATEGORY_DIRS[noteType]);
}

export function notePathFor(config: AppConfig, noteType: NoteType, slug: string): string {
  return path.join(noteDirFor(config, noteType), `${slug}.md`);
}

function wikiLink(config: AppConfig, absolutePath: string): string {
  const relative = toPosix(path.relative(config.vaultDir, absolutePath)).replace(/\.md$/i, "");
  return `[[${relative}]]`;
}

function relativeVaultPath(config: AppConfig, absolutePath: string): string {
  return toPosix(path.relative(config.vaultDir, absolutePath));
}

function readHumanNotes(rawContent: string): string {
  const index = rawContent.indexOf(HUMAN_NOTES_MARKER);
  if (index === -1) {
    return "";
  }

  return rawContent.slice(index + HUMAN_NOTES_MARKER.length).trim();
}

function renderClaims(claims: Claim[]): string {
  if (claims.length === 0) {
    return "- No explicit claims captured yet.";
  }

  return claims
    .map((claim) => {
      const suffix = claim.evidence ? ` — ${claim.evidence}` : "";
      return `- ${claim.statement} (${claim.confidence})${suffix}`;
    })
    .join("\n");
}

function renderBulletSection(items: string[], fallback: string): string {
  if (items.length === 0) {
    return `- ${fallback}`;
  }

  return items.map((item) => `- ${item}`).join("\n");
}

function defaultHumanNotes(): string {
  return "_Human notes go here. This section is preserved across machine updates._";
}

async function parseExistingFrontmatter(filePath: string): Promise<Record<string, unknown>> {
  if (!(await fileExists(filePath))) {
    return {};
  }

  const raw = await readText(filePath);
  return matter(raw).data;
}

export async function ensureVaultStructure(config: AppConfig): Promise<void> {
  const directories = [
    config.vaultDir,
    config.rawDir,
    config.assetsDir,
    config.archiveDir,
    config.archiveCacheDir,
    config.systemDir,
    config.wikiDir,
    config.maintenanceDir,
    config.queryDir,
    config.indexDir,
    config.logDir,
    config.stateDir,
    path.join(config.wikiDir, "topics"),
    path.join(config.wikiDir, "entities"),
    path.join(config.wikiDir, "decisions"),
    path.join(config.wikiDir, "sources"),
    path.join(config.indexDir, "topics"),
    path.join(config.indexDir, "entities"),
    path.join(config.indexDir, "decisions"),
    path.join(config.indexDir, "sources"),
    path.join(config.vaultDir, ".obsidian"),
  ];

  for (const directory of directories) {
    await ensureDir(directory);
  }

  await writeIfMissing(
    path.join(config.vaultDir, ".obsidian", "app.json"),
    JSON.stringify(
      {
        attachmentFolderPath: "assets",
        alwaysUpdateLinks: true,
        newLinkFormat: "shortest",
        useMarkdownLinks: false,
      },
      null,
      2,
    ),
  );

  await writeIfMissing(
    path.join(config.systemDir, "profile.md"),
    `# Renvoo Profile

This vault is for **Renvoo startup information**.

## Mission

Capture durable knowledge about Renvoo's company, product, customers, strategy, operations, and decisions so future sessions can reason from accumulated context instead of rebuilding it from chat history.

## Current Status

- Domain is set to Renvoo.
- Durable content has not been fully ingested yet.
- Use the ingest workflow for new company documents, call notes, strategy memos, and research.
`,
  );

  await writeIfMissing(
    path.join(config.systemDir, "instructions.md"),
    `# Renvoo Memory Schema

This memory system follows Karpathy's LLM Wiki pattern and keeps the original three-layer model:

- ` + "`raw/`" + ` for immutable source documents
- ` + "`wiki/`" + ` for generated markdown knowledge pages
- ` + "`AGENTS.md`" + ` and ` + "`system/`" + ` for operating rules

## Scale Fixes

- Use ` + "`wiki/index.md`" + ` as the primary navigation page, but shard detailed catalogs under ` + "`wiki/indexes/`" + `.
- Keep identity and operating rules in ` + "`system/`" + ` instead of letting them bloat the wiki.
- Keep bulky or stable material searchable in Pinecone and only distill hot knowledge into the wiki.
- Run lint and compact passes periodically.
`,
  );

  await writeIfMissing(
    path.join(config.systemDir, "domains.md"),
    `# Renvoo Domains

Use these buckets when deciding where startup information belongs:

- Company narrative
- Product and roadmap
- ICP, customers, and market
- Outreach and go-to-market
- Operations and internal process
- Metrics, finance, and growth
- Hiring and team
- Strategic decisions and open questions
`,
  );

  await writeIfMissing(
    path.join(config.systemDir, "fixes.md"),
    `# Fixes Over The Baseline LLM Wiki

- Sharded indexes prevent the single-file index from growing without bound.
- Pinecone provides semantic recall for long archives and bulky source material.
- ` + "`log.md`" + ` stays small by pointing to monthly logs in ` + "`logs/`" + `.
- ` + "`maintenance/latest-lint.md`" + ` records stale notes, broken links, orphans, and archive gaps.
- ` + "`compact`" + ` trims oversized notes so the active wiki stays usable.
`,
  );

  await writeIfMissing(
    path.join(config.systemDir, "upstream.md"),
    `# Upstream Reference

This implementation is grounded in Karpathy's ` + "`llm-wiki.md`" + ` gist, vendored locally at:

- [vendor/karpathy-llm-wiki/llm-wiki.md](/Users/mohamedibrahim/Desktop/Codex%20Projects/Renvoo/vendor/karpathy-llm-wiki/llm-wiki.md)

Use that upstream file as the base pattern. The Renvoo-specific system here adds scaling, archive, and maintenance fixes on top.
`,
  );

  await writeIfMissing(
    path.join(config.wikiDir, "index.md"),
    `# Renvoo Wiki Index

This is the primary Karpathy-style ` + "`index.md`" + ` entrypoint for the Renvoo wiki.

- System profile: [[system/profile]]
- Schema: [[system/instructions]]
- Domain map: [[system/domains]]
- Upstream reference: [[system/upstream]]
- Contradictions: [[wiki/contradictions]]
- Recent log: [[wiki/log]]

Detailed catalogs are generated under [[wiki/indexes]].
`,
  );

  await writeIfMissing(
    path.join(config.wikiDir, "log.md"),
    `# Renvoo Wiki Log

Recent operational events appear here. Full monthly logs live in ` + "`wiki/logs/`" + `.
`,
  );

  await writeIfMissing(
    path.join(config.wikiDir, "contradictions.md"),
    `# Renvoo Contradictions

Open contradictions and unresolved conflicts are tracked here.

## Open Alerts

- No contradiction alerts yet.
`,
  );

  await writeIfMissing(
    path.join(config.maintenanceDir, "latest-lint.md"),
    `# Latest Lint Report

No lint report has been generated yet.
`,
  );

  await writeIfMissing(path.join(config.assetsDir, ".gitkeep"), "");
  await writeIfMissing(path.join(config.rawDir, ".gitkeep"), "");
  await writeIfMissing(path.join(config.archiveCacheDir, ".gitkeep"), "");
  await writeIfMissing(path.join(config.queryDir, ".gitkeep"), "");
}

function buildKnowledgeFrontmatter(
  existing: Record<string, unknown>,
  payload: {
    title: string;
    type: NoteType;
    summary: string;
    reviewAfter: string;
    sourceIds: string[];
    sourceLinks: string[];
    relatedLinks: string[];
    claims: Claim[];
    domain: string;
  },
): Record<string, unknown> {
  const existingSourceIds = Array.isArray(existing.source_ids)
    ? existing.source_ids.map(String)
    : [];
  const existingSourceLinks = Array.isArray(existing.source_note_links)
    ? existing.source_note_links.map(String)
    : [];
  const existingRelated = Array.isArray(existing.related_links)
    ? existing.related_links.map(String)
    : [];
  const existingClaims = Array.isArray(existing.claims)
    ? (existing.claims as Claim[])
    : [];

  return {
    title: payload.title,
    type: payload.type,
    domain: payload.domain,
    summary: payload.summary,
    updated_at: new Date().toISOString(),
    review_after: payload.reviewAfter,
    source_ids: uniq([...existingSourceIds, ...payload.sourceIds]),
    source_note_links: uniq([...existingSourceLinks, ...payload.sourceLinks]),
    related_links: uniq([...existingRelated, ...payload.relatedLinks]),
    claims: [...existingClaims, ...payload.claims].slice(-15),
  };
}

export async function upsertKnowledgeNote(
  config: AppConfig,
  payload: {
    noteType: Exclude<NoteType, "source">;
    title: string;
    slug: string;
    summary: string;
    evidence: string[];
    claims: Claim[];
    source: LoadedSource;
    sourceNotePath: string;
    relatedPaths: string[];
  },
): Promise<string> {
  const filePath = notePathFor(config, payload.noteType, payload.slug);
  const existingData = await parseExistingFrontmatter(filePath);
  const existingRaw = (await fileExists(filePath)) ? await readText(filePath) : "";
  const humanNotes = readHumanNotes(existingRaw) || defaultHumanNotes();
  const reviewAfter = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString();
  const frontmatter = omitUndefined(
    buildKnowledgeFrontmatter(existingData, {
      title: payload.title,
      type: payload.noteType,
      summary: payload.summary,
      reviewAfter,
      sourceIds: [payload.source.id],
      sourceLinks: [wikiLink(config, payload.sourceNotePath)],
      relatedLinks: payload.relatedPaths.map((item) => wikiLink(config, item)),
      claims: payload.claims,
      domain: payload.source.domain,
    }),
  );

  const body = [
    `# ${payload.title}`,
    "",
    "## Snapshot",
    "",
    payload.summary,
    "",
    "## Evidence",
    "",
    renderBulletSection(payload.evidence, "No evidence snippets captured yet."),
    "",
    "## Claims",
    "",
    renderClaims(payload.claims),
    "",
    "## Sources",
    "",
    renderBulletSection(
      uniq((frontmatter.source_note_links as string[]) ?? []),
      "No source links available.",
    ),
    "",
    "## Related",
    "",
    renderBulletSection(
      uniq((frontmatter.related_links as string[]) ?? []),
      "No related notes linked yet.",
    ),
    "",
    "## Maintenance",
    "",
    `- Review after: ${frontmatter.review_after as string}`,
    `- Estimated tokens: ${estimateTokens(payload.summary)}`,
    "",
    HUMAN_NOTES_MARKER,
    "",
    humanNotes,
    "",
  ].join("\n");

  await writeText(filePath, matter.stringify(body, frontmatter));
  return filePath;
}

export async function upsertSourceNote(
  config: AppConfig,
  source: LoadedSource,
  synthesis: SourceSynthesis,
  archiveSync: { synced: boolean; chunks: number },
): Promise<string> {
  const slug = toSlug(source.title);
  const filePath = notePathFor(config, "source", slug);
  const existingRaw = (await fileExists(filePath)) ? await readText(filePath) : "";
  const humanNotes = readHumanNotes(existingRaw) || defaultHumanNotes();
  const existingData = await parseExistingFrontmatter(filePath);

  const frontmatter = omitUndefined({
    ...existingData,
    title: source.title,
    type: "source",
    domain: source.domain,
    source_id: source.id,
    source_kind: source.kind,
    summary: synthesis.summary,
    updated_at: new Date().toISOString(),
    created_at: source.createdAt,
    raw_path: relativeVaultPath(config, source.rawNotePath),
    original_file: source.originalCopyPath
      ? relativeVaultPath(config, source.originalCopyPath)
      : undefined,
    source_url: source.url,
    storage_strategy: synthesis.storageStrategy,
    archive_synced_at: archiveSync.synced ? new Date().toISOString() : undefined,
    archive_chunk_count: archiveSync.chunks,
    tags: source.tags,
  });

  const topicLinks = synthesis.topics.map((topic) =>
    wikiLink(config, notePathFor(config, "topic", topic.slug)),
  );
  const entityLinks = synthesis.entities.map((entity) =>
    wikiLink(config, notePathFor(config, "entity", entity.slug)),
  );
  const decisionLinks = synthesis.decisions.map((decision) =>
    wikiLink(config, notePathFor(config, "decision", decision.slug)),
  );

  const body = [
    `# Source: ${source.title}`,
    "",
    "## Source Summary",
    "",
    synthesis.summary,
    "",
    "## Raw Reference",
    "",
    `- Raw note: ${relativeVaultPath(config, source.rawNotePath)}`,
    source.originalCopyPath
      ? `- Original file copy: ${relativeVaultPath(config, source.originalCopyPath)}`
      : "",
    source.url ? `- Source URL: ${source.url}` : "",
    source.assetPaths.length ? `- Downloaded assets: ${source.assetPaths.length}` : "",
    "",
    "## Archive",
    "",
    `- Storage strategy: ${synthesis.storageStrategy}`,
    `- Pinecone synced: ${archiveSync.synced ? "yes" : "no"}`,
    `- Archive chunks: ${archiveSync.chunks}`,
    "",
    "## Topics",
    "",
    renderBulletSection(topicLinks, "No topic notes generated yet."),
    "",
    "## Entities",
    "",
    renderBulletSection(entityLinks, "No entity notes generated yet."),
    "",
    "## Decisions",
    "",
    renderBulletSection(decisionLinks, "No decision notes generated yet."),
    "",
    "## Claims",
    "",
    renderClaims(synthesis.claims),
    "",
    HUMAN_NOTES_MARKER,
    "",
    humanNotes,
    "",
  ]
    .filter(Boolean)
    .join("\n");

  await writeText(filePath, matter.stringify(body, frontmatter));
  return filePath;
}

export async function appendLogEntry(
  config: AppConfig,
  kind: "ingest" | "query" | "lint" | "compact" | "init",
  title: string,
  details: string[],
): Promise<void> {
  const timestamp = new Date().toISOString();
  const month = timestamp.slice(0, 7);
  const filePath = path.join(config.logDir, `${month}.md`);
  const entry = [
    `## [${timestamp}] ${kind} | ${title}`,
    "",
    ...details.map((detail) => `- ${detail}`),
    "",
  ].join("\n");

  await appendText(filePath, entry);
  await refreshLogIndex(config);
}

export async function refreshLogIndex(config: AppConfig): Promise<void> {
  const logFiles = (await listFiles("*.md", config.logDir)).sort().reverse();
  const recentEntries: string[] = [];

  for (const filePath of logFiles) {
    const raw = await readText(filePath);
    const matches = raw.match(/^## \[[^\]]+\].*$/gm) ?? [];
    for (const match of matches) {
      recentEntries.push(match);
      if (recentEntries.length >= 20) {
        break;
      }
    }
    if (recentEntries.length >= 20) {
      break;
    }
  }

  const body = [
    "# Renvoo Wiki Log",
    "",
    "## Recent Entries",
    "",
    ...(recentEntries.length ? recentEntries : ["- No log entries yet."]),
    "",
    "## Monthly Logs",
    "",
    ...(logFiles.length
      ? logFiles.map((filePath) => {
          const rel = toPosix(path.relative(config.wikiDir, filePath)).replace(/\.md$/i, "");
          return `- [[wiki/${rel}]]`;
        })
      : ["- No monthly logs yet."]),
    "",
  ].join("\n");

  await writeText(path.join(config.wikiDir, "log.md"), body);
}

export async function appendContradictions(
  config: AppConfig,
  source: LoadedSource,
  alerts: ContradictionAlert[],
): Promise<void> {
  const filePath = path.join(config.wikiDir, "contradictions.md");
  const existing = (await fileExists(filePath)) ? await readText(filePath) : "# Renvoo Contradictions\n";
  const header = existing.includes("## Open Alerts")
    ? existing
    : `${existing.trim()}\n\n## Open Alerts\n\n`;

  const body =
    alerts.length === 0
      ? header
      : `${header.trim()}\n\n${alerts
          .map(
            (alert) =>
              `### ${alert.title}\n\n- Severity: ${alert.severity}\n- Source: ${source.title}\n- Detail: ${alert.description}\n${
                alert.relatedTitles.length
                  ? `- Related titles: ${alert.relatedTitles.join(", ")}`
                  : "- Related titles: none"
              }\n`,
          )
          .join("\n")}`;

  await writeText(filePath, `${body.trim()}\n`);
}

async function buildCategoryEntries(config: AppConfig, noteType: NoteType): Promise<
  Array<{
    path: string;
    title: string;
    summary: string;
    updatedAt: string;
  }>
> {
  const files = await listFiles("*.md", noteDirFor(config, noteType));
  const entries = [];

  for (const filePath of files) {
    const parsed = matter(await readText(filePath));
    entries.push({
      path: filePath,
      title: String(parsed.data.title ?? path.basename(filePath, ".md")),
      summary: String(parsed.data.summary ?? "").trim(),
      updatedAt: String(parsed.data.updated_at ?? ""),
    });
  }

  return entries.sort((left, right) => left.title.localeCompare(right.title));
}

async function writeCategoryIndexes(config: AppConfig, noteType: NoteType): Promise<void> {
  const entries = await buildCategoryEntries(config, noteType);
  const bucketMap = new Map<string, typeof entries>();

  for (const entry of entries) {
    const bucket = bucketForLabel(entry.title);
    bucketMap.set(bucket, [...(bucketMap.get(bucket) ?? []), entry]);
  }

  const bucketDir = path.join(config.indexDir, CATEGORY_DIRS[noteType]);
  await ensureDir(bucketDir);

  const bucketLinks: string[] = [];
  for (const [bucket, bucketEntries] of Array.from(bucketMap.entries()).sort(([left], [right]) =>
    left.localeCompare(right),
  )) {
    const bucketFilePath = path.join(config.indexDir, CATEGORY_DIRS[noteType], `${bucket}.md`);
    const bucketBody = [
      `# ${noteType[0].toUpperCase() + noteType.slice(1)} Index: ${bucket}`,
      "",
      ...bucketEntries.map((entry) => {
        const rel = toPosix(path.relative(config.vaultDir, entry.path)).replace(/\.md$/i, "");
        const suffix = entry.summary ? ` — ${entry.summary}` : "";
        return `- [[${rel}]]${suffix}`;
      }),
      "",
    ].join("\n");

    await writeText(bucketFilePath, bucketBody);
    bucketLinks.push(`- [[wiki/indexes/${CATEGORY_DIRS[noteType]}/${bucket}]] (${bucketEntries.length})`);
  }

  const categoryIndexPath = path.join(config.indexDir, `${CATEGORY_DIRS[noteType]}.md`);
  const body = [
    `# ${noteType[0].toUpperCase() + noteType.slice(1)} Index`,
    "",
    `Total notes: ${entries.length}`,
    "",
    ...bucketLinks,
    "",
  ].join("\n");

  await writeText(categoryIndexPath, body);
}

export async function rebuildIndexes(config: AppConfig): Promise<void> {
  await writeCategoryIndexes(config, "topic");
  await writeCategoryIndexes(config, "entity");
  await writeCategoryIndexes(config, "decision");
  await writeCategoryIndexes(config, "source");

  const topicCount = (await listFiles("*.md", path.join(config.wikiDir, "topics"))).length;
  const entityCount = (await listFiles("*.md", path.join(config.wikiDir, "entities"))).length;
  const decisionCount = (await listFiles("*.md", path.join(config.wikiDir, "decisions"))).length;
  const sourceCount = (await listFiles("*.md", path.join(config.wikiDir, "sources"))).length;

  const body = [
    "# Renvoo Wiki Index",
    "",
    "Karpathy-compatible root index for the Renvoo startup wiki.",
    "",
    "## System",
    "",
    "- [[system/profile]]",
    "- [[system/instructions]]",
    "- [[system/domains]]",
    "- [[system/fixes]]",
    "- [[system/upstream]]",
    "",
    "## Catalogs",
    "",
    `- [[wiki/indexes/topics]] (${topicCount})`,
    `- [[wiki/indexes/entities]] (${entityCount})`,
    `- [[wiki/indexes/decisions]] (${decisionCount})`,
    `- [[wiki/indexes/sources]] (${sourceCount})`,
    "",
    "## Operations",
    "",
    "- [[wiki/log]]",
    "- [[wiki/contradictions]]",
    "- [[wiki/maintenance/latest-lint]]",
    "",
  ].join("\n");

  await writeText(path.join(config.wikiDir, "index.md"), body);
}

function clampBulletSection(lines: string[], limit: number): string[] {
  const bullets = lines.filter((line) => line.trim().startsWith("- "));
  return bullets.slice(0, limit);
}

export async function compactOversizedNotes(config: AppConfig): Promise<string[]> {
  const files = await listFiles(
    ["topics/*.md", "entities/*.md", "decisions/*.md", "sources/*.md"],
    config.wikiDir,
  );
  const compacted: string[] = [];

  for (const filePath of files) {
    const raw = await readText(filePath);
    if (estimateTokens(raw) <= config.budgets.noteTokens * 1.5) {
      continue;
    }

    const parsed = matter(raw);
    const humanNotes = readHumanNotes(raw) || defaultHumanNotes();
    const lines = parsed.content.split("\n");
    const snapshotStart = lines.findIndex((line) => line.trim() === "## Snapshot");
    const evidenceStart = lines.findIndex((line) => line.trim() === "## Evidence");
    const claimsStart = lines.findIndex((line) => line.trim() === "## Claims");
    const sourcesStart = lines.findIndex((line) => line.trim() === "## Sources");
    const relatedStart = lines.findIndex((line) => line.trim() === "## Related");

    const snapshotLines =
      snapshotStart >= 0 && evidenceStart > snapshotStart
        ? lines.slice(snapshotStart + 2, evidenceStart).join("\n").trim().slice(0, 900)
        : String(parsed.data.summary ?? "").slice(0, 900);

    const evidenceLines =
      evidenceStart >= 0 && claimsStart > evidenceStart
        ? clampBulletSection(lines.slice(evidenceStart + 2, claimsStart), 8)
        : [];
    const claimLines =
      claimsStart >= 0 && sourcesStart > claimsStart
        ? clampBulletSection(lines.slice(claimsStart + 2, sourcesStart), 8)
        : [];
    const sourceLines =
      sourcesStart >= 0 && relatedStart > sourcesStart
        ? clampBulletSection(lines.slice(sourcesStart + 2, relatedStart), 10)
        : [];
    const relatedLines =
      relatedStart >= 0
        ? clampBulletSection(lines.slice(relatedStart + 2), 10)
        : [];

    const compactedBody = [
      `# ${String(parsed.data.title ?? path.basename(filePath, ".md"))}`,
      "",
      "## Snapshot",
      "",
      snapshotLines,
      "",
      "## Evidence",
      "",
      ...(evidenceLines.length ? evidenceLines : ["- No evidence snippets retained."]),
      "",
      "## Claims",
      "",
      ...(claimLines.length ? claimLines : ["- No claims retained."]),
      "",
      "## Sources",
      "",
      ...(sourceLines.length ? sourceLines : ["- No source links retained."]),
      "",
      "## Related",
      "",
      ...(relatedLines.length ? relatedLines : ["- No related links retained."]),
      "",
      HUMAN_NOTES_MARKER,
      "",
      humanNotes,
      "",
    ].join("\n");

    await writeText(filePath, matter.stringify(compactedBody, parsed.data));
    compacted.push(filePath);
  }

  return compacted;
}

export async function writeLintReport(config: AppConfig, lines: string[]): Promise<void> {
  const body = [
    "# Latest Lint Report",
    "",
    `Generated at: ${new Date().toISOString()}`,
    "",
    ...(lines.length ? lines : ["- No issues found."]),
    "",
  ].join("\n");

  await writeText(path.join(config.maintenanceDir, "latest-lint.md"), body);
}
