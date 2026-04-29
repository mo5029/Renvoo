---
title: Renvoo blog autopublish backfill April 2026
type: topic
domain: renvoo-startup
summary: >-
  Fixed the gap between blog generation and website publication.


  Problem:

  The recurring Renvoo blog workflow was generating and validating posts, but
  some posts were only being written into a local workspace and were not
  consistently reaching GitHub main or the live website. This created a mismatch
  where posts could be marked published in local files but still not appear
  publicly.


  What changed:

  - Updated scripts/blog-generate.js so GitHub persistence becomes the default
  when GITHUB_TOKEN and GITHUB_REPOSITORY are available, instead of requiring
  BLOG_PERSIST_DESTINATION=github to be set manually.

  - Updated scripts/generate-daily-blog.js with the same default-to-GitHub
  behavior.

  - Backfilled the two missing published Dutch posts onto the clean production
  publisher clone:
    - no-show-beleid-tandartspraktijk
    - wachtlijst-tandartspraktijk
  - Revalidated the full blog set and rebuilt the site


  [truncated]
updated_at: '2026-04-29T13:55:46.758Z'
review_after: '2026-05-29T13:55:46.758Z'
source_ids:
  - 10847830712819f2
source_note_links:
  - '[[wiki/sources/renvoo-blog-autopublish-backfill-april-2026]]'
related_links: []
claims: []
---
# Renvoo blog autopublish backfill April 2026

## Snapshot

Fixed the gap between blog generation and website publication.

Problem:
The recurring Renvoo blog workflow was generating and validating posts, but some posts were only being written into a local workspace and were not consistently reaching GitHub main or the live website. This created a mismatch where posts could be marked published in local files but still not appear publicly.

What changed:
- Updated scripts/blog-generate.js so GitHub persistence becomes the default when GITHUB_TOKEN and GITHUB_REPOSITORY are available, instead of requiring BLOG_PERSIST_DESTINATION=github to be set manually.
- Updated scripts/generate-daily-blog.js with the same default-to-GitHub behavior.
- Backfilled the two missing published Dutch posts onto the clean production publisher clone:
  - no-show-beleid-tandartspraktijk
  - wachtlijst-tandartspraktijk
- Revalidated the full blog set and rebuilt the site

[truncated]

## Evidence

- Fixed the gap between blog generation and website publication.
- Problem:
- The recurring Renvoo blog workflow was generating and validating posts, but some posts were only being written into a local workspace and were not consistently reaching GitHub main or the live website. This created a mismatch where posts could be marked published in local files but still not appear publicly.
- What changed:
- - Updated scripts/blog-generate.js so GitHub persistence becomes the default when GITHUB_TOKEN and GITHUB_REPOSITORY are available, instead of requiring BLOG_PERSIST_DESTINATION=github to be set manually.

## Claims

- No explicit claims captured yet.

## Sources

- [[wiki/sources/renvoo-blog-autopublish-backfill-april-2026]]

## Related

- No related notes linked yet.

## Maintenance

- Review after: 2026-05-29T13:55:46.758Z
- Estimated tokens: 229

## Human Notes

_Human notes go here. This section is preserved across machine updates._
