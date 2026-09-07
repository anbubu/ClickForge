import { Platform } from 'react-native';

/**
 * Where the auth pages live.
 *
 * Until there's a real auth backend these point at the static preview in
 * `app/login-preview` (served locally on :8100), but that URL must not be what
 * ships — a committed `http://localhost:8100` is dead for everyone who isn't
 * running that server. Resolution order:
 *
 *   1. `EXPO_PUBLIC_AUTH_ORIGIN`, if set at build time — the deploy-time override.
 *   2. The local preview origin, but only when actually running on localhost.
 *   3. The production app origin.
 */
const PRODUCTION_ORIGIN = 'https://app.clickforge.com';
const LOCAL_PREVIEW_ORIGIN = 'http://localhost:8100';

function isLocalhost(): boolean {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
  return /^(localhost|127\.0\.0\.1|\[::1\])$/.test(window.location.hostname);
}

const override = process.env.EXPO_PUBLIC_AUTH_ORIGIN;
const usingPreview = !override && isLocalhost();
const origin = override ?? (usingPreview ? LOCAL_PREVIEW_ORIGIN : PRODUCTION_ORIGIN);

/**
 * The static preview is a pair of flat files; the real app will use clean routes.
 * Keeping the shape difference here means callers just say `authUrls.signup`.
 *
 * Both are currently unreferenced. Every "Log in" and "Start forging" on the site
 * goes straight to the dashboard instead, for two reasons: a preview page cannot
 * log anyone in or sign anyone up, and in development the preview's own origin is
 * this app's dev server, so `/signup.html` serves the app shell rather than the
 * signup page — a CTA pointed there looks to a visitor like a button that does
 * nothing. They stay defined because they are the contract the real auth pages
 * will land on. See `navigation/routes.ts`.
 */
export const authUrls = {
  login: usingPreview ? `${origin}/index.html` : `${origin}/login`,
  signup: usingPreview ? `${origin}/signup.html` : `${origin}/signup`,
};

/**
 * TODO(clickforge): confirm these two destinations.
 *
 * "Talk to sales" (Studio tier) and "Book a walkthrough" (closing section) are the
 * only CTAs on the page whose target isn't derivable from what exists in the repo.
 * These are conventional placeholder paths so neither button is dead — point them
 * at the real scheduler/inbox before launch.
 */
export const contactUrls = {
  sales: 'https://clickforge.com/contact-sales',
  demo: 'https://clickforge.com/book-a-walkthrough',
};

/**
 * The public feedback board (Canny / UserJot), linked from the footer.
 *
 * TODO(clickforge): set this to the real board URL before launch. While it is
 * empty the footer renders "Feedback Board" as plain text rather than as a link
 * to nowhere — one line to change, and the link turns itself on.
 */
export const feedbackUrl = '';
