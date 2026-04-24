import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import fg from "fast-glob";
import { defineConfig } from "vite";

const configDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(configDir, "..");
const generatedRoot = resolve(projectRoot, "src/site/.generated");

function buildHtmlInputs() {
  const files = fg.sync(["**/*.html"], {
    cwd: generatedRoot,
    absolute: true,
  });

  return Object.fromEntries(
    files.map((filePath) => {
      const relativePath = filePath.slice(generatedRoot.length + 1).replace(/\\/g, "/");
      const key = relativePath.replace(/\/index\.html$/, "/index").replace(/\.html$/, "");
      return [key, filePath];
    }),
  );
}

export default defineConfig({
  base: "/",
  root: resolve(projectRoot, "src/site"),
  publicDir: resolve(projectRoot, "src/site/public"),
  build: {
    emptyOutDir: true,
    outDir: resolve(projectRoot, "dist/site"),
    rollupOptions: {
      input: buildHtmlInputs(),
    },
  },
});
