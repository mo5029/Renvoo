import type { AppConfig } from "../lib/types.js";
import { appendLogEntry, compactOversizedNotes, ensureVaultStructure, rebuildIndexes, refreshLogIndex } from "../lib/wiki.js";

export async function runCompact(config: AppConfig): Promise<void> {
  await ensureVaultStructure(config);
  const compacted = await compactOversizedNotes(config);
  await rebuildIndexes(config);
  await refreshLogIndex(config);
  await appendLogEntry(config, "compact", "Compacted Renvoo wiki", [
    `Compacted notes: ${compacted.length}`,
    ...(compacted.length ? compacted.slice(0, 10).map((filePath) => `Compacted ${filePath}`) : []),
  ]);
}
