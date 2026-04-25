---
title: "Renvoo Live Booking And Locale Persistence Patch (April 2026)"
type: source
domain: renvoo-startup
source_id: manual-renvoo-live-booking-locale-2026-04-25
source_kind: manual-review
summary: "Structured capture of the April 25, 2026 patch that made English locale preference persist across Renvoo funnel navigation and added a real server-side booking endpoint with Google Calendar fallback behavior."
updated_at: 2026-04-25T02:05:00Z
created_at: 2026-04-25T02:05:00Z
raw_path: raw/2026/04/25-renvoo-website-locale-persistence-and-live-booking-patch-april-2026.md
storage_strategy: wiki-only
archive_chunk_count: 0
tags:
  - renvoo
  - website
  - booking
  - locale
  - calendar
  - vercel
---
# Source: Renvoo Live Booking And Locale Persistence Patch (April 2026)

## Source Summary

This source records the April 25, 2026 patch on the `codex/renvoo-funnel-seo-blog` branch that addressed two live-site issues in the Renvoo funnel:

- English visitors could fall back into Dutch routes when they clicked internal navigation or CTA links.
- The pilot booking flow only produced a visitor-side Google Calendar draft instead of first attempting a real host-side booking on Mohamed Ibrahim's calendar.

## What Changed

### Locale persistence

- Added `src/site/lib/locale.js` with a stable locale preference key and route translation helpers.
- Updated `src/site/main.js` to:
  - store the visitor's chosen locale in `localStorage`
  - redirect known pages to the preferred locale on load
  - rewrite internal same-site links to the preferred locale before navigation
  - preserve explicit language-switch links instead of rewriting them back
- Updated `src/site/lib/site-render.js` so footer language links carry explicit locale metadata for the client-side router logic.

### Booking flow

- Added `api/book-meeting.js` as a server-side booking entrypoint.
- Added `src/lib/google-calendar-booking.js` to create a real Google Calendar event with the visitor invited when deployment credentials exist.
- Updated `src/site/main.js` so the booking form now:
  - posts to `/api/book-meeting`
  - shows a booked state when the server creates a calendar event
  - falls back cleanly to a visitor-side Google Calendar draft when live booking is not configured or fails
- Updated `src/site/lib/site-content.js` to reflect the honest new behavior in both Dutch and English copy.

## Verification

- `npm run site:build` passed
- `npm run build` passed
- `npm test` passed
- local browser verification showed:
  - `/en/trust.html -> /en/pilot.html#booking` stayed in English
  - `/en/pilot.html -> /en/product.html -> /en/` stayed in English

## Deployment Requirement

The live booking route is implemented, but it only creates an actual event on Mohamed's calendar when the deployment environment has:

- `GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_CALENDAR_PRIVATE_KEY`
- `GOOGLE_CALENDAR_ID`
- optional `GOOGLE_CALENDAR_DELEGATED_USER`

At the time of this patch, those values were not configured in the local environment, so the fallback draft mode remained the expected behavior until deployment secrets are added.

The memory CLI ingest path was attempted first for this update. It successfully created the raw source file above, but wiki synthesis failed again with `unacceptable kind of an object to dump [object Undefined]`, so the source and topic notes were completed manually.

## Why This Was Necessary

The old funnel behavior created two trust problems:

- English visitors could feel the site was unstable or partially untranslated.
- A booking flow that sounds like a real meeting request but only produces a visitor-side draft can create confusion about who actually owns the event.

This patch makes the language behavior predictable and makes the booking logic honest:

- real host-side booking first when infrastructure exists
- explicit fallback when it does not

## Key Files

- `src/site/lib/locale.js`
- `src/site/main.js`
- `src/site/lib/site-render.js`
- `src/site/lib/site-content.js`
- `src/lib/google-calendar-booking.js`
- `api/book-meeting.js`
- `tests/site-locale.test.js`
- `tests/google-calendar-booking.test.js`
- `tests/api-book-meeting.test.js`

## Topics

- [[wiki/topics/renvoo-live-booking-and-locale-persistence-april-2026]]
- [[wiki/topics/renvoo-website-version-history-and-funnel-seo-integration-april-2026]]

## Claims

- English locale preference now persists across known internal funnel routes once a visitor chooses English. (high) — `src/site/lib/locale.js`, `src/site/main.js`
- The pilot form now attempts a server-side booking first and only falls back to a visitor-side Google Calendar draft when live booking is unavailable. (high) — `api/book-meeting.js`, `src/site/main.js`
- Live host-side booking still depends on Google Calendar deployment credentials and is not automatic from the static site alone. (high) — `src/lib/google-calendar-booking.js`, local env inspection on 2026-04-25 showed all required vars unset

## Human Notes

_Human notes go here. This section is preserved across machine updates._
