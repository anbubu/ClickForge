import type { Blueprint, Platform, TitleOption } from '../data/dashboard';

/**
 * A local stand-in for the scoring model.
 *
 * ClickToForge's actual claim — a predicted click-through for a title that hasn't
 * shipped yet — needs a model trained on upload history, and there is no such
 * endpoint yet. Everything here is a heuristic that runs in the browser, so
 * treat the numbers it returns as shaped-like-the-real-thing, not as
 * predictions. It exists so the forge flow is real: a concept goes in, assets
 * come back, the queue moves, and the surrounding app is written against the
 * data shape a real engine would fill.
 *
 * It is deterministic — the same concept always forges the same assets. That is
 * a deliberate choice over `Math.random()`: a creator who re-forges a concept
 * and gets different numbers learns that the score is noise, which is exactly
 * the wrong intuition to build into the UI.
 *
 * Swapping in the real thing means replacing `forgeAssets` with a call and
 * leaving the shape alone.
 */

/** FNV-1a. Small, fast, and stable across platforms — we only need spread, not cryptography. */
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/** xorshift32 over one seed: repeatable draws, each independent of the last. */
function stream(seed: number): () => number {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5;
    s >>>= 0;
    return s / 0x100000000;
  };
}

function sentenceCase(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function lowerFirst(s: string): string {
  // Leave an acronym or a proper noun alone; only a plain capital gets folded.
  return /^[A-Z][a-z]/.test(s) ? s.charAt(0).toLowerCase() + s.slice(1) : s;
}

/** The clause's own terminal mark if it has one, otherwise a full stop. */
function stop(clause: string): string {
  return /[?!]$/.test(clause) ? '' : '.';
}

/** The clause with its terminal mark removed, for frames that carry it into another phrase. */
function unstopped(clause: string): string {
  return clause.replace(/[?!]+$/, '');
}

/**
 * Words a phrase must not end on. Every frame continues the clause, so a clause
 * left dangling on "and" or "every" produces a title that reads as a sentence
 * someone cut in half.
 */
const DANGLING = new Set([
  'a', 'all', 'an', 'and', 'at', 'but', 'every', 'for', 'in', 'is', 'it', 'my', 'of', 'on', 'or',
  'so', 'that', 'the', 'their', 'then', 'this', 'to', 'was', 'when', 'which', 'while', 'with', 'your',
]);

/** Conjunctions that mark a place a sentence can be stopped without losing sense. */
const CONNECTOR = /\s(?:and|but|so|because|while|after|before|then|which|that|when)\s/gi;

const CLAUSE_MAX = 80;

/**
 * The part of the concept a title can be built on: the first clause, cut at the
 * last point where it still parses. A creator's concept is often two or three
 * sentences of context, and a title carrying all of it is not a title.
 *
 * The cut is never marked with an ellipsis. The frames continue the clause, so
 * an ellipsis would land mid-title — the truncation has to read as a phrase that
 * simply ended, not as text that was chopped.
 */
function firstClause(concept: string): string {
  const trimmed = concept.trim();
  const raw = trimmed.split(/[.!?\n]|\s[—–-]\s/)[0].trim();

  if (raw.length <= CLAUSE_MAX) {
    // Keep an interrogative's own mark: "Can you learn to weld in a weekend" and
    // "Can you learn to weld in a weekend?" are not the same title. A truncated
    // clause never keeps it — what is left is no longer the question that was asked.
    return /^\s*\?/.test(trimmed.slice(raw.length)) ? `${raw}?` : raw;
  }

  const head = raw.slice(0, CLAUSE_MAX);

  // A comma or a conjunction in the back half is a natural stop; falling back to
  // the last whole word is the worst case, not the first choice.
  let boundary = head.lastIndexOf(', ');
  CONNECTOR.lastIndex = 0;
  for (let m = CONNECTOR.exec(head); m; m = CONNECTOR.exec(head)) boundary = Math.max(boundary, m.index);

  const cut = boundary > CLAUSE_MAX / 2 ? head.slice(0, boundary) : head.replace(/\s+\S*$/, '');

  const words = cut.split(/\s+/);
  while (words.length > 4 && DANGLING.has(words[words.length - 1].toLowerCase().replace(/[^a-z]/g, ''))) {
    words.pop();
  }
  return words.join(' ').replace(/[,;:]$/, '');
}

/**
 * Every frame appends to the clause and none embeds it in a sentence of its own.
 * Embedding reads better when it lands, but it needs the concept to be a noun
 * phrase, and a creator pasting "I replaced my car with an e-bike" would get
 * ungrammatical mush. Appending is grammatical for any input, which is the
 * property that matters when the input is whatever someone types.
 */
const FRAMES: { id: string; bias: number; build: (clause: string) => string }[] = [
  { id: 'plain', bias: -0.25, build: (c) => `${sentenceCase(c)}${stop(c)}` },
  { id: 'reversal', bias: 0.45, build: (c) => `${sentenceCase(c)}${stop(c)} It went badly.` },
  { id: 'withheld', bias: 0.4, build: (c) => `${sentenceCase(unstopped(c))} — and nobody warned me.` },
  { id: 'stakes', bias: 0.3, build: (c) => `${sentenceCase(c)}${stop(c)} I was wrong about all of it.` },
  { id: 'result', bias: 0.2, build: (c) => `${sentenceCase(unstopped(c))} — here is what actually happened.` },
];

/**
 * The hook is direction for the first three seconds, not a line of script to
 * read out — a creator needs to know what to point the camera at before they
 * need words. The concept is quoted rather than rewritten for the same reason
 * the frames only append: nothing here understands the sentence well enough to
 * take it apart.
 */
const HOOKS: ((clause: string) => string)[] = [
  (c) => `Open on the result. "${sentenceCase(c)}" — then cut to the moment it stopped working.`,
  (c) => `No preamble. Say "I spent a month on this so you would not have to", then show it: ${lowerFirst(unstopped(c))}.`,
  () => `Show the failure first. Three seconds of it going wrong, then say what you expected.`,
  (c) => `Cold open on the number. Say it before the title card: "${sentenceCase(c)}" — no setup, no intro.`,
];

const SUBJECTS = [
  'Face left third, mid-action, eyeline into the frame',
  'The object in both hands, held toward the lens',
  'Wide-to-tight: subject small, the mess around it large',
  'Face and the result in one frame, no cutaway',
];

const GRADES = [
  'Warm key, crushed shadows, one hot highlight',
  'Cool ambient with a single warm practical',
  'High-contrast daylight, no lift in the blacks',
  'Flat neutral base, saturation only on the subject',
];

const OVERLAYS = [
  'Two words maximum, bottom right, heavy weight',
  'A single number, oversized, top left',
  'No text — the frame carries it alone',
  'One word in the accent colour, vertically centred',
];

const NEGATIVE_SPACE = [
  'Right 40% empty for the platform duration chip',
  'Clear the bottom third — that is where the UI sits',
  'Top left open so the channel avatar has somewhere to land',
  'Centre kept clear; weight the corners',
];

/**
 * What the stand-in rewards, and why each signal is here rather than an
 * arbitrary constant: these are the properties that separate a title someone
 * clicks from a description of a video. None of it is learned — a real model
 * would weigh them against the channel's own history.
 */
function baseScore(concept: string): number {
  let s = 6.3;
  const words = concept.trim().split(/\s+/).length;

  if (/\d/.test(concept)) s += 0.9; // a number is the cheapest specificity there is
  if (words >= 8 && words <= 24) s += 0.6; // concrete enough to picture, short enough to title
  if (words > 40) s -= 0.7; // a synopsis, not a concept
  if (/\b(I|my|me|we)\b/i.test(concept)) s += 0.5; // first person beats the explainer voice
  if (/\?\s*$/.test(concept.trim())) s -= 0.4; // a question in the concept usually means it is unresolved
  if (/\b(best|top|ultimate|amazing)\b/i.test(concept)) s -= 0.5; // superlatives read as stock

  return s;
}

/** Shorter formats punish a slow title harder, so the spread widens. */
const PLATFORM_BIAS: Record<Platform, number> = {
  YouTube: 0,
  Shorts: 0.25,
  TikTok: 0.35,
  Reels: 0.2,
};

const clamp = (n: number) => Math.max(0, Math.min(12, n));
const clampPct = (n: number) => Math.max(0, Math.min(100, Math.round(n)));

/**
 * The two sub-scores behind a title's number, as percentages.
 *
 * `gap` is how much the title withholds — the distance between what it says and
 * what the video answers. `hook` is how hard the opening words pull, because a
 * title is read left to right and most of them are abandoned before the end.
 *
 * Both are read off the title text itself rather than derived from the score. A
 * meter that is only the score wearing a different hat tells the creator nothing
 * they cannot already see, and it would move in lockstep with the number above
 * it, which is exactly the tell that a display is decorative.
 */
function titleMetrics(text: string): { gap: number; hook: number } {
  const opener = text.split(/\s+/).slice(0, 3).join(' ');

  let gap = 52;
  // An unresolved referent is the withheld thing: "it beat my $300 one" — what did?
  if (/\b(it|this|that|they|nobody|something|why)\b/i.test(text)) gap += 14;
  if (/(\s—\s|\.\s)/.test(text)) gap += 9; // a second clause that turns on the first
  if (/\?$/.test(text)) gap += 10;
  if (/\d/.test(text)) gap -= 7; // a number answers part of the question up front

  let hook = 48;
  if (/^I\b/.test(text)) hook += 16; // first person in the first word
  if (/\d/.test(opener)) hook += 14; // a number inside the first three words
  if (/^(why|how|what|can|the)\b/i.test(text)) hook += 8;
  if (opener.length > 22) hook -= 9; // three long words is a slow open

  return { gap: clampPct(gap), hook: clampPct(hook) };
}

export type ForgedAssets = {
  titles: TitleOption[];
  /** Three openings, strongest first. The queue settles on one; the panel shows all three. */
  hooks: string[];
  blueprint: Blueprint;
};

export function forgeAssets(concept: string, platform: Platform): ForgedAssets {
  const clause = firstClause(concept);
  const seed = hash(`${concept.trim().toLowerCase()}|${platform}`);
  const rnd = stream(seed);
  const base = baseScore(concept) + PLATFORM_BIAS[platform];

  // Three distinct frames, drawn without replacement so no two options are the
  // same shape — a creator choosing between three variants of one idea is not
  // choosing.
  const framePool = [...FRAMES];
  const titles: TitleOption[] = [];
  for (let i = 0; i < 3; i++) {
    const frame = framePool.splice(Math.floor(rnd() * framePool.length), 1)[0];
    const text = frame.build(clause);
    titles.push({
      id: `t${i + 1}`,
      text,
      score: clamp(Number((base + frame.bias + (rnd() - 0.5) * 1.2).toFixed(1))),
      ...titleMetrics(text),
    });
  }
  titles.sort((a, b) => b.score - a.score);

  const hookPool = [...HOOKS];
  const hooks: string[] = [];
  for (let i = 0; i < 3; i++) {
    hooks.push(hookPool.splice(Math.floor(rnd() * hookPool.length), 1)[0](clause));
  }

  return {
    titles,
    hooks,
    blueprint: {
      subject: SUBJECTS[Math.floor(rnd() * SUBJECTS.length)],
      grade: GRADES[Math.floor(rnd() * GRADES.length)],
      overlay: OVERLAYS[Math.floor(rnd() * OVERLAYS.length)],
      negativeSpace: NEGATIVE_SPACE[Math.floor(rnd() * NEGATIVE_SPACE.length)],
    },
  };
}
