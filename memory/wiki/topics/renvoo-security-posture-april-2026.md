---
title: "Renvoo Security Posture April 2026"
type: topic
domain: renvoo-startup
summary: "The April 24, 2026 audit found a generally small attack surface with no known dependency CVEs or committed secrets, but identified four meaningful risks: unrestricted ingest fetches, automatic outbound export of raw source content, trust of cached Pinecone hosts before sending credentials, and a public-site posture that still leaks browser metadata to Google and lacks CSP."
updated_at: 2026-04-24T08:30:00Z
review_after: 2026-05-08T08:30:00Z
source_ids:
  - d9717de15abea366
source_note_links:
  - "[[wiki/sources/renvoo-security-audit-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-compliance-and-data-boundaries]]"
  - "[[wiki/topics/renvoo-open-questions-and-risks]]"
  - "[[wiki/topics/renvoo-product-architecture]]"
claims:
  - statement: "Renvoo's current codebase has no known npm package vulnerabilities from the April 24, 2026 audit and no committed live credentials were found in the repository."
    confidence: high
    evidence: "npm audit --json, repository secret scan, .gitignore"
  - statement: "The ingest pathway currently lacks URL, host, timeout, and payload-size guardrails, which makes arbitrary URL ingestion the sharpest direct security boundary in the repo."
    confidence: high
    evidence: "src/cli.ts, src/lib/source-loader.ts"
  - statement: "When OpenAI or Pinecone are configured, raw source content can leave the local machine without a sensitive-data checkpoint."
    confidence: high
    evidence: "src/commands/ingest.ts, src/lib/openai.ts, src/lib/pinecone.ts"
  - statement: "The cached Pinecone host file is currently trusted before the API key is attached, which creates a credential-exfil risk if the cache is poisoned."
    confidence: high
    evidence: "src/lib/pinecone.ts, memory/archive/cache"
  - statement: "The marketing site still relies on third-party Google Fonts and ships without CSP headers, so the public-site posture is weaker than it should be before launch."
    confidence: medium
    evidence: "src/site/index.html, src/site/privacy.html, src/site/patient-notice.html, src/site/404.html, vercel.json, netlify.toml"
---
# Renvoo Security Posture April 2026

## Snapshot

The Renvoo repository is not carrying obvious high-noise security debt. The dependency tree audited cleanly, the codebase is small, `.env` files are ignored, and the public site is static rather than server-rendered. The real risks are concentrated in a few sharp boundaries: what the memory ingest flow is allowed to fetch, what it is allowed to export, which hosts it trusts for Pinecone archive traffic, and what the public site discloses to third parties in the browser.

## What Was Audited

- Memory CLI entrypoints
- URL and file ingestion behavior
- OpenAI export behavior
- Pinecone archive behavior
- Static-site client assets and hosting headers
- Dependency health and committed-secret exposure

## How To Reproduce The Audit

Run these commands from the repo root:

- `npm audit --json`
- `npm run build`
- `npm test`
- `npm run site:build`

Then review these files directly:

- `src/cli.ts`
- `src/commands/ingest.ts`
- `src/lib/source-loader.ts`
- `src/lib/openai.ts`
- `src/lib/pinecone.ts`
- `src/site/index.html`
- `src/site/privacy.html`
- `src/site/patient-notice.html`
- `src/site/404.html`
- `vercel.json`
- `netlify.toml`

## Findings

### 1. Unrestricted ingest fetches are the sharpest boundary

The current ingest flow accepts any operator-supplied URL and then follows through by fetching the page plus up to twelve linked images. There is no allowlist for scheme or host, no private-network rejection, no timeout, and no response-size ceiling. That means a malicious or mistaken ingest target can turn the CLI into a blind SSRF helper against the network where it runs, and it can also hang or exhaust local resources with oversized responses.

### 2. Raw-source export happens without a sensitive-data checkpoint

If OpenAI is configured, the synthesize step sends raw source text and nearby memory context to OpenAI. If Pinecone is configured, the archive step uploads chunked source text to Pinecone. There is no classification prompt, redaction gate, or explicit confirmation for sensitive clinic exports, internal legal material, or accidental secret-bearing documents. The risk is not theoretical because the code path runs automatically from a normal ingest.

### 3. Pinecone host trust is weaker than credential trust

The Pinecone host is cached in `memory/archive/cache/pinecone-index.json`. On later runs the code trusts that cached `host` value and immediately sends archive traffic to it with the live `Api-Key` header attached. Because the cache directory is part of the repo tree, a poisoned cache file or careless local edit could redirect traffic to an attacker-controlled host and leak the Pinecone credential.

### 4. Public-site hardening is still incomplete

The static site is fairly simple, but every page loads Google Fonts from Google-controlled domains, which means visitor browser metadata still goes to a third party on page load. At the same time, the Vercel and Netlify configs only set `Referrer-Policy`, `X-Content-Type-Options`, and `X-Frame-Options`; they do not set a `Content-Security-Policy`. That leaves the site with a weaker launch posture than the rest of the trust and privacy story suggests.

## What Was Clean

- `npm audit` reported `0` known vulnerabilities.
- No committed live secrets were surfaced during the repository scan.
- `.env` and `.env.*` are ignored, with `.env.example` intentionally retained.
- `npm run build`, `npm test`, and `npm run site:build` all passed during the audit.

## Why This Matters

- Renvoo's product and GTM story lean heavily on trust, narrow data boundaries, and clinic-control positioning.
- The unrestricted ingest/export path is the one place where the current code can quietly violate that story.
- The public site is launch-facing, so even "small" hardening gaps matter more here than they would in an internal prototype.

## Recommended Fix Order

- First: restrict ingest URLs and asset fetches to safe schemes and public hosts, then add timeouts and payload caps.
- Second: add a pre-export review step or redaction option before raw content is sent to OpenAI or Pinecone.
- Third: validate cached Pinecone hosts against expected Pinecone domains before attaching credentials.
- Fourth: self-host fonts and add CSP headers in both `vercel.json` and `netlify.toml`.

## Sources

- [[wiki/sources/renvoo-security-audit-april-2026]]

## Related

- [[wiki/topics/renvoo-compliance-and-data-boundaries]]
- [[wiki/topics/renvoo-open-questions-and-risks]]
- [[wiki/topics/renvoo-product-architecture]]

## Maintenance

- Review after: 2026-05-08T08:30:00Z

## Human Notes

_Human notes go here. This section is preserved across machine updates._
