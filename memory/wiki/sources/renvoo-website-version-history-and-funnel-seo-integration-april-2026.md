---
title: "Renvoo Website Version History And Funnel SEO Integration (April 2026)"
type: source
domain: renvoo-startup
source_id: manual-renvoo-website-version-history-2026-04-25
source_kind: manual-review
summary: "Structured capture of the April 25, 2026 pass that preserved Renvoo website versions on GitHub and created a new branch combining the polished funnel with the blog and SEO engine."
updated_at: 2026-04-25T12:30:00Z
created_at: 2026-04-25T12:30:00Z
raw_path: raw/2026/04/25-renvoo-website-version-history-and-funnel-seo-integration.md
storage_strategy: wiki-only
archive_chunk_count: 0
tags:
  - renvoo
  - website
  - git
  - versions
  - seo
  - blog
---
# Source: Renvoo Website Version History And Funnel SEO Integration (April 2026)

## Source Summary

This source records the April 25, 2026 version-preservation pass for the Renvoo website. The work gave the main website milestones explicit Git tags, preserved the polished live funnel from a dirty local worktree, and created a new integration branch that combines that funnel with the markdown blog and SEO system.

## Website Versions Preserved

- `website-v1-foundation`
  - commit `77abdfa`
  - first clinic-facing website foundation
- `website-v2-bilingual-funnel`
  - commit `448a166`
  - Dutch-first bilingual funnel redesign
- `website-v3-seo-blog-engine`
  - commit `a8d62be`
  - SEO architecture, blog engine, and automation
- `website-v4-funnel-live`
  - commit `0bb0006`
  - preserved polished funnel site from the live-design worktree
- `website-v5-funnel-seo-blog`
  - current integrated branch snapshot

## New Branch

- branch: `codex/renvoo-funnel-seo-blog`

This branch was created from the preserved funnel snapshot and then extended with the blog/SEO system rather than rebuilding the website again from scratch.

## What Was Brought Into The Integration Branch

- blog source under `content/blog/`
- blog validation and generation scripts under `scripts/`
- blog parsing, markdown rendering, compliance, and generation logic under `src/lib/`
- updated site generation and postbuild logic in `config/`
- blog-aware rendering in `src/site/lib/site-render.js`
- blog route copy and navigation in `src/site/lib/site-content.js`
- compliance policy files under `docs/compliance/`
- version map under `docs/website/versions.md`

## Verification

- `npm run site:build` passed
- `SITE_URL=https://renvoo.nl npm run site:build` passed
- `npm test` passed
- `npm run blog:validate` passed

## Why This Was Necessary

The funnel site and the SEO/blog engine each solved a different problem:

- the funnel was stronger for launch clarity and conversion
- the SEO/blog engine was stronger for discovery and content scaling

Without explicit version preservation, it would have been easy to lose the good funnel state or blur the differences between versions. This pass made the history durable and made the next website iteration easier to reason about.

## Key Files

- `docs/website/versions.md`
- `src/site/lib/site-render.js`
- `src/site/lib/site-content.js`
- `content/blog/`
- `scripts/blog-generate.js`
- `scripts/blog-validate.js`
- `config/generate-site-pages.mjs`
- `config/site-postbuild.mjs`

## Topics

- [[wiki/topics/renvoo-website-version-history-and-funnel-seo-integration-april-2026]]
- [[wiki/topics/renvoo-roadmap-and-proof-plan]]

## Claims

- Renvoo's main website states are now preserved as explicit Git tags on GitHub rather than only as branch pointers. (high) — `git tag`, `docs/website/versions.md`
- The polished live funnel was preserved separately before integrating the later blog and SEO system. (high) — branch `codex/renvoo-funnel-live-polish`, tag `website-v4-funnel-live`
- The new integration branch keeps the funnel UX while adding blog generation, validation, and SEO-supporting build outputs. (high) — `codex/renvoo-funnel-seo-blog`, `content/blog/`, `src/site/lib/site-render.js`

## Human Notes

_Human notes go here. This section is preserved across machine updates._
