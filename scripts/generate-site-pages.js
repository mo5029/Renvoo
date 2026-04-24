import fs from "node:fs/promises";
import path from "node:path";

import "dotenv/config";

import { loadBlogPosts } from "../src/lib/blog-content.js";
import { renderAllPages } from "../src/site/lib/site-render.js";

const rootDir = process.cwd();
const generatedDir = path.join(rootDir, "src/site/.generated");
const siteUrl = process.env.SITE_URL?.trim() || "";
const contactEmail = process.env.SITE_CONTACT_EMAIL?.trim() || "";

await fs.rm(generatedDir, { recursive: true, force: true });
await fs.mkdir(generatedDir, { recursive: true });

const posts = await loadBlogPosts(rootDir).catch(() => []);
const { pages, routeManifest } = renderAllPages({ siteUrl, contactEmail, posts });

for (const page of pages) {
  const outputPath = path.join(generatedDir, page.path);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, page.html, "utf8");
}

await fs.writeFile(
  path.join(generatedDir, "route-manifest.json"),
  JSON.stringify(routeManifest, null, 2),
  "utf8",
);

console.log(`Generated ${pages.length} site pages into ${generatedDir}`);
