#!/usr/bin/env node
/**
 * Writes public/robots.txt and public/sitemap.xml.
 *
 * Generated rather than hand-written for two reasons. The route list already
 * exists in src/navigation/routes.ts and a sitemap that drifts from it is worse
 * than none — it teaches a crawler about pages that have moved. And the domain
 * is still undecided, so both files have to be regenerable from one value the
 * day it is settled:
 *
 *   SITE_URL=https://the-real-domain.com node scripts/generate-seo.js
 *
 * Run from app/clicktoforge-landing. It is wired to `npm run seo`, and to
 * `prebuild` so an export cannot ship a stale sitemap.
 */

const fs = require('node:fs');
const path = require('node:path');

const SITE_URL = (process.env.SITE_URL || 'https://clicktoforge.com').replace(/\/+$/, '');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const ROUTES_FILE = path.join(__dirname, '..', 'src', 'navigation', 'routes.ts');

/**
 * The info routes are read out of the source rather than duplicated here, so
 * adding a page to INFO_ROUTES puts it in the sitemap with no second edit.
 */
function infoRoutes() {
  const src = fs.readFileSync(ROUTES_FILE, 'utf8');
  const match = src.match(/export const INFO_ROUTES = \[([^\]]+)\]/);
  if (!match) throw new Error('Could not find INFO_ROUTES in routes.ts — has it been renamed?');
  return match[1]
    .split(',')
    .map((s) => s.trim().replace(/^['"]|['"]$/g, ''))
    .filter(Boolean);
}

/**
 * `changefreq` and `priority` are omitted deliberately: Google has said for
 * years that it ignores both, and a file full of ignored hints is a file nobody
 * maintains. `lastmod` is the one signal still read, so it is the one included.
 */
function urlEntry(loc, lastmod) {
  return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${lastmod}</lastmod>\n  </url>`;
}

function main() {
  const today = new Date().toISOString().slice(0, 10);

  // The marketing page is the root; everything else is a ?view= route. The
  // signed-in app and the auth screens are deliberately absent — a crawler that
  // indexes /?view=dashboard has indexed a login redirect.
  const paths = ['/', ...infoRoutes().map((r) => `/?view=${r}`), '/?view=sample-report', '/?view=model-card'];

  const sitemap = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...paths.map((p) => urlEntry(`${SITE_URL}${p}`, today)),
    '</urlset>',
    '',
  ].join('\n');

  const robots = [
    '# ClickToForge',
    '',
    'User-agent: *',
    'Allow: /',
    '',
    '# The signed-in app and the auth screens have nothing to index and every',
    '# one of them redirects, which is a crawl budget spent on nothing.',
    'Disallow: /?view=dashboard',
    'Disallow: /?view=signin',
    'Disallow: /?view=signup',
    'Disallow: /dashboard',
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    '',
  ].join('\n');

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), sitemap);
  fs.writeFileSync(path.join(PUBLIC_DIR, 'robots.txt'), robots);

  console.log(`wrote public/sitemap.xml (${paths.length} urls) and public/robots.txt for ${SITE_URL}`);
  if (!process.env.SITE_URL) {
    console.log('note: SITE_URL was not set, so this used the canonical domain.');
  }
}

main();
