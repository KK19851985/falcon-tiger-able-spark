import type { Bar, Config, DirectionTf, Side, SignalRule, Stance } from "./types.ts";
import { ema, emaStance, volumeStance, vproStance } from "./indicators.ts";

/**
 * The three entry triggers, combined the way the desk combines the first two.
 *
 * V-Pro and the EMA cross are each latched. The book is long only while both
 * say long, and short only while both say short. When the volume threshold is
 * on, the volume trend has to say the same thing or the stance is flat. A
 * short is forced flat while the close is above the short-skip EMA, which is
 * EMA 20 on the published rule. Flat is an exit under the desk's scoreOne.
 */
export function stanceFor(bars: Bar[], config: Config): Stance[] {
  if (config.emaFast >= config.emaSlow) {
    throw new Error(`EMA fast ${config.emaFast} must be shorter than EMA slow ${config.emaSlow}`);
  }
  const closes = bars.map((bar) => bar.close);
  const vpro = vproStance(bars, config.vproBand, config.vproSignal);
  const trend = emaStance(closes, config.emaFast, config.emaSlow);
  const skip = config.shortSkip == null ? null : ema(closes, config.shortSkip);
  const volume =
    config.volumeThreshold == null
      ? null
      : volumeStance(bars, config.volumeLookback, config.volumeThreshold);
  const directionTf = config.directionTf ?? "15m";
  const price =
    directionTf === "15m"
      ? priceSignal(vpro, trend, config.signalRule ?? "agree")
      : vproFilteredByDirection(vpro, higherTimeframeDirection(bars, directionTf, config.emaFast, config.emaSlow));
  return applyFilters(bars, price, volume, skip);
}

const FIFTEEN_MS = 15 * 60 * 1000;

/** Milliseconds in a closed higher-timeframe bar. Buckets are aligned to UTC. */
export function directionDuration(tf: Exclude<DirectionTf, "15m">): number {
  if (tf === "1h") return 60 * 60 * 1000;
  if (tf === "4h") return 4 * 60 * 60 * 1000;
  return 24 * 60 * 60 * 1000;
}

/**
 * EMA 20/30 direction on a higher timeframe resampled from these 15-minute bars.
 * A higher bar is visible only after its end time. The bar that is still forming
 * is not used, so a later 15-minute print inside it cannot leak backward.
 */
export function higherTimeframeDirection(
  bars: Bar[],
  tf: Exclude<DirectionTf, "15m">,
  fastLen = 20,
  slowLen = 30,
): Stance[] {
  const dur = directionDuration(tf);
  const buckets: { end: number; close: number }[] = [];
  for (const bar of bars) {
    const start = Math.floor(bar.t / dur) * dur;
    const last = buckets[buckets.length - 1];
    if (!last || last.end - dur !== start) buckets.push({ end: start + dur, close: bar.close });
    else last.close = bar.close;
  }
  const fast = ema(
    buckets.map((bucket) => bucket.close),
    fastLen,
  );
  const slow = ema(
    buckets.map((bucket) => bucket.close),
    slowLen,
  );
  const direction: Stance[] = buckets.map((_, i) => {
    if (fast[i]! > slow[i]!) return "LONG";
    if (fast[i]! < slow[i]!) return "SHORT";
    return "FLAT";
  });
  const out: Stance[] = new Array(bars.length).fill("FLAT");
  let cursor = -1;
  for (let i = 0; i < bars.length; i++) {
    const knownAt = bars[i]!.t + FIFTEEN_MS;
    while (cursor + 1 < buckets.length && buckets[cursor + 1]!.end <= knownAt) cursor++;
    if (cursor >= 0) out[i] = direction[cursor]!;
  }
  return out;
}

function vproFilteredByDirection(vpro: Stance[], direction: Stance[]): Stance[] {
  const out: Stance[] = new Array(vpro.length);
  for (let i = 0; i < vpro.length; i++) {
    out[i] = vpro[i] !== "FLAT" && vpro[i] === direction[i] ? vpro[i]! : "FLAT";
  }
  return out;
}

/**
 * Price-trigger combination only. `agree` is the published rule: both latched
 * stances must be the same side. `either` takes a side when one trigger has it
 * and the other is not the opposite. `window3` allows a side only when the
 * latest cross of each trigger points that way and the two crosses are at most
 * 3 bars apart. That window is tighter than `agree`.
 */
export function priceSignal(vpro: Stance[], trend: Stance[], rule: SignalRule = "agree"): Stance[] {
  if (rule === "either") return eitherSignal(vpro, trend);
  if (rule === "window3") return windowSignal(vpro, trend, 3);
  const out: Stance[] = new Array(vpro.length);
  for (let i = 0; i < vpro.length; i++) {
    out[i] = vpro[i] !== "FLAT" && vpro[i] === trend[i] ? vpro[i]! : "FLAT";
  }
  return out;
}

function eitherSignal(vpro: Stance[], trend: Stance[]): Stance[] {
  const out: Stance[] = new Array(vpro.length);
  for (let i = 0; i < vpro.length; i++) {
    const left = vpro[i]!;
    const right = trend[i]!;
    if ((left === "LONG" && right === "SHORT") || (left === "SHORT" && right === "LONG")) out[i] = "FLAT";
    else if (left === "FLAT") out[i] = right === "LONG" || right === "SHORT" ? right : "FLAT";
    else if (right === "FLAT" || right === left) out[i] = left;
    else out[i] = "FLAT";
  }
  return out;
}

function windowSignal(vpro: Stance[], trend: Stance[], barsApart: number): Stance[] {
  const out: Stance[] = new Array(vpro.length);
  let lastV: { at: number; side: Side } | null = null;
  let lastE: { at: number; side: Side } | null = null;
  let prevV: Stance = "FLAT";
  let prevE: Stance = "FLAT";
  for (let i = 0; i < vpro.length; i++) {
    if (vpro[i] !== prevV && (vpro[i] === "LONG" || vpro[i] === "SHORT")) lastV = { at: i, side: vpro[i] as Side };
    if (trend[i] !== prevE && (trend[i] === "LONG" || trend[i] === "SHORT")) lastE = { at: i, side: trend[i] as Side };
    prevV = vpro[i]!;
    prevE = trend[i]!;
    out[i] =
      lastV && lastE && lastV.side === lastE.side && Math.abs(lastV.at - lastE.at) <= barsApart
        ? lastV.side
        : "FLAT";
  }
  return out;
}

function applyFilters(bars: Bar[], sides: Stance[], volume: Stance[] | null, skip: number[] | null): Stance[] {
  const out: Stance[] = new Array(bars.length);
  for (let i = 0; i < bars.length; i++) {
    let side = sides[i]!;
    if (volume && side !== volume[i]) side = "FLAT";
    if (side === "SHORT" && skip && bars[i]!.close > skip[i]!) side = "FLAT";
    out[i] = side;
  }
  return out;
}

/** Agree the three triggers, then apply the short-skip line. Exported for tests. */
export function combineStances(
  bars: Bar[],
  vpro: Stance[],
  trend: Stance[],
  volume: Stance[] | null,
  skip: number[] | null,
): Stance[] {
  return applyFilters(bars, priceSignal(vpro, trend, "agree"), volume, skip);
}
