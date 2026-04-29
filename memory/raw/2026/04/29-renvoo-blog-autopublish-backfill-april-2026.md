---
source_id: 10847830712819f2
kind: text
title: "Renvoo blog autopublish backfill April 2026"
created_at: 2026-04-29T13:55:46.711Z
---


Fixed the gap between blog generation and website publication.

Problem:
The recurring Renvoo blog workflow was generating and validating posts, but some posts were only being written into a local workspace and were not consistently reaching GitHub main or the live website. This created a mismatch where posts could be marked published in local files but still not appear publicly.

What changed:
- Updated scripts/blog-generate.js so GitHub persistence becomes the default when GITHUB_TOKEN and GITHUB_REPOSITORY are available, instead of requiring BLOG_PERSIST_DESTINATION=github to be set manually.
- Updated scripts/generate-daily-blog.js with the same default-to-GitHub behavior.
- Backfilled the two missing published Dutch posts onto the clean production publisher clone:
  - no-show-beleid-tandartspraktijk
  - wachtlijst-tandartspraktijk
- Revalidated the full blog set and rebuilt the site to confirm both posts are emitted in the static output.

Operational decision:
A separate clean production clone at /tmp/renvoo-blog-publisher-main is now the safer working directory for the recurring publishing automation because the primary local workspace may contain unrelated in-progress edits.

Why this matters:
The automation should not stop at local file creation. For the website to update reliably, validated published posts need to persist upstream into GitHub main so deployment can pick them up.

