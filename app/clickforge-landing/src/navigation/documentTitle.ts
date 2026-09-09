import { Platform } from 'react-native';
import { INFO_PAGES } from '../data/pages';
import { isInfoRoute, type Route } from './routes';

/**
 * Gives every route its own title and description.
 *
 * The app is one HTML file, so twelve routes were sharing the one `<title>` in
 * `public/index.html`. That is wrong in three places at once: the browser tab
 * and the history entry both read "ClickForge — Score the click before you
 * record" whichever page you are on, and a search result for the model card
 * carries the landing page's title and snippet.
 *
 * ## What this does not fix
 *
 * Link unfurls. The Open Graph tags in `index.html` are static, so a shared
 * `/?view=about` still previews as the landing page — a scraper reads the HTML
 * as served and does not run this. Fixing that needs the routes prerendered to
 * real HTML files at build time, which is a bigger change than a title tag and
 * is worth doing before any of these pages get shared deliberately.
 *
 * Google is the exception: it renders JavaScript, so the titles below are what
 * it indexes.
 */

type Meta = { title: string; description: string };

const SUFFIX = 'ClickForge';

const STATIC: Partial<Record<Route, Meta>> = {
  landing: {
    title: 'ClickForge — Score the click before you record',
    description:
      'Paste a raw concept. Sixty seconds later you have three scored title options, a first-three-second retention hook, and an exact thumbnail blueprint.',
  },
  dashboard: {
    title: `Forge · ${SUFFIX}`,
    description: 'Score a concept and work the queue.',
  },
  'sample-report': {
    title: `Sample report · ${SUFFIX}`,
    description: 'Everything one forge returns, in full: three scored titles, the retention hook and the thumbnail blueprint.',
  },
  'model-card': {
    title: `Model card · ${SUFFIX}`,
    description: 'What the score is, how it is arrived at, and where it should not be trusted.',
  },
  signin: { title: `Sign in · ${SUFFIX}`, description: 'Sign in to ClickForge.' },
  signup: { title: `Start the trial · ${SUFFIX}`, description: 'Thirty days free, then $29 a month.' },
};

function metaFor(route: Route): Meta {
  const known = STATIC[route];
  if (known) return known;

  // The standing pages already carry a title and a one-line lead written for
  // the page itself; repeating them here would be two copies to keep in step.
  if (isInfoRoute(route)) {
    const page = INFO_PAGES[route];
    return { title: `${page.bar} · ${SUFFIX}`, description: page.lead };
  }

  return STATIC.landing as Meta;
}

/** Called once per mount. There is no client-side routing, so once is enough. */
export function applyDocumentTitle(route: Route): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;

  const { title, description } = metaFor(route);
  document.title = title;

  for (const selector of ['meta[name="description"]', 'meta[property="og:description"]']) {
    document.querySelector(selector)?.setAttribute('content', description);
  }
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', title);

  // The canonical has to move with the route or every page claims to be the
  // landing page, which is the one way a canonical tag makes things worse than
  // having none at all.
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical && typeof window !== 'undefined') {
    canonical.setAttribute('href', window.location.href.split('#')[0]);
  }
}
