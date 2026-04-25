import { mkdir, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import "dotenv/config";

import { loadBlogPosts } from "../src/lib/blog-content.js";
import { renderAllPages } from "../src/site/lib/site-render.js";

const configDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(configDir, "..");
const siteRoot = resolve(projectRoot, "src/site");
const generatedDir = resolve(siteRoot, ".generated");
const siteUrl = process.env.SITE_URL?.trim() || "";
const contactEmail = process.env.SITE_CONTACT_EMAIL?.trim() || "";

await rm(generatedDir, { recursive: true, force: true });
await rm(resolve(siteRoot, "blog"), { recursive: true, force: true });
await rm(resolve(siteRoot, "en/blog"), { recursive: true, force: true });
await mkdir(generatedDir, { recursive: true });

const posts = await loadBlogPosts(projectRoot).catch(() => []);
const { pages, routeManifest } = renderAllPages({ siteUrl, contactEmail, posts });

for (const page of pages) {
  const outputPath = resolve(siteRoot, page.path);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, page.html, "utf8");
}

await writeFile(
  resolve(generatedDir, "route-manifest.json"),
  JSON.stringify(routeManifest, null, 2),
  "utf8",
);

console.log(`Generated ${pages.length} site pages into ${siteRoot}`);
