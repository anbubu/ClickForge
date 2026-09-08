import { Platform } from 'react-native';

/**
 * Which screen the URL asks for, and how to move between them.
 *
 * Still deliberately not a router dependency — the app is a handful of screens,
 * and `?view=…` keeps the marketing page at the root URL while everything else
 * stays addressable. What this module adds over reading `window.location` inline
 * is a single place the URL contract is written down, so no two screens can
 * disagree about what a given URL means.
 *
 * Moving between screens is a real browser navigation rather than a state swap:
 * the route is read once at mount, and pretending otherwise would leave the URL
 * describing a screen the creator is no longer on. It also means every
 * destination here can be linked to, bookmarked and opened in a new tab, which
 * is most of the value of having a URL at all.
 */

/**
 * The standing pages the footer points at. They all render through one screen
 * (`screens/InfoPage`) off one content file, so adding another is an entry in
 * `data/pages.ts` and a name here.
 */
export const INFO_ROUTES = ['about', 'careers', 'press', 'contact', 'changelog', 'status', 'api', 'blueprints'] as const;

export type Route =
  | 'landing'
  | 'dashboard'
  | 'sample-report'
  | 'model-card'
  | 'signin'
  | 'signup'
  | (typeof INFO_ROUTES)[number];

export function isInfoRoute(route: Route): route is (typeof INFO_ROUTES)[number] {
  return (INFO_ROUTES as readonly string[]).includes(route);
}

/** Every route but `landing`, which is what the absence of a view parameter means. */
const VIEWS: readonly Route[] = ['dashboard', 'sample-report', 'model-card', 'signin', 'signup', ...INFO_ROUTES];

const DASHBOARD_PATH = /\/dashboard\/?$/;

function isView(value: string | null): value is Route {
  return !!value && (VIEWS as readonly string[]).includes(value);
}

export function currentRoute(): Route {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return 'landing';
  const { search, pathname } = window.location;
  if (DASHBOARD_PATH.test(pathname)) return 'dashboard';
  const view = new URLSearchParams(search).get('view');
  return isView(view) ? view : 'landing';
}

/**
 * The URL for a route, built from wherever the creator is standing so it holds
 * under a sub-path deploy as well as at the root.
 */
export function hrefFor(route: Route): string {
  if (Platform.OS !== 'web' || typeof window === 'undefined') {
    return route === 'landing' ? '/' : `/?view=${route}`;
  }
  const { origin, pathname } = window.location;
  // Unwind a `/dashboard` path segment so every href is built from the root.
  const base = origin + pathname.replace(DASHBOARD_PATH, '/');
  if (route === 'landing') return base;
  // A deploy already serving the app at /dashboard needs no query string.
  if (route === 'dashboard' && DASHBOARD_PATH.test(pathname)) return origin + pathname;
  return `${base}?view=${route}`;
}

export function goTo(route: Route): void {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  window.location.assign(hrefFor(route));
}

/**
 * Whether the URL says we have just come back from Stripe Checkout.
 *
 * The webhook that writes the subscription row and the browser's return from
 * Checkout are two independent races, and the browser usually wins — so the
 * dashboard needs to know to wait for the row rather than conclude there isn't
 * one and show the plan picker to somebody who has just paid.
 */
export function returningFromCheckout(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return new URLSearchParams(window.location.search).get('checkout') === 'success';
}

export const goToLanding = () => goTo('landing');
export const goToDashboard = () => goTo('dashboard');
export const goToSampleReport = () => goTo('sample-report');
export const goToModelCard = () => goTo('model-card');
export const goToSignIn = () => goTo('signin');
