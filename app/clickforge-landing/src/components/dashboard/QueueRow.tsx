import React, { useState } from 'react';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { breakpoint, fontFamily, radius, type as t } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import { ASSET_LABELS, nextAction, type AssetKind, type QueuedForge } from '../../data/dashboard';
import { RAIL_WIDTH, ScoreRail } from './ScoreRail';

/**
 * One concept waiting to be shot.
 *
 * Rows are hairline-separated rather than individually carded: the queue is a
 * list you read down, and giving each entry its own bordered, shadowed card
 * would break that continuity and flatten the hierarchy.
 */
export function QueueRow({ item, last }: { item: QueuedForge; last: boolean }) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const { width } = useWindowDimensions();
  const narrow = width < breakpoint.stack;

  const action = nextAction(item.done);
  const ready = action === 'Ready to shoot';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. Predicted score ${item.score.toFixed(1)}. ${action}.`}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        flexDirection: 'row',
        gap: 20,
        paddingVertical: 20,
        paddingHorizontal: 16,
        marginHorizontal: -16,
        borderRadius: radius.cards,
        borderBottomWidth: last ? 0 : 1,
        borderBottomColor: p.border,
        backgroundColor: hover ? p.surfaceElevated : 'transparent',
      }}
    >
      <ScoreRail score={item.score} />

      <View style={{ flex: 1, gap: 10, minWidth: 0 }}>
        <Text
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: 16,
            lineHeight: 16 * 1.4,
            letterSpacing: -0.25,
            color: p.textPrimary,
          }}
        >
          {item.title}
        </Text>

        <Text
          style={{
            fontFamily: fontFamily.interRegular,
            fontSize: t.bodySm.size,
            lineHeight: t.bodySm.size * t.bodySm.leading,
            color: p.textMuted,
          }}
          numberOfLines={narrow ? 2 : 1}
        >
          {item.concept}
        </Text>

        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          {(Object.keys(ASSET_LABELS) as AssetKind[]).map((k) => {
            const settled = item.done.includes(k);
            return (
              <View
                key={k}
                style={{
                  paddingVertical: 3,
                  paddingHorizontal: 8,
                  borderRadius: radius.tags,
                  borderWidth: 1,
                  borderColor: settled ? p.border : 'transparent',
                  backgroundColor: settled ? p.surface : 'transparent',
                }}
              >
                <Text
                  style={{
                    fontFamily: fontFamily.interRegular,
                    fontSize: 13,
                    color: settled ? p.textSecondary : p.textMuted,
                  }}
                >
                  {ASSET_LABELS[k]}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={{ alignItems: 'flex-end', gap: 6, minWidth: narrow ? undefined : 140 }}>
        <Text
          style={{
            fontFamily: fontFamily.interMedium,
            fontSize: t.bodySm.size,
            color: ready ? p.ctrHigh : p.accentInk,
            textAlign: 'right',
          }}
        >
          {action}
        </Text>
        <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 13, color: p.textMuted, textAlign: 'right' }}>
          {item.platform}, {item.forgedAt.toLowerCase()}
        </Text>
      </View>
    </Pressable>
  );
}

/** Keeps the empty queue aligned with the rail so the list shape stays legible. */
export function QueueEmpty() {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', gap: 20, paddingVertical: 28 }}>
      <View style={{ width: RAIL_WIDTH }} />
      <Text
        style={{
          flex: 1,
          fontFamily: fontFamily.interRegular,
          fontSize: t.body.size,
          lineHeight: t.body.size * t.body.leading,
          color: p.textSecondary,
          maxWidth: 460,
        }}
      >
        Nothing waiting to be shot. Paste a concept above and it will land here with a score.
      </Text>
    </View>
  );
}
