import matter from "gray-matter";

import { estimateTokens } from "../lib/chunking.js";
import { fileExists, listFiles, readText } from "../lib/fs-utils.js";
import type { AppConfig, LintFinding } from "../lib/types.js";
import { appendLogEntry, ensureVaultStructure, writeLintReport } from "../lib/wiki.js";

const WIKILINK_PATTERN = /\[\[([^\]]+)\]\]/g;

function normalizeLinkTarget(target: string): string {
  return target
    .trim()
    .replace(/^\.\//, "")
    .replace(/\.md$/i, "")
    .replace(/^\/+/, "");
}

export async function runLint(config: AppConfig): Promise<void> {
  await ensureVaultStructure(config);
  const files = await listFiles(
    [
      "wiki/topics/*.md",
      "wiki/entities/*.md",
      "wiki/decisions/*.md",
      "wiki/sources/*.md",
      "wiki/index.md",
      "wiki/contradictions.md",
      "wiki/log.md",
      "wiki/indexes/**/*.md",
      "wiki/maintenance/*.md",
      "wiki/logs/*.md",
      "system/*.md",
    ],
    config.vaultDir,
  );

  const findings: LintFinding[] = [];
  const targets = new Set(
    files.map((filePath) => filePath.replace(config.vaultDir + "/", "").replace(/\.md$/i, "").replace(/\\/g, "/")),
  );
  const inboundCounts = new Map<string, number>();

  for (const filePath of files) {
    const raw = await readText(filePath);
    const parsed = matter(raw);
    const rel = filePath.replace(config.vaultDir + "/", "").replace(/\.md$/i, "").replace(/\\/g, "/");
    const links = Array.from(raw.matchAll(WIKILINK_PATTERN)).map((match) => normalizeLinkTarget(match[1]));

    for (const link of links) {
      const resolved = link.startsWith("wiki/") || link.startsWith("system/") ? link : `wiki/${link}`;
      if (!targets.has(resolved) && !targets.has(link)) {
        findings.push({
          type: "broken-link",
          severity: "error",
          path: rel,
          message: `Broken wikilink: [[${link}]]`,
        });
      }

      const key = targets.has(link) ? link : resolved;
      inboundCounts.set(key, (inboundCounts.get(key) ?? 0) + 1);
    }

    if (estimateTokens(raw) > config.budgets.noteTokens * 1.5) {
      findings.push({
        type: "oversized",
        severity: "warn",
        path: rel,
        message: `Note exceeds compaction threshold at ~${estimateTokens(raw)} tokens.`,
      });
    }

    const reviewAfter = String(parsed.data.review_after ?? "");
    if (reviewAfter && new Date(reviewAfter).getTime() < Date.now()) {
      findings.push({
        type: "stale",
        severity: "warn",
        path: rel,
        message: `Review date passed on ${reviewAfter}.`,
      });
    }

    if (String(parsed.data.type ?? "") === "source") {
      const needsArchive = ["archive-first", "wiki-and-archive"].includes(
        String(parsed.data.storage_strategy ?? ""),
      );
      const syncedAt = String(parsed.data.archive_synced_at ?? "");
      if (needsArchive && !syncedAt) {
        findings.push({
          type: "archive-gap",
          severity: "warn",
          path: rel,
          message: "Source expects archive sync but no archive timestamp is recorded.",
        });
      }
    }
  }

  for (const filePath of files) {
    const rel = filePath.replace(config.vaultDir + "/", "").replace(/\.md$/i, "").replace(/\\/g, "/");
    const basename =
      rel.startsWith("wiki/index") ||
      rel === "wiki/log" ||
      rel === "wiki/contradictions" ||
      rel.startsWith("system/");
    if (!basename && (inboundCounts.get(rel) ?? 0) === 0) {
      findings.push({
        type: "orphan",
        severity: "info",
        path: rel,
        message: "Note has no inbound links.",
      });
    }
  }

  const reportLines = findings.map(
    (finding) => `- [${finding.severity.toUpperCase()}] ${finding.path} — ${finding.message}`,
  );
  await writeLintReport(config, reportLines);
  await appendLogEntry(config, "lint", "Linted Renvoo wiki", [
    `Findings: ${findings.length}`,
    `Errors: ${findings.filter((item) => item.severity === "error").length}`,
    `Warnings: ${findings.filter((item) => item.severity === "warn").length}`,
  ]);
}
