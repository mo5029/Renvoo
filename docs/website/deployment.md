# Renvoo Website Deployment

The clinic website is a static Vite build.
The root site is Dutch-first, with mirrored English routes under `/en/`.

## Build

```bash
npm install
SITE_URL=https://your-domain.example npm run site:build
```

The static output goes to `dist/site/`.
`npm run site:build` regenerates the bilingual HTML pages before Vite builds them.

## What the build includes

- `index.html`
- `product.html`
- `pilot.html`
- `trust.html`
- `404.html`
- `en/index.html`
- `en/product.html`
- `en/pilot.html`
- `en/trust.html`
- `robots.txt`
- `site.webmanifest`
- `sitemap.xml` when `SITE_URL` is set
- `downloads/` with the clinic one-pager and deck

## Host Requirements

Any static host is fine as long as it can serve the contents of `dist/site/` directly.

Examples:

- Vercel static deployment
- Netlify static deployment
- Cloudflare Pages
- GitHub Pages
- S3 + CloudFront

This repo now includes:

- `vercel.json` for Vercel
- `netlify.toml` for Netlify

## Recommended Environment

- `SITE_URL`
  - Use the final public origin without a trailing slash.
  - Example: `https://renvoo.example`
- `GOOGLE_CALENDAR_SERVICE_ACCOUNT_EMAIL`
- `GOOGLE_CALENDAR_PRIVATE_KEY`
- `GOOGLE_CALENDAR_ID`
- `GOOGLE_CALENDAR_DELEGATED_USER` (optional)

If the Google Calendar booking variables are not configured, the pilot planner falls back to the browser-side Google Calendar draft flow.

## Google Calendar Host Booking

The booking API creates events directly in the configured Google Calendar only when the target calendar is accessible to the configured service account.

Typical setup:

1. Create a Google Cloud service account.
2. Enable the Google Calendar API.
3. Share the target Google Calendar with the service-account email.
4. Add the env vars above in Vercel.

If you are using Google Workspace with domain-wide delegation, `GOOGLE_CALENDAR_DELEGATED_USER` can be used as well.

## Verification Checklist

- Homepage loads without broken assets
- Product, pilot, and trust pages load in Dutch and English
- `downloads/renvoo-clinic-one-pager.pdf` opens
- `downloads/renvoo-clinic-deck.pptx` downloads
- `404.html` renders correctly
- `robots.txt` exists
- `sitemap.xml` exists when `SITE_URL` was set during build

## Notes

- The build uses `SITE_URL` to generate absolute canonical and social metadata plus the sitemap URL in `robots.txt`.
- If `SITE_URL` is omitted, the site still builds cleanly, but canonical and `og:url` tags are left out on purpose.
