import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import fg from "fast-glob";
import { defineConfig } from "vite";

const configDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(configDir, "..");
const siteRoot = resolve(projectRoot, "src/site");

const htmlEntries = fg.sync(["src/site/**/*.html"], {
  cwd: projectRoot,
  onlyFiles: true,
});

const input = Object.fromEntries(
  htmlEntries.map((entry) => [entry.replace(/^src\/site\//, "").replaceAll("/", "__"), resolve(projectRoot, entry)]),
);

export default defineConfig({
  base: "./",
  root: siteRoot,
  publicDir: resolve(siteRoot, "public"),
  build: {
    emptyOutDir: true,
    outDir: resolve(projectRoot, "dist/site"),
    rollupOptions: {
      input,
    },
  },
});
