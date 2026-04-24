import "dotenv/config";

import { generateBlogPost } from "../src/lib/blog-generator.js";
import { publishFileToGitHub } from "../src/lib/github-publish.js";

const persistDestination = process.env.BLOG_PERSIST_DESTINATION?.trim() || "filesystem";

try {
  const result = await generateBlogPost({
    rootDir: process.cwd(),
  });

  if (persistDestination === "github" && result.fileContents && result.filePath) {
    await publishFileToGitHub({
      filePath: result.filePath.replace(`${process.cwd()}/`, "").replace(/\\/g, "/"),
      content: result.fileContents,
      message: `feat(blog): add ${result.draft.slug}`,
    });
  }

  console.log(
    JSON.stringify(
      {
        status: result.draft.status,
        slug: result.draft.slug,
        score: result.validation.score,
        filePath: result.filePath ?? null,
        persisted: result.persisted,
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
