import { START_EQUITY } from "./constants.ts";
import { netReturn, type BookRun, type CostModel } from "./execute.ts";
import { SYMBOLS, type Series, type Side, type SymbolName } from "./types.ts";
import {
  livermoreSignals,
  type LivermoreSettings,
  type LivermoreSide,
  type LivermoreSignal,
} from "../../src/lib/desk/livermore.ts";

type OpenPos = {
  side: Side;
  entry: number;
  stop: number;
  opened: number;
  signal: number;
};

/**
 * Livermore fills. A confirmed close is filled at the next bar's open.
 * The stop is the broken pivotal level: a long is out if the bar trades back
 * through that level, and a short is out if the bar trades back up through it.
 * An EMA exit is known at the close and fills on the next open.
 */
export function runLivermore(
  series: Series,
  plans: Partial<Record<SymbolName, LivermoreSignal[]>>,
  from: number,
  to: number,
  costs: CostModel,
  startEquity = START_EQUITY,
): BookRun {
  const symbols = SYMBOLS.filter((symbol) => series[symbol] && plans[symbol]);
  if (symbols.length === 0) throw new Error("runLivermore needs at least one coin");
  const weight = 1 / symbols.length;
  const n = series[symbols[0]!]!.length;
  const endSignal = Math.min(to, n - 1);
  let equity = startEquity;
  const open = new Map<SymbolName, OpenPos>();
  const fills: BookRun["fills"] = [];
  const curve = [startEquity];

  const closeAt = (symbol: SymbolName, px: number, closedIndex: number) => {
    const pos = open.get(symbol);
    if (!pos) return;
    const ret = netReturn(pos.side, pos.entry, px, costs);
    const pnl = equity * weight * ret;
    equity += pnl;
    fills.push({
      symbol,
      side: pos.side,
      signalIndex: pos.signal,
      openedIndex: pos.opened,
      closedIndex,
      entry: pos.entry,
      exit: px,
      ret,
      pnl,
    });
    open.delete(symbol);
  };

  const stopped = (pos: OpenPos, bar: { high: number; low: number }) =>
    (pos.side === "LONG" && bar.low <= pos.stop) || (pos.side === "SHORT" && bar.high >= pos.stop);

  for (let i = from; i < endSignal; i++) {
    const fillIndex = i + 1;
    if (fillIndex >= n) break;
    for (const symbol of symbols) {
      const signal = plans[symbol]![i];
      if (!signal) throw new Error(`missing Livermore signal for ${symbol} at ${i}`);
      const want = signal.side;
      const prev = i > 0 ? plans[symbol]![i - 1]!.side : "FLAT";
      const bar = series[symbol]![fillIndex]!;
      const pos = open.get(symbol);
      if (pos) {
        if (want !== pos.side) {
          closeAt(symbol, bar.open, fillIndex);
          continue;
        }
        if (stopped(pos, bar)) closeAt(symbol, pos.stop, fillIndex);
        continue;
      }
      const stop = signal.stop;
      const fresh = (want === "LONG" || want === "SHORT") && want !== prev && stop != null;
      if (!fresh || stop == null) continue;
      if (want === "LONG" && bar.open <= stop) continue;
      if (want === "SHORT" && bar.open >= stop) continue;
      const entry: OpenPos = {
        side: want,
        entry: bar.open,
        stop,
        opened: fillIndex,
        signal: i,
      };
      open.set(symbol, entry);
      if (stopped(entry, bar)) closeAt(symbol, entry.stop, fillIndex);
    }
    let marked = equity;
    for (const symbol of symbols) {
      const pos = open.get(symbol);
      if (!pos) continue;
      const ret = netReturn(pos.side, pos.entry, series[symbol]![fillIndex]!.close, costs);
      marked += marked * weight * ret;
    }
    curve.push(marked);
  }

  const end = Math.min(endSignal, n - 1);
  for (const symbol of symbols) closeAt(symbol, series[symbol]![end]!.close, end);
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
  return { profit: equity - startEquity, endEquity: equity, maxDd, fills, curve, dailyReturns };
}

export function plansFor(
  series: Series,
  settings: LivermoreSettings,
  directionFor?: (bars: { t: number; open: number; high: number; low: number; close: number; volume: number }[]) => LivermoreSide[],
): Record<SymbolName, LivermoreSignal[]> {
  return Object.fromEntries(
    SYMBOLS.filter((symbol) => series[symbol]).map((symbol) => [
      symbol,
      livermoreSignals(series[symbol], settings, directionFor?.(series[symbol])),
    ]),
  ) as Record<SymbolName, LivermoreSignal[]>;
}
