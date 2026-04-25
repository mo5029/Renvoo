# Renvoo Website Version History

This repository now preserves the major Renvoo website states as Git tags and dedicated branches so earlier versions are easy to inspect, restore, or compare.

## GitHub

- Repository: `https://github.com/mo5029/Renvoo`

## Version Map

### `website-v1-foundation`

- Commit: `77abdfa`
- Branch lineage: `codex/renvoo-website-foundation`
- Meaning:
  - first clinic-facing static website
  - basic funnel and deployment setup

### `website-v2-bilingual-funnel`

- Commit: `448a166`
- Branch lineage: `codex/renvoo-bilingual-funnel-redesign`
- Meaning:
  - Dutch-first bilingual funnel redesign
  - calmer page structure and stronger booking flow

### `website-v3-seo-blog-engine`

- Commit: `a8d62be`
- Branch lineage: `codex/seo-ai-growth-engine`
- Meaning:
  - expanded SEO architecture
  - markdown blog engine
  - daily blog automation
  - sitemap, `llms.txt`, schema, and blog validation

### `website-v4-funnel-live`

- Commit: `0bb0006`
- Branch lineage: `codex/renvoo-funnel-live-polish`
- Meaning:
  - preserved the polished funnel version that matched the live design direction
  - includes the logo cleanup, shorter motion, simplified downloads, and booking-flow polish

### `website-v5-funnel-seo-blog`

- Branch lineage: `codex/renvoo-funnel-seo-blog`
- Meaning:
  - combines the polished funnel experience from `website-v4-funnel-live`
  - adds the blog/SEO system from `website-v3-seo-blog-engine`
  - keeps the funnel as the primary commercial experience while integrating:
    - markdown blog content in `content/blog/`
    - blog validation and compliance rules
    - daily blog generation scripts
    - sitemap, `robots.txt`, and `llms.txt` generation

## How To Inspect A Version

Show a tagged snapshot:

```bash
git checkout website-v4-funnel-live
```

Return to the latest integrated branch:

```bash
git checkout codex/renvoo-funnel-seo-blog
```

Compare two versions:

```bash
git diff website-v4-funnel-live..codex/renvoo-funnel-seo-blog -- src/site content/blog
```

## Source Of Truth

- Funnel pages: `src/site/`
- Shared renderer/content model: `src/site/lib/`
- Blog source: `content/blog/`
- Blog generation and validation: `scripts/` and `src/lib/`

Generated route artifacts such as `src/site/.generated/` and generated blog HTML routes are intentionally ignored. The durable source of truth is the markdown content plus the shared renderer.
