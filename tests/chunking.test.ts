import { describe, expect, it } from "vitest";

import { chunkText, estimateTokens } from "../src/lib/chunking.js";
import { bucketForLabel, toSlug } from "../src/lib/slug.js";

describe("chunkText", () => {
  it("splits long text into multiple chunks", () => {
    const text = Array.from({ length: 20 }, (_, index) => `Paragraph ${index + 1}. `.repeat(40)).join("\n\n");
    const chunks = chunkText(text, { maxChars: 500, overlapChars: 50 });
    expect(chunks.length).toBeGreaterThan(1);
  });
});

describe("helpers", () => {
  it("estimates tokens roughly", () => {
    expect(estimateTokens("abcd")).toBe(1);
    expect(estimateTokens("abcdefgh")).toBe(2);
  });

  it("creates stable buckets and slugs", () => {
    expect(toSlug("Renvoo Startup Plan")).toBe("renvoo-startup-plan");
    expect(bucketForLabel("Customer")).toBe("a-f");
    expect(bucketForLabel("Roadmap")).toBe("m-r");
  });
});
