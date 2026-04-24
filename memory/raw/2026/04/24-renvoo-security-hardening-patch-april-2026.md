---
source_id: 858c40f9c02b8a07
kind: text
title: "Renvoo security hardening patch April 2026"
created_at: 2026-04-24T08:45:21.875Z
---

Security hardening was implemented on April 24 2026 to close the main findings from the full audit. The ingest path now defaults to blocked external export, supports explicit external export modes (blocked, redacted, raw), prepares a redacted export payload by default, and records the chosen export mode in ingest logs. URL ingestion now validates schemes, rejects credentialed URLs, rejects localhost and private-network destinations, validates redirect hops, applies request timeouts, and enforces document and asset size limits before writing content into memory. OpenAI synthesis now respects the ingest export mode and uses redacted external text unless raw export is explicitly chosen. Pinecone archive sync now refuses blocked-export ingests, uses the prepared external export text instead of raw source text, strips source title and path/url metadata when export is redacted, and validates cached/live Pinecone hosts so credentials are only sent to .pinecone.io hosts. The public site now self-hosts no third-party fonts by relying on local/system font stacks and ships with a stricter Content Security Policy in both Vercel and Netlify configs. The memory frontmatter bug that previously broke memory:ingest was also fixed by stripping undefined values before matter serialization, restoring the normal CLI-based memory update workflow. Verification for this hardening pass: npm run build, npm test, and npm run site:build all passed.
