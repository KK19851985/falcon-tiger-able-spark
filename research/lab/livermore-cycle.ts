/**
 * One Livermore comparison against the V-Pro baseline on one tape.
 * Does not edit the desk and writes candidate.json only when the skeptic accepts.
 *
 * node --experimental-strip-types research/lab/livermore-cycle.ts --timeframe=1d
 * node --experimental-strip-types research/lab/livermore-cycle.ts --timeframe=15m
 * node --experimental-strip-types research/lab/livermore-cycle.ts --timeframe=15m --direction=4h
 * node --experimental-strip-types research/lab/livermore-cycle.ts --timeframe=15m --set=volMultiplier=2
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { BASELINE, FIFTEEN_DATA_HASH, PINNED_DATA_HASH, SEED, START_EQUITY } from "./constants.ts";
import { describeConfig, usd } from "./format.ts";
import { loadFifteen, loadMarket } from "./market.ts";
import { plansFor, runLivermore } from "./livermore-book.ts";
import { REPO_ROOT, isOutputPath } from "./paths.ts";
import { configHash } from "./hash.ts";
import { appendCycle, consoleSummary, readLedger } from "./recorder.ts";
import { judge } from "./skeptic.ts";
import { blockBootstrapProfit, buyAndHold, moments, regimeBreakdown } from "./stats.ts";
import { LIVE_COSTS, foldBounds, scoreConfig, splits } from "./tester.ts";
import { rowTimeframe, SYMBOLS, type LedgerRow, type Series, type SideMetrics, type SymbolName, type Timeframe, type WindowMetrics } from "./types.ts";
import {
  closedHigherEmaDirection,
  LIVERMORE_SETTINGS,
  type LivermoreSettings,
  type LivermoreSignal,
} from "../../src/lib/desk/livermore.ts";

type Spec = LivermoreSettings & { direction: "same" | "4h" };

function parseSpec(argv: string[]): { timeframe: Timeframe; spec: Spec } {
  const timeframe: Timeframe = argv.includes("--timeframe=15m") ? "15m" : "1d";
  const spec: Spec = { ...LIVERMORE_SETTINGS, direction: argv.includes("--direction=4h") ? "4h" : "same" };
  const set = argv.find((arg) => arg.startsWith("--set="));
  if (set) {
    const body = set.slice("--set=".length);
    const eq = body.indexOf("=");
    const key = body.slice(0, eq) as keyof LivermoreSettings;
    const value = Number(body.slice(eq + 1));
    if (!(key in LIVERMORE_SETTINGS) || !Number.isFinite(value)) throw new Error(`Bad Livermore setting ${set}`);
    spec[key] = value as never;
  }
  if (spec.direction === "4h" && timeframe !== "15m") throw new Error("4h direction is only defined on the 15-minute tape.");
  return { timeframe, spec };
}

function settingsHash(spec: Spec): string {
  return createHash("sha256").update(JSON.stringify(spec)).digest("hex");
}

function pace(timeframe: Timeframe) {
  return timeframe === "15m"
    ? { barsPerYear: 365 * 96, block: 96 * 10, regimeLookback: 96 * 20 }
    : { barsPerYear: 365, block: 10, regimeLookback: 20 };
}

function windowFromRun(
  series: Series,
  plans: Record<SymbolName, LivermoreSignal[]>,
  from: number,
  to: number,
  timeframe: Timeframe,
): WindowMetrics {
  const run = runLivermore(series, plans, from, to, LIVE_COSTS);
  const speed = pace(timeframe);
  const shape = moments(run.dailyReturns);
  const band = blockBootstrapProfit(run.dailyReturns, START_EQUITY, SEED, 2000, speed.block);
  const gains = run.fills.filter((fill) => fill.pnl > 0).reduce((acc, fill) => acc + fill.pnl, 0);
  const pains = Math.abs(run.fills.filter((fill) => fill.pnl < 0).reduce((acc, fill) => acc + fill.pnl, 0));
  const wins = run.fills.filter((fill) => fill.pnl > 0).length;
  const perCoin = {
    "BTC/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
    "ETH/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
    "SOL/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
  };
  for (const fill of run.fills) {
    perCoin[fill.symbol].trades += 1;
    perCoin[fill.symbol].pnl += fill.pnl;
    if (fill.pnl > 0) perCoin[fill.symbol].wins += 1;
  }
  for (const symbol of SYMBOLS) {
    perCoin[symbol].isolatedProfit = runLivermore(series, { [symbol]: plans[symbol] }, from, to, LIVE_COSTS).profit;
  }
  const end = Math.min(to, series["BTC/USD"].length - 1);
  return {
    profit: run.profit,
    endEquity: run.endEquity,
    trades: run.fills.length,
    wins,
    losses: run.fills.length - wins,
    winRate: run.fills.length ? wins / run.fills.length : 0,
    maxDd: run.maxDd,
    sharpeDaily: shape.sharpe,
    sharpeAnnual: shape.sharpe * Math.sqrt(speed.barsPerYear),
    profitFactor: pains === 0 ? null : gains / pains,
    meanTradeRet: run.fills.length ? run.fills.reduce((acc, fill) => acc + fill.ret, 0) / run.fills.length : 0,
    skew: shape.skew,
    kurtosis: shape.kurtosis,
    observations: run.dailyReturns.length,
    buyHold: buyAndHold(
      SYMBOLS.map((symbol) => series[symbol].map((bar) => bar.close)),
      from,
      end,
    ),
    bootstrapLow: band.low,
    bootstrapHigh: band.high,
    perCoin,
    regimes: regimeBreakdown(series["BTC/USD"], run.fills, speed.regimeLookback),
  };
}

function scoreSpec(series: Series, spec: Spec, timeframe: Timeframe, anchors?: { trainStart: number; holdoutStart: number }): SideMetrics {
  const directionFor = spec.direction === "4h" ? (bars: Series[SymbolName]) => closedHigherEmaDirection(bars, "4h", spec.maPeriod) : undefined;
  const plans = plansFor(series, spec, directionFor);
  const split = splits(series, anchors);
  const train = windowFromRun(series, plans, split.trainFrom, split.trainTo, timeframe);
  const holdout = windowFromRun(series, plans, split.holdoutFrom, split.holdoutTo, timeframe);
  const full = runLivermore(series, plans, split.trainFrom, split.holdoutTo, LIVE_COSTS);
  const fullTrades = { "BTC/USD": 0, "ETH/USD": 0, "SOL/USD": 0 };
  for (const fill of full.fills) fullTrades[fill.symbol] += 1;
  const days = series["BTC/USD"];
  const folds = foldBounds(split.trainFrom, split.trainTo).map((bound) => {
    const run = runLivermore(series, plans, bound.from, bound.to, LIVE_COSTS);
    const end = Math.min(bound.to, days.length - 1);
    return {
      from: new Date(days[bound.from]!.t).toISOString().slice(0, 10),
      to: new Date(days[end]!.t).toISOString().slice(0, 10),
      profit: run.profit,
      trades: run.fills.length,
      maxDd: run.maxDd,
    };
  });
  return { train, holdout, fullTrades, folds };
}

function neighborSpecs(spec: Spec): { label: string; spec: Spec }[] {
  return [
    { label: "volMultiplier 1.5 → 1", spec: { ...spec, volMultiplier: 1 } },
    { label: "volMultiplier 1.5 → 2", spec: { ...spec, volMultiplier: 2 } },
    { label: "pivotLookback 20 → 10", spec: { ...spec, pivotLookback: 10 } },
    { label: "pivotLookback 20 → 40", spec: { ...spec, pivotLookback: 40 } },
    { label: "maPeriod 50 → 35", spec: { ...spec, maPeriod: 35 } },
    { label: "maPeriod 50 → 65", spec: { ...spec, maPeriod: 65 } },
    { label: "confirmBars 1 → 2", spec: { ...spec, confirmBars: 2 } },
  ];
}

function holdoutOnly(series: Series, spec: Spec, anchors?: { trainStart: number; holdoutStart: number }): number {
  const directionFor = spec.direction === "4h" ? (bars: Series[SymbolName]) => closedHigherEmaDirection(bars, "4h", spec.maPeriod) : undefined;
  const plans = plansFor(series, spec, directionFor);
  const split = splits(series, anchors);
  return runLivermore(series, plans, split.holdoutFrom, split.holdoutTo, LIVE_COSTS).profit;
}

function labelFor(spec: Spec, timeframe: Timeframe): string {
  const where = spec.direction === "4h" ? "4h EMA direction" : `${timeframe} EMA direction`;
  const tweaks = [
    spec.volMultiplier !== LIVERMORE_SETTINGS.volMultiplier ? `volume ${spec.volMultiplier}×` : "",
    spec.pivotLookback !== LIVERMORE_SETTINGS.pivotLookback ? `pivot ${spec.pivotLookback}` : "",
    spec.maPeriod !== LIVERMORE_SETTINGS.maPeriod ? `EMA ${spec.maPeriod}` : "",
    spec.confirmBars !== LIVERMORE_SETTINGS.confirmBars ? `confirm ${spec.confirmBars}` : "",
  ].filter(Boolean);
  const tail = tweaks.length ? `, ${tweaks.join(", ")}` : "";
  return `Livermore 3-step, ${where}${tail}`;
}

async function main() {
  const { timeframe, spec } = parseSpec(process.argv.slice(2));
  const commit = codeCommit();
  const loaded = timeframe === "15m" ? await loadFifteen() : await loadMarket({ cacheOnly: true });
  const expected = timeframe === "15m" ? FIFTEEN_DATA_HASH : PINNED_DATA_HASH;
  if (loaded.manifest.hash !== expected) {
    throw new Error(`Tape hash ${loaded.manifest.hash} does not match ${expected}`);
  }
  const anchors =
    loaded.manifest.trainStart && loaded.manifest.holdoutStart
      ? { trainStart: Date.parse(loaded.manifest.trainStart), holdoutStart: Date.parse(loaded.manifest.holdoutStart) }
      : undefined;
  console.log(`[tester] ${loaded.reasoning.join(" ")}`);
  console.log(`[tester] Livermore versus ${describeConfig(BASELINE)} on the ${timeframe} tape.`);
  const champion = scoreConfig(loaded.series, BASELINE, { timeframe, anchors, seed: SEED, log: console.log });
  const challenger = scoreSpec(loaded.series, spec, timeframe, anchors);
  const neighbors = neighborSpecs(spec).map((item) => ({
    label: item.label,
    hash: settingsHash(item.spec),
    holdoutProfit: holdoutOnly(loaded.series, item.spec, anchors),
  }));
  const prior = readLedger()
    .filter((row) => rowTimeframe(row) === timeframe && row.experiment && row.metrics)
    .map((row) => row.metrics!.challenger.holdout.sharpeDaily);
  const judgment = judge(
    { champion, challenger, neighbors, priorHoldoutSharpes: prior },
    console.log,
  );
  const ledger = readLedger();
  const row: LedgerRow = {
    cycle: ledger.length + 1,
    at: new Date().toISOString(),
    commit,
    seed: SEED,
    timeframe,
    strategy: "livermore",
    livermore: {
      maPeriod: spec.maPeriod,
      pivotLookback: spec.pivotLookback,
      volLookback: spec.volLookback,
      volMultiplier: spec.volMultiplier,
      confirmBars: spec.confirmBars,
      direction: spec.direction,
    },
    data: loaded.manifest,
    champion: { config: BASELINE, hash: configHash(BASELINE), label: describeConfig(BASELINE) },
    experiment: {
      config: BASELINE,
      hash: settingsHash(spec),
      knob: "directionTf",
      direction: "up",
      from: "vpro",
      to: spec.direction === "4h" ? "4h" : timeframe,
      label: labelFor(spec, timeframe),
      reasoning: [
        "Livermore order: direction, then the pivotal level, then volume.",
        `EMA ${spec.maPeriod} ${spec.direction === "4h" ? "on closed 4-hour bars" : "on the traded timeframe"}. Long only above a rising average, short only below a falling average.`,
        `Pivot is the prior ${spec.pivotLookback} bars, excluding the current bar. Breakout volume must be at least ${spec.volMultiplier}× the prior ${spec.volLookback}-bar average.`,
        `The breakout bar does not enter. The next ${spec.confirmBars} close(s) must still be beyond the level. Fill is the following open.`,
        "Stop is the broken pivotal level. The trade also exits when the close comes back through the EMA.",
        "One position per coin. Compared with V-Pro 34/9 plus EMA 20/30 on this same tape. The skeptic is unchanged.",
        "A higher bar is used only after it has closed.",
      ],
    },
    metrics: { champion, challenger },
    neighbors: neighbors.map((item) => ({
      ...item,
      beatsChampion: item.holdoutProfit > champion.holdout.profit,
    })),
    verdict: judgment.verdict,
    reason: `${judgment.reason} Holdout buy-and-hold was ${usd(champion.holdout.buyHold)}.`,
    gates: judgment.gates,
    trialsCounted: judgment.trialsCounted,
    deflated: judgment.deflated,
  };
  appendCycle(row);
  console.log("");
  console.log(consoleSummary(row));
  console.log(`Holdout buy-and-hold  ${usd(champion.holdout.buyHold)}`);
}

function codeCommit(): string {
  const hash = execSync("git rev-parse HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  const status = execSync("git status --porcelain --untracked-files=all", { cwd: REPO_ROOT, encoding: "utf8" });
  const dirty = status
    .split("\n")
    .map((line) => line.trimEnd())
    .filter(Boolean)
    .filter((line) => !isOutputPath(line.slice(3).trim()));
  return dirty.length ? `${hash}+dirty` : hash;
}

main().catch((error: unknown) => {
  console.error("[lab]", error instanceof Error ? error.stack : error);
  process.exit(1);
});
