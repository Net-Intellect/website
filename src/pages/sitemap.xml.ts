import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

// Hand-rolled sitemap (no extra dependency). Static pages are listed here;
// services and blog posts come from their collections.
const staticPaths = ["/", "/services", "/services/supportnet-security", "/supportnet", "/industries",
  "/client-results", "/about", "/team", "/blog", "/contact", "/privacy"];

export const GET: APIRoute = async () => {
  const services = await getCollection("services");
  const posts = await getCollection("blog");
  const paths = [
    ...staticPaths,
    ...services.map((s) => `/services/${s.id}`),
    ...posts.map((p) => `/blog/${p.id}`),
  ];
  const urls = paths
    .map((p) => `  <url><loc>https://netintellect.com.au${p === "/" ? "/" : `${p}/`}</loc></url>`)
    .join("\n");
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
};
