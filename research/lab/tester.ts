import {
  BOOTSTRAP_BLOCK,
  BOOTSTRAP_REPS,
  HOLDOUT_START,
  SEED,
  SLIPPAGE,
  START_EQUITY,
  TAKER_FEE,
  TRAIN_START,
  WALK_FOLDS,
  WALK_SEED_FRACTION,
} from "./constants.ts";
import { ZERO_COSTS, runBook, type CostModel } from "./execute.ts";
import { describeConfig } from "./format.ts";
import { stanceFor } from "./strategy.ts";
import { blockBootstrapProfit, buyAndHold, moments, regimeBreakdown } from "./stats.ts";
import {
  SYMBOLS,
  type Config,
  type FoldScore,
  type Logger,
  type Series,
  type SideMetrics,
  type SymbolName,
  type WindowMetrics,
} from "./types.ts";

export type Split = {
  trainFrom: number;
  trainTo: number;
  holdoutFrom: number;
  holdoutTo: number;
};

export type EvalOptions = {
  costs?: CostModel;
  seed?: number;
  bootstrapReps?: number;
  log?: Logger;
};

export const LIVE_COSTS: CostModel = { fee: TAKER_FEE, slippage: SLIPPAGE };

/**
 * Fixed split. Train signals start on 2025-02-06 and stop before the bar that
 * precedes 2026-02-25, which is how fund.ts separates the fit from the check.
 * Bars appended after the bundle extend `holdoutTo` only.
 */
export function splits(series: Series): Split {
  const bars = series["BTC/USD"];
  const trainFrom = indexOfDay(bars, TRAIN_START);
  const holdoutFrom = indexOfDay(bars, HOLDOUT_START);
  return {
    trainFrom,
    trainTo: holdoutFrom - 1,
    holdoutFrom,
    holdoutTo: bars.length - 1,
  };
}

export function foldBounds(trainFrom: number, trainTo: number, folds = WALK_FOLDS, seedFraction = WALK_SEED_FRACTION) {
  const span = trainTo - trainFrom;
  if (span < folds + 1) throw new Error("train window is too short for walk-forward folds");
  const seed = Math.max(1, Math.floor(span * seedFraction));
  const remain = span - seed;
  const base = Math.floor(remain / folds);
  if (base < 1) throw new Error("walk-forward fold would be empty");
  const bounds: { from: number; to: number }[] = [];
  let cursor = trainFrom + seed;
  for (let fold = 0; fold < folds; fold++) {
    const to = fold === folds - 1 ? trainTo : cursor + base;
    bounds.push({ from: cursor, to });
    cursor = to;
  }
  return bounds;
}

export function scoreConfig(series: Series, config: Config, options: EvalOptions = {}): SideMetrics {
  const costs = options.costs ?? LIVE_COSTS;
  const seed = options.seed ?? SEED;
  const reps = options.bootstrapReps ?? BOOTSTRAP_REPS;
  const split = splits(series);
  const stances = Object.fromEntries(SYMBOLS.map((symbol) => [symbol, stanceFor(series[symbol], config)])) as Record<
    SymbolName,
    ReturnType<typeof stanceFor>
  >;
  const train = windowMetrics(series, stances, split.trainFrom, split.trainTo, costs, seed, reps);
  const holdout = windowMetrics(series, stances, split.holdoutFrom, split.holdoutTo, costs, seed, reps);
  const full = runBook(series, stances, split.trainFrom, split.holdoutTo, costs);
  const fullTrades = emptyCoins();
  for (const fill of full.fills) fullTrades[fill.symbol] += 1;
  const days = series["BTC/USD"];
  const folds: FoldScore[] = foldBounds(split.trainFrom, split.trainTo).map((bound) => {
    const run = runBook(series, stances, bound.from, bound.to, costs);
    const end = Math.min(bound.to, days.length - 1);
    return {
      from: day(days[bound.from]!.t),
      to: day(days[end]!.t),
      profit: run.profit,
      trades: run.fills.length,
      maxDd: run.maxDd,
    };
  });
  return { train, holdout, fullTrades, folds };
}

export function holdoutProfit(series: Series, config: Config, costs: CostModel = LIVE_COSTS): number {
  const split = splits(series);
  const stances = Object.fromEntries(SYMBOLS.map((symbol) => [symbol, stanceFor(series[symbol], config)])) as Record<
    SymbolName,
    ReturnType<typeof stanceFor>
  >;
  return runBook(series, stances, split.holdoutFrom, split.holdoutTo, costs).profit;
}

export function evaluatePair(series: Series, champion: Config, challenger: Config, options: EvalOptions = {}) {
  const costs = options.costs ?? LIVE_COSTS;
  const split = splits(series);
  const days = series["BTC/USD"];
  const say = (line: string) => options.log?.(`[tester] ${line}`);
  say(
    `Costs are a ${(costs.fee * 100).toFixed(2)}% taker fee and ${(costs.slippage * 10000).toFixed(1)} bps of slippage, both charged on the entry and the exit.`,
  );
  say(
    `Train signals ${day(days[split.trainFrom]!.t)} through the bar before ${day(days[split.trainTo]!.t)}. Holdout signals start ${day(days[split.holdoutFrom]!.t)} and the book is marked through ${day(days[days.length - 1]!.t)}.`,
  );
  say("Fills use the next bar's open. One position per coin. A flat or opposite stance closes that coin and does not reopen it on the same bar.");
  say(`Champion: ${describeConfig(champion)}.`);
  const championScore = scoreConfig(series, champion, options);
  say(`Challenger: ${describeConfig(challenger)}.`);
  const challengerScore = scoreConfig(series, challenger, options);
  say(
    `Combined train profit ${championScore.train.profit.toFixed(2)} → ${challengerScore.train.profit.toFixed(2)}. Combined holdout profit ${championScore.holdout.profit.toFixed(2)} → ${challengerScore.holdout.profit.toFixed(2)}.`,
  );
  say(
    `Holdout buy-and-hold on the same dates, no costs, equal weight: ${championScore.holdout.buyHold.toFixed(2)} dollars on $10,000.`,
  );
  say(
    `Full-sample trades, champion then challenger: ${SYMBOLS.map((symbol) => `${symbol} ${championScore.fullTrades[symbol]}/${challengerScore.fullTrades[symbol]}`).join(", ")}.`,
  );
  return { champion: championScore, challenger: challengerScore, split };
}

/** Zero-cost score used to check the engine against the desk's own book. */
export function scoreUncosted(series: Series, config: Config): SideMetrics {
  return scoreConfig(series, config, { costs: ZERO_COSTS, bootstrapReps: 50, seed: SEED });
}

function windowMetrics(
  series: Series,
  stances: Record<SymbolName, ReturnType<typeof stanceFor>>,
  from: number,
  to: number,
  costs: CostModel,
  seed: number,
  reps: number,
): WindowMetrics {
  const run = runBook(series, stances, from, to, costs);
  const shape = moments(run.dailyReturns);
  const band = blockBootstrapProfit(run.dailyReturns, START_EQUITY, seed, reps, BOOTSTRAP_BLOCK);
  const gains = run.fills.filter((fill) => fill.pnl > 0).reduce((acc, fill) => acc + fill.pnl, 0);
  const pains = Math.abs(run.fills.filter((fill) => fill.pnl < 0).reduce((acc, fill) => acc + fill.pnl, 0));
  const perCoin = emptyCoinStats();
  for (const fill of run.fills) {
    const coin = perCoin[fill.symbol];
    coin.trades += 1;
    coin.pnl += fill.pnl;
    if (fill.pnl > 0) coin.wins += 1;
  }
  for (const symbol of SYMBOLS) {
    if (!stances[symbol]) continue;
    const alone = runBook(
      { ...series, [symbol]: series[symbol] } as Series,
      { [symbol]: stances[symbol] },
      from,
      to,
      costs,
    );
    perCoin[symbol].isolatedProfit = alone.profit;
  }
  const end = Math.min(to, series["BTC/USD"].length - 1);
  const wins = run.fills.filter((fill) => fill.pnl > 0).length;
  return {
    profit: run.profit,
    endEquity: run.endEquity,
    trades: run.fills.length,
    wins,
    losses: run.fills.length - wins,
    winRate: run.fills.length ? wins / run.fills.length : 0,
    maxDd: run.maxDd,
    sharpeDaily: shape.sharpe,
    sharpeAnnual: shape.sharpe * Math.sqrt(365),
    profitFactor: pains === 0 ? null : gains / pains,
    meanTradeRet: run.fills.length ? run.fills.reduce((acc, fill) => acc + fill.ret, 0) / run.fills.length : 0,
    skew: shape.skew,
    kurtosis: shape.kurtosis,
    observations: run.dailyReturns.length,
    buyHold: buyAndHold(
      SYMBOLS.filter((symbol) => stances[symbol]).map((symbol) => series[symbol].map((bar) => bar.close)),
      from,
      end,
    ),
    bootstrapLow: band.low,
    bootstrapHigh: band.high,
    perCoin,
    regimes: regimeBreakdown(series["BTC/USD"], run.fills),
  };
}

function emptyCoins(): Record<SymbolName, number> {
  return { "BTC/USD": 0, "ETH/USD": 0, "SOL/USD": 0 };
}

function emptyCoinStats(): WindowMetrics["perCoin"] {
  return {
    "BTC/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
    "ETH/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
    "SOL/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
  };
}

function indexOfDay(bars: { t: number }[], iso: string): number {
  const stamp = Date.parse(`${iso}T00:00:00Z`);
  const index = bars.findIndex((bar) => bar.t === stamp);
  if (index < 0) throw new Error(`daily tape has no bar on ${iso}`);
  return index;
}

function day(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}
