import fs from "node:fs/promises";
import path from "node:path";

import "dotenv/config";

import { generateBlogPost } from "../src/lib/blog-generator.js";
import { publishFileToGitHub } from "../src/lib/github-publish.js";

const args = new Set(process.argv.slice(2));
const dryRun = args.has("--dry-run");
const forceFallback = args.has("--fallback");
const localeArg = process.argv.find((item) => item.startsWith("--locale="));
const locale = localeArg?.split("=")[1] || undefined;
const persistDestination = process.env.BLOG_PERSIST_DESTINATION?.trim() || "filesystem";

try {
  const result = await generateBlogPost({
    rootDir: process.cwd(),
    dryRun,
    forceFallback,
    locale,
  });

  const logDir = path.join(process.cwd(), "tmp/blog");
  await fs.mkdir(logDir, { recursive: true });
  await fs.writeFile(
    path.join(logDir, "latest-run.json"),
    JSON.stringify(
      {
        topic: result.topic,
        duplicates: result.duplicates.map((item) => ({
          title: item.post.title,
          slug: item.post.slug,
          similarity: item.similarity,
        })),
        validation: {
          score: result.validation.score,
          ok: result.validation.ok,
          checks: result.validation.checks,
          compliance: result.validation.compliance,
        },
        draft: {
          title: result.draft.title,
          slug: result.draft.slug,
          status: result.draft.status,
          locale: result.draft.locale,
          primaryKeyword: result.draft.primaryKeyword,
        },
        filePath: result.filePath ?? null,
        researchErrors: result.research.errors,
      },
      null,
      2,
    ),
    "utf8",
  );

  if (!dryRun && persistDestination === "github" && result.fileContents && result.filePath) {
    const relativeFilePath = path.relative(process.cwd(), result.filePath).replace(/\\/g, "/");
    await publishFileToGitHub({
      filePath: relativeFilePath,
      content: result.fileContents,
      message: `feat(blog): add ${result.draft.slug}`,
    });
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        persisted: result.persisted,
        filePath: result.filePath ?? null,
        score: result.validation.score,
        status: result.draft.status,
        slug: result.draft.slug,
      },
      null,
      2,
    ),
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
}
