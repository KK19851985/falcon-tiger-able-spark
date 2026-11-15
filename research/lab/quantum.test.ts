import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { netReturn } from "./execute.ts";
import {
  BINANCE_QUANTUM_COST,
  COMPARISON_NOTE,
  COMPARISON_OUTPUTS,
  LAB_QUANTUM_COST,
  QUANTUM_ASSUMPTIONS,
  QUANTUM_DAILY,
  QUANTUM_FULL,
  exitCost,
  quantumNeighbors,
  runQuantumCoin,
} from "./quantum.ts";
import type { Bar, Stance } from "./types.ts";

const DAY = 86_400_000;
const M15 = 15 * 60 * 1000;

function daily(i: number, open: number, high = open, low = open, close = open, volume = 10): Bar {
  return { t: Date.UTC(2024, 0, 1) + i * DAY, open, high, low, close, volume };
}

function m15(dayIndex: number, slot: number, open: number, high: number, low: number, close: number, volume = 10): Bar {
  return { t: Date.UTC(2024, 0, 1) + dayIndex * DAY + slot * M15, open, high, low, close, volume };
}

describe("Quantum defaults", () => {
  it("keeps the specified numbers and the assumed failsafe widths", () => {
    assert.equal(QUANTUM_FULL.takeProfit, 0.005);
    assert.equal(QUANTUM_FULL.stopLoss, 0.1);
    assert.equal(QUANTUM_FULL.spike, 0.01);
    assert.equal(QUANTUM_FULL.volumeMultiple, 3);
    assert.equal(QUANTUM_FULL.emaFail, 9);
    assert.equal(QUANTUM_FULL.trail, 0.015);
    assert.equal(QUANTUM_FULL.volumeLookback, 20);
    assert.equal(QUANTUM_DAILY.trail, null);
    assert.equal(QUANTUM_DAILY.spike, null);
    assert.equal(QUANTUM_DAILY.emaFail, null);
    assert.equal(QUANTUM_DAILY.volumeMultiple, null);
    assert.equal(quantumNeighbors().length, 4);
    assert.ok(QUANTUM_ASSUMPTIONS.length >= 8);
    assert.equal(COMPARISON_NOTE.includes("candidate.json"), true);
    assert.ok(COMPARISON_OUTPUTS.every((file) => !file.includes("candidate.json") && !file.includes("src/lib/desk")));
  });
});

describe("Quantum fills", () => {
  it("enters on the next day's open and does not use the signal bar", () => {
    const bars = [0, 1, 2, 3, 4, 5].map((i) => daily(i, 100, i === 1 ? 1000 : 100, 100, 100));
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG", "LONG", "LONG"];
    const run = runQuantumCoin("ETH/USD", bars, null, stances, 0, 5, QUANTUM_DAILY, LAB_QUANTUM_COST);
    assert.equal(run.fills.length, 1);
    assert.equal(run.fills[0]!.openedIndex, 2);
    assert.equal(run.fills[0]!.entry, 100);
    assert.equal(run.fills[0]!.reason, "flatten");
    assert.equal(run.fills[0]!.side, "LONG");
  });

  it("takes the 0.5% limit and charges the lab fee on both sides", () => {
    const bars = [0, 1, 2, 3].map((i) => daily(i, 100));
    bars[2] = daily(2, 100, 101, 99.8, 100.4);
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG"];
    const run = runQuantumCoin("ETH/USD", bars, null, stances, 0, 3, QUANTUM_DAILY, LAB_QUANTUM_COST);
    assert.equal(run.fills.length, 1);
    assert.equal(run.fills[0]!.reason, "tp");
    assert.ok(Math.abs(run.fills[0]!.exit - 100.5) < 1e-9);
    const expected = netReturn("LONG", 100, 100.5, exitCost(LAB_QUANTUM_COST, "maker"), 0);
    assert.ok(Math.abs(run.fills[0]!.ret - expected) < 1e-12);
  });

  it("lets the stop win when the same bar also reaches the target", () => {
    const bars = [0, 1, 2, 3].map((i) => daily(i, 100));
    bars[2] = daily(2, 100, 110, 80, 100);
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG"];
    const run = runQuantumCoin("SOL/USD", bars, null, stances, 0, 3, QUANTUM_DAILY, LAB_QUANTUM_COST);
    assert.equal(run.fills[0]!.reason, "sl");
    assert.ok(Math.abs(run.fills[0]!.exit - 90) < 1e-9);
  });

  it("closes a short at the stop when the target is also inside the bar", () => {
    const bars = [0, 1, 2, 3].map((i) => daily(i, 100));
    bars[2] = daily(2, 100, 112, 98, 100);
    const stances: Stance[] = ["FLAT", "SHORT", "SHORT", "SHORT"];
    const run = runQuantumCoin("ETH/USD", bars, null, stances, 0, 3, QUANTUM_DAILY, LAB_QUANTUM_COST);
    assert.equal(run.fills[0]!.side, "SHORT");
    assert.equal(run.fills[0]!.reason, "sl");
    assert.ok(Math.abs(run.fills[0]!.exit - 110) < 1e-9);
  });

  it("does not re-enter while the stance stays long after a take-profit", () => {
    const bars = [0, 1, 2, 3, 4, 5].map((i) => daily(i, 100, i > 2 ? 200 : 100));
    bars[2] = daily(2, 100, 101, 99.8, 100);
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG", "LONG", "LONG"];
    const run = runQuantumCoin("ETH/USD", bars, null, stances, 0, 5, QUANTUM_DAILY, LAB_QUANTUM_COST);
    assert.equal(run.fills.length, 1);
    assert.equal(run.fills[0]!.reason, "tp");
  });

  it("closes on the opposite cross and opens the new side one day later", () => {
    const opens = [100, 100, 100, 100, 100.2, 100.3];
    const bars = opens.map((open, i) => daily(i, open));
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "SHORT", "SHORT", "SHORT"];
    const run = runQuantumCoin("ETH/USD", bars, null, stances, 0, 5, QUANTUM_DAILY, LAB_QUANTUM_COST);
    assert.equal(run.fills.length, 2);
    assert.equal(run.fills[0]!.side, "LONG");
    assert.equal(run.fills[0]!.entry, 100);
    assert.equal(run.fills[0]!.exit, 100.2);
    assert.equal(run.fills[0]!.reason, "cross");
    assert.equal(run.fills[1]!.side, "SHORT");
    assert.equal(run.fills[1]!.entry, 100.3);
    assert.equal(run.fills[1]!.openedIndex, 5);
    assert.equal(run.fills[1]!.reason, "flatten");
  });

  it("exits a 1% fifteen-minute spike before the trail", () => {
    const bars = [0, 1, 2, 3].map((i) => daily(i, 100));
    const intra = [m15(2, 0, 100, 100.2, 98.9, 99.4)];
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG"];
    const run = runQuantumCoin("ETH/USD", bars, intra, stances, 0, 3, QUANTUM_FULL, LAB_QUANTUM_COST);
    assert.equal(run.fills[0]!.reason, "spike");
    assert.ok(Math.abs(run.fills[0]!.exit - 99) < 1e-9);
  });

  it("uses the 1.5% trail once it is tighter than the spike", () => {
    const bars = [0, 1, 2, 3].map((i) => daily(i, 100));
    const intra = [m15(2, 0, 100, 100.4, 99.7, 100.2), m15(2, 1, 99.2, 99.3, 98.5, 98.8)];
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG"];
    const run = runQuantumCoin("ETH/USD", bars, intra, stances, 0, 3, QUANTUM_FULL, LAB_QUANTUM_COST);
    assert.equal(run.fills[0]!.reason, "trail");
    assert.ok(Math.abs(run.fills[0]!.exit - 100.4 * 0.985) < 1e-9);
  });

  it("fills an EMA 9 reversal at the next fifteen-minute open", () => {
    const bars = [0, 1, 2, 3].map((i) => daily(i, 100));
    const intra: Bar[] = [];
    for (let slot = 0; slot < 20; slot++) intra.push(m15(2, slot, 100, 100, 100, 100));
    intra.push(m15(2, 20, 100, 100, 99, 90));
    intra.push(m15(2, 21, 95, 95, 95, 95));
    const settings = { ...QUANTUM_FULL, trail: null, spike: null, volumeMultiple: null, stopLoss: 0.5, takeProfit: 0.5 };
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG"];
    const run = runQuantumCoin("ETH/USD", bars, intra, stances, 0, 3, settings, LAB_QUANTUM_COST);
    assert.equal(run.fills.length, 1);
    assert.equal(run.fills[0]!.reason, "ema9");
    assert.equal(run.fills[0]!.exit, 95);
    assert.equal(run.fills[0]!.exitT, intra[21]!.t);
  });

  it("fills a 3x volume surge at the next open and ignores the current bar in the average", () => {
    const bars = [0, 1, 2, 3].map((i) => daily(i, 100));
    const intra = [0, 1, 2, 3, 4].map((slot) => m15(2, slot, 100, 100, 100, 100, slot === 3 ? 40 : 10));
    const settings = {
      ...QUANTUM_DAILY,
      volumeMultiple: 3,
      volumeLookback: 3,
      stopLoss: 0.5,
      takeProfit: 0.5,
    };
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG"];
    const run = runQuantumCoin("ETH/USD", bars, intra, stances, 0, 3, settings, LAB_QUANTUM_COST);
    assert.equal(run.fills[0]!.reason, "volume");
    assert.equal(run.fills[0]!.exit, 100);
    assert.equal(run.fills[0]!.exitT, intra[4]!.t);
  });

  it("does not let a later fifteen-minute bar change an exit that already filled", () => {
    const bars = [0, 1, 2, 3].map((i) => daily(i, 100));
    const intra = [m15(2, 0, 100, 100.2, 98.9, 99.4), m15(2, 1, 50, 50, 50, 50, 10_000)];
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG"];
    const full = runQuantumCoin("ETH/USD", bars, intra, stances, 0, 3, QUANTUM_FULL, LAB_QUANTUM_COST);
    const truncated = runQuantumCoin("ETH/USD", bars, intra.slice(0, 1), stances, 0, 3, QUANTUM_FULL, LAB_QUANTUM_COST);
    assert.equal(full.fills[0]!.reason, "spike");
    assert.equal(truncated.fills[0]!.reason, "spike");
    assert.equal(truncated.fills[0]!.exit, full.fills[0]!.exit);
    assert.equal(truncated.fills[0]!.exitT, full.fills[0]!.exitT);
  });

  it("charges the maker fee on a Binance take-profit and funding only while the trade is open", () => {
    const bars = [0, 1, 2, 3].map((i) => daily(i, 100));
    bars[2] = daily(2, 100, 101, 99.9, 100.4);
    const stances: Stance[] = ["FLAT", "LONG", "LONG", "LONG"];
    const run = runQuantumCoin("ETH/USD", bars, null, stances, 0, 3, QUANTUM_DAILY, BINANCE_QUANTUM_COST);
    const expected = netReturn("LONG", 100, 100.5, exitCost(BINANCE_QUANTUM_COST, "maker"), 0);
    assert.ok(Math.abs(run.fills[0]!.ret - expected) < 1e-12);
    const held = [0, 1, 2, 3, 4, 5].map((i) => daily(i, 100));
    const heldStances: Stance[] = ["FLAT", "LONG", "LONG", "LONG", "LONG", "LONG"];
    const open = runQuantumCoin("ETH/USD", held, null, heldStances, 0, 5, QUANTUM_DAILY, BINANCE_QUANTUM_COST);
    const days = (open.fills[0]!.exitT - open.fills[0]!.entryT) / DAY;
    assert.ok(days > 0);
    const funded = netReturn("LONG", open.fills[0]!.entry, open.fills[0]!.exit, exitCost(BINANCE_QUANTUM_COST, "taker"), days);
    assert.ok(Math.abs(open.fills[0]!.ret - funded) < 1e-12);
    const sameFees = netReturn("LONG", open.fills[0]!.entry, open.fills[0]!.exit, exitCost({ ...BINANCE_QUANTUM_COST, fundingPerDay: 0 }, "taker"), days);
    assert.ok(open.fills[0]!.ret < sameFees);
  });
});
