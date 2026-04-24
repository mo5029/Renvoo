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
  - external export is now `blocked` by default even if OpenAI or Pinecone are configured
  - opt into off-box ingest export with `--external-export-mode redacted`
  - only use `--external-export-mode raw` when you intentionally want unredacted source content sent to configured external services
- Query memory:
  - `npm run memory:query -- --question "What matters most about X?"`
- Check health:
  - `npm run memory:lint`
- Rebuild indexes and compact the hot layer:
  - `npm run memory:compact`
- Inspect status:
  - `npm run memory:status`

## Private Dashboard

The private finance and operations dashboard runs locally and is separate from the public website.

- Start it:
  - `npm run dashboard`
- Open:
  - `http://localhost:4177`

The dashboard reads and writes private finance files under `memory/private/finance/`, and also summarizes outreach, legal, and wiki memory databases. Exact finance/vendor data stays local and should remain gitignored.

## Website

The repo now also includes a Dutch-first bilingual marketing site plus a markdown blog system.

- Site source:
  - shared page copy and route registry: `src/site/lib/site-content.js`
  - shared renderer and schema output: `src/site/lib/site-render.js`
  - generated HTML source files: `src/site/.generated/`
  - blog content: `content/blog/`
  - daily automation: `scripts/blog-generate.js`, `scripts/generate-daily-blog.js`, `api/cron/daily-blog.js`

- Generate the site source pages:
  - `npm run site:generate`
- Start local website dev:
  - `npm run site:dev`
- Build the static website:
  - `npm run site:build`
- Preview the built website:
  - `npm run site:preview`
- Validate blog content quality:
  - `npm run blog:validate`
- Generate a blog post draft locally:
  - `npm run blog:generate -- --dry-run`
- Run the daily blog pipeline:
  - `npm run generate:daily-blog`

Website build output goes to `dist/site/`.
If you set `SITE_URL=https://your-domain.example` when running `npm run site:build`, the build also generates:

- page-level canonicals and `hreflang`
- `sitemap.xml`
- `robots.txt`
- `llms.txt`

The site currently includes:

- Dutch commercial pages at the root
- English mirrors under `/en/`
- structured data for `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, and blog `Article` pages
- a markdown blog index and article pipeline
- a static contact-request flow that can open a configured public email address via `SITE_CONTACT_EMAIL`

Deployment notes live in `docs/website/deployment.md`.

### Daily Blog Automation

The blog pipeline is designed to stay simple and repo-native.

Hard compliance policies:

- `docs/compliance/blog-content-compliance.md`
- `docs/compliance/blog-media-compliance.md`

Any generated blog that violates those rules must be rewritten or rejected. The validator now blocks persistence when compliance fails.

- Source registry:
  - `content/blog-research-sources.json`
- Blog storage:
  - published and draft markdown posts live in `content/blog/`
- Validation:
  - title length
  - meta description length
  - word count
  - heading structure
  - primary keyword usage
  - secondary keyword count
  - internal links
  - FAQ and schema presence
  - source presence
  - duplicate-topic detection

Main environment variables:

- `SITE_URL`: absolute production URL used for canonical tags, `hreflang`, and sitemap generation
- `SITE_CONTACT_EMAIL`: public inbox used by the contact page mailto flow
- `OPENAI_API_KEY`: enables AI-assisted draft generation
- `BLOG_PUBLISH_MODE=draft|publish`: whether passing posts should stay draft or be marked published
- `BLOG_DEFAULT_LOCALE=nl|en`
- `BLOG_OUTPUT_DIR`: markdown storage location, default `content/blog`
- `BLOG_RESEARCH_SOURCES`: source registry path, default `content/blog-research-sources.json`
- `BLOG_MIN_SCORE`: minimum validation score before a post can remain published
- `BLOG_MAX_POSTS_PER_DAY`: upper limit for generated posts per run
- `BLOG_PERSIST_DESTINATION=filesystem|github`
- `CRON_SECRET`: secures the Vercel Cron route
- `GITHUB_TOKEN`, `GITHUB_REPOSITORY`, `GITHUB_BRANCH`: required when Vercel Cron should persist generated posts back to GitHub

Typical local workflow:

1. `npm run blog:generate -- --dry-run`
2. review `tmp/blog/latest-run.json`
3. `npm run generate:daily-blog`
4. `npm run site:build`

Scheduling options:

- Vercel Cron:
  - configured in `vercel.json`
  - calls `GET /api/cron/daily-blog`
  - for durable publishing, also set GitHub persistence env vars so the function can commit the generated markdown back to the repo
- GitHub Actions:
  - run `npm run generate:daily-blog`, commit the changed `content/blog/*.md`, and let Vercel redeploy from Git
- Local cron:
  - run `cd /absolute/path/to/Renvoo && npm run generate:daily-blog`

If `OPENAI_API_KEY` is missing, the automation falls back to a safe draft-oriented outline flow instead of pretending to have fully researched copy.

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
- URL ingest only supports public `http`/`https` destinations and blocks localhost, private IP ranges, and credentialed URLs.
- URL ingest now applies redirect validation, request timeouts, and response-size limits before content is written into memory.
