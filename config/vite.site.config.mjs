import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vite";

const configDir = dirname(fileURLToPath(import.meta.url));
const projectRoot = resolve(configDir, "..");

export default defineConfig({
  base: "./",
  root: resolve(projectRoot, "src/site"),
  publicDir: resolve(projectRoot, "src/site/public"),
  build: {
    emptyOutDir: true,
    outDir: resolve(projectRoot, "dist/site"),
    rollupOptions: {
      input: {
        main: resolve(projectRoot, "src/site/index.html"),
        notFound: resolve(projectRoot, "src/site/404.html"),
      },
    },
  },
});
