# Renvoo Website Deployment

The public site is a static Vite build generated from shared route/content definitions plus markdown blog posts.

## Build

```bash
npm install
SITE_URL=https://your-domain.example npm run site:build
```

The static output goes to `dist/site/`.

## What the build includes

- Dutch commercial pages at the root
- English mirrors under `/en/`
- blog index and blog article routes under `/blog/` and `/en/blog/`
- `404.html`
- `robots.txt`
- `llms.txt`
- `site.webmanifest`
- `sitemap.xml` when `SITE_URL` is set
- public downloads such as the clinic one-pager

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
- `SITE_CONTACT_EMAIL`
  - Public contact inbox used by the static meeting-request form.
- `CRON_SECRET`
  - Required if you want Vercel Cron to call the blog automation endpoint securely.
- `GITHUB_TOKEN`, `GITHUB_REPOSITORY`, `GITHUB_BRANCH`
  - Required when Vercel Cron should commit generated blog posts back to GitHub for durable publishing and redeploys.

## Verification Checklist

- Root and `/en/` routes load without broken assets
- `blog/` and `/en/blog/` load correctly
- blog article routes render with article schema and related links
- `downloads/renvoo-clinic-one-pager.pptx` downloads
- `404.html` renders correctly
- `robots.txt` exists
- `llms.txt` exists
- `sitemap.xml` exists when `SITE_URL` was set during build
- contact page form can create a summary, and opens email when `SITE_CONTACT_EMAIL` is set

## Notes

- The build uses `SITE_URL` to generate absolute canonical, `hreflang`, and social metadata plus the sitemap URL in `robots.txt`.
- If `SITE_URL` is omitted, the site still builds cleanly, but canonical and `hreflang` tags are left out on purpose for local/non-production builds.
- `vercel.json` includes a daily cron entry for `/api/cron/daily-blog`.
