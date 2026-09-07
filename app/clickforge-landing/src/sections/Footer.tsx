import React, { useState } from 'react';
import { Linking, Pressable, Text, View } from 'react-native';
import { Badge } from '../components/Badge';
import { Container } from '../components/Container';
import { Wordmark } from '../components/Wordmark';
import { headingProps, landmark } from '../components/semantics';
import { feedbackUrl } from '../config/urls';
import { AnchorSection, useScrollController } from '../navigation/ScrollController';
import { goTo, type Route } from '../navigation/routes';
import { fontFamily } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

/**
 * `section` points a link at an on-page anchor, `href` at somewhere off-site, and
 * `route` at another screen in the app. The rest have no destination yet — they
 * render as plain text rather than as focusable links that go nowhere, which
 * would be worse for keyboard and screen-reader users than not being links at all.
 *
 * TODO(clickforge): give these real hrefs as the pages ship.
 */
/** Below this the four link columns no longer fit beside the brand block. */
const FOOTER_STACK_WIDTH = 720;

type FooterItem = { label: string; section?: string; href?: string; route?: Route };

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
      { label: 'Model cards', route: 'model-card' },
      { label: 'API docs' },
      { label: 'Feedback Board', href: feedbackUrl },
      { label: 'Status' },
    ],
  },
  { heading: 'Company', links: [{ label: 'About' }, { label: 'Careers' }, { label: 'Press' }, { label: 'Contact' }] },
];

/**
 * Resolves a footer entry to the thing it does, or to nothing — an entry with no
 * destination stays undefined on purpose so `FooterLink` renders it as text.
 * `href` is checked for emptiness as well as presence: an unset external URL is a
 * dead link, and a dead link is worse than a label.
 */
function destination(item: FooterItem, scrollTo: (id: string) => void): (() => void) | undefined {
  if (item.section) return () => scrollTo(item.section as string);
  if (item.route) return () => goTo(item.route as Route);
  if (item.href) return () => Linking.openURL(item.href as string);
  return undefined;
}

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
  const stacked = useBelow(FOOTER_STACK_WIDTH);
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
              <FooterLink key={l.label} label={l.label} onPress={destination(l, scrollTo)} />
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
