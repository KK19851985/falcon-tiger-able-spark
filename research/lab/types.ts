/** Shared types for one research cycle. The desk never imports this module. */

export const SYMBOLS = ["BTC/USD", "ETH/USD", "SOL/USD"] as const;

export type SymbolName = (typeof SYMBOLS)[number];

export type Side = "LONG" | "SHORT";

export type Stance = Side | "FLAT";

export type Bar = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type Series = Record<SymbolName, Bar[]>;

export type SignalRule = "agree" | "either" | "window3";

/** Where the EMA 20/30 direction is read. `15m` is the published same-chart rule. */
export type DirectionTf = "15m" | "1h" | "4h" | "1d";

export type Knob =
  | "vproBand"
  | "vproSignal"
  | "emaFast"
  | "emaSlow"
  | "shortSkip"
  | "volumeThreshold"
  | "volumeLookback"
  | "signalRule"
  | "directionTf";

export type Direction = "up" | "down";

/** One published point in the search grid. `null` means that rule is off. */
export type Config = {
  vproBand: number;
  vproSignal: number;
  emaFast: number;
  emaSlow: number;
  /** Skip (and therefore close) shorts while the close is above this EMA. `null` turns the skip off. */
  shortSkip: number | null;
  volumeLookback: number;
  /** Long/short volume confirmation when volume / N-bar average is at least this. `null` turns it off. */
  volumeThreshold: number | null;
  /**
   * How the two price triggers combine. `agree` is the published rule.
   * Omitted on older ledger rows, which means `agree`.
   */
  signalRule: SignalRule;
  /**
   * Chart that supplies EMA direction. `15m` keeps the published same-chart
   * agreement. Older ledger rows omit this, which means `15m`.
   */
  directionTf: DirectionTf;
};

export type Verdict = "ACCEPT" | "REJECT" | "INSUFFICIENT" | "EXHAUSTED";

export type Gate = {
  name: string;
  pass: boolean;
  detail: string;
};

export type RegimeName = "bull" | "bear" | "sideways";

export type RegimeStat = {
  trades: number;
  wins: number;
  pnl: number;
  meanRet: number;
};

export type CoinStat = {
  trades: number;
  wins: number;
  /** Dollars attributed inside the shared three-coin book. */
  pnl: number;
  /** Profit of this coin traded alone on $10,000. */
  isolatedProfit: number;
};

export type WindowMetrics = {
  profit: number;
  endEquity: number;
  trades: number;
  wins: number;
  losses: number;
  winRate: number;
  maxDd: number;
  /** Mean daily return / sample standard deviation. Not annualized. */
  sharpeDaily: number;
  /** `sharpeDaily * sqrt(365)`. */
  sharpeAnnual: number;
  profitFactor: number | null;
  meanTradeRet: number;
  skew: number;
  /** Pearson kurtosis (3 is normal), not excess kurtosis. */
  kurtosis: number;
  observations: number;
  buyHold: number;
  bootstrapLow: number;
  bootstrapHigh: number;
  perCoin: Record<SymbolName, CoinStat>;
  regimes: Record<RegimeName, RegimeStat>;
};

export type FoldScore = {
  from: string;
  to: string;
  profit: number;
  trades: number;
  maxDd: number;
};

export type SideMetrics = {
  train: WindowMetrics;
  holdout: WindowMetrics;
  /** Closed trades on one continuous run from the first train signal through the last bar. */
  fullTrades: Record<SymbolName, number>;
  folds: FoldScore[];
};

export type Timeframe = "1d" | "15m";

export type DataManifest = {
  source: string;
  binance: string;
  hash: string;
  bars: number;
  start: string;
  end: string;
  timeframe?: Timeframe;
  /** Exact bar open time where 15-minute training signals start. Daily uses the fixed calendar split. */
  trainStart?: string;
  holdoutStart?: string;
  partialReplaced: string[];
  appended: string[];
  overlapMedianAbsPct: Partial<Record<SymbolName, number>>;
  volumeScale: Partial<Record<SymbolName, number>>;
};

export type ExperimentRecord = {
  config: Config;
  hash: string;
  knob: Knob;
  direction: Direction;
  from: number | string | null;
  to: number | string | null;
  label: string;
  reasoning: string[];
};

export type NeighborScore = {
  label: string;
  hash: string;
  holdoutProfit: number;
  beatsChampion: boolean;
};

export type DeflatedRecord = {
  sharpe: number;
  hurdle: number;
  /** (sharpe - hurdle) / standard error. A test statistic, not a probability. */
  z: number;
  clears: boolean;
  trials: number;
  variance: number;
};

export function rowTimeframe(row: { timeframe?: Timeframe }): Timeframe {
  return row.timeframe ?? "1d";
}

export type LedgerRow = {
  cycle: number;
  at: string;
  commit: string;
  seed: number;
  timeframe?: Timeframe;
  /** Omitted rows are the V-Pro search. Livermore rows are scored against that search, not mixed into it. */
  strategy?: "vpro" | "livermore";
  livermore?: {
    maPeriod: number;
    pivotLookback: number;
    volLookback: number;
    volMultiplier: number;
    confirmBars: number;
    direction: "same" | "4h";
  };
  data: DataManifest | null;
  champion: { config: Config; hash: string; label: string };
  experiment: ExperimentRecord | null;
  metrics: { champion: SideMetrics; challenger: SideMetrics } | null;
  neighbors: NeighborScore[];
  verdict: Verdict;
  reason: string;
  gates: Gate[];
  trialsCounted: number;
  deflated: DeflatedRecord | null;
};

/** The slice of a ledger row the proposer is allowed to learn from. */
export type ProposerView = {
  verdict: Verdict;
  experiment: {
    knob: Knob;
    direction: Direction;
    hash: string;
    config: Config;
  } | null;
  holdoutProfit: { champion: number; challenger: number } | null;
};

export type Logger = (line: string) => void;
