import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { renderAllPages } from "../src/site/lib/site-render.js";

const configDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(configDir, "..");
const siteRoot = resolve(projectRoot, "src/site");

const pages = renderAllPages();

for (const page of pages) {
  const outputPath = resolve(siteRoot, page.path);
  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, page.html, "utf8");
}
