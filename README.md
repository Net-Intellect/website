# Net Intellect Website

netintellect.com.au, rebuilt as a static [Astro](https://astro.build) site, replacing the old
WordPress site on the same Synergy Wholesale cPanel host. GitHub Pages keeps a noindex preview copy. Full context: the PRD and brief linked from
`../AGENTS.md` (one level up, in the NIWS workspace — not part of this repo).

## Stack

- **Framework:** Astro 7 (content collections for services/testimonials/blog)
- **Hosting:** live on the Synergy Wholesale cPanel host (`public_html`), published with `deploy/deploy.py`.
  Preview on GitHub Pages (`net-intellect.github.io/website`, noindex), rebuilt on every push to `main`
- **Content editing:** Decap CMS (`public/admin/`) — **not yet wired up**, see the TODO in
  `public/admin/config.yml`; needs an external OAuth provider before Andre can use it
- **Forms:** Microsoft Forms, opened in a pop-up (`src/components/FormPopup.astro`). Links live in
  `src/lib/offers.ts`. The Contact page buttons fall back to email until `CONTACT_FORM_URL` is set

## Local development

```
npm install
npm run dev       # http://localhost:4321/
npm run build     # production build (netintellect.com.au) to ./dist
npm run preview   # serve the production build locally
```

The production build serves from the web root. The GitHub Pages preview build
(`SITE_TARGET=preview`) uses the `/website` base path, so every internal link goes through the
`withBase()` helper in `src/lib/url.ts`. Use it for any new internal link rather than a bare
`href="/..."`.

## Deployment

- **Live site:** `python deploy/deploy.py live` builds for production, writes `dist/.htaccess`
  (`deploy/build_htaccess.py`: old-WordPress redirects, security headers, caching), zips `dist/`,
  uploads it through the cPanel API and unzips it into `public_html`. Then run
  `python deploy/deploy.py check`. Needs the cPanel API token file (see the script's docstring);
  never commit it.
- **Preview:** push to `main`. GitHub Actions builds with `SITE_TARGET=preview` and deploys to
  GitHub Pages.
- The one-off WordPress cutover (`retire-wordpress`, `restore-wordpress`) and its checklist are in
  `../ops/go-live-runbook.md`, outside this repo.

## Known gaps / TODOs

- **Decap CMS auth** — needs an OAuth provider app deployed (`public/admin/config.yml`).
- **Contact form** — build the Microsoft Form (`../ops/contact-form-copilot-prompt.md`) and set
  `CONTACT_FORM_URL`.
- **Real testimonial quotes** — every testimonial and service proof-point quote is a bracketed
  placeholder (`src/content/testimonials/*.md`, `src/content/services/*.md`) pending Andre pulling
  the real published quotes.
- **Service page copy** — SLAs/inclusions, Essential Eight maturity level, and other specific
  claims are placeholders pending Andre's sign-off (PRD §12) — don't publish these as final.
- **Calibri substitute** — brand typeface can't ship as a web font as-is; `src/styles/global.css`
  falls back to `Segoe UI` for now.
- **Visual design pass** — this build is structural/functional, matching the wireframes; a real
  visual design pass was explicitly scoped out of the PRD as separate follow-on work.

## Why Astro, and portability

Astro was chosen over Jekyll/plain HTML for its content-collection model (one template driving
all 8 service pages) and component reuse ahead of the Phase 2 landing pages. Output is plain
static HTML/CSS/JS with no GitHub-specific dependency — moving to Netlify, Cloudflare Pages, or
any other static host later is a deploy-config change, not a rebuild.
