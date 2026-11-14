import { createHash } from "node:crypto";
import type { Config, Series, SymbolName } from "./types.ts";
import { SYMBOLS } from "./types.ts";

const KEYS = [
  "emaFast",
  "emaSlow",
  "shortSkip",
  "volumeLookback",
  "volumeThreshold",
  "vproBand",
  "vproSignal",
] as const satisfies readonly (keyof Config)[];

/**
 * Stable identity of a config. The published signal rule is omitted so a
 * baseline config hashes the same way it did before that knob existed.
 */
export function configHash(config: Config): string {
  const body: Record<string, number | string | null> = {};
  for (const key of KEYS) body[key] = config[key];
  const rule = config.signalRule ?? "agree";
  if (rule !== "agree") body.signalRule = rule;
  const directionTf = config.directionTf ?? "15m";
  if (directionTf !== "15m") body.directionTf = directionTf;
  return createHash("sha256").update(JSON.stringify(body)).digest("hex");
}

export function shortHash(hash: string): string {
  return hash.slice(0, 12);
}

export function seriesHash(series: Series): string {
  const lines: string[] = [];
  for (const symbol of SYMBOLS) {
    for (const bar of series[symbol]) {
      lines.push(
        [symbol, bar.t, bar.open, bar.high, bar.low, bar.close, bar.volume].join(","),
      );
    }
  }
  return createHash("sha256").update(lines.join("\n")).digest("hex");
}

export function barCount(series: Series): number {
  return series["BTC/USD" satisfies SymbolName].length;
}
