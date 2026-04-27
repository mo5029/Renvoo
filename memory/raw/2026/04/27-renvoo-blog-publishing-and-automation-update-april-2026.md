---
source_id: d2b0c8494e5f4f91
kind: text
title: "Renvoo blog publishing and automation update April 2026"
created_at: 2026-04-27T08:25:00.000Z
---

On April 27, 2026, the Renvoo website and blog workflow were updated so validated Dutch blog posts actually appear on the public website instead of remaining hidden as drafts. Three previously validated Dutch posts were switched from draft to published: late-afzeggingen-in-de-tandartspraktijk, afspraakbevestiging-in-de-tandartspraktijk, and open-plekken-tandartspraktijk-opvullen. The static site build confirmed those posts now render on the blog index and as individual article pages. The repo blog generator was also changed so publish mode defaults to publish unless BLOG_PUBLISH_MODE is explicitly set to draft, which keeps the draft fallback available without requiring a second manual status flip for successful posts. The recurring Codex automation with id daily-renvoo-blog-draft was updated in the app so it now publishes passing posts to the website and only keeps posts as draft when quality, compliance, or evidence is weak.
