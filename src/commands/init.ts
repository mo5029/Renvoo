import type { AppConfig } from "../lib/types.js";
import { appendLogEntry, ensureVaultStructure, rebuildIndexes, refreshLogIndex } from "../lib/wiki.js";

export async function runInit(config: AppConfig): Promise<void> {
  await ensureVaultStructure(config);
  await rebuildIndexes(config);
  await refreshLogIndex(config);
  await appendLogEntry(config, "init", "Initialized Renvoo memory vault", [
    "Created Karpathy-compatible raw/wiki/schema layout.",
    "Enabled sharded indexes and maintenance scaffolding.",
  ]);
}
