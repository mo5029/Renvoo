---
title: "Renvoo Detection And Modeling"
type: topic
domain: renvoo-startup
summary: "Renvoo's modeling work exists, but the durable current stance is that prediction should stay operational, explainable, and based on non-clinical administrative data rather than borrowed clinical-style features from public datasets."
updated_at: 2026-04-17T12:42:00Z
review_after: 2026-05-17T12:42:00Z
source_ids:
  - manual-renvoo-notion-digest-2026-04-17
source_note_links:
  - "[[wiki/sources/renvoo-notion-research-snapshot-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-compliance-and-data-boundaries]]"
  - "[[wiki/topics/renvoo-product-architecture]]"
  - "[[wiki/topics/renvoo-open-questions-and-risks]]"
  - "[[wiki/decisions/non-clinical-admin-data-only]]"
  - "[[wiki/decisions/operational-ai-not-clinical-ai]]"
claims:
  - statement: "Model experimentation has already been done using logistic regression, SMOTE, random forest, and gradient boosting."
    confidence: high
    evidence: "The model we are shipping, Full Journey"
  - statement: "Earlier model experiments used features that do not cleanly fit the current admin-data-only positioning."
    confidence: high
    evidence: "The model we are shipping"
  - statement: "The unresolved question is not whether a model exists, but whether a compliant operational feature set is sufficient on real clinic data."
    confidence: high
    evidence: "Founder summary, GDPR & data, modeling pages"
---
# Renvoo Detection And Modeling

## Snapshot

Renvoo has already done meaningful modeling exploration, but that work should not be flattened into "the production model is solved." The durable current stance is narrower: prediction should be operational, explainable, and compatible with the compliance boundary. Earlier experiments used public datasets and some clinical-style features that do not match the current admin-data-only product story.

## Evidence

- `The model we are shipping` documents logistic regression plus SMOTE and explicit risk bands.
- `No-Show Prediction Project - Full Journey` records multiple candidate models and working artifacts.
- `GDPR & data` and the later pitch material shift the product toward operational scheduling and communication features only.
- The founder summary explicitly treats data sufficiency as a core open question.

## Claims

- Model experimentation has already been done using logistic regression, SMOTE, random forest, and gradient boosting. (high) — The model we are shipping, Full Journey
- Earlier model experiments used features that do not cleanly fit the current admin-data-only positioning. (high) — The model we are shipping
- The unresolved question is not whether a model exists, but whether a compliant operational feature set is sufficient on real clinic data. (high) — Founder summary, GDPR & data, modeling pages

## Sources

- [[wiki/sources/renvoo-notion-research-snapshot-april-2026]]

## Related

- [[wiki/topics/renvoo-compliance-and-data-boundaries]]
- [[wiki/topics/renvoo-product-architecture]]
- [[wiki/topics/renvoo-open-questions-and-risks]]
- [[wiki/decisions/non-clinical-admin-data-only]]
- [[wiki/decisions/operational-ai-not-clinical-ai]]

## Maintenance

- Review after: 2026-05-17T12:42:00Z
- Estimated tokens: 124

## Human Notes

_Human notes go here. This section is preserved across machine updates._

