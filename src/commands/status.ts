import path from "node:path";
import matter from "gray-matter";

import { listFiles, readText } from "../lib/fs-utils.js";
import type { AppConfig } from "../lib/types.js";
import { ensureVaultStructure } from "../lib/wiki.js";

export async function runStatus(config: AppConfig): Promise<void> {
  await ensureVaultStructure(config);

  const categories = ["topics", "entities", "decisions", "sources"] as const;
  const counts = await Promise.all(
    categories.map(async (category) => ({
      category,
      count: (await listFiles("*.md", path.join(config.wikiDir, category))).length,
    })),
  );

  const allNotes = await listFiles(
    ["topics/*.md", "entities/*.md", "decisions/*.md", "sources/*.md"],
    config.wikiDir,
  );
  const largest = [];

  for (const filePath of allNotes) {
    const raw = await readText(filePath);
    const parsed = matter(raw);
    largest.push({
      path: filePath,
      title: String(parsed.data.title ?? path.basename(filePath, ".md")),
      size: raw.length,
    });
  }

  largest.sort((left, right) => right.size - left.size);

  const lines = [
    "Renvoo memory status",
    ...counts.map((item) => `- ${item.category}: ${item.count}`),
    `- OpenAI configured: ${config.openAi.apiKey ? "yes" : "no"}`,
    `- Pinecone configured: ${config.pinecone.apiKey && config.pinecone.indexName ? "yes" : "no"}`,
    "- Largest notes:",
    ...largest.slice(0, 5).map((item) => `  - ${item.title}: ${item.size} chars`),
  ];

  console.log(lines.join("\n"));
}
