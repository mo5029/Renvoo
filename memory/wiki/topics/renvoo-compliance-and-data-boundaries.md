---
title: "Renvoo Compliance And Data Boundaries"
type: topic
domain: renvoo-startup
summary: "Renvoo is being positioned as non-clinical logistics software that minimizes data exposure by using administrative scheduling data only, keeping the clinic as controller and Renvoo as processor."
updated_at: 2026-04-17T12:38:00Z
review_after: 2026-05-17T12:38:00Z
source_ids:
  - manual-renvoo-notion-digest-2026-04-17
  - manual-renvoo-founder-context-2026-04-17
source_note_links:
  - "[[wiki/sources/renvoo-notion-research-snapshot-april-2026]]"
  - "[[wiki/sources/renvoo-reconstructed-founder-context-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-product-architecture]]"
  - "[[wiki/topics/renvoo-detection-and-modeling]]"
  - "[[wiki/decisions/non-clinical-admin-data-only]]"
  - "[[wiki/decisions/operational-ai-not-clinical-ai]]"
claims:
  - statement: "Renvoo's intended data boundary excludes diagnoses, symptoms, medication, labs, and clinical free text."
    confidence: high
    evidence: "GDPR & data"
  - statement: "The preferred legal posture is clinic as controller and Renvoo as processor."
    confidence: high
    evidence: "GDPR & data"
  - statement: "Compliance is part of product design through audit logging, secure links, retention policy, and low-friction read-only integration."
    confidence: high
    evidence: "GDPR & data, pitch refinements, confirm-module research"
---
# Renvoo Compliance And Data Boundaries

## Snapshot

Renvoo is deliberately being framed as non-clinical logistics software. The safest current product truth is that it should operate on administrative scheduling and communication data, avoid sensitive clinical fields, preserve clinic control, and provide auditable, GDPR-conscious workflows. This is both a trust strategy and an adoption strategy.

## Evidence

- `GDPR & data` defines the minimum dataset around appointment, patient, clinician, timing, status, and message events.
- The same page explicitly says the product is not MDR medical AI and should avoid diagnoses, symptoms, medication, lab data, and clinical notes.
- `Pitch deck 2` corrects earlier sloppy wording and replaces "no data is stored on servers" with a narrower and more defensible statement about no clinical data storage.
- `Summary Task 1` and `Findings 8-Nov-2025` expand the confirm flow into consent management, PHI-free messages, secure links, RBAC, retention, and incident readiness.

## Claims

- Renvoo's intended data boundary excludes diagnoses, symptoms, medication, labs, and clinical free text. (high) — GDPR & data
- The preferred legal posture is clinic as controller and Renvoo as processor. (high) — GDPR & data
- Compliance is part of product design through audit logging, secure links, retention policy, and low-friction read-only integration. (high) — GDPR & data, pitch refinements, confirm-module research

## Sources

- [[wiki/sources/renvoo-notion-research-snapshot-april-2026]]
- [[wiki/sources/renvoo-reconstructed-founder-context-april-2026]]

## Related

- [[wiki/topics/renvoo-product-architecture]]
- [[wiki/topics/renvoo-detection-and-modeling]]
- [[wiki/decisions/non-clinical-admin-data-only]]
- [[wiki/decisions/operational-ai-not-clinical-ai]]

## Maintenance

- Review after: 2026-05-17T12:38:00Z
- Estimated tokens: 124

## Human Notes

_Human notes go here. This section is preserved across machine updates._

