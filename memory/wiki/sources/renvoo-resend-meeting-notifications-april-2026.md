---
title: "Renvoo Resend Meeting Notifications April 2026"
type: source
domain: renvoo-startup
source_id: f0d95fbb59d64e63
source_kind: text
summary: "Structured capture of the April 27, 2026 change that made Renvoo's pilot planner send Mohamed a Resend email notification through a Vercel API route, with the old Google Calendar draft path preserved only as fallback."
updated_at: '2026-04-27T17:55:00.000Z'
created_at: '2026-04-27T17:55:00.000Z'
raw_path: raw/2026/04/27-renvoo-resend-meeting-notifications-april-2026.md
storage_strategy: wiki-only
archive_chunk_count: 0
tags:
  - website
  - meetings
  - resend
  - notifications
  - api
---
# Source: Renvoo Resend Meeting Notifications April 2026

## Source Summary

This source records the April 27, 2026 shift from a mostly client-side booking handoff to a real server-side meeting notification path for Renvoo's pilot planner.

Before this change, the planner mainly created a local summary and, when the old booking route was unavailable, fell back to a Google Calendar draft. That did not reliably tell Mohamed that a clinic had actually requested a meeting.

## What Changed

### Added A Live API Route

A new Vercel function was added at `POST /api/book-meeting`.

That route now:

- accepts the pilot planner payload
- validates it server-side
- formats the request into a structured email
- sends Mohamed a notification through Resend when configured

### Added A Shared Meeting Request Helper

The implementation introduced `src/lib/meeting-request.js` to keep the booking payload parsing and notification email formatting in one place.

That keeps the route simpler and makes the request format easier to test and evolve later.

### Kept A Fallback

The existing Google Calendar draft path was not removed entirely.

Instead, the planner now behaves like this:

- if Resend is configured, Mohamed gets an email notification immediately
- if Resend is not configured or the send fails, the frontend falls back to the older draft-and-summary path

### Updated The Funnel Copy

The pilot page copy was updated so the site now describes the live behavior honestly:

- email notification first
- Google Calendar draft only as fallback

This matters because the prior copy implied a stronger direct calendar-first experience than the current live implementation actually delivered.

## Verification

The following checks passed after the change:

- `npm run build`
- `npm test`
- `npm run site:build`

## Setup Needed In Production

For the live notification path to work on Vercel, the site now needs:

- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_TO_EMAIL`

Resend's official guidance used for this change:

- once a domain is verified, you can send from any address at that domain
- the email send API requires authenticated HTTPS requests
- direct HTTP requests should include a `User-Agent` header

## Key Files

- `api/book-meeting.js`
- `src/lib/meeting-request.js`
- `src/site/main.js`
- `src/site/lib/site-content.js`
- `README.md`
- `tests/api-book-meeting.test.js`

## Raw Reference

- Raw note: `raw/2026/04/27-renvoo-resend-meeting-notifications-april-2026.md`

## Topics

- [[wiki/topics/renvoo-meeting-request-notifications-april-2026]]
- [[wiki/topics/renvoo-live-booking-and-locale-persistence-april-2026]]

## Claims

- Renvoo's pilot planner now has a real server-side meeting notification path that can email Mohamed through Resend when configured. (high) — `api/book-meeting.js`, `src/lib/meeting-request.js`
- The planner still keeps the older Google Calendar draft path as fallback instead of hard-failing when Resend is unavailable. (high) — `src/site/main.js`
- The pilot page copy now describes email notification as the primary live behavior. (high) — `src/site/lib/site-content.js`

## Human Notes

_Human notes go here. This section is preserved across machine updates._
