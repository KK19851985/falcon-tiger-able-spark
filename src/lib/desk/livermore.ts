// src/lib/desk/livermore.ts
// Livermore 3-Step: Direction (MA) → Location (Pivotal Point) → Confirmation (Volume)
// Fully self-contained — no external imports required.
// This is the leading strategy for the desk.

export type Bar = {
  t: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

export const LIVERMORE_SETTINGS = {
  maPeriod: 50,           // direction filter (rising/falling)
  maType: "ema" as "ema" | "sma",
  pivotLookback: 20,      // bars used to detect recent swing high/low
  volLookback: 20,        // average volume window
  volMultiplier: 1.5,     // breakout volume must be ≥ this × average
  confirmBars: 1,         // close must hold beyond level for N bars
};

type Side = "LONG" | "SHORT" | "FLAT";

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

function sma(values: number[], span: number): number[] {
  const out = new Array<number>(values.length).fill(Number.NaN);
  let acc = 0;
  for (let i = 0; i < values.length; i++) {
    acc += values[i]!;
    if (i >= span) acc -= values[i - span]!;
    if (i >= span - 1) out[i] = acc / span;
  }
  return out;
}

function ma(values: number[], span: number, type: "ema" | "sma"): number[] {
  return type === "ema" ? ema(values, span) : sma(values, span);
}

/** Detect simple swing high/low pivots over the lookback window. */
function findPivots(bars: Bar[], i: number, lookback: number): { high: number; low: number } | null {
  if (i < lookback) return null;
  let high = -Infinity;
  let low = Infinity;
  for (let k = i - lookback; k < i; k++) {
    high = Math.max(high, bars[k]!.high);
    low = Math.min(low, bars[k]!.low);
  }
  return { high, low };
}

/**
 * Returns the stance array (LONG / SHORT / FLAT) for the entire series.
 * Only flips when all three conditions align:
 *   1. Price is on the correct side of a rising/falling MA
 *   2. A pivotal level is broken and holds
 *   3. Volume surges on the breakout
 */
export function livermoreStance(
  bars: Bar[],
  settings = LIVERMORE_SETTINGS
): Side[] {
  const { maPeriod, maType, pivotLookback, volLookback, volMultiplier, confirmBars } = settings;
  const closes = bars.map((b) => b.close);
  const volumes = bars.map((b) => b.volume);
  const maLine = ma(closes, maPeriod, maType);
  const avgVol = sma(volumes, volLookback);

  const out: Side[] = new Array(bars.length).fill("FLAT");
  let side: Side = "FLAT";
  let confirmCount = 0;
  let pendingLevel: number | null = null;
  let pendingSide: Side | null = null;

  for (let i = 1; i < bars.length; i++) {
    const price = closes[i]!;
    const prevPrice = closes[i - 1]!;
    const maNow = maLine[i]!;
    const maPrev = maLine[i - 1]!;
    const rising = maNow > maPrev;
    const falling = maNow < maPrev;

    // Direction filter
    const longAllowed = price > maNow && rising;
    const shortAllowed = price < maNow && falling;

    // Volume confirmation
    const volOk = Number.isFinite(avgVol[i]) && volumes[i]! >= avgVol[i]! * volMultiplier;

    const pivots = findPivots(bars, i, pivotLookback);

    // Reset pending if direction filter fails
    if (pendingSide === "LONG" && !longAllowed) {
      pendingSide = null;
      pendingLevel = null;
      confirmCount = 0;
    }
    if (pendingSide === "SHORT" && !shortAllowed) {
      pendingSide = null;
      pendingLevel = null;
      confirmCount = 0;
    }

    // Look for new pivotal breakout
    if (pivots && volOk) {
      // Long breakout of recent swing high
      if (longAllowed && prevPrice <= pivots.high && price > pivots.high) {
        pendingSide = "LONG";
        pendingLevel = pivots.high;
        confirmCount = 1;
      }
      // Short breakout of recent swing low
      else if (shortAllowed && prevPrice >= pivots.low && price < pivots.low) {
        pendingSide = "SHORT";
        pendingLevel = pivots.low;
        confirmCount = 1;
      }
    }

    // Confirm hold beyond level
    if (pendingSide && pendingLevel != null) {
      const holding =
        (pendingSide === "LONG" && price > pendingLevel) ||
        (pendingSide === "SHORT" && price < pendingLevel);

      if (holding) {
        confirmCount++;
        if (confirmCount >= confirmBars) {
          side = pendingSide;
          pendingSide = null;
          pendingLevel = null;
          confirmCount = 0;
        }
      } else {
        // Failed to hold → cancel
        pendingSide = null;
        pendingLevel = null;
        confirmCount = 0;
      }
    }

    // Exit if direction filter is lost while in a position
    if (side === "LONG" && !longAllowed) side = "FLAT";
    if (side === "SHORT" && !shortAllowed) side = "FLAT";

    out[i] = side;
  }

  return out;
}

/**
 * Decide function compatible with scoreWindow / scoreOne helpers.
 * Returns the side to hold on bar i (or FLAT to close).
 */
export function livermoreDecide(
  bars: Bar[],
  i: number,
  settings = LIVERMORE_SETTINGS
): Side | null {
  if (i < settings.maPeriod + settings.pivotLookback) return null;
  const stance = livermoreStance(bars.slice(0, i + 1), settings);
  return stance[stance.length - 1] ?? null;
}

/** Convenience: full stance for a symbol's bars. */
export function livermoreStanceForBars(bars: Bar[]): Side[] {
  return livermoreStance(bars);
}
