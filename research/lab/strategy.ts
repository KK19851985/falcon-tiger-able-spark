import type { Bar, Config, Stance } from "./types.ts";
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
  return combineStances(bars, vpro, trend, volume, skip);
}

/** Agree the three triggers, then apply the short-skip line. Exported for tests. */
export function combineStances(
  bars: Bar[],
  vpro: Stance[],
  trend: Stance[],
  volume: Stance[] | null,
  skip: number[] | null,
): Stance[] {
  const out: Stance[] = new Array(bars.length);
  for (let i = 0; i < bars.length; i++) {
    let side: Stance = vpro[i] !== "FLAT" && vpro[i] === trend[i] ? vpro[i]! : "FLAT";
    if (volume && side !== volume[i]) side = "FLAT";
    if (side === "SHORT" && skip && bars[i]!.close > skip[i]!) side = "FLAT";
    out[i] = side;
  }
  return out;
}
