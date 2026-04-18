import path from "node:path";
import process from "node:process";
import dotenv from "dotenv";
import { z } from "zod";

import type { AppConfig } from "./types.js";

dotenv.config();

const envSchema = z.object({
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-5-mini"),
  OPENAI_REASONING_EFFORT: z
    .enum(["none", "minimal", "low", "medium", "high"])
    .default("minimal"),
  PINECONE_API_KEY: z.string().optional(),
  PINECONE_INDEX_NAME: z.string().optional(),
  PINECONE_NAMESPACE: z.string().default("renvoo-memory"),
  PINECONE_CLOUD: z.string().default("aws"),
  PINECONE_REGION: z.string().default("us-east-1"),
  PINECONE_EMBED_MODEL: z.string().default("llama-text-embed-v2"),
  MEMORY_NOTE_TOKEN_BUDGET: z.coerce.number().default(2400),
  MEMORY_CONTEXT_TOKEN_BUDGET: z.coerce.number().default(12000),
});

export function loadConfig(rootDir = process.cwd()): AppConfig {
  const env = envSchema.parse(process.env);
  const vaultDir = path.join(rootDir, "memory");

  return {
    rootDir,
    vendorDir: path.join(rootDir, "vendor"),
    vaultDir,
    rawDir: path.join(vaultDir, "raw"),
    assetsDir: path.join(vaultDir, "assets"),
    archiveDir: path.join(vaultDir, "archive"),
    archiveCacheDir: path.join(vaultDir, "archive", "cache"),
    systemDir: path.join(vaultDir, "system"),
    wikiDir: path.join(vaultDir, "wiki"),
    maintenanceDir: path.join(vaultDir, "wiki", "maintenance"),
    queryDir: path.join(vaultDir, "wiki", "queries"),
    indexDir: path.join(vaultDir, "wiki", "indexes"),
    logDir: path.join(vaultDir, "wiki", "logs"),
    stateDir: path.join(vaultDir, "state"),
    openAi: {
      apiKey: env.OPENAI_API_KEY,
      model: env.OPENAI_MODEL,
      reasoningEffort: env.OPENAI_REASONING_EFFORT,
    },
    pinecone: {
      apiKey: env.PINECONE_API_KEY,
      indexName: env.PINECONE_INDEX_NAME,
      namespace: env.PINECONE_NAMESPACE,
      cloud: env.PINECONE_CLOUD,
      region: env.PINECONE_REGION,
      embedModel: env.PINECONE_EMBED_MODEL,
    },
    budgets: {
      noteTokens: env.MEMORY_NOTE_TOKEN_BUDGET,
      contextTokens: env.MEMORY_CONTEXT_TOKEN_BUDGET,
    },
  };
}
