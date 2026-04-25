---
source_id: 69871cd6ad805980
kind: text
title: "Renvoo website locale persistence and live booking patch April 2026"
created_at: 2026-04-25T01:53:30.753Z
---

On April 25, 2026, Renvoo's funnel-plus-SEO website was patched so English locale preference persists across internal navigation and the pilot booking flow first attempts a live server-side Google Calendar booking into Mohamed Ibrahim's calendar before falling back to a Google Calendar draft for the visitor. The implementation added locale routing helpers, a Vercel api/book-meeting endpoint, and Google Calendar service-account integration points. Verification showed the English route stayed under /en/ across CTA navigation in local preview, site:build passed, build passed, test passed, and memory:lint passed. Live booking still requires Google Calendar deployment env vars: GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL, GOOGLE_CALENDAR_PRIVATE_KEY, GOOGLE_CALENDAR_ID, and optional GOOGLE_CALENDAR_DELEGATED_USER.
