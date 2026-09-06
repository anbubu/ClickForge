/**
 * Stand-in content for the dashboard.
 *
 * Written as real creator concepts rather than lorem, because the queue's whole
 * job is to be scannable — placeholder text hides whether the row layout
 * actually works at realistic title lengths.
 */

export type AssetKind = 'titles' | 'hook' | 'blueprint';

export type QueuedForge = {
  id: string;
  concept: string;
  /** The winning title, once the engine has picked one. */
  title: string;
  score: number;
  platform: 'YouTube' | 'Shorts' | 'TikTok' | 'Reels';
  /** Which of the three assets are settled. The gap is what the row asks for. */
  done: AssetKind[];
  forgedAt: string;
};

export type ShippedForge = {
  id: string;
  title: string;
  platform: 'YouTube' | 'Shorts' | 'TikTok' | 'Reels';
  predicted: number;
  /** Realised 7-day CTR score, on the same 0–12 scale as the prediction. */
  actual: number;
  shippedAt: string;
};

export const quota = { used: 16, total: 120, resets: '3 March' };

export const queue: QueuedForge[] = [
  {
    id: 'q1',
    concept: 'I replaced my car with an e-bike for 90 days in a city built for driving',
    title: 'I gave up my car for 90 days. The city fought back.',
    score: 9.1,
    platform: 'YouTube',
    done: ['titles', 'hook'],
    forgedAt: 'Today',
  },
  {
    id: 'q2',
    concept: 'Why cheap kitchen knives outperform expensive ones — I tested 41 of them',
    title: 'I bought the cheapest knife on Amazon. It beat my $300 one.',
    score: 7.8,
    platform: 'YouTube',
    done: ['titles', 'hook', 'blueprint'],
    forgedAt: 'Yesterday',
  },
  {
    id: 'q3',
    concept: 'Testing whether a £40 microphone can pass for a studio setup',
    title: 'The £40 mic that fooled three sound engineers',
    score: 6.4,
    platform: 'Shorts',
    done: ['titles'],
    forgedAt: 'Tuesday',
  },
];

export const shipped: ShippedForge[] = [
  {
    id: 's1',
    title: 'Every kitchen gadget I regret buying',
    platform: 'YouTube',
    predicted: 8.4,
    actual: 7.9,
    shippedAt: 'Last week',
  },
  {
    id: 's2',
    title: 'I let a stranger plan my entire week',
    platform: 'Shorts',
    predicted: 6.2,
    actual: 7.1,
    shippedAt: '2 weeks ago',
  },
  {
    id: 's3',
    title: 'The cheapest way to light a face, tested nine ways',
    platform: 'YouTube',
    predicted: 7.5,
    actual: 7.4,
    shippedAt: '3 weeks ago',
  },
];

export const ASSET_LABELS: Record<AssetKind, string> = {
  titles: 'Titles',
  hook: 'Hook',
  blueprint: 'Blueprint',
};

/** What the row should ask the creator to do next. */
export function nextAction(done: AssetKind[]): string {
  if (!done.includes('titles')) return 'Pick a title';
  if (!done.includes('hook')) return 'Write the hook';
  if (!done.includes('blueprint')) return 'Needs a thumbnail';
  return 'Ready to shoot';
}
