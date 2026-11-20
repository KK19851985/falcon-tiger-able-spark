import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  closedHigherEmaDirection,
  livermoreSignals,
  LIVERMORE_SETTINGS,
  type Bar,
} from "../../src/lib/desk/livermore.ts";
import { runLivermore } from "./livermore-book.ts";
import { ZERO_COSTS } from "./execute.ts";

function rising(n: number): Bar[] {
  return Array.from({ length: n }, (_, i) => {
    const close = 100 + i;
    return {
      t: Date.parse("2024-01-01T00:00:00.000Z") + i * 86_400_000,
      open: close - 0.4,
      high: close + 0.2,
      low: close - 0.6,
      close,
      volume: 10,
    };
  });
}

describe("Livermore 3-step", () => {
  it("does not enter on the breakout bar, and confirmBars delays the signal", () => {
    const bars = rising(80);
    const boom = 70;
    bars[boom] = { ...bars[boom]!, close: 250, high: 251, open: 170, low: 169, volume: 100 };
    bars[boom + 1] = { ...bars[boom + 1]!, close: 255, high: 256, open: 250, low: 249, volume: 10 };
    bars[boom + 2] = { ...bars[boom + 2]!, close: 260, high: 261, open: 255, low: 254, volume: 10 };
    const one = livermoreSignals(bars, LIVERMORE_SETTINGS);
    const two = livermoreSignals(bars, { ...LIVERMORE_SETTINGS, confirmBars: 2 });
    assert.equal(one[boom]!.side, "FLAT");
    assert.equal(one[boom + 1]!.side, "LONG");
    assert.equal(two[boom + 1]!.side, "FLAT");
    assert.equal(two[boom + 2]!.side, "LONG");
    assert.ok((one[boom + 1]!.stop ?? 0) < 250);
  });

  it("ignores a breakout whose volume is not 1.5 times the prior average", () => {
    const bars = rising(80);
    const boom = 70;
    bars[boom] = { ...bars[boom]!, close: 250, high: 251, open: 170, low: 169, volume: 10 };
    bars[boom + 1] = { ...bars[boom + 1]!, close: 255, high: 256, open: 250, low: 249, volume: 10 };
    const signals = livermoreSignals(bars);
    assert.equal(signals[boom + 1]!.side, "FLAT");
  });

  it("stops a long when price trades back through the pivotal level", () => {
    const bars = rising(90);
    const boom = 70;
    const level = Math.max(...bars.slice(boom - 20, boom).map((bar) => bar.high));
    bars[boom] = { ...bars[boom]!, close: 250, high: 251, open: 170, low: 169, volume: 100 };
    bars[boom + 1] = { ...bars[boom + 1]!, close: 255, high: 256, open: 250, low: 249, volume: 10 };
    bars[boom + 2] = { ...bars[boom + 2]!, open: 250, high: 252, low: level - 1, close: level - 0.5, volume: 10 };
    const signals = livermoreSignals(bars);
    const series = { "BTC/USD": bars, "ETH/USD": bars, "SOL/USD": bars };
    const run = runLivermore(series, { "BTC/USD": signals }, 60, bars.length - 1, ZERO_COSTS);
    const stopped = run.fills.find((fill) => fill.symbol === "BTC/USD");
    assert.ok(stopped);
    assert.equal(stopped!.exit, signals[boom + 1]!.stop);
  });

  it("does not use a later bar when deciding the current one", () => {
    const bars = rising(120);
    bars[80] = { ...bars[80]!, close: 400, high: 401, volume: 80 };
    const full = livermoreSignals(bars);
    for (let i = 0; i < bars.length; i++) {
      const cut = livermoreSignals(bars.slice(0, i + 1));
      assert.equal(cut[i]!.side, full[i]!.side);
      assert.equal(cut[i]!.stop, full[i]!.stop);
    }
  });

  it("does not read a 4-hour bar before that bar has closed", () => {
    const step = 15 * 60 * 1000;
    const start = Date.parse("2024-11-14T00:00:00.000Z");
    const bars = Array.from({ length: 16 * 6 }, (_, i) => {
      const close = 100 + i;
      return { t: start + i * step, open: close, high: close, low: close, close, volume: 1 };
    });
    const full = closedHigherEmaDirection(bars, "4h", 3);
    for (let i = 0; i < bars.length; i++) {
      const cut = closedHigherEmaDirection(bars.slice(0, i + 1), "4h", 3);
      assert.equal(cut[i], full[i], `4h lookahead at ${i}`);
    }
    const openBlock = bars.map((bar, i) => (i === 5 ? { ...bar, close: 1 } : bar));
    assert.equal(closedHigherEmaDirection(openBlock, "4h", 3)[3], full[3]);
  });
});
