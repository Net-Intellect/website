import type { APIRoute } from "astro";

// The GitHub Pages preview blocks crawlers; the live site points them at the sitemap.
export const GET: APIRoute = () => {
  const preview = import.meta.env.BASE_URL !== "/";
  const body = preview
    ? "User-agent: *\nDisallow: /\n"
    : "User-agent: *\nAllow: /\nDisallow: /admin/\n\nSitemap: https://netintellect.com.au/sitemap.xml\n";
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
};
