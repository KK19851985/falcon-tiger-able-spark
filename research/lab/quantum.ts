/**
 * Quantum, a separate book from the published desk.
 *
 * Daily EMA 9/21 cross to enter. Take-profit 0.5%. Stop-loss 10%.
 * Optional 15-minute failsafes. This file does not import the desk and
 * nothing here is written back to it.
 *
 * Assumptions below were fixed before the comparison was scored. They are
 * not a fit to the tape. Specified numbers are not searched.
 */
import { netReturn, type CostModel } from "./execute.ts";
import { ema } from "./indicators.ts";
import type { Bar, Side, Stance } from "./types.ts";

export const QUANTUM_EMA_FAST = 9;
export const QUANTUM_EMA_SLOW = 21;

export type ExitReason = "tp" | "sl" | "trail" | "spike" | "ema9" | "volume" | "cross" | "flatten";

export type QuantumSettings = {
  takeProfit: number;
  stopLoss: number;
  /** Trail from the best price since entry. Null turns the trail off. */
  trail: number | null;
  /** One-bar adverse spike from that bar's open. Null turns it off. */
  spike: number | null;
  /** 15-minute EMA period for the reversal exit. Null turns it off. */
  emaFail: number | null;
  /** Volume / prior-average multiple. Null turns the surge exit off. */
  volumeMultiple: number | null;
  volumeLookback: number;
};

/** The bot as specified, plus the assumed failsafe widths. */
export const QUANTUM_FULL: QuantumSettings = {
  takeProfit: 0.005,
  stopLoss: 0.1,
  trail: 0.015,
  spike: 0.01,
  emaFail: 9,
  volumeMultiple: 3,
  volumeLookback: 20,
};

/** Same daily cross, take-profit, and stop, with every 15-minute failsafe off. */
export const QUANTUM_DAILY: QuantumSettings = {
  ...QUANTUM_FULL,
  trail: null,
  spike: null,
  emaFail: null,
  volumeMultiple: null,
};

export const QUANTUM_ASSUMPTIONS = [
  "Long and short are both allowed. The published short-skip above the 20 EMA belongs to Falcon and is not applied here. The desk has no description of this bot.",
  "A cross is the entry. The stance is not held. After a take-profit, stop, or failsafe, the coin stays flat until EMA 9 crosses EMA 21 again.",
  "The cross is known at the daily close and fills at the next day's open. An opposite cross closes at that next open. The new side waits one more day, the same one-bar delay the desk uses when it will not reverse on the exit bar.",
  "Take-profit is a resting limit at 0.5% from the fill. Stop-loss is a stop at 10% from the fill. Both are measured from the entry price, not from the signal close.",
  "When a bar's range touches the target and a stop, the stop fills. That is the pessimistic path. A gap through a stop fills at the open. A gap through the take-profit still fills at the limit price.",
  "The trailing stop is assumed at 1.5% from the best price since entry (the high for a long, the low for a short). It is active immediately, so it is tighter than the 10% stop from the first bar. It uses the extreme known before the current bar.",
  "The spike guard is the specified 1% move. On a 15-minute bar, a long exits if the low reaches 1% under that bar's open, and a short exits if the high reaches 1% over that open. The fill is that 1% level, or the open if the bar opens through it.",
  "EMA 9 reversal means the 15-minute close crosses the 15-minute EMA 9 against the position: a long exits when the close goes from at or above the EMA to below it, and a short does the opposite. It fills at the next 15-minute open. An EMA-slope flip was not used.",
  "The volume-surge exit is the specified 3×. The average is the prior 20 fifteen-minute bars, the same lookback the desk uses for its volume rule, and the current bar is not inside that average. Any 3× bar exits, in either direction. It fills at the next 15-minute open. If the EMA reversal and the surge arm on the same close, the exit is counted as the EMA reversal.",
  "Among stops touched in one bar, the one closest to the open in the adverse direction fills first. For a long that is the highest stop. For a short it is the lowest.",
  "Each window starts flat and flattens at its last bar's close. A 15-minute failsafe cannot see a bar that has not closed. Funding uses the fill bar's open time, so a round trip inside the entry bar accrues none.",
  "One times leverage is a fully funded cash return on that coin's own stake. There is no exchange liquidation engine and no shared margin.",
] as const;

/** The comparison records this so a reader does not look for a promotion file. */
export const COMPARISON_NOTE =
  "This comparison does not write research/lab/candidate.json and does not edit src/lib/desk.";

export const COMPARISON_OUTPUTS = ["docs/LAB_LEDGER.md", "research/lab/data/quantum-falcon-result.json"] as const;

export type QuantumCost = {
  name: string;
  takerFee: number;
  makerFee: number;
  takerSlippage: number;
  makerSlippage: number;
  fundingPerDay: number;
};

/** The lab's published cost: 0.1% taker and 5 bps slippage on both sides. No funding. */
export const LAB_QUANTUM_COST: QuantumCost = {
  name: "lab",
  takerFee: 0.001,
  makerFee: 0.001,
  takerSlippage: 0.0005,
  makerSlippage: 0.0005,
  fundingPerDay: 0,
};

/**
 * Binance USDT-M standard schedule used for the sensitivity.
 * The take-profit limit pays the maker fee. Every other fill pays the taker fee.
 * No extra slippage. Funding is a flat +0.01% per day paid by longs and received by shorts.
 */
export const BINANCE_QUANTUM_COST: QuantumCost = {
  name: "binance-usdt-m",
  takerFee: 0.0005,
  makerFee: 0.0002,
  takerSlippage: 0,
  makerSlippage: 0,
  fundingPerDay: 0.0001,
};

export type QuantumFill = {
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

export type QuantumRun = {
  profit: number;
  endEquity: number;
  maxDd: number;
  fills: QuantumFill[];
  curve: number[];
  dailyReturns: number[];
  exitCounts: Record<ExitReason, number>;
  signalTies: number;
  fallbackDays: number;
  shortDays: number;
};

type Pos = {
  side: Side;
  entry: number;
  entryT: number;
  openedIndex: number;
  signal: number;
  extreme: number;
  armed: "ema9" | "volume" | null;
};

type Pending = { action: "enter" | "reverse"; side: Side; signal: number };

const DAY_MS = 86_400_000;
const M15_MS = 15 * 60 * 1000;

const EMPTY_EXITS = (): Record<ExitReason, number> => ({
  tp: 0,
  sl: 0,
  trail: 0,
  spike: 0,
  ema9: 0,
  volume: 0,
  cross: 0,
  flatten: 0,
});

export function wantsFifteen(settings: QuantumSettings): boolean {
  return settings.trail != null || settings.spike != null || settings.emaFail != null || settings.volumeMultiple != null;
}

export function quantumNeighbors(base: QuantumSettings = QUANTUM_FULL): { label: string; settings: QuantumSettings }[] {
  return [
    { label: "trail 1.5% → 1.0%", settings: { ...base, trail: 0.01 } },
    { label: "trail 1.5% → 2.0%", settings: { ...base, trail: 0.02 } },
    { label: "volume lookback 20 → 10", settings: { ...base, volumeLookback: 10 } },
    { label: "volume lookback 20 → 30", settings: { ...base, volumeLookback: 30 } },
  ];
}

export function exitCost(cost: QuantumCost, kind: "taker" | "maker"): CostModel {
  const maker = kind === "maker";
  return {
    fee: cost.takerFee,
    slippage: cost.takerSlippage,
    exitFee: maker ? cost.makerFee : cost.takerFee,
    exitSlippage: maker ? cost.makerSlippage : cost.takerSlippage,
    fundingPerDay: cost.fundingPerDay,
  };
}

function holdDays(entryT: number, exitT: number): number {
  return Math.max(0, (exitT - entryT) / DAY_MS);
}

export function groupByDay(daily: Bar[], m15: Bar[]): Map<number, Bar[]> {
  const map = new Map<number, Bar[]>();
  for (const bar of daily) map.set(bar.t, []);
  for (const bar of m15) {
    const day = Math.floor(bar.t / DAY_MS) * DAY_MS;
    const list = map.get(day);
    if (list) list.push(bar);
  }
  for (const list of map.values()) list.sort((a, b) => a.t - b.t);
  return map;
}

type StopHit = { px: number; reason: ExitReason; kind: "taker" | "maker" };

function firstStop(side: Side, open: number, far: number, levels: { px: number; reason: ExitReason }[]): StopHit | null {
  const gapped = levels.filter((level) => (side === "LONG" ? open <= level.px : open >= level.px));
  if (gapped.length) {
    gapped.sort((a, b) => (side === "LONG" ? b.px - a.px : a.px - b.px));
    return { px: open, reason: gapped[0]!.reason, kind: "taker" };
  }
  const touched = levels.filter((level) => (side === "LONG" ? far <= level.px : far >= level.px));
  if (!touched.length) return null;
  touched.sort((a, b) => (side === "LONG" ? b.px - a.px : a.px - b.px));
  return { px: touched[0]!.px, reason: touched[0]!.reason, kind: "taker" };
}

/**
 * One coin. `daily` is the signal tape. `m15` is the execution tape for the
 * failsafes and may be null when every failsafe is off. `from` and `to` match
 * `runBook`: signals are the bars in [from, end), and end is min(to, n - 1).
 */
export function runQuantumCoin(
  symbol: string,
  daily: Bar[],
  m15: Bar[] | null,
  stances: Stance[],
  from: number,
  to: number,
  settings: QuantumSettings,
  cost: QuantumCost,
  startEquity = 10_000,
): QuantumRun {
  if (stances.length !== daily.length) throw new Error(`${symbol} stance length does not match the daily bars`);
  const n = daily.length;
  const end = Math.min(to, n - 1);
  if (from < 0 || from > end) throw new Error(`${symbol} window ${from}..${to} is outside the tape`);
  const fast = wantsFifteen(settings);
  const byDay = fast && m15 ? groupByDay(daily, m15) : null;
  const emaLine = fast && m15 && settings.emaFail != null ? ema(m15.map((bar) => bar.close), settings.emaFail) : null;
  const m15Index = new Map<number, number>();
  if (m15) {
    for (let i = 0; i < m15.length; i++) m15Index.set(m15[i]!.t, i);
  }

  let equity = startEquity;
  let position: Pos | null = null;
  let pending: Pending | null = null;
  let delayed: { side: Side; signal: number } | null = null;
  const fills: QuantumFill[] = [];
  const exitCounts = EMPTY_EXITS();
  let signalTies = 0;
  let fallbackDays = 0;
  let shortDays = 0;
  const curve = [startEquity];

  const close = (px: number, exitT: number, reason: ExitReason, closedIndex: number, kind: "taker" | "maker") => {
    if (!position) return;
    const ret = netReturn(position.side, position.entry, px, exitCost(cost, kind), holdDays(position.entryT, exitT));
    const pnl = equity * ret;
    equity += pnl;
    fills.push({
      symbol,
      side: position.side,
      reason,
      signalIndex: position.signal,
      openedIndex: position.openedIndex,
      closedIndex,
      entry: position.entry,
      exit: px,
      ret,
      pnl,
      entryT: position.entryT,
      exitT,
    });
    exitCounts[reason] += 1;
    position = null;
  };

  const describeSession = (day: Bar): { bars: Bar[]; fallback: boolean } => {
    if (!fast || !byDay) return { bars: [day], fallback: false };
    const bars = byDay.get(day.t) ?? [];
    if (bars.length === 0) return { bars: [day], fallback: true };
    return { bars, fallback: false };
  };

  const armSignal = (bar: Bar, allowFast: boolean) => {
    if (!position || !allowFast || !m15) return;
    const index = m15Index.get(bar.t);
    if (index == null || index <= 0) return;
    const reasons: ("ema9" | "volume")[] = [];
    if (emaLine && settings.emaFail != null) {
      const prev = m15[index - 1]!;
      const prevEma = emaLine[index - 1]!;
      const nowEma = emaLine[index]!;
      if (position.side === "LONG" && prev.close >= prevEma && bar.close < nowEma) reasons.push("ema9");
      if (position.side === "SHORT" && prev.close <= prevEma && bar.close > nowEma) reasons.push("ema9");
    }
    if (settings.volumeMultiple != null && index >= settings.volumeLookback) {
      let sum = 0;
      for (let k = index - settings.volumeLookback; k < index; k++) sum += m15[k]!.volume;
      const avg = sum / settings.volumeLookback;
      if (avg > 0 && bar.volume >= settings.volumeMultiple * avg) reasons.push("volume");
    }
    if (reasons.length > 1) signalTies += 1;
    if (reasons.length) position.armed = reasons[0]!;
  };

  const manage = (dayIndex: number, day: Bar) => {
    if (!position) return;
    const { bars, fallback } = describeSession(day);
    const allowFast = fast && !fallback;
    for (const bar of bars) {
      if (!position) return;
      if (position.armed) {
        close(bar.open, bar.t, position.armed, dayIndex, "taker");
        return;
      }
      const side = position.side;
      const tp = side === "LONG" ? position.entry * (1 + settings.takeProfit) : position.entry * (1 - settings.takeProfit);
      const levels: { px: number; reason: ExitReason }[] = [
        { px: side === "LONG" ? position.entry * (1 - settings.stopLoss) : position.entry * (1 + settings.stopLoss), reason: "sl" },
      ];
      if (allowFast && settings.trail != null) {
        levels.push({
          px: side === "LONG" ? position.extreme * (1 - settings.trail) : position.extreme * (1 + settings.trail),
          reason: "trail",
        });
      }
      if (allowFast && settings.spike != null) {
        levels.push({
          px: side === "LONG" ? bar.open * (1 - settings.spike) : bar.open * (1 + settings.spike),
          reason: "spike",
        });
      }
      const throughTarget = side === "LONG" ? bar.open >= tp : bar.open <= tp;
      if (throughTarget) {
        close(tp, bar.t, "tp", dayIndex, "maker");
        return;
      }
      const far = side === "LONG" ? bar.low : bar.high;
      const stop = firstStop(side, bar.open, far, levels);
      const targetTouched = side === "LONG" ? bar.high >= tp : bar.low <= tp;
      if (stop) {
        close(stop.px, bar.t, stop.reason, dayIndex, "taker");
        return;
      }
      if (targetTouched) {
        close(tp, bar.t, "tp", dayIndex, "maker");
        return;
      }
      position.extreme = side === "LONG" ? Math.max(position.extreme, bar.high) : Math.min(position.extreme, bar.low);
      armSignal(bar, allowFast);
    }
  };

  const mark = (day: Bar) => {
    if (!position) {
      curve.push(equity);
      return;
    }
    const { bars, fallback } = describeSession(day);
    const last = bars[bars.length - 1] ?? day;
    const exitT = fast && !fallback ? last.t + M15_MS : day.t + DAY_MS;
    const px = fast && !fallback ? last.close : day.close;
    const ret = netReturn(position.side, position.entry, px, exitCost(cost, "taker"), holdDays(position.entryT, exitT));
    curve.push(equity * (1 + ret));
  };

  for (let i = from; i < end; i++) {
    const side = stances[i]!;
    const prev = i > 0 ? stances[i - 1]! : "FLAT";
    const crossed = (side === "LONG" || side === "SHORT") && side !== prev;
    if (crossed) {
      delayed = null;
      if (position && position.side !== side) pending = { action: "reverse", side, signal: i };
      else if (!position) pending = { action: "enter", side, signal: i };
      else pending = null;
    }
    const fillDay = i + 1;
    if (fillDay >= n) break;
    const day = daily[fillDay]!;
    const opened = describeSession(day);
    if (fast && opened.fallback) fallbackDays += 1;
    else if (fast && opened.bars.length < 90) shortDays += 1;
    const px = fast && !opened.fallback ? opened.bars[0]!.open : day.open;
    const openT = fast && !opened.fallback ? opened.bars[0]!.t : day.t;
    let blocked = false;
    if (position?.armed) {
      close(px, openT, position.armed, fillDay, "taker");
      blocked = true;
    }
    if (pending?.action === "reverse") {
      if (position && position.side !== pending.side) {
        close(px, openT, "cross", fillDay, "taker");
        blocked = true;
      }
      delayed = { side: pending.side, signal: pending.signal };
      pending = null;
    } else if (pending?.action === "enter" && !position && !blocked) {
      position = {
        side: pending.side,
        entry: px,
        entryT: openT,
        openedIndex: fillDay,
        signal: pending.signal,
        extreme: px,
        armed: null,
      };
      pending = null;
    }
    if (delayed && !position && !blocked) {
      position = {
        side: delayed.side,
        entry: px,
        entryT: openT,
        openedIndex: fillDay,
        signal: delayed.signal,
        extreme: px,
        armed: null,
      };
      delayed = null;
    }
    manage(fillDay, day);
    mark(day);
  }

  if (position) {
    const day = daily[end]!;
    const opened = describeSession(day);
    const last = opened.bars[opened.bars.length - 1] ?? day;
    const atClose = !(fast && !opened.fallback);
    const px = atClose ? day.close : last.close;
    const exitT = atClose ? day.t + DAY_MS : last.t + M15_MS;
    close(px, exitT, "flatten", end, "taker");
  }
  if (curve.length === 1) curve.push(equity);
  else curve[curve.length - 1] = equity;

  let peak = curve[0]!;
  let maxDd = 0;
  const dailyReturns: number[] = [];
  for (let i = 0; i < curve.length; i++) {
    const point = curve[i]!;
    if (i > 0) {
      const prev = curve[i - 1]!;
      dailyReturns.push(prev !== 0 ? point / prev - 1 : 0);
    }
    peak = Math.max(peak, point);
    maxDd = Math.max(maxDd, peak > 0 ? (peak - point) / peak : 0);
  }

  return {
    profit: equity - startEquity,
    endEquity: equity,
    maxDd,
    fills,
    curve,
    dailyReturns,
    exitCounts,
    signalTies,
    fallbackDays,
    shortDays,
  };
}
