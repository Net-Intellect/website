// Prefixes an internal path with the configured base (see astro.config.mjs).
// Astro doesn't do this automatically for hand-written hrefs — use this for
// every internal link so pages still resolve once deployed under /website,
// and keep working unchanged when base is dropped at custom-domain cutover.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `${base}${clean}`;
}
