import React, { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { Badge } from '../components/Badge';
import { Container } from '../components/Container';
import { Wordmark } from '../components/Wordmark';
import { headingProps, landmark } from '../components/semantics';
import { AnchorSection, useScrollController } from '../navigation/ScrollController';
import { fontFamily } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';

/**
 * `section` points a link at an on-page anchor. The rest have no destination yet —
 * they render as plain text rather than as focusable links that go nowhere, which
 * would be worse for keyboard and screen-reader users than not being links at all.
 *
 * TODO(clickforge): give these real hrefs as the pages ship.
 */
type FooterItem = { label: string; section?: string };

const COLUMNS: { heading: string; links: FooterItem[] }[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Title engine', section: 'engine' },
      { label: 'Retention hooks', section: 'engine' },
      { label: 'Thumbnail blueprints', section: 'engine' },
      { label: 'CTR prediction', section: 'proof' },
      { label: 'Changelog' },
    ],
  },
  {
    heading: 'Platforms',
    links: [{ label: 'YouTube' }, { label: 'YouTube Shorts' }, { label: 'TikTok' }, { label: 'Instagram Reels' }],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blueprint library' },
      { label: 'CTR benchmarks', section: 'proof' },
      { label: 'Model cards' },
      { label: 'API docs' },
      { label: 'Status' },
    ],
  },
  { heading: 'Company', links: [{ label: 'About' }, { label: 'Careers' }, { label: 'Press' }, { label: 'Contact' }] },
];

function FooterLink({ label, onPress }: { label: string; onPress?: () => void }) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const style = {
    fontFamily: fontFamily.interRegular,
    fontSize: 14,
    color: hover ? p.textPrimary : p.textSecondary,
  } as const;

  if (!onPress) {
    return <Text style={{ ...style, color: p.textSecondary }}>{label}</Text>;
  }

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="link"
      accessibilityLabel={label}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{ alignSelf: 'flex-start' }}
    >
      <Text style={{ ...style, textDecorationLine: hover ? 'underline' : 'none' }}>{label}</Text>
    </Pressable>
  );
}

export function Footer() {
  const p = usePalette();
  const { width } = useWindowDimensions();
  const stacked = width < 720;
  const { scrollTo } = useScrollController();

  return (
    <AnchorSection
      id="footer"
      {...landmark.contentinfo}
      style={{ borderTopWidth: 1, borderTopColor: p.border, paddingVertical: 64, paddingHorizontal: 24, paddingBottom: 40 }}
    >
      <Container
        style={{
          flexDirection: stacked ? 'column' : 'row',
          gap: 40,
        }}
      >
        <View style={{ flex: stacked ? undefined : 1.4, gap: 16, alignItems: 'flex-start' }}>
          <Wordmark size={20} />
          <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 14, lineHeight: 14 * 1.57, color: p.textSecondary, maxWidth: 260 }}>
            Score the click before you record.
          </Text>
          <Badge>SOC 2 Type II</Badge>
        </View>
        {COLUMNS.map((col) => (
          <View key={col.heading} style={{ flex: stacked ? undefined : 1, gap: 12 }}>
            <Text
              {...headingProps(3)}
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: 12,
                letterSpacing: 0.85,
                textTransform: 'uppercase',
                color: p.textPrimary,
              }}
            >
              {col.heading}
            </Text>
            {col.links.map((l) => (
              <FooterLink
                key={l.label}
                label={l.label}
                onPress={l.section ? () => scrollTo(l.section as string) : undefined}
              />
            ))}
          </View>
        ))}
      </Container>
      <Container style={{ marginTop: 48, paddingTop: 24, borderTopWidth: 1, borderTopColor: p.border }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: 12,
              letterSpacing: 0.85,
              textTransform: 'uppercase',
              color: p.textMuted,
            }}
          >
            © 2026 ClickForge
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: 12,
              letterSpacing: 0.85,
              textTransform: 'uppercase',
              color: p.textMuted,
            }}
          >
            Privacy · Terms
          </Text>
        </View>
      </Container>
    </AnchorSection>
  );
}
