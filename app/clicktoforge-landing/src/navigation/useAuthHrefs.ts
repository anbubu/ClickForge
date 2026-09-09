import { hrefFor } from './routes';
import { useAuth } from '../state/AuthProvider';

/**
 * Where the marketing page's two account calls to action point.
 *
 * They cannot be constants, because the right destination depends on who is
 * reading. A signed-in creator clicking "Start 30-Day Free Trial" wants the
 * forge, not a sign-up form for an account they already have; a signed-out one
 * wants the form; and in demo mode there is no account to make, so both go
 * straight to the forge exactly as they did before there was auth.
 *
 * Keeping that in one hook is what stops the eight CTAs across the page from
 * drifting into eight slightly different answers.
 */

export function useTrialHref(): string {
  const { mode, session } = useAuth();
  if (mode === 'demo') return hrefFor('dashboard');
  return hrefFor(session ? 'dashboard' : 'signup');
}

export function useSignInHref(): string {
  const { mode, session } = useAuth();
  if (mode === 'demo') return hrefFor('dashboard');
  return hrefFor(session ? 'dashboard' : 'signin');
}
