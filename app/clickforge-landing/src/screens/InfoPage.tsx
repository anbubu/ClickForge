import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Container } from '../components/Container';
import { PageBar } from '../components/PageBar';
import { headingProps, landmark } from '../components/semantics';
import type { InfoRoute, PageBlock } from '../data/pages';
import { INFO_PAGES } from '../data/pages';
import { hrefFor } from '../navigation/routes';
import { fontFamily, type as t } from '../theme/tokens';
import { usePalette } from '../theme/ThemeContext';
import { typeStyle, useResponsiveType } from '../theme/useResponsiveType';

/**
 * One screen for every standing page — about, contact, changelog and the rest.
 *
 * They share a shape because they share a job: a reader arrives from a footer
 * link, wants one fact, and leaves. Building eight screens for that would give
 * eight chances for them to drift apart, so the page is data (`data/pages.ts`)
 * and this is the only renderer. It deliberately reuses the model card's
 * treatment — 820px measure, mono section labels, the leading status callout —
 * because the model card is the page on this site that already got the job of
 * "a document, stated plainly" right.
 */

function Body({ children }: { children: React.ReactNode }) {
  const p = usePalette();
  return (
    <Text
      style={{
        fontFamily: fontFamily.regular,
        fontSize: t.body.size,
        lineHeight: t.body.size * t.body.leading,
        color: p.textSecondary,
        maxWidth: 620,
      }}
    >
      {children}
    </Text>
  );
}

/** A labelled pair, matching the model card's spec rows. */
function Row({ label, value }: { label: string; value: string }) {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'baseline' }}>
      <Text
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: p.textMuted,
          width: 148,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          flex: 1,
          minWidth: 200,
          fontFamily: fontFamily.regular,
          fontSize: t.bodySm.size,
          lineHeight: t.bodySm.size * t.bodySm.leading,
          color: p.textPrimary,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function Block({ block }: { block: PageBlock }) {
  const p = usePalette();

  if (block.kind === 'prose') return <Body>{block.text}</Body>;

  if (block.kind === 'rows') {
    return (
      <Card variant="dark" style={{ gap: 16 }}>
        {block.rows.map((r) => (
          <Row key={r.label} label={r.label} value={r.value} />
        ))}
      </Card>
    );
  }

  if (block.kind === 'entries') {
    return (
      <View style={{ gap: 28 }}>
        {block.entries.map((e) => (
          <View key={e.date} style={{ gap: 8 }}>
            <Text
              style={{
                fontFamily: fontFamily.monoRegular,
                fontSize: t.label.size,
                letterSpacing: t.label.tracking,
                textTransform: 'uppercase',
                color: p.textMuted,
              }}
            >
              {e.date}
            </Text>
            <Text
              {...headingProps(3)}
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.body.size,
                letterSpacing: t.body.tracking,
                color: p.textPrimary,
              }}
            >
              {e.title}
            </Text>
            <Body>{e.body}</Body>
          </View>
        ))}
      </View>
    );
  }

  return (
    <View style={{ gap: 16 }}>
      {block.links.map((l) => (
        <View key={l.label} style={{ gap: 6, alignItems: 'flex-start' }}>
          <Button size="md" variant="ghost" href={l.route ? hrefFor(l.route) : l.href}>
            {l.label}
          </Button>
          {!!l.note && (
            <Text
              style={{
                fontFamily: fontFamily.regular,
                fontSize: t.bodySm.size,
                lineHeight: t.bodySm.size * t.bodySm.leading,
                color: p.textMuted,
              }}
            >
              {l.note}
            </Text>
          )}
        </View>
      ))}
    </View>
  );
}

export function InfoPage({ route }: { route: InfoRoute }) {
  const p = usePalette();
  const rt = useResponsiveType();
  const page = INFO_PAGES[route];

  return (
    <View style={{ flex: 1, backgroundColor: p.canvas }}>
      <PageBar label={page.bar} />
      <ScrollView
        {...landmark.main}
        style={{ flex: 1, backgroundColor: p.canvas }}
        contentContainerStyle={{ paddingBottom: 96 }}
      >
        <Container style={{ maxWidth: 820, gap: 44, paddingTop: 48 }}>
          <View style={{ gap: 18 }}>
            <Text
              {...headingProps(1)}
              style={{ fontFamily: fontFamily.regular, ...typeStyle(rt.headingLg), color: p.textPrimary }}
            >
              {page.title}
            </Text>
            <Body>{page.lead}</Body>
          </View>

          {/* Leads the page, because it is the fact that changes how everything
              below should be read. Same reasoning as the model card's. */}
          {!!page.status && (
            <Card variant="dark" selected style={{ gap: 12 }}>
              <Text
                style={{
                  fontFamily: fontFamily.monoRegular,
                  fontSize: t.label.size,
                  letterSpacing: t.label.tracking,
                  textTransform: 'uppercase',
                  color: p.signal,
                }}
              >
                {page.status.label}
              </Text>
              <Text
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: t.body.size,
                  lineHeight: t.body.size * t.body.leading,
                  color: p.textPrimary,
                }}
              >
                {page.status.text}
              </Text>
            </Card>
          )}

          {page.sections.map((section) => (
            <View key={section.title} style={{ gap: 14 }}>
              <Text
                {...headingProps(2)}
                style={{
                  fontFamily: fontFamily.regular,
                  fontSize: t.headingSm.size,
                  letterSpacing: t.headingSm.tracking,
                  color: p.textPrimary,
                }}
              >
                {section.title}
              </Text>
              {section.blocks.map((block, i) => (
                <Block key={i} block={block} />
              ))}
            </View>
          ))}
        </Container>
      </ScrollView>
    </View>
  );
}
