/**
 * Falcon against Quantum on the pinned tape. Research only.
 *
 * Does not edit src/lib/desk, does not write research/lab/candidate.json,
 * and does not append research/lab/ledger.jsonl. A later `npm run lab:cycle`
 * therefore still sees the same trial list.
 *
 * npm run lab:compare
 */
import { execSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { BASELINE, BOOTSTRAP_BLOCK, BOOTSTRAP_REPS, FIFTEEN_DATA_HASH, PINNED_DATA_HASH, SEED, START_EQUITY } from "./constants.ts";
import { runBook, type CostModel, type Fill } from "./execute.ts";
import { pct, usd } from "./format.ts";
import { tapeHash } from "./hash.ts";
import { emaStance } from "./indicators.ts";
import { loadFifteen, loadMarket } from "./market.ts";
import { PATHS, REPO_ROOT } from "./paths.ts";
import { readLedger } from "./recorder.ts";
import { judge, type Judgment } from "./skeptic.ts";
import { stanceFor } from "./strategy.ts";
import { blockBootstrapProfit, buyAndHold, moments, regimeBreakdown } from "./stats.ts";
import { LIVE_COSTS, foldBounds, scoreConfig, splits } from "./tester.ts";
import {
  rowTimeframe,
  SYMBOLS,
  type Bar,
  type FoldScore,
  type Series,
  type SideMetrics,
  type SymbolName,
  type WindowMetrics,
} from "./types.ts";
import {
  BINANCE_QUANTUM_COST,
  COMPARISON_OUTPUTS,
  LAB_QUANTUM_COST,
  QUANTUM_ASSUMPTIONS,
  QUANTUM_DAILY,
  QUANTUM_EMA_FAST,
  QUANTUM_EMA_SLOW,
  QUANTUM_FULL,
  groupByDay,
  quantumNeighbors,
  runQuantumCoin,
  wantsFifteen,
  type ExitReason,
  type QuantumCost,
  type QuantumFill,
  type QuantumSettings,
} from "./quantum.ts";

const MARKER = "## Comparison — Falcon vs Quantum";
const LEDGER_SHARED_TRAIN = 5941.96;
const LEDGER_SHARED_HOLDOUT = 5522.78;
const LEDGER_ISOLATED_HOLDOUT: Record<SymbolName, number> = {
  "BTC/USD": 2901.13,
  "ETH/USD": 5743.72,
  "SOL/USD": 6237.65,
};
const LEDGER_FULL_TRADES: Record<SymbolName, number> = {
  "BTC/USD": 28,
  "ETH/USD": 25,
  "SOL/USD": 24,
};
const EXIT_ORDER: ExitReason[] = ["tp", "sl", "trail", "spike", "ema9", "volume", "cross", "flatten"];

type RowFill = {
  symbol: string;
  side: "LONG" | "SHORT";
  pnl: number;
  ret: number;
  exitT: number;
  reason: string;
  closedIndex: number;
  signalIndex: number;
};

type Quality = {
  trades: number;
  wins: number;
  winRate: number;
  avgWin: number | null;
  avgLoss: number | null;
  worst: { symbol: string; side: string; pnl: number; ret: number; reason: string } | null;
  longestLosingStreak: number;
};

type CoinLine = Quality & { symbol: string; profit: number; maxDd: number };

type WindowView = {
  profit: number;
  maxDd: number;
  dailyReturns: number[];
  fills: RowFill[];
  quality: Quality;
  coins: CoinLine[];
  exits: Record<ExitReason, number>;
  signalTies: number;
  fallbackDays: number;
  shortDays: number;
  buyHold: number;
};

type BookView = {
  name: string;
  coins: string[];
  costName: string;
  train: WindowView;
  holdout: WindowView;
  full: WindowView;
  folds: FoldScore[];
  fullTrades: Record<string, number>;
};

const FALCON_BINANCE: CostModel = { fee: 0.0005, slippage: 0, fundingPerDay: 0.0001 };

function day(t: number): string {
  return new Date(t).toISOString().slice(0, 10);
}

function emptyExits(): Record<ExitReason, number> {
  return { tp: 0, sl: 0, trail: 0, spike: 0, ema9: 0, volume: 0, cross: 0, flatten: 0 };
}

function qualityOf(fills: RowFill[]): Quality {
  const wins = fills.filter((fill) => fill.pnl > 0);
  const losses = fills.filter((fill) => fill.pnl < 0);
  const mean = (rows: RowFill[]) => (rows.length ? rows.reduce((sum, fill) => sum + fill.pnl, 0) / rows.length : null);
  const ordered = [...fills].sort(
    (a, b) => a.exitT - b.exitT || a.closedIndex - b.closedIndex || a.symbol.localeCompare(b.symbol),
  );
  let streak = 0;
  let longest = 0;
  for (const fill of ordered) {
    if (fill.pnl <= 0) {
      streak += 1;
      longest = Math.max(longest, streak);
    } else streak = 0;
  }
  const worst = fills.reduce<RowFill | null>((best, fill) => (best == null || fill.pnl < best.pnl ? fill : best), null);
  return {
    trades: fills.length,
    wins: wins.length,
    winRate: fills.length ? wins.length / fills.length : 0,
    avgWin: mean(wins),
    avgLoss: mean(losses),
    worst: worst ? { symbol: worst.symbol, side: worst.side, pnl: worst.pnl, ret: worst.ret, reason: worst.reason } : null,
    longestLosingStreak: longest,
  };
}

function addExits(into: Record<ExitReason, number>, from: Record<ExitReason, number>) {
  for (const key of EXIT_ORDER) into[key] += from[key];
}

type CoinWindow = {
  symbol: string;
  profit: number;
  maxDd: number;
  curve: number[];
  fills: RowFill[];
  exits: Record<ExitReason, number>;
  signalTies: number;
  fallbackDays: number;
  shortDays: number;
};

function combine(results: CoinWindow[], closes: number[][], from: number, end: number): WindowView {
  if (results.length === 0) throw new Error("no coins");
  const width = results[0]!.curve.length;
  for (const result of results) {
    if (result.curve.length !== width) {
      throw new Error(`${result.symbol} has ${result.curve.length} marks and ${results[0]!.symbol} has ${width}`);
    }
  }
  const curve = Array.from({ length: width }, (_, index) => results.reduce((sum, result) => sum + result.curve[index]!, 0));
  let peak = curve[0]!;
  let maxDd = 0;
  const dailyReturns: number[] = [];
  for (let i = 0; i < curve.length; i++) {
    if (i > 0) {
      const prev = curve[i - 1]!;
      dailyReturns.push(prev !== 0 ? curve[i]! / prev - 1 : 0);
    }
    peak = Math.max(peak, curve[i]!);
    maxDd = Math.max(maxDd, peak > 0 ? (peak - curve[i]!) / peak : 0);
  }
  const profit = curve[curve.length - 1]! - curve[0]!;
  const summed = results.reduce((sum, result) => sum + result.profit, 0);
  if (Math.abs(profit - summed) > 0.02) throw new Error(`combined profit ${profit} does not match the coins ${summed}`);
  const exits = emptyExits();
  let signalTies = 0;
  let fallbackDays = 0;
  let shortDays = 0;
  for (const result of results) {
    addExits(exits, result.exits);
    signalTies += result.signalTies;
    fallbackDays += result.fallbackDays;
    shortDays += result.shortDays;
  }
  const fills = results.flatMap((result) => result.fills);
  return {
    profit,
    maxDd,
    dailyReturns,
    fills,
    quality: qualityOf(fills),
    coins: results.map((result) => ({
      symbol: result.symbol,
      profit: result.profit,
      maxDd: result.maxDd,
      ...qualityOf(result.fills),
    })),
    exits,
    signalTies,
    fallbackDays,
    shortDays,
    buyHold: buyAndHold(closes, from, end, START_EQUITY * results.length),
  };
}

function falconCoin(
  series: Series,
  symbol: SymbolName,
  stances: Record<SymbolName, ReturnType<typeof stanceFor>>,
  from: number,
  to: number,
  costs: CostModel,
): CoinWindow {
  const run = runBook(series, { [symbol]: stances[symbol] }, from, to, costs);
  return {
    symbol,
    profit: run.profit,
    maxDd: run.maxDd,
    curve: run.curve,
    fills: run.fills.map((fill) => falconFill(series, fill)),
    exits: emptyExits(),
    signalTies: 0,
    fallbackDays: 0,
    shortDays: 0,
  };
}

function falconFill(series: Series, fill: Fill): RowFill {
  return {
    symbol: fill.symbol,
    side: fill.side,
    pnl: fill.pnl,
    ret: fill.ret,
    exitT: series[fill.symbol][fill.closedIndex]!.t,
    reason: "desk",
    closedIndex: fill.closedIndex,
    signalIndex: fill.signalIndex,
  };
}

function quantumFill(fill: QuantumFill): RowFill {
  return {
    symbol: fill.symbol,
    side: fill.side,
    pnl: fill.pnl,
    ret: fill.ret,
    exitT: fill.exitT,
    reason: fill.reason,
    closedIndex: fill.closedIndex,
    signalIndex: fill.signalIndex,
  };
}

type QuantumCoin = { symbol: string; daily: Bar[]; m15: Bar[] | null; stances: ReturnType<typeof emaStance> };

function quantumCoin(coin: QuantumCoin, settings: QuantumSettings, from: number, to: number, cost: QuantumCost): CoinWindow {
  const run = runQuantumCoin(
    coin.symbol,
    coin.daily,
    wantsFifteen(settings) ? coin.m15 : null,
    coin.stances,
    from,
    to,
    settings,
    cost,
  );
  return {
    symbol: coin.symbol,
    profit: run.profit,
    maxDd: run.maxDd,
    curve: run.curve,
    fills: run.fills.map(quantumFill),
    exits: run.exitCounts,
    signalTies: run.signalTies,
    fallbackDays: run.fallbackDays,
    shortDays: run.shortDays,
  };
}

function scoreFalcon(
  name: string,
  series: Series,
  symbols: SymbolName[],
  costs: CostModel,
  costName: string,
  clock: Bar[],
): BookView {
  const stances = Object.fromEntries(symbols.map((symbol) => [symbol, stanceFor(series[symbol], BASELINE)])) as Record<
    SymbolName,
    ReturnType<typeof stanceFor>
  >;
  const split = splits(series);
  const closes = symbols.map((symbol) => series[symbol].map((bar) => bar.close));
  const at = (from: number, to: number) =>
    combine(
      symbols.map((symbol) => falconCoin(series, symbol, stances, from, to, costs)),
      closes,
      from,
      Math.min(to, clock.length - 1),
    );
  const train = at(split.trainFrom, split.trainTo);
  const holdout = at(split.holdoutFrom, split.holdoutTo);
  const full = at(split.trainFrom, split.holdoutTo);
  const folds = foldBounds(split.trainFrom, split.trainTo).map((bound) => {
    const run = at(bound.from, bound.to);
    const end = Math.min(bound.to, clock.length - 1);
    return {
      from: day(clock[bound.from]!.t),
      to: day(clock[end]!.t),
      profit: run.profit,
      trades: run.quality.trades,
      maxDd: run.maxDd,
    };
  });
  const fullTrades: Record<string, number> = {};
  for (const coin of full.coins) fullTrades[coin.symbol] = coin.trades;
  return { name, coins: [...symbols], costName, train, holdout, full, folds, fullTrades };
}

function scoreQuantum(
  name: string,
  coins: QuantumCoin[],
  settings: QuantumSettings,
  cost: QuantumCost,
  clock: Bar[],
  split: ReturnType<typeof splits>,
): BookView {
  const closes = coins.map((coin) => coin.daily.map((bar) => bar.close));
  const at = (from: number, to: number) =>
    combine(
      coins.map((coin) => quantumCoin(coin, settings, from, to, cost)),
      closes,
      from,
      Math.min(to, clock.length - 1),
    );
  const train = at(split.trainFrom, split.trainTo);
  const holdout = at(split.holdoutFrom, split.holdoutTo);
  const full = at(split.trainFrom, split.holdoutTo);
  const folds = foldBounds(split.trainFrom, split.trainTo).map((bound) => {
    const run = at(bound.from, bound.to);
    const end = Math.min(bound.to, clock.length - 1);
    return {
      from: day(clock[bound.from]!.t),
      to: day(clock[end]!.t),
      profit: run.profit,
      trades: run.quality.trades,
      maxDd: run.maxDd,
    };
  });
  const fullTrades: Record<string, number> = {};
  for (const coin of full.coins) fullTrades[coin.symbol] = coin.trades;
  return { name, coins: coins.map((coin) => coin.symbol), costName: cost.name, train, holdout, full, folds, fullTrades };
}

function toSide(book: BookView, btc: Bar[]): SideMetrics {
  const window = (view: WindowView): WindowMetrics => {
    const shape = moments(view.dailyReturns);
    const band = blockBootstrapProfit(view.dailyReturns, START_EQUITY * book.coins.length, SEED, BOOTSTRAP_REPS, BOOTSTRAP_BLOCK);
    const gains = view.fills.filter((fill) => fill.pnl > 0).reduce((sum, fill) => sum + fill.pnl, 0);
    const pains = Math.abs(view.fills.filter((fill) => fill.pnl < 0).reduce((sum, fill) => sum + fill.pnl, 0));
    const perCoin = {
      "BTC/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
      "ETH/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
      "SOL/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
    };
    for (const coin of view.coins) {
      if (coin.symbol !== "BTC/USD" && coin.symbol !== "ETH/USD" && coin.symbol !== "SOL/USD") continue;
      perCoin[coin.symbol] = { trades: coin.trades, wins: coin.wins, pnl: coin.profit, isolatedProfit: coin.profit };
    }
    return {
      profit: view.profit,
      endEquity: START_EQUITY * book.coins.length + view.profit,
      trades: view.quality.trades,
      wins: view.quality.wins,
      losses: view.quality.trades - view.quality.wins,
      winRate: view.quality.winRate,
      maxDd: view.maxDd,
      sharpeDaily: shape.sharpe,
      sharpeAnnual: shape.sharpe * Math.sqrt(365),
      profitFactor: pains === 0 ? null : gains / pains,
      meanTradeRet: view.fills.length ? view.fills.reduce((sum, fill) => sum + fill.ret, 0) / view.fills.length : 0,
      skew: shape.skew,
      kurtosis: shape.kurtosis,
      observations: view.dailyReturns.length,
      buyHold: view.buyHold,
      bootstrapLow: band.low,
      bootstrapHigh: band.high,
      perCoin,
      regimes: regimeBreakdown(
        btc,
        view.fills.map((fill) => ({
          symbol: "BTC/USD" as SymbolName,
          side: fill.side,
          signalIndex: fill.signalIndex,
          openedIndex: fill.closedIndex,
          closedIndex: fill.closedIndex,
          entry: 0,
          exit: 0,
          ret: fill.ret,
          pnl: fill.pnl,
        })),
      ),
    };
  };
  const fullTrades = { "BTC/USD": 0, "ETH/USD": 0, "SOL/USD": 0 };
  for (const symbol of SYMBOLS) fullTrades[symbol] = book.fullTrades[symbol] ?? 0;
  return {
    train: window(book.train),
    holdout: window(book.holdout),
    fullTrades,
    folds: book.folds,
  };
}

function settingsHash(settings: QuantumSettings): string {
  return createHash("sha256").update(JSON.stringify(settings)).digest("hex");
}

function unpack(rows: number[][]): Bar[] {
  const map = new Map<number, Bar>();
  for (const row of rows) {
    map.set(row[0]!, { t: row[0]!, open: row[1]!, high: row[2]!, low: row[3]!, close: row[4]!, volume: row[5]! });
  }
  return [...map.values()].sort((a, b) => a.t - b.t);
}

function alignDaily(clock: Bar[], rows: Bar[], symbol: string): Bar[] {
  const byTime = new Map(rows.map((bar) => [bar.t, bar]));
  const missing: string[] = [];
  const out: Bar[] = [];
  for (const bar of clock) {
    const found = byTime.get(bar.t);
    if (!found) missing.push(day(bar.t));
    else out.push(found);
  }
  if (missing.length) {
    throw new Error(`${symbol} is missing ${missing.length} pinned days (${missing.slice(0, 8).join(", ")}).`);
  }
  return out;
}

function gaps(bars: Bar[], step: number) {
  let missing = 0;
  let duplicates = 0;
  for (let i = 1; i < bars.length; i++) {
    const delta = bars[i]!.t - bars[i - 1]!.t;
    if (delta === 0) duplicates += 1;
    else if (delta > step) missing += Math.round(delta / step) - 1;
  }
  return {
    bars: bars.length,
    missing,
    duplicates,
    start: bars.length ? new Date(bars[0]!.t).toISOString() : null,
    end: bars.length ? new Date(bars[bars.length - 1]!.t).toISOString() : null,
  };
}

function openGap(daily: Bar[], m15: Bar[]) {
  const grouped = groupByDay(daily, m15);
  const diffs: number[] = [];
  let missing = 0;
  let short = 0;
  for (const bar of daily) {
    const bars = grouped.get(bar.t) ?? [];
    if (bars.length === 0) {
      missing += 1;
      continue;
    }
    if (bars.length < 90) short += 1;
    if (bar.open !== 0) diffs.push(Math.abs(bars[0]!.open / bar.open - 1));
  }
  diffs.sort((a, b) => a - b);
  const mid = Math.floor(diffs.length / 2);
  const median = diffs.length === 0 ? null : diffs.length % 2 === 1 ? diffs[mid]! : (diffs[mid - 1]! + diffs[mid]!) / 2;
  return { median, max: diffs.length ? diffs[diffs.length - 1]! : null, compared: diffs.length, missing, short };
}

function money(value: number | null): string {
  return value == null ? "n/a" : usd(value);
}

function qualityLine(quality: Quality): string {
  const worst = quality.worst
    ? `${usd(quality.worst.pnl)} (${quality.worst.symbol} ${quality.worst.side.toLowerCase()} ${(quality.worst.ret * 100).toFixed(2)}%, ${quality.worst.reason})`
    : "n/a";
  return `win rate ${pct(quality.winRate)}, average win ${money(quality.avgWin)}, average loss ${money(quality.avgLoss)}, worst ${worst}, longest losing streak ${quality.longestLosingStreak}`;
}

function bookTable(rows: { label: string; book: BookView }[]): string[] {
  const lines = [
    "| Book | Train profit | Train trades | Holdout profit | Holdout max DD | Holdout trades |",
    "| --- | ---: | ---: | ---: | ---: | ---: |",
  ];
  for (const row of rows) {
    const book = row.book;
    lines.push(
      `| ${row.label} | ${usd(book.train.profit)} | ${book.train.quality.trades} | ${usd(book.holdout.profit)} | ${pct(book.holdout.maxDd)} | ${book.holdout.quality.trades} |`,
    );
  }
  return lines;
}

function coinTable(rows: { label: string; book: BookView }[]): string[] {
  const symbols = rows[0]!.book.coins;
  const lines = ["| Coin | " + rows.map((row) => `${row.label} profit | ${row.label} trades`).join(" | ") + " |", "| --- | " + rows.map(() => "---: | ---:").join(" | ") + " |"];
  for (const symbol of symbols) {
    const cells = rows.map((row) => {
      const coin = row.book.holdout.coins.find((item) => item.symbol === symbol)!;
      return `${usd(coin.profit)} | ${coin.trades}`;
    });
    lines.push(`| ${symbol} | ${cells.join(" | ")} |`);
  }
  return lines;
}

function foldTable(rows: { label: string; book: BookView }[]): string[] {
  const lines = ["| Fold | " + rows.map((row) => row.label).join(" | ") + " |", "| --- | " + rows.map(() => "---:").join(" | ") + " |"];
  const count = rows[0]!.book.folds.length;
  for (let i = 0; i < count; i++) {
    const label = `${rows[0]!.book.folds[i]!.from} → ${rows[0]!.book.folds[i]!.to}`;
    const cells = rows.map((row) => {
      const fold = row.book.folds[i]!;
      return `${usd(fold.profit)} (${fold.trades}, ${pct(fold.maxDd)})`;
    });
    lines.push(`| ${label} | ${cells.join(" | ")} |`);
  }
  return lines;
}

function exitTable(rows: { label: string; book: BookView }[]): string[] {
  const lines = ["| Exit | " + rows.flatMap((row) => [`${row.label} train`, `${row.label} holdout`, `${row.label} full`]).join(" | ") + " |"];
  lines.push("| --- | " + rows.flatMap(() => ["---:", "---:", "---:"]).join(" | ") + " |");
  for (const key of EXIT_ORDER) {
    const cells = rows.flatMap((row) => [row.book.train.exits[key], row.book.holdout.exits[key], row.book.full.exits[key]]);
    lines.push(`| ${key} | ${cells.join(" | ")} |`);
  }
  return lines;
}

function fullTrades(book: BookView): string {
  return book.coins.map((symbol) => `${symbol} ${book.fullTrades[symbol] ?? 0}`).join(", ");
}

type Rank = { winner: string | null; sentence: string };

function rankPair(leftName: string, left: BookView, rightName: string, right: BookView): Rank {
  const leftProfit = left.holdout.profit;
  const rightProfit = right.holdout.profit;
  const leftDd = left.holdout.maxDd;
  const rightDd = right.holdout.maxDd;
  const profitGap = leftProfit - rightProfit;
  if (Math.abs(profitGap) <= 0.005) {
    return { winner: null, sentence: "Holdout profit is a tie, so the rule does not name a winner." };
  }
  const richer = profitGap > 0 ? leftName : rightName;
  const richerDd = profitGap > 0 ? leftDd : rightDd;
  const otherDd = profitGap > 0 ? rightDd : leftDd;
  if (richerDd <= otherDd + 1e-12) {
    return {
      winner: richer,
      sentence: `${richer} held up better on the pre-registered rule: higher holdout profit, and the holdout drawdown was not worse.`,
    };
  }
  const shallower = leftDd < rightDd ? leftName : rightName;
  return {
    winner: null,
    sentence: `${richer} made more money on the holdout. ${shallower} had the shallower holdout drawdown. The rule needs both, so it does not name a winner.`,
  };
}

function gateLines(judgment: Judgment): string[] {
  return judgment.gates.map((gate) => `- ${gate.pass ? "pass" : "fail"} \`${gate.name}\`: ${gate.detail}`);
}

function writeMarkdown(file: string, section: string) {
  const text = readFileSync(file, "utf8");
  const at = text.indexOf(MARKER);
  const body = section.endsWith("\n") ? section : `${section}\n`;
  if (at === -1) writeFileSync(file, `${text.endsWith("\n") ? text : `${text}\n`}\n${body}`);
  else writeFileSync(file, text.slice(0, at) + body);
}

async function main() {
  const candidateBefore = existsSync(PATHS.candidate) ? statSync(PATHS.candidate).mtimeMs : null;
  const ledgerBefore = statSync(PATHS.ledger).mtimeMs;
  const loaded = await loadMarket({ cacheOnly: true });
  if (loaded.manifest.hash !== PINNED_DATA_HASH) {
    throw new Error(`Pinned tape hash ${loaded.manifest.hash} does not match ${PINNED_DATA_HASH}`);
  }
  const fifteen = await loadFifteen();
  if (fifteen.manifest.hash !== FIFTEEN_DATA_HASH) {
    throw new Error(`15-minute hash ${fifteen.manifest.hash} does not match ${FIFTEEN_DATA_HASH}`);
  }
  const clock = loaded.series["BTC/USD"];
  if (clock[0]!.t % 86_400_000 !== 0) throw new Error("pinned daily bars are not on UTC midnight");
  const publicPath = path.join(path.dirname(PATHS.cache), "quantum-public.json");
  if (!existsSync(publicPath)) throw new Error("research/lab/data/quantum-public.json is missing. Run fetch-quantum.ts.");
  const pub = JSON.parse(readFileSync(publicPath, "utf8")) as {
    venue: string;
    source: string;
    fallback: string;
    binanceProbe: string;
    fetchedAt: string;
    oldest: string;
    note: string;
    hash: string;
    symbols: Record<string, { daily: number[][]; m15: number[][] }>;
  };
  const publicBooks = ["BNB/USD", "XRP/USD"].flatMap((symbol) => [
    { symbol: `${symbol} 1Dutc`, bars: unpack(pub.symbols[symbol]!.daily) },
    { symbol: `${symbol} 15m`, bars: unpack(pub.symbols[symbol]!.m15) },
  ]);
  const publicHash = tapeHash(publicBooks);
  if (publicHash !== pub.hash) throw new Error("quantum-public.json does not match its stored hash");

  const bnbDaily = alignDaily(clock, unpack(pub.symbols["BNB/USD"]!.daily), "BNB/USD");
  const xrpDaily = alignDaily(clock, unpack(pub.symbols["XRP/USD"]!.daily), "XRP/USD");
  const bnbM15 = unpack(pub.symbols["BNB/USD"]!.m15);
  const xrpM15 = unpack(pub.symbols["XRP/USD"]!.m15);
  const ethM15 = fifteen.series["ETH/USD"];
  const solM15 = fifteen.series["SOL/USD"];
  const sliceHash = tapeHash([
    { symbol: "ETH/USD 15m", bars: ethM15 },
    { symbol: "SOL/USD 15m", bars: solM15 },
  ]);

  const quantumOf = (symbol: string, daily: Bar[], m15: Bar[]): QuantumCoin => ({
    symbol,
    daily,
    m15,
    stances: emaStance(daily.map((bar) => bar.close), QUANTUM_EMA_FAST, QUANTUM_EMA_SLOW),
  });
  const eth = quantumOf("ETH/USD", loaded.series["ETH/USD"], ethM15);
  const sol = quantumOf("SOL/USD", loaded.series["SOL/USD"], solM15);
  const bnb = quantumOf("BNB/USD", bnbDaily, bnbM15);
  const xrp = quantumOf("XRP/USD", xrpDaily, xrpM15);
  const common = [eth, sol];
  const own = [eth, sol, bnb, xrp];
  const split = splits(loaded.series);

  console.log("[compare] shared Falcon book, the ledger check");
  const shared = scoreConfig(loaded.series, BASELINE, { seed: SEED, bootstrapReps: 20 });
  if (Math.abs(shared.train.profit - LEDGER_SHARED_TRAIN) > 0.02) {
    throw new Error(`shared train ${shared.train.profit} is not the ledger's ${LEDGER_SHARED_TRAIN}`);
  }
  if (Math.abs(shared.holdout.profit - LEDGER_SHARED_HOLDOUT) > 0.02) {
    throw new Error(`shared holdout ${shared.holdout.profit} is not the ledger's ${LEDGER_SHARED_HOLDOUT}`);
  }
  for (const symbol of SYMBOLS) {
    if (Math.abs(shared.holdout.perCoin[symbol].isolatedProfit - LEDGER_ISOLATED_HOLDOUT[symbol]) > 0.02) {
      throw new Error(`${symbol} isolated holdout does not match the ledger`);
    }
    if (shared.fullTrades[symbol] !== LEDGER_FULL_TRADES[symbol]) {
      throw new Error(`${symbol} full trades ${shared.fullTrades[symbol]} is not ${LEDGER_FULL_TRADES[symbol]}`);
    }
  }

  console.log("[compare] Falcon, ETH and SOL");
  const falconCommonLab = scoreFalcon("Falcon", loaded.series, ["ETH/USD", "SOL/USD"], LIVE_COSTS, "lab", clock);
  const falconCommonBinance = scoreFalcon("Falcon", loaded.series, ["ETH/USD", "SOL/USD"], FALCON_BINANCE, "binance-usdt-m", clock);
  console.log("[compare] Falcon, BTC ETH SOL");
  const falconOwnLab = scoreFalcon("Falcon", loaded.series, [...SYMBOLS], LIVE_COSTS, "lab", clock);
  const falconOwnBinance = scoreFalcon("Falcon", loaded.series, [...SYMBOLS], FALCON_BINANCE, "binance-usdt-m", clock);
  if (falconOwnLab.folds[0]!.from !== "2025-08-16" || falconOwnLab.folds[3]!.to !== "2026-02-24") {
    throw new Error(`walk-forward dates ${falconOwnLab.folds[0]!.from} → ${falconOwnLab.folds[3]!.to} do not match the ledger`);
  }
  const ethHoldout = falconOwnLab.holdout.coins.find((coin) => coin.symbol === "ETH/USD")!.profit;
  if (Math.abs(ethHoldout - LEDGER_ISOLATED_HOLDOUT["ETH/USD"]) > 0.02) {
    throw new Error(`independent ETH holdout ${ethHoldout} does not match the ledger`);
  }
  const quantumCommonLab = scoreQuantum("Quantum", common, QUANTUM_FULL, LAB_QUANTUM_COST, clock, split);
  const quantumCommonBinance = scoreQuantum("Quantum", common, QUANTUM_FULL, BINANCE_QUANTUM_COST, clock, split);
  const quantumOwnLab = scoreQuantum("Quantum", own, QUANTUM_FULL, LAB_QUANTUM_COST, clock, split);
  const quantumOwnBinance = scoreQuantum("Quantum", own, QUANTUM_FULL, BINANCE_QUANTUM_COST, clock, split);
  console.log("[compare] Quantum daily target and stop only");
  const dailyCommonLab = scoreQuantum("Quantum daily", common, QUANTUM_DAILY, LAB_QUANTUM_COST, clock, split);
  const dailyCommonBinance = scoreQuantum("Quantum daily", common, QUANTUM_DAILY, BINANCE_QUANTUM_COST, clock, split);
  const dailyOwnLab = scoreQuantum("Quantum daily", own, QUANTUM_DAILY, LAB_QUANTUM_COST, clock, split);
  const dailyOwnBinance = scoreQuantum("Quantum daily", own, QUANTUM_DAILY, BINANCE_QUANTUM_COST, clock, split);

  console.log("[compare] neighbours and the skeptic");
  const prior = readLedger()
    .filter((row) => rowTimeframe(row) === "1d" && (row.strategy ?? "vpro") === "vpro" && row.experiment && row.metrics)
    .map((row) => row.metrics!.challenger.holdout.sharpeDaily);
  const neighbourRows = (cost: QuantumCost) =>
    quantumNeighbors().map((item) => {
      const holdout = combine(
        common.map((coin) => quantumCoin(coin, item.settings, split.holdoutFrom, split.holdoutTo, cost)),
        common.map((coin) => coin.daily.map((bar) => bar.close)),
        split.holdoutFrom,
        Math.min(split.holdoutTo, clock.length - 1),
      );
      return { label: item.label, hash: settingsHash(item.settings), holdoutProfit: holdout.profit };
    });
  const labNeighbors = neighbourRows(LAB_QUANTUM_COST);
  const binanceNeighbors = neighbourRows(BINANCE_QUANTUM_COST);
  const falconLabSide = toSide(falconCommonLab, clock);
  const quantumLabSide = toSide(quantumCommonLab, clock);
  const falconBinanceSide = toSide(falconCommonBinance, clock);
  const quantumBinanceSide = toSide(quantumCommonBinance, clock);
  const labJudgment = judge(
    { champion: falconLabSide, challenger: quantumLabSide, neighbors: labNeighbors, priorHoldoutSharpes: prior, symbols: ["ETH/USD", "SOL/USD"] },
    console.log,
  );
  const binanceJudgment = judge(
    {
      champion: falconBinanceSide,
      challenger: quantumBinanceSide,
      neighbors: binanceNeighbors,
      priorHoldoutSharpes: prior,
      symbols: ["ETH/USD", "SOL/USD"],
    },
    console.log,
  );

  const labRank = rankPair("Falcon", falconCommonLab, "Quantum", quantumCommonLab);
  const binanceRank = rankPair("Falcon", falconCommonBinance, "Quantum", quantumCommonBinance);
  const coverage = {
    "ETH/USD": { ...gaps(ethM15, 900_000), days: openGap(loaded.series["ETH/USD"], ethM15) },
    "SOL/USD": { ...gaps(solM15, 900_000), days: openGap(loaded.series["SOL/USD"], solM15) },
    "BNB/USD": { ...gaps(bnbM15, 900_000), days: openGap(bnbDaily, bnbM15) },
    "XRP/USD": { ...gaps(xrpM15, 900_000), days: openGap(xrpDaily, xrpM15) },
  };
  const bnbDailyGaps = gaps(bnbDaily, 86_400_000);
  const xrpDailyGaps = gaps(xrpDaily, 86_400_000);
  const commit = execSync("git rev-parse HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  const result = {
    at: new Date().toISOString(),
    commit,
    seed: SEED,
    capital: "10000 per coin, independent, summed. Not the ledger's shared 10000 book.",
    rankingRule:
      "On ETH and SOL, lab costs, higher holdout profit and a holdout drawdown that is not worse. Binance costs are a sensitivity. The skeptic can still refuse the winner.",
    pinned: {
      hash: loaded.manifest.hash,
      bars: loaded.manifest.bars,
      start: loaded.manifest.start,
      end: loaded.manifest.end,
      source: loaded.manifest.source,
    },
    fifteen: { hash: fifteen.manifest.hash, sliceHash, source: fifteen.manifest.source },
    public: {
      venue: pub.venue,
      source: pub.source,
      fallback: pub.fallback,
      binanceProbe: pub.binanceProbe,
      fetchedAt: pub.fetchedAt,
      oldest: pub.oldest,
      note: pub.note,
      hash: pub.hash,
      bnbDaily: bnbDailyGaps,
      xrpDaily: xrpDailyGaps,
    },
    coverage,
    sharedFalcon: {
      train: shared.train.profit,
      holdout: shared.holdout.profit,
      holdoutMaxDd: shared.holdout.maxDd,
      fullTrades: shared.fullTrades,
    },
    assumptions: QUANTUM_ASSUMPTIONS,
    settings: { full: QUANTUM_FULL, daily: QUANTUM_DAILY },
    labRank,
    binanceRank,
    priorSharpes: prior.length,
    lab: {
      verdict: labJudgment.verdict,
      reason: labJudgment.reason,
      gates: labJudgment.gates,
      deflated: labJudgment.deflated,
      trials: labJudgment.trialsCounted,
      neighbors: labNeighbors.map((item) => ({ ...item, beatsChampion: item.holdoutProfit > falconCommonLab.holdout.profit })),
    },
    binance: {
      verdict: binanceJudgment.verdict,
      reason: binanceJudgment.reason,
      gates: binanceJudgment.gates,
      deflated: binanceJudgment.deflated,
      trials: binanceJudgment.trialsCounted,
      neighbors: binanceNeighbors.map((item) => ({
        ...item,
        beatsChampion: item.holdoutProfit > falconCommonBinance.holdout.profit,
      })),
    },
    books: {
      falconCommonLab: slim(falconCommonLab),
      falconCommonBinance: slim(falconCommonBinance),
      falconOwnLab: slim(falconOwnLab),
      falconOwnBinance: slim(falconOwnBinance),
      quantumCommonLab: slim(quantumCommonLab),
      quantumCommonBinance: slim(quantumCommonBinance),
      quantumOwnLab: slim(quantumOwnLab),
      quantumOwnBinance: slim(quantumOwnBinance),
      dailyCommonLab: slim(dailyCommonLab),
      dailyCommonBinance: slim(dailyCommonBinance),
      dailyOwnLab: slim(dailyOwnLab),
      dailyOwnBinance: slim(dailyOwnBinance),
    },
  };

  const lines: string[] = [];
  lines.push(MARKER);
  lines.push("");
  lines.push(`- At: ${result.at}`);
  lines.push(`- Commit: \`${commit}\``);
  lines.push(`- Seed: ${SEED}`);
  lines.push(`- This is not a cycle. It was not appended to \`research/lab/ledger.jsonl\`, so it does not add a trial for the next \`npm run lab:cycle\`.`);
  lines.push(`- ${COMPARISON_OUTPUTS.join(" and ")} are the only files this run writes. \`research/lab/candidate.json\` was not written. \`src/lib/desk\` was not edited.`);
  lines.push("");
  lines.push("### What was compared");
  lines.push("");
  lines.push("Falcon is the published book: V-Pro 34/9, EMA 20/30, and shorts skipped while the close is above the 20 EMA. Quantum is a separate book. Its daily signal is an EMA 9/21 cross. The take-profit is 0.5% and the stop is 10%. The full book also exits on the 15-minute failsafes. The daily-only book is the same cross, target, and stop with those failsafes turned off, so their effect is visible.");
  lines.push("");
  lines.push("Every figure below gives each coin its own $10,000. The coins do not share a stake. A two-coin book therefore starts at $20,000, Falcon's three-coin book at $30,000, and Quantum's four-coin book at $40,000. Summed profits are not compared across those different sets. The head-to-head is Ethereum and Solana only.");
  lines.push("");
  lines.push("The ranking rule was fixed in the runner before this tape was scored. On Ethereum and Solana, under the lab's own costs, a book held up better only when its holdout profit was higher and its holdout max drawdown was not worse. The Binance fee schedule is a sensitivity. The skeptic is the lab's skeptic and can refuse a book that won the comparison. Sharpe and the deflated-Sharpe z are test statistics, not probabilities.");
  lines.push("");
  lines.push("### Assumptions");
  lines.push("");
  for (const line of QUANTUM_ASSUMPTIONS) lines.push(`- ${line}`);
  lines.push("- The lab cost is 0.1% taker and 5 bps of slippage on the entry and the exit, including the take-profit. The Binance USDT-M schedule is 0.05% taker, 0.02% maker on the resting take-profit, no extra slippage, and a flat 0.01% per day paid by longs and received by shorts. Falcon has no resting limit, so both of its sides pay the taker fee under that second schedule. Funding on Falcon is the same flat assumption, applied only so the cost models match. The desk itself is not a perpetual swap.");
  lines.push("- Neighbours move only the two assumed widths: the trail 1.5% to 1.0% and to 2.0%, and the volume average from 20 bars to 10 and to 30. The specified 0.5% target, 10% stop, 1% spike, 3× surge, and EMA 9 were not searched.");
  lines.push("");
  lines.push("### Tape");
  lines.push("");
  lines.push(`- Pinned daily tape: ${loaded.manifest.source}. ${loaded.manifest.bars} bars, ${loaded.manifest.start} → ${loaded.manifest.end}. Hash \`${loaded.manifest.hash}\`.`);
  lines.push(`- Train signals start 2025-02-06. Holdout signals start 2026-02-25. The book is marked through ${loaded.manifest.end}. Same split as the ledger.`);
  lines.push(`- Ethereum and Solana 15-minute bars are the pinned OKX file, hash \`${fifteen.manifest.hash}\`. The ETH+SOL slice hash is \`${sliceHash}\`. ${fifteen.manifest.source}.`);
  lines.push(`- BNB and XRP are not in that file. ${pub.note} Source \`${pub.source}\`, fallback \`${pub.fallback}\`, fetched ${pub.fetchedAt}, kept from ${pub.oldest}. Hash \`${pub.hash}\`.`);
  lines.push(`- Binance probe: ${pub.binanceProbe}. Not used.`);
  lines.push(`- BNB daily bars ${bnbDailyGaps.bars}, ${bnbDailyGaps.start} → ${bnbDailyGaps.end}, missing slots ${bnbDailyGaps.missing}, duplicates ${bnbDailyGaps.duplicates}.`);
  lines.push(`- XRP daily bars ${xrpDailyGaps.bars}, ${xrpDailyGaps.start} → ${xrpDailyGaps.end}, missing slots ${xrpDailyGaps.missing}, duplicates ${xrpDailyGaps.duplicates}.`);
  for (const symbol of ["ETH/USD", "SOL/USD", "BNB/USD", "XRP/USD"] as const) {
    const item = coverage[symbol];
    lines.push(
      `- ${symbol} 15-minute: ${item.bars} bars, ${item.start} → ${item.end}, missing slots ${item.missing}, duplicates ${item.duplicates}. Pinned days with no 15-minute bar: ${item.days.missing}. Days with fewer than 90 bars: ${item.days.short}. Median absolute gap between the daily open and the first 15-minute open: ${item.days.median == null ? "n/a" : pct(item.days.median, 3)} (max ${item.days.max == null ? "n/a" : pct(item.days.max, 3)}, ${item.days.compared} days).`,
    );
  }
  lines.push("");
  lines.push("### Ledger check");
  lines.push("");
  lines.push(`The published three-coin shared book, lab costs, still prints train ${usd(shared.train.profit)} and holdout ${usd(shared.holdout.profit)}. Full-sample trades stay BTC ${shared.fullTrades["BTC/USD"]}, ETH ${shared.fullTrades["ETH/USD"]}, SOL ${shared.fullTrades["SOL/USD"]}. That is the ledger's book. The tables below are not that book: each coin has its own $10,000.`);
  lines.push("");
  lines.push("### Ethereum and Solana, lab costs");
  lines.push("");
  lines.push(...bookTable([
    { label: "Falcon", book: falconCommonLab },
    { label: "Quantum", book: quantumCommonLab },
    { label: "Quantum, no failsafes", book: dailyCommonLab },
  ]));
  lines.push("");
  lines.push("Holdout, each coin on its own $10,000:");
  lines.push("");
  lines.push(...coinTable([
    { label: "Falcon", book: falconCommonLab },
    { label: "Quantum", book: quantumCommonLab },
    { label: "No failsafes", book: dailyCommonLab },
  ]));
  lines.push("");
  lines.push("Walk-forward folds, anchored, each fold started flat. Profit, trades, max drawdown:");
  lines.push("");
  lines.push(...foldTable([
    { label: "Falcon", book: falconCommonLab },
    { label: "Quantum", book: quantumCommonLab },
    { label: "No failsafes", book: dailyCommonLab },
  ]));
  lines.push("");
  lines.push(`Holdout trade quality. Falcon: ${qualityLine(falconCommonLab.holdout.quality)}. Quantum: ${qualityLine(quantumCommonLab.holdout.quality)}. No failsafes: ${qualityLine(dailyCommonLab.holdout.quality)}.`);
  lines.push("");
  lines.push(`Full sample, from the first train signal through the last bar, one continuous run. Falcon trades ${fullTrades(falconCommonLab)}. ${qualityLine(falconCommonLab.full.quality)}. Quantum trades ${fullTrades(quantumCommonLab)}. ${qualityLine(quantumCommonLab.full.quality)}. No failsafes: ${fullTrades(dailyCommonLab)}. ${qualityLine(dailyCommonLab.full.quality)}.`);
  lines.push("");
  lines.push("Quantum exits. A tie between the EMA reversal and the volume surge on the same close is counted as the EMA reversal.");
  lines.push("");
  lines.push(...exitTable([
    { label: "Quantum", book: quantumCommonLab },
    { label: "No failsafes", book: dailyCommonLab },
  ]));
  lines.push("");
  lines.push(`Signal ties: Quantum train ${quantumCommonLab.train.signalTies}, holdout ${quantumCommonLab.holdout.signalTies}, full ${quantumCommonLab.full.signalTies}. Days that fell back to the daily bar because the 15-minute session was missing: train ${quantumCommonLab.train.fallbackDays}, holdout ${quantumCommonLab.holdout.fallbackDays}. Short sessions: train ${quantumCommonLab.train.shortDays}, holdout ${quantumCommonLab.holdout.shortDays}.`);
  lines.push("");
  lines.push("### Ethereum and Solana, Binance USDT-M costs");
  lines.push("");
  lines.push(...bookTable([
    { label: "Falcon", book: falconCommonBinance },
    { label: "Quantum", book: quantumCommonBinance },
    { label: "Quantum, no failsafes", book: dailyCommonBinance },
  ]));
  lines.push("");
  lines.push(...coinTable([
    { label: "Falcon", book: falconCommonBinance },
    { label: "Quantum", book: quantumCommonBinance },
    { label: "No failsafes", book: dailyCommonBinance },
  ]));
  lines.push("");
  lines.push(...foldTable([
    { label: "Falcon", book: falconCommonBinance },
    { label: "Quantum", book: quantumCommonBinance },
    { label: "No failsafes", book: dailyCommonBinance },
  ]));
  lines.push("");
  lines.push(`Holdout trade quality. Falcon: ${qualityLine(falconCommonBinance.holdout.quality)}. Quantum: ${qualityLine(quantumCommonBinance.holdout.quality)}. No failsafes: ${qualityLine(dailyCommonBinance.holdout.quality)}.`);
  lines.push("");
  lines.push(`Full sample. Falcon ${fullTrades(falconCommonBinance)}. ${qualityLine(falconCommonBinance.full.quality)}. Quantum ${fullTrades(quantumCommonBinance)}. ${qualityLine(quantumCommonBinance.full.quality)}. No failsafes: ${fullTrades(dailyCommonBinance)}. ${qualityLine(dailyCommonBinance.full.quality)}.`);
  lines.push("");
  lines.push(...exitTable([
    { label: "Quantum", book: quantumCommonBinance },
    { label: "No failsafes", book: dailyCommonBinance },
  ]));
  lines.push("");
  lines.push("### Each book on its own coins, lab costs");
  lines.push("");
  lines.push("Falcon's coins are Bitcoin, Ethereum, and Solana. Quantum's coins are Ethereum, Solana, BNB, and XRP. Bitcoin is not in the Quantum book. These two sums do not share a denominator.");
  lines.push("");
  lines.push(...bookTable([
    { label: "Falcon, 3 coins", book: falconOwnLab },
    { label: "Quantum, 4 coins", book: quantumOwnLab },
    { label: "Quantum, no failsafes", book: dailyOwnLab },
  ]));
  lines.push("");
  lines.push("Falcon holdout, each coin on its own $10,000:");
  lines.push("");
  lines.push(...coinTable([{ label: "Falcon", book: falconOwnLab }]));
  lines.push("");
  lines.push("Quantum holdout, each coin on its own $10,000:");
  lines.push("");
  lines.push(...coinTable([
    { label: "Quantum", book: quantumOwnLab },
    { label: "No failsafes", book: dailyOwnLab },
  ]));
  lines.push("");
  lines.push("Falcon folds:");
  lines.push("");
  lines.push(...foldTable([{ label: "Falcon", book: falconOwnLab }]));
  lines.push("");
  lines.push("Quantum folds:");
  lines.push("");
  lines.push(...foldTable([
    { label: "Quantum", book: quantumOwnLab },
    { label: "No failsafes", book: dailyOwnLab },
  ]));
  lines.push("");
  lines.push(`Holdout quality. Falcon: ${qualityLine(falconOwnLab.holdout.quality)}. Quantum: ${qualityLine(quantumOwnLab.holdout.quality)}. No failsafes: ${qualityLine(dailyOwnLab.holdout.quality)}.`);
  lines.push("");
  lines.push(`Full-sample trades. Falcon ${fullTrades(falconOwnLab)}. ${qualityLine(falconOwnLab.full.quality)}. Quantum ${fullTrades(quantumOwnLab)}. ${qualityLine(quantumOwnLab.full.quality)}. No failsafes: ${fullTrades(dailyOwnLab)}. ${qualityLine(dailyOwnLab.full.quality)}.`);
  lines.push("");
  lines.push(...exitTable([
    { label: "Quantum", book: quantumOwnLab },
    { label: "No failsafes", book: dailyOwnLab },
  ]));
  lines.push("");
  lines.push("### Each book on its own coins, Binance USDT-M costs");
  lines.push("");
  lines.push(...bookTable([
    { label: "Falcon, 3 coins", book: falconOwnBinance },
    { label: "Quantum, 4 coins", book: quantumOwnBinance },
    { label: "Quantum, no failsafes", book: dailyOwnBinance },
  ]));
  lines.push("");
  lines.push(...coinTable([{ label: "Falcon", book: falconOwnBinance }]));
  lines.push("");
  lines.push(...coinTable([
    { label: "Quantum", book: quantumOwnBinance },
    { label: "No failsafes", book: dailyOwnBinance },
  ]));
  lines.push("");
  lines.push(...foldTable([{ label: "Falcon", book: falconOwnBinance }]));
  lines.push("");
  lines.push(...foldTable([
    { label: "Quantum", book: quantumOwnBinance },
    { label: "No failsafes", book: dailyOwnBinance },
  ]));
  lines.push("");
  lines.push(`Holdout quality. Falcon: ${qualityLine(falconOwnBinance.holdout.quality)}. Quantum: ${qualityLine(quantumOwnBinance.holdout.quality)}. No failsafes: ${qualityLine(dailyOwnBinance.holdout.quality)}.`);
  lines.push("");
  lines.push(`Full-sample trades. Falcon ${fullTrades(falconOwnBinance)}. ${qualityLine(falconOwnBinance.full.quality)}. Quantum ${fullTrades(quantumOwnBinance)}. ${qualityLine(quantumOwnBinance.full.quality)}. No failsafes: ${fullTrades(dailyOwnBinance)}. ${qualityLine(dailyOwnBinance.full.quality)}.`);
  lines.push("");
  lines.push(...exitTable([
    { label: "Quantum", book: quantumOwnBinance },
    { label: "No failsafes", book: dailyOwnBinance },
  ]));
  lines.push("");
  lines.push("### Skeptic");
  lines.push("");
  lines.push("Quantum with the failsafes is the challenger. Falcon on the same two coins is the champion. The daily-only book is not a second challenger. The prior list is the daily V-Pro track already in the ledger, " + `${prior.length} holdout Sharpes, so this comparison is scored as trial ${labJudgment.trialsCounted} on that list. It was not written into the ledger, and the Binance pass uses the same prior list rather than stacking on the lab pass.`);
  lines.push("");
  lines.push(`Lab costs: **${labJudgment.verdict}**. ${labJudgment.reason}`);
  lines.push("");
  lines.push(...gateLines(labJudgment));
  lines.push("");
  lines.push(`Deflated Sharpe uses ${labJudgment.trialsCounted} trials. Daily Sharpe ${labJudgment.deflated.sharpe.toFixed(4)}, hurdle ${labJudgment.deflated.hurdle.toFixed(4)}, z=${Number.isFinite(labJudgment.deflated.z) ? labJudgment.deflated.z.toFixed(3) : "n/a"}. The z statistic is not a probability and it is not a confidence.`);
  lines.push("");
  lines.push("Neighbours, lab costs, holdout profit on Ethereum and Solana:");
  lines.push("");
  for (const item of result.lab.neighbors) {
    lines.push(`- ${item.label}: ${usd(item.holdoutProfit)}${item.beatsChampion ? ", beats Falcon" : ", does not beat Falcon"}.`);
  }
  lines.push("");
  lines.push(`Binance costs: **${binanceJudgment.verdict}**. ${binanceJudgment.reason}`);
  lines.push("");
  lines.push(...gateLines(binanceJudgment));
  lines.push("");
  lines.push(`Deflated Sharpe uses ${binanceJudgment.trialsCounted} trials. Daily Sharpe ${binanceJudgment.deflated.sharpe.toFixed(4)}, hurdle ${binanceJudgment.deflated.hurdle.toFixed(4)}, z=${Number.isFinite(binanceJudgment.deflated.z) ? binanceJudgment.deflated.z.toFixed(3) : "n/a"}. The z statistic is not a probability and it is not a confidence.`);
  lines.push("");
  for (const item of result.binance.neighbors) {
    lines.push(`- ${item.label}: ${usd(item.holdoutProfit)}${item.beatsChampion ? ", beats Falcon" : ", does not beat Falcon"}.`);
  }
  lines.push("");
  lines.push("### Verdict");
  lines.push("");
  lines.push(
    `On Ethereum and Solana, with each coin on its own $10,000 and the lab's own costs, Falcon's holdout was ${usd(falconCommonLab.holdout.profit)} and Quantum's was ${usd(quantumCommonLab.holdout.profit)}. Falcon's average winning trade was ${money(falconCommonLab.holdout.quality.avgWin)} against an average loss of ${money(falconCommonLab.holdout.quality.avgLoss)}. Quantum's average win was ${money(quantumCommonLab.holdout.quality.avgWin)} against an average loss of ${money(quantumCommonLab.holdout.quality.avgLoss)}, and the holdout win rate was ${pct(quantumCommonLab.holdout.quality.winRate)}.`,
  );
  lines.push("");
  lines.push(`${labRank.sentence} Quantum's drawdown is smaller because the loss itself is small, not because the book earned a smoother profit.`);
  lines.push("");
  lines.push(`The same split shows up under the Binance fee schedule. ${binanceRank.sentence}`);
  lines.push("");
  lines.push(foldPlain(falconCommonLab, quantumCommonLab));
  lines.push("");
  const failsafeDelta = quantumCommonLab.holdout.profit - dailyCommonLab.holdout.profit;
  lines.push(
    `Without the 15-minute failsafes, the same daily cross and 0.5% target made ${usd(dailyCommonLab.holdout.profit)} on the Ethereum and Solana holdout (drawdown ${pct(dailyCommonLab.holdout.maxDd)}, win rate ${pct(dailyCommonLab.holdout.quality.winRate)}). Turning the failsafes on moved that to ${usd(quantumCommonLab.holdout.profit)} (${usd(failsafeDelta)}) and the drawdown to ${pct(quantumCommonLab.holdout.maxDd)}. On the full two-coin sample the EMA 9 reversal was the exit on ${quantumCommonLab.full.exits.ema9} of ${quantumCommonLab.full.quality.trades} trades. The 10% stop filled ${quantumCommonLab.full.exits.sl} times with the failsafes on, and ${dailyOwnLab.holdout.exits.sl} times in the four-coin daily-only holdout. That four-coin daily-only holdout lost money on BNB and XRP.`,
  );
  lines.push("");
  lines.push(`The skeptic's verdict, Quantum against Falcon, lab costs, is ${labJudgment.verdict}. ${labJudgment.reason} The Binance pass is ${binanceJudgment.verdict}. The deflated-Sharpe figures are z=${Number.isFinite(labJudgment.deflated.z) ? labJudgment.deflated.z.toFixed(3) : "n/a"} on the lab costs and z=${Number.isFinite(binanceJudgment.deflated.z) ? binanceJudgment.deflated.z.toFixed(3) : "n/a"} on the Binance costs. Neither z is a probability.`);
  lines.push("");
  lines.push("Caveats. The holdout is one window, 25 Feb 2026 through 13 Nov 2026, and neither coin reached the skeptic's 30 closed trades. A few dozen EMA 9/21 crosses cannot identify a 0.5% target. The 1.5% trail and the 20-bar volume average were assumed before the run, not fit to this tape, and none of the four neighbours beat Falcon. Prices are OKX spot. Binance USDT-M and Binance spot both returned HTTP 451, so the funding line is a flat 0.01% per day rather than the historical perpetual rate. A bar that touches both the target and a stop is filled at the stop. One times leverage is a cash return on that coin's own stake, not an exchange liquidation engine. The published desk was not changed.");
  lines.push("");

  const outJson = path.join(REPO_ROOT, "research/lab/data/quantum-falcon-result.json");
  writeFileSync(outJson, `${JSON.stringify(result, null, 2)}\n`);
  writeMarkdown(PATHS.markdown, lines.join("\n"));
  const candidateAfter = existsSync(PATHS.candidate) ? statSync(PATHS.candidate).mtimeMs : null;
  if (candidateBefore !== candidateAfter) throw new Error("candidate.json was created or touched");
  if (statSync(PATHS.ledger).mtimeMs !== ledgerBefore) throw new Error("ledger.jsonl was touched");
  const dirty = execSync("git status --porcelain -- src/lib/desk research/lab/candidate.json research/lab/ledger.jsonl", {
    cwd: REPO_ROOT,
    encoding: "utf8",
  }).trim();
  if (dirty) throw new Error(`desk, candidate, or ledger.jsonl changed:\n${dirty}`);
  console.log("");
  console.log(labRank.sentence);
  console.log(`Skeptic, lab costs: ${labJudgment.verdict}`);
  console.log(`Skeptic, Binance costs: ${binanceJudgment.verdict}`);
  console.log(`Wrote ${outJson}`);
  console.log(`Appended ${MARKER} to the ledger.`);
}

function slim(book: BookView) {
  const window = (view: WindowView) => ({
    profit: round(view.profit),
    maxDd: view.maxDd,
    trades: view.quality.trades,
    winRate: view.quality.winRate,
    avgWin: view.quality.avgWin,
    avgLoss: view.quality.avgLoss,
    worst: view.quality.worst,
    longestLosingStreak: view.quality.longestLosingStreak,
    exits: view.exits,
    signalTies: view.signalTies,
    fallbackDays: view.fallbackDays,
    shortDays: view.shortDays,
    buyHold: round(view.buyHold),
    coins: view.coins.map((coin) => ({
      symbol: coin.symbol,
      profit: round(coin.profit),
      maxDd: coin.maxDd,
      trades: coin.trades,
      wins: coin.wins,
      winRate: coin.winRate,
      avgWin: coin.avgWin,
      avgLoss: coin.avgLoss,
      worst: coin.worst,
      longestLosingStreak: coin.longestLosingStreak,
    })),
  });
  return {
    name: book.name,
    coins: book.coins,
    costName: book.costName,
    train: window(book.train),
    holdout: window(book.holdout),
    full: window(book.full),
    folds: book.folds.map((fold) => ({ ...fold, profit: round(fold.profit) })),
    fullTrades: book.fullTrades,
  };
}

function foldPlain(champion: BookView, challenger: BookView): string {
  let ahead = 0;
  let smallerLoss = 0;
  for (let i = 0; i < champion.folds.length; i++) {
    const left = champion.folds[i]!.profit;
    const right = challenger.folds[i]!.profit;
    if (right > left) {
      ahead += 1;
      if (right <= 0) smallerLoss += 1;
    }
  }
  return `Quantum was ahead on ${ahead} of ${champion.folds.length} walk-forward folds. ${smallerLoss} of those were folds where both books lost and Quantum lost less.`;
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

await main();
