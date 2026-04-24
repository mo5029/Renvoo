import { Command, Option } from "commander";

import { runCompact } from "./commands/compact.js";
import { runIngest } from "./commands/ingest.js";
import { runInit } from "./commands/init.js";
import { runLint } from "./commands/lint.js";
import { runQuery } from "./commands/query.js";
import { runStatus } from "./commands/status.js";
import { loadConfig } from "./lib/config.js";
import {
  INGEST_EXTERNAL_EXPORT_MODE_ENV,
  resolveExternalExportMode,
  type RawSourceInput,
} from "./lib/types.js";

const program = new Command();
program.name("renvoo-memory").description("Karpathy-style memory system for Renvoo.");

program
  .command("init")
  .description("Initialize the Renvoo memory vault.")
  .action(async () => {
    await runInit(loadConfig());
  });

program
  .command("ingest")
  .description("Ingest a file, URL, or text into the memory system.")
  .option("--file <path>", "Path to a local file")
  .option("--url <url>", "URL to ingest")
  .option("--text <text>", "Inline text to ingest")
  .option("--title <title>", "Optional source title")
  .option("--domain <domain>", "Domain label", "renvoo-startup")
  .option("--tags <tags>", "Comma separated tags", "")
  .addOption(
    new Option(
      "--external-export-mode <mode>",
      "Off-box export mode for ingest: blocked, redacted, or raw",
    )
      .choices(["blocked", "redacted", "raw"])
      .default("blocked"),
  )
  .action(async (options) => {
    const inputKinds = [options.file, options.url, options.text].filter(Boolean);
    if (inputKinds.length !== 1) {
      throw new Error("Provide exactly one of --file, --url, or --text.");
    }

    const externalExportMode = resolveExternalExportMode(options.externalExportMode, "blocked");

    const input: RawSourceInput = {
      kind: options.file ? "file" : options.url ? "url" : "text",
      filePath: options.file,
      url: options.url,
      text: options.text,
      title: options.title,
      domain: options.domain,
      externalExportMode,
      tags: String(options.tags)
        .split(",")
        .map((tag: string) => tag.trim())
        .filter(Boolean),
    };

    process.env[INGEST_EXTERNAL_EXPORT_MODE_ENV] = externalExportMode;

    try {
      await runIngest(loadConfig(), input);
    } finally {
      delete process.env[INGEST_EXTERNAL_EXPORT_MODE_ENV];
    }
  });

program
  .command("query")
  .description("Query the memory system.")
  .requiredOption("--question <question>", "Question to ask")
  .action(async (options) => {
    await runQuery(loadConfig(), options.question);
  });

program
  .command("lint")
  .description("Run maintenance checks on the vault.")
  .action(async () => {
    await runLint(loadConfig());
  });

program
  .command("compact")
  .description("Compact oversized notes and rebuild indexes.")
  .action(async () => {
    await runCompact(loadConfig());
  });

program
  .command("status")
  .description("Show high-level memory system status.")
  .action(async () => {
    await runStatus(loadConfig());
  });

program.parseAsync().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
