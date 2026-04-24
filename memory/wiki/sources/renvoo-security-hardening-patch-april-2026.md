---
title: "Renvoo Security Hardening Patch (April 2026)"
type: source
domain: renvoo-startup
source_id: 858c40f9c02b8a07
source_kind: text
summary: "Structured capture of the April 24, 2026 hardening pass that patched the main security-audit findings across URL ingest, external export controls, Pinecone host validation, website CSP, and wiki frontmatter generation."
updated_at: 2026-04-24T08:45:21.953Z
created_at: 2026-04-24T08:45:21.875Z
raw_path: raw/2026/04/24-renvoo-security-hardening-patch-april-2026.md
storage_strategy: wiki-only
archive_chunk_count: 0
tags:
  - renvoo
  - security
  - hardening
  - website
  - memory-system
---
# Source: Renvoo Security Hardening Patch (April 2026)

## Source Summary

This source captures the April 24, 2026 security hardening pass that followed the full repository audit. The patch closed the main gaps around unrestricted URL ingest, raw off-box export, Pinecone host trust, browser-side privacy posture, and broken memory frontmatter serialization.

## Hardening Scope

### Memory And Ingest Controls

- External export during ingest now defaults to `blocked`.
- Explicit export modes now exist:
  - `blocked`
  - `redacted`
  - `raw`
- The ingest path prepares redacted export text by default.
- Ingest logs now record the export mode used.

### URL And Asset Fetching

- Reject credentialed URLs
- Reject localhost and private-network destinations
- Validate redirect hops
- Enforce request timeouts
- Enforce document and asset size limits
- Restrict to public `http` and `https` targets

### OpenAI And Pinecone Export Behavior

- OpenAI synthesis now respects the selected export mode.
- Pinecone archive sync uses prepared external export text instead of raw source text.
- Blocked-export ingests cannot sync to Pinecone.
- Redacted export strips sensitive path and title metadata before archive sync.
- Cached and live Pinecone hosts are validated before credentials are sent.

### Public Site Hardening

- Google Fonts were removed.
- The site now relies on local/system font stacks.
- `vercel.json` and `netlify.toml` now send a stricter Content Security Policy.

### Memory System Reliability

- The earlier frontmatter serialization bug that broke `memory:ingest` wiki generation was fixed by stripping undefined values before matter serialization.

## Verification

- `npm run build` passed
- `npm test` passed
- `npm run site:build` passed
- `memory:ingest` resumed functioning after the frontmatter fix

## Raw Reference

- Raw patch note: raw/2026/04/24-renvoo-security-hardening-patch-april-2026.md

## Topics

- [[wiki/topics/renvoo-security-hardening-patch-april-2026]]
- [[wiki/topics/renvoo-security-posture-april-2026]]

## Claims

- The repository now blocks off-box export by default during ingest and only allows redacted or raw export when explicitly chosen. (high) — `src/cli.ts`, `src/commands/ingest.ts`, `src/lib/openai.ts`, `src/lib/pinecone.ts`
- URL ingest no longer accepts localhost, private-network, credentialed, or unbounded fetches. (high) — `src/lib/source-loader.ts`
- The public site no longer relies on Google-hosted fonts and now ships with a stricter CSP in both Vercel and Netlify config. (high) — `src/site/*.html`, `vercel.json`, `netlify.toml`
- The memory ingest pipeline is usable again after the frontmatter serialization fix. (high) — `src/lib/wiki.ts`

## Human Notes

_Human notes go here. This section is preserved across machine updates._
