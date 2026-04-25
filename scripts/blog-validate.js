import "dotenv/config";

import { loadBlogPosts, validateBlogPost } from "../src/lib/blog-content.js";

const posts = await loadBlogPosts(process.cwd()).catch(() => []);

if (!posts.length) {
  console.log("No blog posts found.");
  process.exit(0);
}

let hasErrors = false;

for (const post of posts) {
  const result = validateBlogPost(post, posts);
  const failed = result.checks.filter((check) => !check.ok);
  console.log(`${post.slug} [${post.status}] -> score ${result.score}`);

  if (failed.length) {
    hasErrors = true;
    for (const check of failed) {
      console.log(`  - FAIL ${check.label}: ${check.detail}`);
    }
  } else {
    console.log("  - all checks passed");
  }
}

if (hasErrors) {
  process.exitCode = 1;
}
