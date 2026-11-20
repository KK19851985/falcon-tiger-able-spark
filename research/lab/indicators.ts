import type { Bar, Stance } from "./types.ts";

/**
 * Indicator math copied from the desk so a research run does not import the
 * tape. `vproStance` must match `src/lib/desk/vpro.ts` and the EMA cross must
 * match the latch in `src/lib/desk/fund.ts`.
 */

export function ema(values: number[], span: number): number[] {
  const k = 2 / (span + 1);
  const out = new Array<number>(values.length);
  let prev = values[0] ?? 0;
  for (let i = 0; i < values.length; i++) {
    prev = i === 0 ? values[i]! : values[i]! * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

export function sma(values: number[], span: number): number[] {
  const out = new Array<number>(values.length).fill(Number.NaN);
  let acc = 0;
  for (let i = 0; i < values.length; i++) {
    acc += values[i]!;
    if (i >= span) acc -= values[i - span]!;
    if (i >= span - 1) out[i] = acc / span;
  }
  return out;
}

function smaAt(values: number[], i: number, len: number): number {
  if (i < len - 1) return Number.NaN;
  let acc = 0;
  for (let k = i - len + 1; k <= i; k++) acc += values[k]!;
  return acc / len;
}

function smma(values: number[], len: number): number[] {
  const out = new Array<number>(values.length).fill(Number.NaN);
  let acc = 0;
  for (let i = 0; i < values.length; i++) {
    if (i < len) {
      acc += values[i]!;
      if (i === len - 1) out[i] = acc / len;
    } else {
      out[i] = (out[i - 1]! * (len - 1) + values[i]!) / len;
    }
  }
  return out;
}

function zlema(values: number[], len: number): number[] {
  const first = ema(values, len);
  const second = ema(first, len);
  return first.map((value, i) => value + (value - second[i]!));
}

function impulse(bars: Bar[], len: number): number[] {
  const hi = smma(
    bars.map((bar) => bar.high),
    len,
  );
  const lo = smma(
    bars.map((bar) => bar.low),
    len,
  );
  const mid = zlema(
    bars.map((bar) => (bar.high + bar.low + bar.close) / 3),
    len,
  );
  return mid.map((value, i) => {
    if (!Number.isFinite(hi[i])) return 0;
    if (value > hi[i]!) return value - hi[i]!;
    if (value < lo[i]!) return value - lo[i]!;
    return 0;
  });
}

/** Latched V-Pro cross. A cross up stays long until a cross down, and the reverse. */
export function vproStance(bars: Bar[], band: number, signal: number): Stance[] {
  const md = impulse(bars, band);
  const sig = md.map((_, i) => smaAt(md, i, signal));
  const out: Stance[] = new Array(bars.length);
  let side: Stance = "FLAT";
  for (let i = 0; i < bars.length; i++) {
    if (i > 0 && Number.isFinite(sig[i]) && Number.isFinite(sig[i - 1])) {
      if (md[i - 1]! <= sig[i - 1]! && md[i]! > sig[i]!) side = "LONG";
      else if (md[i - 1]! >= sig[i - 1]! && md[i]! < sig[i]!) side = "SHORT";
    }
    out[i] = side;
  }
  return out;
}

/** Latched EMA cross, the same comparison the desk uses for the 20/30 pair. */
export function emaStance(closes: number[], fastLen: number, slowLen: number): Stance[] {
  const fast = ema(closes, fastLen);
  const slow = ema(closes, slowLen);
  const out: Stance[] = new Array(closes.length);
  let side: Stance = "FLAT";
  for (let i = 0; i < closes.length; i++) {
    if (i > 0) {
      if (fast[i - 1]! <= slow[i - 1]! && fast[i]! > slow[i]!) side = "LONG";
      else if (fast[i - 1]! >= slow[i - 1]! && fast[i]! < slow[i]!) side = "SHORT";
    }
    out[i] = side;
  }
  return out;
}

/**
 * Volume trend. A bar whose volume is at least `threshold` times its N-bar
 * average sets the stance in the direction of that bar's close. Otherwise the
 * previous stance is kept. The caller ignores this entirely when the threshold
 * is off.
 */
export function volumeStance(bars: Bar[], lookback: number, threshold: number): Stance[] {
  const avg = sma(
    bars.map((bar) => bar.volume),
    lookback,
  );
  const out: Stance[] = new Array(bars.length);
  let side: Stance = "FLAT";
  for (let i = 0; i < bars.length; i++) {
    if (i > 0 && Number.isFinite(avg[i]) && avg[i]! > 0) {
      const ratio = bars[i]!.volume / avg[i]!;
      if (ratio >= threshold && bars[i]!.close > bars[i - 1]!.close) side = "LONG";
      else if (ratio >= threshold && bars[i]!.close < bars[i - 1]!.close) side = "SHORT";
    }
    out[i] = side;
  }
  return out;
}
