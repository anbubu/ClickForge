import React from 'react';
import { Text, View, useWindowDimensions } from 'react-native';
import { Badge } from '../components/Badge';
import { Container } from '../components/Container';
import { Wordmark } from '../components/Wordmark';
import { AnchorSection } from '../navigation/ScrollController';
import { colors, fontFamily } from '../theme/tokens';

const COLUMNS: { heading: string; links: string[] }[] = [
  { heading: 'Product', links: ['Title engine', 'Retention hooks', 'Thumbnail blueprints', 'CTR prediction', 'Changelog'] },
  { heading: 'Platforms', links: ['YouTube', 'YouTube Shorts', 'TikTok', 'Instagram Reels'] },
  { heading: 'Resources', links: ['Blueprint library', 'CTR benchmarks', 'Model cards', 'API docs', 'Status'] },
  { heading: 'Company', links: ['About', 'Careers', 'Press', 'Contact'] },
];

function FooterLink({ children }: { children: string }) {
  return (
    <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 14, color: colors.ash }}>{children}</Text>
  );
}

export function Footer() {
  const { width } = useWindowDimensions();
  const stacked = width < 720;

  return (
    <AnchorSection
      id="footer"
      style={{ borderTopWidth: 1, borderTopColor: colors.slateEdge, paddingVertical: 64, paddingHorizontal: 24, paddingBottom: 40 }}
    >
      <Container
        style={{
          flexDirection: stacked ? 'column' : 'row',
          gap: 40,
        }}
      >
        <View style={{ flex: stacked ? undefined : 1.4, gap: 16, alignItems: 'flex-start' }}>
          <Wordmark size={20} />
          <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 14, lineHeight: 14 * 1.57, color: colors.ash, maxWidth: 260 }}>
            Score the click before you record.
          </Text>
          <Badge>SOC 2 Type II</Badge>
        </View>
        {COLUMNS.map((col) => (
          <View key={col.heading} style={{ flex: stacked ? undefined : 1, gap: 12 }}>
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: 12,
                letterSpacing: 0.85,
                textTransform: 'uppercase',
                color: colors.bone,
              }}
            >
              {col.heading}
            </Text>
            {col.links.map((l) => (
              <FooterLink key={l}>{l}</FooterLink>
            ))}
          </View>
        ))}
      </Container>
      <Container style={{ marginTop: 48, paddingTop: 24, borderTopWidth: 1, borderTopColor: colors.slateEdge }}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 }}>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: 12,
              letterSpacing: 0.85,
              textTransform: 'uppercase',
              color: colors.mist,
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
              color: colors.mist,
            }}
          >
            Privacy · Terms
          </Text>
        </View>
      </Container>
    </AnchorSection>
  );
}
