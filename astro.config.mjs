import { defineConfig } from "astro/config";

// Two build targets from the same code:
// - production (default): netintellect.com.au, served from the web root on the
//   Synergy Wholesale cPanel host. `npm run build`, then deploy/deploy.py.
// - preview: the GitHub Pages copy at net-intellect.github.io/website, kept as
//   a staging preview. The Pages workflow sets SITE_TARGET=preview, which also
//   marks every page noindex so it never competes with the live site in search.
const preview = process.env.SITE_TARGET === "preview";

export default defineConfig({
  site: preview ? "https://net-intellect.github.io" : "https://netintellect.com.au",
  base: preview ? "/website" : "/",
  trailingSlash: "ignore",
});
