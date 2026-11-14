import { EULER, REGIME_BAND, REGIME_LOOKBACK, SHARPE_CRITICAL_Z } from "./constants.ts";
import type { Fill } from "./execute.ts";
import type { Bar, DeflatedRecord, RegimeName, RegimeStat } from "./types.ts";

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

/** Acklam's inverse normal. Used only to place the deflated-Sharpe hurdle. */
export function normInv(p: number): number {
  if (!(p > 0 && p < 1)) throw new Error(`normInv is undefined at ${p}`);
  const a = [
    -3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.38357751867269e2,
    -3.066479806614716e1, 2.506628277459239,
  ];
  const b = [
    -5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1,
    -1.328068155288572e1,
  ];
  const c = [
    -7.784894002430293e-3, -3.223964580411385e-1, -2.400758277161838, -2.549732539343734,
    4.374664141464968, 2.938163982698783,
  ];
  const d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
  const plow = 0.02425;
  if (p < plow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (
      (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
      ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
    );
  }
  if (p > 1 - plow) {
    const q = Math.sqrt(-2 * Math.log(1 - p));
    return (
      -(
        (((((c[0]! * q + c[1]!) * q + c[2]!) * q + c[3]!) * q + c[4]!) * q + c[5]!) /
        ((((d[0]! * q + d[1]!) * q + d[2]!) * q + d[3]!) * q + 1)
      )
    );
  }
  const q = p - 0.5;
  const r = q * q;
  return (
    ((((((a[0]! * r + a[1]!) * r + a[2]!) * r + a[3]!) * r + a[4]!) * r + a[5]!) * q) /
    (((((b[0]! * r + b[1]!) * r + b[2]!) * r + b[3]!) * r + b[4]!) * r + 1)
  );
}

export type Moments = {
  mean: number;
  sd: number;
  sharpe: number;
  skew: number;
  kurtosis: number;
};

/** Sample Sharpe (n-1). Skew and Pearson kurtosis use the n-divisor, as the deflated-Sharpe formula does. */
export function moments(values: number[]): Moments {
  const n = values.length;
  if (n < 2) return { mean: 0, sd: 0, sharpe: 0, skew: 0, kurtosis: 3 };
  const mean = values.reduce((acc, value) => acc + value, 0) / n;
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
  return {
    mean,
    sd,
    sharpe: mean / sd,
    skew: m3 / n / pop ** 3,
    kurtosis: m4 / n / pop ** 4,
  };
}

export function blockBootstrapProfit(
  dailyReturns: number[],
  startEquity: number,
  seed: number,
  reps: number,
  block: number,
): { low: number; high: number } {
  if (dailyReturns.length === 0 || reps <= 0) return { low: 0, high: 0 };
  const rng = mulberry32(seed);
  const n = dailyReturns.length;
  const width = Math.max(1, Math.min(block, n));
  const profits = new Array<number>(reps);
  for (let rep = 0; rep < reps; rep++) {
    const sampled: number[] = [];
    while (sampled.length < n) {
      const start = Math.floor(rng() * n);
      for (let step = 0; step < width && sampled.length < n; step++) {
        sampled.push(dailyReturns[(start + step) % n]!);
      }
    }
    let equity = startEquity;
    for (const ret of sampled) equity *= 1 + ret;
    profits[rep] = equity - startEquity;
  }
  profits.sort((a, b) => a - b);
  const low = profits[Math.floor(0.025 * (reps - 1))]!;
  const high = profits[Math.ceil(0.975 * (reps - 1))]!;
  return { low, high };
}

function sampleVariance(values: number[]): number {
  if (values.length < 2) return 0;
  const mean = values.reduce((acc, value) => acc + value, 0) / values.length;
  return values.reduce((acc, value) => acc + (value - mean) ** 2, 0) / (values.length - 1);
}

/**
 * Deflated Sharpe (Bailey and López de Prado).
 *
 * The hurdle is the expected maximum Sharpe under a null, given every trial
 * ever run. With one trial there is no selection premium, so the hurdle is 0,
 * and the Sharpe still has to clear sampling noise. `z` is the test statistic.
 * This function does not return a probability.
 */
export function deflatedSharpe(input: {
  sharpe: number;
  skew: number;
  kurtosis: number;
  observations: number;
  trialSharpes: number[];
}): DeflatedRecord {
  const trials = input.trialSharpes.length;
  const sharpe = input.sharpe;
  const inside =
    1 - input.skew * sharpe + ((input.kurtosis - 1) / 4) * sharpe * sharpe;
  const variance = trials >= 2 ? sampleVariance(input.trialSharpes) : 0;
  let hurdle = 0;
  if (trials >= 2 && variance > 0) {
    const expectedMax =
      (1 - EULER) * normInv(1 - 1 / trials) + EULER * normInv(1 - 1 / (trials * Math.E));
    hurdle = Math.sqrt(variance) * expectedMax;
  }
  const estimable = input.observations > 1 && inside > 0;
  const se = estimable ? Math.sqrt(inside / (input.observations - 1)) : Number.NaN;
  const z = estimable && se > 0 ? (sharpe - hurdle) / se : Number.NaN;
  const clears =
    estimable &&
    input.observations >= 30 &&
    sharpe > hurdle &&
    Number.isFinite(z) &&
    z >= SHARPE_CRITICAL_Z;
  return { sharpe, hurdle, z, clears, trials, variance };
}

export function btcRegime(bars: Bar[], index: number, lookback = REGIME_LOOKBACK): RegimeName {
  if (index < lookback) return "sideways";
  const ret = bars[index]!.close / bars[index - lookback]!.close - 1;
  if (ret > REGIME_BAND) return "bull";
  if (ret < -REGIME_BAND) return "bear";
  return "sideways";
}

export function regimeBreakdown(btc: Bar[], fills: Fill[], lookback = REGIME_LOOKBACK): Record<RegimeName, RegimeStat> {
  const buckets: Record<RegimeName, { trades: number; wins: number; pnl: number; ret: number }> = {
    bull: { trades: 0, wins: 0, pnl: 0, ret: 0 },
    bear: { trades: 0, wins: 0, pnl: 0, ret: 0 },
    sideways: { trades: 0, wins: 0, pnl: 0, ret: 0 },
  };
  for (const fill of fills) {
    const bucket = buckets[btcRegime(btc, fill.signalIndex, lookback)];
    bucket.trades += 1;
    bucket.pnl += fill.pnl;
    bucket.ret += fill.ret;
    if (fill.pnl > 0) bucket.wins += 1;
  }
  return {
    bull: finishRegime(buckets.bull),
    bear: finishRegime(buckets.bear),
    sideways: finishRegime(buckets.sideways),
  };
}

function finishRegime(bucket: { trades: number; wins: number; pnl: number; ret: number }): RegimeStat {
  return {
    trades: bucket.trades,
    wins: bucket.wins,
    pnl: bucket.pnl,
    meanRet: bucket.trades ? bucket.ret / bucket.trades : 0,
  };
}

/** Equal-weight close-to-close buy and hold on $10,000, with no costs. Same construction as the desk. */
export function buyAndHold(
  closes: number[][],
  from: number,
  end: number,
  startEquity = 10_000,
): number {
  if (closes.length === 0) return 0;
  let sum = 0;
  for (const series of closes) sum += series[end]! / series[from]! - 1;
  return (sum / closes.length) * startEquity;
}
