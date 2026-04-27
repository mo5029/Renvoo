import fs from "node:fs/promises";
import path from "node:path";

import "dotenv/config";
import { load as loadHtml } from "cheerio";
import slugify from "slugify";

import {
  BLOG_STATUS,
  DEFAULT_BLOG_DIR,
  createBlogFrontmatter,
  findDuplicatePosts,
  loadBlogPosts,
  validateBlogPost,
} from "./blog-content.js";
import { BLOG_COMPLIANCE_FILES, BLOG_COMPLIANCE_SUMMARY } from "./blog-compliance.js";
import { extractMarkdownHeadings, stripMarkdown } from "./blog-markdown.js";

const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-5-mini";
const DEFAULT_REASONING_EFFORT = process.env.OPENAI_REASONING_EFFORT?.trim() || "minimal";

const TOPIC_SEEDS = [
  {
    locale: "nl",
    category: "dental-clinics",
    primaryKeyword: "no-show software voor tandartspraktijken",
    secondaryKeywords: [
      "tandartspraktijk no-show verminderen",
      "lege stoeluren tandarts",
      "afspraakbevestiging tandartspraktijk",
      "workflow automatisering tandarts",
    ],
    searchIntent: "commercial",
    titleHint: "Hoe tandartspraktijken no-shows eerder kunnen opvangen zonder extra baliestress",
    tags: ["dental", "no-show", "operations"],
  },
  {
    locale: "nl",
    category: "no-show-reduction",
    primaryKeyword: "no-show reductie software",
    secondaryKeywords: [
      "gemiste afspraken verminderen",
      "zorg no-show preventie",
      "afspraakuitval verminderen",
      "no-show workflow",
    ],
    searchIntent: "commercial",
    titleHint: "Wat no-show reductie software echt moet doen in een afspraak-intensieve praktijk",
    tags: ["no-show", "operations"],
  },
  {
    locale: "nl",
    category: "appointment-reminders",
    primaryKeyword: "afspraak reminder automatisering",
    secondaryKeywords: [
      "patiënt afspraak bevestiging",
      "reminders tandartspraktijk",
      "zorg afspraak automatisering",
      "no-show reminder workflow",
    ],
    searchIntent: "commercial",
    titleHint: "Waarom afspraakreminders alleen het no-show probleem niet oplossen",
    tags: ["reminders", "confirmation", "dental"],
  },
  {
    locale: "nl",
    category: "cancellation-management",
    primaryKeyword: "cancellation management voor klinieken",
    secondaryKeywords: [
      "late afzegging zorg",
      "afspraak verplaatsen kliniek",
      "backfill wachtlijst automatisering",
      "lege stoeluren terugvullen",
    ],
    searchIntent: "commercial",
    titleHint: "Late afzeggingen slimmer opvangen in een Nederlandse praktijkagenda",
    tags: ["cancellations", "backfill", "operations"],
  },
  {
    locale: "en",
    category: "dental-clinics",
    primaryKeyword: "dental clinic no-show software",
    secondaryKeywords: [
      "reduce missed appointments",
      "dental scheduling automation",
      "appointment confirmation workflow",
      "dental practice operations software",
    ],
    searchIntent: "commercial",
    titleHint: "What dental clinic no-show software should actually improve",
    tags: ["dental", "no-show", "operations"],
  },
  {
    locale: "en",
    category: "private-clinics",
    primaryKeyword: "private clinic automation netherlands",
    secondaryKeywords: [
      "clinic scheduling automation",
      "healthcare no-show prevention",
      "appointment-heavy clinic workflow",
      "private practice operations",
    ],
    searchIntent: "commercial",
    titleHint: "Why private clinics need more than reminder software to reduce empty slots",
    tags: ["private-clinics", "operations"],
  },
];

function normalizeSlug(value) {
  return slugify(String(value ?? "").trim(), { lower: true, strict: true });
}

function buildIsoDate(date = new Date()) {
  return date.toISOString();
}

function getBlogSettings() {
  return {
    publishMode: process.env.BLOG_PUBLISH_MODE === "draft" ? "draft" : "publish",
    defaultLocale: process.env.BLOG_DEFAULT_LOCALE === "en" ? "en" : "nl",
    outputDir: process.env.BLOG_OUTPUT_DIR?.trim() || DEFAULT_BLOG_DIR,
    minScore: Number(process.env.BLOG_MIN_SCORE ?? 72),
    maxPostsPerDay: Number(process.env.BLOG_MAX_POSTS_PER_DAY ?? 1),
    researchSourcesPath:
      process.env.BLOG_RESEARCH_SOURCES?.trim() || path.join("content", "blog-research-sources.json"),
  };
}

function pickTopic(existingPosts, locale) {
  const localizedSeeds = TOPIC_SEEDS.filter((seed) => seed.locale === locale);

  for (const candidate of localizedSeeds) {
    const slug = normalizeSlug(candidate.titleHint);
    const duplicate = existingPosts.some(
      (post) =>
        post.locale === locale &&
        (post.slug === slug ||
          post.primaryKeyword.toLowerCase() === candidate.primaryKeyword.toLowerCase()),
    );

    if (!duplicate) {
      return candidate;
    }
  }

  return localizedSeeds[0] ?? TOPIC_SEEDS[0];
}

async function loadResearchSources(rootDir, registryPath) {
  const absolutePath = path.isAbsolute(registryPath) ? registryPath : path.join(rootDir, registryPath);
  const raw = await fs.readFile(absolutePath, "utf8");
  const parsed = JSON.parse(raw);

  return Array.isArray(parsed) ? parsed : [];
}

async function fetchSourceSummary(source) {
  const response = await fetch(source.url, {
    headers: {
      "User-Agent": "RenvooBlogResearchBot/1.0 (+https://renvoo.example)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`Could not load source ${source.url} (${response.status})`);
  }

  const html = await response.text();
  const $ = loadHtml(html);
  const title = $("title").first().text().trim() || source.title;
  const paragraphs = $("p")
    .slice(0, 8)
    .map((_, element) => $(element).text().trim())
    .get()
    .filter(Boolean);

  return {
    title,
    url: source.url,
    summary: paragraphs.join(" ").replace(/\s+/g, " ").trim().slice(0, 1200),
  };
}

async function gatherResearch(rootDir, topic, registryPath) {
  const registry = await loadResearchSources(rootDir, registryPath);
  const selectedSources = registry
    .filter(
      (source) =>
        (!source.locale || source.locale === topic.locale || source.locale === "all") &&
        Array.isArray(source.tags) &&
        source.tags.some((tag) => topic.tags.includes(tag)),
    )
    .slice(0, 4);

  const notes = [];
  const errors = [];

  for (const source of selectedSources) {
    try {
      notes.push(await fetchSourceSummary(source));
    } catch (error) {
      errors.push(
        error instanceof Error ? error.message : `Failed to fetch research source ${source.url}`,
      );
    }
  }

  return {
    selectedSources,
    notes,
    errors,
  };
}

async function callOpenAi(prompt) {
  const apiKey = process.env.OPENAI_API_KEY?.trim();

  if (!apiKey) {
    return null;
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: DEFAULT_OPENAI_MODEL,
      reasoning: {
        effort: DEFAULT_REASONING_EFFORT,
      },
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: [
                "You write SEO and AI-search friendly blog drafts for Renvoo, a Dutch healthtech workflow company.",
                "Audience: clinic owners, practice managers, operations managers, and private healthcare operators.",
                "Write practical, specific, operator-facing content.",
                "Do not fabricate statistics, case studies, or citations.",
                "If a source is weak or incomplete, say so plainly.",
                BLOG_COMPLIANCE_SUMMARY,
                "Return JSON only.",
              ].join(" "),
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: prompt }],
        },
      ],
      max_output_tokens: 3500,
    }),
    signal: AbortSignal.timeout(45_000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI blog generation failed (${response.status}): ${errorText}`);
  }

  const payload = await response.json();
  const text = (payload.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((item) => item.type === "output_text")
    .map((item) => item.text ?? "")
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("OpenAI blog generation returned no text.");
  }

  const jsonBlock = text.match(/```(?:json)?\s*([\s\S]*?)```/i)?.[1] ?? text;
  const objectStart = jsonBlock.indexOf("{");
  const objectEnd = jsonBlock.lastIndexOf("}");
  return JSON.parse(jsonBlock.slice(objectStart, objectEnd + 1));
}

function createFallbackDraft(topic, research) {
  const now = buildIsoDate();
  const sources = research.notes.map((item) => ({ title: item.title, url: item.url }));
  const body = [
    `## Direct answer`,
    topic.locale === "nl"
      ? "Deze draft is automatisch voorbereid, maar nog niet door een model uitgewerkt. De bronnen en outline staan hieronder zodat de post veilig verder kan worden geschreven."
      : "This draft was prepared automatically, but it has not been expanded by a model yet. The sources and outline below keep the draft safe for review.",
    "",
    "## Suggested outline",
    `- ${topic.titleHint}`,
    `- ${topic.primaryKeyword}`,
    ...topic.secondaryKeywords.map((keyword) => `- ${keyword}`),
    "",
    "## Source notes",
    ...research.notes.map((note) => `- ${note.title}: ${note.summary}`),
  ].join("\n");

  return {
    title: topic.titleHint,
    slug: normalizeSlug(topic.titleHint),
    date: now,
    updated: now,
    excerpt:
      topic.locale === "nl"
        ? "Automatisch voorbereide draft op basis van geselecteerde publieke bronnen."
        : "Automatically prepared draft based on selected public sources.",
    metaTitle: topic.titleHint,
    metaDescription:
      topic.locale === "nl"
        ? `Draft voor ${topic.primaryKeyword} met bronnen en outline voor clinic decision-makers.`
        : `Draft for ${topic.primaryKeyword} with sources and an outline for clinic decision-makers.`,
    primaryKeyword: topic.primaryKeyword,
    secondaryKeywords: topic.secondaryKeywords,
    category: topic.category,
    status: BLOG_STATUS.draft,
    locale: topic.locale,
    searchIntent: topic.searchIntent,
    answer:
      topic.locale === "nl"
        ? "Deze post staat nog als draft omdat de uiteindelijke uitwerking nog beoordeeld moet worden."
        : "This post stays in draft until the full article is generated and reviewed.",
    sources,
    faq: [],
    schema: { article: true },
    bodyMarkdown: body,
  };
}

function buildPrompt(topic, research, existingPosts) {
  return [
    `Locale: ${topic.locale}`,
    `Category: ${topic.category}`,
    `Primary keyword: ${topic.primaryKeyword}`,
    `Secondary keywords: ${topic.secondaryKeywords.join(", ")}`,
    `Search intent: ${topic.searchIntent}`,
    `Working title hint: ${topic.titleHint}`,
    "",
    "Existing blog topics to avoid duplicating:",
    existingPosts
      .slice(0, 12)
      .map((post) => `- ${post.title} (${post.primaryKeyword})`)
      .join("\n"),
    "",
    "Research notes:",
    research.notes.map((note) => `- ${note.title} | ${note.url}\n  ${note.summary}`).join("\n"),
    "",
    "Hard compliance policy files:",
    BLOG_COMPLIANCE_FILES.map((file) => `- ${file}`).join("\n"),
    "",
    "Hard compliance summary:",
    BLOG_COMPLIANCE_SUMMARY,
    "",
    "Return this JSON shape:",
    JSON.stringify(
      {
        title: "Article title",
        slug: "article-slug",
        excerpt: "Short excerpt",
        metaTitle: "SEO title",
        metaDescription: "SEO meta description",
        primaryKeyword: topic.primaryKeyword,
        secondaryKeywords: topic.secondaryKeywords,
        category: topic.category,
        searchIntent: topic.searchIntent,
        answer: "Short direct answer shown near the top",
        faq: [
          { question: "Question", answer: "Answer" },
          { question: "Question", answer: "Answer" },
        ],
        bodyMarkdown: "## Section\nParagraph",
      },
      null,
      2,
    ),
  ].join("\n");
}

function normalizeGeneratedDraft(topic, rawDraft, research, settings) {
  const now = buildIsoDate();
  const draft = {
    title: String(rawDraft.title ?? topic.titleHint).trim(),
    slug: normalizeSlug(rawDraft.slug ?? rawDraft.title ?? topic.titleHint),
    date: now,
    updated: now,
    excerpt: String(rawDraft.excerpt ?? "").trim(),
    metaTitle: String(rawDraft.metaTitle ?? rawDraft.title ?? topic.titleHint).trim(),
    metaDescription: String(rawDraft.metaDescription ?? rawDraft.excerpt ?? "").trim(),
    primaryKeyword: String(rawDraft.primaryKeyword ?? topic.primaryKeyword).trim(),
    secondaryKeywords: Array.isArray(rawDraft.secondaryKeywords)
      ? rawDraft.secondaryKeywords.map((item) => String(item).trim()).filter(Boolean)
      : topic.secondaryKeywords,
    category: String(rawDraft.category ?? topic.category).trim(),
    status: BLOG_STATUS.draft,
    locale: topic.locale,
    searchIntent: String(rawDraft.searchIntent ?? topic.searchIntent).trim(),
    answer: String(rawDraft.answer ?? rawDraft.excerpt ?? "").trim(),
    sources: research.notes.map((note) => ({ title: note.title, url: note.url })),
    faq: Array.isArray(rawDraft.faq)
      ? rawDraft.faq
          .map((item) => ({
            question: String(item.question ?? "").trim(),
            answer: String(item.answer ?? "").trim(),
          }))
          .filter((item) => item.question && item.answer)
      : [],
    schema: { article: true },
    bodyMarkdown: String(rawDraft.bodyMarkdown ?? "").trim(),
  };

  if (settings.publishMode === "publish") {
    draft.status = BLOG_STATUS.published;
  }

  return draft;
}

function toValidationCandidate(draft) {
  return {
    ...draft,
    content: draft.bodyMarkdown,
    filePath: "",
    plainText: stripMarkdown(draft.bodyMarkdown),
    headings: extractMarkdownHeadings(draft.bodyMarkdown),
    contentHtml: "",
  };
}

export async function writeBlogPost(rootDir, post, outputDir = DEFAULT_BLOG_DIR) {
  const targetDir = path.join(rootDir, outputDir);
  const filePath = path.join(targetDir, `${post.slug}.md`);
  const frontmatter = createBlogFrontmatter(post);
  const fileContents = `${frontmatter}\n\n${post.bodyMarkdown.trim()}\n`;

  await fs.mkdir(targetDir, { recursive: true });
  await fs.writeFile(filePath, fileContents, "utf8");

  return { filePath, fileContents };
}

export async function generateBlogPost(options = {}) {
  const rootDir = options.rootDir ?? process.cwd();
  const settings = getBlogSettings();
  const locale = options.locale ?? settings.defaultLocale;
  const existingPosts = await loadBlogPosts(rootDir, settings.outputDir).catch(() => []);
  const topic = options.topic ?? pickTopic(existingPosts, locale);
  const research = await gatherResearch(rootDir, topic, settings.researchSourcesPath);

  let rawDraft = null;

  if (research.notes.length && !options.forceFallback) {
    rawDraft = await callOpenAi(buildPrompt(topic, research, existingPosts));
  }

  const generatedDraft = rawDraft
    ? normalizeGeneratedDraft(topic, rawDraft, research, settings)
    : createFallbackDraft(topic, research);

  const candidateValidation = validateBlogPost(
    toValidationCandidate(generatedDraft),
    existingPosts,
  );

  const duplicates = findDuplicatePosts(existingPosts, {
    slug: generatedDraft.slug,
    title: generatedDraft.title,
    primaryKeyword: generatedDraft.primaryKeyword,
    filePath: "",
  });

  if (
    candidateValidation.score < settings.minScore ||
    duplicates.length > 0 ||
    research.notes.length === 0
  ) {
    generatedDraft.status = BLOG_STATUS.draft;
  }

  if (!candidateValidation.compliance.ok) {
    const details = candidateValidation.compliance.violations
      .map((item) => `${item.label}: ${item.detail}`)
      .join("; ");
    throw new Error(`Blog compliance rejected draft. ${details}`);
  }

  const outcome = {
    topic,
    research,
    duplicates,
    validation: candidateValidation,
    draft: generatedDraft,
    settings,
  };

  if (options.dryRun) {
    return {
      ...outcome,
      persisted: false,
    };
  }

  const persisted = await writeBlogPost(rootDir, generatedDraft, settings.outputDir);

  return {
    ...outcome,
    persisted: true,
    filePath: persisted.filePath,
    fileContents: persisted.fileContents,
  };
}
