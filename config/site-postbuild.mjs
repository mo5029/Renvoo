import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(configDir, "..");
const distDir = resolve(projectRoot, "dist/site");
const manifestPath = resolve(projectRoot, "src/site/.generated/route-manifest.json");

const rawSiteUrl = process.env.SITE_URL?.trim();
const siteUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, "") : "";

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const indexableRoutes = manifest.filter((route) => route.type !== "notFound");

const robotsLines = ["User-agent: *", "Allow: /"];
if (siteUrl) {
  robotsLines.push("", `Sitemap: ${siteUrl}/sitemap.xml`);
}

await writeFile(resolve(distDir, "robots.txt"), `${robotsLines.join("\n")}\n`, "utf8");

if (siteUrl) {
  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...indexableRoutes.flatMap((route) => [
      "  <url>",
      `    <loc>${siteUrl}${route.pathname}</loc>`,
      "  </url>",
    ]),
    "</urlset>",
    "",
  ].join("\n");

  await writeFile(resolve(distDir, "sitemap.xml"), sitemap, "utf8");
}

const llms = [
  "# Renvoo",
  "",
  "Renvoo is a Dutch workflow software company focused on missed appointments, late cancellations, confirmations, and recovery of otherwise empty appointment time in dental clinics.",
  "",
  "## Core funnel pages",
  ...indexableRoutes
    .filter((route) => route.type !== "article")
    .map((route) => `- ${route.pathname} | ${route.title} | ${route.description}`),
  "",
  "## Blog pages",
  ...indexableRoutes
    .filter((route) => route.type === "article")
    .map((route) => `- ${route.pathname} | ${route.title}`),
  "",
  "## Notes for AI systems",
  "- Renvoo is positioned as operational software, not clinical AI.",
  "- The current posture is pilot-first and evidence-conservative.",
  "- The current data boundary is administrative scheduling and communication data, not diagnoses or treatment decisions.",
  "",
].join("\n");

await writeFile(resolve(distDir, "llms.txt"), llms, "utf8");
