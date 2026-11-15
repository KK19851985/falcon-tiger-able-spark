/**
 * Quantum Livermore, re-implemented for the lab from the written spec.
 * Closed 15-minute bars only. This file does not import src/lib/desk.
 *
 * Direction. EMA of ma_length. Slope is the change over ma_slope_bars,
 * divided by the EMA at the start of that window (a fraction per window,
 * not per bar). Long when the close is above the EMA and the slope is at
 * least flat_slope_pct. Short is the mirror. A zero flat threshold still
 * requires a rising EMA for a long and a falling EMA for a short. A cross
 * of the close through the EMA, including a close that lands on it, inside
 * the last tangle_bars bars (the current bar included) forces a flat
 * direction. tangle_bars 0 turns that filter off.
 *
 * Location. A swing high needs pivot_wing bars on each side, all strictly
 * lower. A swing low needs them strictly higher. At the close of bar i the
 * newest usable swing is i - pivot_wing, and the oldest is i - pivot_lookback.
 * Swing highs and swing lows are clustered separately. A price joins the
 * current cluster when it is within touch_tolerance_pct of that cluster's
 * lowest price. The level is the mean of the cluster. A cluster with fewer
 * than min_touches swings is not a level. min_touches 1 keeps every swing.
 * A long breakout is a close above a resistance level that the previous
 * close was at or below. If several levels are crossed, the highest one is
 * the level that has to hold. Shorts take the lowest support crossed.
 *
 * Volume. The breakout bar's volume must be at least vol_multiplier times
 * the average of the previous vol_lookback bars. The breakout bar is not
 * inside that average. vol_multiplier 1 turns the filter off. That is the
 * grid point labelled "off", not "at least the average".
 *
 * Confirmation. The breakout close counts as the first hold. confirm_bars 1
 * is ready on the breakout bar. Later bars must keep the close beyond the
 * level and keep the same direction. Volume is not checked again. The fill
 * is the next bar's open. One position per symbol. A bar that exits does
 * not arm a new entry.
 *
 * Exits, first match: a stop and a target touched in the same bar fill the
 * stop. A stop that gaps through fills at the open. A target fills at the
 * target. Otherwise a long exits when the close is back below the EMA, and
 * a short when the close is back above it, at that close. A window still
 * open on the last bar is flattened at that close.
 */
import { createHash } from "node:crypto";
import { netReturn } from "./execute.ts";
import { exitCost, type QuantumCost } from "./quantum.ts";
import type { Bar, Side } from "./types.ts";

export const BAR_MS = 15 * 60 * 1000;

export const COINS = [
  "BTC/USD",
  "ETH/USD",
  "SOL/USD",
  "BNB/USD",
  "XRP/USD",
  "DOGE/USD",
  "ADA/USD",
  "AVAX/USD",
  "LINK/USD",
  "LTC/USD",
] as const;

export type CoinName = (typeof COINS)[number];

export const INSTRUMENTS: Record<CoinName, string> = {
  "BTC/USD": "BTC-USDT",
  "ETH/USD": "ETH-USDT",
  "SOL/USD": "SOL-USDT",
  "BNB/USD": "BNB-USDT",
  "XRP/USD": "XRP-USDT",
  "DOGE/USD": "DOGE-USDT",
  "ADA/USD": "ADA-USDT",
  "AVAX/USD": "AVAX-USDT",
  "LINK/USD": "LINK-USDT",
  "LTC/USD": "LTC-USDT",
};

export type Spec = {
  maLength: number;
  maSlopeBars: number;
  flatSlopePct: number;
  tangleBars: number;
  pivotLookback: number;
  pivotWing: number;
  touchTolerancePct: number;
  minTouches: number;
  confirmBars: number;
  volMultiplier: number;
  volLookback: number;
  takeProfit: number;
  stopLoss: number;
};

export const YAML_KEY: Record<keyof Spec, string> = {
  maLength: "ma_length",
  maSlopeBars: "ma_slope_bars",
  flatSlopePct: "flat_slope_pct",
  tangleBars: "tangle_bars",
  pivotLookback: "pivot_lookback",
  pivotWing: "pivot_wing",
  touchTolerancePct: "touch_tolerance_pct",
  minTouches: "min_touches",
  confirmBars: "confirm_bars",
  volMultiplier: "vol_multiplier",
  volLookback: "vol_lookback",
  takeProfit: "take_profit",
  stopLoss: "stop_loss",
};

export const ENTRY_KEYS = [
  "tangleBars",
  "pivotLookback",
  "pivotWing",
  "maSlopeBars",
  "flatSlopePct",
  "maLength",
  "volMultiplier",
  "minTouches",
  "confirmBars",
  "touchTolerancePct",
] as const satisfies readonly (keyof Spec)[];

export const EXIT_KEYS = ["takeProfit", "stopLoss"] as const satisfies readonly (keyof Spec)[];

export const ENTRY_GRIDS: { [K in (typeof ENTRY_KEYS)[number]]: readonly number[] } = {
  tangleBars: [0, 1, 2, 3, 5, 8],
  pivotLookback: [5, 10, 20, 30],
  pivotWing: [1, 2, 3],
  maSlopeBars: [1, 3, 5, 8],
  flatSlopePct: [0, 0.00005, 0.0001, 0.0002],
  maLength: [20, 34, 50, 100],
  volMultiplier: [1, 1.2, 1.5, 2],
  minTouches: [1, 2, 3],
  confirmBars: [1, 2, 3],
  touchTolerancePct: [0.0005, 0.001, 0.002],
};

export const EXIT_GRIDS: { [K in (typeof EXIT_KEYS)[number]]: readonly number[] } = {
  takeProfit: [0.005, 0.01, 0.02],
  stopLoss: [0.02, 0.05, 0.1],
};

/** The rule before today's paper change. */
export const OLD_SPEC: Spec = {
  maLength: 50,
  maSlopeBars: 5,
  flatSlopePct: 0.0001,
  tangleBars: 5,
  pivotLookback: 20,
  pivotWing: 2,
  touchTolerancePct: 0.001,
  minTouches: 2,
  confirmBars: 2,
  volMultiplier: 1.5,
  volLookback: 20,
  takeProfit: 0.005,
  stopLoss: 0.1,
};

/** Live in paper since 15:14 UTC on the day of this study. */
export const CURRENT_SPEC: Spec = {
  ...OLD_SPEC,
  maSlopeBars: 3,
  tangleBars: 3,
  pivotLookback: 10,
  pivotWing: 1,
  minTouches: 1,
  confirmBars: 1,
  volMultiplier: 1.2,
};

export type ExitReason = "tp" | "sl" | "ema" | "flatten";

export type LivermoreFill = {
  symbol: string;
  side: Side;
  reason: ExitReason;
  signalIndex: number;
  openedIndex: number;
  closedIndex: number;
  entry: number;
  exit: number;
  ret: number;
  pnl: number;
  entryT: number;
  exitT: number;
};

export type LivermoreRun = {
  profit: number;
  endEquity: number;
  maxDd: number;
  fills: LivermoreFill[];
  curve: number[];
  /** Per-bar equity returns. The skeptic reads this as its Sharpe sample. */
  barReturns: number[];
  exitCounts: Record<ExitReason, number>;
};

type Dir = Side | "FLAT";

export type Prepared = {
  ema: number[];
  dir: Dir[];
  volOk: boolean[];
  highs: Swing[];
  lows: Swing[];
};

type Swing = { i: number; px: number };

export function sameNum(a: number, b: number): boolean {
  const scale = Math.max(1, Math.abs(a), Math.abs(b));
  return Math.abs(a - b) <= scale * 1e-9;
}

export function formatSpecNum(value: number): string {
  if (Number.isInteger(value)) return String(value);
  const text = value.toFixed(8).replace(/0+$/, "").replace(/\.$/, "");
  return text === "-0" ? "0" : text;
}

export function ema(values: number[], span: number): number[] {
  if (span < 1 || !Number.isInteger(span)) throw new Error("ma_length must be a positive integer");
  const k = 2 / (span + 1);
  const out = new Array<number>(values.length);
  let prev = values[0] ?? 0;
  for (let i = 0; i < values.length; i++) {
    prev = i === 0 ? values[i]! : values[i]! * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

export function crossedEma(prevClose: number, prevEma: number, close: number, line: number): boolean {
  const prev = prevClose - prevEma;
  const cur = close - line;
  if (prev === 0 || cur === 0) return true;
  return (prev > 0) !== (cur > 0);
}

/** Direction at each bar. Index 0 is flat. Exported for tests. */
export function directionSeries(closes: number[], line: number[], spec: Pick<Spec, "maLength" | "maSlopeBars" | "flatSlopePct" | "tangleBars">): Dir[] {
  const out: Dir[] = new Array(closes.length);
  const crosses: boolean[] = new Array(closes.length).fill(false);
  for (let i = 1; i < closes.length; i++) {
    crosses[i] = crossedEma(closes[i - 1]!, line[i - 1]!, closes[i]!, line[i]!);
  }
  for (let i = 0; i < closes.length; i++) {
    out[i] = "FLAT";
    if (i < spec.maLength || i < spec.maSlopeBars) continue;
    const base = line[i - spec.maSlopeBars]!;
    if (!(base > 0)) continue;
    const slope = (line[i]! - base) / base;
    const flat = spec.flatSlopePct;
    const rising = flat > 0 ? slope >= flat : slope > 0;
    const falling = flat > 0 ? slope <= -flat : slope < 0;
    if (spec.tangleBars > 0) {
      const start = Math.max(1, i - spec.tangleBars + 1);
      let tangled = false;
      for (let j = start; j <= i; j++) {
        if (crosses[j]) {
          tangled = true;
          break;
        }
      }
      if (tangled) continue;
    }
    if (closes[i]! > line[i]! && rising) out[i] = "LONG";
    else if (closes[i]! < line[i]! && falling) out[i] = "SHORT";
  }
  return out;
}

export function swingPoints(bars: Bar[], wing: number, kind: "high" | "low"): Swing[] {
  if (wing < 1 || !Number.isInteger(wing)) throw new Error("pivot_wing must be a positive integer");
  const out: Swing[] = [];
  for (let j = wing; j < bars.length - wing; j++) {
    const px = kind === "high" ? bars[j]!.high : bars[j]!.low;
    let ok = true;
    for (let k = 1; k <= wing; k++) {
      const left = kind === "high" ? bars[j - k]!.high : bars[j - k]!.low;
      const right = kind === "high" ? bars[j + k]!.high : bars[j + k]!.low;
      if (kind === "high" ? left >= px || right >= px : left <= px || right <= px) {
        ok = false;
        break;
      }
    }
    if (ok) out.push({ i: j, px });
  }
  return out;
}

/**
 * Greedy clusters on a sorted copy. Width is measured from the cluster's
 * lowest price, so a chain of tiny steps cannot merge prices that are far
 * apart. The level is the arithmetic mean.
 */
export function clusterLevels(prices: number[], tolerance: number, minTouches: number): number[] {
  if (minTouches < 1 || !Number.isInteger(minTouches)) throw new Error("min_touches must be a positive integer");
  if (!(tolerance >= 0)) throw new Error("touch_tolerance_pct must be non-negative");
  if (prices.length === 0) return [];
  const sorted = [...prices].sort((a, b) => a - b);
  const levels: number[] = [];
  let seed = sorted[0]!;
  let sum = seed;
  let count = 1;
  const flush = () => {
    if (count >= minTouches) levels.push(sum / count);
  };
  for (let k = 1; k < sorted.length; k++) {
    const px = sorted[k]!;
    if (seed > 0 && Math.abs(px - seed) / seed <= tolerance + 1e-15) {
      sum += px;
      count += 1;
    } else {
      flush();
      seed = px;
      sum = px;
      count = 1;
    }
  }
  flush();
  return levels;
}

export function brokenLevel(side: Side, prev: number, close: number, levels: number[]): number | null {
  if (side === "LONG") {
    let best = -Infinity;
    for (const level of levels) {
      if (prev <= level && close > level && level > best) best = level;
    }
    return best === -Infinity ? null : best;
  }
  let best = Infinity;
  for (const level of levels) {
    if (prev >= level && close < level && level < best) best = level;
  }
  return best === Infinity ? null : best;
}

function lowerBound(swings: Swing[], index: number): number {
  let lo = 0;
  let hi = swings.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (swings[mid]!.i < index) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function levelsInWindow(swings: Swing[], i: number, lookback: number, wing: number, tolerance: number, minTouches: number): number[] {
  const newest = i - wing;
  const oldest = i - lookback;
  if (newest < oldest) return [];
  const from = lowerBound(swings, oldest);
  let to = from;
  while (to < swings.length && swings[to]!.i <= newest) to += 1;
  if (to === from) return [];
  const prices = new Array<number>(to - from);
  for (let k = from; k < to; k++) prices[k - from] = swings[k]!.px;
  return clusterLevels(prices, tolerance, minTouches);
}

export function prepareCoin(bars: Bar[], spec: Spec): Prepared {
  checkSpec(spec);
  const closes = bars.map((bar) => bar.close);
  const line = ema(closes, spec.maLength);
  const dir = directionSeries(closes, line, spec);
  const prefix = new Array<number>(bars.length + 1);
  prefix[0] = 0;
  for (let i = 0; i < bars.length; i++) prefix[i + 1] = prefix[i]! + bars[i]!.volume;
  const volOff = spec.volMultiplier === 1;
  const volOk = new Array<boolean>(bars.length);
  for (let i = 0; i < bars.length; i++) {
    if (volOff) {
      volOk[i] = true;
      continue;
    }
    if (i < spec.volLookback) {
      volOk[i] = false;
      continue;
    }
    const avg = (prefix[i]! - prefix[i - spec.volLookback]!) / spec.volLookback;
    volOk[i] = avg > 0 && bars[i]!.volume >= avg * spec.volMultiplier;
  }
  return {
    ema: line,
    dir,
    volOk,
    highs: swingPoints(bars, spec.pivotWing, "high"),
    lows: swingPoints(bars, spec.pivotWing, "low"),
  };
}

export type ExitHit = { price: number; reason: Exclude<ExitReason, "flatten">; kind: "taker" | "maker" };

/** Intrabar stop and target first. The EMA exit uses the close and only runs if neither was touched. */
export function exitOnBar(side: Side, entry: number, bar: Bar, line: number, spec: Pick<Spec, "takeProfit" | "stopLoss">): ExitHit | null {
  const tp = side === "LONG" ? entry * (1 + spec.takeProfit) : entry * (1 - spec.takeProfit);
  const sl = side === "LONG" ? entry * (1 - spec.stopLoss) : entry * (1 + spec.stopLoss);
  const tpHit = side === "LONG" ? bar.high >= tp : bar.low <= tp;
  const slHit = side === "LONG" ? bar.low <= sl : bar.high >= sl;
  if (slHit) {
    const worse = side === "LONG" ? Math.min(sl, bar.open) : Math.max(sl, bar.open);
    return { price: worse, reason: "sl", kind: "taker" };
  }
  if (tpHit) return { price: tp, reason: "tp", kind: "maker" };
  if (side === "LONG" && bar.close < line) return { price: bar.close, reason: "ema", kind: "taker" };
  if (side === "SHORT" && bar.close > line) return { price: bar.close, reason: "ema", kind: "taker" };
  return null;
}

type Pos = {
  side: Side;
  entry: number;
  entryT: number;
  signal: number;
  opened: number;
};

type Slot = {
  symbol: string;
  bars: Bar[];
  prep: Prepared;
  pos: Pos | null;
  enter: Side | null;
  pending: { side: Side; level: number; have: number } | null;
  exited: boolean;
};

export function runPrepared(
  slots: { symbol: string; bars: Bar[]; prep: Prepared }[],
  spec: Spec,
  from: number,
  to: number,
  cost: QuantumCost,
  startEquity = 10_000,
): LivermoreRun {
  if (slots.length === 0) throw new Error("Livermore needs at least one coin");
  const n = slots[0]!.bars.length;
  for (const slot of slots) {
    if (slot.bars.length !== n) throw new Error(`${slot.symbol} length does not match the tape`);
  }
  const end = Math.min(to, n - 1);
  if (from < 0 || from > end) throw new Error(`window ${from}..${to} is outside the tape`);
  const weight = 1 / slots.length;
  const state: Slot[] = slots.map((slot) => ({
    ...slot,
    pos: null,
    enter: null,
    pending: null,
    exited: false,
  }));
  let equity = startEquity;
  const fills: LivermoreFill[] = [];
  const exitCounts: Record<ExitReason, number> = { tp: 0, sl: 0, ema: 0, flatten: 0 };
  const curve = [startEquity];

  const closePos = (slot: Slot, price: number, reason: ExitReason, closedIndex: number, kind: "taker" | "maker", exitT: number) => {
    const pos = slot.pos;
    if (!pos) return;
    const ret = netReturn(pos.side, pos.entry, price, exitCost(cost, kind), Math.max(0, (exitT - pos.entryT) / 86_400_000));
    const pnl = equity * weight * ret;
    equity += pnl;
    fills.push({
      symbol: slot.symbol,
      side: pos.side,
      reason,
      signalIndex: pos.signal,
      openedIndex: pos.opened,
      closedIndex,
      entry: pos.entry,
      exit: price,
      ret,
      pnl,
      entryT: pos.entryT,
      exitT,
    });
    exitCounts[reason] += 1;
    slot.pos = null;
    slot.exited = true;
  };

  for (let i = from; i <= end; i++) {
    for (const slot of state) {
      slot.exited = false;
      const bar = slot.bars[i]!;
      if (slot.enter && !slot.pos) {
        slot.pos = { side: slot.enter, entry: bar.open, entryT: bar.t, signal: i - 1, opened: i };
        slot.enter = null;
      }
      if (slot.pos) {
        const hit = exitOnBar(slot.pos.side, slot.pos.entry, bar, slot.prep.ema[i]!, spec);
        if (hit) {
          const exitT = hit.reason === "ema" ? bar.t + BAR_MS : bar.t;
          closePos(slot, hit.price, hit.reason, i, hit.kind, exitT);
        }
      }
    }

    if (i === end) {
      for (const slot of state) {
        if (!slot.pos) continue;
        const bar = slot.bars[i]!;
        closePos(slot, bar.close, "flatten", i, "taker", bar.t + BAR_MS);
      }
      curve.push(equity);
      break;
    }

    for (const slot of state) {
      if (slot.pos || slot.exited) continue;
      const bar = slot.bars[i]!;
      const dir = slot.prep.dir[i]!;
      const close = bar.close;
      const prev = slot.bars[i - 1]?.close;
      const arm = (side: Side) => {
        slot.enter = side;
        slot.pending = null;
      };
      if (slot.pending && prev != null) {
        const held = slot.pending.side === "LONG" ? close > slot.pending.level : close < slot.pending.level;
        if (held && dir === slot.pending.side) {
          slot.pending.have += 1;
          if (slot.pending.have >= spec.confirmBars) arm(slot.pending.side);
        } else {
          slot.pending = null;
        }
      }
      if (slot.pending || slot.enter || prev == null || dir === "FLAT" || !slot.prep.volOk[i]) continue;
      const swings = dir === "LONG" ? slot.prep.highs : slot.prep.lows;
      const levels = levelsInWindow(swings, i, spec.pivotLookback, spec.pivotWing, spec.touchTolerancePct, spec.minTouches);
      const level = brokenLevel(dir, prev, close, levels);
      if (level == null) continue;
      if (spec.confirmBars <= 1) arm(dir);
      else slot.pending = { side: dir, level, have: 1 };
    }

    let marked = equity;
    const taker = exitCost(cost, "taker");
    for (const slot of state) {
      if (!slot.pos) continue;
      const ret = netReturn(slot.pos.side, slot.pos.entry, slot.bars[i]!.close, taker, 0);
      marked += marked * weight * ret;
    }
    curve.push(marked);
  }

  let peak = curve[0]!;
  let maxDd = 0;
  const barReturns: number[] = [];
  for (let i = 0; i < curve.length; i++) {
    const point = curve[i]!;
    if (i > 0) {
      const prev = curve[i - 1]!;
      barReturns.push(prev !== 0 ? point / prev - 1 : 0);
    }
    peak = Math.max(peak, point);
    maxDd = Math.max(maxDd, peak > 0 ? (peak - point) / peak : 0);
  }
  return { profit: equity - startEquity, endEquity: equity, maxDd, fills, curve, barReturns, exitCounts };
}

export function runLivermoreBook(
  books: { symbol: string; bars: Bar[] }[],
  spec: Spec,
  from: number,
  to: number,
  cost: QuantumCost,
  startEquity = 10_000,
): LivermoreRun {
  const slots = books.map((book) => ({ symbol: book.symbol, bars: book.bars, prep: prepareCoin(book.bars, spec) }));
  return runPrepared(slots, spec, from, to, cost, startEquity);
}

export function checkSpec(spec: Spec): void {
  if (spec.maLength < 1 || spec.maSlopeBars < 1 || spec.pivotLookback < 1 || spec.pivotWing < 1) {
    throw new Error("length, slope bars, lookback, and wing must be positive");
  }
  if (spec.confirmBars < 1 || spec.volLookback < 1 || spec.minTouches < 1) {
    throw new Error("confirm bars, volume lookback, and min touches must be positive");
  }
  if (spec.takeProfit <= 0 || spec.stopLoss <= 0) throw new Error("take profit and stop must be positive");
  if (spec.flatSlopePct < 0 || spec.touchTolerancePct < 0 || spec.volMultiplier <= 0) {
    throw new Error("thresholds must be non-negative and volume multiplier must be positive");
  }
}

export function specHash(spec: Spec): string {
  const body: Record<string, number> = {};
  for (const key of Object.keys(YAML_KEY).sort() as (keyof Spec)[]) body[YAML_KEY[key]] = spec[key];
  return createHash("sha256").update(JSON.stringify(body)).digest("hex");
}

export function specLabel(spec: Spec): string {
  const bits = (Object.keys(YAML_KEY) as (keyof Spec)[]).map((key) => `${YAML_KEY[key]}=${formatSpecNum(spec[key])}`);
  return `Livermore ${bits.join(", ")}`;
}

export function yamlOf(spec: Spec): string {
  const lines = ["strategies:", "  livermore:"];
  for (const key of Object.keys(YAML_KEY) as (keyof Spec)[]) {
    lines.push(`    ${YAML_KEY[key]}: ${formatSpecNum(spec[key])}`);
  }
  return lines.join("\n");
}

export function changedKeys(from: Spec, to: Spec): (keyof Spec)[] {
  return (Object.keys(YAML_KEY) as (keyof Spec)[]).filter((key) => !sameNum(from[key], to[key]));
}

export function withKey(spec: Spec, key: keyof Spec, value: number): Spec {
  return { ...spec, [key]: value };
}

export function gridOf(key: keyof Spec): readonly number[] {
  if (key in ENTRY_GRIDS) return ENTRY_GRIDS[key as keyof typeof ENTRY_GRIDS];
  if (key in EXIT_GRIDS) return EXIT_GRIDS[key as keyof typeof EXIT_GRIDS];
  throw new Error(`${key} is not on a sweep grid`);
}

export function adjacentSpecs(spec: Spec, keys: readonly (keyof Spec)[]): { label: string; spec: Spec }[] {
  const out: { label: string; spec: Spec }[] = [];
  for (const key of keys) {
    const grid = gridOf(key);
    const index = grid.findIndex((value) => sameNum(value, spec[key]));
    if (index < 0) throw new Error(`${YAML_KEY[key]} value ${spec[key]} is not on the grid`);
    for (const j of [index - 1, index + 1]) {
      if (j < 0 || j >= grid.length) continue;
      const next = withKey(spec, key, grid[j]!);
      out.push({
        label: `${YAML_KEY[key]} ${formatSpecNum(spec[key])} → ${formatSpecNum(grid[j]!)}`,
        spec: next,
      });
    }
  }
  return out;
}

export type PlanKind = "old-vs-current" | "entry" | "exit";

export type Plan = {
  kind: PlanKind;
  parameter: string;
  from: number | string;
  to: number | string;
  champion: Spec;
  challenger: Spec;
};

/** The directed cycles, in the order they are scored. The baseline value of each grid is not a cycle. */
export function plannedCycles(): Plan[] {
  const plans: Plan[] = [
    {
      kind: "old-vs-current",
      parameter: "old_vs_current",
      from: "OLD",
      to: "CURRENT",
      champion: OLD_SPEC,
      challenger: CURRENT_SPEC,
    },
  ];
  for (const key of ENTRY_KEYS) {
    for (const value of ENTRY_GRIDS[key]) {
      if (sameNum(value, CURRENT_SPEC[key])) continue;
      plans.push({
        kind: "entry",
        parameter: YAML_KEY[key],
        from: CURRENT_SPEC[key],
        to: value,
        champion: CURRENT_SPEC,
        challenger: withKey(CURRENT_SPEC, key, value),
      });
    }
  }
  for (const key of EXIT_KEYS) {
    for (const value of EXIT_GRIDS[key]) {
      if (sameNum(value, CURRENT_SPEC[key])) continue;
      plans.push({
        kind: "exit",
        parameter: YAML_KEY[key],
        from: CURRENT_SPEC[key],
        to: value,
        champion: CURRENT_SPEC,
        challenger: withKey(CURRENT_SPEC, key, value),
      });
    }
  }
  return plans;
}

export type MoneyScore = {
  trades: number;
  trainProfit: number;
  holdoutProfit: number;
  holdoutMaxDd: number;
};

/**
 * A one-variable change raises the trade count without worse net results when
 * both cost models have more trades, train and holdout profit that are not
 * lower, and a holdout drawdown that is not higher.
 */
export function raisesTradesWithoutWorse(next: MoneyScore, baseline: MoneyScore): boolean {
  return (
    next.trades > baseline.trades &&
    next.trainProfit >= baseline.trainProfit - 1e-6 &&
    next.holdoutProfit >= baseline.holdoutProfit - 1e-6 &&
    next.holdoutMaxDd <= baseline.holdoutMaxDd + 1e-12
  );
}

/**
 * Binance USDT-M schedule for this sweep. 2 bps of adverse slippage on taker
 * fills. The resting take-profit has no extra slippage. Funding is an
 * assumption: 0.01% of notional per day, paid by longs and received by shorts.
 */
export const LIVERMORE_BINANCE_COST: QuantumCost = {
  name: "binance-usdt-m",
  takerFee: 0.0005,
  makerFee: 0.0002,
  takerSlippage: 0.0002,
  makerSlippage: 0,
  fundingPerDay: 0.0001,
};

export function losingStreak(pnls: number[]): number {
  let best = 0;
  let run = 0;
  for (const pnl of pnls) {
    if (pnl < 0) {
      run += 1;
      if (run > best) best = run;
    } else {
      run = 0;
    }
  }
  return best;
}
