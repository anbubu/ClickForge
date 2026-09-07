import type { Platform } from './dashboard';

/**
 * The Step 0 diagnostic: what a creator publishes, and what is actually stopping
 * them growing.
 *
 * Two questions is the whole budget. A diagnostic earns its place by changing
 * what happens next — so both answers are used: the platform becomes the
 * composer's default, and the bottleneck decides which of the three assets the
 * forge screen points at first. An onboarding step that collects answers and
 * then ignores them is a toll booth, and creators can tell the difference.
 */

export type Bottleneck = 'ctr' | 'retention' | 'ideas' | 'throughput';

export type CreatorProfile = {
  platform: Platform;
  bottleneck: Bottleneck;
  /** Epoch ms, so the answers can be aged out when the diagnostic changes. */
  completedAt: number;
};

export const PLATFORM_CHOICES: { value: Platform; label: string; note: string }[] = [
  { value: 'YouTube', label: 'YouTube', note: 'Long-form, browse and suggested' },
  { value: 'TikTok', label: 'TikTok', note: 'For You feed, swipe-away default' },
  { value: 'Shorts', label: 'Shorts', note: 'Vertical, no title on the card' },
];

export const BOTTLENECK_CHOICES: { value: Bottleneck; label: string; note: string }[] = [
  { value: 'ctr', label: 'Nobody clicks', note: 'Impressions come in, the click-through does not' },
  { value: 'retention', label: 'They click, then leave', note: 'The first few seconds lose them' },
  { value: 'ideas', label: 'I run out of angles', note: 'The idea is there, the framing is not' },
  { value: 'throughput', label: 'I ship too slowly', note: 'Deciding the packaging eats the week' },
];

/**
 * What the forge screen says back once the diagnostic is answered. Each line
 * names the answer the creator gave and points at the part of the output that
 * addresses it — the payoff for having asked.
 */
export const BOTTLENECK_PAYOFF: Record<Bottleneck, string> = {
  ctr: 'You said the clicks are the problem. Every title comes back with a predicted click-through — the number beside it is the one to compare.',
  retention:
    'You said they leave early. Every forge includes a hook written for the first three seconds; approve one before you shoot.',
  ideas:
    'You said the angles are the problem. Paste the idea however rough it is — the engine returns three different framings of it.',
  throughput:
    'You said shipping is slow. One forge returns the titles, the hook and the thumbnail brief together, so the packaging is one decision.',
};

/** Which asset a creator with this bottleneck should look at first. */
export const BOTTLENECK_FOCUS: Record<Bottleneck, string> = {
  ctr: 'Titles',
  retention: 'Hook',
  ideas: 'Titles',
  throughput: 'Blueprint',
};
