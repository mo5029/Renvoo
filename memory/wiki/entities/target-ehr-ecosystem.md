---
title: "Target EHR Ecosystem"
type: entity
domain: renvoo-startup
summary: "The target EHR ecosystem currently mentioned in Renvoo notes includes Exquise, Oase Dental, and Novadent, with CSV exports and lightweight connectors as the pragmatic path to integration."
updated_at: 2026-04-17T12:59:00Z
review_after: 2026-05-17T12:59:00Z
source_ids:
  - manual-renvoo-notion-digest-2026-04-17
source_note_links:
  - "[[wiki/sources/renvoo-notion-research-snapshot-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-product-architecture]]"
  - "[[wiki/decisions/csv-first-integration-ladder]]"
claims:
  - statement: "Exquise, Oase Dental, and Novadent are the named target systems in current Renvoo material."
    confidence: high
    evidence: "Pitch deck 2, 1.Connect"
  - statement: "The practical integration strategy is shaped by the realities of these systems and the desire to start with exports rather than deep embedded integrations."
    confidence: high
    evidence: "1.Connect, Plan for the short-term"
---
# Target EHR Ecosystem

## Snapshot

Renvoo's integration planning is not abstract. The notes already name likely clinic software environments, and the current product posture is to meet them through the least brittle path first.

## Evidence

- `Pitch deck 2` lists Exquise, Oase Dental, and Novadent as target EHR systems.
- `1.Connect` describes CSV-watch and backend normalization logic built precisely for this kind of environment.
- The short-term plan reinforces lightweight integration before anything deeper.

## Claims

- Exquise, Oase Dental, and Novadent are the named target systems in current Renvoo material. (high) — Pitch deck 2, 1.Connect
- The practical integration strategy is shaped by the realities of these systems and the desire to start with exports rather than deep embedded integrations. (high) — 1.Connect, Plan for the short-term

## Sources

- [[wiki/sources/renvoo-notion-research-snapshot-april-2026]]

## Related

- [[wiki/topics/renvoo-product-architecture]]
- [[wiki/decisions/csv-first-integration-ladder]]

## Maintenance

- Review after: 2026-05-17T12:59:00Z
- Estimated tokens: 83

## Human Notes

_Human notes go here. This section is preserved across machine updates._

