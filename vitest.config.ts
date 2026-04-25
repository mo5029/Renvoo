import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.{js,ts}"],
    exclude: ["dist/**", "node_modules/**"],
  },
});
