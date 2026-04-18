import matter from "gray-matter";

import { listFiles, readText } from "./fs-utils.js";
import { toSlug } from "./slug.js";
import type { AppConfig, SearchHit } from "./types.js";

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function scoreText(queryTokens: string[], candidate: string): number {
  const haystack = candidate.toLowerCase();
  return queryTokens.reduce((score, token) => {
    if (haystack.includes(token)) {
      return score + 1;
    }

    return score;
  }, 0);
}

export async function searchWikiNotes(
  config: AppConfig,
  query: string,
  limit = 8,
): Promise<SearchHit[]> {
  const noteFiles = await listFiles(
    [
      "topics/**/*.md",
      "entities/**/*.md",
      "decisions/**/*.md",
      "sources/**/*.md",
    ],
    config.wikiDir,
  );

  const queryTokens = tokenize(query);
  const hits: SearchHit[] = [];

  for (const filePath of noteFiles) {
    const raw = await readText(filePath);
    const parsed = matter(raw);
    const title = String(parsed.data.title ?? toSlug(filePath));
    const summary = String(parsed.data.summary ?? "").trim();
    const body = parsed.content.trim();
    const score =
      scoreText(queryTokens, title) * 3 +
      scoreText(queryTokens, summary) * 2 +
      scoreText(queryTokens, body);

    if (score <= 0) {
      continue;
    }

    hits.push({
      path: filePath,
      title,
      type: String(parsed.data.type ?? "note"),
      summary,
      score,
      excerpt: body.slice(0, 360).replace(/\s+/g, " ").trim(),
    });
  }

  return hits.sort((left, right) => right.score - left.score).slice(0, limit);
}
