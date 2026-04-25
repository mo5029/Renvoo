---
title: "Renvoo Live Booking And Locale Persistence April 2026"
type: topic
domain: renvoo-startup
summary: "On April 25, 2026, Renvoo patched the funnel so English routing stays consistent across internal navigation and the pilot form now uses a real server-side booking path before falling back to a Google Calendar draft."
updated_at: 2026-04-25T02:05:00Z
review_after: 2026-05-25T02:05:00Z
source_ids:
  - manual-renvoo-live-booking-locale-2026-04-25
source_note_links:
  - "[[wiki/sources/renvoo-live-booking-and-locale-persistence-patch-april-2026]]"
related_links:
  - "[[wiki/topics/renvoo-website-version-history-and-funnel-seo-integration-april-2026]]"
  - "[[wiki/topics/renvoo-go-to-market]]"
  - "[[wiki/topics/renvoo-compliance-and-data-boundaries]]"
claims:
  - statement: "Renvoo's English funnel pages now persist locale across known internal page-to-page navigation instead of dropping visitors back into Dutch."
    confidence: high
    evidence: "src/site/lib/locale.js, src/site/main.js, browser verification on local preview"
  - statement: "Renvoo's pilot booking flow now has a truthful two-tier booking posture: live host-side calendar booking when configured, Google Calendar draft fallback when not."
    confidence: high
    evidence: "api/book-meeting.js, src/lib/google-calendar-booking.js, src/site/main.js"
---
# Renvoo Live Booking And Locale Persistence April 2026

## Snapshot

On April 25, 2026, Renvoo fixed two launch-facing funnel problems:

- English visitors were not reliably staying in the English version of the site.
- The booking flow did not yet have a real host-side calendar path for Mohamed Ibrahim.

## What Changed

### Locale handling

Renvoo now stores the visitor's preferred locale and uses it during internal navigation on known site routes. The practical effect is simple:

- if a visitor is in English, product, trust, pilot, and home links keep them in English
- if a visitor explicitly switches language, that choice becomes the new preference

This matters because the funnel is intentionally small. A language reset in a small funnel feels like a trust break very quickly.

### Booking handling

The pilot form now has a clearer split:

- first try to create the meeting on Mohamed's calendar through the server-side `/api/book-meeting` route
- if that infrastructure is not configured yet, fall back to the Google Calendar draft flow for the visitor

The important shift is not only technical. It also clarifies the product posture:

- the site no longer pretends that a draft-only flow is the same thing as real host-side booking
- live booking is treated as an infrastructure-backed capability, not a copywriting claim

## Why This Step Happened

These were launch-quality issues rather than deep product issues.

- The language issue made the site feel inconsistent for English visitors and partners.
- The booking issue weakened trust because the website looked more booked than it really was.

For an early founder-led funnel, those two details matter disproportionately. Visitors need to feel that:

- the route they chose is stable
- the meeting request does what it says it does

## How To Recreate Or Inspect It

- inspect locale helpers in `src/site/lib/locale.js`
- inspect booking API logic in `api/book-meeting.js`
- inspect host-side Google Calendar helper in `src/lib/google-calendar-booking.js`
- inspect client submission handling in `src/site/main.js`
- verify locally with:
  - `npm run site:build`
  - `npm run build`
  - `npm test`
  - `npm run site:preview`
- then navigate:
  - `/en/trust.html -> /en/pilot.html#booking`
  - `/en/pilot.html -> /en/product.html -> /en/`

## Remaining Constraint

The code path for live host-side booking exists, but it still depends on deployment secrets for Google Calendar. Without those environment variables, the correct behavior is still fallback mode.

So the state after this patch is:

- language persistence fixed in the site itself
- real booking path implemented in code
- deployment configuration still required for live calendar event creation

## Sources

- [[wiki/sources/renvoo-live-booking-and-locale-persistence-patch-april-2026]]

## Related

- [[wiki/topics/renvoo-website-version-history-and-funnel-seo-integration-april-2026]]
- [[wiki/topics/renvoo-go-to-market]]
- [[wiki/topics/renvoo-compliance-and-data-boundaries]]

## Maintenance

- Review after: 2026-05-25T02:05:00Z
- Estimated tokens: 229

## Human Notes

_Human notes go here. This section is preserved across machine updates._
