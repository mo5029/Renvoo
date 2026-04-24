import { generateBlogPost } from "../../src/lib/blog-generator.js";
import { publishFileToGitHub } from "../../src/lib/github-publish.js";

export async function GET(request) {
  const authHeader = request.headers.get("authorization");
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const hasGitHubPersistence = Boolean(
    process.env.GITHUB_TOKEN?.trim() && process.env.GITHUB_REPOSITORY?.trim(),
  );

  try {
    const result = await generateBlogPost({
      rootDir: process.cwd(),
      dryRun: !hasGitHubPersistence,
    });

    if (hasGitHubPersistence && result.fileContents && result.filePath) {
      await publishFileToGitHub({
        filePath: result.filePath.replace(`${process.cwd()}/`, "").replace(/\\/g, "/"),
        content: result.fileContents,
        message: `feat(blog): add ${result.draft.slug}`,
      });
    }

    return Response.json({
      success: true,
      persisted: hasGitHubPersistence,
      status: result.draft.status,
      slug: result.draft.slug,
      score: result.validation.score,
      note: hasGitHubPersistence
        ? "Blog post generated and published back to GitHub."
        : "Dry-run only because GitHub persistence is not configured.",
    });
  } catch (error) {
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}
