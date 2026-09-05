import React from 'react';
import { Text, View } from 'react-native';
import { colors, fontFamily, type as t } from '../theme/tokens';
import { Eyebrow } from './Eyebrow';

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'center',
}: {
  eyebrow?: string;
  title: string;
  body?: string;
  align?: 'center' | 'left';
}) {
  const centered = align === 'center';
  return (
    <View style={{ gap: 24, alignItems: centered ? 'center' : 'flex-start', width: '100%' }}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <Text
        style={{
          fontFamily: fontFamily.interMedium,
          fontSize: t.headingLg.size,
          lineHeight: t.headingLg.size * t.headingLg.leading,
          letterSpacing: t.headingLg.tracking,
          color: colors.bone,
          maxWidth: 560,
          textAlign: centered ? 'center' : 'left',
        }}
      >
        {title}
      </Text>
      {body && (
        <Text
          style={{
            fontFamily: fontFamily.interRegular,
            fontSize: t.body.size,
            lineHeight: t.body.size * t.body.leading,
            letterSpacing: t.body.tracking,
            color: colors.ash,
            maxWidth: 640,
            textAlign: 'left',
          }}
        >
          {body}
        </Text>
      )}
    </View>
  );
}
