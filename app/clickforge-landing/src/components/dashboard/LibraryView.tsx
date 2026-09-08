import React, { useMemo, useState } from 'react';
import { Text, View } from 'react-native';
import { fontFamily, radius, type as t } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import type { Blueprint } from '../../data/dashboard';
import { winningTitle } from '../../data/dashboard';
import { relativeDay } from '../../data/relativeTime';
import { useForge } from '../../state/ForgeStore';
import { Badge } from '../Badge';
import { Card } from '../Card';
import { SegmentedControl } from '../SegmentedControl';

/**
 * Every blueprint and hook the account has produced, in one place.
 *
 * A blueprint is worth more the second time than the first — the point of
 * keeping them is that a framing which worked on one video is the obvious
 * starting point for the next. So this reads across both lists: what is still in
 * the queue and what has already shipped, with the shipped entries carrying the
 * one thing the queue cannot, which is whether it worked.
 */

type Entry = {
  id: string;
  title: string;
  concept?: string;
  platform: string;
  hook?: string;
  blueprint?: Blueprint;
  at: number;
  status: 'queued' | 'shipped';
  /** Realised score, for shipped rows whose window has closed. */
  actual?: number | null;
};

const FILTERS = [
  { value: 'all', label: 'All' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'queued', label: 'In progress' },
];

function BlueprintLines({ blueprint }: { blueprint: Blueprint }) {
  const p = usePalette();
  const lines: [string, string][] = [
    ['Subject', blueprint.subject],
    ['Grade', blueprint.grade],
    ['Overlay', blueprint.overlay],
    ['Negative space', blueprint.negativeSpace],
  ];
  return (
    <View style={{ gap: 8 }}>
      {lines.map(([label, value]) => (
        <View key={label} style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
          <Text style={{ fontFamily: fontFamily.monoRegular, fontSize: t.label.size, color: p.textMuted, minWidth: 110 }}>
            {label}
          </Text>
          <Text
            style={{
              flex: 1,
              minWidth: 200,
              fontFamily: fontFamily.regular,
              fontSize: t.bodySm.size,
              lineHeight: t.bodySm.size * t.bodySm.leading,
              color: p.textSecondary,
            }}
          >
            {value}
          </Text>
        </View>
      ))}
    </View>
  );
}

function EntryCard({ entry }: { entry: Entry }) {
  const p = usePalette();
  return (
    <Card variant="dark" style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
        <View style={{ flex: 1, gap: 6, minWidth: 220 }}>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: t.body.size,
              lineHeight: t.body.size * 1.4,
              letterSpacing: -0.25,
              color: p.textPrimary,
            }}
          >
            {entry.title}
          </Text>
          <Text style={{ fontFamily: fontFamily.regular, fontSize: t.bodySm.size, color: p.textMuted }}>
            {entry.platform}, {relativeDay(entry.at)}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {entry.status === 'shipped' && entry.actual != null && (
            <Text
              style={{
                fontFamily: fontFamily.monoMedium,
                fontSize: t.label.size,
                color: p.textSecondary,
                fontVariant: ['tabular-nums'],
              }}
            >
              {entry.actual.toFixed(1)}
            </Text>
          )}
          <Badge tone={entry.status === 'shipped' ? 'signal' : 'neutral'}>
            {entry.status === 'shipped' ? 'Shipped' : 'In progress'}
          </Badge>
        </View>
      </View>

      {entry.hook ? (
        <View style={{ gap: 6 }}>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: t.label.size,
              letterSpacing: t.label.tracking,
              textTransform: 'uppercase',
              color: p.textMuted,
            }}
          >
            Hook
          </Text>
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: t.bodySm.size,
              lineHeight: t.bodySm.size * t.bodySm.leading,
              color: p.textSecondary,
              borderLeftWidth: 2,
              borderLeftColor: p.border,
              paddingLeft: 12,
            }}
          >
            {entry.hook}
          </Text>
        </View>
      ) : null}

      {entry.blueprint && (
        <View style={{ gap: 8 }}>
          <Text
            style={{
              fontFamily: fontFamily.monoRegular,
              fontSize: t.label.size,
              letterSpacing: t.label.tracking,
              textTransform: 'uppercase',
              color: p.textMuted,
            }}
          >
            Blueprint
          </Text>
          <View
            style={{
              padding: 12,
              borderRadius: radius.cards,
              borderWidth: 1,
              borderColor: p.border,
              backgroundColor: p.surface,
            }}
          >
            <BlueprintLines blueprint={entry.blueprint} />
          </View>
        </View>
      )}
    </Card>
  );
}

export function LibraryView() {
  const p = usePalette();
  const { queue, shipped } = useForge();
  const [filter, setFilter] = useState('all');

  const entries = useMemo<Entry[]>(() => {
    const fromQueue: Entry[] = queue.map((item) => ({
      id: `q-${item.id}`,
      title: winningTitle(item).text,
      concept: item.concept,
      platform: item.platform,
      hook: item.hook,
      blueprint: item.blueprint,
      at: item.forgedAt,
      status: 'queued',
    }));

    const fromShipped: Entry[] = shipped.map((item) => ({
      id: `s-${item.id}`,
      title: item.title,
      concept: item.concept,
      platform: item.platform,
      hook: item.hook,
      blueprint: item.blueprint,
      at: item.shippedAt,
      status: 'shipped',
      actual: item.actual,
    }));

    // Newest first across both lists — the library is a record, and a record
    // reads in time order rather than grouped by which list a row came from.
    return [...fromQueue, ...fromShipped].sort((a, b) => b.at - a.at);
  }, [queue, shipped]);

  // One pass, and only when the filter or the entries actually change. Rows
  // written before shipping kept its assets have nothing to show, so they are
  // dropped in the same walk that applies the filter.
  const withAssets = useMemo(
    () =>
      entries.filter(
        (e) => (filter === 'all' || e.status === filter) && (e.hook || e.blueprint),
      ),
    [entries, filter],
  );

  return (
    <View style={{ gap: 24 }}>
      <View style={{ gap: 8 }}>
        <Text style={{ fontFamily: fontFamily.regular, fontSize: t.headingSm.size, letterSpacing: t.headingSm.tracking, color: p.textPrimary }}>
          Blueprint library
        </Text>
        <Text
          style={{
            fontFamily: fontFamily.regular,
            fontSize: t.bodySm.size,
            lineHeight: t.bodySm.size * t.bodySm.leading,
            color: p.textMuted,
            maxWidth: 560,
          }}
        >
          Every hook and thumbnail brief this account has forged, newest first. A framing that worked once is the
          cheapest place to start the next one.
        </Text>
      </View>

      <SegmentedControl value={filter} onChange={setFilter} options={FILTERS} />

      {withAssets.length === 0 ? (
        <Card variant="dark">
          <Text
            style={{
              fontFamily: fontFamily.regular,
              fontSize: t.body.size,
              lineHeight: t.body.size * t.body.leading,
              color: p.textSecondary,
              maxWidth: 460,
            }}
          >
            Nothing here yet. Forge a concept and its hook and thumbnail brief are kept, through shipping and after.
          </Text>
        </Card>
      ) : (
        <View style={{ gap: 16 }}>
          {withAssets.map((entry) => (
            <EntryCard key={entry.id} entry={entry} />
          ))}
        </View>
      )}
    </View>
  );
}
