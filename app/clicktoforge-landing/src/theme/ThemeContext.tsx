import React, { type PropsWithChildren } from 'react';
import { Platform } from 'react-native';
import { palette, type Palette } from './palettes';

/**
 * There is one theme, so this is a constant rather than a context.
 *
 * What used to live here — two palettes, a stored preference, an OS-preference
 * listener, and a View Transitions circular sweep between them — is gone with the
 * light mode it existed to reach. The `usePalette()` call site survives unchanged
 * so components never had to learn that the switch disappeared, and so a second
 * palette can come back behind the same hook if the product ever needs one.
 */
export function usePalette(): Palette {
  return palette;
}

/** Paints the canvas onto the document itself, so there is no flash before React mounts. */
function applyDocumentTheme() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.style.colorScheme = 'dark';
  document.documentElement.style.backgroundColor = palette.canvas;
  document.body.style.backgroundColor = palette.canvas;
  const root = document.getElementById('root');
  if (root) root.style.backgroundColor = palette.canvas;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', palette.canvas);
}

applyDocumentTheme();

export function ThemeProvider({ children }: PropsWithChildren) {
  return <>{children}</>;
}

export type { Palette };
