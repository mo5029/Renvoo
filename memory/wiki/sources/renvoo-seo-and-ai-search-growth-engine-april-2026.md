---
title: "Renvoo SEO And AI Search Growth Engine (April 2026)"
type: source
domain: renvoo-startup
source_id: manual-renvoo-seo-growth-engine-2026-04-24
source_kind: manual-review
summary: "Structured capture of the April 24, 2026 SEO and AI-search implementation pass that rebuilt the Renvoo site into a Dutch-first bilingual commercial architecture with markdown blog rendering, schema markup, sitemap and llms generation, and a cron-ready daily blog pipeline."
updated_at: 2026-04-24T09:44:50Z
created_at: 2026-04-24T09:44:50Z
raw_path: raw/2026/04/24-renvoo-seo-and-ai-search-growth-engine-april-2026.md
storage_strategy: wiki-only
archive_chunk_count: 0
tags:
  - renvoo
  - website
  - seo
  - ai-seo
  - blog
  - automation
---
# Source: Renvoo SEO And AI Search Growth Engine (April 2026)

## Source Summary

This source captures the April 24, 2026 implementation pass that turned the Renvoo website into a Dutch-first bilingual SEO and AI-search acquisition engine. The work replaced the older landing-page-heavy structure with a shared route/content registry, added clear commercial and informational pages, added a markdown blog system, and implemented a cron-ready daily blog pipeline with validation and conservative publish gating.

## Why This Pass Happened

- The earlier site was too narrow and page-light for search.
- There was no blog/content layer, no About or Use Cases architecture, no breadcrumb system, no article schema, and no `llms.txt`.
- The user explicitly wanted the site to perform better for:
  - traditional Google SEO
  - AI search and generative-engine citations
  - Dutch private-clinic and dental-clinic discovery
  - conversion from clinic owners, practice managers, and operations leads

## What Changed

### Site Architecture

- Shared route and content model in `src/site/lib/site-content.js`
- Shared renderer in `src/site/lib/site-render.js`
- Static generation step in `scripts/generate-site-pages.js`
- Dutch commercial pages at the root
- English mirrors under `/en/`
- Blog index and article routes generated from markdown under `content/blog/`

### Technical SEO

- Page-level titles and meta descriptions
- Canonicals and `hreflang` when `SITE_URL` is set
- OpenGraph and Twitter metadata
- Breadcrumb UI plus `BreadcrumbList` schema
- `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`, and `Article` JSON-LD
- `robots.txt`, `sitemap.xml`, and `llms.txt` generation in postbuild

### Content Architecture

- Home
- About
- Contact
- Use Cases
- Dental Clinics
- Private Clinics
- No-Show Reduction
- Appointment Reminders
- Cancellation Management
- Blog index
- Blog articles
- Privacy / Patient Notice / 404

### Blog System

- Markdown post storage in `content/blog/`
- Post parsing, validation, and internal-link suggestions in `src/lib/blog-content.js`
- Markdown rendering in `src/lib/blog-markdown.js`
- Topic research and draft generation in `src/lib/blog-generator.js`
- Optional GitHub persistence in `src/lib/github-publish.js`

### Automation

- `npm run blog:generate`
- `npm run blog:validate`
- `npm run generate:daily-blog`
- `api/cron/daily-blog.js`
- Vercel cron configuration in `vercel.json`

## Verification

- `npm run site:build` passed
- `npm run build` passed
- `npm test` passed
- `npm run blog:validate` passed

## Automation Status

On April 24, 2026, a Codex desktop heartbeat automation was created for ongoing blog generation:

- automation id: `daily-renvoo-blog-draft`
- name: `Daily Renvoo Blog Draft`
- cadence: daily at `07:00`
- scope: generate one Renvoo blog draft, validate it, keep it draft-first when evidence is weak, and update the project memory after each run

This matters because it removes the requirement for a user-managed `OPENAI_API_KEY` in order to keep the content pipeline moving inside the Codex app workflow.

## Launch Prep Status

Later on April 24, 2026, the production launch path was prepared further:

- the current launch work was committed and pushed to `origin/codex/seo-ai-growth-engine`
- the same work was fast-forwarded onto `main` and pushed to `origin/main`
- `vercel.json` was updated so Vercel builds use:
  - `SITE_URL=https://renvoo.nl`
  - `SITE_CONTACT_EMAIL=mohamed.ibrahim5029@gmail.com`

That means the repository itself is now aligned to the intended production domain and public contact route.

The remaining blocker is no longer code. The remaining blocker is the one-time Vercel project import plus adding `renvoo.nl` and `www.renvoo.nl` to that project in Vercel.

## Key Files

- `src/site/lib/site-content.js`
- `src/site/lib/site-render.js`
- `scripts/generate-site-pages.js`
- `config/vite.site.config.mjs`
- `config/site-postbuild.mjs`
- `content/blog/*.md`
- `src/lib/blog-content.js`
- `src/lib/blog-generator.js`
- `scripts/blog-generate.js`
- `scripts/blog-validate.js`
- `scripts/generate-daily-blog.js`
- `api/cron/daily-blog.js`
- `README.md`
- `docs/website/deployment.md`

## Replication Notes

To reproduce the full system locally:

1. `npm install`
2. `npm run site:build`
3. `npm run build`
4. `npm test`
5. `npm run blog:validate`
6. optional: `npm run blog:generate -- --dry-run`
7. optional: `npm run generate:daily-blog`

Important env vars:

- `SITE_URL`
- `SITE_CONTACT_EMAIL`
- `OPENAI_API_KEY`
- `BLOG_PUBLISH_MODE`
- `BLOG_DEFAULT_LOCALE`
- `BLOG_MIN_SCORE`
- `CRON_SECRET`
- GitHub persistence vars if cron should commit generated posts back to the repo

## Topics

- [[wiki/topics/renvoo-website-seo-and-blog-engine-april-2026]]
- [[wiki/topics/renvoo-go-to-market]]
- [[wiki/topics/renvoo-roadmap-and-proof-plan]]

## Claims

- As of April 24, 2026, the Renvoo website is generated as a Dutch-first bilingual commercial site with English mirrors, a markdown blog system, and route-level SEO metadata. (high) — `src/site/lib/site-content.js`, `src/site/lib/site-render.js`, `scripts/generate-site-pages.js`
- The build now emits AI-search-friendly and SEO-friendly artifacts including schema markup, breadcrumbs, `robots.txt`, `sitemap.xml`, and `llms.txt`. (high) — `src/site/lib/site-render.js`, `config/site-postbuild.mjs`
- The repo now contains a daily blog pipeline that can research, draft, validate, and optionally persist posts, but still defaults to conservative draft-oriented behavior when signals are weak or configuration is incomplete. (high) — `src/lib/blog-generator.js`, `scripts/generate-daily-blog.js`, `api/cron/daily-blog.js`
- Renvoo now also has an app-level recurring automation that can generate and document blog drafts without relying on a user-managed OpenAI API key inside the repo itself. (high) — Codex automation `daily-renvoo-blog-draft`
- The current production-ready code has been pushed to `main`, and Vercel build config now targets `https://renvoo.nl` with `mohamed.ibrahim5029@gmail.com` as the public contact route. (high) — `git push origin main`, `vercel.json`

## Human Notes

_Human notes go here. This section is preserved across machine updates._
