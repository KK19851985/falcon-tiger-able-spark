/**
 * Livermore 3-step, as a pure function. The desk does not call this.
 * Direction, then location, then confirmation. One pass over the bars.
 */

export type Bar = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export type LivermoreSide = "LONG" | "SHORT" | "FLAT";

export type LivermoreSettings = {
  maPeriod: number;
  pivotLookback: number;
  volLookback: number;
  volMultiplier: number;
  /** Extra closes after the breakout that must still be beyond the level. 1 means the next close. */
  confirmBars: number;
};

export const LIVERMORE_SETTINGS: LivermoreSettings = {
  maPeriod: 50,
  pivotLookback: 20,
  volLookback: 20,
  volMultiplier: 1.5,
  confirmBars: 1,
};

export type LivermoreSignal = {
  side: LivermoreSide;
  /** Pivotal level the trade broke. A long stops if price comes back through it. */
  stop: number | null;
};

const FIFTEEN_MS = 15 * 60 * 1000;

function ema(values: number[], span: number): number[] {
  const k = 2 / (span + 1);
  const out = new Array<number>(values.length);
  let prev = values[0] ?? 0;
  for (let i = 0; i < values.length; i++) {
    prev = i === 0 ? values[i]! : values[i]! * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

function priorAverage(values: number[], i: number, len: number): number {
  if (i < len) return Number.NaN;
  let acc = 0;
  for (let k = i - len; k < i; k++) acc += values[k]!;
  return acc / len;
}

function priorPivot(bars: Bar[], i: number, len: number): { high: number; low: number } | null {
  if (i < len) return null;
  let high = -Infinity;
  let low = Infinity;
  for (let k = i - len; k < i; k++) {
    high = Math.max(high, bars[k]!.high);
    low = Math.min(low, bars[k]!.low);
  }
  return { high, low };
}

/**
 * Direction from a higher timeframe resampled out of 15-minute bars.
 * A higher bar is used only after its end time, so the bar still forming is invisible.
 */
export function closedHigherEmaDirection(bars: Bar[], tf: "4h", period: number): LivermoreSide[] {
  const dur = 4 * 60 * 60 * 1000;
  const buckets: { end: number; close: number }[] = [];
  for (const bar of bars) {
    const start = Math.floor(bar.t / dur) * dur;
    const last = buckets[buckets.length - 1];
    if (!last || last.end - dur !== start) buckets.push({ end: start + dur, close: bar.close });
    else last.close = bar.close;
  }
  const line = ema(
    buckets.map((bucket) => bucket.close),
    period,
  );
  const direction: LivermoreSide[] = buckets.map((bucket, i) => {
    if (i === 0) return "FLAT";
    const rising = line[i]! > line[i - 1]!;
    const falling = line[i]! < line[i - 1]!;
    if (bucket.close > line[i]! && rising) return "LONG";
    if (bucket.close < line[i]! && falling) return "SHORT";
    return "FLAT";
  });
  const out: LivermoreSide[] = new Array(bars.length).fill("FLAT");
  let cursor = -1;
  for (let i = 0; i < bars.length; i++) {
    const knownAt = bars[i]!.t + FIFTEEN_MS;
    while (cursor + 1 < buckets.length && buckets[cursor + 1]!.end <= knownAt) cursor++;
    if (cursor >= 0) out[i] = direction[cursor]!;
  }
  return out;
}

/**
 * Precomputed signal for every bar. The breakout bar itself never opens a trade.
 * `confirmBars` counts later closes that are still beyond the pivotal level.
 * `direction`, when supplied, replaces the local EMA (used for a closed 4-hour EMA).
 */
export function livermoreSignals(
  bars: Bar[],
  settings: LivermoreSettings = LIVERMORE_SETTINGS,
  direction?: LivermoreSide[],
): LivermoreSignal[] {
  const closes = bars.map((bar) => bar.close);
  const volumes = bars.map((bar) => bar.volume);
  const line = ema(closes, settings.maPeriod);
  const out: LivermoreSignal[] = new Array(bars.length);
  let side: LivermoreSide = "FLAT";
  let stop: number | null = null;
  let pending: { side: "LONG" | "SHORT"; level: number; count: number; armedAt: number } | null = null;

  for (let i = 0; i < bars.length; i++) {
    const close = closes[i]!;
    const prevClose = i > 0 ? closes[i - 1]! : close;
    let longAllowed = false;
    let shortAllowed = false;
    if (direction) {
      longAllowed = direction[i] === "LONG";
      shortAllowed = direction[i] === "SHORT";
    } else if (i > 0) {
      const rising = line[i]! > line[i - 1]!;
      const falling = line[i]! < line[i - 1]!;
      longAllowed = close > line[i]! && rising;
      shortAllowed = close < line[i]! && falling;
    }

    if (side === "LONG" && !longAllowed) {
      side = "FLAT";
      stop = null;
    } else if (side === "SHORT" && !shortAllowed) {
      side = "FLAT";
      stop = null;
    }

    if (pending && pending.armedAt < i) {
      const dirOk = pending.side === "LONG" ? longAllowed : shortAllowed;
      const holding = pending.side === "LONG" ? close > pending.level : close < pending.level;
      if (dirOk && holding) {
        pending.count += 1;
        if (pending.count >= settings.confirmBars && side === "FLAT") {
          side = pending.side;
          stop = pending.level;
          pending = null;
        }
      } else {
        pending = null;
      }
    }

    const pivots = priorPivot(bars, i, settings.pivotLookback);
    const average = priorAverage(volumes, i, settings.volLookback);
    const volOk = Number.isFinite(average) && volumes[i]! >= average * settings.volMultiplier;
    if (side === "FLAT" && !pending && pivots && volOk) {
      if (longAllowed && prevClose <= pivots.high && close > pivots.high) {
        pending = { side: "LONG", level: pivots.high, count: 0, armedAt: i };
      } else if (shortAllowed && prevClose >= pivots.low && close < pivots.low) {
        pending = { side: "SHORT", level: pivots.low, count: 0, armedAt: i };
      }
    }

    out[i] = { side, stop: side === "FLAT" ? null : stop };
  }
  return out;
}
