---
title: "Renvoo Website SEO And Blog Engine April 2026"
type: topic
domain: renvoo-startup
summary: "On April 24, 2026, Renvoo's public site was rebuilt into a Dutch-first bilingual search engine that supports classic SEO, AI-search extractability, and a daily markdown blog pipeline with validation and cautious publish controls."
updated_at: 2026-04-24T09:44:50Z
review_after: 2026-05-24T09:44:50Z
source_ids:
  - manual-renvoo-seo-growth-engine-2026-04-24
source_note_links:
  - "[[wiki/sources/renvoo-seo-and-ai-search-growth-engine-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-go-to-market]]"
  - "[[wiki/topics/renvoo-market-and-icp]]"
  - "[[wiki/topics/renvoo-roadmap-and-proof-plan]]"
  - "[[wiki/topics/renvoo-company-overview]]"
claims:
  - statement: "The website is now structured as a Dutch-root / English-mirror multi-page commercial site instead of a thin landing page."
    confidence: high
    evidence: "site-content.js, site-render.js, generated route manifest"
  - statement: "Renvoo now has an in-repo markdown blog system with scoring, duplicate detection, and cron-ready daily generation."
    confidence: high
    evidence: "blog-content.js, blog-generator.js, scripts/blog-validate.js, scripts/generate-daily-blog.js"
  - statement: "The website's search posture now explicitly targets both classic search engines and extractive AI systems without claiming proof that the company does not yet have."
    confidence: high
    evidence: "page copy, FAQ blocks, schema output, llms.txt, README"
---
# Renvoo Website SEO And Blog Engine April 2026

## Snapshot

On April 24, 2026, the Renvoo public site shifted from a relatively narrow marketing surface into a fuller search and discovery engine. The site now has Dutch commercial pages at the root, matching English mirrors under `/en/`, structured metadata and schema, a markdown blog system, and a cron-ready daily content pipeline. The design goal was not "more pages for the sake of pages." It was to create clearer entry points for the actual buying questions Renvoo cares about: no-shows, appointment reminders, cancellation management, dental-clinic operations, and private-clinic workflow recovery.

## Why This Was Done

The previous site shape was too limited for search:

- not enough distinct pages for high-intent problems and segments
- no blog architecture
- no About or Use Cases structure
- no article schema
- no breadcrumb system
- no `llms.txt`
- no direct way to target both Dutch local intent and broader English AI/discovery queries

Renvoo is still early and pilot-stage, so the site needed to become more findable without pretending the company already has large-scale proof. That is why the copy stays operational, narrow, and explicit about pilot-stage posture.

## What Was Built

### Commercial Page System

The public site now includes:

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
- Individual blog article pages
- Privacy
- Patient Notice
- 404

Dutch is the business-first default for local relevance. English exists as a mirrored discovery layer for broader search, partner sharing, and AI citation opportunities.

### Search-Friendly Rendering

The shared renderer now produces:

- one clear H1 per page
- answer-first sections near the top
- FAQ blocks on key pages
- breadcrumb navigation
- internal-link modules
- page-level OpenGraph and Twitter tags
- canonical URLs and `hreflang` alternates when `SITE_URL` is set
- JSON-LD for `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, and `Article`

### Blog Engine

The blog system is repo-native rather than CMS-heavy.

- posts live in `content/blog/`
- posts use markdown with frontmatter
- the generator selects from seeded topic clusters tied to Renvoo's ICP
- the validator scores content before it can remain published
- duplicate topic detection exists before saving output
- every post is expected to include FAQ, sources, internal links, and article schema

### Daily Automation

The daily blog flow is:

1. choose a topic from approved seeds
2. load trusted research sources from the registry
3. fetch source summaries
4. generate a draft or fallback outline
5. optimize the structure for SEO and AI-search extraction
6. validate the result
7. keep the post as draft if it misses quality or safety gates
8. optionally persist back to GitHub when cron is configured for durable publishing

There is now also a Codex desktop heartbeat automation named `Daily Renvoo Blog Draft` with id `daily-renvoo-blog-draft`, scheduled daily at `07:00`. Its job is to create one new blog draft in this repo, validate it, and update the memory vault after each run. This is the simplest way to keep the blog moving without depending on a separately managed `OPENAI_API_KEY` inside the repository.

## How To Run Or Recreate It

Core commands:

- `npm run site:generate`
- `npm run site:build`
- `npm run build`
- `npm test`
- `npm run blog:validate`
- `npm run blog:generate -- --dry-run`
- `npm run generate:daily-blog`

Important environment variables:

- `SITE_URL`
- `SITE_CONTACT_EMAIL`
- `OPENAI_API_KEY`
- `BLOG_PUBLISH_MODE`
- `BLOG_DEFAULT_LOCALE`
- `BLOG_MIN_SCORE`
- `BLOG_MAX_POSTS_PER_DAY`
- `BLOG_RESEARCH_SOURCES`
- `BLOG_PERSIST_DESTINATION`
- `CRON_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPOSITORY`
- `GITHUB_BRANCH`

## Why The Architecture Looks This Way

This was intentionally kept static-first and repo-native:

- no framework migration
- no extra CMS
- no hidden publishing service
- markdown content remains versioned with the code
- SEO logic lives close to the route/content registry
- daily automation can run locally, in GitHub Actions, or through Vercel Cron

That keeps the system easy to inspect, safer for early-stage claims, and easier to maintain while the company is still validating the wedge.

## Boundaries To Remember

- This content system improves discoverability, not proof. It should not imply validated clinical or commercial outcomes that Renvoo does not yet have.
- The daily blog pipeline is safe-by-default, but durable auto-publishing still depends on the right environment variables and GitHub/Vercel setup.
- `SITE_URL` is required for production canonicals, `hreflang`, and sitemap generation. Local builds intentionally omit those tags when the variable is missing.

## Sources

- [[wiki/sources/renvoo-seo-and-ai-search-growth-engine-april-2026]]

## Related

- [[wiki/topics/renvoo-go-to-market]]
- [[wiki/topics/renvoo-market-and-icp]]
- [[wiki/topics/renvoo-roadmap-and-proof-plan]]
- [[wiki/topics/renvoo-company-overview]]

## Maintenance

- Review after: 2026-05-24T09:44:50Z
- Estimated tokens: 276

## Human Notes

_Human notes go here. This section is preserved across machine updates._
