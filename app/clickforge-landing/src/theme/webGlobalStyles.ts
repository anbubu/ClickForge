import { Platform } from 'react-native';
import { focusRing } from './tokens';
import { darkPalette, lightPalette } from './palettes';

/**
 * A few things the page needs that RN Web can't express as inline styles,
 * injected once on web and a no-op everywhere else.
 *
 * `:focus-visible` is the important one: the whole page is built from Pressables,
 * which RN Web renders as focusable elements with no visible focus state, so the
 * site was unusable by keyboard. This puts an ember ring on anything focusable —
 * only for keyboard focus, so it never fires on mouse clicks.
 */
const CSS = `
  /* ThemeContext stamps data-theme, so these follow the toggle, not the OS. */
  html[data-theme="dark"] { color-scheme: dark; background: ${darkPalette.canvas}; }
  html[data-theme="light"] { color-scheme: light; background: ${lightPalette.canvas}; }

  [role="button"]:focus-visible,
  [role="link"]:focus-visible,
  [role="tab"]:focus-visible,
  [role="switch"]:focus-visible,
  a:focus-visible,
  input:focus-visible,
  textarea:focus-visible,
  [tabindex]:focus-visible {
    outline: ${focusRing.width}px solid ${focusRing.color};
    outline-offset: ${focusRing.offset}px;
  }

  /*
   * The theme reveal.
   *
   * A view transition cross-fades the two snapshots by default, which would read
   * as a wash rather than a circle. Both default animations are switched off so
   * the only motion is the clip-path circle ThemeContext drives from the toggle's
   * coordinates. Stacking matters: the incoming theme has to sit above the
   * outgoing one, so the circle reveals the new theme over the still-visible old
   * page instead of punching a hole in it.
   */
  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation: none;
    mix-blend-mode: normal;
  }
  ::view-transition-old(root) { z-index: 1; }
  ::view-transition-new(root) { z-index: 2; }

  /*
   * Pin the collapsed circle for the frame between the snapshot and the JS
   * animation starting, otherwise the new theme flashes unclipped.
   */
  html[data-cf-theme-vt="active"]::view-transition-new(root) {
    clip-path: var(--cf-theme-vt-clip-from);
  }

  /*
   * The group's own animation still governs when the transition ends. Left at
   * its 250ms default it would tear down mid-reveal and the circle would snap.
   */
  html[data-cf-theme-vt="active"]::view-transition-group(root) {
    animation-duration: var(--cf-theme-vt-duration);
  }

  /* Selection picks up the brand rather than the browser default blue. */
  ::selection { background: ${darkPalette.accent}; color: ${darkPalette.textOnAccent}; }

  /*
   * Belt-and-braces for reduced motion. The reveal and nav-glide animations are
   * already gated in JS (useReducedMotion), but this also neutralises anything
   * the browser or a future component animates on its own.
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
  el.setAttribute('data-clickforge', 'global');
  el.textContent = CSS;
  document.head.appendChild(el);
}
