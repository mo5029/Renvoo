---
source_id: manual-renvoo-seo-growth-engine-2026-04-24
kind: manual-review
title: "Renvoo SEO and AI search growth engine April 2026"
created_at: 2026-04-24T09:44:50Z
---

This note captures the April 24, 2026 implementation pass that turned the Renvoo marketing site into a Dutch-first bilingual SEO and AI-search acquisition engine with an in-repo markdown blog and a cron-ready daily draft pipeline.

Goals of the pass:

- make the site materially stronger for classic Google SEO
- make the content easier for AI systems to extract and cite
- create clearer local/industry discovery pages for Dutch dental clinics and other private clinics
- add a maintainable daily blog workflow that stays conservative about unsupported claims

Main architectural changes:

- Replaced the old landing-page-centric structure with shared route/content generation under `src/site/lib/site-content.js`, `src/site/lib/site-render.js`, and `scripts/generate-site-pages.js`.
- Added Dutch commercial pages at the root and English mirrors under `/en/`.
- Added new route types for:
  - home
  - about
  - contact
  - use cases
  - dental clinics
  - private clinics
  - no-show reduction
  - appointment reminders
  - cancellation management
  - blog index
  - blog articles
  - privacy
  - patient notice
  - 404
- The generated site now produces 28 pages from the shared content registry plus markdown blog posts.

Technical SEO work implemented:

- Page-specific title tags and meta descriptions for every commercial and legal page.
- Canonical URLs and `hreflang` alternates when `SITE_URL` is set.
- OpenGraph and Twitter metadata.
- Breadcrumb UI and `BreadcrumbList` schema on non-home and article pages.
- `Organization`, `WebSite`, `SoftwareApplication`, `FAQPage`, and `Article` JSON-LD where appropriate.
- `robots.txt`, `sitemap.xml`, and `llms.txt` generation in `config/site-postbuild.mjs`.
- Stronger internal linking between commercial pages, use cases, blog content, and contact flow.
- Answer-first sections, FAQ blocks, structured sections, and cleaner semantic landmarks for extractability.

AI SEO / GEO work implemented:

- Every commercial page now includes a short direct-answer section near the top.
- Content avoids generic AI language and stays grounded in Renvoo's actual wedge:
  Dutch dental clinics first, operational workflow framing, non-clinical data boundaries, and pilot-stage honesty.
- FAQ and comparison-style sections were added to make content easier for AI systems to cite.
- `llms.txt` summarizes the website, ICP, product definition, and blog section for AI crawlers.

Blog/content system implemented:

- Added markdown blog storage under `content/blog/`.
- Added sample published posts:
  - `no-show-software-voor-tandartspraktijken`
  - `waarom-appointment-reminders-alleen-niet-genoeg-zijn`
  - `dental-clinic-no-show-software`
- Added blog helpers under:
  - `src/lib/blog-markdown.js`
  - `src/lib/blog-content.js`
  - `src/lib/blog-generator.js`
  - `src/lib/github-publish.js`
- Blog frontmatter includes title, slug, date, updated, excerpt, meta title, meta description, primary keyword, secondary keywords, category, status, locale, search intent, sources, FAQ, and schema data.

Daily automation implemented:

- Local generation command: `npm run blog:generate`
- Validation command: `npm run blog:validate`
- Daily wrapper: `npm run generate:daily-blog`
- Vercel cron entry in `vercel.json` hitting `/api/cron/daily-blog`
- Daily generation pipeline stages:
  - topic seed selection
  - research-source selection from `content/blog-research-sources.json`
  - source fetch and summary extraction
  - outline/draft generation
  - SEO and AI-search structuring
  - duplicate detection
  - scoring
  - save as draft or publish depending on score and mode
  - optional GitHub persistence when token/repo env vars are configured

Safety and quality controls:

- The generator does not invent citations or statistics on purpose.
- Missing or weak research sources degrade the result and should push content toward draft.
- Duplicate topic detection exists before writing output.
- Validation checks include title length, meta description length, word count, heading structure, keyword usage, internal links, FAQ/schema presence, source presence, and score threshold.
- `BLOG_PUBLISH_MODE` only allows publish when the post still clears the score gate; otherwise the result is downgraded to draft.

Supporting docs updated:

- `README.md`
- `docs/website/deployment.md`
- `.env.example`

Key environment variables for later use:

- `SITE_URL`
- `SITE_CONTACT_EMAIL`
- `OPENAI_API_KEY`
- `BLOG_PUBLISH_MODE`
- `BLOG_DEFAULT_LOCALE`
- `BLOG_OUTPUT_DIR`
- `BLOG_RESEARCH_SOURCES`
- `BLOG_MIN_SCORE`
- `BLOG_MAX_POSTS_PER_DAY`
- `BLOG_PERSIST_DESTINATION`
- `CRON_SECRET`
- `GITHUB_TOKEN`
- `GITHUB_REPOSITORY`
- `GITHUB_BRANCH`

Verification run after implementation:

- `npm run site:build` passed
- `npm run build` passed
- `npm test` passed
- `npm run blog:validate` passed

One implementation detail worth remembering:

- The build uses generated HTML entries under `src/site/.generated/`, and `config/site-postbuild.mjs` then copies them into the final `dist/site/` route structure and emits `robots.txt`, `sitemap.xml`, and `llms.txt`.
- Canonical and `hreflang` tags are intentionally omitted from local/non-production builds when `SITE_URL` is not set, because Vite will otherwise try to resolve those absolute-looking paths during local generation.
