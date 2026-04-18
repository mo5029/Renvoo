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
