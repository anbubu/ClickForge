/**
 * Timestamps rendered the way a creator would say them.
 *
 * Rows store epoch milliseconds, so the phrase has to be derived at render —
 * a stored "today" is wrong by tomorrow, which is exactly the kind of small lie
 * that makes a queue feel stale.
 */

const DAY = 86_400_000;

/** Whole days between two instants, counted by calendar day rather than elapsed hours. */
function daysAgo(ts: number, now: number): number {
  const start = (t: number) => {
    const d = new Date(t);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  };
  return Math.round((start(now) - start(ts)) / DAY);
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export function relativeDay(ts: number, now: number = Date.now()): string {
  const days = daysAgo(ts, now);
  if (days <= 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return 'last week';
  if (days < 60) return `${Math.round(days / 7)} weeks ago`;
  const d = new Date(ts);
  return `${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** Quota runs on calendar months, so the cycle turns over on the first. */
export function nextQuotaReset(now: number = Date.now()): string {
  const d = new Date(now);
  const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return `1 ${MONTHS[next.getMonth()]}`;
}
