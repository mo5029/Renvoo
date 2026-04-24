---
title: "Renvoo Blog Compliance And Safety Layer April 2026"
type: topic
domain: renvoo-startup
summary: "On April 24, 2026, Renvoo turned blog-content restrictions into an enforced compliance layer with policy files, deterministic validation, blocked persistence on violations, and aligned automation prompts."
updated_at: 2026-04-24T10:10:00Z
review_after: 2026-05-24T10:10:00Z
source_ids:
  - manual-renvoo-blog-compliance-policy-2026-04-24
source_note_links:
  - "[[wiki/sources/renvoo-blog-compliance-policy-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-website-seo-and-blog-engine-april-2026]]"
  - "[[wiki/topics/renvoo-compliance-and-data-boundaries]]"
claims:
  - statement: "Blog drafts that violate the new content/media restrictions are now rejected instead of being quietly saved."
    confidence: high
    evidence: "blog-generator.js"
  - statement: "The compliance policy is now durable in three places: repo policy files, validator/generator code, and the app automation prompt."
    confidence: high
    evidence: "docs/compliance/*.md, blog-compliance.js, automation daily-renvoo-blog-draft"
---
# Renvoo Blog Compliance And Safety Layer April 2026

## Snapshot

Renvoo now has an explicit hard compliance layer for blog generation. This was added because the content system and daily automation had become important enough that policy could not live only in chat instructions. The new setup stores the rules as markdown policy files, enforces them in the validator and generator, and applies them to the recurring app automation as well.

## What Changed

### Policy Files

Two separate markdown policy files now define the content boundary:

- `docs/compliance/blog-content-compliance.md`
- `docs/compliance/blog-media-compliance.md`

### Enforced Validation

The blog validator now scans for prohibited content patterns such as:

- exaggerated guarantees
- fake-authority language
- manipulative urgency
- clickbait
- gambling or `riba` references
- privacy misuse suggestions
- sexual/adult content
- alcohol/nightlife references
- image markup
- references to women

### Rejection Behavior

If compliance fails, the draft is rejected before persistence. It is not enough for the system to “notice” the problem and still save a draft.

### Automation Alignment

The recurring Codex automation `daily-renvoo-blog-draft` was updated so its prompt follows the same rules that the repo now enforces in code.

## Why This Matters

Renvoo is operating in a healthcare-adjacent context where trust, restraint, and ethical handling of claims matter more than chasing clicks. The compliance layer makes that durable. It reduces the risk that later automation starts drifting into exaggerated SEO copy or inappropriate examples just because it is trying to generate content quickly.

## Sources

- [[wiki/sources/renvoo-blog-compliance-policy-april-2026]]

## Related

- [[wiki/topics/renvoo-website-seo-and-blog-engine-april-2026]]
- [[wiki/topics/renvoo-compliance-and-data-boundaries]]

## Maintenance

- Review after: 2026-05-24T10:10:00Z
- Estimated tokens: 191

## Human Notes

_Human notes go here. This section is preserved across machine updates._
