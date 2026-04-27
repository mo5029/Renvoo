---
title: "Renvoo Blog Publishing And Automation Update (April 2026)"
type: source
domain: renvoo-startup
source_id: d2b0c8494e5f4f91
source_kind: text
summary: "Structured capture of the April 27, 2026 change that published the validated Dutch Renvoo blog posts to the website, changed the repo generator to publish by default, and updated the recurring Codex automation to publish passing posts."
updated_at: '2026-04-27T08:25:00.000Z'
created_at: '2026-04-27T08:25:00.000Z'
raw_path: raw/2026/04/27-renvoo-blog-publishing-and-automation-update-april-2026.md
storage_strategy: wiki-only
archive_chunk_count: 0
tags:
  - website
  - blog
  - automation
  - publishing
  - seo
---
# Source: Renvoo Blog Publishing And Automation Update (April 2026)

## Source Summary

This source records the April 27, 2026 fix that turned the Renvoo blog from a mostly hidden draft system into a live website section with published Dutch posts.

The underlying issue was simple: the blog renderer only outputs posts with `status: "published"`, but the recent Dutch posts had been left in `draft`. The daily automation prompt also still instructed the system to default to draft wording.

## What Changed

### Published Existing Dutch Posts

Three validated posts were switched from `draft` to `published`:

- `late-afzeggingen-in-de-tandartspraktijk`
- `afspraakbevestiging-in-de-tandartspraktijk`
- `open-plekken-tandartspraktijk-opvullen`

That immediately made them eligible for the generated website blog index and article routes.

### Changed Repo Generator Default

The repo blog generator in `src/lib/blog-generator.js` now defaults to publish mode unless `BLOG_PUBLISH_MODE=draft` is explicitly set.

That means:

- passing posts publish automatically by default
- low-quality or low-evidence posts can still fall back to draft
- manual preview remains available through dry-run

### Updated Automation

The recurring Codex automation with id `daily-renvoo-blog-draft` was updated in the app so it now:

- publishes posts when validation and evidence are strong enough
- only keeps drafts when quality, compliance, or evidence is weak
- reports published-versus-draft outcome explicitly

## Verification

The following checks passed after the change:

- `npm run blog:validate`
- `npm run site:build`
- `npm test`

The site build output confirmed that the Dutch blog index and individual article pages now include the published Dutch posts.

## Key Files

- `content/blog/late-afzeggingen-in-de-tandartspraktijk.md`
- `content/blog/afspraakbevestiging-in-de-tandartspraktijk.md`
- `content/blog/open-plekken-tandartspraktijk-opvullen.md`
- `src/lib/blog-generator.js`
- `README.md`

## Raw Reference

- Raw note: `raw/2026/04/27-renvoo-blog-publishing-and-automation-update-april-2026.md`

## Topics

- [[wiki/topics/renvoo-blog-publishing-workflow-april-2026]]
- [[wiki/topics/renvoo-website-seo-and-blog-engine-april-2026]]

## Claims

- The public website blog started showing the validated Dutch posts after their status was changed from draft to published. (high) — `content/blog/*.md`, `dist/site/blog/index.html`
- The repo blog generator now defaults to publishing passing posts unless draft mode is explicitly requested. (high) — `src/lib/blog-generator.js`
- The recurring Codex automation was updated to publish passing posts and only keep weak posts as drafts. (high) — app automation `daily-renvoo-blog-draft`

## Human Notes

_Human notes go here. This section is preserved across machine updates._
