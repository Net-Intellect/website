# Net Intellect Website

netintellect.com.au, rebuilt as a static [Astro](https://astro.build) site deployed to GitHub Pages —
replacing the old WordPress site. Full context: the PRD and brief linked from
`../AGENTS.md` (one level up, in the NIWS workspace — not part of this repo).

## Stack

- **Framework:** Astro 7 (content collections for services/testimonials/blog)
- **Hosting:** GitHub Pages, deployed via `.github/workflows/deploy.yml` on every push to `main`
- **Content editing:** Decap CMS (`public/admin/`) — **not yet wired up**, see the TODO in
  `public/admin/config.yml`; needs an external OAuth provider before Andre can use it
- **Forms:** post to a Power Automate HTTP-trigger flow, which writes leads into Autotask/BMS —
  **not yet wired up**, see the TODO in `src/pages/contact.astro`

## Local development

```
npm install
npm run dev       # http://localhost:4321/website/
npm run build     # outputs to ./dist
npm run preview   # serve the production build locally
```

Note the `/website` base path in dev — it matches `astro.config.mjs`'s `base`, which mirrors
where GitHub Pages serves this repo (`net-intellect.github.io/website`) until the custom domain
cutover. Every internal link uses the `withBase()` helper in `src/lib/url.ts` for this reason —
use it for any new internal link rather than a bare `href="/..."`.

## Deployment

Push to `main` — GitHub Actions builds and deploys automatically. First-time setup still needed
in the repo's GitHub settings: **Settings → Pages → Source → GitHub Actions** (not "Deploy from a
branch").

## At custom-domain cutover (PRD §8)

1. Add `public/CNAME` containing `netintellect.com.au`.
2. In `astro.config.mjs`: change `site` to `https://netintellect.com.au` and remove `base` entirely.
3. Point DNS at GitHub Pages (confirm timing with Andre first — real cutover event, not a background deploy).
4. Put 301 redirects in place from every indexed WordPress URL — GitHub Pages has no native
   server-side redirects, so this needs a redirects file/edge layer in front of Pages, or a
   different host if that turns out to be simpler (see the hosting-portability note below).

## Known gaps / TODOs

- **Decap CMS auth** — needs an OAuth provider app deployed (`public/admin/config.yml`).
- **Power Automate flow** — the two contact forms post to a placeholder URL
  (`src/pages/contact.astro`) until the real flow exists.
- **Real testimonial quotes** — every testimonial and service proof-point quote is a bracketed
  placeholder (`src/content/testimonials/*.md`, `src/content/services/*.md`) pending Andre pulling
  the real published quotes.
- **Service page copy** — SLAs/inclusions, Essential Eight maturity level, and other specific
  claims are placeholders pending Andre's sign-off (PRD §12) — don't publish these as final.
- **Calibri substitute** — brand typeface can't ship as a web font as-is; `src/styles/global.css`
  falls back to `Segoe UI` for now.
- **Visual design pass** — this build is structural/functional, matching the wireframes; a real
  visual design pass was explicitly scoped out of the PRD as separate follow-on work.
- **Sitemap.xml / redirects** — not yet generated.

## Why Astro, and portability

Astro was chosen over Jekyll/plain HTML for its content-collection model (one template driving
all 8 service pages) and component reuse ahead of the Phase 2 landing pages. Output is plain
static HTML/CSS/JS with no GitHub-specific dependency — moving to Netlify, Cloudflare Pages, or
any other static host later is a deploy-config change, not a rebuild.
