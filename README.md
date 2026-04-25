# Renvoo Memory System

This workspace now contains a from-scratch memory system designed for long-term use with an Obsidian-compatible vault for active reasoning and a Pinecone archive for large semantic recall. It is grounded in Karpathy's `llm-wiki.md` gist, vendored locally under `vendor/karpathy-llm-wiki/`.

## What it fixes

The basic "Obsidian + LLM wiki" pattern in the transcript is useful, but it breaks down when the vault gets large. This build adds:

- Sharded indexes instead of one ever-growing global index.
- Semantic archive search with Pinecone for bulky or cold content.
- Drift and contradiction tracking through lint reports and source-linked notes.
- Monthly logs and compaction hooks so the working set stays small.
- A static agent profile separate from changing memory so identity does not bloat.

## Layout

```text
memory/
  .obsidian/               Obsidian-friendly vault settings
  assets/                  Downloaded images and attachments
  archive/                 Pinecone sync metadata and local cache
  raw/                     Original sources
  system/                  Stable identity, rules, and domain definitions
  wiki/
    contradictions.md
    log.md
    indexes/
    topics/
    entities/
    decisions/
    sources/
    maintenance/
    queries/
```

## Quick start

1. `cp .env.example .env`
2. Add `OPENAI_API_KEY` if you want LLM-assisted synthesis and answers.
3. Add `PINECONE_API_KEY` if you want semantic archive search and long-term cold storage.
4. `npm install`
5. `npm run memory:init`
6. Open the `memory/` folder as an Obsidian vault if you want the visual graph layer.

## Daily workflow

- Ingest content:
  - `npm run memory:ingest -- --file /absolute/path/to/file.md`
  - `npm run memory:ingest -- --url https://example.com/article`
  - `npm run memory:ingest -- --text "short note text" --title "Idea capture"`
- Query memory:
  - `npm run memory:query -- --question "What matters most about X?"`
- Check health:
  - `npm run memory:lint`
- Rebuild indexes and compact the hot layer:
  - `npm run memory:compact`
- Inspect status:
  - `npm run memory:status`

## Website

The repo now also includes a clinic-facing marketing site under `src/site/`.

- Regenerate the static page set from the shared bilingual content source:
  - `npm run site:generate`
- Start local website dev:
  - `npm run site:dev`
- Build the static website:
  - `npm run site:build`
- Preview the built website:
  - `npm run site:preview`

Website build output goes to `dist/site/`.
The public funnel is Dutch-first at the root and mirrored in English under `src/site/en/`.
If you set `SITE_URL=https://your-domain.example` when running `npm run site:build`, the build also generates `sitemap.xml` and a `robots.txt` file that includes the sitemap location.

Deployment notes live in `docs/website/deployment.md`.

## Blog System

The website now also has a repo-native blog system for SEO and AI-search discovery.

- Blog source lives in `content/blog/`
- Shared parsing, validation, and generation logic lives in `src/lib/`
- The static site generator renders blog routes during `npm run site:generate`

Useful commands:

- Validate all blog content:
  - `npm run blog:validate`
- Generate a draft locally:
  - `npm run blog:generate -- --dry-run`
- Run the daily pipeline:
  - `npm run generate:daily-blog`

The blog system is constrained by explicit policy files:

- `docs/compliance/blog-content-compliance.md`
- `docs/compliance/blog-media-compliance.md`

## Website Versions

Major website states are preserved as Git tags and branches so earlier versions remain easy to inspect or restore.

- Version history: `docs/website/versions.md`

## Legal Pack

The repo now also includes a simple clinic-SaaS legal and compliance pack under `docs/legal/`.

- `docs/legal/contracts/`: pilot MSA, DPA, security annex, and pilot SOW templates
- `docs/legal/privacy/`: data inventory, retention matrix, processor register, breach SOP, DPIA-lite, and notice drafts
- `docs/legal/corporate/`: BV setup checklist and IP assignment templates
- `docs/legal/regulatory/`: non-clinical software classification memo

These are starter templates for Renvoo's Dutch dental-clinic pilot motion and should still be reviewed by Dutch counsel before signature or launch.

## Content model

Keep only distilled, active reasoning in the wiki. Large transcripts, PDFs, exports, and archives belong in Pinecone-backed storage with summarized wiki notes pointing back to them.

That is the main architectural fix for the scaling problem in the original pattern:

- `system/` is identity and stable rules.
- `wiki/` is active reasoning and evolving judgment.
- `archive/` is semantic recall for large and stable source material.

## Notes

- If `OPENAI_API_KEY` is missing, ingestion falls back to a deterministic local draft flow.
- If `PINECONE_API_KEY` is missing, archive sync is skipped and query falls back to local vault search only.
