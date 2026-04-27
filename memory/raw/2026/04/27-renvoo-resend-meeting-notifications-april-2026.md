---
source_id: f0d95fbb59d64e63
kind: text
title: "Renvoo Resend meeting notifications April 2026"
created_at: 2026-04-27T17:55:00.000Z
---

On April 27, 2026, Renvoo's pilot booking flow was upgraded from a mostly local summary and Google Calendar fallback path to a real server-side meeting-request notification path using Resend. A new Vercel API route was added at `POST /api/book-meeting`. The route validates booking payloads, formats the clinic request into structured email content, and sends Mohamed a notification email through Resend when the required environment variables are configured. The planner UI was also updated so the website now promises direct email notification first and only falls back to the old Google Calendar draft route when live notification is unavailable. The implementation introduced a shared `src/lib/meeting-request.js` helper, added API tests for success, invalid payloads, and missing-config cases, and documented the exact Resend setup requirements in `README.md`. This matters because the site's meeting request flow can now tell Mohamed that someone requested a meeting without needing the more complicated Google Calendar write path to be finished first.
