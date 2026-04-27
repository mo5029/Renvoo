---
title: "Renvoo Blog Publishing Workflow April 2026"
type: topic
domain: renvoo-startup
summary: "On April 27, 2026, Renvoo started publishing validated blog posts to the live website by default instead of leaving them hidden as drafts, and the recurring blog automation was updated to match that behavior."
updated_at: '2026-04-27T08:25:00.000Z'
review_after: '2026-05-27T08:25:00.000Z'
source_ids:
  - d2b0c8494e5f4f91
source_note_links:
  - '[[wiki/sources/renvoo-blog-publishing-and-automation-update-april-2026]]'
related_links:
  - '[[wiki/topics/renvoo-website-seo-and-blog-engine-april-2026]]'
  - '[[wiki/topics/renvoo-go-to-market]]'
  - '[[wiki/topics/renvoo-market-and-icp]]'
claims:
  - statement: "Validated Renvoo blog posts now appear on the public website by default once they pass the repo's quality and compliance checks."
    confidence: high
    evidence: "content/blog/*.md, src/lib/blog-generator.js, dist/site/blog/index.html"
  - statement: "The daily Codex automation now targets published posts first and only falls back to draft when the post is weak or unsafe."
    confidence: high
    evidence: "automation update for daily-renvoo-blog-draft on 2026-04-27"
---
# Renvoo Blog Publishing Workflow April 2026

## Snapshot

On April 27, 2026, Renvoo fixed a practical publishing problem in the website content system: validated blog posts existed, but they were not appearing on the public site because they were still marked as drafts.

The solution was both content-level and workflow-level:

- publish the finished Dutch posts that were already validated
- change the repo generator to publish by default
- update the recurring automation so future posts follow the same rule

## Why This Mattered

The blog engine had already been built and validated, but its real business value was muted because the newest Dutch posts were invisible to site visitors.

That created a gap between:

- the content automation effort
- the website's visible SEO surface
- the user's expectation that new blog work should actually ship

Fixing that gap matters because Renvoo is using the blog not as a side project, but as part of its search, AI-search, and clinic-discovery strategy.

## What Changed In Practice

Three recent Dutch posts were published:

- late cancellations in dental clinics
- appointment confirmation in dental clinics
- recovering open slots in dental clinics

After that change, the site build emitted:

- a populated Dutch blog index
- individual Dutch article pages for those posts

The generator default was then updated so passing posts publish automatically unless draft mode is explicitly requested.

## Operating Rule To Remember

The durable rule is now:

- if a post passes validation and evidence posture is acceptable, it should publish
- if quality, evidence, duplication, or compliance is weak, it should stay draft

That rule now exists in both places that matter:

- the repo code path
- the recurring Codex automation prompt

## Recreate Or Inspect

- inspect post frontmatter in `content/blog/`
- inspect the default publish mode in `src/lib/blog-generator.js`
- build the site with `npm run site:build`
- inspect rendered output in `dist/site/blog/`
- validate posts with `npm run blog:validate`

## Sources

- [[wiki/sources/renvoo-blog-publishing-and-automation-update-april-2026]]

## Related

- [[wiki/topics/renvoo-website-seo-and-blog-engine-april-2026]]
- [[wiki/topics/renvoo-go-to-market]]
- [[wiki/topics/renvoo-market-and-icp]]

## Human Notes

_Human notes go here. This section is preserved across machine updates._
