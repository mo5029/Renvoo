---
title: "Renvoo Product Architecture"
type: topic
domain: renvoo-startup
summary: "The current Renvoo architecture is best understood as a Connect-Detect-Confirm-Replace workflow, with lightweight data ingestion first, staff visibility, and cautious operational control around schedule changes."
updated_at: 2026-04-17T12:40:00Z
review_after: 2026-05-17T12:40:00Z
source_ids:
  - manual-renvoo-notion-digest-2026-04-17
source_note_links:
  - "[[wiki/sources/renvoo-notion-research-snapshot-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-product-thesis]]"
  - "[[wiki/topics/renvoo-compliance-and-data-boundaries]]"
  - "[[wiki/topics/renvoo-detection-and-modeling]]"
  - "[[wiki/entities/target-ehr-ecosystem]]"
  - "[[wiki/decisions/csv-first-integration-ladder]]"
  - "[[wiki/decisions/backfill-under-clinic-control]]"
claims:
  - statement: "The MVP architecture is organized around Connect, Detect, Confirm, and Replace modules."
    confidence: high
    evidence: "Software Development, Milestone 1"
  - statement: "Initial ingestion is designed to work through CSV export/import or local connector flows rather than deep enterprise integrations."
    confidence: high
    evidence: "1.Connect, Pitch deck 2, Plan for the short-term"
  - statement: "The dashboard and audit trail are part of the product skeleton, not late additions."
    confidence: high
    evidence: "Pitch deck 2, Kick off video, GDPR & data"
---
# Renvoo Product Architecture

## Snapshot

The cleanest current architecture is `Connect -> Detect -> Confirm -> Replace`. Appointment and communication data are ingested through lightweight workflows first. A scoring layer identifies risk. A confirmation layer executes tiered patient outreach and tracks status. A replacement layer tries to recover emptied capacity using waitlists or earlier-slot movement. Staff visibility and auditability are treated as first-class parts of the system.

## Evidence

- `Software Development` explicitly groups the work into `1.Connect`, `2.Detect`, `3.Confirm`, and `4.Replace`.
- `1.Connect` describes a local connector / backend normalization / scoring flow and names target EHR ecosystems.
- `4.Replace` says MVP schedule changes can remain under clinic or EHR control.
- `Milestone 1` defines the first shipped scope as prediction plus replacement with minimum privacy and UI support.
- `Pitch deck 2` and `Kick off video` both mention dashboard, risk indicators, and audit logging.

## Claims

- The MVP architecture is organized around Connect, Detect, Confirm, and Replace modules. (high) — Software Development, Milestone 1
- Initial ingestion is designed to work through CSV export/import or local connector flows rather than deep enterprise integrations. (high) — 1.Connect, Pitch deck 2, Plan for the short-term
- The dashboard and audit trail are part of the product skeleton, not late additions. (high) — Pitch deck 2, Kick off video, GDPR & data

## Sources

- [[wiki/sources/renvoo-notion-research-snapshot-april-2026]]

## Related

- [[wiki/topics/renvoo-product-thesis]]
- [[wiki/topics/renvoo-compliance-and-data-boundaries]]
- [[wiki/topics/renvoo-detection-and-modeling]]
- [[wiki/entities/target-ehr-ecosystem]]
- [[wiki/decisions/csv-first-integration-ladder]]
- [[wiki/decisions/backfill-under-clinic-control]]

## Maintenance

- Review after: 2026-05-17T12:40:00Z
- Estimated tokens: 128

## Human Notes

_Human notes go here. This section is preserved across machine updates._

