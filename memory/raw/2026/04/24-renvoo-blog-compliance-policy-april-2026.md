---
source_id: manual-renvoo-blog-compliance-policy-2026-04-24
kind: manual-review
title: "Renvoo blog compliance policy April 2026"
created_at: 2026-04-24T10:10:00Z
---

On April 24, 2026, Renvoo added a hard compliance layer for blog generation and related SEO content.

What was added:

- `docs/compliance/blog-content-compliance.md`
- `docs/compliance/blog-media-compliance.md`

What these rules do:

- forbid false, exaggerated, or unverified claims
- forbid fake authority, fake citations, fake testimonials, and fake case studies
- forbid manipulative pressure, fear tactics, clickbait, and dark-pattern style persuasion
- forbid unethical data-use suggestions
- forbid gambling-like mechanics and `riba` / interest-based framing
- forbid inappropriate, sexualized, adult, alcohol, nightlife, or disrespectful content
- forbid images or references to women in blog/media outputs
- require professional tone and clinic/business-appropriate examples only

Implementation details:

- Added deterministic compliance scanning in `src/lib/blog-compliance.js`.
- Wired compliance checks into `validateBlogPost` in `src/lib/blog-content.js`.
- Updated `src/lib/blog-generator.js` so generated drafts receive the compliance policy in their prompt context and are rejected before persistence if compliance fails.
- Updated `scripts/blog-generate.js` so compliance information is written into the latest-run artifact.
- Added tests covering prohibited manipulative claims and prohibited image/media references.
- Updated the Codex heartbeat automation `daily-renvoo-blog-draft` so it follows the same compliance policy.

Behavioral rule:

- if a draft violates compliance, it must be rewritten or rejected
- it should not quietly persist as a draft just because the validator noticed a problem

Verification:

- `npm run build` passed
- `npm test` passed
- `npm run blog:validate` passed
- `npm run blog:generate -- --dry-run` still behaved safely and returned a draft outcome
