import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { luckControl, timingProfit } from "./luck.ts";
import type { Fill } from "./execute.ts";
import type { Series } from "./types.ts";

function rising(n: number): Series {
  const bar = (i: number) => ({
    t: Date.parse("2024-01-01T00:00:00.000Z") + i * 15 * 60 * 1000,
    open: 100 + i,
    high: 101 + i,
    low: 99 + i,
    close: 100.5 + i,
    volume: 10,
  });
  const bars = Array.from({ length: n }, (_, i) => bar(i));
  return { "BTC/USD": bars, "ETH/USD": bars.map((item) => ({ ...item })), "SOL/USD": bars.map((item) => ({ ...item })) };
}

describe("shuffled-entry control", () => {
  it("scores a known long and repeats the same seed", () => {
    const series = rising(30);
    const fills: Fill[] = [
      {
        symbol: "BTC/USD",
        side: "LONG",
        signalIndex: 2,
        openedIndex: 3,
        closedIndex: 6,
        entry: 103,
        exit: 106,
        ret: 0,
        pnl: 0,
      },
    ];
    const costs = { fee: 0.001, slippage: 0.0005 };
    const once = timingProfit(series, fills, costs);
    assert.ok(once > 0);
    const a = luckControl(series, fills, 1, 28, costs, 20, 20261114);
    const b = luckControl(series, fills, 1, 28, costs, 20, 20261114);
    assert.equal(a.actualTiming, once);
    assert.equal(a.matchedOrBeat, b.matchedOrBeat);
    assert.equal(a.median, b.median);
    assert.equal(a.reps, 20);
  });
});
