import { describe, expect, it } from "vitest";

import { getSuggestedInternalLinks, loadBlogPosts, validateBlogPost } from "../src/lib/blog-content.js";
import { renderAllPages } from "../src/site/lib/site-render.js";

function createSyntheticPost(overrides: Record<string, unknown> = {}) {
  return {
    filePath: "",
    slug: "synthetic-post",
    title: "No-show software voor tandartspraktijken in Nederland",
    date: "2026-04-24T00:00:00.000Z",
    updated: "2026-04-24T00:00:00.000Z",
    excerpt: "Praktische uitleg voor praktijkhouders over no-show software voor tandartspraktijken.",
    metaTitle: "No-show software voor tandartspraktijken in Nederland",
    metaDescription:
      "Praktische, eerlijke uitleg over no-show software voor tandartspraktijken, bevestigingen, uitval en herstel van lege stoeluren.",
    primaryKeyword: "no-show software voor tandartspraktijken",
    secondaryKeywords: [
      "tandartspraktijk no-show verminderen",
      "lege stoeluren tandarts",
      "afspraakbevestiging tandartspraktijk",
    ],
    category: "dental-clinics",
    status: "draft" as const,
    locale: "nl" as const,
    searchIntent: "commercial",
    answer: "Renvoo helpt praktijken no-shows eerder signaleren en rustiger opvangen.",
    sources: [{ title: "KNMT", url: "https://example.com/source" }],
    faq: [{ question: "Wat is dit?", answer: "Een korte uitleg voor praktijkoperators." }],
    schema: { article: true },
    content: [
      "## Direct antwoord",
      "Renvoo helpt praktijken no-shows eerder signaleren en rustiger opvangen.",
      "",
      "## No-show software voor tandartspraktijken",
      "Deze uitleg laat zien hoe een tandartspraktijk no-show verminderen kan combineren met afspraakbevestiging tandartspraktijk en minder lege stoeluren tandarts.",
      "",
      "## Praktisch voorbeeld",
      "Het team gebruikt een operationele workflow in plaats van losse herinneringen.",
      "",
      "[Bekijk no-show reduction](/no-show-reduction/)",
      "[Plan een kort gesprek](/contact/)",
    ].join("\n"),
    plainText: [
      "Renvoo helpt praktijken no-shows eerder signaleren en rustiger opvangen.",
      "Deze uitleg laat zien hoe een tandartspraktijk no-show verminderen kan combineren met afspraakbevestiging tandartspraktijk en minder lege stoeluren tandarts.",
      "Het team gebruikt een operationele workflow in plaats van losse herinneringen.",
    ].join(" "),
    headings: [
      { depth: 2, text: "Direct antwoord" },
      { depth: 2, text: "No-show software voor tandartspraktijken" },
      { depth: 2, text: "Praktisch voorbeeld" },
    ],
    contentHtml: "",
    ...overrides,
  };
}

describe("blog system", () => {
  it("loads published blog posts and validates them", async () => {
    const posts = await loadBlogPosts(process.cwd());
    expect(posts.length).toBeGreaterThanOrEqual(3);

    for (const post of posts) {
      const validation = validateBlogPost(post, posts);
      expect(validation.ok).toBe(true);
      expect(validation.score).toBeGreaterThanOrEqual(80);
    }
  });

  it("suggests at least two internal links for each published post", async () => {
    const posts = await loadBlogPosts(process.cwd());

    for (const post of posts) {
      const links = getSuggestedInternalLinks(post);
      expect(links.length).toBeGreaterThanOrEqual(2);
    }
  });

  it("renders blog routes into the generated site manifest", async () => {
    const posts = await loadBlogPosts(process.cwd());
    const { routeManifest } = renderAllPages({ posts });
    const blogRoutes = routeManifest.filter((route) => route.type === "article");

    expect(blogRoutes.length).toBeGreaterThanOrEqual(3);
    expect(blogRoutes.some((route) => route.pathname === "/blog/no-show-software-voor-tandartspraktijken/")).toBe(true);
    expect(blogRoutes.some((route) => route.pathname === "/en/blog/dental-clinic-no-show-software/")).toBe(true);
  });

  it("rejects prohibited manipulative or exaggerated claims", () => {
    const post = createSyntheticPost({
      title: "Guaranteed no-show software voor tandartspraktijken",
      plainText:
        "Deze oplossing garandeert resultaten en werkt altijd. Act now om geen omzet meer te missen.",
      content: "## Direct antwoord\nDeze oplossing garandeert resultaten en werkt altijd. Act now.",
    });
    const result = validateBlogPost(post, []);

    expect(result.ok).toBe(false);
    expect(result.compliance.ok).toBe(false);
    expect(result.checks.some((check) => check.label === "contentCompliance" && !check.ok)).toBe(true);
  });

  it("rejects images and restricted media references", () => {
    const post = createSyntheticPost({
      content:
        "## Direct antwoord\n![Woman in clinic](/images/woman.jpg)\nThis article compares software after a night at the bar.",
      plainText: "Woman in clinic and bar comparison text.",
    });
    const result = validateBlogPost(post, []);

    expect(result.ok).toBe(false);
    expect(result.compliance.ok).toBe(false);
    expect(result.compliance.violations.length).toBeGreaterThan(0);
  });
});
