# Fixes Over The Baseline LLM Wiki

- Sharded indexes prevent the single-file index from growing without bound.
- Pinecone provides semantic recall for long archives and bulky source material.
- `log.md` stays small by pointing to monthly logs in `logs/`.
- `maintenance/latest-lint.md` records stale notes, broken links, orphans, and archive gaps.
- `compact` trims oversized notes so the active wiki stays usable.
