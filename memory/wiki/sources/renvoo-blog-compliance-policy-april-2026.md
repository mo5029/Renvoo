---
title: "Renvoo Blog Compliance Policy (April 2026)"
type: source
domain: renvoo-startup
source_id: manual-renvoo-blog-compliance-policy-2026-04-24
source_kind: manual-review
summary: "Structured capture of the April 24, 2026 content-compliance layer added to Renvoo's blog system, including policy files, deterministic validation, generator rejection behavior, and automation alignment."
updated_at: 2026-04-24T10:10:00Z
created_at: 2026-04-24T10:10:00Z
raw_path: raw/2026/04/24-renvoo-blog-compliance-policy-april-2026.md
storage_strategy: wiki-only
archive_chunk_count: 0
tags:
  - renvoo
  - blog
  - compliance
  - policy
  - automation
---
# Source: Renvoo Blog Compliance Policy (April 2026)

## Source Summary

This source captures the hard compliance layer added to Renvoo's blog generation system on April 24, 2026. The work translated user-specified ethical and content restrictions into separate policy markdown files, deterministic validation rules, generator prompt constraints, persistence blocking on violations, and an updated app-level blog automation prompt.

## Policy Files Added

- `docs/compliance/blog-content-compliance.md`
- `docs/compliance/blog-media-compliance.md`

## Rules Captured

- no false or exaggerated claims
- no fake authority or fake proof
- no manipulative pressure or clickbait
- no gambling or `riba` references
- no unethical data-use suggestions
- no inappropriate, sexualized, adult, alcohol, or nightlife content
- no images or references to women in blog/media outputs
- professional, clinic-appropriate tone only

## Implementation

- `src/lib/blog-compliance.js`
- `src/lib/blog-content.js`
- `src/lib/blog-generator.js`
- `scripts/blog-generate.js`
- `tests/blog-system.test.ts`
- updated Codex automation `daily-renvoo-blog-draft`

## Operating Rule

Compliance violations are no longer treated as a “save draft anyway” issue. Violating drafts are rejected before persistence.

## Verification

- `npm run build` passed
- `npm test` passed
- `npm run blog:validate` passed
- `npm run blog:generate -- --dry-run` passed with safe draft behavior

## Topics

- [[wiki/topics/renvoo-blog-compliance-and-safety-layer-april-2026]]
- [[wiki/topics/renvoo-website-seo-and-blog-engine-april-2026]]

## Claims

- Renvoo now has explicit markdown policy files governing blog content and media outputs. (high) — `docs/compliance/*.md`
- Blog validation now includes a deterministic compliance scan for prohibited claims, media, and tone violations. (high) — `src/lib/blog-compliance.js`, `src/lib/blog-content.js`
- Compliance failures now block persistence instead of silently saving bad drafts. (high) — `src/lib/blog-generator.js`
- The recurring app automation has been updated to follow the same policy. (high) — automation `daily-renvoo-blog-draft`

## Human Notes

_Human notes go here. This section is preserved across machine updates._
