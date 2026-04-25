---
title: "Renvoo Website Version History And Funnel SEO Integration April 2026"
type: topic
domain: renvoo-startup
summary: "On April 25, 2026, Renvoo preserved the major website states on GitHub with version tags and created a new branch that combines the polished funnel with the blog and SEO engine."
updated_at: 2026-04-25T12:30:00Z
review_after: 2026-05-25T12:30:00Z
source_ids:
  - manual-renvoo-website-version-history-2026-04-25
source_note_links:
  - "[[wiki/sources/renvoo-website-version-history-and-funnel-seo-integration-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-company-overview]]"
  - "[[wiki/topics/renvoo-product-architecture]]"
  - "[[wiki/topics/renvoo-roadmap-and-proof-plan]]"
claims:
  - statement: "Renvoo's main website states are now preserved as named Git tags instead of only existing as branch tips or dirty local worktrees."
    confidence: high
    evidence: "docs/website/versions.md, Git tags `website-v1-foundation` through `website-v5-funnel-seo-blog`"
  - statement: "The new `codex/renvoo-funnel-seo-blog` branch keeps the polished funnel as the commercial front-end while integrating the markdown blog and SEO engine behind it."
    confidence: high
    evidence: "site-render.js, content/blog, scripts/blog-validate.js, docs/website/versions.md"
---
# Renvoo Website Version History And Funnel SEO Integration April 2026

## Snapshot

Renvoo now has a clearer website lineage. Earlier website states were preserved as tagged snapshots on GitHub, and a new branch was created to combine the best funnel version with the later blog and SEO system instead of forcing a choice between them.

## Why This Was Done

By April 25, 2026, Renvoo had two valuable website directions:

- a polished funnel-focused site that matched the desired launch look and conversion flow
- a broader SEO/blog engine that added search reach, structured content, and daily blog automation

Those two states existed in different parts of the Git history, and one of the best funnel versions only existed in a dirty local Codex worktree. That made the version history harder to trust and harder to revisit later. This pass fixed that.

## What Was Preserved

The major website milestones are now intentionally named:

- `website-v1-foundation`
- `website-v2-bilingual-funnel`
- `website-v3-seo-blog-engine`
- `website-v4-funnel-live`
- `website-v5-funnel-seo-blog`

The practical map of those versions lives in `docs/website/versions.md`.

## What The New Integrated Branch Does

The branch `codex/renvoo-funnel-seo-blog` starts from the polished funnel state and adds:

- markdown blog content in `content/blog/`
- blog validation and daily generation scripts
- sitemap, `robots.txt`, and `llms.txt` generation
- blog compliance policy files
- shared rendering that can output blog index and article pages without replacing the funnel as the main navigation path

That means the site can keep the calmer founder-led funnel while still gaining search surfaces and an in-repo content engine.

## How To Recreate Or Inspect It

- review the version map in `docs/website/versions.md`
- inspect tags directly with `git checkout <tag>`
- use `git diff website-v4-funnel-live..codex/renvoo-funnel-seo-blog -- src/site content/blog`
- rebuild locally with:
  - `npm install`
  - `npm run site:build`
  - `npm run blog:validate`
  - `npm test`

## Why This Matters

This makes the website history legible for both product work and launch operations:

- earlier versions are no longer easy to lose
- the best funnel version remains recoverable
- the blog/SEO system can evolve without overwriting the launch-oriented funnel story
- future decisions can compare versions by name instead of relying on memory

## Sources

- [[wiki/sources/renvoo-website-version-history-and-funnel-seo-integration-april-2026]]

## Related

- [[wiki/topics/renvoo-company-overview]]
- [[wiki/topics/renvoo-product-architecture]]
- [[wiki/topics/renvoo-roadmap-and-proof-plan]]

## Maintenance

- Review after: 2026-05-25T12:30:00Z
- Estimated tokens: 216

## Human Notes

_Human notes go here. This section is preserved across machine updates._
