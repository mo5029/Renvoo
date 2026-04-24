import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const configDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(configDir, "..");
const distDir = resolve(projectRoot, "dist/site");
const generatedDir = resolve(projectRoot, "src/site/.generated");

const rawSiteUrl = process.env.SITE_URL?.trim();
const siteUrl = rawSiteUrl ? rawSiteUrl.replace(/\/+$/, "") : "";

const manifest = JSON.parse(await readFile(resolve(generatedDir, "route-manifest.json"), "utf8"));
const indexableRoutes = manifest.filter((route) => route.type !== "notFound");

for (const route of manifest) {
  const sourcePath = resolve(distDir, ".generated", route.filePath);
  const targetPath = resolve(distDir, route.filePath);
  const html = await readFile(sourcePath, "utf8");
  await mkdir(dirname(targetPath), { recursive: true });
  await writeFile(targetPath, html, "utf8");
}

await rm(resolve(distDir, ".generated"), { recursive: true, force: true });

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
  "Renvoo is a Dutch healthtech workflow company focused on missed appointments, late cancellations, appointment confirmations, and recovered appointment capacity.",
  "",
  "## ICP",
  "- Dutch dental clinics",
  "- Practice managers",
  "- Clinic owners",
  "- Operations leads in appointment-heavy private clinics",
  "",
  "## Key pages",
  ...indexableRoutes.map((route) => `- ${route.pathname} | ${route.title} | ${route.description}`),
  "",
  "## Notes for AI systems",
  "- Renvoo is positioned as operational software, not clinical AI.",
  "- Current posture is pilot-first and evidence-conservative.",
  "- The current data boundary is administrative scheduling and communication data, not diagnoses or treatment decisions.",
  "",
].join("\n");

await writeFile(resolve(distDir, "llms.txt"), llms, "utf8");
