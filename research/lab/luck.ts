import { START_EQUITY } from "./constants.ts";
import { netReturn, type CostModel, type Fill } from "./execute.ts";
import { mulberry32 } from "./stats.ts";
import { SYMBOLS, type Series, type Side, type SymbolName } from "./types.ts";

export type TimedTrade = {
  symbol: SymbolName;
  side: Side;
  /** Bars from the entry open to the exit open. Zero means the trade left on that bar's close. */
  duration: number;
};

/**
 * Open-to-open profit for a fixed set of trades. Same costs and equal-weight
 * compounding as the book, without the stop or the mark-to-market path.
 * The luck control uses this scoring for both the real entries and the shuffles
 * so the only thing that changes is when the trade starts.
 */
export function timingProfit(series: Series, trades: { symbol: SymbolName; side: Side; openedIndex: number; closedIndex: number }[], costs: CostModel): number {
  const ordered = [...trades].sort(
    (a, b) => a.openedIndex - b.openedIndex || SYMBOLS.indexOf(a.symbol) - SYMBOLS.indexOf(b.symbol),
  );
  let equity = START_EQUITY;
  const weight = 1 / SYMBOLS.length;
  for (const trade of ordered) {
    const bars = series[trade.symbol];
    const entryBar = bars[trade.openedIndex];
    if (!entryBar) continue;
    const exit =
      trade.closedIndex > trade.openedIndex ? bars[trade.closedIndex]?.open : entryBar.close;
    if (exit == null || entryBar.open <= 0 || exit <= 0) continue;
    equity += equity * weight * netReturn(trade.side, entryBar.open, exit, costs);
  }
  return equity - START_EQUITY;
}

export function tradesFromFills(fills: Fill[]): TimedTrade[] {
  return fills.map((fill) => ({
    symbol: fill.symbol,
    side: fill.side,
    duration: Math.max(0, fill.closedIndex - fill.openedIndex),
  }));
}

/**
 * Place the same sides and holding lengths at random bars inside [from, to).
 * Trades of one coin do not overlap. A trade that cannot find a free slot
 * after 40 draws is left out of that simulation.
 */
export function shuffledTimingProfit(
  series: Series,
  trades: TimedTrade[],
  from: number,
  to: number,
  costs: CostModel,
  rng: () => number,
): { profit: number; skipped: number } {
  const placed: { symbol: SymbolName; side: Side; openedIndex: number; closedIndex: number }[] = [];
  let skipped = 0;
  for (const symbol of SYMBOLS) {
    const mine = trades.filter((trade) => trade.symbol === symbol);
    for (let i = mine.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const swap = mine[i]!;
      mine[i] = mine[j]!;
      mine[j] = swap;
    }
    const spans: { start: number; end: number }[] = [];
    for (const trade of mine) {
      const duration = trade.duration;
      const room = to - from - duration;
      if (room <= 1) {
        skipped += 1;
        continue;
      }
      let found = false;
      for (let attempt = 0; attempt < 40; attempt++) {
        const start = from + Math.floor(rng() * room);
        const end = start + Math.max(duration, 1);
        if (spans.some((span) => start < span.end && end > span.start)) continue;
        spans.push({ start, end });
        placed.push({
          symbol,
          side: trade.side,
          openedIndex: start,
          closedIndex: start + duration,
        });
        found = true;
        break;
      }
      if (!found) skipped += 1;
    }
  }
  return { profit: timingProfit(series, placed, costs), skipped };
}

export function luckControl(
  series: Series,
  fills: Fill[],
  from: number,
  to: number,
  costs: CostModel,
  reps: number,
  seed: number,
  bookProfit?: number,
): {
  reps: number;
  seed: number;
  actualTiming: number;
  matchedOrBeat: number;
  fraction: number;
  matchedBook: number;
  bookFraction: number;
  median: number;
  p975: number;
  meanSkipped: number;
} {
  const trades = tradesFromFills(fills);
  const actualTiming = timingProfit(series, fills, costs);
  const rng = mulberry32(seed);
  const profits: number[] = [];
  let skipped = 0;
  for (let rep = 0; rep < reps; rep++) {
    const draw = shuffledTimingProfit(series, trades, from, to, costs, rng);
    profits.push(draw.profit);
    skipped += draw.skipped;
  }
  profits.sort((a, b) => a - b);
  const matchedOrBeat = profits.filter((profit) => profit >= actualTiming - 1e-9).length;
  const target = bookProfit ?? actualTiming;
  const matchedBook = profits.filter((profit) => profit >= target - 1e-9).length;
  return {
    reps,
    seed,
    actualTiming,
    matchedOrBeat,
    fraction: profits.length ? matchedOrBeat / profits.length : 0,
    matchedBook,
    bookFraction: profits.length ? matchedBook / profits.length : 0,
    median: profits[Math.floor((profits.length - 1) / 2)] ?? 0,
    p975: profits[Math.min(profits.length - 1, Math.floor(0.975 * (profits.length - 1)))] ?? 0,
    meanSkipped: profits.length ? skipped / profits.length : 0,
  };
}
