import { Platform } from 'react-native';
import { duration, easing, focusRing } from './tokens';
import { palette } from './palettes';

/**
 * The CSS transition helper the whole system shares.
 *
 * DESIGN.md asks for one thing that RN's Animated cannot express cleanly:
 * *"colour, background-color, border-color and stroke all transition together so
 * state changes feel like a single switch flipping, not a layered animation."*
 * A CSS transition does exactly that in one declaration; an Animated.Value per
 * property is the layered animation the doc is warning against.
 *
 * Returns `{}` off web, where the properties simply snap.
 */
export function transition(properties: string, ms: number = duration.fast) {
  if (Platform.OS !== 'web') return {};
  return { transitionProperty: properties, transitionDuration: `${ms}ms`, transitionTimingFunction: easing } as any;
}

/**
 * A few things the page needs that RN Web can't express as inline styles,
 * injected once on web and a no-op everywhere else.
 *
 * `:focus-visible` is the important one: the whole page is built from Pressables,
 * which RN Web renders as focusable elements with no visible focus state, so the
 * site was unusable by keyboard. This puts a signal-orange ring on anything
 * focusable — only for keyboard focus, so it never fires on mouse clicks.
 */
const CSS = `
  html, html[data-theme="dark"] { color-scheme: dark; background: ${palette.canvas}; }

  [role="button"]:focus-visible,
  [role="link"]:focus-visible,
  [role="tab"]:focus-visible,
  [role="radio"]:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  [tabindex]:focus-visible {
    outline: ${focusRing.width}px solid ${focusRing.color};
    outline-offset: ${focusRing.offset}px;
  }

  /* Selection picks up the signal accent — a live state, which is what it is for. */
  ::selection { background: ${palette.signal}; color: ${palette.canvas}; }

  /*
   * The logo marquee. DESIGN.md names it as one of only two permitted long
   * motions, so it is defined once here rather than driven from JS.
   */
  @keyframes cf-marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  /* The single dashboard entrance the system allows itself. */
  @keyframes cf-frame-in {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /*
   * Belt-and-braces for reduced motion. The marquee and frame entrance are the
   * only animations left on the page, and both stop here.
   */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }
`;

let injected = false;

export function installWebGlobalStyles() {
  if (injected || Platform.OS !== 'web' || typeof document === 'undefined') return;
  injected = true;
  const el = document.createElement('style');
  el.setAttribute('data-clicktoforge', 'global');
  el.textContent = CSS;
  document.head.appendChild(el);
}
