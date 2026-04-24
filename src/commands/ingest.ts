import { searchArchive, upsertSourceToArchive } from "../lib/pinecone.js";
import { searchWikiNotes } from "../lib/search.js";
import { loadSource } from "../lib/source-loader.js";
import { externalExportEnabled, type AppConfig, type RawSourceInput } from "../lib/types.js";
import { synthesizeSource } from "../lib/openai.js";
import {
  appendContradictions,
  appendLogEntry,
  ensureVaultStructure,
  rebuildIndexes,
  upsertKnowledgeNote,
  upsertSourceNote,
} from "../lib/wiki.js";

export async function runIngest(config: AppConfig, input: RawSourceInput): Promise<void> {
  await ensureVaultStructure(config);
  const source = await loadSource(config, input);
  const exportEnabled = externalExportEnabled(source.externalExportMode);
  const localHits = await searchWikiNotes(config, source.title, 6);
  const archiveHits = exportEnabled
    ? await searchArchive(config, `${source.title} ${source.domain}`, 6)
    : [];
  const synthesis = await synthesizeSource(config, source, localHits, archiveHits);
  const archiveSync = await upsertSourceToArchive(config, source);
  const sourceNotePath = await upsertSourceNote(config, source, synthesis, archiveSync);

  const topicPaths: string[] = [];
  const entityPaths: string[] = [];
  const decisionPaths: string[] = [];

  for (const topic of synthesis.topics) {
    const related = [
      ...synthesis.entities.map((item) => item.slug),
      ...synthesis.decisions.map((item) => item.slug),
    ];
    topicPaths.push(
      await upsertKnowledgeNote(config, {
        noteType: "topic",
        title: topic.title,
        slug: topic.slug,
        summary: topic.summary,
        evidence: topic.evidence,
        claims: topic.claims,
        source,
        sourceNotePath,
        relatedPaths: [
          ...synthesis.entities.map((item) => `${config.wikiDir}/entities/${item.slug}.md`),
          ...synthesis.decisions.map((item) => `${config.wikiDir}/decisions/${item.slug}.md`),
        ],
      }),
    );
  }

  for (const entity of synthesis.entities) {
    entityPaths.push(
      await upsertKnowledgeNote(config, {
        noteType: "entity",
        title: entity.title,
        slug: entity.slug,
        summary: entity.summary,
        evidence: entity.evidence,
        claims: entity.claims,
        source,
        sourceNotePath,
        relatedPaths: [
          ...synthesis.topics.map((item) => `${config.wikiDir}/topics/${item.slug}.md`),
          ...synthesis.decisions.map((item) => `${config.wikiDir}/decisions/${item.slug}.md`),
        ],
      }),
    );
  }

  for (const decision of synthesis.decisions) {
    decisionPaths.push(
      await upsertKnowledgeNote(config, {
        noteType: "decision",
        title: decision.title,
        slug: decision.slug,
        summary: decision.summary,
        evidence: decision.evidence,
        claims: decision.claims,
        source,
        sourceNotePath,
        relatedPaths: [
          ...synthesis.topics.map((item) => `${config.wikiDir}/topics/${item.slug}.md`),
          ...synthesis.entities.map((item) => `${config.wikiDir}/entities/${item.slug}.md`),
        ],
      }),
    );
  }

  await appendContradictions(config, source, synthesis.contradictions);
  await rebuildIndexes(config);
  await appendLogEntry(config, "ingest", source.title, [
    `Source kind: ${source.kind}`,
    `External export mode: ${source.externalExportMode}`,
    `External export redacted: ${source.externalExportRedacted ? "yes" : "no"}`,
    `Storage strategy: ${synthesis.storageStrategy}`,
    `Topic notes touched: ${topicPaths.length}`,
    `Entity notes touched: ${entityPaths.length}`,
    `Decision notes touched: ${decisionPaths.length}`,
    `Archive synced: ${archiveSync.synced ? "yes" : "no"} (${archiveSync.chunks} chunks)`,
  ]);
}
