/**
 * Directed Livermore cycles against the CURRENT baseline.
 *
 *   npm run lab:cycle -- --livermore --against-baseline --all
 *   npm run lab:livermore -- --against-baseline --set=tangle_bars=0
 *
 * Uses the lab skeptic unchanged. Does not edit src/lib/desk and does not
 * write research/lab/candidate.json, including when a cycle is ACCEPTed.
 * Sharpe and the deflated-Sharpe z are test statistics, not probabilities.
 * An --all run counts every cycle in this sweep as a trial. It does not add
 * the older V-Pro ledger to that count.
 */
import { execSync } from "node:child_process";
import { appendFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { BASELINE, BOOTSTRAP_REPS, SEED, START_EQUITY } from "./constants.ts";
import { usd, pct, num } from "./format.ts";
import { tapeHash } from "./hash.ts";
import {
  BAR_MS,
  COINS,
  CURRENT_SPEC,
  ENTRY_KEYS,
  EXIT_KEYS,
  LIVERMORE_BINANCE_COST,
  OLD_SPEC,
  YAML_KEY,
  adjacentSpecs,
  formatSpecNum,
  gridOf,
  losingStreak,
  plannedCycles,
  prepareCoin,
  raisesTradesWithoutWorse,
  runPrepared,
  sameNum,
  specHash,
  specLabel,
  withKey,
  yamlOf,
  type ExitReason,
  type LivermoreFill,
  type LivermoreRun,
  type MoneyScore,
  type Plan,
  type Prepared,
  type Spec,
} from "./livermore-quantum.ts";
import { PATHS, REPO_ROOT, isOutputPath } from "./paths.ts";
import { appendCycle, readLedger } from "./recorder.ts";
import { judge, type Judgment } from "./skeptic.ts";
import { blockBootstrapProfit, buyAndHold, moments, regimeBreakdown } from "./stats.ts";
import { LAB_QUANTUM_COST, type QuantumCost } from "./quantum.ts";
import { foldBounds, splits } from "./tester.ts";
import {
  SYMBOLS,
  type Bar,
  type DataManifest,
  type FoldScore,
  type LedgerRow,
  type Series,
  type SideMetrics,
  type SymbolName,
  type WindowMetrics,
} from "./types.ts";

const MARKER = "Quantum Livermore parameter sweep against CURRENT";
const TAPE = path.join(path.dirname(PATHS.cache), "livermore-15m.json");
const RESULT = path.join(path.dirname(PATHS.cache), "livermore-sweep-result.json");
const BLOCK = 96 * 10;
const REGIME = 96 * 20;
const ASSUMPTIONS = [
  "Prices are OKX spot 15-minute candles, confirmed bars only, base-asset volume. Binance spot and Binance USDT-M were probed without a key and were not used for prices.",
  "The book trades the close of each 15-minute bar. A signal on that close fills at the next bar's open. Each window starts flat, with no pending confirmation carried in, and a position still open on the last bar is flattened at that close.",
  "Slope is the EMA's change over ma_slope_bars, divided by the EMA at the start of the window. Long requires the close above the EMA and a slope at least flat_slope_pct. Short is the mirror. A zero threshold still requires the EMA to be rising or falling. A close that crosses or lands on the EMA inside the last tangle_bars bars, including the current bar, stays flat. tangle_bars 0 turns that off.",
  "A swing high is strictly above the pivot_wing bars on each side. A swing low is strictly below them. At bar i the usable swings are those centered from i - pivot_lookback through i - pivot_wing. Highs and lows cluster separately. A price joins a cluster when it is within touch_tolerance_pct of that cluster's lowest price, and the level is the mean. min_touches 1 keeps every swing.",
  "The long breaks the highest resistance the close clears. The short breaks the lowest support. The breakout close is the first of confirm_bars holds. Volume is tested only on that breakout bar, against the prior vol_lookback bars, and vol_multiplier 1 turns the filter off.",
  "A stop and a target touched in one bar fill the stop. A stop gapping through the open fills at the open. The target fills at the target price. An EMA exit is a close back through the line, at that close.",
  "Size is equal notional: one position per coin, each allocated the same fraction of current equity, compounded in coin-list order. Stake starts at $10,000 for the shared book.",
  "The lab cost is 0.1% taker and 5 bps slippage on the entry and on every exit, including the target. No funding. The Binance USDT-M sensitivity is 0.05% taker on the entry, the stop, the EMA exit, and the flatten, 0.02% maker on the target, 2 bps adverse slippage on taker fills, and no extra slippage on the target.",
  "Funding is an assumption, not a historical print: 0.01% of notional per day, paid by longs and received by shorts, pro-rated from the entry bar's open to the exit time. Binance returned HTTP 451, so the perpetual funding history was not fetched. A stop on the entry bar accrues none. A close-based exit is stamped at the bar's close, 15 minutes after its open.",
  "The skeptic is unchanged. Its Sharpe is the per-bar equity Sharpe on this 15-minute book, not a daily Sharpe. The deflated-Sharpe z is a test statistic, not a probability. On --all, every cycle in this sweep is one trial. Neighbours are one grid step on the entry parameters, or on the two exit parameters for an exit test. They are not extra trials.",
  "Train is the first 60% of the bars after 384 bars of warmup. Holdout is the rest. Four walk-forward folds cover the second half of the train, each started flat. Seed 20261114. Nothing here edits the desk.",
];

type TapeFile = {
  hash: string;
  trainStart: number;
  holdoutStart: number;
  binanceSpot: string;
  binanceFutures: string;
  source: string;
  fetchedAt: string;
  market: string;
  oldestRequested: string;
  sharedGaps: Record<string, number>;
  dropped: Record<string, number>;
  symbols: Record<string, number[][]>;
};

type Slot = { symbol: string; bars: Bar[]; prep: Prepared };

type View = {
  profit: number;
  maxDd: number;
  trades: number;
  winRate: number;
  avgWinRet: number | null;
  avgLossRet: number | null;
  avgWinPnl: number | null;
  avgLossPnl: number | null;
  streak: number;
  tradesPerDay: number;
  perCoin: Record<string, number>;
  exits: Record<ExitReason, number>;
  sharpe: number;
};

type Pack = {
  train: View;
  holdout: View;
  full: View;
  folds: FoldScore[];
  fullTrades: Record<string, number>;
  metrics: SideMetrics;
};

type Scored = {
  plan: Plan;
  lab: { champion: Pack; challenger: Pack };
  binance: { champion: Pack; challenger: Pack };
  labNeighbors: { label: string; hash: string; holdoutProfit: number }[];
  binanceNeighbors: { label: string; hash: string; holdoutProfit: number }[];
};

const packCache = new Map<string, Pack>();

export async function runLivermoreCycles(argv: string[]): Promise<void> {
  if (!argv.includes("--against-baseline")) {
    throw new Error("A Livermore cycle must be scored against the CURRENT baseline (--against-baseline).");
  }
  const ledger = readLedger();
  if (!argv.includes("--force") && ledger.some((row) => row.experiment?.reasoning.some((line) => line.includes(MARKER)))) {
    throw new Error("This sweep is already in the ledger. Pass --force only if a second copy is intended.");
  }
  const plans = selectPlans(argv);
  const pinned = new Set([specHash(OLD_SPEC), specHash(CURRENT_SPEC)]);
  const loaded = loadTape();
  const split = splits({ "BTC/USD": loaded.books[0]!.bars } as Series, {
    trainStart: loaded.trainStart,
    holdoutStart: loaded.holdoutStart,
  });
  console.error(
    `[livermore] ${loaded.books.length} coins, ${loaded.books[0]!.bars.length} bars, ${loaded.start} → ${loaded.end}, hash ${loaded.hash}`,
  );
  console.error(`[livermore] ${plans.length} cycles. Scoring before any ledger line is written.`);
  const scored: Scored[] = [];
  for (let i = 0; i < plans.length; i++) {
    const plan = plans[i]!;
    const started = Date.now();
    console.error(`[livermore] score ${i + 1}/${plans.length} ${plan.parameter} ${plan.from} → ${plan.to}`);
    scored.push(scorePlan(plan, loaded.books, split, pinned));
    console.error(`[livermore] scored in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  }
  const labSharpes = scored.map((row) => row.lab.challenger.metrics.holdout.sharpeDaily);
  const binanceSharpes = scored.map((row) => row.binance.challenger.metrics.holdout.sharpeDaily);
  const judged = scored.map((row, index) => ({
    ...row,
    labJudgment: judge(
      {
        champion: row.lab.champion.metrics,
        challenger: row.lab.challenger.metrics,
        neighbors: row.labNeighbors,
        priorHoldoutSharpes: labSharpes.filter((_, other) => other !== index),
        symbols: COINS as unknown as SymbolName[],
      },
      console.log,
    ),
    binanceJudgment: judge(
      {
        champion: row.binance.champion.metrics,
        challenger: row.binance.challenger.metrics,
        neighbors: row.binanceNeighbors,
        priorHoldoutSharpes: binanceSharpes.filter((_, other) => other !== index),
        symbols: COINS as unknown as SymbolName[],
      },
      console.log,
    ),
  }));
  const summary = summarize(judged, loaded);
  writeFileSync(RESULT, `${JSON.stringify(summary, null, 2)}\n`);
  const commit = codeCommit();
  const manifest = manifestOf(loaded);
  let cycle = ledger.length;
  for (const row of judged) {
    cycle += 1;
    appendCycle(ledgerRow(row, cycle, commit, manifest, plans.length), PATHS, console.log, { writeCandidate: false });
  }
  appendFileSync(PATHS.markdown, summary.markdown);
  if (existsSync(PATHS.candidate)) throw new Error("candidate.json was written and must not be");
  const dirty = execSync("git status --porcelain -- src/lib/desk research/lab/candidate.json", {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (dirty.trim()) throw new Error(`desk or candidate.json changed:\n${dirty}`);
  console.log("");
  console.log(summary.plain);
}

const SWEPT_KEYS = [...ENTRY_KEYS, ...EXIT_KEYS];

function selectPlans(argv: string[]): Plan[] {
  const set = argv.find((arg) => arg.startsWith("--set="));
  if (argv.includes("--all") && set) throw new Error("Pass --all or --set, not both.");
  if (argv.includes("--all")) return plannedCycles();
  if (!set) throw new Error("Pass --all or --set=parameter=value.");
  const body = set.slice("--set=".length);
  const eq = body.indexOf("=");
  const name = body.slice(0, eq);
  const value = Number(body.slice(eq + 1));
  if (!Number.isFinite(value)) throw new Error(`Bad --set ${set}`);
  const field = (Object.keys(YAML_KEY) as (keyof Spec)[]).find((key) => YAML_KEY[key] === name);
  if (!field || !SWEPT_KEYS.some((key) => key === field)) throw new Error(`Unknown Livermore parameter ${name}`);
  const grid = gridOf(field);
  if (!grid.some((item) => sameNum(item, value))) throw new Error(`${name}=${value} is not on the grid`);
  if (sameNum(CURRENT_SPEC[field], value)) throw new Error(`${name} is already the CURRENT baseline`);
  const kind = ENTRY_KEYS.some((key) => key === field) ? "entry" : "exit";
  return [
    {
      kind,
      parameter: name,
      from: CURRENT_SPEC[field],
      to: value,
      champion: CURRENT_SPEC,
      challenger: withKey(CURRENT_SPEC, field, value),
    },
  ];
}

function loadTape(): {
  books: { symbol: string; bars: Bar[] }[];
  hash: string;
  trainStart: number;
  holdoutStart: number;
  start: string;
  end: string;
  binanceSpot: string;
  binanceFutures: string;
  source: string;
  fetchedAt: string;
  market: string;
  gaps: string;
} {
  if (!existsSync(TAPE)) throw new Error("The 15-minute tape is missing. Fetch it before scoring.");
  const file = JSON.parse(readFileSync(TAPE, "utf8")) as TapeFile;
  const books = COINS.map((symbol) => {
    const rows = file.symbols[symbol];
    if (!rows?.length) throw new Error(`tape is missing ${symbol}`);
    return {
      symbol,
      bars: rows.map((row) => ({
        t: row[0]!,
        open: row[1]!,
        high: row[2]!,
        low: row[3]!,
        close: row[4]!,
        volume: row[5]!,
      })),
    };
  });
  const n = books[0]!.bars.length;
  for (const book of books) {
    if (book.bars.length !== n) throw new Error(`${book.symbol} length mismatch`);
    for (let i = 0; i < n; i++) {
      if (book.bars[i]!.t !== books[0]!.bars[i]!.t) throw new Error(`${book.symbol} timestamp mismatch at ${i}`);
    }
  }
  const hash = tapeHash(books);
  if (hash !== file.hash) throw new Error(`tape hash ${hash} does not match the file's ${file.hash}`);
  const first = books[0]!.bars[0]!.t;
  const last = books[0]!.bars[n - 1]!.t;
  return {
    books,
    hash,
    trainStart: file.trainStart,
    holdoutStart: file.holdoutStart,
    start: new Date(first).toISOString(),
    end: new Date(last).toISOString(),
    binanceSpot: file.binanceSpot,
    binanceFutures: file.binanceFutures,
    source: file.source,
    fetchedAt: file.fetchedAt,
    market: file.market,
    gaps: COINS.map((symbol) => `${symbol} gaps ${file.sharedGaps[symbol] ?? "n/a"}, dropped ${file.dropped[symbol] ?? "n/a"}`).join("; "),
  };
}

const slotCache = new Map<string, Slot[]>();

function scorePlan(
  plan: Plan,
  books: { symbol: string; bars: Bar[] }[],
  split: { trainFrom: number; trainTo: number; holdoutFrom: number; holdoutTo: number },
  pinned: Set<string>,
): Scored {
  const champion = slots(books, plan.champion, pinned);
  const challenger = slots(books, plan.challenger, pinned);
  const keys = plan.kind === "exit" ? EXIT_KEYS : ENTRY_KEYS;
  const neighbors = adjacentSpecs(plan.challenger, keys);
  const neighborSlots = neighbors.map((item) => ({ ...item, slots: slots(books, item.spec, pinned) }));
  return {
    plan,
    lab: {
      champion: pack(champion, plan.champion, LAB_QUANTUM_COST, books, split, true),
      challenger: pack(challenger, plan.challenger, LAB_QUANTUM_COST, books, split, true),
    },
    binance: {
      champion: pack(champion, plan.champion, LIVERMORE_BINANCE_COST, books, split, false),
      challenger: pack(challenger, plan.challenger, LIVERMORE_BINANCE_COST, books, split, false),
    },
    labNeighbors: neighborSlots.map((item) => ({
      label: item.label,
      hash: specHash(item.spec),
      holdoutProfit: runPrepared(item.slots, item.spec, split.holdoutFrom, split.holdoutTo, LAB_QUANTUM_COST).profit,
    })),
    binanceNeighbors: neighborSlots.map((item) => ({
      label: item.label,
      hash: specHash(item.spec),
      holdoutProfit: runPrepared(item.slots, item.spec, split.holdoutFrom, split.holdoutTo, LIVERMORE_BINANCE_COST).profit,
    })),
  };
}

function slots(books: { symbol: string; bars: Bar[] }[], spec: Spec, pinned: Set<string>): Slot[] {
  const key = specHash(spec);
  const hit = slotCache.get(key);
  if (hit) return hit;
  const built = books.map((book) => ({ symbol: book.symbol, bars: book.bars, prep: prepareCoin(book.bars, spec) }));
  if (pinned.has(key)) slotCache.set(key, built);
  return built;
}

function pack(
  ready: Slot[],
  spec: Spec,
  cost: QuantumCost,
  books: { symbol: string; bars: Bar[] }[],
  split: { trainFrom: number; trainTo: number; holdoutFrom: number; holdoutTo: number },
  bootstrap: boolean,
): Pack {
  const key = `${specHash(spec)}|${cost.name}|${bootstrap ? "boot" : "plain"}`;
  const hit = packCache.get(key);
  if (hit) return hit;
  const reps = bootstrap ? BOOTSTRAP_REPS : 0;
  const trainRun = runPrepared(ready, spec, split.trainFrom, split.trainTo, cost);
  const holdRun = runPrepared(ready, spec, split.holdoutFrom, split.holdoutTo, cost);
  const fullRun = runPrepared(ready, spec, split.trainFrom, split.holdoutTo, cost);
  const days = books[0]!.bars;
  const folds = foldBounds(split.trainFrom, split.trainTo).map((bound) => {
    const run = runPrepared(ready, spec, bound.from, bound.to, cost);
    const end = Math.min(bound.to, days.length - 1);
    return {
      from: new Date(days[bound.from]!.t).toISOString().slice(0, 10),
      to: new Date(days[end]!.t).toISOString().slice(0, 10),
      profit: run.profit,
      trades: run.fills.length,
      maxDd: run.maxDd,
    };
  });
  const built: Pack = {
    train: viewOf(trainRun, days, split.trainFrom, split.trainTo),
    holdout: viewOf(holdRun, days, split.holdoutFrom, split.holdoutTo),
    full: viewOf(fullRun, days, split.trainFrom, split.holdoutTo),
    folds,
    fullTrades: countCoins(fullRun.fills),
    metrics: metricsOf(ready, spec, cost, books, trainRun, holdRun, fullRun, folds, split, reps),
  };
  packCache.set(key, built);
  return built;
}

function metricsOf(
  ready: Slot[],
  spec: Spec,
  cost: QuantumCost,
  books: { symbol: string; bars: Bar[] }[],
  trainRun: LivermoreRun,
  holdRun: LivermoreRun,
  fullRun: LivermoreRun,
  folds: FoldScore[],
  split: { trainFrom: number; trainTo: number; holdoutFrom: number; holdoutTo: number },
  reps: number,
): SideMetrics {
  const btc = books[0]!.bars;
  const closes = books.map((book) => book.bars.map((bar) => bar.close));
  const window = (run: LivermoreRun, from: number, to: number): WindowMetrics => {
    const end = Math.min(to, btc.length - 1);
    const shape = moments(run.barReturns);
    const band = reps > 0 ? blockBootstrapProfit(run.barReturns, START_EQUITY, SEED, reps, BLOCK) : { low: 0, high: 0 };
    const gains = run.fills.filter((fill) => fill.pnl > 0).reduce((acc, fill) => acc + fill.pnl, 0);
    const pains = Math.abs(run.fills.filter((fill) => fill.pnl < 0).reduce((acc, fill) => acc + fill.pnl, 0));
    const wins = run.fills.filter((fill) => fill.pnl > 0).length;
    const perCoin = {
      "BTC/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
      "ETH/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
      "SOL/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
    };
    for (const fill of run.fills) {
      const coin = perCoin[fill.symbol as keyof typeof perCoin];
      if (!coin) continue;
      coin.trades += 1;
      coin.pnl += fill.pnl;
      if (fill.pnl > 0) coin.wins += 1;
    }
    for (const symbol of SYMBOLS) {
      const alone = ready.find((slot) => slot.symbol === symbol);
      if (!alone) continue;
      perCoin[symbol].isolatedProfit = runPrepared([alone], spec, from, to, cost).profit;
    }
    return {
      profit: run.profit,
      endEquity: run.endEquity,
      trades: run.fills.length,
      wins,
      losses: run.fills.length - wins,
      winRate: run.fills.length ? wins / run.fills.length : 0,
      maxDd: run.maxDd,
      sharpeDaily: shape.sharpe,
      sharpeAnnual: shape.sharpe * Math.sqrt(365 * 96),
      profitFactor: pains === 0 ? null : gains / pains,
      meanTradeRet: run.fills.length ? run.fills.reduce((acc, fill) => acc + fill.ret, 0) / run.fills.length : 0,
      skew: shape.skew,
      kurtosis: shape.kurtosis,
      observations: run.barReturns.length,
      buyHold: buyAndHold(closes, from, end),
      bootstrapLow: band.low,
      bootstrapHigh: band.high,
      perCoin,
      regimes: regimeBreakdown(
        btc,
        run.fills.map((fill) => ({
          symbol: "BTC/USD" as SymbolName,
          side: fill.side,
          signalIndex: fill.signalIndex,
          openedIndex: fill.openedIndex,
          closedIndex: fill.closedIndex,
          entry: fill.entry,
          exit: fill.exit,
          ret: fill.ret,
          pnl: fill.pnl,
        })),
        REGIME,
      ),
    };
  };
  return {
    train: window(trainRun, split.trainFrom, split.trainTo),
    holdout: window(holdRun, split.holdoutFrom, split.holdoutTo),
    fullTrades: countCoins(fullRun.fills) as SideMetrics["fullTrades"],
    folds,
  };
}

function viewOf(run: LivermoreRun, bars: Bar[], from: number, to: number): View {
  const wins = run.fills.filter((fill) => fill.pnl > 0);
  const losses = run.fills.filter((fill) => fill.pnl < 0);
  const mean = (rows: LivermoreFill[], key: "ret" | "pnl") =>
    rows.length ? rows.reduce((acc, fill) => acc + fill[key], 0) / rows.length : null;
  const ordered = [...run.fills].sort((a, b) => a.exitT - b.exitT || a.symbol.localeCompare(b.symbol));
  const end = Math.min(to, bars.length - 1);
  const spanDays = Math.max((bars[end]!.t + BAR_MS - bars[from]!.t) / 86_400_000, 1 / 96);
  return {
    profit: run.profit,
    maxDd: run.maxDd,
    trades: run.fills.length,
    winRate: run.fills.length ? wins.length / run.fills.length : 0,
    avgWinRet: mean(wins, "ret"),
    avgLossRet: mean(losses, "ret"),
    avgWinPnl: mean(wins, "pnl"),
    avgLossPnl: mean(losses, "pnl"),
    streak: losingStreak(ordered.map((fill) => fill.pnl)),
    tradesPerDay: run.fills.length / spanDays,
    perCoin: countCoins(run.fills),
    exits: run.exitCounts,
    sharpe: moments(run.barReturns).sharpe,
  };
}

function countCoins(fills: LivermoreFill[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const coin of COINS) out[coin] = 0;
  for (const fill of fills) out[fill.symbol] = (out[fill.symbol] ?? 0) + 1;
  return out;
}

function money(pack: Pack): MoneyScore {
  return {
    trades: Object.values(pack.fullTrades).reduce((acc, value) => acc + value, 0),
    trainProfit: pack.train.profit,
    holdoutProfit: pack.holdout.profit,
    holdoutMaxDd: pack.holdout.maxDd,
  };
}

function ledgerRow(
  row: Scored & { labJudgment: Judgment; binanceJudgment: Judgment },
  cycle: number,
  commit: string,
  manifest: DataManifest,
  trials: number,
): LedgerRow {
  const plan = row.plan;
  const champName = plan.kind === "old-vs-current" ? "OLD" : "CURRENT";
  const label =
    plan.kind === "old-vs-current"
      ? "CURRENT Livermore against OLD Livermore"
      : plan.kind === "exit"
        ? `Exit test: ${plan.parameter} ${formatSpecNum(Number(plan.from))} → ${formatSpecNum(Number(plan.to))}`
        : `${plan.parameter} ${formatSpecNum(Number(plan.from))} → ${formatSpecNum(Number(plan.to))}`;
  const neighbors = row.labNeighbors.map((item) => ({
    ...item,
    beatsChampion: item.holdoutProfit > row.lab.champion.metrics.holdout.profit,
  }));
  return {
    cycle,
    at: new Date().toISOString(),
    commit,
    seed: SEED,
    timeframe: "15m",
    strategy: "livermore",
    livermore: {
      maPeriod: plan.challenger.maLength,
      pivotLookback: plan.challenger.pivotLookback,
      volLookback: plan.challenger.volLookback,
      volMultiplier: plan.challenger.volMultiplier,
      confirmBars: plan.challenger.confirmBars,
      direction: "same",
      maSlopeBars: plan.challenger.maSlopeBars,
      flatSlopePct: plan.challenger.flatSlopePct,
      tangleBars: plan.challenger.tangleBars,
      pivotWing: plan.challenger.pivotWing,
      touchTolerancePct: plan.challenger.touchTolerancePct,
      minTouches: plan.challenger.minTouches,
      takeProfit: plan.challenger.takeProfit,
      stopLoss: plan.challenger.stopLoss,
    },
    data: manifest,
    champion: {
      config: BASELINE,
      hash: specHash(plan.champion),
      label: `${champName} ${specLabel(plan.champion)}`,
    },
    experiment: {
      config: BASELINE,
      hash: specHash(plan.challenger),
      knob: "directionTf",
      direction: directionOf(plan),
      from: plan.from,
      to: plan.to,
      label,
      parameter: plan.parameter,
      reasoning: reasoning(plan, trials),
    },
    metrics: { champion: row.lab.champion.metrics, challenger: row.lab.challenger.metrics },
    neighbors,
    verdict: row.labJudgment.verdict,
    reason: `${row.labJudgment.reason} The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is ${row.binanceJudgment.verdict}. candidate.json was not written.`,
    gates: row.labJudgment.gates,
    trialsCounted: row.labJudgment.trialsCounted,
    deflated: row.labJudgment.deflated,
    detail: detailLines(row),
  };
}

function directionOf(plan: Plan): "up" | "down" {
  if (plan.kind === "old-vs-current") return "up";
  const field = (Object.keys(YAML_KEY) as (keyof Spec)[]).find((key) => YAML_KEY[key] === plan.parameter)!;
  const grid = gridOf(field);
  const from = grid.findIndex((value) => sameNum(value, Number(plan.from)));
  const to = grid.findIndex((value) => sameNum(value, Number(plan.to)));
  return to > from ? "up" : "down";
}

function reasoning(plan: Plan, trials: number): string[] {
  const head =
    plan.kind === "old-vs-current"
      ? "This cycle scores CURRENT against OLD. Seven entry settings differ, so it is not a one-variable acceptance candidate. CURRENT is the challenger and OLD is the champion."
      : plan.kind === "exit"
        ? `Exit test. One variable: ${plan.parameter} from ${formatSpecNum(Number(plan.from))} to ${formatSpecNum(Number(plan.to))}. The entry settings stay at CURRENT. This is marked as an exit test and is not an entry-filter result.`
        : `One variable: ${plan.parameter} from ${formatSpecNum(Number(plan.from))} to ${formatSpecNum(Number(plan.to))}. Every other Livermore setting stays at CURRENT.`;
  return [
    MARKER,
    "The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.",
    "The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.",
    head,
    `Scored against ${plan.kind === "old-vs-current" ? "OLD" : "CURRENT"}. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.`,
    `The deflated-Sharpe trial count for this run is ${trials}. Those trials are the cycles in this sweep. The z statistic is not a probability.`,
    "The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.",
    "This does not edit the desk and does not write research/lab/candidate.json.",
    ...(plan.kind === "old-vs-current" ? ASSUMPTIONS : ["Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle."]),
  ];
}

function detailLines(row: Scored & { labJudgment: Judgment; binanceJudgment: Judgment }): string[] {
  const lines: string[] = [];
  const lab = compareBlock("Lab cost", row.lab.champion, row.lab.challenger);
  const binance = compareBlock("Binance USDT-M sensitivity", row.binance.champion, row.binance.challenger);
  lines.push(...lab);
  lines.push("");
  lines.push(
    `Skeptic on the lab cost: ${row.labJudgment.verdict}. ${row.labJudgment.reason} z=${num(row.labJudgment.deflated.z, 3)} after ${row.labJudgment.trialsCounted} trials. The z is not a probability.`,
  );
  lines.push("");
  lines.push(...binance);
  lines.push("");
  lines.push(
    `Skeptic on the Binance cost: ${row.binanceJudgment.verdict}. ${row.binanceJudgment.reason} z=${num(row.binanceJudgment.deflated.z, 3)} after ${row.binanceJudgment.trialsCounted} trials. The z is not a probability.`,
  );
  lines.push("");
  lines.push(
    `Binance gates: ${row.binanceJudgment.gates.map((gate) => `${gate.pass ? "pass" : "fail"} ${gate.name}`).join("; ")}.`,
  );
  return lines;
}

function compareBlock(title: string, champion: Pack, challenger: Pack): string[] {
  const lines = [`**${title}.** Shared book, equal weight, $10,000.`];
  lines.push(
    `Full-sample trades ${sum(champion.fullTrades)} → ${sum(challenger.fullTrades)} (${num(champion.full.tradesPerDay, 3)} → ${num(challenger.full.tradesPerDay, 3)} per day). Holdout trades ${champion.holdout.trades} → ${challenger.holdout.trades} (${num(champion.holdout.tradesPerDay, 3)} → ${num(challenger.holdout.tradesPerDay, 3)} per day).`,
  );
  lines.push(
    `Per coin, full sample then holdout: ${COINS.map((coin) => `${coin} ${champion.fullTrades[coin]}→${challenger.fullTrades[coin]} full, ${champion.holdout.perCoin[coin]}→${challenger.holdout.perCoin[coin]} holdout`).join("; ")}.`,
  );
  lines.push(
    `Full-sample win rate ${pct(champion.full.winRate)} → ${pct(challenger.full.winRate)}. Average win ${moneyRet(champion.full.avgWinRet)} → ${moneyRet(challenger.full.avgWinRet)} (${dollars(champion.full.avgWinPnl)} → ${dollars(challenger.full.avgWinPnl)}). Average loss ${moneyRet(champion.full.avgLossRet)} → ${moneyRet(challenger.full.avgLossRet)} (${dollars(champion.full.avgLossPnl)} → ${dollars(challenger.full.avgLossPnl)}).`,
  );
  lines.push(
    `Holdout win rate ${pct(champion.holdout.winRate)} → ${pct(challenger.holdout.winRate)}. Average win ${moneyRet(champion.holdout.avgWinRet)} → ${moneyRet(challenger.holdout.avgWinRet)}. Average loss ${moneyRet(champion.holdout.avgLossRet)} → ${moneyRet(challenger.holdout.avgLossRet)}.`,
  );
  lines.push(
    `Train profit ${usd(champion.train.profit)} → ${usd(challenger.train.profit)}. Holdout profit ${usd(champion.holdout.profit)} → ${usd(challenger.holdout.profit)}. Holdout max drawdown ${pct(champion.holdout.maxDd)} → ${pct(challenger.holdout.maxDd)}.`,
  );
  const won = challenger.folds.filter((fold, index) => fold.profit > champion.folds[index]!.profit).length;
  lines.push(`Folds won ${won} of ${challenger.folds.length}. Longest losing streak, full sample, ${champion.full.streak} → ${challenger.full.streak}. Holdout streak ${champion.holdout.streak} → ${challenger.holdout.streak}.`);
  lines.push(`Exits, full sample, challenger: ${exitText(challenger.full.exits)}. Champion: ${exitText(champion.full.exits)}.`);
  lines.push(`Per-bar Sharpe, holdout, ${num(champion.holdout.sharpe)} → ${num(challenger.holdout.sharpe)}. This is not a daily Sharpe and it is not a probability.`);
  return lines;
}

function exitText(exits: Record<ExitReason, number>): string {
  return `target ${exits.tp}, stop ${exits.sl}, EMA ${exits.ema}, flatten ${exits.flatten}`;
}

function moneyRet(value: number | null): string {
  return value == null ? "n/a" : pct(value);
}

function dollars(value: number | null): string {
  return value == null ? "n/a" : usd(value);
}

function sum(counts: Record<string, number>): number {
  return Object.values(counts).reduce((acc, value) => acc + value, 0);
}

function summarize(
  rows: (Scored & { labJudgment: Judgment; binanceJudgment: Judgment })[],
  loaded: { hash: string; start: string; end: string; binanceSpot: string; binanceFutures: string; gaps: string; market: string },
): { plain: string; markdown: string; cycles: unknown[] } {
  const current = rows.find((row) => row.plan.kind !== "old-vs-current");
  const baselineLab = current ? money(current.lab.champion) : money(rows[0]!.lab.challenger);
  const baselineBinance = current ? money(current.binance.champion) : money(rows[0]!.binance.challenger);
  const qualified = rows.filter(
    (row) =>
      row.plan.kind !== "old-vs-current" &&
      raisesTradesWithoutWorse(money(row.lab.challenger), baselineLab) &&
      raisesTradesWithoutWorse(money(row.binance.challenger), baselineBinance),
  );
  const entry = qualified.filter((row) => row.plan.kind === "entry");
  const exit = qualified.filter((row) => row.plan.kind === "exit");
  entry.sort((a, b) => money(b.lab.challenger).holdoutProfit - money(a.lab.challenger).holdoutProfit);
  exit.sort((a, b) => money(b.lab.challenger).holdoutProfit - money(a.lab.challenger).holdoutProfit);
  const chosen = entry[0]?.plan.challenger ?? exit[0]?.plan.challenger ?? CURRENT_SPEC;
  const chosenLabel = entry[0]
    ? `the single entry change ${entry[0].plan.parameter} ${entry[0].plan.from} → ${entry[0].plan.to}`
    : exit[0]
      ? `the exit test ${exit[0].plan.parameter} ${exit[0].plan.from} → ${exit[0].plan.to}, because no entry change cleared the test`
      : "CURRENT, because no tested one-variable change raised the trade count without worse net results on both cost models";
  const old = rows.find((row) => row.plan.kind === "old-vs-current");
  const lines: string[] = [];
  lines.push("## Quantum Livermore parameter sweep — reading, not an extra cycle");
  lines.push("");
  lines.push("This reading is not a trial. The cycles above are the trials. `research/lab/candidate.json` was not written. `src/lib/desk` was not edited.");
  lines.push("");
  lines.push(`Tape: ${loaded.market} ${COINS.join(", ")}. ${loaded.start} → ${loaded.end}. Hash \`${loaded.hash}\`. Binance spot ${loaded.binanceSpot}; Binance USDT-M ${loaded.binanceFutures}. ${loaded.gaps}.`);
  lines.push("");
  lines.push(old ? oldVersusCurrent(old) : "OLD versus CURRENT was not in this run.");
  lines.push("");
  lines.push(tradeCountParagraph(rows));
  lines.push("");
  lines.push(hurtParagraph(rows));
  lines.push("");
  lines.push(
    `Recommended config, research suggestion, not accepted unless skeptic ACCEPTs. The suggestion is ${chosenLabel}. A combination of several one-variable changes was not run, so this is not a joint result. The skeptic's own verdict on each cycle is in the table. None of those verdicts is a probability.`,
  );
  lines.push("");
  lines.push("```yaml");
  lines.push(yamlOf(chosen));
  lines.push("```");
  lines.push("");
  lines.push("### One-variable results");
  lines.push("");
  lines.push("| Change | Full trades | Lab holdout profit | Lab holdout max DD | Lab verdict | Binance holdout profit | Binance verdict |");
  lines.push("| --- | ---: | ---: | ---: | --- | ---: | --- |");
  for (const row of rows) {
    const name =
      row.plan.kind === "old-vs-current"
        ? "CURRENT vs OLD"
        : `${row.plan.kind === "exit" ? "exit " : ""}${row.plan.parameter} ${row.plan.from} → ${row.plan.to}`;
    lines.push(
      `| ${name} | ${sum(row.lab.champion.fullTrades)} → ${sum(row.lab.challenger.fullTrades)} | ${usd(row.lab.champion.holdout.profit)} → ${usd(row.lab.challenger.holdout.profit)} | ${pct(row.lab.champion.holdout.maxDd)} → ${pct(row.lab.challenger.holdout.maxDd)} | ${row.labJudgment.verdict} | ${usd(row.binance.champion.holdout.profit)} → ${usd(row.binance.challenger.holdout.profit)} | ${row.binanceJudgment.verdict} |`,
    );
  }
  lines.push("");
  lines.push("### Caveats");
  lines.push("");
  for (const line of ASSUMPTIONS) lines.push(`- ${line}`);
  lines.push("- The suggested config is not applied. An ACCEPT would still have stayed in the ledger only, and this run does not write a candidate file.");
  lines.push("");
  const markdown = `${lines.join("\n")}\n`;
  const plain = [
    old ? oldVersusCurrent(old) : "",
    tradeCountParagraph(rows),
    hurtParagraph(rows),
    `Research suggestion, not accepted unless skeptic ACCEPTs: ${chosenLabel}.`,
    yamlOf(chosen),
  ]
    .filter(Boolean)
    .join("\n\n");
  return {
    plain,
    markdown,
    cycles: rows.map((row) => ({
      parameter: row.plan.parameter,
      kind: row.plan.kind,
      from: row.plan.from,
      to: row.plan.to,
      labVerdict: row.labJudgment.verdict,
      binanceVerdict: row.binanceJudgment.verdict,
      labReason: row.labJudgment.reason,
      binanceReason: row.binanceJudgment.reason,
      labDeflated: row.labJudgment.deflated,
      binanceDeflated: row.binanceJudgment.deflated,
      lab: snapshot(row.lab),
      binance: snapshot(row.binance),
      qualified:
        row.plan.kind !== "old-vs-current" &&
        raisesTradesWithoutWorse(money(row.lab.challenger), baselineLab) &&
        raisesTradesWithoutWorse(money(row.binance.challenger), baselineBinance),
    })),
  };
}

function oldVersusCurrent(row: Scored & { labJudgment: Judgment; binanceJudgment: Judgment }): string {
  const lab = sideText("lab costs", row.lab.champion, row.lab.challenger);
  const binance = sideText("Binance costs", row.binance.champion, row.binance.challenger);
  return `CURRENT against OLD. On ${lab} The lab skeptic says ${row.labJudgment.verdict}. On ${binance} The Binance skeptic says ${row.binanceJudgment.verdict}.`;
}

function sideText(name: string, champion: Pack, challenger: Pack): string {
  const trades = sum(challenger.fullTrades) - sum(champion.fullTrades);
  const profit = challenger.holdout.profit - champion.holdout.profit;
  const dd = challenger.holdout.maxDd - champion.holdout.maxDd;
  return `${name}, CURRENT has ${trades >= 0 ? trades : Math.abs(trades)} ${trades >= 0 ? "more" : "fewer"} full-sample trades (${sum(champion.fullTrades)} to ${sum(challenger.fullTrades)}), holdout profit ${usd(champion.holdout.profit)} to ${usd(challenger.holdout.profit)} (${profit >= 0 ? "higher" : "lower"} by ${usd(Math.abs(profit))}), and holdout max drawdown ${pct(champion.holdout.maxDd)} to ${pct(challenger.holdout.maxDd)} (${dd <= 1e-12 ? "not worse" : "worse"}).`;
}

function tradeCountParagraph(rows: (Scored & { labJudgment: Judgment })[]): string {
  const ups = rows.filter((row) => row.plan.kind !== "old-vs-current" && sum(row.lab.challenger.fullTrades) > sum(row.lab.champion.fullTrades));
  if (!ups.length) return "No one-variable change raised the full-sample trade count against CURRENT.";
  return `Changes that raise the full-sample trade count against CURRENT: ${ups
    .map((row) => {
      const labOk = raisesTradesWithoutWorse(money(row.lab.challenger), money(row.lab.champion));
      const both = labOk && raisesTradesWithoutWorse(money(row.binance.challenger), money(row.binance.champion));
      const note = both ? "trades up and net results not worse on both cost models" : "trades up, but a profit or drawdown result is worse";
      return `${row.plan.parameter} ${row.plan.from}→${row.plan.to} (${sum(row.lab.champion.fullTrades)} to ${sum(row.lab.challenger.fullTrades)} trades; ${note}; lab ${row.labJudgment.verdict})`;
    })
    .join("; ")}.`;
}

function hurtParagraph(rows: Scored[]): string {
  const hurt = rows.filter(
    (row) => row.plan.kind !== "old-vs-current" && row.lab.challenger.holdout.profit < row.lab.champion.holdout.profit,
  );
  if (!hurt.length) return "No one-variable change lowered lab-cost holdout profit against CURRENT.";
  const worst = [...hurt].sort((a, b) => a.lab.challenger.holdout.profit - b.lab.challenger.holdout.profit).slice(0, 8);
  return `Changes that lower lab-cost holdout profit against CURRENT (${hurt.length} of the one-variable cycles): ${worst
    .map((row) => `${row.plan.parameter} ${row.plan.from}→${row.plan.to} (${usd(row.lab.champion.holdout.profit)} to ${usd(row.lab.challenger.holdout.profit)})`)
    .join("; ")}.`;
}

function snapshot(pair: { champion: Pack; challenger: Pack }) {
  const slim = (pack: Pack) => ({
    trainProfit: pack.train.profit,
    holdoutProfit: pack.holdout.profit,
    holdoutMaxDd: pack.holdout.maxDd,
    fullTrades: pack.fullTrades,
    full: pack.full,
    holdout: pack.holdout,
    train: pack.train,
    folds: pack.folds,
    sharpeHoldout: pack.metrics.holdout.sharpeDaily,
  });
  return { champion: slim(pair.champion), challenger: slim(pair.challenger) };
}

function manifestOf(loaded: {
  hash: string;
  start: string;
  end: string;
  source: string;
  binanceSpot: string;
  binanceFutures: string;
  books: { bars: Bar[] }[];
  trainStart: number;
  holdoutStart: number;
}): DataManifest {
  return {
    source: `${loaded.source} (${COINS.join(", ")})`,
    binance: `spot ${loaded.binanceSpot}; usdt-m ${loaded.binanceFutures}`,
    hash: loaded.hash,
    bars: loaded.books[0]!.bars.length,
    start: loaded.start.slice(0, 10),
    end: loaded.end.slice(0, 10),
    timeframe: "15m",
    trainStart: new Date(loaded.trainStart).toISOString(),
    holdoutStart: new Date(loaded.holdoutStart).toISOString(),
    partialReplaced: [],
    appended: [],
    overlapMedianAbsPct: {},
    volumeScale: {},
  };
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

const invoked = process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invoked) {
  runLivermoreCycles(process.argv.slice(2)).catch((error: unknown) => {
    console.error("[livermore]", error instanceof Error ? error.stack : error);
    process.exit(1);
  });
}
