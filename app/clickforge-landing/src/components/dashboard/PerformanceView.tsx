import React, { useMemo } from 'react';
import { Text, View } from 'react-native';
import { fontFamily, type as t } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import type { ShippedForge } from '../../data/dashboard';
import { relativeDay } from '../../data/relativeTime';
import { useForge } from '../../state/ForgeStore';
import { Card } from '../Card';

/**
 * Whether the predictions held.
 *
 * Every figure here is computed from the rows the creator actually shipped, and
 * where there are not enough rows to say anything, it says that instead of
 * showing a number. A dashboard that reports a mean absolute error over two
 * videos is not reporting accuracy, it is reporting noise with a decimal point.
 */

/** Rows whose seven-day window has closed. Everything on this screen is derived from these. */
function measured(shipped: ShippedForge[]): (ShippedForge & { actual: number })[] {
  return shipped.filter((s): s is ShippedForge & { actual: number } => s.actual != null);
}

function Stat({ value, label, note, tone }: { value: string; label: string; note?: string; tone?: string }) {
  const p = usePalette();
  return (
    <Card level={2} style={{ flexBasis: 200, flexGrow: 1, gap: 8 }}>
      <Text
        style={{
          fontFamily: fontFamily.monoMedium,
          fontSize: 32,
          letterSpacing: -0.8,
          color: tone ?? p.textPrimary,
          fontVariant: ['tabular-nums'],
        }}
      >
        {value}
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: t.label.size,
          letterSpacing: t.label.tracking,
          textTransform: 'uppercase',
          color: p.textMuted,
        }}
      >
        {label}
      </Text>
      {note ? (
        <Text
          style={{
            fontFamily: fontFamily.interRegular,
            fontSize: 13,
            lineHeight: 13 * 1.5,
            color: p.textSecondary,
          }}
        >
          {note}
        </Text>
      ) : null}
    </Card>
  );
}

/** One shipped row, ordered by how far the prediction missed. */
function CallRow({ item, last }: { item: ShippedForge & { actual: number }; last: boolean }) {
  const p = usePalette();
  const delta = item.actual - item.predicted;
  const tone = Math.abs(delta) < 0.35 ? p.textSecondary : delta > 0 ? p.ctrHigh : p.ctrLow;

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        paddingVertical: 14,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: p.border,
      }}
    >
      <View style={{ flex: 1, gap: 4, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: 15,
            lineHeight: 15 * 1.4,
            letterSpacing: -0.25,
            color: p.textPrimary,
          }}
        >
          {item.title}
        </Text>
        <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 13, color: p.textMuted }}>
          {item.platform}, {relativeDay(item.shippedAt)}
        </Text>
      </View>
      <Text
        style={{
          fontFamily: fontFamily.monoRegular,
          fontSize: t.bodySm.size,
          color: p.textSecondary,
          fontVariant: ['tabular-nums'],
        }}
      >
        {item.predicted.toFixed(1)} → {item.actual.toFixed(1)}
      </Text>
      <Text
        style={{
          fontFamily: fontFamily.monoMedium,
          fontSize: t.bodySm.size,
          color: tone,
          fontVariant: ['tabular-nums'],
          minWidth: 48,
          textAlign: 'right',
        }}
      >
        {delta >= 0 ? '+' : ''}
        {delta.toFixed(1)}
      </Text>
    </View>
  );
}

function Prose({ children }: { children: React.ReactNode }) {
  const p = usePalette();
  return (
    <Text
      style={{
        fontFamily: fontFamily.interRegular,
        fontSize: t.bodySm.size,
        lineHeight: t.bodySm.size * t.bodySm.leading,
        color: p.textMuted,
        maxWidth: 560,
      }}
    >
      {children}
    </Text>
  );
}

/** Below this, an average says more about which videos happened to ship than about the engine. */
const MIN_FOR_ACCURACY = 3;

export function PerformanceView() {
  const p = usePalette();
  const { shipped } = useForge();

  /**
   * One pass for every figure on the screen, recomputed only when the shipped
   * list changes rather than on every render.
   *
   * The mean, the within-tolerance count and the beat count were three separate
   * walks over the same array plus a fourth to build the errors — each cheap on
   * its own, all four redone whenever anything above re-rendered. They answer
   * questions about the same row, so they are answered while holding it.
   */
  const stats = useMemo(() => {
    const done = measured(shipped);

    let errorTotal = 0;
    let within = 0;
    let beat = 0;
    for (const row of done) {
      const delta = row.actual - row.predicted;
      errorTotal += Math.abs(delta);
      if (Math.abs(delta) <= 0.5) within += 1;
      if (delta > 0) beat += 1;
    }

    return {
      done,
      pending: shipped.length - done.length,
      enough: done.length >= MIN_FOR_ACCURACY,
      meanError: done.length ? errorTotal / done.length : 0,
      within,
      beat,
      // Sorted by miss, largest first: the rows worth reading are the ones the
      // engine got wrong, not the ones it got right. Copied before sorting so
      // the store's array is never reordered underneath it.
      byMiss: [...done].sort(
        (a, b) => Math.abs(b.actual - b.predicted) - Math.abs(a.actual - a.predicted),
      ),
    };
  }, [shipped]);

  const { done, pending, enough, meanError, within, beat, byMiss } = stats;

  return (
    <View style={{ gap: 32 }}>
      <View style={{ gap: 8 }}>
        <Text
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: 20,
            letterSpacing: -0.42,
            color: p.textPrimary,
          }}
        >
          How the predictions held
        </Text>
        <Prose>
          Measured against the click-through each video actually got after seven days.
          {pending > 0 ? ` ${pending} still inside the window.` : ''}
        </Prose>
      </View>

      {done.length === 0 ? (
        <Card level={2}>
          <Prose>
            Nothing has finished its seven-day window yet. Ship something from the forge queue and its realised
            click-through will land here.
          </Prose>
        </Card>
      ) : (
        <>
          <View style={{ flexDirection: 'row', gap: 16, flexWrap: 'wrap' }}>
            <Stat
              value={enough ? meanError.toFixed(2) : '—'}
              label="Mean miss"
              note={
                enough
                  ? 'Average distance between predicted and realised, in score points.'
                  : `Needs ${MIN_FOR_ACCURACY} measured videos before an average means anything. ${done.length} so far.`
              }
            />
            <Stat
              value={`${within}/${done.length}`}
              label="Within ±0.5"
              note="Calls that landed inside half a point of the realised figure."
            />
            <Stat
              value={`${beat}/${done.length}`}
              label="Beat the call"
              tone={beat > done.length / 2 ? p.ctrHigh : undefined}
              note="Videos that outperformed what the engine predicted."
            />
          </View>

          <View style={{ gap: 4 }}>
            <Text
              style={{
                fontFamily: fontFamily.interMedium,
                fontSize: 16,
                letterSpacing: -0.25,
                color: p.textPrimary,
                marginBottom: 8,
              }}
            >
              Biggest misses first
            </Text>
            {byMiss.map((item, i) => (
              <CallRow key={item.id} item={item} last={i === byMiss.length - 1} />
            ))}
          </View>
        </>
      )}
    </View>
  );
}
