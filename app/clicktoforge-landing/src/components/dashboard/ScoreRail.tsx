import React from 'react';
import { Text, View } from 'react-native';
import { fontFamily } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import { ctrTone } from '../CTRScore';

export const RAIL_WIDTH = 64;

/**
 * The score, in a fixed-width column so every row's number lands on the same
 * vertical line and the queue can be read down as one list of figures. This is
 * the dashboard's organising device: comparison is the job, so the structure
 * does the comparing rather than a chart sitting beside the list.
 *
 * Mono here is deliberate — these are numerals a creator reads against each
 * other, not decorative small-caps chrome.
 */
export function ScoreRail({ score, muted = false }: { score: number; muted?: boolean }) {
  const p = usePalette();
  const tone = ctrTone(score, p);

  return (
    <View style={{ width: RAIL_WIDTH, gap: 6 }}>
      <Text
        style={{
          fontFamily: fontFamily.monoMedium,
          fontSize: 22,
          letterSpacing: -0.5,
          color: muted ? p.textSecondary : p.textPrimary,
          fontVariant: ['tabular-nums'],
        }}
      >
        {score.toFixed(1)}
      </Text>
      <View style={{ height: 3, borderRadius: 2, backgroundColor: p.surfaceElevated, overflow: 'hidden' }}>
        <View
          style={{
            width: `${Math.max(0, Math.min(100, (score / 12) * 100))}%`,
            height: '100%',
            borderRadius: 2,
            backgroundColor: tone,
          }}
        />
      </View>
    </View>
  );
}
