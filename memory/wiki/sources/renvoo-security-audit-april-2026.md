---
title: "Renvoo Security Audit (April 2026)"
type: source
domain: renvoo-startup
source_id: d9717de15abea366
source_kind: manual-review
summary: "Structured capture of the April 24, 2026 security audit of the Renvoo memory CLI and marketing site, including dependency results, concrete code-level findings, verification commands, and the manual memory fallback after the automated ingest path failed."
updated_at: 2026-04-24T08:30:00Z
created_at: 2026-04-24T08:14:14Z
raw_path: raw/2026/04/24-renvoo-security-audit-april-2026.md
storage_strategy: wiki-only
archive_chunk_count: 0
tags:
  - renvoo
  - security
  - audit
  - website
  - memory-system
---
# Source: Renvoo Security Audit (April 2026)

## Source Summary

This source captures a full inside-out security review of the current Renvoo repository on April 24, 2026, with the code checked on branch `codex/renvoo-website-foundation`. The review covered dependency health, committed-secret exposure, CLI ingest and query boundaries, OpenAI and Pinecone export behavior, cache-trust assumptions, and the public marketing site's browser-side posture.

## Audit Method

- Dependency scan: `npm audit --json`
- Build verification: `npm run build`
- Test verification: `npm test`
- Site build verification: `npm run site:build`
- Direct code review of:
  - `src/cli.ts`
  - `src/commands/ingest.ts`
  - `src/lib/source-loader.ts`
  - `src/lib/openai.ts`
  - `src/lib/pinecone.ts`
  - `src/lib/config.ts`
  - `src/site/index.html`
  - `src/site/privacy.html`
  - `src/site/patient-notice.html`
  - `src/site/404.html`
  - `vercel.json`
  - `netlify.toml`

## Raw Reference

- Raw audit note: raw/2026/04/24-renvoo-security-audit-april-2026.md

## Verification Results

- `npm audit` reported `0` known vulnerabilities.
- `npm run build` passed.
- `npm test` passed.
- `npm run site:build` passed.
- `.env` files are ignored by git, and the repository scan did not surface committed live credentials.

## Findings Captured By This Source

- The ingest command accepts arbitrary URLs and auto-downloads linked images without scheme, host, IP-range, timeout, or size validation.
- The ingest pipeline exports raw source text to OpenAI and Pinecone whenever those integrations are configured, without a redaction gate or sensitive-source confirmation step.
- Pinecone archive requests trust the cached host in `memory/archive/cache/pinecone-index.json` before attaching the live `Api-Key` header.
- The marketing site loads Google Fonts from third-party Google domains on every page and the hosting configs do not set a Content Security Policy.

## Important Process Note

The repo's `memory:ingest` path partially succeeded by creating the raw source note for this audit, but then failed during wiki note generation with:

- `unacceptable kind of an object to dump [object Undefined]`

Because of that failure, the wiki source note, topic note, indexes, and logs for this audit were completed manually so Obsidian readers still get a usable record of what was reviewed, what was found, how it was verified, and what should be fixed next.

## Topics

- [[wiki/topics/renvoo-security-posture-april-2026]]
- [[wiki/topics/renvoo-compliance-and-data-boundaries]]
- [[wiki/topics/renvoo-open-questions-and-risks]]

## Claims

- As of April 24, 2026, the repo has no known npm CVEs from `npm audit` and no committed live secrets were surfaced during the scan. (high) — `npm audit --json`, `.gitignore`, repository secret scan
- The current ingest flow can be used as an SSRF and resource-exhaustion primitive because it fetches arbitrary URLs and linked assets without network or size guardrails. (high) — `src/cli.ts`, `src/lib/source-loader.ts`
- The current export path can send sensitive clinic or internal material to OpenAI and Pinecone without an explicit review or redaction checkpoint. (high) — `src/commands/ingest.ts`, `src/lib/openai.ts`, `src/lib/pinecone.ts`
- A poisoned Pinecone cache host could redirect archive traffic and receive the live `Api-Key` header. (high) — `src/lib/pinecone.ts`, `memory/archive/cache`
- The public site currently makes third-party font requests and lacks CSP hardening in hosting config. (medium) — `src/site/*.html`, `vercel.json`, `netlify.toml`

## Human Notes

_Human notes go here. This section is preserved across machine updates._
