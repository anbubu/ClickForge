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
