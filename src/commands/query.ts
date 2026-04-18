import path from "node:path";

import { answerQuestion } from "../lib/openai.js";
import { searchArchive } from "../lib/pinecone.js";
import { searchWikiNotes } from "../lib/search.js";
import type { AppConfig } from "../lib/types.js";
import { toSlug } from "../lib/slug.js";
import { appendLogEntry, ensureVaultStructure } from "../lib/wiki.js";
import { writeText } from "../lib/fs-utils.js";

export async function runQuery(config: AppConfig, question: string): Promise<void> {
  await ensureVaultStructure(config);
  const localHits = await searchWikiNotes(config, question, 8);
  const archiveHits = await searchArchive(config, question, 6);
  const answer = await answerQuestion(config, question, localHits, archiveHits);
  const timestamp = new Date().toISOString();
  const filePath = path.join(
    config.queryDir,
    `${timestamp.slice(0, 10)}-${toSlug(question).slice(0, 48)}.md`,
  );

  const body = [
    `# Query: ${question}`,
    "",
    `Generated at: ${timestamp}`,
    "",
    "## Answer",
    "",
    answer.answer,
    "",
    "## Citations",
    "",
    ...(answer.citations.length ? answer.citations.map((item) => `- ${item}`) : ["- None"]),
    "",
    "## Follow-ups",
    "",
    ...(answer.followUps.length ? answer.followUps.map((item) => `- ${item}`) : ["- None"]),
    "",
  ].join("\n");

  await writeText(filePath, body);
  await appendLogEntry(config, "query", question, [
    `Saved query artifact: ${path.relative(config.vaultDir, filePath)}`,
    `Wiki hits: ${localHits.length}`,
    `Archive hits: ${archiveHits.length}`,
  ]);
}
