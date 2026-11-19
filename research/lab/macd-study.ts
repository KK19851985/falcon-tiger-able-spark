/**
 * MACD signal-event study on the Binance USDT-M 15-minute archive.
 *
 *   npm run lab:macd
 *
 * Research only. This does not edit src/lib/desk and does not write
 * research/lab/candidate.json. The markdown ledger gets a headline that is
 * not a V-Pro or Livermore trial and is not appended to ledger.jsonl.
 *
 * Rules fixed before the tape is scored:
 * - Every signal is its own trade. Entry is the next bar's open.
 * - Horizon is 20 bars. A bar that trades the stop and the target fills the stop.
 * - A finished horizon is marked at the close. It is not a loss by decree.
 * - Binance cost is 0.05% taker plus 2 bps slippage, both sides, no funding.
 *   The lab cost is 0.1% taker plus 5 bps, both sides, no funding.
 * - The confirmatory family is the Binance cost on the 10-coin USDT-M tape:
 *   4 timeframes × 3 MACD settings × 6 signal types × 12 ATR brackets.
 *   A cell with fewer than 30 holdout trades is not in that family.
 * - Benjamini-Hochberg q and the bootstrap ends are procedure outputs.
 *   They are not probabilities. The deflated-Sharpe z is not a probability.
 * - A positive-edge claim also has to pass cellSurvives(), including the
 *   non-overlapping holdout interval and the lab cost, and then the skeptic.
 */
import { execSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { SEED, START_EQUITY, TRAIN_START, HOLDOUT_START } from "./constants.ts";
import { netReturn, type CostModel } from "./execute.ts";
import { num, pct } from "./format.ts";
import { tapeHash } from "./hash.ts";
import { COINS } from "./livermore-quantum.ts";
import { loadMarket } from "./market.ts";
import {
  ATR_LEN,
  BH_RULE,
  BINANCE_TAKER_COST,
  DRIFT_BARS,
  EMA_TREND,
  HORIZON,
  LAB_COST,
  MACD_PRESETS,
  MIN_CLAIM_N,
  MIN_FAMILY_N,
  MIN_FOLD_N,
  PIVOT_WING,
  DIV_ACTIVE,
  SLOPE_BARS,
  SIGNAL_NAMES,
  STOPS,
  TARGETS,
  VOL_LOOKBACK,
  benjaminiHochberg,
  bootstrapMean,
  bootstrapMeanDiff,
  cellSurvives,
  collectEvents,
  contrastClaim,
  gradeOriginal,
  gridAt,
  gridCount,
  mixSeed,
  mulberry32,
  nonOverlapping,
  priceTrade,
  resampleFactor,
  resampleWeeks,
  resolveTrade,
  runBracketBook,
  runBuyAndHold,
  signedReturn,
  summarize,
  tvMacd,
  welchT,
  alignClosed,
  type BookEvent,
  type FeatureEvent,
  type Priced,
  type Quantiles,
  type SignalType,
  type TradeSummary,
} from "./macd-stats.ts";
import { PATHS, REPO_ROOT } from "./paths.ts";
import { judge, type Judgment } from "./skeptic.ts";
import { blockBootstrapProfit, buyAndHold, deflatedSharpe, moments, regimeBreakdown } from "./stats.ts";
import { foldBounds } from "./tester.ts";
import type { Bar, FoldScore, SideMetrics, SymbolName, WindowMetrics } from "./types.ts";

const REPS = Number(process.argv.find((arg) => arg.startsWith("--reps="))?.split("=")[1] ?? 1000);
const TAPE = path.join(path.dirname(PATHS.cache), "livermore-15m.json");
const OUT_JSON = path.join(path.dirname(PATHS.cache), "macd-signal-study.json");
const OUT_CELLS = path.join(path.dirname(PATHS.cache), "macd-signal-cells.csv");
const OUT_CONTEXT = path.join(path.dirname(PATHS.cache), "macd-signal-context.csv");
const OUT_DRIFT = path.join(path.dirname(PATHS.cache), "macd-signal-drift.csv");
const OUT_MD = path.join(REPO_ROOT, "docs/MACD_SIGNAL_STUDY.md");
const LEDGER_MARK = "## MACD signal study — not a cycle";
const DRIFT_CI = [1, 5, 10, 20, 50];
const REF_TARGET = 1.5;
const REF_STOP = 1;

const FRAMES = [
  { name: "15m", factor: 1, ms: 15 * 60 * 1000 },
  { name: "1h", factor: 4, ms: 60 * 60 * 1000 },
  { name: "4h", factor: 16, ms: 4 * 60 * 60 * 1000 },
  { name: "1d", factor: 96, ms: 24 * 60 * 60 * 1000 },
] as const;

type FrameName = (typeof FRAMES)[number]["name"];

const COST_MODELS = [
  { name: "binance" as const, cost: BINANCE_TAKER_COST },
  { name: "lab" as const, cost: LAB_COST },
];

type ContrastDef = {
  name: string;
  yes: (event: FeatureEvent) => boolean;
  no: (event: FeatureEvent) => boolean;
  skipTf?: readonly string[];
};

const CONTRASTS: ContrastDef[] = [
  { name: "price on the trade side of EMA200", yes: (e) => e.priceSide === 1, no: (e) => e.priceSide === 0 },
  { name: "EMA200 slope agrees", yes: (e) => e.slopeSide === 1, no: (e) => e.slopeSide === 0 },
  { name: "ATR percentile low vs high", yes: (e) => e.vol === 0, no: (e) => e.vol === 2 },
  { name: "histogram agrees", yes: (e) => e.histSide === 1, no: (e) => e.histSide === 0 },
  { name: "regular divergence", yes: (e) => e.divergence === 1, no: (e) => e.divergence === 0 },
  { name: "higher-timeframe MACD agrees", yes: (e) => e.htf === 1, no: (e) => e.htf === 0 },
  { name: "US session vs Asia", yes: (e) => e.session === 2, no: (e) => e.session === 0, skipTf: ["1d"] },
  {
    name: "weekend vs weekday",
    yes: (e) => e.dow === 0 || e.dow === 6,
    no: (e) => e.dow !== 0 && e.dow !== 6,
  },
];

type Panel = "usdt-m" | "usdt-m-3" | "pinned";

type Cell = {
  panel: Panel;
  tf: string;
  macd: string;
  signal: SignalType;
  signalName: string;
  target: number;
  stop: number;
  cost: "binance" | "lab";
  trainN: number;
  holdN: number;
  trainMeanR: number;
  holdMeanR: number;
  trainMeanRet: number;
  holdMeanRet: number;
  holdHit: number;
  holdBeGross: number;
  holdBeCost: number;
  holdPf: number | null;
  holdMedianBars: number;
  mfe: Quantiles;
  mae: Quantiles;
  holdBootLow: number;
  holdBootHigh: number;
  holdRetLow: number;
  holdRetHigh: number;
  tStat: number;
  pGreater: number;
  bhQ: number | null;
  plainTrainN: number;
  plainTrainMean: number;
  plainHoldN: number;
  plainHoldMean: number;
  plainHoldBootLow: number;
  plainHoldBootHigh: number;
  plainSharpe: number;
  plainSkew: number;
  plainKurtosis: number;
  foldsPositive: number;
  foldsScored: number;
  hits: number;
  stops: number;
  timeouts: number;
  censored: number;
  survives: boolean;
};

type ContextRow = {
  panel: Panel;
  tf: string;
  macd: string;
  signal: SignalType;
  signalName: string;
  contrast: string;
  holdYes: number;
  holdNo: number;
  trainYes: number;
  trainNo: number;
  yesHoldMean: number;
  noHoldMean: number;
  yesHoldLow: number;
  noHoldLow: number;
  trainDiff: number;
  holdDiff: number;
  holdDiffLow: number;
  holdDiffHigh: number;
  pTwo: number;
  bhQ: number | null;
  claim: "yes" | "no" | null;
};

type DriftRow = {
  panel: Panel;
  tf: string;
  macd: string;
  signal: SignalType;
  signalName: string;
  h: number;
  n: number;
  signalMean: number;
  controlMean: number;
  diff: number;
  low: number | null;
  high: number | null;
  signalNet: number;
  controlNet: number;
};

type OriginalRow = {
  tf: string;
  macd: string;
  signal: SignalType;
  signalName: string;
  originalN: number;
  originalHits: number;
  originalHitRate: number;
  ignored: number;
  correctedN: number;
  correctedHitRate: number;
};

type Split = { trainFrom: number; trainTo: number; holdoutFrom: number; holdoutTo: number };

type Fold = { from: number; to: number; last: boolean };

const ASSUMPTIONS = [
  "Prices for the confirmatory sample are Binance USDT-M 15-minute klines from data.binance.vision, futures/um, ten coins, no API key. Higher timeframes are resampled from those bars. A bucket that is short a 15-minute bar is dropped.",
  "The pinned daily tape is the lab's bundled daily series plus the saved extension, BTC/USD, ETH/USD and SOL/USD only. It is a different market from the USDT-M archive and is not in the confirmatory family.",
  "MACD is the TradingView definition: EMA seeded with an SMA, fast minus slow, signal EMA of that line. The settings are 12/26/9, 8/21/5 and 5/35/5. ATR is Wilder 14.",
  "A signal-line cross is below zero when the MACD line on that bar is negative, and above zero otherwise. A zero-line cross on the same bar is a second event. Events are not one slot.",
  "The fill is the next bar's open. The bracket is that entry plus or minus the signal bar's ATR. The same bar cannot be seen before it closes, and a higher-timeframe MACD value is used only after that higher bar has closed.",
  "Horizon is 20 bars from the entry bar. Stop before target. A gap through the stop fills at the open. A gap through the target fills at the target. A completed horizon exits at that close and is a timeout, not a failure. A trade that runs off the tape is censored at the last close.",
  "R is the net return divided by the fractional distance to the stop. Costs are charged on the entry and the exit. The Binance model is 0.05% taker and 2 bps slippage per side. The lab model is 0.1% and 5 bps per side. Funding was not applied: the historical funding print was not fetched.",
  "Train and holdout on the USDT-M tape use the archive's own train and holdout timestamps. Walk-forward folds are the lab's four anchored folds inside the train. The pinned daily tape uses 2025-02-06 and 2026-02-25.",
  "The random-entry baseline takes the same side at a bar in the same UTC weekday and session, outside a 20-bar window around the signal. The drift is the signed close-to-close move from the entry open, 1 to 50 bars.",
  "Context tags are known at the signal close: EMA200 side and 20-bar slope, ATR percentile over 200 bars, histogram change, regular divergence with pivot wing 5 active for 10 bars, and the higher timeframe's already-closed MACD histogram. Unknown tags are left out of that split.",
  "Benjamini-Hochberg is applied to the one-sided Student-t tail of holdout mean R on the Binance family. A second family is the Welch tail of each context contrast that has 100 holdout trades on both sides. q is not a probability.",
  "The skeptic is the lab's unchanged judge, run on a one-position-per-coin book against buy-and-hold after the same costs. Its deflated-Sharpe trial count is that book's neighbour set. The search across the grid is charged in the event-study BH and in a separate deflated Sharpe on non-overlapping trade R. Neither z is a probability.",
  `Bootstrap resample count is ${REPS}, seed ${SEED}, moving blocks of about sqrt(N). The 2.5 and 97.5 percent order statistics are a resampling summary, not a confidence that a true edge sits inside them.`,
];

function mainLog(line: string) {
  console.error(`[macd] ${line}`);
}

type Tape = {
  books: { symbol: string; bars: Bar[] }[];
  hash: string;
  trainStart: number;
  holdoutStart: number;
  start: string;
  end: string;
  source: string;
};

function loadTape(): Tape {
  const file = JSON.parse(readFileSync(TAPE, "utf8")) as {
    hash: string;
    trainStart: number;
    holdoutStart: number;
    source: string;
    symbols: Record<string, number[][]>;
  };
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
  const hash = tapeHash(books);
  if (hash !== file.hash) throw new Error(`tape hash ${hash} does not match ${file.hash}`);
  const first = books[0]!.bars[0]!.t;
  const last = books[0]!.bars[books[0]!.bars.length - 1]!.t;
  return {
    books,
    hash,
    trainStart: file.trainStart,
    holdoutStart: file.holdoutStart,
    start: new Date(first).toISOString(),
    end: new Date(last).toISOString(),
    source: file.source,
  };
}

function clockOf(bars: Bar[], trainStart: number, holdoutStart: number): Split {
  const trainFrom = bars.findIndex((bar) => bar.t >= trainStart);
  const holdoutFrom = bars.findIndex((bar) => bar.t >= holdoutStart);
  if (trainFrom < 0 || holdoutFrom < 0 || holdoutFrom <= trainFrom) {
    throw new Error("train/holdout stamps do not fall on this series");
  }
  return { trainFrom, trainTo: holdoutFrom - 1, holdoutFrom, holdoutTo: bars.length - 1 };
}

function foldsOf(split: Split): Fold[] {
  try {
    const bounds = foldBounds(split.trainFrom, split.trainTo);
    return bounds.map((bound, index) => ({ from: bound.from, to: bound.to, last: index === bounds.length - 1 }));
  } catch {
    return [];
  }
}

function which(index: number, split: Split): "pre" | "train" | "holdout" {
  if (index < split.trainFrom) return "pre";
  if (index < split.holdoutFrom) return "train";
  return "holdout";
}

function inFold(index: number, fold: Fold): boolean {
  if (index < fold.from) return false;
  return fold.last ? index <= fold.to : index < fold.to;
}

function htfOf(name: FrameName, daily: Bar[], source: Bar[]): { bars: Bar[]; ms: number } {
  if (name === "15m") return { bars: resampleFactor(source, 4, 60 * 60 * 1000), ms: 60 * 60 * 1000 };
  if (name === "1h") return { bars: resampleFactor(source, 16, 4 * 60 * 60 * 1000), ms: 4 * 60 * 60 * 1000 };
  if (name === "4h") return { bars: resampleFactor(source, 96, 24 * 60 * 60 * 1000), ms: 24 * 60 * 60 * 1000 };
  return { bars: resampleWeeks(daily), ms: 7 * 24 * 60 * 60 * 1000 };
}

function frameBars(source: Bar[][], spec: (typeof FRAMES)[number]): Bar[][] {
  if (spec.factor === 1) return source;
  return source.map((bars) => resampleFactor(bars, spec.factor, spec.ms));
}

function assertClock(books: Bar[][]) {
  const n = books[0]!.length;
  for (const bars of books) {
    if (bars.length !== n) throw new Error("resampled series differ in length");
    if (bars[0]!.t !== books[0]![0]!.t || bars[n - 1]!.t !== books[0]![n - 1]!.t) {
      throw new Error("resampled series are not on one clock");
    }
  }
}

function eventsFor(frame: Bar[][], tf: FrameName, fast: number, slow: number, signal: number, daily: Bar[][], raw: Bar[][]): BookEvent[] {
  const spec = FRAMES.find((row) => row.name === tf)!;
  const out: BookEvent[] = [];
  for (let coin = 0; coin < frame.length; coin++) {
    const higher = htfOf(tf, daily[coin]!, raw[coin]!);
    const hist = tvMacd(
      higher.bars.map((bar) => bar.close),
      fast,
      slow,
      signal,
    ).hist;
    const aligned = alignClosed(frame[coin]!, spec.ms, higher.bars, higher.ms, hist);
    for (const event of collectEvents(frame[coin]!, fast, slow, signal, aligned)) out.push({ ...event, coin });
  }
  out.sort((a, b) => a.entryIndex - b.entryIndex || a.coin - b.coin);
  return out;
}

function indexesFor(events: BookEvent[], type: SignalType, split: Split, window: "train" | "holdout"): number[] {
  const out: number[] = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i]!;
    if (event.type !== type) continue;
    if (which(event.entryIndex, split) === window) out.push(i);
  }
  return out;
}

function pack(events: BookEvent[], priced: Priced[], indexes: number[]) {
  const trades: Priced[] = [];
  const entries: { entry: number; atr: number }[] = [];
  const rs: number[] = [];
  const rets: number[] = [];
  for (const index of indexes) {
    const trade = priced[index]!;
    trades.push(trade);
    entries.push({ entry: events[index]!.entry, atr: events[index]!.atr });
    rs.push(trade.netR);
    rets.push(trade.netRet);
  }
  return { trades, entries, rs, rets };
}

function plainOf(events: BookEvent[], priced: Priced[], indexes: number[]) {
  const subset = indexes.map((index) => events[index]!);
  const exits = indexes.map((index) => priced[index]!.exitIndex);
  const kept = nonOverlapping(subset, exits);
  const rs = kept.map((local) => priced[indexes[local]!]!.netR);
  return { n: rs.length, rs };
}

function foldScore(events: BookEvent[], priced: Priced[], indexes: number[], folds: Fold[]) {
  let foldsPositive = 0;
  let foldsScored = 0;
  for (const fold of folds) {
    const inside = indexes.filter((index) => inFold(events[index]!.entryIndex, fold));
    if (inside.length < MIN_FOLD_N) continue;
    foldsScored += 1;
    let sum = 0;
    for (const index of inside) sum += priced[index]!.netR;
    if (sum / inside.length > 0) foldsPositive += 1;
  }
  return { foldsPositive, foldsScored };
}

function emptySummary(): TradeSummary {
  const q = { p10: Number.NaN, p25: Number.NaN, p50: Number.NaN, p75: Number.NaN, p90: Number.NaN };
  return {
    n: 0,
    hits: 0,
    stops: 0,
    timeouts: 0,
    censored: 0,
    hitRate: 0,
    meanR: 0,
    meanRet: 0,
    profitFactor: 0,
    medianBars: Number.NaN,
    sdR: 0,
    sharpe: 0,
    skew: 0,
    kurtosis: 3,
    tStat: 0,
    pGreater: 1,
    mfe: q,
    mae: q,
    beGross: Number.NaN,
    beCostMedian: Number.NaN,
  };
}

function scorePanel(input: {
  panel: Panel;
  tf: string;
  frame: Bar[][];
  raw: Bar[][];
  daily: Bar[][];
  split: Split;
  folds: Fold[];
  macdName: string;
  fast: number;
  slow: number;
  signal: number;
}): { cells: Cell[]; contexts: ContextRow[]; drifts: DriftRow[]; originals: OriginalRow[] } {
  const events = eventsFor(input.frame, input.tf as FrameName, input.fast, input.slow, input.signal, input.daily, input.raw);
  const cells: Cell[] = [];
  const contexts: ContextRow[] = [];
  const drifts = driftRows(input.panel, input.tf, input.macdName, input.frame, events);
  const originals = originalRows(input.tf, input.macdName, input.frame, events);
  const byType = SIGNAL_NAMES.map((_, type) => ({
    train: indexesFor(events, type as SignalType, input.split, "train"),
    hold: indexesFor(events, type as SignalType, input.split, "holdout"),
  }));
  for (let grid = 0; grid < gridCount(); grid++) {
    const { target, stop } = gridAt(grid);
    const resolved = events.map((event) =>
      resolveTrade(input.frame[event.coin]!, event.side, event.entryIndex, event.entry, event.atr, target, stop, HORIZON),
    );
    const priced = COST_MODELS.map((model) =>
      events.map((event, index) => priceTrade(event.side, event.entry, event.atr, stop, resolved[index]!, model.cost)),
    );
    for (let type = 0; type < SIGNAL_NAMES.length; type++) {
      const trainIdx = byType[type]!.train;
      const holdIdx = byType[type]!.hold;
      for (let c = 0; c < COST_MODELS.length; c++) {
        const model = COST_MODELS[c]!;
        const trainPack = pack(events, priced[c]!, trainIdx);
        const holdPack = pack(events, priced[c]!, holdIdx);
        const train = trainPack.trades.length
          ? summarize(trainPack.trades, target, stop, trainPack.entries, model.cost)
          : emptySummary();
        const hold = holdPack.trades.length
          ? summarize(holdPack.trades, target, stop, holdPack.entries, model.cost)
          : emptySummary();
        const bootR = bootstrapMean(holdPack.rs, mixSeed(SEED, `${input.panel}|${input.tf}|${input.macdName}|${type}|${target}|${stop}|${model.name}|r`), REPS);
        const bootRet = bootstrapMean(holdPack.rets, mixSeed(SEED, `${input.panel}|${input.tf}|${input.macdName}|${type}|${target}|${stop}|${model.name}|ret`), REPS);
        const plainTrain = plainOf(events, priced[c]!, trainIdx);
        const plainHold = plainOf(events, priced[c]!, holdIdx);
        const plainBoot = bootstrapMean(plainHold.rs, mixSeed(SEED, `${input.panel}|${input.tf}|${input.macdName}|${type}|${target}|${stop}|${model.name}|plain`), REPS);
        const plainShape = moments(plainHold.rs);
        const folds = foldScore(events, priced[c]!, trainIdx, input.folds);
        const trainPlainMean = plainTrain.rs.length ? plainTrain.rs.reduce((acc, value) => acc + value, 0) / plainTrain.rs.length : 0;
        cells.push({
          panel: input.panel,
          tf: input.tf,
          macd: input.macdName,
          signal: type as SignalType,
          signalName: SIGNAL_NAMES[type]!,
          target,
          stop,
          cost: model.name,
          trainN: train.n,
          holdN: hold.n,
          trainMeanR: train.meanR,
          holdMeanR: hold.meanR,
          trainMeanRet: train.meanRet,
          holdMeanRet: hold.meanRet,
          holdHit: hold.hitRate,
          holdBeGross: hold.beGross,
          holdBeCost: hold.beCostMedian,
          holdPf: hold.profitFactor,
          holdMedianBars: hold.medianBars,
          mfe: hold.mfe,
          mae: hold.mae,
          holdBootLow: bootR.low,
          holdBootHigh: bootR.high,
          holdRetLow: bootRet.low,
          holdRetHigh: bootRet.high,
          tStat: hold.tStat,
          pGreater: hold.n >= MIN_FAMILY_N ? hold.pGreater : 1,
          bhQ: null,
          plainTrainN: plainTrain.n,
          plainTrainMean: trainPlainMean,
          plainHoldN: plainHold.n,
          plainHoldMean: plainHold.rs.length ? plainHold.rs.reduce((acc, value) => acc + value, 0) / plainHold.rs.length : 0,
          plainHoldBootLow: plainBoot.low,
          plainHoldBootHigh: plainBoot.high,
          plainSharpe: plainShape.sharpe,
          plainSkew: plainShape.skew,
          plainKurtosis: plainShape.kurtosis,
          foldsPositive: folds.foldsPositive,
          foldsScored: folds.foldsScored,
          hits: hold.hits,
          stops: hold.stops,
          timeouts: hold.timeouts,
          censored: hold.censored,
          survives: false,
        });
      }
    }
    if (target === REF_TARGET && stop === REF_STOP) {
      contexts.push(
        ...contextRows(input.panel, input.tf, input.macdName, events, priced[0]!, input.split),
      );
    }
  }
  return { cells, contexts, drifts, originals };
}

function contextRows(panel: Panel, tf: string, macd: string, events: BookEvent[], priced: Priced[], split: Split): ContextRow[] {
  const rows: ContextRow[] = [];
  for (let type = 0; type < SIGNAL_NAMES.length; type++) {
    for (const contrast of CONTRASTS) {
      if (contrast.skipTf?.includes(tf)) continue;
      rows.push(contrastOf(panel, tf, macd, type as SignalType, contrast, events, priced, split));
    }
  }
  return rows;
}

function contrastOf(
  panel: Panel,
  tf: string,
  macd: string,
  type: SignalType,
  contrast: ContrastDef,
  events: BookEvent[],
  priced: Priced[],
  split: Split,
): ContextRow {
  const yesTrain: number[] = [];
  const noTrain: number[] = [];
  const yesHold: number[] = [];
  const noHold: number[] = [];
  for (let i = 0; i < events.length; i++) {
    const event = events[i]!;
    if (event.type !== type) continue;
    const window = which(event.entryIndex, split);
    if (window === "pre") continue;
    const yes = contrast.yes(event);
    const no = contrast.no(event);
    if (!yes && !no) continue;
    const dest = window === "holdout" ? (yes ? yesHold : noHold) : yes ? yesTrain : noTrain;
    dest.push(priced[i]!.netR);
  }
  const mean = (values: number[]) => (values.length ? values.reduce((acc, value) => acc + value, 0) / values.length : 0);
  const tested = yesHold.length >= MIN_CLAIM_N && noHold.length >= MIN_CLAIM_N;
  const welch = tested ? welchT(yesHold, noHold) : { diff: mean(yesHold) - mean(noHold), t: Number.NaN, df: Number.NaN, pTwo: 1 };
  const yesBoot = tested
    ? bootstrapMean(yesHold, mixSeed(SEED, `${panel}|${tf}|${macd}|${type}|${contrast.name}|yes`), REPS)
    : { low: Number.NaN, high: Number.NaN, mean: mean(yesHold) };
  const noBoot = tested
    ? bootstrapMean(noHold, mixSeed(SEED, `${panel}|${tf}|${macd}|${type}|${contrast.name}|no`), REPS)
    : { low: Number.NaN, high: Number.NaN, mean: mean(noHold) };
  const diffBoot = tested
    ? bootstrapMeanDiff(yesHold, noHold, mixSeed(SEED, `${panel}|${tf}|${macd}|${type}|${contrast.name}|diff`), REPS)
    : { low: Number.NaN, high: Number.NaN, mean: welch.diff };
  return {
    panel,
    tf,
    macd,
    signal: type,
    signalName: SIGNAL_NAMES[type]!,
    contrast: contrast.name,
    holdYes: yesHold.length,
    holdNo: noHold.length,
    trainYes: yesTrain.length,
    trainNo: noTrain.length,
    yesHoldMean: mean(yesHold),
    noHoldMean: mean(noHold),
    yesHoldLow: yesBoot.low,
    noHoldLow: noBoot.low,
    trainDiff: mean(yesTrain) - mean(noTrain),
    holdDiff: diffBoot.mean,
    holdDiffLow: diffBoot.low,
    holdDiffHigh: diffBoot.high,
    pTwo: welch.pTwo,
    bhQ: null,
    claim: null,
  };
}

function driftRows(panel: Panel, tf: string, macd: string, frame: Bar[][], events: BookEvent[]): DriftRow[] {
  const controls = controlIndexes(frame, events, mixSeed(SEED, `${panel}|${tf}|${macd}|drift`));
  const rows: DriftRow[] = [];
  for (let type = 0; type < SIGNAL_NAMES.length; type++) {
    const idx = events.map((_, index) => index).filter((index) => events[index]!.type === type);
    for (let h = 1; h <= DRIFT_BARS; h++) {
      let signalSum = 0;
      let controlSum = 0;
      let signalNet = 0;
      let controlNet = 0;
      let n = 0;
      const diffs: number[] = [];
      const wantCi = macd === "12/26/9" && DRIFT_CI.includes(h);
      for (const index of idx) {
        const event = events[index]!;
        const bars = frame[event.coin]!;
        const control = controls[index]!;
        if (event.entryIndex + h - 1 >= bars.length || control + h - 1 >= bars.length) continue;
        const signalRet = signedReturn(event.side, event.entry, bars[event.entryIndex + h - 1]!.close);
        const controlEntry = bars[control]!.open;
        const controlRet = signedReturn(event.side, controlEntry, bars[control + h - 1]!.close);
        if (!Number.isFinite(signalRet) || !Number.isFinite(controlRet)) continue;
        signalSum += signalRet;
        controlSum += controlRet;
        signalNet += netReturn(event.side, event.entry, bars[event.entryIndex + h - 1]!.close, BINANCE_TAKER_COST);
        controlNet += netReturn(event.side, controlEntry, bars[control + h - 1]!.close, BINANCE_TAKER_COST);
        n += 1;
        if (wantCi) diffs.push(signalRet - controlRet);
      }
      let low: number | null = null;
      let high: number | null = null;
      if (wantCi && diffs.length >= 2) {
        const band = bootstrapMean(diffs, mixSeed(SEED, `${panel}|${tf}|${macd}|${type}|h${h}`), REPS);
        low = band.low;
        high = band.high;
      }
      rows.push({
        panel,
        tf,
        macd,
        signal: type as SignalType,
        signalName: SIGNAL_NAMES[type]!,
        h,
        n,
        signalMean: n ? signalSum / n : 0,
        controlMean: n ? controlSum / n : 0,
        diff: n ? (signalSum - controlSum) / n : 0,
        low,
        high,
        signalNet: n ? signalNet / n : 0,
        controlNet: n ? controlNet / n : 0,
      });
    }
  }
  return rows;
}

function controlIndexes(frame: Bar[][], events: BookEvent[], seed: number): number[] {
  const pools = frame.map((bars) => {
    const buckets = new Map<number, number[]>();
    const all: number[] = [];
    for (let i = 0; i < bars.length - DRIFT_BARS; i++) {
      all.push(i);
      const stamp = bars[i]!.t;
      const hour = new Date(stamp).getUTCHours();
      const session = hour < 8 ? 0 : hour < 16 ? 1 : 2;
      const key = new Date(stamp).getUTCDay() * 3 + session;
      const list = buckets.get(key);
      if (list) list.push(i);
      else buckets.set(key, [i]);
    }
    return { buckets, all };
  });
  const rng = mulberry32(seed);
  return events.map((event) => {
    const pool = pools[event.coin]!;
    const stamp = frame[event.coin]![event.entryIndex]!.t;
    const hour = new Date(stamp).getUTCHours();
    const session = hour < 8 ? 0 : hour < 16 ? 1 : 2;
    const key = new Date(stamp).getUTCDay() * 3 + session;
    const bucket = pool.buckets.get(key);
    const source = bucket && bucket.length >= 8 ? bucket : pool.all;
    if (source.length === 0) return event.entryIndex;
    for (let attempt = 0; attempt < 12; attempt++) {
      const pick = source[Math.floor(rng() * source.length)]!;
      if (Math.abs(pick - event.entryIndex) > HORIZON) return pick;
    }
    return source[Math.floor(rng() * source.length)]!;
  });
}

function originalRows(tf: string, macd: string, frame: Bar[][], events: BookEvent[]): OriginalRow[] {
  const preset = MACD_PRESETS.find((row) => row.name === macd)!;
  const totals = SIGNAL_NAMES.map(() => ({ n: 0, hits: 0, ignored: 0 }));
  for (const bars of frame) {
    const scores = gradeOriginal(bars, preset.fast, preset.slow, preset.signal, REF_TARGET, REF_STOP);
    scores.forEach((score, type) => {
      totals[type]!.n += score.n;
      totals[type]!.hits += score.hits;
      totals[type]!.ignored += score.ignored;
    });
  }
  const corrected = SIGNAL_NAMES.map(() => ({ n: 0, hits: 0 }));
  for (const event of events) {
    const resolved = resolveTrade(frame[event.coin]!, event.side, event.entryIndex, event.entry, event.atr, REF_TARGET, REF_STOP, HORIZON);
    if (!resolved) continue;
    corrected[event.type]!.n += 1;
    if (resolved.outcome === "target") corrected[event.type]!.hits += 1;
  }
  return SIGNAL_NAMES.map((name, type) => ({
    tf,
    macd,
    signal: type as SignalType,
    signalName: name,
    originalN: totals[type]!.n,
    originalHits: totals[type]!.hits,
    originalHitRate: totals[type]!.n ? totals[type]!.hits / totals[type]!.n : 0,
    ignored: totals[type]!.ignored,
    correctedN: corrected[type]!.n,
    correctedHitRate: corrected[type]!.n ? corrected[type]!.hits / corrected[type]!.n : 0,
  }));
}

function applyFamilies(cells: Cell[], contexts: ContextRow[]) {
  const family = cells.filter((cell) => cell.panel === "usdt-m" && cell.cost === "binance" && cell.holdN >= MIN_FAMILY_N);
  const q = benjaminiHochberg(family.map((cell) => cell.pGreater));
  family.forEach((cell, index) => {
    cell.bhQ = q[index]!;
  });
  const lab = new Map<string, Cell>();
  for (const cell of cells) {
    if (cell.cost === "lab") lab.set(cellKey(cell), cell);
  }
  for (const cell of cells) {
    if (cell.panel !== "usdt-m" || cell.cost !== "binance") continue;
    const twin = lab.get(cellKey({ ...cell, cost: "lab" }));
    if (!twin || cell.bhQ == null) continue;
    cell.survives = cellSurvives({
      trainN: cell.trainN,
      holdN: cell.holdN,
      trainMean: cell.trainMeanR,
      holdMean: cell.holdMeanR,
      holdBootLow: cell.holdBootLow,
      plainTrainN: cell.plainTrainN,
      plainTrainMean: cell.plainTrainMean,
      plainHoldN: cell.plainHoldN,
      plainHoldBootLow: cell.plainHoldBootLow,
      labHoldMean: twin.holdMeanR,
      labHoldBootLow: twin.holdBootLow,
      bhQ: cell.bhQ,
      foldsPositive: cell.foldsPositive,
      foldsScored: cell.foldsScored,
    });
  }
  const contextFamily = contexts.filter(
    (row) => row.panel === "usdt-m" && row.holdYes >= MIN_CLAIM_N && row.holdNo >= MIN_CLAIM_N,
  );
  const cq = benjaminiHochberg(contextFamily.map((row) => row.pTwo));
  contextFamily.forEach((row, index) => {
    row.bhQ = cq[index]!;
    row.claim = contrastClaim({
      holdYes: row.holdYes,
      holdNo: row.holdNo,
      trainYes: row.trainYes,
      trainNo: row.trainNo,
      trainDiff: row.trainDiff,
      holdDiffLow: row.holdDiffLow,
      holdDiffHigh: row.holdDiffHigh,
      yesHoldMean: row.yesHoldMean,
      yesHoldLow: row.yesHoldLow,
      noHoldMean: row.noHoldMean,
      noHoldLow: row.noHoldLow,
      bhQ: row.bhQ,
    });
  });
  return { familyN: family.length, contextN: contextFamily.length };
}

function cellKey(cell: Pick<Cell, "panel" | "tf" | "macd" | "signal" | "target" | "stop" | "cost">): string {
  return [cell.panel, cell.tf, cell.macd, cell.signal, cell.target, cell.stop, cell.cost].join("|");
}

function chooseCell(cells: Cell[]): { cell: Cell | null; reason: string } {
  const survivors = cells.filter((cell) => cell.survives);
  const pool = (survivors.length ? survivors : cells.filter((cell) => cell.panel === "usdt-m" && cell.cost === "binance" && cell.trainN >= MIN_CLAIM_N && cell.holdN >= MIN_CLAIM_N)).slice();
  if (pool.length === 0) {
    const fallback = cells
      .filter((cell) => cell.panel === "usdt-m" && cell.cost === "binance" && cell.holdN >= MIN_FAMILY_N)
      .sort((a, b) => b.holdMeanR - a.holdMeanR);
    return {
      cell: fallback[0] ?? null,
      reason: "No cell reached 100 train and 100 holdout trades. The skeptic book, if any, is the highest holdout mean R among cells with at least 30 holdout trades. That is not a passed claim.",
    };
  }
  pool.sort((a, b) => b.holdMeanR - a.holdMeanR || prefer(a) - prefer(b));
  return {
    cell: pool[0]!,
    reason: survivors.length
      ? "The skeptic book is the surviving cell with the highest holdout mean R."
      : "No cell survived the pre-registered bar. The skeptic book is the highest holdout mean R among cells with at least 100 train and 100 holdout trades. That selection is not itself a passed claim.",
  };
}

function prefer(cell: Cell): number {
  return (cell.macd === "12/26/9" ? 0 : 1) + (cell.target === REF_TARGET ? 0 : 2) + (cell.stop === REF_STOP ? 0 : 4) + (cell.tf === "15m" ? 0 : 8);
}

type SkepticReport = {
  label: string;
  verdict: string;
  reason: string;
  gates: { name: string; pass: boolean; detail: string }[];
  z: number;
  trials: number;
  holdoutProfit: number;
  championProfit: number;
  trades: number;
  note: string;
};

function bootBlock(tf: string): number {
  if (tf === "15m") return 96 * 10;
  if (tf === "1h") return 24 * 10;
  if (tf === "4h") return 6 * 10;
  return 10;
}

function barsPerYear(tf: string): number {
  if (tf === "15m") return 365 * 96;
  if (tf === "1h") return 365 * 24;
  if (tf === "4h") return 365 * 6;
  return 365;
}

function regimeLen(tf: string): number {
  if (tf === "15m") return 96 * 20;
  if (tf === "1h") return 24 * 20;
  if (tf === "4h") return 6 * 20;
  return 20;
}

function metricsFrom(
  frame: Bar[][],
  symbols: string[],
  events: BookEvent[],
  target: number,
  stop: number,
  cost: CostModel,
  from: number,
  to: number,
  tf: string,
  reps: number,
): WindowMetrics {
  const run = runBracketBook(frame, events, target, stop, cost, from, to, HORIZON, START_EQUITY);
  const shape = moments(run.barReturns);
  const band = reps > 0 ? blockBootstrapProfit(run.barReturns, START_EQUITY, SEED, reps, bootBlock(tf)) : { low: 0, high: 0 };
  const gains = run.fills.filter((fill) => fill.pnl > 0).reduce((acc, fill) => acc + fill.pnl, 0);
  const pains = Math.abs(run.fills.filter((fill) => fill.pnl < 0).reduce((acc, fill) => acc + fill.pnl, 0));
  const wins = run.fills.filter((fill) => fill.pnl > 0).length;
  const names = ["BTC/USD", "ETH/USD", "SOL/USD"] as const;
  const perCoin = {
    "BTC/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
    "ETH/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
    "SOL/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
  };
  for (const fill of run.fills) {
    const name = symbols[fill.coin];
    if (name !== "BTC/USD" && name !== "ETH/USD" && name !== "SOL/USD") continue;
    const coin = perCoin[name];
    coin.trades += 1;
    coin.pnl += fill.pnl;
    if (fill.pnl > 0) coin.wins += 1;
  }
  for (const name of names) {
    const coin = symbols.indexOf(name);
    if (coin < 0) continue;
    const alone = runBracketBook([frame[coin]!], events.filter((event) => event.coin === coin).map((event) => ({ ...event, coin: 0 })), target, stop, cost, from, to);
    perCoin[name].isolatedProfit = alone.profit;
  }
  const end = Math.min(to, frame[0]!.length - 1);
  return {
    profit: run.profit,
    endEquity: run.endEquity,
    trades: run.fills.length,
    wins,
    losses: run.fills.length - wins,
    winRate: run.fills.length ? wins / run.fills.length : 0,
    maxDd: run.maxDd,
    sharpeDaily: shape.sharpe,
    sharpeAnnual: shape.sharpe * Math.sqrt(barsPerYear(tf)),
    profitFactor: pains === 0 ? null : gains / pains,
    meanTradeRet: run.fills.length ? run.fills.reduce((acc, fill) => acc + fill.ret, 0) / run.fills.length : 0,
    skew: shape.skew,
    kurtosis: shape.kurtosis,
    observations: run.barReturns.length,
    buyHold: buyAndHold(
      symbols.map((_, coin) => frame[coin]!.map((bar) => bar.close)),
      from,
      end,
      START_EQUITY,
    ),
    bootstrapLow: band.low,
    bootstrapHigh: band.high,
    perCoin,
    regimes: regimeBreakdown(
      frame[0]!,
      run.fills.map((fill) => ({
        symbol: "BTC/USD" as SymbolName,
        side: fill.side,
        signalIndex: fill.signalIndex,
        openedIndex: fill.entryIndex,
        closedIndex: fill.exitIndex,
        entry: fill.entry,
        exit: fill.exit,
        ret: fill.ret,
        pnl: fill.pnl,
      })),
      regimeLen(tf),
    ),
  };
}

function holdProfit(frame: Bar[][], events: BookEvent[], target: number, stop: number, cost: CostModel, split: Split): number {
  return runBracketBook(frame, events, target, stop, cost, split.holdoutFrom, split.holdoutTo).profit;
}

function neighbourBrackets(target: number, stop: number): { target: number; stop: number }[] {
  const t = TARGETS.indexOf(target as (typeof TARGETS)[number]);
  const s = STOPS.indexOf(stop as (typeof STOPS)[number]);
  const out: { target: number; stop: number }[] = [];
  if (t > 0) out.push({ target: TARGETS[t - 1]!, stop });
  if (t >= 0 && t < TARGETS.length - 1) out.push({ target: TARGETS[t + 1]!, stop });
  if (s > 0) out.push({ target, stop: STOPS[s - 1]! });
  if (s >= 0 && s < STOPS.length - 1) out.push({ target, stop: STOPS[s + 1]! });
  return out;
}

function sideOfBook(
  frame: Bar[][],
  symbols: string[],
  events: BookEvent[],
  target: number,
  stop: number,
  cost: CostModel,
  split: Split,
  tf: string,
): SideMetrics {
  const folds: FoldScore[] = foldsOf(split).map((fold) => {
    const to = fold.last ? fold.to : Math.max(fold.from, fold.to - 1);
    const run = runBracketBook(frame, events, target, stop, cost, fold.from, to);
    return {
      from: new Date(frame[0]![fold.from]!.t).toISOString().slice(0, 10),
      to: new Date(frame[0]![Math.min(to, frame[0]!.length - 1)]!.t).toISOString().slice(0, 10),
      profit: run.profit,
      trades: run.fills.length,
      maxDd: run.maxDd,
    };
  });
  const full = runBracketBook(frame, events, target, stop, cost, split.trainFrom, split.holdoutTo);
  const fullTrades = Object.fromEntries(symbols.map((symbol) => [symbol, 0])) as SideMetrics["fullTrades"];
  for (const fill of full.fills) {
    const name = symbols[fill.coin] as SymbolName;
    fullTrades[name] = (fullTrades[name] ?? 0) + 1;
  }
  return {
    train: metricsFrom(frame, symbols, events, target, stop, cost, split.trainFrom, split.trainTo, tf, 200),
    holdout: metricsFrom(frame, symbols, events, target, stop, cost, split.holdoutFrom, split.holdoutTo, tf, 400),
    fullTrades,
    folds,
  };
}

function buyHoldSide(frame: Bar[][], symbols: string[], cost: CostModel, split: Split, tf: string): SideMetrics {
  const window = (from: number, to: number, reps: number): WindowMetrics => {
    const run = runBuyAndHold(frame, from, to, cost, START_EQUITY);
    const shape = moments(run.barReturns);
    const band = blockBootstrapProfit(run.barReturns, START_EQUITY, SEED, reps, bootBlock(tf));
    const names = ["BTC/USD", "ETH/USD", "SOL/USD"] as const;
    const perCoin = {
      "BTC/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
      "ETH/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
      "SOL/USD": { trades: 0, wins: 0, pnl: 0, isolatedProfit: 0 },
    };
    for (const name of names) {
      const coin = symbols.indexOf(name);
      if (coin < 0) continue;
      const sliced = runBuyAndHold([frame[coin]!], from, to, cost);
      perCoin[name] = {
        trades: 1,
        wins: sliced.profit > 0 ? 1 : 0,
        pnl: sliced.profit,
        isolatedProfit: sliced.profit,
      };
    }
    return {
      profit: run.profit,
      endEquity: run.endEquity,
      trades: run.fills.length,
      wins: run.fills.filter((fill) => fill.pnl > 0).length,
      losses: run.fills.filter((fill) => fill.pnl <= 0).length,
      winRate: run.fills.length ? run.fills.filter((fill) => fill.pnl > 0).length / run.fills.length : 0,
      maxDd: run.maxDd,
      sharpeDaily: shape.sharpe,
      sharpeAnnual: shape.sharpe * Math.sqrt(barsPerYear(tf)),
      profitFactor: null,
      meanTradeRet: run.fills.length ? run.fills.reduce((acc, fill) => acc + fill.ret, 0) / run.fills.length : 0,
      skew: shape.skew,
      kurtosis: shape.kurtosis,
      observations: run.barReturns.length,
      buyHold: buyAndHold(
        frame.map((bars) => bars.map((bar) => bar.close)),
        from,
        Math.min(to, frame[0]!.length - 1),
      ),
      bootstrapLow: band.low,
      bootstrapHigh: band.high,
      perCoin,
      regimes: { bull: { trades: 0, wins: 0, pnl: 0, meanRet: 0 }, bear: { trades: 0, wins: 0, pnl: 0, meanRet: 0 }, sideways: { trades: 0, wins: 0, pnl: 0, meanRet: 0 } },
    };
  };
  const folds: FoldScore[] = foldsOf(split).map((fold) => {
    const to = fold.last ? fold.to : Math.max(fold.from, fold.to - 1);
    const run = runBuyAndHold(frame, fold.from, to, cost);
    return {
      from: new Date(frame[0]![fold.from]!.t).toISOString().slice(0, 10),
      to: new Date(frame[0]![Math.min(to, frame[0]!.length - 1)]!.t).toISOString().slice(0, 10),
      profit: run.profit,
      trades: run.fills.length,
      maxDd: run.maxDd,
    };
  });
  const full = runBuyAndHold(frame, split.trainFrom, split.holdoutTo, cost);
  const fullTrades = Object.fromEntries(symbols.map((symbol) => [symbol, 0])) as SideMetrics["fullTrades"];
  for (const fill of full.fills) fullTrades[symbols[fill.coin] as SymbolName] = 1;
  return { train: window(split.trainFrom, split.trainTo, 200), holdout: window(split.holdoutFrom, split.holdoutTo, 400), fullTrades, folds };
}

function runSkeptic(input: {
  label: string;
  note: string;
  frame: Bar[][];
  symbols: string[];
  events: BookEvent[];
  target: number;
  stop: number;
  split: Split;
  tf: string;
  cost: CostModel;
  priorNote: string;
}): SkepticReport {
  const challenger = sideOfBook(input.frame, input.symbols, input.events, input.target, input.stop, input.cost, input.split, input.tf);
  const champion = buyHoldSide(input.frame, input.symbols, input.cost, input.split, input.tf);
  const neighbours = neighbourBrackets(input.target, input.stop).map((bracket) => ({
    label: `target ${bracket.target} stop ${bracket.stop}`,
    hash: `${bracket.target}/${bracket.stop}`,
    holdoutProfit: holdProfit(input.frame, input.events, bracket.target, bracket.stop, input.cost, input.split),
  }));
  const neighbourSharpes = neighbourBrackets(input.target, input.stop).map((bracket) => {
    const side = sideOfBook(input.frame, input.symbols, input.events, bracket.target, bracket.stop, input.cost, input.split, input.tf);
    return side.holdout.sharpeDaily;
  });
  const judgment: Judgment = judge(
    {
      champion,
      challenger,
      neighbors: neighbours,
      priorHoldoutSharpes: neighbourSharpes,
      symbols: input.symbols as SymbolName[],
    },
    () => {},
  );
  return {
    label: input.label,
    verdict: judgment.verdict,
    reason: judgment.reason,
    gates: judgment.gates,
    z: judgment.deflated.z,
    trials: judgment.trialsCounted,
    holdoutProfit: challenger.holdout.profit,
    championProfit: champion.holdout.profit,
    trades: challenger.holdout.trades,
    note: `${input.note} ${input.priorNote} The skeptic's own trial count is the neighbour set, ${judgment.trialsCounted}. That count does not include the grid search. The grid search is in the Benjamini-Hochberg family and in the event-study deflated Sharpe.`,
  };
}

function render(input: {
  tape: Tape;
  cells: Cell[];
  contexts: ContextRow[];
  drifts: DriftRow[];
  originals: OriginalRow[];
  familyN: number;
  contextN: number;
  skeptics: SkepticReport[];
  choice: { cell: Cell | null; reason: string };
  deflatedZ: number | null;
  deflatedHurdle: number | null;
  deflatedTrials: number;
  pinnedNote: string;
}): string {
  const survivors = input.cells.filter((cell) => cell.survives);
  const claims = input.contexts.filter((row) => row.claim);
  const above = input.cells
    .filter((cell) => cell.panel === "usdt-m" && cell.cost === "binance" && cell.holdBootLow > 0)
    .sort((a, b) => b.holdN - a.holdN || b.holdMeanR - a.holdMeanR);
  const lines: string[] = [];
  lines.push("# MACD signal study");
  lines.push("");
  lines.push(verdictParagraph(survivors, claims, input.skeptics));
  lines.push("");
  if (above.length === 0) {
    lines.push("No Binance cell on the USDT-M tape has a holdout bootstrap floor above zero.");
  } else {
    const biggest = above[0]!;
    const frames = [...new Set(above.map((cell) => cell.tf))].join(", ");
    lines.push(
      `${above.length} Binance cells have a holdout bootstrap floor above zero, all on ${frames}. The largest is ${biggest.signalName}, ${biggest.macd}, target ${biggest.target}, stop ${biggest.stop}, ${biggest.holdN} holdout trades. A floor above zero is not the claim. None of them also clears the 100-trade count, Benjamini-Hochberg, the lab-cost interval, and the walk-forward rule.`,
    );
  }
  lines.push("");
  lines.push("This is a research note. It does not change the desk, and it does not write `research/lab/candidate.json`.");
  lines.push("");
  lines.push("## Sample");
  lines.push("");
  lines.push(`USDT-M tape ${input.tape.start} → ${input.tape.end}. Hash \`${input.tape.hash}\`. ${COINS.join(", ")}. Source: ${input.tape.source}.`);
  lines.push("");
  lines.push(input.pinnedNote);
  lines.push("");
  lines.push("## How a number should be read");
  lines.push("");
  lines.push("Hit rate is targets divided by all graded trades, timeouts included. The gross breakeven hit rate at 1.5 ATR versus 1 ATR is 40 percent. The cost-adjusted breakeven is higher and is the median across the trades in that cell. A timeout is marked to market, so expectancy can be negative even when the hit rate sits above 40 percent, and positive even when it sits below.");
  lines.push("");
  lines.push("The bootstrap interval is the 2.5th and 97.5th percent of resampled means. q is the Benjamini-Hochberg score. The deflated-Sharpe z is a test statistic. None of these is a probability that the edge is real.");
  lines.push("");
  lines.push(`Confirmatory family size after dropping cells with fewer than ${MIN_FAMILY_N} holdout trades: ${input.familyN}. Context family size, both sides at least ${MIN_CLAIM_N} holdout trades, reference bracket 1.5 / 1.0, Binance cost: ${input.contextN}. The rule inside q is ${BH_RULE}, used as a cutoff for the procedure, not as a probability.`);
  lines.push("");
  lines.push("## Reference bracket, 12/26/9, target 1.5 ATR, stop 1 ATR, Binance cost, holdout");
  lines.push("");
  lines.push("| Signal | TF | N | Hit | Gross BE | Cost BE | Mean R | Boot R | Exp % | PF | Bars | Timeouts | Lab mean R | q |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |");
  const ref = input.cells
    .filter((cell) => cell.panel === "usdt-m" && cell.cost === "binance" && cell.macd === "12/26/9" && cell.target === REF_TARGET && cell.stop === REF_STOP)
    .sort((a, b) => a.signal - b.signal || a.tf.localeCompare(b.tf));
  for (const cell of ref) {
    const twin = input.cells.find((other) => other.cost === "lab" && other.tf === cell.tf && other.macd === cell.macd && other.signal === cell.signal && other.target === cell.target && other.stop === cell.stop && other.panel === cell.panel);
    lines.push(`| ${cell.signalName} | ${cell.tf} | ${cell.holdN} | ${pct(cell.holdHit, 1)} | ${pct(cell.holdBeGross, 1)} | ${pct(cell.holdBeCost, 1)} | ${num(cell.holdMeanR, 3)} | ${num(cell.holdBootLow, 3)} to ${num(cell.holdBootHigh, 3)} | ${pct(cell.holdMeanRet, 3)} | ${cell.holdPf == null ? "n/a" : num(cell.holdPf, 2)} | ${num(cell.holdMedianBars, 1)} | ${cell.timeouts} | ${twin ? num(twin.holdMeanR, 3) : "n/a"} | ${cell.bhQ == null ? "n/a" : num(cell.bhQ, 3)} |`);
  }
  lines.push("");
  lines.push("MFE and MAE percentiles for these rows are in the CSV. The median favorable excursion and the median adverse excursion, in R, sit in that file under `mfe_p50` and `mae_p50`.");
  lines.push("");
  lines.push("## Cells closest to a positive holdout");
  lines.push("");
  lines.push("Highest Binance holdout mean R among USDT-M cells with at least 100 holdout trades. A positive number here is not a claim.");
  lines.push("");
  lines.push("| Signal | MACD | TF | Target | Stop | N | Mean R | Boot low | Plain N | Plain low | Train R | Folds | q | Survives |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |");
  const top = input.cells
    .filter((cell) => cell.panel === "usdt-m" && cell.cost === "binance" && cell.holdN >= MIN_CLAIM_N)
    .sort((a, b) => b.holdMeanR - a.holdMeanR)
    .slice(0, 12);
  for (const cell of top) {
    lines.push(`| ${cell.signalName} | ${cell.macd} | ${cell.tf} | ${cell.target} | ${cell.stop} | ${cell.holdN} | ${num(cell.holdMeanR, 3)} | ${num(cell.holdBootLow, 3)} | ${cell.plainHoldN} | ${num(cell.plainHoldBootLow, 3)} | ${num(cell.trainMeanR, 3)} | ${cell.foldsPositive}/${cell.foldsScored} | ${cell.bhQ == null ? "n/a" : num(cell.bhQ, 3)} | ${cell.survives ? "yes" : "no"} |`);
  }
  if (top.length === 0) lines.push("| none | | | | | | | | | | | | | |");
  lines.push("");
  lines.push(`Cells that pass every pre-registered gate: ${survivors.length}.`);
  lines.push("");
  lines.push("## Holdout intervals above zero");
  lines.push("");
  lines.push("Every USDT-M Binance cell whose holdout bootstrap floor is above zero. Daily N is one year of resampled bars, shared across ten coins.");
  lines.push("");
  lines.push("| Signal | MACD | TF | Target | Stop | N | Mean R | Boot low | Train R | Plain low | Folds | q | Lab boot low |");
  lines.push("| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |");
  if (above.length === 0) lines.push("| none | | | | | | | | | | | | |");
  for (const cell of above) {
    const twin = input.cells.find((other) => other.panel === cell.panel && other.cost === "lab" && other.tf === cell.tf && other.macd === cell.macd && other.signal === cell.signal && other.target === cell.target && other.stop === cell.stop);
    lines.push(`| ${cell.signalName} | ${cell.macd} | ${cell.tf} | ${cell.target} | ${cell.stop} | ${cell.holdN} | ${num(cell.holdMeanR, 3)} | ${num(cell.holdBootLow, 3)} | ${num(cell.trainMeanR, 3)} | ${num(cell.plainHoldBootLow, 3)} | ${cell.foldsPositive}/${cell.foldsScored} | ${cell.bhQ == null ? "n/a" : num(cell.bhQ, 3)} | ${twin ? num(twin.holdBootLow, 3) : "n/a"} |`);
  }
  lines.push("");
  lines.push("## What the one-slot grader would have counted");
  lines.push("");
  lines.push("Full sample, 12/26/9, target 1.5, stop 1, no costs in the original hit rate. The original reconstruction keeps one open slot per type, fills at the signal close, and counts a timeout as a failed sample. Corrected N grades every signal from the next open. Ignored is the count the slot dropped.");
  lines.push("");
  lines.push("| Signal | TF | Original N | Original hit | Ignored | Corrected N | Corrected hit |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: |");
  for (const row of input.originals.filter((item) => item.macd === "12/26/9")) {
    lines.push(`| ${row.signalName} | ${row.tf} | ${row.originalN} | ${pct(row.originalHitRate, 1)} | ${row.ignored} | ${row.correctedN} | ${pct(row.correctedHitRate, 1)} |`);
  }
  lines.push("");
  lines.push("## Drift against a time-matched random entry");
  lines.push("");
  lines.push("Signed gross return from the entry open to the close `h` bars later, 12/26/9, minus the same-side random entry. The interval is on that difference. A positive difference is not a tradable edge: it is still before the bracket, and the net columns are the Binance round trip to that close.");
  lines.push("");
  lines.push("| Signal | TF | h | N | Signal | Control | Diff | Boot diff | Signal net | Control net |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |");
  for (const row of input.drifts.filter((item) => item.panel === "usdt-m" && item.macd === "12/26/9" && item.h === 20)) {
    lines.push(`| ${row.signalName} | ${row.tf} | ${row.h} | ${row.n} | ${pct(row.signalMean, 3)} | ${pct(row.controlMean, 3)} | ${pct(row.diff, 3)} | ${row.low == null ? "n/a" : `${pct(row.low, 3)} to ${pct(row.high ?? 0, 3)}`} | ${pct(row.signalNet, 3)} | ${pct(row.controlNet, 3)} |`);
  }
  lines.push("");
  lines.push("The full 1-to-50 curve is in `research/lab/data/macd-signal-drift.csv`.");
  lines.push("");
  const driftUp = input.drifts.filter((row) => row.panel === "usdt-m" && row.macd === "12/26/9" && row.h === 20 && row.low != null && row.low > 0);
  if (driftUp.length) {
    lines.push(
      `The 20-bar drift difference sits above zero for ${driftUp.map((row) => `${row.signalName} on ${row.tf} (N=${row.n})`).join("; ")}. That is a gross path, not the costed bracket, and the samples are the short daily ones.`,
    );
    lines.push("");
  }
  lines.push("## Pinned daily tape");
  lines.push("");
  lines.push("12/26/9, target 1.5, stop 1, Binance cost, holdout. The pinned tape is BTC, ETH and SOL on the bundled daily series. The USDT-M row is the same three coins resampled from the 15-minute archive, so the windows are not the same years.");
  lines.push("");
  lines.push("| Panel | Signal | N | Hit | Mean R | Boot R |");
  lines.push("| --- | --- | ---: | ---: | ---: | --- |");
  for (const cell of input.cells.filter((row) => (row.panel === "pinned" || row.panel === "usdt-m-3") && row.cost === "binance" && row.macd === "12/26/9" && row.target === REF_TARGET && row.stop === REF_STOP)) {
    lines.push(`| ${cell.panel} | ${cell.signalName} | ${cell.holdN} | ${pct(cell.holdHit, 1)} | ${num(cell.holdMeanR, 3)} | ${num(cell.holdBootLow, 3)} to ${num(cell.holdBootHigh, 3)} |`);
  }
  lines.push("");
  lines.push("## Context");
  lines.push("");
  const separated = input.contexts
    .filter((row) => row.panel === "usdt-m" && row.bhQ != null && row.bhQ <= BH_RULE && row.holdDiffLow > 0 && row.yesHoldLow <= 0)
    .sort((a, b) => b.yesHoldMean - a.yesHoldMean)
    .slice(0, 6);
  if (claims.length === 0) {
    lines.push("No context split had two adequate holdout buckets, the same sign on the train, a bootstrap difference away from zero, a positive favored mean whose own bootstrap floor is above zero, and a q score at or under the cutoff.");
    lines.push("");
    lines.push(`Separating a bad bucket from a worse one is not the same thing. ${input.contexts.filter((row) => row.panel === "usdt-m" && row.bhQ != null && row.bhQ <= BH_RULE).length} contrasts have a q score at or under the cutoff, and none of those favored buckets has a bootstrap floor above zero. The least-negative examples:`);
    lines.push("");
    lines.push("| Filter | Signal | MACD | TF | Yes N | Yes R | Yes floor | No R | q |");
    lines.push("| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |");
    for (const row of separated) {
      lines.push(`| ${row.contrast} | ${row.signalName} | ${row.macd} | ${row.tf} | ${row.holdYes} | ${num(row.yesHoldMean, 3)} | ${num(row.yesHoldLow, 3)} | ${num(row.noHoldMean, 3)} | ${num(row.bhQ ?? 1, 3)} |`);
    }
  } else {
    lines.push("Splits that cleared that bar. `yes` means the named filter was the positive bucket. `no` means the other bucket was. A row here is still not a desk change.");
    lines.push("");
    lines.push("| Contrast | Side | Signal | MACD | TF | Yes N | No N | Yes R | No R | q |");
    lines.push("| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |");
    for (const row of claims) {
      lines.push(`| ${row.contrast} | ${row.claim} | ${row.signalName} | ${row.macd} | ${row.tf} | ${row.holdYes} | ${row.holdNo} | ${num(row.yesHoldMean, 3)} | ${num(row.noHoldMean, 3)} | ${num(row.bhQ ?? 1, 3)} |`);
    }
  }
  lines.push("");
  lines.push("## Skeptic");
  lines.push("");
  lines.push(input.choice.reason);
  if (input.choice.cell) {
    const cell = input.choice.cell;
    lines.push("");
    lines.push(`Chosen cell: ${cell.signalName}, ${cell.macd}, ${cell.tf}, target ${cell.target}, stop ${cell.stop}. Holdout mean R ${num(cell.holdMeanR, 3)}. Non-overlapping holdout mean R ${num(cell.plainHoldMean, 3)} on ${cell.plainHoldN} trades.`);
  }
  lines.push("");
  if (input.deflatedZ != null) {
    lines.push(`Event-study deflated Sharpe on the chosen cell's non-overlapping holdout trade R: z=${num(input.deflatedZ, 3)}, hurdle ${input.deflatedHurdle == null ? "n/a" : num(input.deflatedHurdle, 4)}, trials ${input.deflatedTrials}. This z is not a probability. Overlapping trades were removed before this Sharpe was computed. Trades still cluster in time, so the observation count is not an independent sample.`);
    lines.push("");
  }
  if (input.skeptics.length === 0) lines.push("The skeptic was not given a book.");
  for (const row of input.skeptics) {
    lines.push(`**${row.label}.** Verdict ${row.verdict}. Holdout book ${usdLike(row.holdoutProfit)} against buy-and-hold ${usdLike(row.championProfit)}. Trades in the holdout book: ${row.trades}.`);
    lines.push("");
    lines.push(row.reason);
    lines.push("");
    lines.push(row.note);
    lines.push("");
    for (const gate of row.gates) lines.push(`- ${gate.pass ? "pass" : "fail"} \`${gate.name}\`: ${gate.detail}`);
    lines.push("");
    lines.push(`Deflated Sharpe inside this skeptic call: z=${num(row.z, 3)} after ${row.trials} trials. That z is not a probability.`);
    lines.push("");
  }
  lines.push("## Assumptions");
  lines.push("");
  for (const line of ASSUMPTIONS) lines.push(`- ${line}`);
  lines.push("");
  lines.push("## Files");
  lines.push("");
  lines.push("- `research/lab/data/macd-signal-study.json`");
  lines.push("- `research/lab/data/macd-signal-cells.csv`");
  lines.push("- `research/lab/data/macd-signal-context.csv`");
  lines.push("- `research/lab/data/macd-signal-drift.csv`");
  lines.push("- `tradingview/macd_signal_lab.pine` is the chart grader. It is not this backtest.");
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function verdictParagraph(survivors: Cell[], claims: ContextRow[], skeptics: SkepticReport[]): string {
  const accepted = skeptics.filter((row) => row.verdict === "ACCEPT");
  if (survivors.length === 0 && claims.length === 0) {
    return "No MACD signal in this grid shows a positive edge after costs that survives the holdout, the non-overlapping replay, the stricter lab cost, Benjamini-Hochberg, and the walk-forward folds. No context filter clears that bar either. The skeptic was still run on the least-bad cell so the book test is on the record. A pass there would mean it lost less than buy-and-hold, or beat it, not that the event study found an edge.";
  }
  const bits = [
    survivors.length ? `${survivors.length} cell(s) cleared the event-study bar.` : "No unfiltered cell cleared the event-study bar.",
    claims.length ? `${claims.length} context split(s) cleared their bar.` : "No context split cleared its bar.",
    accepted.length ? `The skeptic accepted ${accepted.length} booked rule(s). An acceptance is still only a research verdict. The desk was not changed.` : "The skeptic did not accept a booked rule.",
  ];
  return bits.join(" ");
}

function usdLike(value: number): string {
  const sign = value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}

function csvEscape(value: string | number | null | undefined): string {
  if (value == null || (typeof value === "number" && !Number.isFinite(value))) return "";
  const text = String(value);
  return text.includes(",") || text.includes("\"") ? `"${text.replaceAll("\"", "\"\"")}"` : text;
}

function writeCsv(file: string, header: string[], rows: (string | number | null | undefined)[][]) {
  const body = [header.join(","), ...rows.map((row) => row.map(csvEscape).join(","))].join("\n");
  writeFileSync(file, `${body}\n`);
}

function quant(q: Quantiles, key: keyof Quantiles): number {
  return q[key];
}

function cellCsv(cells: Cell[]): (string | number | null)[][] {
  return cells.map((cell) => [
    cell.panel,
    cell.tf,
    cell.macd,
    cell.signalName,
    cell.target,
    cell.stop,
    cell.cost,
    cell.trainN,
    cell.holdN,
    cell.trainMeanR,
    cell.holdMeanR,
    cell.trainMeanRet,
    cell.holdMeanRet,
    cell.holdHit,
    cell.holdBeGross,
    cell.holdBeCost,
    cell.holdPf,
    cell.holdMedianBars,
    cell.hits,
    cell.stops,
    cell.timeouts,
    cell.censored,
    quant(cell.mfe, "p10"),
    quant(cell.mfe, "p25"),
    quant(cell.mfe, "p50"),
    quant(cell.mfe, "p75"),
    quant(cell.mfe, "p90"),
    quant(cell.mae, "p10"),
    quant(cell.mae, "p25"),
    quant(cell.mae, "p50"),
    quant(cell.mae, "p75"),
    quant(cell.mae, "p90"),
    cell.holdBootLow,
    cell.holdBootHigh,
    cell.holdRetLow,
    cell.holdRetHigh,
    cell.tStat,
    cell.pGreater,
    cell.bhQ,
    cell.plainTrainN,
    cell.plainTrainMean,
    cell.plainHoldN,
    cell.plainHoldMean,
    cell.plainHoldBootLow,
    cell.plainHoldBootHigh,
    cell.plainSharpe,
    cell.foldsPositive,
    cell.foldsScored,
    cell.survives ? "yes" : "no",
  ]);
}

const CELL_HEADER = [
  "panel", "tf", "macd", "signal", "target_atr", "stop_atr", "cost", "train_n", "hold_n", "train_mean_r", "hold_mean_r",
  "train_mean_ret", "hold_mean_ret", "hit_rate", "be_gross", "be_cost", "profit_factor", "median_bars", "hits", "stops",
  "timeouts", "censored", "mfe_p10", "mfe_p25", "mfe_p50", "mfe_p75", "mfe_p90", "mae_p10", "mae_p25", "mae_p50",
  "mae_p75", "mae_p90", "boot_r_low", "boot_r_high", "boot_ret_low", "boot_ret_high", "t_stat", "p_greater", "bh_q",
  "plain_train_n", "plain_train_mean_r", "plain_hold_n", "plain_hold_mean_r", "plain_boot_low", "plain_boot_high",
  "plain_sharpe", "folds_positive", "folds_scored", "survives",
];

function jsonSafe<T>(value: T): T {
  return JSON.parse(JSON.stringify(value, (_key, item) => (typeof item === "number" && !Number.isFinite(item) ? null : item))) as T;
}

function ledgerBlurb(markdown: string): string {
  const verdict = markdown.split("\n").find((line) => line.startsWith("No MACD") || line.startsWith("No unfiltered") || line.includes("cleared the event-study")) ?? markdown.split("\n")[2] ?? "";
  return [
    LEDGER_MARK,
    "",
    "This section is not a cycle. It is not in `research/lab/ledger.jsonl`, it is not a trial for the V-Pro or Livermore search, and it does not write `research/lab/candidate.json`. `src/lib/desk` was not edited.",
    "",
    verdict,
    "",
    "The reading, the assumptions, and the machine-readable tables are in `docs/MACD_SIGNAL_STUDY.md`.",
    "",
  ].join("\n");
}

function appendLedger(blurb: string) {
  const current = readFileSync(PATHS.markdown, "utf8");
  const at = current.indexOf(LEDGER_MARK);
  const base = (at >= 0 ? current.slice(0, at) : current).trimEnd();
  writeFileSync(PATHS.markdown, `${base}\n\n${blurb}`);
}

function codeCommit(): string {
  try {
    return execSync("git rev-parse HEAD", { cwd: REPO_ROOT, encoding: "utf8" }).trim();
  } catch {
    return "unknown";
  }
}

async function main() {
  if (!Number.isFinite(REPS) || REPS < 100) throw new Error("--reps must be at least 100");
  const started = Date.now();
  const tape = loadTape();
  mainLog(`${tape.books.length} coins, ${tape.books[0]!.bars.length} bars, ${tape.start} → ${tape.end}`);
  const raw = tape.books.map((book) => book.bars);
  const frames = new Map<FrameName, Bar[][]>();
  for (const spec of FRAMES) {
    const bars = frameBars(raw, spec);
    assertClock(bars);
    frames.set(spec.name, bars);
    mainLog(`${spec.name} ${bars[0]!.length} bars`);
  }
  const daily = frames.get("1d")!;
  const cells: Cell[] = [];
  const contexts: ContextRow[] = [];
  const drifts: DriftRow[] = [];
  const originals: OriginalRow[] = [];
  for (const spec of FRAMES) {
    const frame = frames.get(spec.name)!;
    const split = clockOf(frame[0]!, tape.trainStart, tape.holdoutStart);
    const folds = foldsOf(split);
    for (const preset of MACD_PRESETS) {
      const t0 = Date.now();
      mainLog(`${spec.name} ${preset.name}`);
      const scored = scorePanel({
        panel: "usdt-m",
        tf: spec.name,
        frame,
        raw,
        daily,
        split,
        folds,
        macdName: preset.name,
        fast: preset.fast,
        slow: preset.slow,
        signal: preset.signal,
      });
      cells.push(...scored.cells);
      contexts.push(...scored.contexts);
      drifts.push(...scored.drifts);
      originals.push(...scored.originals);
      mainLog(`${spec.name} ${preset.name} in ${((Date.now() - t0) / 1000).toFixed(1)}s, events priced`);
    }
  }
  // The drift filter above keeps every row. 15m alternatives included. Good.
  const three = frames.get("1d")!.slice(0, 3);
  const threeRaw = raw.slice(0, 3);
  const threeDaily = daily.slice(0, 3);
  const threeSplit = clockOf(three[0]!, tape.trainStart, tape.holdoutStart);
  for (const preset of MACD_PRESETS) {
    if (preset.name !== "12/26/9") continue;
    const scored = scorePanel({
      panel: "usdt-m-3",
      tf: "1d",
      frame: three,
      raw: threeRaw,
      daily: threeDaily,
      split: threeSplit,
      folds: foldsOf(threeSplit),
      macdName: preset.name,
      fast: preset.fast,
      slow: preset.slow,
      signal: preset.signal,
    });
    cells.push(...scored.cells.filter((cell) => cell.target === REF_TARGET && cell.stop === REF_STOP));
  }
  let pinnedNote = "Pinned daily tape was not scored.";
  try {
    const pinned = await loadMarket({ cacheOnly: true });
    const symbols = ["BTC/USD", "ETH/USD", "SOL/USD"] as const;
    const pinnedBars = symbols.map((symbol) => pinned.series[symbol]);
    const split = clockOf(pinnedBars[0]!, Date.parse(`${TRAIN_START}T00:00:00Z`), Date.parse(`${HOLDOUT_START}T00:00:00Z`));
    for (const preset of MACD_PRESETS) {
      if (preset.name !== "12/26/9") continue;
      const scored = scorePanel({
        panel: "pinned",
        tf: "1d",
        frame: pinnedBars,
        raw: pinnedBars,
        daily: pinnedBars,
        split,
        folds: foldsOf(split),
        macdName: preset.name,
        fast: preset.fast,
        slow: preset.slow,
        signal: preset.signal,
      });
      cells.push(...scored.cells.filter((cell) => cell.target === REF_TARGET && cell.stop === REF_STOP));
      contexts.push(...scored.contexts);
    }
    pinnedNote = `Pinned daily tape ${pinned.manifest.start} → ${pinned.manifest.end}, ${pinned.manifest.bars} bars, hash \`${pinned.manifest.hash}\`. ${pinned.manifest.source}. Scored only as a side panel on 12/26/9 at 1.5 / 1.`;
    mainLog(pinnedNote);
  } catch (error) {
    pinnedNote = `Pinned daily tape was not scored (${error instanceof Error ? error.message : "error"}).`;
    mainLog(pinnedNote);
  }
  const families = applyFamilies(cells, contexts);
  const choice = chooseCell(cells);
  let deflatedZ: number | null = null;
  let deflatedHurdle: number | null = null;
  let deflatedTrials = 0;
  if (choice.cell && choice.cell.plainHoldN >= 2) {
    const trialSharpes = cells
      .filter((cell) => cell.panel === "usdt-m" && cell.cost === "binance" && cell.holdN >= MIN_FAMILY_N && Number.isFinite(cell.plainSharpe))
      .map((cell) => cell.plainSharpe);
    const record = deflatedSharpe({
      sharpe: choice.cell.plainSharpe,
      skew: choice.cell.plainSkew,
      kurtosis: choice.cell.plainKurtosis,
      observations: choice.cell.plainHoldN,
      trialSharpes: trialSharpes.length ? trialSharpes : [choice.cell.plainSharpe],
    });
    deflatedZ = record.z;
    deflatedHurdle = record.hurdle;
    deflatedTrials = record.trials;
    mainLog(`deflated z=${num(record.z, 3)} hurdle=${num(record.hurdle, 4)} trials=${record.trials} clears=${record.clears}`);
  }
  const skeptics: SkepticReport[] = [];
  const booked = new Set<string>();
  const queue: Cell[] = [];
  if (choice.cell) queue.push(choice.cell);
  for (const cell of cells.filter((row) => row.survives).sort((a, b) => b.holdMeanR - a.holdMeanR)) {
    if (queue.length >= 3) break;
    if (!queue.some((row) => cellKey(row) === cellKey(cell))) queue.push(cell);
  }
  for (const cell of queue) {
    const key = cellKey(cell);
    if (booked.has(key)) continue;
    booked.add(key);
    mainLog(`skeptic ${cell.tf} ${cell.macd} ${cell.signalName} ${cell.target}/${cell.stop}`);
    const frame = frames.get(cell.tf as FrameName)!;
    const preset = MACD_PRESETS.find((row) => row.name === cell.macd)!;
    const events = eventsFor(frame, cell.tf as FrameName, preset.fast, preset.slow, preset.signal, daily, raw).filter((event) => event.type === cell.signal);
    const split = clockOf(frame[0]!, tape.trainStart, tape.holdoutStart);
    skeptics.push(
      runSkeptic({
        label: `${cell.signalName} ${cell.macd} ${cell.tf} ${cell.target}/${cell.stop}`,
        note: cell.survives ? "This cell cleared the event-study bar before the book was judged." : "This cell did not clear the event-study bar. The book is a check, not a promotion.",
        frame,
        symbols: [...COINS],
        events,
        target: cell.target,
        stop: cell.stop,
        split,
        tf: cell.tf,
        cost: BINANCE_TAKER_COST,
        priorNote: "Costs on this book are the Binance taker schedule.",
      }),
    );
  }
  const claim = contexts.filter((row) => row.panel === "usdt-m" && row.claim).sort((a, b) => Math.abs(b.holdDiff) - Math.abs(a.holdDiff))[0];
  if (claim) {
    mainLog(`skeptic context ${claim.contrast} ${claim.claim}`);
    const frame = frames.get(claim.tf as FrameName)!;
    const preset = MACD_PRESETS.find((row) => row.name === claim.macd)!;
    const contrast = CONTRASTS.find((row) => row.name === claim.contrast)!;
    const want = claim.claim === "yes" ? contrast.yes : contrast.no;
    const events = eventsFor(frame, claim.tf as FrameName, preset.fast, preset.slow, preset.signal, daily, raw).filter(
      (event) => event.type === claim.signal && want(event),
    );
    const split = clockOf(frame[0]!, tape.trainStart, tape.holdoutStart);
    skeptics.push(
      runSkeptic({
        label: `${claim.contrast} (${claim.claim}) ${claim.signalName} ${claim.macd} ${claim.tf}`,
        note: "This is the strongest context split that cleared the contrast bar. The book takes only that bucket, one position per coin, reference bracket 1.5 / 1.",
        frame,
        symbols: [...COINS],
        events,
        target: REF_TARGET,
        stop: REF_STOP,
        split,
        tf: claim.tf,
        cost: BINANCE_TAKER_COST,
        priorNote: "Neighbours move the ATR bracket and keep the same filter.",
      }),
    );
  }
  const markdown = render({
    tape,
    cells,
    contexts,
    drifts,
    originals,
    familyN: families.familyN,
    contextN: families.contextN,
    skeptics,
    choice,
    deflatedZ,
    deflatedHurdle,
    deflatedTrials,
    pinnedNote,
  });
  writeFileSync(OUT_MD, markdown);
  writeCsv(OUT_CELLS, CELL_HEADER, cellCsv(cells));
  writeCsv(
    OUT_CONTEXT,
    ["panel", "tf", "macd", "signal", "contrast", "hold_yes", "hold_no", "train_yes", "train_no", "yes_hold_r", "no_hold_r", "yes_low", "no_low", "train_diff", "hold_diff", "diff_low", "diff_high", "p_two", "bh_q", "claim"],
    contexts.map((row) => [row.panel, row.tf, row.macd, row.signalName, row.contrast, row.holdYes, row.holdNo, row.trainYes, row.trainNo, row.yesHoldMean, row.noHoldMean, row.yesHoldLow, row.noHoldLow, row.trainDiff, row.holdDiff, row.holdDiffLow, row.holdDiffHigh, row.pTwo, row.bhQ, row.claim]),
  );
  writeCsv(
    OUT_DRIFT,
    ["panel", "tf", "macd", "signal", "h", "n", "signal_mean", "control_mean", "diff", "diff_low", "diff_high", "signal_net", "control_net"],
    drifts.map((row) => [row.panel, row.tf, row.macd, row.signalName, row.h, row.n, row.signalMean, row.controlMean, row.diff, row.low, row.high, row.signalNet, row.controlNet]),
  );
  const payload = {
    generatedAt: new Date().toISOString(),
    commit: codeCommit(),
    seed: SEED,
    reps: REPS,
    horizon: HORIZON,
    atr: ATR_LEN,
    ema: EMA_TREND,
    slopeBars: SLOPE_BARS,
    volLookback: VOL_LOOKBACK,
    pivotWing: PIVOT_WING,
    divActive: DIV_ACTIVE,
    familyN: families.familyN,
    contextN: families.contextN,
    assumptions: ASSUMPTIONS,
    tape: { hash: tape.hash, start: tape.start, end: tape.end, source: tape.source, coins: COINS },
    pinnedNote,
    choice: choice.cell
      ? { reason: choice.reason, tf: choice.cell.tf, macd: choice.cell.macd, signal: choice.cell.signalName, target: choice.cell.target, stop: choice.cell.stop, holdMeanR: choice.cell.holdMeanR }
      : { reason: choice.reason },
    deflated: { z: deflatedZ, hurdle: deflatedHurdle, trials: deflatedTrials },
    survivors: cells.filter((cell) => cell.survives).map((cell) => ({ tf: cell.tf, macd: cell.macd, signal: cell.signalName, target: cell.target, stop: cell.stop, holdMeanR: cell.holdMeanR, bhQ: cell.bhQ })),
    claims: contexts.filter((row) => row.claim).map((row) => ({ contrast: row.contrast, claim: row.claim, tf: row.tf, macd: row.macd, signal: row.signalName, bhQ: row.bhQ })),
    skeptics,
    reference: cells.filter((cell) => cell.panel === "usdt-m" && cell.macd === "12/26/9" && cell.target === REF_TARGET && cell.stop === REF_STOP),
  };
  writeFileSync(OUT_JSON, `${JSON.stringify(jsonSafe(payload), null, 2)}\n`);
  appendLedger(ledgerBlurb(markdown));
  mainLog(`done in ${((Date.now() - started) / 1000).toFixed(1)}s`);
  console.log(markdown.split("\n").slice(0, 8).join("\n"));
}

const invoked = process.argv[1] != null && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invoked) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
