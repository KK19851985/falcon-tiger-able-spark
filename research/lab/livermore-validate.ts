/**
 * Long-tape check of the Livermore 15-minute rule with 4-hour EMA 50 direction.
 * Does not edit the desk. Writes candidate.json only if the skeptic accepts.
 *
 * node --experimental-strip-types research/lab/livermore-validate.ts
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import { BASELINE, SEED, START_EQUITY } from "./constants.ts";
import { describeConfig, pct, usd } from "./format.ts";
import { seriesHash } from "./hash.ts";
import { configHash } from "./hash.ts";
import { gapReport } from "./gaps.ts";
import { luckControl } from "./luck.ts";
import { plansFor, runLivermore } from "./livermore-book.ts";
import { PATHS, REPO_ROOT, isOutputPath } from "./paths.ts";
import { appendCycle, readLedger } from "./recorder.ts";
import { judge } from "./skeptic.ts";
import { blockBootstrapProfit, buyAndHold, moments, regimeBreakdown } from "./stats.ts";
import { runBook } from "./execute.ts";
import { stanceFor } from "./strategy.ts";
import { LIVE_COSTS, foldBounds, scoreConfig, splits } from "./tester.ts";
import {
  rowTimeframe,
  SYMBOLS,
  type LedgerRow,
  type LongTapeStudy,
  type Series,
  type SideMetrics,
  type SymbolName,
  type WindowMetrics,
} from "./types.ts";
import {
  closedHigherEmaDirection,
  LIVERMORE_SETTINGS,
  type LivermoreSettings,
  type LivermoreSignal,
} from "../../src/lib/desk/livermore.ts";

type Spec = LivermoreSettings & { direction: "4h" };

type Audit = {
  bars: number;
  duplicates: number;
  missing: number;
  start: number | null;
  end: number | null;
};

type LongFile = {
  source: string;
  fallback?: string;
  fetchedAt: string;
  trainStart: number;
  holdoutStart: number;
  hash: string;
  coins: Record<string, Audit & { instId?: string; host?: string }>;
  aligned: Audit;
  symbols: Record<SymbolName, number[][]>;
};

const LONG_FILE = path.join(path.dirname(PATHS.cache), "okx-15m-long.json");
const STRESS = { fee: 0.002, slippage: 0.001 };
const LUCK_REPS = 1000;
const YEAR_MIN_BARS = 96 * 20;
const REGIME_LOOKBACK = 96 * 20;

const CANDIDATE: Spec = { ...LIVERMORE_SETTINGS, direction: "4h" };
const VARIANT: Spec = { ...CANDIDATE, volMultiplier: 2 };

function settingsHash(spec: Spec): string {
  return createHash("sha256").update(JSON.stringify(spec)).digest("hex");
}

function loadLong(): { series: Series; file: LongFile } {
  const file = JSON.parse(readFileSync(LONG_FILE, "utf8")) as LongFile;
  const series = {} as Series;
  for (const symbol of SYMBOLS) {
    const rows = file.symbols[symbol];
    if (!rows?.length) throw new Error(`Long tape is missing ${symbol}`);
    series[symbol] = rows.map((row) => ({
      t: row[0]!,
      open: row[1]!,
      high: row[2]!,
      low: row[3]!,
      close: row[4]!,
      volume: row[5]!,
    }));
  }
  const hash = seriesHash(series);
  if (hash !== file.hash) throw new Error("Long 15-minute file does not match its stored hash.");
  const joined = gapReport(series["BTC/USD"].map((bar) => bar.t));
  if (joined.bars !== file.aligned.bars || joined.missing !== file.aligned.missing || joined.duplicates !== file.aligned.duplicates) {
    throw new Error(
      `Joined tape audit does not match the file (bars ${joined.bars}/${file.aligned.bars}, missing ${joined.missing}/${file.aligned.missing}, duplicates ${joined.duplicates}/${file.aligned.duplicates}).`,
    );
  }
  for (const symbol of SYMBOLS) {
    const bars = series[symbol];
    for (let i = 1; i < bars.length; i++) {
      if (bars[i]!.t <= bars[i - 1]!.t) throw new Error(`${symbol} is not strictly increasing at ${i}`);
    }
  }
  return { series, file };
}

function pace() {
  return { barsPerYear: 365 * 96, block: 96 * 10, regimeLookback: REGIME_LOOKBACK };
}

function windowFromRun(
  series: Series,
  plans: Record<SymbolName, LivermoreSignal[]>,
  from: number,
  to: number,
  costs = LIVE_COSTS,
): WindowMetrics {
  const run = runLivermore(series, plans, from, to, costs);
  const speed = pace();
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
    perCoin[symbol].isolatedProfit = runLivermore(series, { [symbol]: plans[symbol] }, from, to, costs).profit;
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

function scoreSpec(series: Series, spec: Spec, anchors: { trainStart: number; holdoutStart: number }): SideMetrics {
  const plans = plansFor(series, spec, (bars) => closedHigherEmaDirection(bars, "4h", spec.maPeriod));
  const split = splits(series, anchors);
  const train = windowFromRun(series, plans, split.trainFrom, split.trainTo);
  const holdout = windowFromRun(series, plans, split.holdoutFrom, split.holdoutTo);
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

function holdoutProfit(series: Series, spec: Spec, anchors: { trainStart: number; holdoutStart: number }): number {
  const plans = plansFor(series, spec, (bars) => closedHigherEmaDirection(bars, "4h", spec.maPeriod));
  const split = splits(series, anchors);
  return runLivermore(series, plans, split.holdoutFrom, split.holdoutTo, LIVE_COSTS).profit;
}

function neighbourList(base: Spec) {
  return [
    { label: "pivot 20 → 15", spec: { ...base, pivotLookback: 15 } },
    { label: "pivot 20 → 25", spec: { ...base, pivotLookback: 25 } },
    { label: "EMA 50 → 40", spec: { ...base, maPeriod: 40 } },
    { label: "EMA 50 → 60", spec: { ...base, maPeriod: 60 } },
    { label: "volume 1.5× → 1.25×", spec: { ...base, volMultiplier: 1.25 } },
    { label: "volume 1.5× → 1.75×", spec: { ...base, volMultiplier: 1.75 } },
  ];
}

function stamp(value: number | null): string | null {
  return value == null ? null : new Date(value).toISOString();
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

function priorSharpes(): number[] {
  return readLedger()
    .filter((row) => rowTimeframe(row) === "15m" && row.experiment && row.metrics)
    .map((row) => row.metrics!.challenger.holdout.sharpeDaily);
}

function manifest(file: LongFile, series: Series) {
  const btc = series["BTC/USD"];
  return {
    source: `${file.source} (long tape, fetched ${file.fetchedAt})`,
    binance: "HTTP 451, not used",
    hash: file.hash,
    bars: btc.length,
    start: new Date(btc[0]!.t).toISOString(),
    end: new Date(btc[btc.length - 1]!.t).toISOString(),
    partialReplaced: [] as string[],
    appended: [] as string[],
    overlapMedianAbsPct: {},
    volumeScale: {},
    timeframe: "15m" as const,
    trainStart: new Date(file.trainStart).toISOString(),
    holdoutStart: new Date(file.holdoutStart).toISOString(),
  };
}

async function main() {
  const { series, file } = loadLong();
  const anchors = { trainStart: file.trainStart, holdoutStart: file.holdoutStart };
  const split = splits(series, anchors);
  console.error(
    `[validate] joined book ${series["BTC/USD"].length} bars, ${stamp(file.aligned.start)} → ${stamp(file.aligned.end)}, hash ${file.hash}`,
  );
  console.error("[validate] scoring V-Pro 34/9 + EMA 20/30");
  const champion = scoreConfig(series, BASELINE, { timeframe: "15m", anchors, seed: SEED, log: () => {} });
  console.error("[validate] scoring Livermore 4h volume 1.5×");
  const candidate = scoreSpec(series, CANDIDATE, anchors);
  console.error("[validate] scoring Livermore 4h volume 2.0×");
  const variant = scoreSpec(series, VARIANT, anchors);

  console.error("[validate] neighbour holdouts");
  const neighbors = neighbourList(CANDIDATE).map((item) => ({
    label: item.label,
    hash: settingsHash(item.spec),
    holdoutProfit: holdoutProfit(series, item.spec, anchors),
  }));

  console.error("[validate] yearly books");
  const candidatePlans = plansFor(series, CANDIDATE, (bars) => closedHigherEmaDirection(bars, "4h", CANDIDATE.maPeriod));
  const variantPlans = plansFor(series, VARIANT, (bars) => closedHigherEmaDirection(bars, "4h", VARIANT.maPeriod));
  const stances = Object.fromEntries(SYMBOLS.map((symbol) => [symbol, stanceFor(series[symbol], BASELINE)])) as Record<
    SymbolName,
    ReturnType<typeof stanceFor>
  >;
  const btc = series["BTC/USD"];
  const years = new Map<number, { from: number; to: number }>();
  for (let i = split.trainFrom; i <= split.holdoutTo; i++) {
    const year = new Date(btc[i]!.t).getUTCFullYear();
    const span = years.get(year);
    if (!span) years.set(year, { from: i, to: i });
    else span.to = i;
  }
  const yearly: LongTapeStudy["yearly"] = [];
  for (const [year, span] of [...years.entries()].sort((a, b) => a[0] - b[0])) {
    const bars = span.to - span.from + 1;
    const base = runBook(series, stances, span.from, span.to, LIVE_COSTS);
    const next = runLivermore(series, candidatePlans, span.from, span.to, LIVE_COSTS);
    const other = runLivermore(series, variantPlans, span.from, span.to, LIVE_COSTS);
    yearly.push({
      year,
      bars,
      counted: bars >= YEAR_MIN_BARS,
      baseline: base.profit,
      candidate: next.profit,
      variant: other.profit,
      candidateTrades: next.fills.length,
      candidateMaxDd: next.maxDd,
    });
    console.error(`[validate] ${year} candidate ${next.profit.toFixed(0)} baseline ${base.profit.toFixed(0)}`);
  }
  const counted = yearly.filter((row) => row.counted);
  const yearlyWins = {
    candidate: counted.filter((row) => row.candidate > row.baseline).length,
    variant: counted.filter((row) => row.variant > row.baseline).length,
    countedYears: counted.length,
  };

  console.error("[validate] fee stress");
  const stressTrain = runLivermore(series, candidatePlans, split.trainFrom, split.trainTo, STRESS);
  const stressHold = runLivermore(series, candidatePlans, split.holdoutFrom, split.holdoutTo, STRESS);
  const stressFull = runLivermore(series, candidatePlans, split.trainFrom, split.holdoutTo, STRESS);
  const stressTrades = { "BTC/USD": 0, "ETH/USD": 0, "SOL/USD": 0 };
  for (const fill of stressFull.fills) stressTrades[fill.symbol] += 1;

  console.error("[validate] shuffled entries");
  const holdoutRun = runLivermore(series, candidatePlans, split.holdoutFrom, split.holdoutTo, LIVE_COSTS);
  const luck = luckControl(
    series,
    holdoutRun.fills,
    split.holdoutFrom,
    split.holdoutTo,
    LIVE_COSTS,
    LUCK_REPS,
    SEED,
    candidate.holdout.profit,
  );

  const coinAudit = Object.fromEntries(
    Object.entries(file.coins).map(([symbol, audit]) => [
      symbol,
      { bars: audit.bars, duplicates: audit.duplicates, missing: audit.missing, start: stamp(audit.start), end: stamp(audit.end) },
    ]),
  );
  const study: LongTapeStudy = {
    note: `Joined book starts when all three coins exist. Solana's own tape starts later than Bitcoin and Ethereum, so the earlier Bitcoin and Ethereum bars are kept in the per-coin audit and left out of the book. Missing means absent 15-minute slots between the first and last bar. Duplicate means the same timestamp stored twice. Costs stay 0.1% taker and 5 bps slippage, doubled only in the fee stress. Seed ${SEED}.`,
    coins: coinAudit,
    aligned: {
      bars: file.aligned.bars,
      duplicates: file.aligned.duplicates,
      missing: file.aligned.missing,
      start: stamp(file.aligned.start),
      end: stamp(file.aligned.end),
    },
    regimeDefinition:
      "Regime is declared up front and is not a skeptic gate. A trade is bull when Bitcoin's close on the entry bar is more than 5% above its close 1,920 bars earlier (20 days of 15-minute bars), bear when it is more than 5% below, and sideways otherwise. Bars before that lookback count as sideways.",
    yearlyDefinition:
      "A yearly book starts flat on the first 15-minute bar of that UTC year inside the sample and ends on the last. A year with at least 1,920 bars is counted. Beating V-Pro on that year is a yearly win. The skeptic still uses its own four anchored folds. The yearly split does not replace them.",
    yearly,
    yearlyWins,
    feeStress: {
      fee: STRESS.fee,
      slippage: STRESS.slippage,
      trainProfit: stressTrain.profit,
      holdoutProfit: stressHold.profit,
      holdoutMaxDd: stressHold.maxDd,
      fullTrades: stressTrades,
    },
    luck: {
      ...luck,
      bookHoldout: candidate.holdout.profit,
      definition:
        "Each holdout trade keeps its coin, its side, and how many bars it was open. The entry bar is redrawn inside the holdout so that one coin's trades do not overlap. Entry is that bar's open. Exit is the open that many bars later, or the same bar's close when the trade did not last a full bar. The same costs apply. A draw matches the candidate when its timing profit is at least the candidate's own timing profit. This is not the book's stop-to-stop profit, and it is not a skeptic gate.",
    },
  };

  const data = manifest(file, series);
  const commit = codeCommit();
  const sharedReasoning = [
    "Same Livermore rule as the short-tape candidate: 15-minute entries, EMA 50 direction from closed 4-hour bars, 20-bar pivot, confirmation on the next close.",
    "The tape is the longer OKX public 15-minute history. The short tape file was not overwritten.",
    `Joined range ${data.start} → ${data.end}, ${data.bars} bars, sha256 ${data.hash}.`,
    `Joined missing slots ${file.aligned.missing}, joined duplicate timestamps ${file.aligned.duplicates}.`,
    "Bitcoin and Ethereum history begins before Solana. The book uses only timestamps present on all three.",
    "Train is the first 60% after 384 warmup bars. Holdout is the rest. Those timestamps are frozen in the long-tape file.",
    "Fees are 0.1% taker plus 5 bps slippage on entry and exit. The skeptic's gates are unchanged. Nothing is applied to the desk.",
  ];

  const rowFor = (
    spec: Spec,
    metrics: SideMetrics,
    label: string,
    extra: string[],
    withStudy: LongTapeStudy | undefined,
  ): LedgerRow => {
    const judgment = judge(
      { champion, challenger: metrics, neighbors, priorHoldoutSharpes: priorSharpes() },
      console.log,
    );
    const ledger = readLedger();
    return {
      cycle: ledger.length + 1,
      at: new Date().toISOString(),
      commit,
      seed: SEED,
      timeframe: "15m",
      strategy: "livermore",
      livermore: {
        maPeriod: spec.maPeriod,
        pivotLookback: spec.pivotLookback,
        volLookback: spec.volLookback,
        volMultiplier: spec.volMultiplier,
        confirmBars: spec.confirmBars,
        direction: spec.direction,
      },
      data,
      champion: { config: BASELINE, hash: configHash(BASELINE), label: describeConfig(BASELINE) },
      experiment: {
        config: BASELINE,
        hash: settingsHash(spec),
        knob: "directionTf",
        direction: "up",
        from: "vpro",
        to: "4h",
        label,
        reasoning: [...sharedReasoning, ...extra],
      },
      metrics: { champion, challenger: metrics },
      neighbors: neighbors.map((item) => ({
        ...item,
        beatsChampion: item.holdoutProfit > champion.holdout.profit,
      })),
      verdict: judgment.verdict,
      reason: `${judgment.reason} Holdout buy-and-hold was ${usd(champion.holdout.buyHold)}.`,
      gates: judgment.gates,
      trialsCounted: judgment.trialsCounted,
      deflated: judgment.deflated,
      study: withStudy,
    };
  };

  const candidateRow = rowFor(
    CANDIDATE,
    candidate,
    "Livermore 3-step, 4h EMA direction, long tape",
    [
      "This is the validation of the 1.5× volume candidate. Yearly books, regime split, fee stress, the named neighbours, and the shuffled-entry control are recorded on this row. They do not add or remove a skeptic gate.",
    ],
    study,
  );
  appendCycle(candidateRow);

  const variantRow = rowFor(
    VARIANT,
    variant,
    "Livermore 3-step, 4h EMA direction, long tape, volume 2×",
    [
      "Volume multiplier 1.5 → 2 on the same long tape and the same 4-hour direction. The neighbour list is the candidate's declared neighbourhood (pivot 15/25, EMA 40/60, volume 1.25/1.75), not a looser one.",
    ],
    undefined,
  );
  appendCycle(variantRow);

  const foldWins = (metrics: SideMetrics) =>
    metrics.folds.filter((fold, index) => fold.profit > champion.folds[index]!.profit).length;
  const line = (name: string, metrics: SideMetrics) => ({
    name,
    trades: metrics.fullTrades,
    train: metrics.train.profit,
    holdout: metrics.holdout.profit,
    holdoutMaxDd: metrics.holdout.maxDd,
    foldsWon: `${foldWins(metrics)}/${metrics.folds.length}`,
    buyHold: metrics.holdout.buyHold,
    holdoutByCoin: Object.fromEntries(
      SYMBOLS.map((symbol) => [symbol, { profit: metrics.holdout.perCoin[symbol].isolatedProfit, trades: metrics.holdout.perCoin[symbol].trades }]),
    ),
    holdoutRegimes: metrics.holdout.regimes,
  });
  console.log(
    JSON.stringify(
      {
        hash: file.hash,
        coins: coinAudit,
        aligned: study.aligned,
        table: [line("baseline", champion), line("candidate 1.5×", candidate), line("variant 2.0×", variant)],
        yearly,
        yearlyWins,
        feeStress: study.feeStress,
        neighbours: candidateRow.neighbors,
        luck: study.luck,
        candidateVerdict: candidateRow.verdict,
        candidateReason: candidateRow.reason,
        variantVerdict: variantRow.verdict,
        variantReason: variantRow.reason,
      },
      null,
      2,
    ),
  );
  console.error(`[validate] candidate ${candidateRow.verdict}; variant ${variantRow.verdict}`);
  console.error(`[validate] holdout baseline ${usd(champion.holdout.profit)} candidate ${usd(candidate.holdout.profit)} variant ${usd(variant.holdout.profit)} buy-and-hold ${usd(champion.holdout.buyHold)}`);
  console.error(`[validate] fee stress holdout ${usd(study.feeStress.holdoutProfit)} (${pct(study.feeStress.holdoutMaxDd)} DD)`);
  console.error(`[validate] luck ${study.luck.matchedOrBeat}/${study.luck.reps}`);
}

const invoked = process.argv[1]?.includes("livermore-validate");
if (invoked) {
  main().catch((error: unknown) => {
    console.error("[validate]", error instanceof Error ? error.stack : error);
    process.exit(1);
  });
}
