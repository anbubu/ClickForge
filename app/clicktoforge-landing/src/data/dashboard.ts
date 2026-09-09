/**
 * The dashboard's data shapes, and the content a new account opens with.
 *
 * The seed rows are written as real creator concepts rather than lorem, because
 * the queue's whole job is to be scannable — placeholder text hides whether the
 * row layout actually works at realistic title lengths. They are seeded once
 * into the store on first run; after that the rows a creator forges are the
 * real content and these are never read again.
 */

export type AssetKind = 'titles' | 'hook' | 'blueprint';

export type Platform = 'YouTube' | 'Shorts' | 'TikTok' | 'Reels';

/**
 * One scored candidate. Three of these are what a forge returns for the title slot.
 *
 * `gap` and `hook` are the sub-scores behind the number, as percentages. The
 * queue does not show them — a list you read down needs one figure per row — but
 * the marketing panel and the sample report both break the score open. They are
 * optional because the seed rows predate them.
 */
export type TitleOption = {
  id: string;
  text: string;
  score: number;
  gap?: number;
  hook?: number;
};

/** The thumbnail brief: four decisions, not a picture. */
export type Blueprint = {
  subject: string;
  grade: string;
  overlay: string;
  negativeSpace: string;
};

export type QueuedForge = {
  id: string;
  concept: string;
  platform: Platform;
  titles: TitleOption[];
  /** Null until the creator picks one; the row then shows the top-scored candidate as provisional. */
  chosenTitleId: string | null;
  hook: string;
  hookSettled: boolean;
  blueprint: Blueprint;
  blueprintSettled: boolean;
  /** Epoch ms. Stored rather than a phrase so "today" stays true tomorrow. */
  forgedAt: number;
};

export type ShippedForge = {
  id: string;
  title: string;
  platform: Platform;
  predicted: number;
  /**
   * Realised 7-day click-through on the same 0–12 scale, or null while the
   * window is still open. Inventing a number here would be inventing the one
   * measurement the whole product is judged on.
   */
  actual: number | null;
  shippedAt: number;
  /**
   * The assets the row shipped with, carried across so publishing does not erase
   * them — the library is mostly built from work that has already gone out, and
   * a blueprint that vanishes the moment it proves itself is the wrong one to
   * lose. Optional because rows written before the library existed lack them.
   */
  concept?: string;
  hook?: string;
  blueprint?: Blueprint;
};

export const QUOTA_TOTAL = 120;

/** The winning title if one is picked, otherwise the strongest candidate. */
export function winningTitle(item: QueuedForge): TitleOption {
  return item.titles.find((t) => t.id === item.chosenTitleId) ?? item.titles[0];
}

/** Which of the three assets are settled — what the row's chips read. */
export function doneKinds(item: QueuedForge): AssetKind[] {
  const done: AssetKind[] = [];
  if (item.chosenTitleId) done.push('titles');
  if (item.hookSettled) done.push('hook');
  if (item.blueprintSettled) done.push('blueprint');
  return done;
}

export const ASSET_LABELS: Record<AssetKind, string> = {
  titles: 'Titles',
  hook: 'Hook',
  blueprint: 'Blueprint',
};

/** What the row should ask the creator to do next. */
export function nextAction(done: AssetKind[]): string {
  if (!done.includes('titles')) return 'Pick a title';
  if (!done.includes('hook')) return 'Approve the hook';
  if (!done.includes('blueprint')) return 'Needs a thumbnail';
  return 'Ready to shoot';
}

const DAY = 86_400_000;

export const seedQueue: QueuedForge[] = [
  {
    id: 'q1',
    concept: 'I replaced my car with an e-bike for 90 days in a city built for driving',
    platform: 'YouTube',
    titles: [
      { id: 't1', text: 'I gave up my car for 90 days. The city fought back.', score: 9.1 },
      { id: 't2', text: '90 days without a car in a city that hates bikes', score: 8.4 },
      { id: 't3', text: 'I replaced my car with an e-bike — and nobody warned me.', score: 7.6 },
    ],
    chosenTitleId: 't1',
    hook: 'Open on the near-miss at the junction, then cut to day one. No intro, no channel bumper.',
    hookSettled: true,
    blueprint: {
      subject: 'Face left third, mid-action, eyeline into the frame',
      grade: 'Warm key, crushed shadows, one hot highlight',
      overlay: 'A single number, oversized, top left',
      negativeSpace: 'Right 40% empty for the platform duration chip',
    },
    blueprintSettled: false,
    forgedAt: Date.now() - 4 * 3600_000,
  },
  {
    id: 'q2',
    concept: 'Why cheap kitchen knives outperform expensive ones — I tested 41 of them',
    platform: 'YouTube',
    titles: [
      { id: 't1', text: 'I bought the cheapest knife on Amazon. It beat my $300 one.', score: 7.8 },
      { id: 't2', text: 'I tested 41 kitchen knives. The cheapest won.', score: 7.5 },
      { id: 't3', text: 'Why cheap kitchen knives outperform expensive ones.', score: 6.2 },
    ],
    chosenTitleId: 't1',
    hook: 'Cold open on the $300 knife failing the paper test. Say the price out loud before anything else.',
    hookSettled: true,
    blueprint: {
      subject: 'The object in both hands, held toward the lens',
      grade: 'High-contrast daylight, no lift in the blacks',
      overlay: 'Two words maximum, bottom right, heavy weight',
      negativeSpace: 'Clear the bottom third — that is where the UI sits',
    },
    blueprintSettled: true,
    forgedAt: Date.now() - DAY,
  },
  {
    id: 'q3',
    concept: 'Testing whether a £40 microphone can pass for a studio setup',
    platform: 'Shorts',
    titles: [
      { id: 't1', text: 'The £40 mic that fooled three sound engineers', score: 8.2 },
      { id: 't2', text: 'Testing whether a £40 microphone can pass for a studio setup. It went badly.', score: 6.9 },
      { id: 't3', text: 'A £40 microphone against a £1,200 one — here is what actually happened.', score: 6.4 },
    ],
    chosenTitleId: null,
    hook: 'Play the £40 take first and let them guess. Reveal the price at three seconds, not before.',
    hookSettled: false,
    blueprint: {
      subject: 'Wide-to-tight: subject small, the mess around it large',
      grade: 'Cool ambient with a single warm practical',
      overlay: 'No text — the frame carries it alone',
      negativeSpace: 'Top left open so the channel avatar has somewhere to land',
    },
    blueprintSettled: false,
    forgedAt: Date.now() - 3 * DAY,
  },
];

export const seedShipped: ShippedForge[] = [
  {
    id: 's1',
    title: 'Every kitchen gadget I regret buying',
    platform: 'YouTube',
    predicted: 8.4,
    actual: 7.9,
    shippedAt: Date.now() - 8 * DAY,
    concept: 'Going through two years of kitchen purchases and working out which ones I actually kept using',
    hook: 'Open on the drawer that will not close. Name the total spend before you name a single product.',
    blueprint: {
      subject: 'The object in both hands, held toward the lens',
      grade: 'Flat neutral base, saturation only on the subject',
      overlay: 'A single number, oversized, top left',
      negativeSpace: 'Clear the bottom third — that is where the UI sits',
    },
  },
  {
    id: 's2',
    title: 'I let a stranger plan my entire week',
    platform: 'Shorts',
    predicted: 6.2,
    actual: 7.1,
    shippedAt: Date.now() - 15 * DAY,
    concept: 'Handing my calendar to someone I had never met and doing whatever they scheduled for seven days',
    hook: 'Show the calendar first, full and colour-coded, before you say a single word about whose it is.',
    blueprint: {
      subject: 'Face and the result in one frame, no cutaway',
      grade: 'Cool ambient with a single warm practical',
      overlay: 'Two words maximum, bottom right, heavy weight',
      negativeSpace: 'Centre kept clear; weight the corners',
    },
  },
  {
    id: 's3',
    title: 'The cheapest way to light a face, tested nine ways',
    platform: 'YouTube',
    predicted: 7.5,
    actual: 7.4,
    shippedAt: Date.now() - 22 * DAY,
    concept: 'Testing nine lighting setups from a £6 clip lamp up to a proper softbox on the same face',
    hook: 'Cut between the cheapest and the most expensive setup twice before you say which is which.',
    blueprint: {
      subject: 'Wide-to-tight: subject small, the mess around it large',
      grade: 'High-contrast daylight, no lift in the blacks',
      overlay: 'No text — the frame carries it alone',
      negativeSpace: 'Top left open so the channel avatar has somewhere to land',
    },
  },
];

/** Seeded usage, so the quota line is not at zero on a first look. */
export const SEED_USED = 16;
