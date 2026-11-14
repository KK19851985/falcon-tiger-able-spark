import type { Config, Knob } from "./types.ts";

/** Published desk rule. The lab may crown a research champion; it never writes this back. */
export const BASELINE: Config = {
  vproBand: 34,
  vproSignal: 9,
  emaFast: 20,
  emaSlow: 30,
  shortSkip: 20,
  volumeLookback: 20,
  volumeThreshold: null,
  signalRule: "agree",
};

export const GRIDS: { [K in Knob]: readonly (Config[K])[] } = {
  vproBand: [21, 26, 30, 34, 40, 50],
  vproSignal: [5, 7, 9, 12, 15, 20],
  emaFast: [8, 12, 15, 20, 25],
  emaSlow: [25, 30, 40, 50, 60],
  shortSkip: [null, 10, 15, 20, 30, 50],
  volumeLookback: [10, 20, 30, 50],
  volumeThreshold: [null, 0.8, 1, 1.2, 1.5, 2],
  signalRule: ["agree", "either", "window3"],
};

/** Untouched knobs are probed in this order, one adjacent step up first. */
export const KNOB_ORDER: readonly Knob[] = [
  "vproBand",
  "vproSignal",
  "emaFast",
  "emaSlow",
  "shortSkip",
  "volumeThreshold",
  "volumeLookback",
  "signalRule",
];

/** Knobs the 15-minute search is allowed to touch. Signal-rule experiments stay on the daily track. */
export const FIFTEEN_KNOBS: readonly Knob[] = [
  "vproBand",
  "vproSignal",
  "emaFast",
  "emaSlow",
  "volumeThreshold",
  "volumeLookback",
];

export const KNOB_LABEL: Record<Knob, string> = {
  vproBand: "V-Pro band",
  vproSignal: "V-Pro signal",
  emaFast: "EMA fast",
  emaSlow: "EMA slow",
  shortSkip: "short-skip line",
  volumeThreshold: "volume threshold",
  volumeLookback: "volume lookback",
  signalRule: "signal rule",
};

/** Tape used by the first cycles. Directed cycles must keep this hash. */
export const PINNED_DATA_HASH =
  "ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc";

/**
 * First signal bar and first holdout signal bar on the bundled daily tape.
 * These match fund.ts: index 80 is 2025-02-06 and index 464 is 2026-02-25.
 * Extra bars lengthen the holdout only. The dates do not move.
 */
export const TRAIN_START = "2025-02-06";
export const HOLDOUT_START = "2026-02-25";

export const START_EQUITY = 10_000;

/** 0.1% taker, charged on the entry and the exit. */
export const TAKER_FEE = 0.001;

/** 5 basis points of adverse slippage on the entry and the exit. */
export const SLIPPAGE = 0.0005;

export const SEED = 20261114;

export const BOOTSTRAP_REPS = 2000;
export const BOOTSTRAP_BLOCK = 10;

export const WALK_FOLDS = 4;
export const WALK_SEED_FRACTION = 0.5;

export const MIN_TRADES_PER_COIN = 30;

/** BTC 20-day return above this is bull, below the negative is bear, otherwise sideways. */
export const REGIME_LOOKBACK = 20;
export const REGIME_BAND = 0.05;

/**
 * One-sided normal critical value used as a fixed bar for the deflated Sharpe
 * statistic. It is not reported as a probability or a confidence.
 */
export const SHARPE_CRITICAL_Z = 1.6448536269514722;

export const EULER = 0.5772156649015329;
