---
title: Renvoo blog autopublish backfill April 2026
type: source
domain: renvoo-startup
source_id: 10847830712819f2
source_kind: text
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
updated_at: '2026-04-29T13:55:46.755Z'
created_at: '2026-04-29T13:55:46.711Z'
raw_path: raw/2026/04/29-renvoo-blog-autopublish-backfill-april-2026.md
storage_strategy: wiki-only
archive_chunk_count: 0
tags:
  - blog
  - automation
  - publishing
  - website
---
# Source: Renvoo blog autopublish backfill April 2026
## Source Summary
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
- Followed up on an English-surface issue where `/en/blog/` still showed only the single English article even though the Dutch archive was healthy.
- Updated `src/site/lib/site-render.js` so the English blog index now shows English articles first and then a clearly labeled Dutch archive fallback when English inventory is sparse.
- Added the matching blog copy in `src/site/lib/site-content.js` and test coverage in `tests/blog-system.test.ts`.

[truncated]
## Raw Reference
- Raw note: raw/2026/04/29-renvoo-blog-autopublish-backfill-april-2026.md
## Archive
- Storage strategy: wiki-only
- Pinecone synced: no
- Archive chunks: 0
## Topics
- [[wiki/topics/renvoo-blog-autopublish-backfill-april-2026]]
## Entities
- No entity notes generated yet.
## Decisions
- No decision notes generated yet.
## Claims
- No explicit claims captured yet.
## Human Notes
_Human notes go here. This section is preserved across machine updates._
