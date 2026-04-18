# Renvoo Memory Schema

This memory system follows Karpathy's LLM Wiki pattern and keeps the original three-layer model:

- `raw/` for immutable source documents
- `wiki/` for generated markdown knowledge pages
- `AGENTS.md` and `system/` for operating rules

## Scale Fixes

- Use `wiki/index.md` as the primary navigation page, but shard detailed catalogs under `wiki/indexes/`.
- Keep identity and operating rules in `system/` instead of letting them bloat the wiki.
- Keep bulky or stable material searchable in Pinecone and only distill hot knowledge into the wiki.
- Run lint and compact passes periodically.
