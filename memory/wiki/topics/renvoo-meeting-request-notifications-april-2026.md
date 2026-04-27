---
title: "Renvoo Meeting Request Notifications April 2026"
type: topic
domain: renvoo-startup
summary: "On April 27, 2026, Renvoo changed its pilot planner so meeting requests can notify Mohamed via Resend email through a Vercel API route, while keeping the old Google Calendar draft path only as fallback."
updated_at: '2026-04-27T17:55:00.000Z'
review_after: '2026-05-27T17:55:00.000Z'
source_ids:
  - f0d95fbb59d64e63
source_note_links:
  - '[[wiki/sources/renvoo-resend-meeting-notifications-april-2026]]'
related_links:
  - '[[wiki/topics/renvoo-live-booking-and-locale-persistence-april-2026]]'
  - '[[wiki/topics/renvoo-website-version-history-and-funnel-seo-integration-april-2026]]'
  - '[[wiki/topics/renvoo-go-to-market]]'
claims:
  - statement: "Renvoo's live pilot planner no longer depends on a finished Google Calendar write integration just to alert Mohamed about new requests."
    confidence: high
    evidence: "api/book-meeting.js, src/site/main.js"
  - statement: "The simplest current operating path is Resend email notification first, with calendar draft only as fallback."
    confidence: high
    evidence: "src/site/lib/site-content.js, README.md"
---
# Renvoo Meeting Request Notifications April 2026

## Snapshot

On April 27, 2026, Renvoo fixed the most practical weakness in its pilot planner: a clinic could complete the meeting flow without reliably notifying Mohamed in real time.

The new approach is intentionally simpler than full host-side calendar orchestration:

- accept the planner request server-side
- send Mohamed an email notification through Resend
- keep the older Google Calendar draft path only as fallback

## Why This Mattered

For Renvoo's current stage, the problem is not “perfect scheduling infrastructure.”

The real immediate problem is:

- a clinic should be able to request a meeting
- Mohamed should know about it right away
- the site should not pretend that a heavier calendar system already exists when it does not

Using Resend first solves that with much less setup than a full calendar-write integration.

## What Changed In Practice

### API Layer

Renvoo now has a real `POST /api/book-meeting` function for the pilot planner.

That route validates payloads and sends a structured email notification to Mohamed through Resend.

### Frontend Behavior

The planner now treats email notification as a successful live path.

If that path is not configured, it still falls back to the older Google Calendar draft route so the user is not blocked.

### Copy And Expectation Management

The pilot page copy was updated to describe the truthful behavior:

- Mohamed gets an email notification when live notification is configured
- otherwise the draft path remains available

That makes the website less misleading and easier to operate.

## Operating Rule To Remember

The current durable rule is:

- use Resend email notification as the primary live meeting-request signal
- keep the calendar draft only as fallback
- do not describe the site as calendar-first unless the calendar-write integration is truly working in production

## Recreate Or Inspect

- inspect `api/book-meeting.js`
- inspect `src/lib/meeting-request.js`
- inspect the pilot planner submission handling in `src/site/main.js`
- inspect the user-facing wording in `src/site/lib/site-content.js`
- configure `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_TO_EMAIL`
- test with `npm test`, `npm run build`, and `npm run site:build`

## Sources

- [[wiki/sources/renvoo-resend-meeting-notifications-april-2026]]

## Related

- [[wiki/topics/renvoo-live-booking-and-locale-persistence-april-2026]]
- [[wiki/topics/renvoo-website-version-history-and-funnel-seo-integration-april-2026]]
- [[wiki/topics/renvoo-go-to-market]]

## Human Notes

_Human notes go here. This section is preserved across machine updates._
