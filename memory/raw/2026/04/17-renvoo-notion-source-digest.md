---
source_id: manual-renvoo-notion-digest-2026-04-17
kind: text
title: "Renvoo Notion Source Digest (2026-04-17)"
created_at: 2026-04-17T12:00:00Z
---

# Scope

This document distills the high-signal Renvoo material reviewed from Notion on 2026-04-17 inside `2nd Brain -> Business -> Renvoo`.

# Primary Pages Reviewed

- `Renvoo Dashboard` (`2786ed9b52e48053a699fd82a07b5c2f`)
- `Pitch deck 2` (`3056ed9b52e480bfacd2ed46c94cc496`)
- `Kick off video` (`33a6ed9b52e4807ab059e74cf7f58e3c`)
- `GDPR & data` (`2906ed9b52e4806a9b71c4297aeecfb7`)
- `Strategy` (`2a16ed9b52e480279e1def5944e10a13`)
- `Plan for the short-term` (`2946ed9b52e48020b3a6feaeb59a31bd`)
- `No-Show solution` (`2786ed9b52e480a19d23fdf7d9551a56`)
- `Healthcare Start` (`2786ed9b52e4808aa412c6e40bdb0be0`)
- `Pitch Deck` (`3056ed9b52e480bd89d7dc3e0c5ae477`)
- `The model we are shipping` (`27f6ed9b52e480efb46ec57f5e70b2cb`)
- `No-Show Prediction Project - Full Journey` (`27f6ed9b52e480ea996ed4eb60fb47f1`)
- `Clinics MVP comparison` (`2926ed9b52e4808cbbc7fb377079274c`)
- `GGZ as a wedge compared to similar clinics` (`2926ed9b52e4805c9ceaee09e2bb7dfc`)
- `Pricing` (`2b86ed9b52e48039a1f2cec833054f7c`)
- `Realisations` (`2906ed9b52e48064a2f1d425220a62d4`)
- `Email script` (`2fe6ed9b52e480b68405cb9b43ed6353`)
- `Cold call script` (`2fe6ed9b52e4807c8ea3d23a99d4b268`)
- `New name & temporary logo` (`2926ed9b52e48058b13bcbe72e1a17d9`)
- `Summary Task 1` (`2a56ed9b52e480f9a7b0e3ec9f703866`)
- `Software Development` (`2a36ed9b52e480a9871dd62dff12ccb9`)
- `1.Connect` (`2a36ed9b52e480df9765f672eb2e8b8d`)
- `2.Detect` (`2a36ed9b52e4802e9050de918bf06188`)
- `3.Confirm` (`2a36ed9b52e48070bde6ced07a94c072`)
- `4.Replace` (`2a36ed9b52e48020a24ffa82ead568ae`)
- `Milestone 1` (`2a26ed9b52e480f58d1fcb854cc67ce4`)
- `Findings 06-11-2025` (`2a36ed9b52e4808b88b2e798db4715f3`)
- `Findings 8-Nov-2025` (`2a56ed9b52e480a98b2bf82a9527bf66`)
- `No-Show Prevention Systems - Patent Analysis and Implementation Plan` (`29b6ed9b52e480d296a3ecef9a343998`)

# High-Confidence Current State

- Renvoo is an early-stage, pre-revenue Dutch healthtech startup with TU/e context.
- The current commercial wedge is private clinics, especially dental clinics in the Netherlands.
- The core problem is no-shows, late cancellations, weak confirmation behavior, and empty appointment capacity.
- The operational promise is lower lost revenue, less admin burden, better chair utilization, and more resilient scheduling.
- The product is framed as operational AI rather than clinical AI.
- The current product concept is `Connect -> Detect -> Confirm -> Replace`.
- The MVP logic is:
  - ingest scheduling and communication data
  - score no-show risk
  - trigger risk-tiered outreach
  - track responses and confirmations
  - attempt rescheduling or waitlist backfill
  - expose status in a staff-facing dashboard with audit history
- Current messaging stance is SMS first, email support, and phone escalation for higher-risk cases.
- The compliance stance is strong:
  - no clinical decision support
  - no diagnosis or treatment data needed
  - clinic remains controller, Renvoo acts as processor
  - read-only or low-write workflow preferred for early integrations
  - audit logging, retention boundaries, DPA/DPIA, secure links, and GDPR-by-design are part of the intended operating model
- The integration ladder is:
  - CSV export/import first
  - EHR scheduling sync next
  - deeper integration later

# Product Modules

## Connect

- Current concrete MVP architecture uses a local connector or export-based flow.
- The connector concept watches exported appointment data, sends it to a backend, validates and normalizes rows, and prepares them for scoring.
- Named EHR targets include Exquise, Oase Dental, and Novadent.

## Detect

- The explicit `2.Detect` page is still sparse, but supporting pages show model experimentation exists.
- Earlier modeling work used logistic regression, SMOTE, gradient boosting, and random forest on external datasets.
- Current commercial framing has shifted toward non-clinical administrative features only.
- This means experimental model pages are useful background, but not all their feature choices should be treated as current product truth.

## Confirm

- Confirm is the most deeply researched product module in Notion.
- It includes:
  - consent logic
  - channel selection
  - personalization
  - queueing / retry / fallback rules
  - logging and auditability
  - PHI-free templating for open channels
  - secure short-lived links for action
- Research notes explored SMS, email, phone, WhatsApp, patient portals, and vendor options like Spryng and Twilio.
- Current launch truth is narrower than the full research tree.

## Replace

- Replace focuses on backfilling empty slots.
- MVP posture is to keep actual schedule changes under clinic or EHR control where possible.
- Waitlist logic is a major long-term value lever and one of the best differentiators if executed well.

# Metrics and ROI

- North star metric: reduction in no-show rate.
- Supporting metrics:
  - revenue recovered per month
  - chair or slot utilization
  - admin hours saved
  - backfill rate for short-notice openings
- Example commercial math appearing in pitch material:
  - 4-5% Dutch dental no-show baseline in one framing
  - 3.6 missed appointments per week average in one source
  - 2 no-shows per day can imply roughly EUR8k monthly lost revenue in some dental examples
  - appointment value ranges often cited as EUR150-EUR400
  - admin time waste framed as roughly 3-5 hours per week in some notes
- Important memory rule: these are positioning figures and scenario math, not yet proof from Renvoo live pilots.

# Team and Roles

- Mohamed Ibrahim is framed around outreach, strategy, sales, market validation, compliance/data framing, and leadership.
- Haroen T is framed around technical development, product execution, pitch delivery, and Dutch market communication.

# GTM and Sales Posture

- The go-to-market plan is founder-led and relationship-heavy.
- Email and cold-call scripts are targeted to dental clinics and emphasize:
  - operational pain
  - read-only planning data
  - no medical data needed
  - GDPR-conscious deployment
  - free pilot posture
- The strongest current sales frame is not "AI for healthcare."
- The strongest current sales frame is "revenue recovery and reduced scheduling waste."

# Current Bottlenecks

- Access to partner clinics.
- Access to EHR exports / connectors.
- Real pilot proof and before/after outcomes.
- Exact pricing validation.

# Exploratory or Contradictory Branches

- Earlier pages explored broader outpatient clinics and even wider workflow problems such as intake and document management.
- Some pages argued GGZ could be a better wedge than dentistry on contract value and centralization.
- Earlier pricing notes include much higher-ticket pilots and setup fees than later pitch-deck SaaS tiers.
- Earlier model pages used external datasets and features like age, comorbidities, and `SMS_received`, which do not match the later admin-data-only compliance posture.
- WhatsApp appears heavily in research notes, but it is not locked in as the primary launch channel in the clearest current pitch.
- Long-term strategy pages describe a much larger company vision around pre- and post-visit clinic interaction infrastructure, beyond the current no-show wedge.

# Strategic Reading of the Material

- Renvoo's cleanest current truth is a dental-first no-show prevention and slot recovery platform for Dutch private clinics.
- The strongest long-term company story is broader clinic operations intelligence.
- The biggest gap is proof, not idea generation.

