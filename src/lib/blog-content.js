import fs from "node:fs/promises";
import path from "node:path";

import fg from "fast-glob";
import matter from "gray-matter";
import slugify from "slugify";

import { evaluateBlogCompliance } from "./blog-compliance.js";
import { extractMarkdownHeadings, renderMarkdown, stripMarkdown } from "./blog-markdown.js";

export const BLOG_STATUS = {
  draft: "draft",
  published: "published",
};

export const DEFAULT_BLOG_DIR = "content/blog";

const INTERNAL_LINK_MAP = {
  "dental-clinics": {
    nl: [
      { pageKey: "dentalClinics", label: "Lees de tandartspraktijken-pagina" },
      { pageKey: "contact", label: "Vraag een korte workflow review aan" },
    ],
    en: [
      { pageKey: "dentalClinics", label: "See the dental clinics page" },
      { pageKey: "contact", label: "Request a short workflow review" },
    ],
  },
  "private-clinics": {
    nl: [
      { pageKey: "privateClinics", label: "Bekijk de private clinics-pagina" },
      { pageKey: "useCases", label: "Ga naar de use-cases" },
    ],
    en: [
      { pageKey: "privateClinics", label: "View the private clinics page" },
      { pageKey: "useCases", label: "Go to the use cases page" },
    ],
  },
  "no-show-reduction": {
    nl: [
      { pageKey: "noShowReduction", label: "Bekijk no-show reduction" },
      { pageKey: "contact", label: "Plan een kort gesprek" },
    ],
    en: [
      { pageKey: "noShowReduction", label: "View no-show reduction" },
      { pageKey: "contact", label: "Book a short review" },
    ],
  },
  "appointment-reminders": {
    nl: [
      { pageKey: "appointmentReminders", label: "Bekijk appointment reminders" },
      { pageKey: "cancellationManagement", label: "Zie cancellation management" },
    ],
    en: [
      { pageKey: "appointmentReminders", label: "See appointment reminders" },
      { pageKey: "cancellationManagement", label: "See cancellation management" },
    ],
  },
  "cancellation-management": {
    nl: [
      { pageKey: "cancellationManagement", label: "Bekijk cancellation management" },
      { pageKey: "noShowReduction", label: "Lees ook over no-show reduction" },
    ],
    en: [
      { pageKey: "cancellationManagement", label: "View cancellation management" },
      { pageKey: "noShowReduction", label: "Also read about no-show reduction" },
    ],
  },
  default: {
    nl: [
      { pageKey: "useCases", label: "Bekijk de use-cases" },
      { pageKey: "contact", label: "Vraag een gesprek aan" },
    ],
    en: [
      { pageKey: "useCases", label: "View the use cases" },
      { pageKey: "contact", label: "Request a meeting" },
    ],
  },
};

function coerceStringArray(value) {
  if (!value) {
    return [];
  }

  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function normalizeFaq(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }

      return {
        question: String(item.question ?? "").trim(),
        answer: String(item.answer ?? "").trim(),
      };
    })
    .filter((item) => item?.question && item.answer);
}

function normalizeSources(value) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "string") {
        return { title: item, url: item };
      }

      if (!item || typeof item !== "object") {
        return null;
      }

      const title = String(item.title ?? item.url ?? "").trim();
      const url = String(item.url ?? "").trim();

      if (!title || !url) {
        return null;
      }

      return { title, url };
    })
    .filter(Boolean);
}

function normalizeSlug(value, fallback) {
  const raw = String(value ?? fallback ?? "").trim();
  return slugify(raw, { lower: true, strict: true });
}

function normalizeDate(value, fallbackDate) {
  const candidate = String(value ?? fallbackDate ?? "").trim();
  const parsed = new Date(candidate);
  return Number.isNaN(parsed.valueOf()) ? fallbackDate : parsed.toISOString();
}

function sentenceStats(text) {
  const sentences = text
    .split(/[.!?]+/)
    .map((item) => item.trim())
    .filter(Boolean);
  const words = text.split(/\s+/).filter(Boolean);

  return {
    sentenceCount: sentences.length || 1,
    wordCount: words.length,
    averageWordsPerSentence: words.length / (sentences.length || 1),
  };
}

function tokenize(value) {
  return String(value)
    .toLowerCase()
    .split(/[^a-z0-9à-ž]+/i)
    .filter(Boolean);
}

function normalizeForKeywordMatch(value) {
  return tokenize(value).join(" ");
}

function similarityScore(left, right) {
  const leftTokens = new Set(tokenize(left));
  const rightTokens = new Set(tokenize(right));
  const union = new Set([...leftTokens, ...rightTokens]);

  if (!union.size) {
    return 0;
  }

  let overlap = 0;
  for (const token of leftTokens) {
    if (rightTokens.has(token)) {
      overlap += 1;
    }
  }

  return overlap / union.size;
}

function countInternalMarkdownLinks(body) {
  return [...String(body).matchAll(/\[[^\]]+\]\((\/[^)]+|\.\.?\/[^)]+)\)/g)].length;
}

function validateHeadingOrder(headings) {
  if (!headings.length) {
    return true;
  }

  let lastDepth = 1;
  for (const heading of headings) {
    if (heading.depth > lastDepth + 1) {
      return false;
    }
    lastDepth = heading.depth;
  }

  return true;
}

function buildCheck(ok, label, detail) {
  return { ok, label, detail };
}

function pagePathFor(locale, pageKey) {
  const prefix = locale === "en" ? "/en" : "";
  const pageMap = {
    home: `${prefix}/`,
    about: `${prefix}/about/`,
    contact: `${prefix}/contact/`,
    useCases: `${prefix}/use-cases/`,
    dentalClinics: `${prefix}/dental-clinics/`,
    privateClinics: `${prefix}/private-clinics/`,
    noShowReduction: `${prefix}/no-show-reduction/`,
    appointmentReminders: `${prefix}/appointment-reminders/`,
    cancellationManagement: `${prefix}/cancellation-management/`,
    blogIndex: `${prefix}/blog/`,
  };

  return pageMap[pageKey] ?? `${prefix}/`;
}

export function getSuggestedInternalLinks(post) {
  const locale = post.locale === "en" ? "en" : "nl";
  const entries = INTERNAL_LINK_MAP[post.category] ?? INTERNAL_LINK_MAP.default;
  return entries[locale].map((entry) => ({
    ...entry,
    href: pagePathFor(locale, entry.pageKey),
  }));
}

export function normalizeBlogPost({ filePath, parsed }) {
  const data = parsed.data ?? {};
  const content = String(parsed.content ?? "").trim();
  const fallbackTitle = path.basename(filePath, path.extname(filePath));
  const title = String(data.title ?? fallbackTitle).trim();
  const slug = normalizeSlug(data.slug, title);
  const locale = data.locale === "en" ? "en" : "nl";
  const date = normalizeDate(data.date, new Date().toISOString());
  const updated = normalizeDate(data.updated, date);
  const excerpt = String(data.excerpt ?? "").trim();
  const primaryKeyword = String(data.primaryKeyword ?? "").trim();
  const secondaryKeywords = coerceStringArray(data.secondaryKeywords);
  const faq = normalizeFaq(data.faq);
  const sources = normalizeSources(data.sources);
  const headings = extractMarkdownHeadings(content);

  return {
    filePath,
    slug,
    title,
    date,
    updated,
    excerpt,
    metaTitle: String(data.metaTitle ?? title).trim(),
    metaDescription: String(data.metaDescription ?? excerpt).trim(),
    primaryKeyword,
    secondaryKeywords,
    category: String(data.category ?? "default").trim(),
    status: data.status === BLOG_STATUS.published ? BLOG_STATUS.published : BLOG_STATUS.draft,
    locale,
    searchIntent: String(data.searchIntent ?? "").trim(),
    answer: String(data.answer ?? excerpt).trim(),
    sources,
    faq,
    schema: data.schema ?? { article: true },
    content,
    contentHtml: renderMarkdown(content),
    plainText: stripMarkdown(content),
    headings,
  };
}

export async function loadBlogPosts(rootDir = process.cwd(), blogDir = DEFAULT_BLOG_DIR) {
  const absoluteBlogDir = path.join(rootDir, blogDir);
  const files = await fg(["**/*.md"], {
    cwd: absoluteBlogDir,
    absolute: true,
  });

  const posts = [];

  for (const filePath of files.sort()) {
    const raw = await fs.readFile(filePath, "utf8");
    const parsed = matter(raw);
    posts.push(normalizeBlogPost({ filePath, parsed }));
  }

  return posts.sort((left, right) => right.date.localeCompare(left.date));
}

export function findDuplicatePosts(existingPosts, candidate) {
  return existingPosts
    .filter((post) => post.filePath !== candidate.filePath)
    .map((post) => ({
      post,
      slugMatch: post.slug === candidate.slug,
      titleMatch: post.title.toLowerCase() === candidate.title.toLowerCase(),
      keywordMatch:
        post.primaryKeyword &&
        candidate.primaryKeyword &&
        post.primaryKeyword.toLowerCase() === candidate.primaryKeyword.toLowerCase(),
      similarity: Math.max(
        similarityScore(post.title, candidate.title),
        similarityScore(post.primaryKeyword, candidate.primaryKeyword),
      ),
    }))
    .filter(
      (match) =>
        match.slugMatch || match.titleMatch || match.keywordMatch || match.similarity >= 0.72,
    );
}

export function validateBlogPost(post, allPosts = []) {
  const stats = sentenceStats(post.plainText);
  const suggestedLinks = getSuggestedInternalLinks(post);
  const internalLinkCount = countInternalMarkdownLinks(post.content) + suggestedLinks.length;
  const primaryKeywordLower = normalizeForKeywordMatch(post.primaryKeyword);
  const bodyLower = normalizeForKeywordMatch(post.plainText);
  const titleLower = normalizeForKeywordMatch(post.title);
  const headingText = normalizeForKeywordMatch(post.headings.map((heading) => heading.text).join(" "));
  const duplicates = findDuplicatePosts(allPosts, post);
  const compliance = evaluateBlogCompliance(post);
  const checks = [
    buildCheck(post.title.length >= 32 && post.title.length <= 80, "titleLength", post.title),
    buildCheck(
      post.metaDescription.length >= 110 && post.metaDescription.length <= 180,
      "metaDescriptionLength",
      post.metaDescription,
    ),
    buildCheck(post.slug === normalizeSlug(post.slug, post.slug), "slugValidity", post.slug),
    buildCheck(stats.wordCount >= 700, "wordCount", `${stats.wordCount} words`),
    buildCheck(!post.headings.some((heading) => heading.depth === 1), "singleH1", "Template owns the H1"),
    buildCheck(validateHeadingOrder(post.headings), "headingStructure", `${post.headings.length} headings`),
    buildCheck(
      Boolean(primaryKeywordLower) &&
        titleLower.includes(primaryKeywordLower) &&
        bodyLower.includes(primaryKeywordLower) &&
        headingText.includes(primaryKeywordLower),
      "primaryKeywordUsage",
      post.primaryKeyword,
    ),
    buildCheck(
      post.secondaryKeywords.length >= 3 && post.secondaryKeywords.length <= 8,
      "secondaryKeywordCount",
      `${post.secondaryKeywords.length} secondary keywords`,
    ),
    buildCheck(internalLinkCount >= 2, "internalLinks", `${internalLinkCount} internal links`),
    buildCheck(post.faq.length > 0, "faqIncluded", `${post.faq.length} FAQ items`),
    buildCheck(Boolean(post.schema?.article ?? true), "schemaIncluded", "Article schema"),
    buildCheck(post.sources.length > 0, "sourcesIncluded", `${post.sources.length} sources`),
    buildCheck(
      stats.averageWordsPerSentence <= 28,
      "readability",
      `${stats.averageWordsPerSentence.toFixed(1)} words/sentence`,
    ),
    buildCheck(duplicates.length === 0, "duplicateTopic", `${duplicates.length} likely duplicates`),
    buildCheck(
      compliance.ok,
      "contentCompliance",
      compliance.ok
        ? "No compliance violations"
        : compliance.violations.map((item) => `${item.label}: ${item.detail}`).join("; "),
    ),
  ];

  const failedChecks = checks.filter((check) => !check.ok);
  const score = Math.max(0, 100 - failedChecks.length * 8 - (stats.wordCount < 900 ? 6 : 0));

  return {
    checks,
    compliance,
    duplicates,
    suggestedLinks,
    stats,
    score,
    ok: failedChecks.length === 0,
  };
}

export function createBlogFrontmatter(post) {
  const sourceLines = post.sources.map(
    (source) => `  - title: "${String(source.title).replaceAll('"', '\\"')}"\n    url: "${source.url}"`,
  );
  const faqLines = post.faq.map(
    (item) =>
      `  - question: "${String(item.question).replaceAll('"', '\\"')}"\n    answer: "${String(item.answer).replaceAll('"', '\\"')}"`,
  );

  return [
    "---",
    `title: "${String(post.title).replaceAll('"', '\\"')}"`,
    `slug: "${post.slug}"`,
    `date: "${post.date}"`,
    `updated: "${post.updated}"`,
    `excerpt: "${String(post.excerpt).replaceAll('"', '\\"')}"`,
    `metaTitle: "${String(post.metaTitle).replaceAll('"', '\\"')}"`,
    `metaDescription: "${String(post.metaDescription).replaceAll('"', '\\"')}"`,
    `primaryKeyword: "${String(post.primaryKeyword).replaceAll('"', '\\"')}"`,
    `secondaryKeywords: [${post.secondaryKeywords.map((item) => `"${String(item).replaceAll('"', '\\"')}"`).join(", ")}]`,
    `category: "${post.category}"`,
    `status: "${post.status}"`,
    `locale: "${post.locale}"`,
    `searchIntent: "${String(post.searchIntent).replaceAll('"', '\\"')}"`,
    `answer: "${String(post.answer).replaceAll('"', '\\"')}"`,
    "schema:",
    "  article: true",
    ...(sourceLines.length ? ["sources:", ...sourceLines] : ["sources: []"]),
    ...(faqLines.length ? ["faq:", ...faqLines] : ["faq: []"]),
    "---",
  ].join("\n");
}
