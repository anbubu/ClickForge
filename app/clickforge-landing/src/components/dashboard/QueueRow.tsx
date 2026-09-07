import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { breakpoint, fontFamily, radius, type as t } from '../../theme/tokens';
import { usePalette } from '../../theme/ThemeContext';
import { useBelow } from '../../theme/useBreakpoint';
import {
  ASSET_LABELS,
  doneKinds,
  nextAction,
  winningTitle,
  type AssetKind,
  type QueuedForge,
} from '../../data/dashboard';
import { relativeDay } from '../../data/relativeTime';
import { useForge } from '../../state/ForgeStore';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { RAIL_WIDTH, ScoreRail } from './ScoreRail';

/** The expanded panel lines up with the row's text column, not the rail. */
const INDENT = RAIL_WIDTH + 20;

/**
 * One block of the expanded row: the asset, and the single control that settles
 * it. The settle control is a button rather than a checkbox because approving an
 * asset is an action the creator takes, not a property they toggle — and it
 * reads that way in the queue's next-action column.
 */
function AssetSection({
  label,
  settled,
  settleLabel,
  onSettle,
  children,
}: {
  label: string;
  settled: boolean;
  settleLabel: string;
  onSettle: () => void;
  children: React.ReactNode;
}) {
  const p = usePalette();
  return (
    <View style={{ gap: 12, paddingTop: 18 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
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
        <View style={{ marginLeft: 'auto' }}>
          {settled ? (
            <Pressable
              onPress={onSettle}
              accessibilityRole="button"
              accessibilityLabel={`Undo approval of the ${label.toLowerCase()}`}
              style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
            >
              <Icon name="check" size={14} color={p.ctrHigh} />
              <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 13, color: p.ctrHigh }}>Approved</Text>
            </Pressable>
          ) : (
            <Button variant="secondary" size="sm" onPress={onSettle}>
              {settleLabel}
            </Button>
          )}
        </View>
      </View>
      {children}
    </View>
  );
}

/** One scored title candidate. Picking one is what settles the title slot. */
function TitleOptionRow({
  text,
  score,
  chosen,
  onPress,
}: {
  text: string;
  score: number;
  chosen: boolean;
  onPress: () => void;
}) {
  const p = usePalette();
  const [hover, setHover] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: chosen }}
      accessibilityLabel={`${text}. Score ${score.toFixed(1)}.`}
      // Same RNW gap as the segmented control: `checked` needs setting directly
      // or the chosen title announces as an unstated radio.
      {...({ 'aria-checked': chosen } as any)}
      onHoverIn={() => setHover(true)}
      onHoverOut={() => setHover(false)}
      style={{
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        padding: 12,
        borderRadius: radius.cards,
        borderWidth: 1,
        borderColor: chosen ? p.accentEdge : hover ? p.borderStrong : p.border,
        backgroundColor: chosen ? p.accentWash : hover ? p.surfaceElevated : 'transparent',
      }}
    >
      <Text
        style={{
          fontFamily: fontFamily.monoMedium,
          fontSize: 15,
          color: chosen ? p.accentInk : p.textSecondary,
          fontVariant: ['tabular-nums'],
          minWidth: 34,
        }}
      >
        {score.toFixed(1)}
      </Text>
      <Text
        style={{
          flex: 1,
          fontFamily: fontFamily.interRegular,
          fontSize: t.bodySm.size,
          lineHeight: t.bodySm.size * t.bodySm.leading,
          color: p.textPrimary,
        }}
      >
        {text}
      </Text>
      {chosen && <Icon name="check" size={16} color={p.accent} />}
    </Pressable>
  );
}

/** One line of the thumbnail brief. */
function BlueprintLine({ label, value }: { label: string; value: string }) {
  const p = usePalette();
  return (
    <View style={{ flexDirection: 'row', gap: 12, flexWrap: 'wrap' }}>
      <Text style={{ fontFamily: fontFamily.monoRegular, fontSize: 13, color: p.textMuted, minWidth: 110 }}>
        {label}
      </Text>
      <Text
        style={{
          flex: 1,
          minWidth: 180,
          fontFamily: fontFamily.interRegular,
          fontSize: t.bodySm.size,
          lineHeight: t.bodySm.size * t.bodySm.leading,
          color: p.textSecondary,
        }}
      >
        {value}
      </Text>
    </View>
  );
}

/**
 * One concept waiting to be shot.
 *
 * Rows are hairline-separated rather than individually carded: the queue is a
 * list you read down, and giving each entry its own bordered, shadowed card
 * would break that continuity and flatten the hierarchy. The assets sit behind a
 * press rather than in the row itself — three titles, a hook and a four-line
 * brief on every entry would turn a scannable queue into a wall.
 */
export function QueueRow({ item, last }: { item: QueuedForge; last: boolean }) {
  const p = usePalette();
  const [hover, setHover] = useState(false);
  const [open, setOpen] = useState(false);
  const narrow = useBelow(breakpoint.stack);
  const { chooseTitle, setHookSettled, setBlueprintSettled, ship, discard } = useForge();

  const done = doneKinds(item);
  const action = nextAction(done);
  const ready = action === 'Ready to shoot';
  const winner = winningTitle(item);

  return (
    <View style={{ borderBottomWidth: last ? 0 : 1, borderBottomColor: p.border }}>
      <Pressable
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        accessibilityLabel={`${winner.text}. Predicted score ${winner.score.toFixed(1)}. ${action}.`}
        onPress={() => setOpen((v) => !v)}
        onHoverIn={() => setHover(true)}
        onHoverOut={() => setHover(false)}
        style={{
          flexDirection: 'row',
          gap: 20,
          paddingVertical: 20,
          paddingHorizontal: 16,
          marginHorizontal: -16,
          borderRadius: radius.cards,
          backgroundColor: hover || open ? p.surfaceElevated : 'transparent',
        }}
      >
        <ScoreRail score={winner.score} />

        <View style={{ flex: 1, gap: 10, minWidth: 0 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text
              style={{
                flex: 1,
                fontFamily: fontFamily.interMedium,
                fontSize: 16,
                lineHeight: 16 * 1.4,
                letterSpacing: -0.25,
                // An unpicked title is the engine's suggestion, not the creator's
                // decision, and it should not read with the same finality.
                color: item.chosenTitleId ? p.textPrimary : p.textSecondary,
                fontStyle: item.chosenTitleId ? 'normal' : 'italic',
              }}
            >
              {winner.text}
            </Text>
            <Icon name="chevron-up-down" size={16} color={p.textMuted} />
          </View>

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
              const settled = done.includes(k);
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
            {item.platform}, {relativeDay(item.forgedAt)}
          </Text>
        </View>
      </Pressable>

      {open && (
        <View style={{ paddingLeft: narrow ? 0 : INDENT, paddingBottom: 24, gap: 4 }}>
          <AssetSection
            label="Titles"
            settled={!!item.chosenTitleId}
            settleLabel="Pick one below"
            onSettle={() => chooseTitle(item.id, '')}
          >
            <View style={{ gap: 8 }} accessibilityRole="radiogroup">
              {item.titles.map((option) => (
                <TitleOptionRow
                  key={option.id}
                  text={option.text}
                  score={option.score}
                  chosen={option.id === item.chosenTitleId}
                  onPress={() => chooseTitle(item.id, option.id === item.chosenTitleId ? '' : option.id)}
                />
              ))}
            </View>
          </AssetSection>

          <AssetSection
            label="Retention hook"
            settled={item.hookSettled}
            settleLabel="Approve hook"
            onSettle={() => setHookSettled(item.id, !item.hookSettled)}
          >
            <Text
              style={{
                fontFamily: fontFamily.interRegular,
                fontSize: t.bodySm.size,
                lineHeight: t.bodySm.size * t.bodySm.leading,
                color: p.textSecondary,
                padding: 12,
                borderRadius: radius.cards,
                borderWidth: 1,
                borderColor: p.border,
                backgroundColor: p.surface,
              }}
            >
              {item.hook}
            </Text>
          </AssetSection>

          <AssetSection
            label="Thumbnail blueprint"
            settled={item.blueprintSettled}
            settleLabel="Approve blueprint"
            onSettle={() => setBlueprintSettled(item.id, !item.blueprintSettled)}
          >
            <View
              style={{
                gap: 10,
                padding: 12,
                borderRadius: radius.cards,
                borderWidth: 1,
                borderColor: p.border,
                backgroundColor: p.surface,
              }}
            >
              <BlueprintLine label="Subject" value={item.blueprint.subject} />
              <BlueprintLine label="Grade" value={item.blueprint.grade} />
              <BlueprintLine label="Overlay" value={item.blueprint.overlay} />
              <BlueprintLine label="Negative space" value={item.blueprint.negativeSpace} />
            </View>
          </AssetSection>

          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingTop: 20, flexWrap: 'wrap' }}>
            <Button
              variant={ready ? 'primary' : 'secondary'}
              size="sm"
              onPress={() => ship(item.id)}
              iconLeft={<Icon name="send" size={14} color={ready ? p.textOnAccent : p.textPrimary} />}
            >
              Mark as shipped
            </Button>
            <Button variant="ghost" size="sm" onPress={() => discard(item.id)}>
              Discard
            </Button>
            {!ready && (
              <Text style={{ fontFamily: fontFamily.interRegular, fontSize: 13, color: p.textMuted }}>
                {action.toLowerCase()} first, or ship it as it stands.
              </Text>
            )}
          </View>
        </View>
      )}
    </View>
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
