import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import fg from "fast-glob";

const configDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(configDir, "..");
const distDir = resolve(projectRoot, "dist/site");

const rawSiteUrl = process.env.SITE_URL?.trim();
const siteUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, "") : "";
const robotsLines = ["User-agent: *", "Allow: /"];

const htmlFiles = fg.sync(["**/*.html"], {
  cwd: distDir,
  onlyFiles: true,
});

const sitemapPaths = htmlFiles
  .filter((file) => !file.endsWith("404.html"))
  .map((file) => {
    const normalized = file.replace(/\\/g, "/");
    return normalized === "index.html"
      ? "/"
      : normalized.endsWith("/index.html")
        ? `/${normalized.slice(0, -"index.html".length)}`
        : `/${normalized}`;
  });

if (siteUrl) {
  robotsLines.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
}

await writeFile(resolve(distDir, "robots.txt"), `${robotsLines.join("\n")}\n`, "utf8");

if (siteUrl) {
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...sitemapPaths.flatMap((pathname) => ["  <url>", `    <loc>${siteUrl}${pathname}</loc>`, "  </url>"]),
    "</urlset>",
    "",
  ].join("\n");

  await writeFile(resolve(distDir, "sitemap.xml"), sitemap, "utf8");
}

for (const htmlFile of htmlFiles) {
  const filePath = resolve(distDir, htmlFile);
  let html = await readFile(filePath, "utf8");
  const normalized = htmlFile.replace(/\\/g, "/");
  const pagePath =
    normalized === "index.html"
      ? "/"
      : normalized.endsWith("/index.html")
        ? `/${normalized.slice(0, -"index.html".length)}`
        : `/${normalized}`;
  const depth = normalized.split("/").length - 1;
  const socialImageRelative = `${depth ? "../".repeat(depth) : "./"}social-preview.png`;
  const canonicalUrl = siteUrl ? `${siteUrl}${pagePath}` : "";
  const socialImageUrl = siteUrl ? `${siteUrl}/social-preview.png` : socialImageRelative;

  if (siteUrl) {
    html = html
      .replaceAll("__CANONICAL_URL__", canonicalUrl)
      .replaceAll("__SOCIAL_IMAGE__", socialImageUrl);
  } else {
    html = html
      .replace(/^\s*<meta\s+property="og:url"\s+content="__CANONICAL_URL__"\s*\/>\n?/m, "")
      .replace(/^\s*<link\s+rel="canonical"\s+href="__CANONICAL_URL__"\s*\/>\n?/m, "")
      .replaceAll("__SOCIAL_IMAGE__", socialImageRelative);
  }

  await writeFile(filePath, html, "utf8");
}
