---
title: "Renvoo Security Hardening Patch April 2026"
type: topic
domain: renvoo-startup
summary: "On April 24, 2026, Renvoo patched the main audit findings by making ingest export safe-by-default, constraining URL fetches, validating Pinecone hosts before sending credentials, hardening the public site, and restoring reliable wiki generation."
updated_at: 2026-04-24T08:45:21.958Z
review_after: 2026-05-24T08:45:21.958Z
source_ids:
  - 858c40f9c02b8a07
source_note_links:
  - "[[wiki/sources/renvoo-security-hardening-patch-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-security-posture-april-2026]]"
  - "[[wiki/topics/renvoo-compliance-and-data-boundaries]]"
claims:
  - statement: "Ingest export is now safe-by-default and requires an explicit opt-in for redacted or raw off-box processing."
    confidence: high
    evidence: "cli.ts, ingest.ts, openai.ts, pinecone.ts"
  - statement: "Renvoo's URL ingest path now rejects local/private destinations and enforces request boundaries that materially reduce SSRF and resource-exhaustion risk."
    confidence: high
    evidence: "source-loader.ts"
  - statement: "The public site's trust posture is now more aligned with its messaging because Google-hosted fonts were removed and a CSP was added."
    confidence: high
    evidence: "site HTML files, vercel.json, netlify.toml"
---
# Renvoo Security Hardening Patch April 2026

## Snapshot

The security hardening patch on April 24, 2026 turned the audit findings into concrete safeguards. The most important shift is that ingest and archive behavior now assume "do not export sensitive content" unless someone explicitly chooses otherwise. The rest of the patch tightens URL fetching, validates Pinecone hosts before sending credentials, improves website browser posture, and restores the normal wiki-generation workflow.

## What Changed

### Safer Export Defaults

- Off-box export is `blocked` by default.
- Redacted export is available when external synthesis is useful but raw content should not leave the machine.
- Raw export requires explicit intent.

### Safer URL Ingest

- localhost and private-network destinations are rejected
- credentialed URLs are rejected
- redirects are validated
- request timeouts and size limits are enforced

### Safer Archive Sync

- blocked-export ingests cannot sync to Pinecone
- redacted export strips sensitive source metadata
- cached Pinecone hosts are validated before attaching credentials

### Safer Public Website

- Google Fonts are gone
- local/system font stacks are used
- Vercel and Netlify configs now send a stricter CSP

### More Reliable Memory Updates

- The wiki frontmatter serialization bug was fixed, so CLI-driven memory updates work again

## Why It Matters

Renvoo is dealing with clinic-adjacent workflows and a memory system that may eventually ingest sensitive operational material. That means the "default safe path" matters more than convenience. This patch made the repository safer for real use and better aligned with the company's privacy-conscious story.

## Sources

- [[wiki/sources/renvoo-security-hardening-patch-april-2026]]

## Related

- [[wiki/topics/renvoo-security-posture-april-2026]]
- [[wiki/topics/renvoo-compliance-and-data-boundaries]]

## Maintenance

- Review after: 2026-05-24T08:45:21.958Z
- Estimated tokens: 187

## Human Notes

_Human notes go here. This section is preserved across machine updates._
