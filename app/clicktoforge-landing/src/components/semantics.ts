/**
 * Semantic helpers for the web build.
 *
 * Everything on this page is a React Native primitive, which RN Web renders as a
 * <div> by default — so the document had no headings, no landmarks and no outline
 * at all for crawlers or a screen reader's rotor. RN Web does map roles onto real
 * elements (see react-native-web's propsToAccessibilityComponent): `header` with a
 * level becomes <h1>..<h6>, `banner`/`contentinfo`/`navigation`/`main` become
 * <header>/<footer>/<nav>/<main>.
 *
 * Spread these onto the relevant Text/View. Typed loosely because `aria-level`
 * isn't in React Native's own prop types.
 */
export function headingProps(level: 1 | 2 | 3 | 4 | 5 | 6): any {
  return { accessibilityRole: 'header', 'aria-level': level };
}

export const landmark = {
  banner: { accessibilityRole: 'banner' } as any,
  main: { accessibilityRole: 'main' } as any,
  navigation: { accessibilityRole: 'navigation' } as any,
  contentinfo: { accessibilityRole: 'contentinfo' } as any,
  region: { accessibilityRole: 'region' } as any,
};
