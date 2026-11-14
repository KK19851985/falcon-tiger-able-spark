const STEP = 15 * 60 * 1000;

export type GapReport = {
  bars: number;
  duplicates: number;
  missing: number;
  start: number | null;
  end: number | null;
};

/** Missing 15-minute slots between the first and last timestamp, plus repeated timestamps. */
export function gapReport(times: number[]): GapReport {
  const counts = new Map<number, number>();
  for (const time of times) counts.set(time, (counts.get(time) ?? 0) + 1);
  let duplicates = 0;
  for (const count of counts.values()) if (count > 1) duplicates += count - 1;
  const sorted = [...counts.keys()].sort((a, b) => a - b);
  let missing = 0;
  for (let i = 1; i < sorted.length; i++) {
    const step = sorted[i]! - sorted[i - 1]!;
    if (step > STEP) missing += Math.round(step / STEP) - 1;
  }
  return {
    bars: sorted.length,
    duplicates,
    missing,
    start: sorted[0] ?? null,
    end: sorted[sorted.length - 1] ?? null,
  };
}
