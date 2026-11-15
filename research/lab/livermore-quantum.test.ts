import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { LAB_QUANTUM_COST } from "./quantum.ts";
import type { Bar } from "./types.ts";
import {
  CURRENT_SPEC,
  OLD_SPEC,
  adjacentSpecs,
  brokenLevel,
  changedKeys,
  clusterLevels,
  directionSeries,
  ema,
  exitOnBar,
  plannedCycles,
  prepareCoin,
  raisesTradesWithoutWorse,
  runLivermoreBook,
  swingPoints,
  type Spec,
} from "./livermore-quantum.ts";

const BAR = 15 * 60 * 1000;

function bar(i: number, open: number, high: number, low: number, close: number, volume = 100): Bar {
  return { t: Date.parse("2026-01-01T00:00:00.000Z") + i * BAR, open, high, low, close, volume };
}

function spec(over: Partial<Spec> = {}): Spec {
  return {
    ...CURRENT_SPEC,
    maLength: 2,
    maSlopeBars: 1,
    flatSlopePct: 0,
    tangleBars: 0,
    pivotLookback: 6,
    pivotWing: 1,
    touchTolerancePct: 0.001,
    minTouches: 1,
    confirmBars: 1,
    volMultiplier: 1,
    volLookback: 2,
    takeProfit: 0.005,
    stopLoss: 0.1,
    ...over,
  };
}

describe("Quantum Livermore rules", () => {
  it("keeps a long only when the close is above a rising EMA and the slope clears the flat band", () => {
    const closes = [10, 10, 10, 11, 12, 12];
    const line = ema(closes, 2);
    const loose = directionSeries(closes, line, { maLength: 2, maSlopeBars: 1, flatSlopePct: 0, tangleBars: 0 });
    assert.equal(loose[0], "FLAT");
    assert.equal(loose[4], "LONG");
    const tight = directionSeries(closes, line, { maLength: 2, maSlopeBars: 1, flatSlopePct: 0.5, tangleBars: 0 });
    assert.equal(tight[4], "FLAT");
    const down = [12, 12, 12, 11, 10, 10];
    const short = directionSeries(down, ema(down, 2), { maLength: 2, maSlopeBars: 1, flatSlopePct: 0, tangleBars: 0 });
    assert.equal(short[4], "SHORT");
  });

  it("treats a cross or a touch of the EMA inside the tangle window as flat", () => {
    const closes = [10, 10, 10, 12, 9];
    const line = ema(closes, 2);
    const open = directionSeries(closes, line, { maLength: 2, maSlopeBars: 1, flatSlopePct: 0, tangleBars: 0 });
    const blocked = directionSeries(closes, line, { maLength: 2, maSlopeBars: 1, flatSlopePct: 0, tangleBars: 2 });
    assert.notEqual(open[3], "FLAT");
    assert.equal(blocked[3], "FLAT");
    assert.equal(blocked[4], "FLAT");
  });

  it("requires a strict swing and clusters only prices within tolerance of the seed", () => {
    const bars = [
      bar(0, 1, 10, 1, 1),
      bar(1, 1, 12, 1, 1),
      bar(2, 1, 11, 1, 1),
      bar(3, 1, 12.006, 1, 1),
      bar(4, 1, 11, 1, 1),
      bar(5, 1, 13, 1, 1),
    ];
    const highs = swingPoints(bars, 1, "high");
    assert.deepEqual(highs.map((swing) => swing.i), [1, 3]);
    const tied = [bar(0, 1, 10, 1, 1), bar(1, 1, 12, 1, 1), bar(2, 1, 12, 1, 1)];
    assert.equal(swingPoints(tied, 1, "high").length, 0);
    const clustered = clusterLevels([100, 100.05, 102], 0.001, 2);
    assert.equal(clustered.length, 1);
    assert.ok(Math.abs(clustered[0]! - 100.025) < 1e-9);
    assert.equal(clusterLevels([100], 0.001, 2).length, 0);
    assert.equal(clusterLevels([100], 0.001, 1)[0], 100);
  });

  it("breaks the furthest level crossed and ignores a level price is already beyond", () => {
    assert.equal(brokenLevel("LONG", 100, 110, [102, 108]), 108);
    assert.equal(brokenLevel("LONG", 100, 105, [102, 108]), 102);
    assert.equal(brokenLevel("LONG", 109, 112, [102, 108]), null);
    assert.equal(brokenLevel("SHORT", 110, 100, [108, 102]), 102);
  });

  it("fills the stop when the same bar touches the target and the stop", () => {
    const both = exitOnBar("LONG", 100, bar(0, 100, 101, 89, 100), 100, { takeProfit: 0.005, stopLoss: 0.1 });
    assert.equal(both?.reason, "sl");
    assert.equal(both?.price, 90);
    const gap = exitOnBar("LONG", 100, bar(0, 80, 80, 70, 75), 100, { takeProfit: 0.005, stopLoss: 0.1 });
    assert.equal(gap?.reason, "sl");
    assert.equal(gap?.price, 80);
    const target = exitOnBar("LONG", 100, bar(0, 100, 100.6, 99.9, 100.2), 90, { takeProfit: 0.005, stopLoss: 0.1 });
    assert.equal(target?.reason, "tp");
    assert.equal(target?.kind, "maker");
    assert.ok(Math.abs(target!.price - 100.5) < 1e-9);
    const emaExit = exitOnBar("SHORT", 100, bar(0, 100, 100.2, 99.8, 101), 100.4, { takeProfit: 0.005, stopLoss: 0.1 });
    assert.equal(emaExit?.reason, "ema");
    assert.equal(emaExit?.price, 101);
  });

  it("enters on the next open only when direction, level, and volume agree", () => {
    const bars = [
      bar(0, 100, 101, 99, 100, 10),
      bar(1, 100, 110, 100, 108, 10),
      bar(2, 108, 109, 107, 108, 10),
      bar(3, 108, 112, 108, 111, 10),
      bar(4, 111, 111.7, 111, 111.2, 10),
    ];
    const taken = runLivermoreBook([{ symbol: "BTC/USD", bars }], spec(), 0, bars.length - 1, LAB_QUANTUM_COST);
    assert.equal(taken.fills.length, 1);
    assert.equal(taken.fills[0]!.side, "LONG");
    assert.equal(taken.fills[0]!.reason, "tp");
    assert.equal(taken.fills[0]!.openedIndex, 4);
    const quiet = bars.map((item, index) => (index === 3 ? { ...item, volume: 1 } : item));
    const blocked = runLivermoreBook([{ symbol: "BTC/USD", bars: quiet }], spec({ volMultiplier: 2, volLookback: 2 }), 0, bars.length - 1, LAB_QUANTUM_COST);
    assert.equal(blocked.fills.length, 0);
    const off = runLivermoreBook([{ symbol: "BTC/USD", bars: quiet }], spec({ volMultiplier: 1, volLookback: 2 }), 0, bars.length - 1, LAB_QUANTUM_COST);
    assert.equal(off.fills.length, 1);
  });

  it("waits for a second close when confirm_bars is 2, and checks volume on the breakout bar only", () => {
    const bars = [
      bar(0, 100, 101, 99, 100, 50),
      bar(1, 100, 110, 100, 108, 50),
      bar(2, 108, 109, 107, 108, 50),
      bar(3, 108, 112, 108, 111, 100),
      bar(4, 111, 112, 110.5, 111.5, 1),
      bar(5, 111.5, 112, 111, 111.4, 1),
      bar(6, 111.4, 113, 111, 112, 1),
    ];
    const run = runLivermoreBook(
      [{ symbol: "BTC/USD", bars }],
      spec({ confirmBars: 2, volMultiplier: 1.5, volLookback: 2, takeProfit: 0.05, stopLoss: 0.1 }),
      0,
      bars.length - 1,
      LAB_QUANTUM_COST,
    );
    assert.equal(run.fills.length, 1);
    assert.equal(run.fills[0]!.signalIndex, 4);
    assert.equal(run.fills[0]!.openedIndex, 5);
  });

  it("holds one position and does not use a later bar to rewrite an earlier signal", () => {
    const bars = [
      bar(0, 100, 101, 99, 100),
      bar(1, 100, 110, 100, 108),
      bar(2, 108, 109, 107, 108),
      bar(3, 108, 112, 108, 111),
      bar(4, 111, 111.2, 110.8, 111),
      bar(5, 111, 111.2, 110.8, 111),
      bar(6, 111, 140, 80, 130),
    ];
    const rules = spec({ takeProfit: 0.05, stopLoss: 0.2 });
    const full = runLivermoreBook([{ symbol: "BTC/USD", bars }], rules, 0, 5, LAB_QUANTUM_COST);
    const prefix = runLivermoreBook([{ symbol: "BTC/USD", bars: bars.slice(0, 6) }], rules, 0, 5, LAB_QUANTUM_COST);
    assert.equal(full.fills.length, 1);
    assert.equal(prefix.fills.length, 1);
    assert.equal(full.fills[0]!.signalIndex, prefix.fills[0]!.signalIndex);
    assert.equal(full.fills[0]!.exit, prefix.fills[0]!.exit);
    const again = runLivermoreBook([{ symbol: "BTC/USD", bars }], rules, 0, bars.length - 1, LAB_QUANTUM_COST);
    assert.equal(again.fills.filter((fill) => fill.openedIndex === full.fills[0]!.openedIndex).length, 1);
    const early = prepareCoin(bars.slice(0, 4), rules);
    const later = prepareCoin(bars, rules);
    assert.deepEqual(later.dir.slice(0, 4), early.dir);
    assert.deepEqual(later.highs.filter((swing) => swing.i <= 2), early.highs.filter((swing) => swing.i <= 2));
  });

  it("describes the two baselines as one-variable steps off the current rule", () => {
    const changed = changedKeys(OLD_SPEC, CURRENT_SPEC).map(String).sort();
    assert.deepEqual(changed, ["confirmBars", "maSlopeBars", "minTouches", "pivotLookback", "pivotWing", "tangleBars", "volMultiplier"].sort());
    const steps = adjacentSpecs(CURRENT_SPEC, ["tangleBars"]);
    assert.equal(steps.length, 2);
    assert.equal(changedKeys(CURRENT_SPEC, steps[0]!.spec).length, 1);
    const plans = plannedCycles();
    assert.equal(plans.length, 33);
    assert.equal(plans[0]!.kind, "old-vs-current");
    assert.equal(plans.filter((plan) => plan.kind === "entry").length, 28);
    assert.equal(plans.filter((plan) => plan.kind === "exit").length, 4);
    for (const plan of plans) {
      if (plan.kind === "old-vs-current") continue;
      assert.equal(changedKeys(plan.champion, plan.challenger).length, 1);
      assert.equal(plan.champion, CURRENT_SPEC);
    }
    const base = { trades: 10, trainProfit: 1, holdoutProfit: 1, holdoutMaxDd: 0.2 };
    assert.equal(raisesTradesWithoutWorse({ ...base, trades: 12, holdoutProfit: 2 }, base), true);
    assert.equal(raisesTradesWithoutWorse({ ...base, trades: 12, holdoutMaxDd: 0.3 }, base), false);
    assert.equal(raisesTradesWithoutWorse({ ...base, trades: 12, holdoutProfit: 0 }, base), false);
    assert.equal(raisesTradesWithoutWorse(base, base), false);
  });
});
