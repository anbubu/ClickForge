import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Container } from '../components/Container';
import { Wordmark } from '../components/Wordmark';
import { headingProps, landmark } from '../components/semantics';
import { feedbackUrl } from '../config/urls';
import { AnchorSection, useScrollController } from '../navigation/ScrollController';
import { hrefFor, type Route } from '../navigation/routes';
import { fontFamily, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { useBelow } from '../theme/useBreakpoint';

/**
 * `section` points a link at an on-page anchor, `href` at somewhere off-site, and
 * `route` at another screen in the app.
 *
 * Every entry now resolves to one of those three. Fourteen of them used to
 * resolve to nothing and rendered as plain text — safer than a dead link, but
 * still a footer describing a company with a careers page, an API and a status
 * page that did not exist. The pages behind them are in `data/pages.ts`, and
 * each says what is true today rather than what its label implies.
 *
 * The four platform names stay on-page anchors on purpose: they are capabilities
 * of the engine, not products with pages of their own, and pointing them at the
 * section that demonstrates the scoring is the honest destination.
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
      { label: 'Changelog', route: 'changelog' },
    ],
  },
  {
    heading: 'Platforms',
    links: [
      { label: 'YouTube', section: 'engine' },
      { label: 'YouTube Shorts', section: 'engine' },
      { label: 'TikTok', section: 'engine' },
      { label: 'Instagram Reels', section: 'engine' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Blueprint library', route: 'blueprints' },
      { label: 'CTR benchmarks', section: 'proof' },
      { label: 'Model cards', route: 'model-card' },
      { label: 'API docs', route: 'api' },
      { label: 'Feedback Board', href: feedbackUrl },
      { label: 'Status', route: 'status' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', route: 'about' },
      { label: 'Careers', route: 'careers' },
      { label: 'Press', route: 'press' },
      { label: 'Contact', route: 'contact' },
    ],
  },
];

/**
 * Resolves a footer entry to the thing it does, or to nothing — an entry with no
 * destination stays undefined on purpose so `FooterLink` renders it as text.
 * `href` is checked for emptiness as well as presence: an unset external URL is a
 * dead link, and a dead link is worse than a label.
 */
function destination(
  item: FooterItem,
  scrollTo: (id: string) => void,
): { onPress?: () => void; href?: string } {
  // An on-page target is a scroll, not a document: the sections carry no DOM ids
  // to point an href at, so this one stays a handler.
  if (item.section) return { onPress: () => scrollTo(item.section as string) };
  // The rest are addressable, so they are rendered as real links and the browser
  // does the navigating — which is what makes them open in a new tab and makes
  // them worth something to a crawler.
  if (item.route) return { href: hrefFor(item.route as Route) };
  if (item.href) return { href: item.href };
  return {};
}

function FooterLink({ label, onPress, href }: { label: string; onPress?: () => void; href?: string }) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const style = {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: hover ? p.textPrimary : p.textSecondary,
  } as const;

  if (!onPress && !href) {
    return <Text style={{ ...style, color: p.textSecondary }}>{label}</Text>;
  }

  return (
    <Pressable
      onPress={onPress}
      {...((href ? { href } : null) as any)}
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
          <Text style={{ fontFamily: fontFamily.regular, fontSize: 14, lineHeight: 14 * 1.57, color: p.textSecondary, maxWidth: 260 }}>
            Score the click before you record.
          </Text>
          {/* A SOC 2 Type II badge sat here. There is no audit, and a
              compliance badge is a claim a buyer is entitled to ask for the
              report behind. It goes back when there is one to show. */}
        </View>
        {COLUMNS.map((col) => (
          <View key={col.heading} style={{ flex: stacked ? undefined : 1, gap: 12 }}>
            <Text
              {...headingProps(3)}
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: 12,
                letterSpacing: t.label.tracking,
                textTransform: 'uppercase',
                color: p.textPrimary,
              }}
            >
              {col.heading}
            </Text>
            {col.links.map((l) => (
              <FooterLink key={l.label} label={l.label} {...destination(l, scrollTo)} />
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
              letterSpacing: t.label.tracking,
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
              letterSpacing: t.label.tracking,
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
