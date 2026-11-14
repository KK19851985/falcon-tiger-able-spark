import type { Bar, SymbolName } from "./types.ts";

export type ExtCandle = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  confirmed: boolean;
};

export type MergeResult = {
  bars: Bar[];
  accepted: boolean;
  reason: string;
  scale: number | null;
  medianAbsPct: number | null;
  maxAbsPct: number | null;
  replaced: string[];
  appended: string[];
};

const MIN_OVERLAP = 10;
const MAX_MEDIAN_ABS = 0.005;
const MAX_DAY_ABS = 0.01;

function day(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[mid]!;
  return (sorted[mid - 1]! + sorted[mid]!) / 2;
}

/** The bundled tape's last print is unfinished when its volume collapses versus the prior month. */
export function isPartialLast(bars: Bar[]): boolean {
  if (bars.length < 21) return false;
  const med = median(bars.slice(-21, -1).map((bar) => bar.volume));
  return med > 0 && bars[bars.length - 1]!.volume < med * 0.15;
}

/**
 * Keep the bundled history. If the public daily candles agree on the overlap,
 * replace a trailing partial bar and append newer confirmed days.
 * Volume is rescaled by the overlap's median volume ratio so a venue change
 * does not look like a volume spike. Prices are not rescaled.
 */
export function mergeSymbol(bundled: Bar[], incoming: ExtCandle[]): MergeResult {
  const confirmed = incoming.filter((candle) => candle.confirmed);
  const byTime = new Map<number, ExtCandle>();
  for (const candle of confirmed) byTime.set(candle.t, candle);
  const last = bundled[bundled.length - 1];
  if (!last || byTime.size === 0) {
    return {
      bars: bundled.map((bar) => ({ ...bar })),
      accepted: false,
      reason: "no confirmed public candles",
      scale: null,
      medianAbsPct: null,
      maxAbsPct: null,
      replaced: [],
      appended: [],
    };
  }
  const partial = isPartialLast(bundled);
  const diffs: number[] = [];
  const ratios: number[] = [];
  for (const bar of bundled) {
    const ext = byTime.get(bar.t);
    if (!ext || bar.close === 0) continue;
    if (partial && bar.t === last.t) continue;
    diffs.push(Math.abs(ext.close / bar.close - 1));
    if (bar.volume > 0 && ext.volume > 0) ratios.push(bar.volume / ext.volume);
  }
  if (diffs.length < MIN_OVERLAP) {
    return fail(bundled, `only ${diffs.length} overlapping days`);
  }
  const medianAbsPct = median(diffs);
  const maxAbsPct = Math.max(...diffs);
  if (medianAbsPct > MAX_MEDIAN_ABS || maxAbsPct > MAX_DAY_ABS) {
    return fail(
      bundled,
      `overlap disagreed (median ${(medianAbsPct * 100).toFixed(3)}%, max ${(maxAbsPct * 100).toFixed(3)}%)`,
      medianAbsPct,
      maxAbsPct,
    );
  }
  const scale = ratios.length ? median(ratios) : 1;
  const bars = bundled.map((bar) => ({ ...bar }));
  const replaced: string[] = [];
  if (partial) {
    const ext = byTime.get(last.t);
    if (ext) {
      bars[bars.length - 1] = {
        t: ext.t,
        open: ext.open,
        high: ext.high,
        low: ext.low,
        close: ext.close,
        volume: ext.volume * scale,
      };
      replaced.push(day(ext.t));
    }
  }
  const tip = bars[bars.length - 1]!.t;
  const appended: string[] = [];
  const extra = [...byTime.values()].filter((candle) => candle.t > tip).sort((a, b) => a.t - b.t);
  for (const candle of extra) {
    bars.push({
      t: candle.t,
      open: candle.open,
      high: candle.high,
      low: candle.low,
      close: candle.close,
      volume: candle.volume * scale,
    });
    appended.push(day(candle.t));
  }
  const note =
    replaced.length || appended.length
      ? `accepted, replaced ${replaced.join(", ") || "nothing"}, appended ${appended.join(", ") || "nothing"}, volume scale ${scale.toFixed(4)}`
      : "accepted, public tape had nothing newer than the bundle";
  return { bars, accepted: true, reason: note, scale, medianAbsPct, maxAbsPct, replaced, appended };
}

function fail(bundled: Bar[], reason: string, medianAbsPct: number | null = null, maxAbsPct: number | null = null): MergeResult {
  return {
    bars: bundled.map((bar) => ({ ...bar })),
    accepted: false,
    reason,
    scale: null,
    medianAbsPct,
    maxAbsPct,
    replaced: [],
    appended: [],
  };
}

export function dayOf(t: number): string {
  return day(t);
}

export type SymbolMerges = Record<SymbolName, MergeResult>;
