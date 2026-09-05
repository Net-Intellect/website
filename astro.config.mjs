import { defineConfig } from "astro/config";

// GitHub Pages project-site config (repo: Net-Intellect/website).
// At custom-domain cutover (PRD §8): add public/CNAME with "netintellect.com.au",
// change `site` to "https://netintellect.com.au", and drop `base` entirely.
export default defineConfig({
  site: "https://net-intellect.github.io",
  base: "/website",
});
