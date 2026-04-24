import { z } from "zod";

import { estimateTokens, truncateText } from "./chunking.js";
import { toSlug } from "./slug.js";
import type {
  AppConfig,
  ArchiveHit,
  LoadedSource,
  QueryAnswer,
  SearchHit,
  SourceSynthesis,
} from "./types.js";

const claimSchema = z.object({
  statement: z.string(),
  confidence: z.enum(["low", "medium", "high"]).default("medium"),
  evidence: z.string().optional(),
});

const noteDraftSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  summary: z.string(),
  evidence: z.array(z.string()).default([]),
  claims: z.array(claimSchema).default([]),
});

const synthesisSchema = z.object({
  summary: z.string(),
  storageStrategy: z.enum(["wiki-only", "wiki-and-archive", "archive-first"]),
  topics: z.array(noteDraftSchema).default([]),
  entities: z.array(noteDraftSchema).default([]),
  decisions: z.array(noteDraftSchema).default([]),
  claims: z.array(claimSchema).default([]),
  contradictions: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        severity: z.enum(["low", "medium", "high"]).default("medium"),
        relatedTitles: z.array(z.string()).default([]),
      }),
    )
    .default([]),
  searchHints: z.array(z.string()).default([]),
});

const querySchema = z.object({
  answer: z.string(),
  citations: z.array(z.string()).default([]),
  followUps: z.array(z.string()).default([]),
});

function extractOutputText(payload: unknown): string {
  if (!payload || typeof payload !== "object") {
    return "";
  }

  const root = payload as {
    output?: Array<{ content?: Array<{ type?: string; text?: string }> }>;
  };

  return (root.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((content) => content.type === "output_text")
    .map((content) => content.text ?? "")
    .join("\n")
    .trim();
}

function parseJsonFromText<T>(text: string, schema: z.ZodSchema<T>): T {
  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fencedMatch?.[1] ?? trimmed;
  const objectStart = candidate.indexOf("{");
  const objectEnd = candidate.lastIndexOf("}");
  const slice =
    objectStart >= 0 && objectEnd > objectStart
      ? candidate.slice(objectStart, objectEnd + 1)
      : candidate;

  return schema.parse(JSON.parse(slice));
}

async function callOpenAi(config: AppConfig, instructions: string, input: string): Promise<string> {
  if (!config.openAi.apiKey) {
    throw new Error("OPENAI_API_KEY is not configured.");
  }

  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.openAi.apiKey}`,
    },
    body: JSON.stringify({
      model: config.openAi.model,
      reasoning: {
        effort: config.openAi.reasoningEffort,
      },
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: instructions }],
        },
        {
          role: "user",
          content: [{ type: "input_text", text: input }],
        },
      ],
      max_output_tokens: 3500,
    }),
    signal: AbortSignal.timeout(45_000),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`OpenAI request failed (${response.status}): ${errorText}`);
  }

  const payload = (await response.json()) as unknown;
  const text = extractOutputText(payload);

  if (!text) {
    throw new Error("OpenAI did not return output text.");
  }

  return text;
}

function fallbackSynthesis(source: LoadedSource): SourceSynthesis {
  const summary = truncateText(source.text, 900);
  const tokenEstimate = estimateTokens(source.text);

  return {
    summary,
    storageStrategy:
      source.externalExportMode === "blocked"
        ? "wiki-only"
        : tokenEstimate > 5000
          ? "archive-first"
          : "wiki-and-archive",
    topics: [
      {
        title: source.title,
        slug: toSlug(source.title),
        summary,
        evidence: summary
          .split(/\n+/)
          .map((line) => line.trim())
          .filter(Boolean)
          .slice(0, 5),
        claims: [],
      },
    ],
    entities: [],
    decisions: [],
    claims: [],
    contradictions: [],
    searchHints: [source.title, source.domain, "renvoo"],
  };
}

export async function synthesizeSource(
  config: AppConfig,
  source: LoadedSource,
  localHits: SearchHit[],
  archiveHits: ArchiveHit[],
): Promise<SourceSynthesis> {
  if (!config.openAi.apiKey || source.externalExportMode === "blocked") {
    return fallbackSynthesis(source);
  }

  const instructions = [
    "You maintain a Karpathy-style LLM wiki for Renvoo, a startup information system.",
    "Use the raw source as ground truth, keep the wiki compact, and prefer archive-first handling for bulky stable material.",
    "Return JSON only.",
    "Create concise topic, entity, and decision pages that would still make sense months later.",
    "Flag contradictions when the new source conflicts with existing notes or archive snippets.",
    "Never duplicate the raw source verbatim.",
  ].join(" ");

  const input = [
    "Domain: Renvoo startup information.",
    `Source title: ${source.title}`,
    `Source kind: ${source.kind}`,
    `Source tags: ${source.tags.join(", ") || "none"}`,
    `External export mode: ${source.externalExportMode}`,
    "",
    "Relevant wiki context:",
    localHits.length
      ? localHits
          .map(
            (hit, index) =>
              `${index + 1}. ${hit.title} | ${hit.type} | ${hit.summary || hit.excerpt}`,
          )
          .join("\n")
      : "No existing wiki context.",
    "",
    "Relevant archive context:",
    archiveHits.length
      ? archiveHits
          .map(
            (hit, index) =>
              `${index + 1}. ${hit.title} | ${hit.text.slice(0, 280).replace(/\s+/g, " ")}`,
          )
          .join("\n")
      : "No archive context.",
    "",
    source.externalExportMode === "raw"
      ? "Raw source text:"
      : "Redacted source text prepared for external export:",
    truncateText(source.externalExportText, 24000),
    "",
    "Return this JSON shape:",
    JSON.stringify(
      {
        summary: "overall wiki-safe summary",
        storageStrategy: "wiki-only | wiki-and-archive | archive-first",
        topics: [{ title: "Topic", slug: "topic", summary: "Summary", evidence: [], claims: [] }],
        entities: [
          { title: "Entity", slug: "entity", summary: "Summary", evidence: [], claims: [] },
        ],
        decisions: [
          { title: "Decision", slug: "decision", summary: "Summary", evidence: [], claims: [] },
        ],
        claims: [{ statement: "Claim", confidence: "medium", evidence: "Proof" }],
        contradictions: [
          {
            title: "Possible contradiction",
            description: "What changed",
            severity: "medium",
            relatedTitles: ["Some note"],
          },
        ],
        searchHints: ["hint one", "hint two"],
      },
      null,
      2,
    ),
  ].join("\n");

  const text = await callOpenAi(config, instructions, input);
  const parsed = parseJsonFromText(text, synthesisSchema);

  return {
    ...parsed,
    topics: parsed.topics.map((draft) => ({ ...draft, slug: draft.slug ?? toSlug(draft.title) })),
    entities: parsed.entities.map((draft) => ({
      ...draft,
      slug: draft.slug ?? toSlug(draft.title),
    })),
    decisions: parsed.decisions.map((draft) => ({
      ...draft,
      slug: draft.slug ?? toSlug(draft.title),
    })),
  };
}

export async function answerQuestion(
  config: AppConfig,
  question: string,
  localHits: SearchHit[],
  archiveHits: ArchiveHit[],
): Promise<QueryAnswer> {
  if (!config.openAi.apiKey) {
    return {
      answer: [
        "OpenAI is not configured, so this is a retrieval bundle instead of a generated answer.",
        "",
        "Top wiki hits:",
        ...localHits.map((hit) => `- ${hit.title} (${hit.path})`),
        "",
        "Top archive hits:",
        ...archiveHits.map((hit) => `- ${hit.title}: ${hit.text.slice(0, 180)}`),
      ].join("\n"),
      citations: [...localHits.map((hit) => hit.path), ...archiveHits.map((hit) => hit.title)],
      followUps: [],
    };
  }

  const instructions = [
    "You answer questions for the Renvoo startup memory system.",
    "Only use the provided wiki and archive context.",
    "Prefer concise answers with actionable structure.",
    "Return JSON only.",
  ].join(" ");

  const input = [
    `Question: ${question}`,
    "",
    "Wiki context:",
    localHits.length
      ? localHits
          .map(
            (hit, index) =>
              `${index + 1}. ${hit.title}\nPath: ${hit.path}\nSummary: ${hit.summary}\nExcerpt: ${hit.excerpt}`,
          )
          .join("\n\n")
      : "No wiki hits.",
    "",
    "Archive context:",
    archiveHits.length
      ? archiveHits
          .map(
            (hit, index) =>
              `${index + 1}. ${hit.title}\nSource: ${hit.sourcePath ?? "unknown"}\nText: ${hit.text}`,
          )
          .join("\n\n")
      : "No archive hits.",
    "",
    "Return this JSON shape:",
    JSON.stringify(
      {
        answer: "Answer with citations embedded in prose when useful.",
        citations: ["path or source"],
        followUps: ["follow-up question"],
      },
      null,
      2,
    ),
  ].join("\n");

  const text = await callOpenAi(config, instructions, input);
  return parseJsonFromText(text, querySchema);
}
