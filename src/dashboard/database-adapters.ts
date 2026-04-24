import fs from "node:fs/promises";
import path from "node:path";
import fg from "fast-glob";

export interface CsvDatasetSummary {
  file: string;
  name: string;
  rows: number;
  columns: string[];
  statusCounts: Record<string, number>;
  nextActionCount: number;
  sample: Record<string, string>[];
}

export interface LegalDocumentSummary {
  file: string;
  section: string;
  title: string;
  updatedHint?: string;
}

export interface MemorySummary {
  counts: Record<string, number>;
  recentLogEntries: string[];
  contradictions: string[];
  maintenance: string[];
}

function toPosix(filePath: string): string {
  return filePath.split(path.sep).join("/");
}

export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];
    if (char === '"' && quoted && next === '"') {
      value += '"';
      index += 1;
      continue;
    }
    if (char === '"') {
      quoted = !quoted;
      continue;
    }
    if (char === "," && !quoted) {
      row.push(value);
      value = "";
      continue;
    }
    if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") index += 1;
      row.push(value);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      value = "";
      continue;
    }
    value += char;
  }

  row.push(value);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

function rowsToObjects(rows: string[][]): Record<string, string>[] {
  const headers = rows[0]?.map((item) => item.trim()) ?? [];
  return rows.slice(1).map((row) =>
    Object.fromEntries(headers.map((header, index) => [header, row[index]?.trim() ?? ""])),
  );
}

function countBy(rows: Record<string, string>[], columns: string[]): Record<string, number> {
  const column = columns.find((candidate) => rows.some((row) => row[candidate]));
  if (!column) return {};
  return rows.reduce<Record<string, number>>((counts, row) => {
    const value = row[column] || "blank";
    counts[value] = (counts[value] ?? 0) + 1;
    return counts;
  }, {});
}

export async function getOutreachDatabases(rootDir: string): Promise<CsvDatasetSummary[]> {
  const files = await fg("docs/outreach/*.{csv,json}", { cwd: rootDir, absolute: true, onlyFiles: true });
  const datasets: CsvDatasetSummary[] = [];

  for (const filePath of files.sort()) {
    const relative = toPosix(path.relative(rootDir, filePath));
    if (filePath.endsWith(".json")) {
      const parsed = JSON.parse(await fs.readFile(filePath, "utf8")) as Record<string, unknown>;
      datasets.push({
        file: relative,
        name: path.basename(filePath),
        rows: Number(parsed.candidate_count ?? parsed.qualified_additions ?? Object.keys(parsed).length),
        columns: Object.keys(parsed),
        statusCounts: {},
        nextActionCount: 0,
        sample: [Object.fromEntries(Object.entries(parsed).slice(0, 8).map(([key, value]) => [key, String(value)]))],
      });
      continue;
    }

    const rows = rowsToObjects(parseCsv(await fs.readFile(filePath, "utf8")));
    const columns = Object.keys(rows[0] ?? {});
    datasets.push({
      file: relative,
      name: path.basename(filePath),
      rows: rows.length,
      columns,
      statusCounts: countBy(rows, ["status", "meeting_status", "decision", "next_action"]),
      nextActionCount: rows.filter((row) => row.next_action_date || row.follow_up_date || row.next_action).length,
      sample: rows.slice(0, 5),
    });
  }

  return datasets;
}

function titleFromMarkdown(markdown: string, fallback: string): string {
  const heading = markdown.match(/^#\s+(.+)$/m)?.[1]?.trim();
  return heading || fallback;
}

export async function getLegalDatabases(rootDir: string): Promise<LegalDocumentSummary[]> {
  const files = await fg("docs/legal/**/*.md", { cwd: rootDir, absolute: true, onlyFiles: true });
  return Promise.all(
    files.sort().map(async (filePath) => {
      const relative = toPosix(path.relative(rootDir, filePath));
      const markdown = await fs.readFile(filePath, "utf8");
      const parts = relative.split("/");
      return {
        file: relative,
        section: parts[2] ?? "legal",
        title: titleFromMarkdown(markdown, path.basename(filePath, ".md")),
        updatedHint: markdown.match(/\b20\d{2}-\d{2}-\d{2}\b/)?.[0],
      };
    }),
  );
}

async function safeReadLines(filePath: string): Promise<string[]> {
  try {
    return (await fs.readFile(filePath, "utf8")).split("\n");
  } catch {
    return [];
  }
}

export async function getMemoryDatabases(rootDir: string): Promise<MemorySummary> {
  const countPatterns = {
    topics: "memory/wiki/topics/*.md",
    entities: "memory/wiki/entities/*.md",
    decisions: "memory/wiki/decisions/*.md",
    sources: "memory/wiki/sources/*.md",
    queries: "memory/wiki/queries/*.md",
  };
  const counts: Record<string, number> = {};
  for (const [key, pattern] of Object.entries(countPatterns)) {
    counts[key] = (await fg(pattern, { cwd: rootDir, onlyFiles: true })).length;
  }

  const logLines = await safeReadLines(path.join(rootDir, "memory", "wiki", "log.md"));
  const contradictionLines = await safeReadLines(path.join(rootDir, "memory", "wiki", "contradictions.md"));
  const maintenanceLines = await safeReadLines(path.join(rootDir, "memory", "wiki", "maintenance", "latest-lint.md"));

  return {
    counts,
    recentLogEntries: logLines.filter((line) => line.startsWith("## [")).slice(0, 10),
    contradictions: contradictionLines.filter((line) => line.startsWith("### ") || line.startsWith("- Severity")).slice(0, 12),
    maintenance: maintenanceLines.filter((line) => line.startsWith("- ")).slice(0, 12),
  };
}
