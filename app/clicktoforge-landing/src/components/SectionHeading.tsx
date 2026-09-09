import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily, type as t } from '../theme/tokens';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';
import { Eyebrow } from './Eyebrow';
import { headingProps } from './semantics';
import { usePalette } from '../theme/ThemeContext';

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
  level = 2,
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  /**
   * Left by default. DESIGN.md's layout is asymmetric throughout - a 1/3 + 2/3
   * hero, headers hanging off the content's left edge - and a centred block is
   * the one shape that cannot be asymmetric. Centre only for a section with no
   * column to hang from; there are none on this page.
   */
  align?: 'center' | 'left';
  /** Section titles are h2 under the hero's h1; override only to nest deeper. */
  level?: 2 | 3;
}) {
  const p = usePalette();
  const centered = align === 'center';
  const rt = useResponsiveType();
  return (
    <View style={{ gap: 24, alignItems: centered ? 'center' : 'flex-start', width: '100%' }}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      <Text
        {...headingProps(level)}
        style={{
          fontFamily: fontFamily.regular,
          ...typeStyle(rt.headingLg),
          color: p.textPrimary,
          maxWidth: 560,
          textAlign: centered ? 'center' : 'left',
        }}
      >
        {title}
      </Text>
      {body ? (
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: t.body.size,
            lineHeight: t.body.size * t.body.leading,
            letterSpacing: t.body.tracking,
            color: p.textSecondary,
            maxWidth: 640,
            textAlign: 'left',
          }}
        >
          {body}
        </Text>
      ) : null}
    </View>
  );
}
