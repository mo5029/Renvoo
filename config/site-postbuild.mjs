import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(configDir, "..");
const distDir = resolve(projectRoot, "dist/site");

const rawSiteUrl = process.env.SITE_URL?.trim();
const siteUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, "") : "";
const socialImageUrl = siteUrl ? `${siteUrl}/social-preview.png` : "./social-preview.png";

const robotsLines = ["User-agent: *", "Allow: /"];

if (siteUrl) {
  robotsLines.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
}

await writeFile(resolve(distDir, "robots.txt"), `${robotsLines.join("\n")}\n`, "utf8");

if (siteUrl) {
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "  <url>",
    `    <loc>${siteUrl}/</loc>`,
    "  </url>",
    "</urlset>",
    "",
  ].join("\n");

  await writeFile(resolve(distDir, "sitemap.xml"), sitemap, "utf8");
}

for (const htmlFile of ["index.html", "404.html"]) {
  const filePath = resolve(distDir, htmlFile);
  let html = await readFile(filePath, "utf8");

  if (siteUrl) {
    html = html
      .replaceAll("__SITE_URL__", siteUrl)
      .replaceAll("__SOCIAL_IMAGE__", socialImageUrl);
  } else {
    html = html
      .replace(/^\s*<meta\s+property="og:url"\s+content="__SITE_URL__\/"\s*\/>\n?/m, "")
      .replace(/^\s*<link\s+rel="canonical"\s+href="__SITE_URL__\/"\s*\/>\n?/m, "")
      .replaceAll("__SOCIAL_IMAGE__", "./social-preview.png");
  }

  await writeFile(filePath, html, "utf8");
}
