# Renvoo Memory Instructions

This repository contains a long-term memory system for the agent working in this workspace.

## Read First

- Stable identity and rules live in [memory/system/profile.md](</Users/mohamedibrahim/Desktop/Codex Projects/Renvoo/memory/system/profile.md>) and [memory/system/instructions.md](</Users/mohamedibrahim/Desktop/Codex Projects/Renvoo/memory/system/instructions.md>).
- The active reasoning map starts at [memory/wiki/index.md](</Users/mohamedibrahim/Desktop/Codex Projects/Renvoo/memory/wiki/index.md>).
- Open questions and contradictions live in [memory/wiki/contradictions.md](</Users/mohamedibrahim/Desktop/Codex Projects/Renvoo/memory/wiki/contradictions.md>).

## Working Rules

- Keep `system/` small and stable. Do not turn it into a running log.
- Put active, distilled understanding in `wiki/`.
- Put bulky, stable, or long-tail material in the Pinecone-backed archive flow.
- After meaningful new durable context is added, ingest it through the CLI instead of hand-appending random notes.
- Prefer `npm run memory:query -- --question "..."` when historical recall matters.
- Run `npm run memory:lint` and `npm run memory:compact` after major ingestion bursts.

## Human Editing

- Human edits belong under the `## Human Notes` section of generated notes.
- Do not overwrite human notes during regeneration.
