/**
 * MACD signal-event study. Research only. This file does not import the desk.
 *
 * The rules below were fixed before the tape was scored. They are the
 * corrections to the described TradingView grader (one pending slot per type,
 * entry at the signal close, no costs, a timeout counted as a failure, hit
 * rate only). Statistics returned here are test statistics and resampling
 * summaries. They are not probabilities.
 */
import { netReturn, type CostModel } from "./execute.ts";
import type { Bar, Side } from "./types.ts";

export const HORIZON = 20;
export const DRIFT_BARS = 50;
export const ATR_LEN = 14;
export const EMA_TREND = 200;
export const SLOPE_BARS = 20;
export const VOL_LOOKBACK = 200;
export const PIVOT_WING = 5;
export const DIV_ACTIVE = 10;
/**
 * First bar that can carry an EMA200 slope. Signals themselves start earlier,
 * once MACD and ATR exist. A trend or volatility tag stays unknown until then.
 */
export const MIN_SIGNAL_INDEX = EMA_TREND - 1 + SLOPE_BARS;

/** First index at which this MACD setting and the ATR are both defined. */
export function readyIndex(slow: number, signal: number, atrLen = ATR_LEN): number {
  return Math.max(slow + signal, atrLen);
}

export const TARGETS = [1, 1.5, 2, 3] as const;
export const STOPS = [0.75, 1, 1.5] as const;

/** Binance USDT-M taker on both sides, plus 2 bps of adverse slippage on both sides. No funding. */
export const BINANCE_TAKER_COST: CostModel = { fee: 0.0005, slippage: 0.0002 };

/** The lab cost: 0.1% taker and 5 bps of slippage on both sides. No funding. */
export const LAB_COST: CostModel = { fee: 0.001, slippage: 0.0005 };

export const MACD_PRESETS = [
  { name: "12/26/9", fast: 12, slow: 26, signal: 9 },
  { name: "8/21/5", fast: 8, slow: 21, signal: 5 },
  { name: "5/35/5", fast: 5, slow: 35, signal: 5 },
] as const;

export const SIGNAL_NAMES = [
  "cross up below zero",
  "cross up above zero",
  "cross down above zero",
  "cross down below zero",
  "zero cross up",
  "zero cross down",
] as const;

export type SignalType = 0 | 1 | 2 | 3 | 4 | 5;
export type Outcome = "target" | "stop" | "timeout" | "censored";

const SIDE_OF: Side[] = ["LONG", "LONG", "SHORT", "SHORT", "LONG", "SHORT"];

export function sideOf(type: SignalType): Side {
  return SIDE_OF[type]!;
}

export function gridCount(): number {
  return TARGETS.length * STOPS.length;
}

export function gridAt(index: number): { target: number; stop: number } {
  const stops = STOPS.length;
  return { target: TARGETS[Math.floor(index / stops)]!, stop: STOPS[index % stops]! };
}

export function gridIndex(target: number, stop: number): number {
  const t = TARGETS.indexOf(target as (typeof TARGETS)[number]);
  const s = STOPS.indexOf(stop as (typeof STOPS)[number]);
  if (t < 0 || s < 0) throw new Error(`grid ${target}/${stop} is not in the study`);
  return t * STOPS.length + s;
}

/**
 * TradingView `ta.ema`: alpha = 2/(length+1), seeded with the SMA of the
 * first `length` samples. The lab's other EMA seeds on the first price.
 * MACD here follows the chart, so the two are not interchangeable.
 */
export function tvEma(values: number[], length: number): number[] {
  const out = new Array<number>(values.length).fill(Number.NaN);
  if (length < 1) return out;
  const alpha = 2 / (length + 1);
  let seed = 0;
  let prev = Number.NaN;
  for (let i = 0; i < values.length; i++) {
    const value = values[i]!;
    if (!Number.isFinite(prev)) {
      seed += value;
      if (i === length - 1) {
        prev = seed / length;
        out[i] = prev;
      }
      continue;
    }
    prev = value * alpha + prev * (1 - alpha);
    out[i] = prev;
  }
  return out;
}

export function tvMacd(
  closes: number[],
  fast: number,
  slow: number,
  signal: number,
): { macd: number[]; signal: number[]; hist: number[] } {
  const fastEma = tvEma(closes, fast);
  const slowEma = tvEma(closes, slow);
  const macd = closes.map((_, i) =>
    Number.isFinite(fastEma[i]) && Number.isFinite(slowEma[i]) ? fastEma[i]! - slowEma[i]! : Number.NaN,
  );
  const signalLine = tvEmaFinite(macd, signal);
  const hist = macd.map((value, i) =>
    Number.isFinite(value) && Number.isFinite(signalLine[i]) ? value - signalLine[i]! : Number.NaN,
  );
  return { macd, signal: signalLine, hist };
}

/** EMA over a series that may lead with NaN. The seed uses the first `length` finite samples. */
function tvEmaFinite(values: number[], length: number): number[] {
  const finite: number[] = [];
  const finiteAt: number[] = [];
  for (let i = 0; i < values.length; i++) {
    if (Number.isFinite(values[i])) {
      finite.push(values[i]!);
      finiteAt.push(i);
    }
  }
  const ema = tvEma(finite, length);
  const out = new Array<number>(values.length).fill(Number.NaN);
  for (let k = 0; k < finiteAt.length; k++) out[finiteAt[k]!] = ema[k]!;
  return out;
}

/** Wilder ATR, the same RMA TradingView uses for `ta.atr`. */
export function tvAtr(bars: Bar[], length: number): number[] {
  const out = new Array<number>(bars.length).fill(Number.NaN);
  if (length < 1 || bars.length === 0) return out;
  const tr = new Array<number>(bars.length);
  tr[0] = bars[0]!.high - bars[0]!.low;
  for (let i = 1; i < bars.length; i++) {
    const bar = bars[i]!;
    const prev = bars[i - 1]!.close;
    tr[i] = Math.max(bar.high - bar.low, Math.abs(bar.high - prev), Math.abs(bar.low - prev));
  }
  let acc = 0;
  let prev = Number.NaN;
  for (let i = 0; i < bars.length; i++) {
    if (!Number.isFinite(prev)) {
      acc += tr[i]!;
      if (i === length - 1) {
        prev = acc / length;
        out[i] = prev;
      }
      continue;
    }
    prev = (prev * (length - 1) + tr[i]!) / length;
    out[i] = prev;
  }
  return out;
}

/**
 * Signal types on bar `i`, using only bar i and bar i-1.
 * A signal-line cross is "below zero" when the MACD line on the cross bar is
 * negative, and "above zero" when it is zero or positive. A zero-line cross
 * is a separate event on the same bar when both happen. Endpoint logic cannot
 * produce opposite directions on one bar.
 */
export function signalTypesAt(prevMacd: number, macd: number, prevSignal: number, signal: number): SignalType[] {
  if (![prevMacd, macd, prevSignal, signal].every(Number.isFinite)) return [];
  const out: SignalType[] = [];
  const crossUp = prevMacd <= prevSignal && macd > signal;
  const crossDown = prevMacd >= prevSignal && macd < signal;
  if (crossUp) out.push(macd < 0 ? 0 : 1);
  if (crossDown) out.push(macd > 0 ? 2 : 3);
  if (prevMacd <= 0 && macd > 0) out.push(4);
  if (prevMacd >= 0 && macd < 0) out.push(5);
  return out;
}

export function grossBreakeven(target: number, stop: number): number {
  return stop / (target + stop);
}

/**
 * Hit rate that breaks even if every trade resolves at the target or the stop
 * and none time out. Built from this entry, this ATR, and this cost model.
 * Returns NaN when the target does not clear the round trip.
 */
export function costBreakeven(target: number, stop: number, entry: number, atr: number, cost: CostModel): number {
  const win = netReturn("LONG", entry, entry + target * atr, cost);
  const loss = netReturn("LONG", entry, entry - stop * atr, cost);
  if (!(win > loss)) return Number.NaN;
  return -loss / (win - loss);
}

export type Resolved = {
  outcome: Outcome;
  exitPrice: number;
  exitIndex: number;
  barsHeld: number;
  mfeR: number;
  maeR: number;
};

/**
 * Walk a filled trade. The stop is tested before the target, so a bar that
 * trades through both fills the stop. A gap through the stop fills at the
 * open. A gap through the target still fills at the target. A horizon that
 * runs off the end of the tape is a censored mark at the last close, not a
 * stop. A completed horizon that did not resolve is a timeout mark at that
 * close, not a failure.
 */
export function resolveTrade(
  bars: Bar[],
  side: Side,
  entryIndex: number,
  entry: number,
  atr: number,
  targetMult: number,
  stopMult: number,
  horizon: number,
): Resolved | null {
  if (entryIndex < 0 || entryIndex >= bars.length) return null;
  if (!(entry > 0) || !(atr > 0) || !(targetMult > 0) || !(stopMult > 0) || horizon < 1) return null;
  const risk = stopMult * atr;
  const targetDist = targetMult * atr;
  const long = side === "LONG";
  const stopPx = long ? entry - risk : entry + risk;
  const targetPx = long ? entry + targetDist : entry - targetDist;
  const planned = entryIndex + horizon - 1;
  const last = Math.min(bars.length - 1, planned);
  let mfe = 0;
  let mae = 0;
  for (let i = entryIndex; i <= last; i++) {
    const bar = bars[i]!;
    if (long) {
      mfe = Math.max(mfe, (bar.high - entry) / risk);
      mae = Math.max(mae, (entry - bar.low) / risk);
    } else {
      mfe = Math.max(mfe, (entry - bar.low) / risk);
      mae = Math.max(mae, (bar.high - entry) / risk);
    }
    const stopHit = long ? bar.low <= stopPx : bar.high >= stopPx;
    const targetHit = long ? bar.high >= targetPx : bar.low <= targetPx;
    if (stopHit) {
      const exitPrice = long ? Math.min(stopPx, bar.open) : Math.max(stopPx, bar.open);
      return finish("stop", exitPrice, i, entryIndex, mfe, mae);
    }
    if (targetHit) return finish("target", targetPx, i, entryIndex, mfe, mae);
  }
  const outcome: Outcome = last < planned ? "censored" : "timeout";
  return finish(outcome, bars[last]!.close, last, entryIndex, mfe, mae);
}

function finish(
  outcome: Outcome,
  exitPrice: number,
  exitIndex: number,
  entryIndex: number,
  mfeR: number,
  maeR: number,
): Resolved {
  return { outcome, exitPrice, exitIndex, barsHeld: exitIndex - entryIndex + 1, mfeR, maeR };
}

export type Priced = Resolved & { netR: number; netRet: number };

export function priceTrade(side: Side, entry: number, atr: number, stopMult: number, resolved: Resolved, cost: CostModel): Priced {
  const netRet = netReturn(side, entry, resolved.exitPrice, cost);
  const riskFrac = (stopMult * atr) / entry;
  return { ...resolved, netRet, netR: riskFrac > 0 ? netRet / riskFrac : Number.NaN };
}

export type TradeSummary = {
  n: number;
  hits: number;
  stops: number;
  timeouts: number;
  censored: number;
  hitRate: number;
  meanR: number;
  meanRet: number;
  profitFactor: number | null;
  medianBars: number;
  sdR: number;
  sharpe: number;
  skew: number;
  kurtosis: number;
  tStat: number;
  /** One-sided Student-t tail for mean R > 0. A ranking score for BH, not a probability. */
  pGreater: number;
  mfe: Quantiles;
  mae: Quantiles;
  beGross: number;
  beCostMedian: number;
};

export type Quantiles = { p10: number; p25: number; p50: number; p75: number; p90: number };

export function summarize(trades: Priced[], target: number, stop: number, entries: { entry: number; atr: number }[], cost: CostModel): TradeSummary {
  const n = trades.length;
  let hits = 0;
  let stops = 0;
  let timeouts = 0;
  let censored = 0;
  const rs: number[] = [];
  const rets: number[] = [];
  const bars: number[] = [];
  const mfes: number[] = [];
  const maes: number[] = [];
  let pos = 0;
  let neg = 0;
  for (const trade of trades) {
    if (trade.outcome === "target") hits += 1;
    else if (trade.outcome === "stop") stops += 1;
    else if (trade.outcome === "timeout") timeouts += 1;
    else censored += 1;
    rs.push(trade.netR);
    rets.push(trade.netRet);
    bars.push(trade.barsHeld);
    mfes.push(trade.mfeR);
    maes.push(trade.maeR);
    if (trade.netRet > 0) pos += trade.netRet;
    else if (trade.netRet < 0) neg += -trade.netRet;
  }
  const shape = shapeOf(rs);
  const tStat = n > 1 && shape.sd > 0 ? shape.mean / (shape.sd / Math.sqrt(n)) : shape.mean > 0 ? Number.POSITIVE_INFINITY : shape.mean < 0 ? Number.NEGATIVE_INFINITY : 0;
  const bes: number[] = [];
  for (const row of entries) {
    const be = costBreakeven(target, stop, row.entry, row.atr, cost);
    if (Number.isFinite(be)) bes.push(be);
  }
  bes.sort((a, b) => a - b);
  return {
    n,
    hits,
    stops,
    timeouts,
    censored,
    hitRate: n ? hits / n : 0,
    meanR: shape.mean,
    meanRet: n ? rets.reduce((acc, value) => acc + value, 0) / n : 0,
    profitFactor: neg > 0 ? pos / neg : pos > 0 ? null : 0,
    medianBars: n ? linearQuantile(sortedCopy(bars), 0.5) : Number.NaN,
    sdR: shape.sd,
    sharpe: shape.sharpe,
    skew: shape.skew,
    kurtosis: shape.kurtosis,
    tStat,
    pGreater: n > 1 ? studentSurvival(tStat, n - 1) : 1,
    mfe: quantilesOf(mfes),
    mae: quantilesOf(maes),
    beGross: grossBreakeven(target, stop),
    beCostMedian: bes.length ? linearQuantile(bes, 0.5) : Number.NaN,
  };
}

function quantilesOf(values: number[]): Quantiles {
  if (values.length === 0) {
    return { p10: Number.NaN, p25: Number.NaN, p50: Number.NaN, p75: Number.NaN, p90: Number.NaN };
  }
  const sorted = sortedCopy(values);
  return {
    p10: linearQuantile(sorted, 0.1),
    p25: linearQuantile(sorted, 0.25),
    p50: linearQuantile(sorted, 0.5),
    p75: linearQuantile(sorted, 0.75),
    p90: linearQuantile(sorted, 0.9),
  };
}

function shapeOf(values: number[]): { mean: number; sd: number; sharpe: number; skew: number; kurtosis: number } {
  const n = values.length;
  if (n === 0) return { mean: 0, sd: 0, sharpe: 0, skew: 0, kurtosis: 3 };
  let mean = 0;
  for (const value of values) mean += value;
  mean /= n;
  if (n < 2) return { mean, sd: 0, sharpe: 0, skew: 0, kurtosis: 3 };
  let m2 = 0;
  let m3 = 0;
  let m4 = 0;
  for (const value of values) {
    const d = value - mean;
    m2 += d * d;
    m3 += d * d * d;
    m4 += d * d * d * d;
  }
  const sd = Math.sqrt(m2 / (n - 1));
  if (sd === 0) return { mean, sd: 0, sharpe: 0, skew: 0, kurtosis: 3 };
  const pop = Math.sqrt(m2 / n);
  return { mean, sd, sharpe: mean / sd, skew: m3 / n / pop ** 3, kurtosis: m4 / n / pop ** 4 };
}

export function sortedCopy(values: number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function linearQuantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return Number.NaN;
  const idx = (sorted.length - 1) * p;
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  if (lo === hi) return sorted[lo]!;
  return sorted[lo]! * (hi - idx) + sorted[hi]! * (idx - lo);
}

/** Order-statistic interval used by the lab's block bootstrap. Not a probability. */
export function orderInterval(sorted: number[]): { low: number; high: number } {
  if (sorted.length === 0) return { low: Number.NaN, high: Number.NaN };
  const low = sorted[Math.floor(0.025 * (sorted.length - 1))]!;
  const high = sorted[Math.ceil(0.975 * (sorted.length - 1))]!;
  return { low, high };
}

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function mixSeed(seed: number, key: string): number {
  let h = seed >>> 0;
  for (let i = 0; i < key.length; i++) h = Math.imul(h ^ key.charCodeAt(i), 0x01000193) >>> 0;
  return h >>> 0;
}

/**
 * Moving-block bootstrap of the mean. Trades must already be in time order.
 * The 2.5 and 97.5 percent order statistics are a resampling summary.
 */
export function bootstrapMean(values: number[], seed: number, reps: number): { low: number; high: number; mean: number } {
  const n = values.length;
  if (n === 0 || reps <= 0) return { low: Number.NaN, high: Number.NaN, mean: Number.NaN };
  let mean = 0;
  for (const value of values) mean += value;
  mean /= n;
  if (n === 1) return { low: mean, high: mean, mean };
  const width = Math.max(1, Math.min(Math.round(Math.sqrt(n)), n));
  const rng = mulberry32(seed);
  const means = new Array<number>(reps);
  for (let rep = 0; rep < reps; rep++) {
    let sum = 0;
    let got = 0;
    while (got < n) {
      const start = Math.floor(rng() * n);
      const take = Math.min(width, n - got);
      for (let step = 0; step < take; step++) sum += values[(start + step) % n]!;
      got += take;
    }
    means[rep] = sum / n;
  }
  means.sort((a, b) => a - b);
  const band = orderInterval(means);
  return { low: band.low, high: band.high, mean };
}

/** Paired block bootstrap of the mean of `left - right`. Arrays are aligned and time-ordered. */
export function bootstrapDiff(left: number[], right: number[], seed: number, reps: number): { low: number; high: number; mean: number } {
  if (left.length !== right.length) throw new Error("bootstrapDiff lengths differ");
  const diff = left.map((value, i) => value - right[i]!);
  return bootstrapMean(diff, seed, reps);
}

/** Independent block bootstrap of mean(a) - mean(b). Each side stays in its own time order. */
export function bootstrapMeanDiff(
  left: number[],
  right: number[],
  seed: number,
  reps: number,
): { low: number; high: number; mean: number } {
  if (left.length === 0 || right.length === 0 || reps <= 0) return { low: Number.NaN, high: Number.NaN, mean: Number.NaN };
  const meanLeft = average(left);
  const meanRight = average(right);
  const mean = meanLeft - meanRight;
  if (left.length === 1 && right.length === 1) return { low: mean, high: mean, mean };
  const rng = mulberry32(seed);
  const diffs = new Array<number>(reps);
  for (let rep = 0; rep < reps; rep++) diffs[rep] = resampleMean(left, rng) - resampleMean(right, rng);
  diffs.sort((a, b) => a - b);
  const band = orderInterval(diffs);
  return { low: band.low, high: band.high, mean };
}

function average(values: number[]): number {
  let sum = 0;
  for (const value of values) sum += value;
  return sum / values.length;
}

function resampleMean(values: number[], rng: () => number): number {
  const n = values.length;
  const width = Math.max(1, Math.min(Math.round(Math.sqrt(n)), n));
  let sum = 0;
  let got = 0;
  while (got < n) {
    const start = Math.floor(rng() * n);
    const take = Math.min(width, n - got);
    for (let step = 0; step < take; step++) sum += values[(start + step) % n]!;
    got += take;
  }
  return sum / n;
}

export const MIN_FAMILY_N = 30;
export const MIN_CLAIM_N = 100;
export const MIN_CONTRAST_TRAIN = 50;
export const MIN_FOLD_N = 5;
export const MIN_FOLDS_SCORED = 3;
export const BH_RULE = 0.05;

export type SurvivalInput = {
  trainN: number;
  holdN: number;
  trainMean: number;
  holdMean: number;
  holdBootLow: number;
  plainTrainN: number;
  plainTrainMean: number;
  plainHoldN: number;
  plainHoldBootLow: number;
  labHoldMean: number;
  labHoldBootLow: number;
  bhQ: number;
  foldsPositive: number;
  foldsScored: number;
};

/**
 * Pre-registered bar for a "positive after costs" cell. Every line is required.
 * q and the bootstrap ends are procedure outputs, not probabilities.
 */
export function cellSurvives(row: SurvivalInput): boolean {
  return (
    row.trainN >= MIN_CLAIM_N &&
    row.holdN >= MIN_CLAIM_N &&
    row.trainMean > 0 &&
    row.holdMean > 0 &&
    row.holdBootLow > 0 &&
    row.plainTrainN >= MIN_FAMILY_N &&
    row.plainTrainMean > 0 &&
    row.plainHoldN >= MIN_FAMILY_N &&
    row.plainHoldBootLow > 0 &&
    row.labHoldMean > 0 &&
    row.labHoldBootLow > 0 &&
    row.bhQ <= BH_RULE &&
    row.foldsScored >= MIN_FOLDS_SCORED &&
    row.foldsPositive * 2 > row.foldsScored
  );
}

export type ContrastInput = {
  holdYes: number;
  holdNo: number;
  trainYes: number;
  trainNo: number;
  trainDiff: number;
  holdDiffLow: number;
  holdDiffHigh: number;
  yesHoldMean: number;
  yesHoldLow: number;
  noHoldMean: number;
  noHoldLow: number;
  bhQ: number;
};

/** "yes" means the filter-on bucket is the positive one. "no" means the other bucket is. */
export function contrastClaim(row: ContrastInput): "yes" | "no" | null {
  if (
    row.holdYes < MIN_CLAIM_N ||
    row.holdNo < MIN_CLAIM_N ||
    row.trainYes < MIN_CONTRAST_TRAIN ||
    row.trainNo < MIN_CONTRAST_TRAIN ||
    !(row.bhQ <= BH_RULE)
  ) {
    return null;
  }
  if (row.holdDiffLow > 0 && row.trainDiff > 0 && row.yesHoldMean > 0 && row.yesHoldLow > 0) return "yes";
  if (row.holdDiffHigh < 0 && row.trainDiff < 0 && row.noHoldMean > 0 && row.noHoldLow > 0) return "no";
  return null;
}

/** Welch two-sample t. The two-sided tail is a ranking score for BH, not a probability. */
export function welchT(left: number[], right: number[]): { diff: number; t: number; df: number; pTwo: number } {
  const n1 = left.length;
  const n2 = right.length;
  if (n1 < 2 || n2 < 2) return { diff: Number.NaN, t: Number.NaN, df: Number.NaN, pTwo: 1 };
  const mean1 = average(left);
  const mean2 = average(right);
  let ss1 = 0;
  let ss2 = 0;
  for (const value of left) ss1 += (value - mean1) ** 2;
  for (const value of right) ss2 += (value - mean2) ** 2;
  const v1 = ss1 / (n1 - 1);
  const v2 = ss2 / (n2 - 1);
  const se2 = v1 / n1 + v2 / n2;
  if (!(se2 > 0)) {
    const diff = mean1 - mean2;
    return { diff, t: diff === 0 ? 0 : diff > 0 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY, df: n1 + n2 - 2, pTwo: diff === 0 ? 1 : 0 };
  }
  const diff = mean1 - mean2;
  const t = diff / Math.sqrt(se2);
  const df = se2 ** 2 / ((v1 / n1) ** 2 / (n1 - 1) + (v2 / n2) ** 2 / (n2 - 1));
  const pTwo = Math.min(1, 2 * studentSurvival(Math.abs(t), df));
  return { diff, t, df, pTwo };
}

/**
 * Benjamini-Hochberg q scores in the input order. Monotone from the large end.
 * A q score is the procedure's output. It is not a probability and it is not
 * a false-discovery rate for this particular cell.
 */
export function benjaminiHochberg(pValues: number[]): number[] {
  const m = pValues.length;
  const q = new Array<number>(m).fill(1);
  if (m === 0) return q;
  const order = pValues.map((p, i) => ({ p: Number.isFinite(p) ? p : 1, i })).sort((a, b) => a.p - b.p);
  let running = 1;
  for (let rank = m - 1; rank >= 0; rank--) {
    const row = order[rank]!;
    const raw = (row.p * m) / (rank + 1);
    running = Math.min(running, raw);
    q[row.i] = Math.min(1, running);
  }
  return q;
}

const LANCZOS = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
  12.507343278686905, -0.13857109526572012, 9.9843696540789804e-6, 1.5056327351493116e-7,
];

export function logGamma(z: number): number {
  if (z < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * z)) - logGamma(1 - z);
  z -= 1;
  let x = LANCZOS[0]!;
  for (let i = 1; i < LANCZOS.length; i++) x += LANCZOS[i]! / (z + i);
  const t = z + 7 + 0.5;
  return 0.5 * Math.log(2 * Math.PI) + (z + 0.5) * Math.log(t) - t + Math.log(x);
}

function betacf(a: number, b: number, x: number): number {
  const qab = a + b;
  const qap = a + 1;
  const qam = a - 1;
  let c = 1;
  let d = 1 - (qab * x) / qap;
  if (Math.abs(d) < 1e-30) d = 1e-30;
  d = 1 / d;
  let h = d;
  for (let m = 1; m <= 200; m++) {
    const m2 = 2 * m;
    let aa = (m * (b - m) * x) / ((qam + m2) * (a + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    h *= d * c;
    aa = (-(a + m) * (qab + m) * x) / ((a + m2) * (qap + m2));
    d = 1 + aa * d;
    if (Math.abs(d) < 1e-30) d = 1e-30;
    c = 1 + aa / c;
    if (Math.abs(c) < 1e-30) c = 1e-30;
    d = 1 / d;
    const del = d * c;
    h *= del;
    if (Math.abs(del - 1) < 3e-12) break;
  }
  return h;
}

export function regularizedBeta(x: number, a: number, b: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const ln = logGamma(a + b) - logGamma(a) - logGamma(b) + a * Math.log(x) + b * Math.log(1 - x);
  const front = Math.exp(ln);
  if (x < (a + 1) / (a + b + 2)) return (front * betacf(a, b, x)) / a;
  return 1 - (front * betacf(b, a, 1 - x)) / b;
}

/** P(T >= t) for a Student-t with `df` degrees of freedom. A tail score, not a probability we report as one. */
export function studentSurvival(t: number, df: number): number {
  if (!(df > 0) || !Number.isFinite(t)) return Number.NaN;
  if (t === Number.POSITIVE_INFINITY) return 0;
  if (t === Number.NEGATIVE_INFINITY) return 1;
  const x = df / (df + t * t);
  const ib = regularizedBeta(x, df / 2, 0.5);
  const cdf = t >= 0 ? 1 - 0.5 * ib : 0.5 * ib;
  const survival = 1 - cdf;
  if (survival < 0) return 0;
  if (survival > 1) return 1;
  return survival;
}

export function resampleFactor(bars: Bar[], factor: number, bucketMs: number): Bar[] {
  if (factor < 1) throw new Error("resample factor must be at least 1");
  if (factor === 1) return bars.map((bar) => ({ ...bar }));
  const out: Bar[] = [];
  let bucket = Number.NaN;
  let count = 0;
  let cur: Bar | null = null;
  const flush = () => {
    if (cur && count === factor) out.push(cur);
  };
  for (const bar of bars) {
    const id = Math.floor(bar.t / bucketMs);
    if (id !== bucket) {
      flush();
      bucket = id;
      count = 1;
      cur = { ...bar };
    } else if (cur) {
      count += 1;
      cur.high = Math.max(cur.high, bar.high);
      cur.low = Math.min(cur.low, bar.low);
      cur.close = bar.close;
      cur.volume += bar.volume;
    }
  }
  flush();
  return out;
}

/** Monday 00:00 UTC of the week containing `t`. */
export function weekStart(t: number): number {
  const days = Math.floor(t / 86_400_000);
  const dow = (days + 4) % 7;
  const sinceMon = (dow + 6) % 7;
  return (days - sinceMon) * 86_400_000;
}

/** Calendar weeks, Monday open. A week that has not reached the next Monday is dropped. */
export function resampleWeeks(bars: Bar[]): Bar[] {
  const groups = new Map<number, Bar>();
  for (const bar of bars) {
    const start = weekStart(bar.t);
    const cur = groups.get(start);
    if (!cur) groups.set(start, { ...bar, t: start });
    else {
      cur.high = Math.max(cur.high, bar.high);
      cur.low = Math.min(cur.low, bar.low);
      cur.close = bar.close;
      cur.volume += bar.volume;
    }
  }
  const lastClose = bars.length ? bars[bars.length - 1]!.t + 86_400_000 : 0;
  return [...groups.entries()]
    .sort((a, b) => a[0] - b[0])
    .filter(([start]) => start + 7 * 86_400_000 <= lastClose)
    .map(([, bar]) => bar);
}

/**
 * For each lower-timeframe bar, the higher-timeframe value whose bar had
 * already closed. `htfMs` is the higher bar's duration. Null until one exists.
 */
export function alignClosed(ltf: Bar[], ltfMs: number, htf: Bar[], htfMs: number, values: number[]): (number | null)[] {
  const out: (number | null)[] = new Array(ltf.length).fill(null);
  let j = -1;
  for (let i = 0; i < ltf.length; i++) {
    const closedBy = ltf[i]!.t + ltfMs;
    while (j + 1 < htf.length && htf[j + 1]!.t + htfMs <= closedBy) j += 1;
    if (j >= 0 && Number.isFinite(values[j])) out[i] = values[j]!;
  }
  return out;
}

export type FeatureEvent = {
  type: SignalType;
  side: Side;
  signalIndex: number;
  entryIndex: number;
  entry: number;
  atr: number;
  /** 1 when the close is on the trade's side of EMA200. -1 until the EMA exists. */
  priceSide: -1 | 0 | 1;
  /** 1 when the EMA200 slope agrees with the trade. -1 until the slope exists. */
  slopeSide: -1 | 0 | 1;
  /** 0 low, 1 mid, 2 high ATR percentile. -1 until the window exists. */
  vol: -1 | 0 | 1 | 2;
  /** 1 when the histogram's last change agrees with the trade. */
  histSide: 0 | 1;
  /** 1 when a regular divergence in the trade's direction was confirmed and still active. */
  divergence: 0 | 1;
  /** 0 disagree, 1 agree, 2 unknown. */
  htf: 0 | 1 | 2;
  /** 0 Asia 00-08, 1 Europe 08-16, 2 US 16-24 UTC, from the entry bar. */
  session: 0 | 1 | 2;
  /** 0 Sunday through 6 Saturday, UTC, from the entry bar. */
  dow: number;
};

export function collectEvents(
  bars: Bar[],
  fast: number,
  slow: number,
  signal: number,
  htfHist: (number | null)[],
  atrLen = ATR_LEN,
): FeatureEvent[] {
  const closes = bars.map((bar) => bar.close);
  const { macd, signal: sig, hist } = tvMacd(closes, fast, slow, signal);
  const atr = tvAtr(bars, atrLen);
  const ema = tvEma(closes, EMA_TREND);
  const { bull, bear } = divergenceFlags(
    bars.map((bar) => bar.low),
    bars.map((bar) => bar.high),
    hist,
    PIVOT_WING,
    DIV_ACTIVE,
  );
  const out: FeatureEvent[] = [];
  const first = readyIndex(slow, signal, atrLen);
  for (let i = first; i < bars.length - 1; i++) {
    if (!Number.isFinite(atr[i]) || !(atr[i]! > 0)) continue;
    const types = signalTypesAt(macd[i - 1]!, macd[i]!, sig[i - 1]!, sig[i]!);
    if (types.length === 0) continue;
    const entryIndex = i + 1;
    const entry = bars[entryIndex]!.open;
    if (!(entry > 0)) continue;
    const emaReady = Number.isFinite(ema[i]) && i >= SLOPE_BARS && Number.isFinite(ema[i - SLOPE_BARS]);
    const slope = emaReady ? ema[i]! - ema[i - SLOPE_BARS]! : 0;
    const above = emaReady && bars[i]!.close > ema[i]!;
    const below = emaReady && bars[i]!.close < ema[i]!;
    const histUp = Number.isFinite(hist[i]) && Number.isFinite(hist[i - 1]) && hist[i]! > hist[i - 1]!;
    const histDown = Number.isFinite(hist[i]) && Number.isFinite(hist[i - 1]) && hist[i]! < hist[i - 1]!;
    const rank = atrPercent(atr, i, VOL_LOOKBACK);
    const vol: -1 | 0 | 1 | 2 = rank == null ? -1 : rank <= 1 / 3 ? 0 : rank >= 2 / 3 ? 2 : 1;
    const when = bars[entryIndex]!.t;
    const hour = new Date(when).getUTCHours();
    const session: 0 | 1 | 2 = hour < 8 ? 0 : hour < 16 ? 1 : 2;
    const dow = new Date(when).getUTCDay();
    for (const type of types) {
      const side = sideOf(type);
      const long = side === "LONG";
      const htf = htfHist[i];
      const htfCode: 0 | 1 | 2 = htf == null ? 2 : (long && htf > 0) || (!long && htf < 0) ? 1 : 0;
      out.push({
        type,
        side,
        signalIndex: i,
        entryIndex,
        entry,
        atr: atr[i]!,
        priceSide: !emaReady ? -1 : (long && above) || (!long && below) ? 1 : 0,
        slopeSide: !emaReady ? -1 : (long && slope > 0) || (!long && slope < 0) ? 1 : 0,
        vol,
        histSide: (long && histUp) || (!long && histDown) ? 1 : 0,
        divergence: (long && bull[i]) || (!long && bear[i]) ? 1 : 0,
        htf: htfCode,
        session,
        dow,
      });
    }
  }
  return out;
}

function atrPercent(atr: number[], index: number, lookback: number): number | null {
  const start = index - lookback + 1;
  if (start < 0) return null;
  const value = atr[index]!;
  if (!Number.isFinite(value)) return null;
  let le = 0;
  for (let i = start; i <= index; i++) {
    if (!Number.isFinite(atr[i])) return null;
    if (atr[i]! <= value) le += 1;
  }
  return le / lookback;
}

/**
 * Regular divergence. A pivot is confirmed `wing` bars after it prints, so
 * bar i never reads a later bar. The flag stays on for `active` bars including
 * the confirmation bar. Bullish: a lower price low and a higher histogram low.
 * Bearish is the mirror on highs.
 */
export function divergenceFlags(
  lows: number[],
  highs: number[],
  hist: number[],
  wing: number,
  active: number,
): { bull: boolean[]; bear: boolean[] } {
  const n = lows.length;
  const bull = new Array<boolean>(n).fill(false);
  const bear = new Array<boolean>(n).fill(false);
  const bullConfirm: number[] = [];
  const bearConfirm: number[] = [];
  let prevLow = -1;
  let prevHigh = -1;
  for (let i = wing; i < n - wing; i++) {
    if (isPivotLow(lows, i, wing) && Number.isFinite(hist[i]) && (prevLow < 0 || Number.isFinite(hist[prevLow]))) {
      const confirm = i + wing;
      if (prevLow >= 0 && lows[i]! < lows[prevLow]! && hist[i]! > hist[prevLow]!) bullConfirm.push(confirm);
      prevLow = i;
    }
    if (isPivotHigh(highs, i, wing) && Number.isFinite(hist[i]) && (prevHigh < 0 || Number.isFinite(hist[prevHigh]))) {
      const confirm = i + wing;
      if (prevHigh >= 0 && highs[i]! > highs[prevHigh]! && hist[i]! < hist[prevHigh]!) bearConfirm.push(confirm);
      prevHigh = i;
    }
  }
  paintActive(bull, bullConfirm, active);
  paintActive(bear, bearConfirm, active);
  return { bull, bear };
}

function paintActive(flags: boolean[], confirms: number[], active: number) {
  for (const confirm of confirms) {
    const end = Math.min(flags.length - 1, confirm + active - 1);
    for (let i = confirm; i <= end; i++) flags[i] = true;
  }
}

function isPivotLow(values: number[], index: number, wing: number): boolean {
  const value = values[index]!;
  for (let k = 1; k <= wing; k++) {
    if (!(value < values[index - k]! && value < values[index + k]!)) return false;
  }
  return true;
}

function isPivotHigh(values: number[], index: number, wing: number): boolean {
  const value = values[index]!;
  for (let k = 1; k <= wing; k++) {
    if (!(value > values[index - k]! && value > values[index + k]!)) return false;
  }
  return true;
}

export type OriginalScore = {
  n: number;
  hits: number;
  stops: number;
  timeouts: number;
  ignored: number;
  hitRate: number;
};

/**
 * Reconstruction of the described one-slot grader. A second signal of a type
 * is ignored while that type's slot is open. The slot frees on its exit bar,
 * so a new signal on that close can be taken. The fill is the signal close.
 * The window is the next `horizon` bars. A finished horizon that did not hit,
 * and a trade still open at the last bar, count as failed samples. Same-bar
 * stop wins. This is the comparison, not the study.
 */
export function gradeOriginal(
  bars: Bar[],
  fast: number,
  slow: number,
  signal: number,
  targetMult: number,
  stopMult: number,
  horizon = HORIZON,
  atrLen = ATR_LEN,
): OriginalScore[] {
  const closes = bars.map((bar) => bar.close);
  const { macd, signal: sig } = tvMacd(closes, fast, slow, signal);
  const atr = tvAtr(bars, atrLen);
  const busyUntil = [-1, -1, -1, -1, -1, -1];
  const scores: OriginalScore[] = Array.from({ length: 6 }, () => ({
    n: 0,
    hits: 0,
    stops: 0,
    timeouts: 0,
    ignored: 0,
    hitRate: 0,
  }));
  for (let i = readyIndex(slow, signal, atrLen); i < bars.length - 1; i++) {
    const types = signalTypesAt(macd[i - 1]!, macd[i]!, sig[i - 1]!, sig[i]!);
    if (!Number.isFinite(atr[i]) || !(atr[i]! > 0)) continue;
    for (const type of types) {
      if (i < busyUntil[type]!) {
        scores[type]!.ignored += 1;
        continue;
      }
      const resolved = resolveTrade(bars, sideOf(type), i + 1, bars[i]!.close, atr[i]!, targetMult, stopMult, horizon);
      if (!resolved) continue;
      const score = scores[type]!;
      score.n += 1;
      if (resolved.outcome === "target") score.hits += 1;
      else if (resolved.outcome === "stop") score.stops += 1;
      else score.timeouts += 1;
      busyUntil[type] = resolved.exitIndex;
    }
  }
  for (const score of scores) score.hitRate = score.n ? score.hits / score.n : 0;
  return scores;
}

export type BookFill = {
  coin: number;
  side: Side;
  signalIndex: number;
  entryIndex: number;
  exitIndex: number;
  entry: number;
  exit: number;
  ret: number;
  pnl: number;
  outcome: Outcome;
};

export type BookResult = {
  profit: number;
  endEquity: number;
  maxDd: number;
  fills: BookFill[];
  barReturns: number[];
  perCoin: number[];
};

/**
 * One position per coin. A signal is taken only when that coin is flat, and
 * a coin that exits on a bar does not open a new trade on that same bar.
 * Stake is current cash equity divided by the number of coins.
 */
export type BookEvent = FeatureEvent & { coin: number };

export function runBracketBook(
  bars: Bar[][],
  events: BookEvent[],
  targetMult: number,
  stopMult: number,
  cost: CostModel,
  from: number,
  to: number,
  horizon = HORIZON,
  startEquity = 10_000,
): BookResult {
  const coins = bars.length;
  if (coins === 0) throw new Error("runBracketBook needs a coin");
  const n = bars[0]!.length;
  const end = Math.min(to, n - 1);
  const weight = 1 / coins;
  const byEntry = new Map<number, BookEvent[]>();
  for (const event of events) {
    if (event.coin < 0 || event.coin >= coins) throw new Error("event coin is outside the book");
    if (event.entryIndex < from || event.entryIndex > end) continue;
    const list = byEntry.get(event.entryIndex);
    if (list) list.push(event);
    else byEntry.set(event.entryIndex, [event]);
  }
  type Pos = { side: Side; entry: number; signalIndex: number; entryIndex: number; resolved: Resolved };
  const open: (Pos | null)[] = bars.map(() => null);
  const busyUntil = bars.map(() => -1);
  let cash = startEquity;
  const fills: BookFill[] = [];
  const curve: number[] = [];
  const perCoin = bars.map(() => 0);

  const closePos = (coin: number, pos: Pos) => {
    const ret = netReturn(pos.side, pos.entry, pos.resolved.exitPrice, cost);
    const pnl = cash * weight * ret;
    cash += pnl;
    fills.push({
      coin,
      side: pos.side,
      signalIndex: pos.signalIndex,
      entryIndex: pos.entryIndex,
      exitIndex: pos.resolved.exitIndex,
      entry: pos.entry,
      exit: pos.resolved.exitPrice,
      ret,
      pnl,
      outcome: pos.resolved.outcome,
    });
    perCoin[coin] = (perCoin[coin] ?? 0) + 1;
    open[coin] = null;
    busyUntil[coin] = pos.resolved.exitIndex;
  };

  const mark = (index: number) => {
    let marked = cash;
    for (let coin = 0; coin < coins; coin++) {
      const pos = open[coin];
      if (!pos) continue;
      const ret = netReturn(pos.side, pos.entry, bars[coin]![index]!.close, cost);
      marked += cash * weight * ret;
    }
    return marked;
  };

  for (let i = from; i <= end; i++) {
    for (let coin = 0; coin < coins; coin++) {
      const pos = open[coin];
      if (pos && pos.resolved.exitIndex === i) closePos(coin, pos);
    }
    const arriving = byEntry.get(i);
    if (arriving) {
      for (const event of arriving) {
        const coin = event.coin;
        if (open[coin] || busyUntil[coin] === i) continue;
        const resolved = resolveTrade(bars[coin]!, event.side, event.entryIndex, event.entry, event.atr, targetMult, stopMult, horizon);
        if (!resolved || resolved.exitIndex > end) {
          if (!resolved) continue;
          open[coin] = {
            side: event.side,
            entry: event.entry,
            signalIndex: event.signalIndex,
            entryIndex: event.entryIndex,
            resolved,
          };
          continue;
        }
        if (resolved.exitIndex === i) {
          closePos(coin, {
            side: event.side,
            entry: event.entry,
            signalIndex: event.signalIndex,
            entryIndex: event.entryIndex,
            resolved,
          });
          continue;
        }
        open[coin] = {
          side: event.side,
          entry: event.entry,
          signalIndex: event.signalIndex,
          entryIndex: event.entryIndex,
          resolved,
        };
      }
    }
    curve.push(i === end ? cash : mark(i));
  }
  for (let coin = 0; coin < coins; coin++) {
    const pos = open[coin];
    if (!pos) continue;
    const px = bars[coin]![end]!.close;
    const ret = netReturn(pos.side, pos.entry, px, cost);
    const pnl = cash * weight * ret;
    cash += pnl;
    fills.push({
      coin,
      side: pos.side,
      signalIndex: pos.signalIndex,
      entryIndex: pos.entryIndex,
      exitIndex: end,
      entry: pos.entry,
      exit: px,
      ret,
      pnl,
      outcome: "censored",
    });
    perCoin[coin] = (perCoin[coin] ?? 0) + 1;
    open[coin] = null;
  }
  if (curve.length) curve[curve.length - 1] = cash;
  return { profit: cash - startEquity, endEquity: cash, maxDd: maxDrawdown(curve), fills, barReturns: returnsOf(curve), perCoin };
}

export function runBuyAndHold(bars: Bar[][], from: number, to: number, cost: CostModel, startEquity = 10_000): BookResult {
  const coins = bars.length;
  const end = Math.min(to, bars[0]!.length - 1);
  const weight = 1 / coins;
  let cash = startEquity;
  const curve: number[] = [];
  const fills: BookFill[] = [];
  const entries = bars.map((series) => series[from]!.open);
  for (let i = from; i <= end; i++) {
    if (i === end) {
      for (let coin = 0; coin < coins; coin++) {
        const entry = entries[coin]!;
        const exit = bars[coin]![end]!.close;
        const ret = netReturn("LONG", entry, exit, cost);
        const pnl = cash * weight * ret;
        cash += pnl;
        fills.push({
          coin,
          side: "LONG",
          signalIndex: from,
          entryIndex: from,
          exitIndex: end,
          entry,
          exit,
          ret,
          pnl,
          outcome: "timeout",
        });
      }
      curve.push(cash);
    } else {
      let marked = cash;
      for (let coin = 0; coin < coins; coin++) {
        const ret = netReturn("LONG", entries[coin]!, bars[coin]![i]!.close, cost);
        marked += cash * weight * ret;
      }
      curve.push(marked);
    }
  }
  return {
    profit: cash - startEquity,
    endEquity: cash,
    maxDd: maxDrawdown(curve),
    fills,
    barReturns: returnsOf(curve),
    perCoin: bars.map(() => 1),
  };
}

function maxDrawdown(curve: number[]): number {
  let peak = curve[0] ?? 0;
  let maxDd = 0;
  for (const point of curve) {
    peak = Math.max(peak, point);
    maxDd = Math.max(maxDd, peak > 0 ? (peak - point) / peak : 0);
  }
  return maxDd;
}

function returnsOf(curve: number[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < curve.length; i++) {
    const prev = curve[i - 1]!;
    out.push(prev !== 0 ? curve[i]! / prev - 1 : 0);
  }
  return out;
}

/** Greedy non-overlapping trades. A new entry on the exit bar is skipped. */
export function nonOverlapping(events: BookEvent[], exits: number[]): number[] {
  const nextFree = new Map<string, number>();
  const kept: number[] = [];
  const order = events.map((_, index) => index).sort((a, b) => events[a]!.entryIndex - events[b]!.entryIndex || a - b);
  for (const index of order) {
    const event = events[index]!;
    const key = String(event.coin);
    const free = nextFree.get(key) ?? -1;
    if (event.entryIndex <= free) continue;
    kept.push(index);
    nextFree.set(key, exits[index]!);
  }
  kept.sort((a, b) => events[a]!.entryIndex - events[b]!.entryIndex || a - b);
  return kept;
}

export function signedReturn(side: Side, entry: number, exit: number): number {
  if (!(entry > 0) || !(exit > 0)) return Number.NaN;
  return side === "LONG" ? exit / entry - 1 : entry / exit - 1;
}

export function sessionName(session: number): string {
  return session === 0 ? "Asia" : session === 1 ? "Europe" : "US";
}

export function dowName(dow: number): string {
  return ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][dow] ?? String(dow);
}
