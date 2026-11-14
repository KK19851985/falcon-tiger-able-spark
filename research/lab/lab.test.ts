import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, it } from "node:test";
import { BASELINE } from "./constants.ts";
import { ZERO_COSTS, netReturn, runBook } from "./execute.ts";
import { configHash } from "./hash.ts";
import { vproStance } from "./indicators.ts";
import { isPartialLast, mergeSymbol, type ExtCandle } from "./merge.ts";
import { OUTPUT_PREFIXES } from "./paths.ts";
import { adjacentMoves, propose } from "./proposer.ts";
import { appendCycle, readLedger } from "./recorder.ts";
import { combineStances } from "./strategy.ts";
import { judge } from "./skeptic.ts";
import { blockBootstrapProfit, deflatedSharpe, normInv } from "./stats.ts";
import { foldBounds, splits } from "./tester.ts";
import type {
  Bar,
  Config,
  LedgerRow,
  ProposerView,
  SideMetrics,
  Stance,
  SymbolName,
  WindowMetrics,
} from "./types.ts";

const silent = () => {};

function bar(index: number, open: number, close: number, volume = 10): Bar {
  return {
    t: Date.UTC(2024, 0, 1) + index * 86_400_000,
    open,
    high: Math.max(open, close),
    low: Math.min(open, close),
    close,
    volume,
  };
}

function view(
  config: Config,
  direction: "up" | "down",
  verdict: ProposerView["verdict"],
  championProfit: number,
  challengerProfit: number,
): ProposerView {
  return {
    verdict,
    experiment: {
      knob: "vproBand",
      direction,
      hash: configHash(config),
      config,
    },
    holdoutProfit: { champion: championProfit, challenger: challengerProfit },
  };
}

describe("proposer", () => {
  it("changes exactly one variable, starting with the next V-Pro band up", () => {
    const proposal = propose([], silent);
    assert.equal(proposal.kind, "experiment");
    if (proposal.kind !== "experiment") return;
    const changed = (Object.keys(BASELINE) as (keyof Config)[]).filter(
      (key) => proposal.move.config[key] !== BASELINE[key],
    );
    assert.deepEqual(changed, ["vproBand"]);
    assert.equal(proposal.move.from, 34);
    assert.equal(proposal.move.to, 40);
    assert.equal(proposal.move.direction, "up");
  });

  it("does not repeat a config hash", () => {
    const first = propose([], silent);
    assert.equal(first.kind, "experiment");
    if (first.kind !== "experiment") return;
    const again = propose(
      [
        {
          verdict: "INSUFFICIENT",
          experiment: {
            knob: first.move.knob,
            direction: first.move.direction,
            hash: first.move.hash,
            config: first.move.config,
          },
          holdoutProfit: { champion: 0, challenger: 0 },
        },
      ],
      silent,
    );
    assert.equal(again.kind, "experiment");
    if (again.kind !== "experiment") return;
    assert.notEqual(again.move.hash, first.move.hash);
  });

  it("refines an underpowered trial that still improved the holdout", () => {
    const tried = { ...BASELINE, vproBand: 40 };
    const next = propose([view(tried, "up", "INSUFFICIENT", 100, 180)], silent);
    assert.equal(next.kind, "experiment");
    if (next.kind !== "experiment") return;
    assert.equal(next.move.knob, "vproBand");
    assert.equal(next.move.to, 50);
  });

  it("tries the other side once a held-up direction has no further step", () => {
    const ledger = [
      view({ ...BASELINE, vproBand: 40 }, "up", "INSUFFICIENT", 100, 150),
      view({ ...BASELINE, vproBand: 50 }, "up", "INSUFFICIENT", 100, 160),
    ];
    const next = propose(ledger, silent);
    assert.equal(next.kind, "experiment");
    if (next.kind !== "experiment") return;
    assert.equal(next.move.knob, "vproBand");
    assert.equal(next.move.direction, "down");
    assert.equal(next.move.to, 30);
    assert.match(next.reasoning.join(" "), /other side/);
  });

  it("refines a direction that improved the holdout", () => {
    const tried = { ...BASELINE, vproBand: 40 };
    const next = propose([view(tried, "up", "REJECT", 100, 180)], silent);
    assert.equal(next.kind, "experiment");
    if (next.kind !== "experiment") return;
    assert.equal(next.move.knob, "vproBand");
    assert.equal(next.move.to, 50);
    assert.equal(next.move.direction, "up");
  });

  it("retires a direction after two rejections that did not improve the holdout", () => {
    const ledger = [view({ ...BASELINE, vproBand: 40 }, "up", "REJECT", 100, 40), view({ ...BASELINE, vproBand: 50 }, "up", "REJECT", 100, 20)];
    const next = propose(ledger, silent);
    assert.equal(next.kind, "experiment");
    if (next.kind !== "experiment") return;
    assert.ok(!(next.move.knob === "vproBand" && next.move.direction === "up"));
    assert.equal(next.move.knob, "vproSignal");
    assert.equal(next.move.to, 12);
  });

  it("hashes a config stably and notices a single change, including turning volume on", () => {
    assert.equal(configHash(BASELINE), configHash({ ...BASELINE }));
    assert.notEqual(configHash(BASELINE), configHash({ ...BASELINE, volumeThreshold: 0.8 }));
    assert.equal(configHash(BASELINE).length, 64);
  });
});

describe("execution", () => {
  it("fills the next open, keeps one position, and does not reverse on the same bar", () => {
    const bars = [bar(0, 10, 10), bar(1, 11, 12), bar(2, 13, 14), bar(3, 15, 16), bar(4, 17, 18)];
    const stance: Stance[] = ["FLAT", "LONG", "SHORT", "SHORT", "FLAT"];
    const series = { "BTC/USD": bars, "ETH/USD": bars, "SOL/USD": bars };
    const run = runBook(series, { "BTC/USD": stance }, 1, 4, ZERO_COSTS);
    assert.equal(run.fills.length, 2);
    assert.equal(run.fills[0]!.side, "LONG");
    assert.equal(run.fills[0]!.entry, 13);
    assert.equal(run.fills[0]!.exit, 15);
    assert.equal(run.fills[1]!.side, "SHORT");
    assert.equal(run.fills[1]!.entry, 17);
    assert.equal(run.fills[1]!.exit, 18);
  });

  it("closes a flat stance and charges the taker fee plus slippage", () => {
    const bars = [bar(0, 100, 100), bar(1, 100, 100), bar(2, 110, 110), bar(3, 110, 110)];
    const stance: Stance[] = ["LONG", "FLAT", "FLAT", "FLAT"];
    const costs = { fee: 0.001, slippage: 0.0005 };
    const run = runBook({ "BTC/USD": bars, "ETH/USD": bars, "SOL/USD": bars }, { "BTC/USD": stance }, 0, 3, costs);
    assert.equal(run.fills.length, 1);
    assert.equal(run.fills[0]!.entry, 100);
    assert.equal(run.fills[0]!.exit, 110);
    const buy = 100 * 1.0005;
    const sell = 110 * 0.9995;
    const expected = (sell / buy) * 0.999 * 0.999 - 1;
    assert.ok(Math.abs(netReturn("LONG", 100, 110, costs) - expected) < 1e-12);
    assert.ok(run.profit < 1000);
    assert.ok(run.profit > 900);
  });
});

describe("triggers", () => {
  it("requires both price triggers, then the volume trigger, then the short-skip line", () => {
    const bars = [bar(0, 100, 100), bar(1, 100, 100)];
    const flat = combineStances(bars, ["SHORT", "SHORT"], ["LONG", "LONG"], null, null);
    assert.deepEqual(flat, ["FLAT", "FLAT"]);
    const agreed = combineStances(bars, ["SHORT", "SHORT"], ["SHORT", "SHORT"], null, null);
    assert.deepEqual(agreed, ["SHORT", "SHORT"]);
    const skipped = combineStances(bars, ["SHORT", "SHORT"], ["SHORT", "SHORT"], null, [90, 90]);
    assert.deepEqual(skipped, ["FLAT", "FLAT"]);
    const stillShort = combineStances(bars, ["SHORT", "SHORT"], ["SHORT", "SHORT"], null, [110, 110]);
    assert.deepEqual(stillShort, ["SHORT", "SHORT"]);
    const volumeBlocks = combineStances(bars, ["SHORT", "SHORT"], ["SHORT", "SHORT"], ["LONG", "LONG"], null);
    assert.deepEqual(volumeBlocks, ["FLAT", "FLAT"]);
    const volumeAgrees = combineStances(bars, ["LONG", "LONG"], ["LONG", "LONG"], ["LONG", "LONG"], [90, 90]);
    assert.deepEqual(volumeAgrees, ["LONG", "LONG"]);
  });

  it("matches the desk V-Pro stance on a random walk", async () => {
    const desk = await import("../../src/lib/desk/vpro.ts");
    const bars: Bar[] = [];
    let price = 100;
    let seed = 7;
    for (let i = 0; i < 240; i++) {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      const step = (seed % 1000) / 100 - 5;
      const open = price;
      price = Math.max(1, price + step);
      bars.push(bar(i, open, price, 50 + (seed % 20)));
    }
    const mine = vproStance(bars, 34, 9);
    const theirs = desk.vproStance(bars);
    assert.deepEqual(mine, theirs);
  });
});

describe("skeptic", () => {
  it("returns INSUFFICIENT below 30 trades per coin and REJECT when the holdout does not improve", () => {
    const champion = fakeBook(100, 0.2, 40);
    const thin = fakeBook(200, 0.1, 10);
    const lowSample = judge({ champion, challenger: thin, neighbors: beatingNeighbors(100), priorHoldoutSharpes: [] }, silent);
    assert.equal(lowSample.verdict, "INSUFFICIENT");
    const worse = fakeBook(50, 0.1, 40);
    const rejected = judge({ champion, challenger: worse, neighbors: beatingNeighbors(100), priorHoldoutSharpes: [] }, silent);
    assert.equal(rejected.verdict, "REJECT");
    assert.equal(rejected.gates.find((gate) => gate.name === "holdout")!.pass, false);
  });

  it("accepts only when every gate passes, and it does not store a probability", () => {
    const champion = fakeBook(100, 0.3, 40, 0);
    const challenger = fakeBook(180, 0.2, 40, 0.2);
    const accepted = judge(
      { champion, challenger, neighbors: beatingNeighbors(100), priorHoldoutSharpes: [] },
      silent,
    );
    assert.equal(accepted.verdict, "ACCEPT");
    assert.equal("probability" in accepted, false);
    assert.equal("confidence" in accepted, false);
    assert.equal("probability" in accepted.deflated, false);
    assert.equal(accepted.deflated.clears, true);
  });

  it("raises the deflated-Sharpe hurdle once many trials disagree", () => {
    const quiet = deflatedSharpe({
      sharpe: 0.05,
      skew: 0,
      kurtosis: 3,
      observations: 250,
      trialSharpes: [0.05],
    });
    const crowded = deflatedSharpe({
      sharpe: 0.05,
      skew: 0,
      kurtosis: 3,
      observations: 250,
      trialSharpes: Array.from({ length: 40 }, (_, i) => (i - 20) / 10),
    });
    assert.equal(quiet.hurdle, 0);
    assert.ok(crowded.hurdle > quiet.hurdle);
    assert.equal(crowded.clears, false);
    assert.ok(Math.abs(normInv(0.975) - 1.95996398454) < 1e-8);
    assert.ok(Math.abs(normInv(0.5)) < 1e-12);
  });
});

describe("bootstrap, folds, and merge", () => {
  it("keeps the bootstrap band ordered and positive for a steady gain", () => {
    const band = blockBootstrapProfit(Array.from({ length: 80 }, () => 0.001), 10_000, 20261114, 400, 10);
    assert.ok(band.low <= band.high);
    assert.ok(band.low > 0);
  });

  it("builds four anchored folds that tile the later train window", () => {
    const bounds = foldBounds(80, 463);
    assert.equal(bounds.length, 4);
    assert.equal(bounds[0]!.from, 80 + Math.floor((463 - 80) * 0.5));
    assert.equal(bounds[3]!.to, 463);
    for (let i = 1; i < bounds.length; i++) assert.equal(bounds[i]!.from, bounds[i - 1]!.to);
    assert.ok(bounds.every((bound) => bound.to > bound.from));
  });

  it("replaces a partial last bar, appends confirmed days, and drops a mismatched venue", () => {
    const bundled = Array.from({ length: 30 }, (_, i) => bar(i, 100 + i, 100 + i, 1000));
    bundled[29] = bar(29, 129, 129, 1);
    assert.equal(isPartialLast(bundled), true);
    const incoming: ExtCandle[] = bundled.map((item) => ({
      t: item.t,
      open: item.open * 1.001,
      high: item.high * 1.001,
      low: item.low * 1.001,
      close: item.close * 1.001,
      volume: 5000,
      confirmed: true,
    }));
    incoming.push({ ...incoming[0]!, t: bundled[29]!.t + 86_400_000, close: 200, open: 200, high: 200, low: 200, confirmed: true });
    incoming.push({ ...incoming[0]!, t: bundled[29]!.t + 2 * 86_400_000, close: 201, open: 201, high: 201, low: 201, confirmed: false });
    const merged = mergeSymbol(bundled, incoming);
    assert.equal(merged.accepted, true);
    assert.deepEqual(merged.replaced, ["2024-01-30"]);
    assert.equal(merged.appended.length, 1);
    assert.ok(Math.abs(merged.bars[29]!.close - 129 * 1.001) < 1e-9);
    assert.equal(merged.bars.length, 31);
    assert.ok(Math.abs(merged.bars[30]!.volume - 5000 * merged.scale!) < 1e-9);
    const broken = mergeSymbol(
      bundled,
      incoming.map((item) => ({ ...item, close: item.close * 1.2, open: item.open * 1.2 })),
    );
    assert.equal(broken.accepted, false);
    assert.equal(broken.bars.length, bundled.length);
  });
});

describe("recorder", () => {
  it("appends without rewriting and writes a candidate only on accept", () => {
    const dir = mkdtempSync(path.join(tmpdir(), "falcon-lab-"));
    const paths = {
      ledger: path.join(dir, "ledger.jsonl"),
      markdown: path.join(dir, "LAB_LEDGER.md"),
      candidate: path.join(dir, "candidate.json"),
    };
    const rejected = fakeRow("REJECT");
    appendCycle(rejected, paths, silent);
    const before = readFileSync(paths.ledger, "utf8");
    appendCycle({ ...fakeRow("ACCEPT"), cycle: 2 }, paths, silent);
    const after = readFileSync(paths.ledger, "utf8");
    assert.ok(after.startsWith(before));
    assert.equal(readLedger(paths.ledger).length, 2);
    assert.equal(existsSync(paths.candidate), true);
    const candidate = JSON.parse(readFileSync(paths.candidate, "utf8")) as { promoted: boolean };
    assert.equal(candidate.promoted, false);
    const fresh = mkdtempSync(path.join(tmpdir(), "falcon-lab-"));
    appendCycle(rejected, { ...paths, ledger: path.join(fresh, "ledger.jsonl"), markdown: path.join(fresh, "LAB.md"), candidate: path.join(fresh, "candidate.json") }, silent);
    assert.equal(existsSync(path.join(fresh, "candidate.json")), false);
    assert.match(readFileSync(paths.markdown, "utf8"), /npm run lab:cycle/);
  });
});

describe("desk parity", () => {
  it("reproduces the published V-Pro + EMA 20/30 book with costs off", async () => {
    const { CLOCKS } = (await import("../../src/lib/desk/clocks.ts")) as {
      CLOCKS: Record<string, Record<SymbolName, Bar[]>>;
    };
    const { runFund } = await import("../../src/lib/desk/fund.ts");
    const { stanceFor } = await import("./strategy.ts");
    const daily = CLOCKS["1440"];
    const series = {
      "BTC/USD": daily["BTC/USD"],
      "ETH/USD": daily["ETH/USD"],
      "SOL/USD": daily["SOL/USD"],
    };
    const trial = runFund().trials.find((item) => item.name === "V-Pro + EMA 20/30");
    assert.ok(trial);
    const split = splits(series);
    const stances = {
      "BTC/USD": stanceFor(series["BTC/USD"], BASELINE),
      "ETH/USD": stanceFor(series["ETH/USD"], BASELINE),
      "SOL/USD": stanceFor(series["SOL/USD"], BASELINE),
    };
    const full = runBook(series, stances, split.trainFrom, split.holdoutTo, ZERO_COSTS);
    const train = runBook(series, stances, split.trainFrom, split.trainTo, ZERO_COSTS);
    const holdout = runBook(series, stances, split.holdoutFrom, split.holdoutTo, ZERO_COSTS);
    assert.equal(full.fills.length, trial!.fullTrades, `full trades ${full.fills.length} vs desk ${trial!.fullTrades}`);
    assert.ok(Math.abs(full.profit - trial!.fullProfit) < 1e-4, `full profit ${full.profit} vs desk ${trial!.fullProfit}`);
    assert.ok(Math.abs(train.profit - trial!.trainProfit) < 1e-4, `train ${train.profit} vs desk ${trial!.trainProfit}`);
    assert.ok(Math.abs(holdout.profit - trial!.testProfit) < 1e-4, `holdout ${holdout.profit} vs desk ${trial!.testProfit}`);
  });
});

describe("outputs", () => {
  it("never points a cycle output at the desk source", () => {
    for (const prefix of OUTPUT_PREFIXES) assert.equal(prefix.startsWith("src/"), false);
    const moves = adjacentMoves(BASELINE);
    assert.ok(moves.length >= 8);
    for (const move of moves) {
      const changed = (Object.keys(BASELINE) as (keyof Config)[]).filter((key) => move.config[key] !== BASELINE[key]);
      assert.equal(changed.length, 1);
    }
  });
});

function beatingNeighbors(championProfit: number) {
  return [1, 2, 3].map((step) => ({
    label: `neighbour ${step}`,
    hash: `n${step}`,
    holdoutProfit: championProfit + step,
  }));
}

function fakeWindow(profit: number, maxDd: number, sharpe: number): WindowMetrics {
  const perCoin = {
    "BTC/USD": { trades: 12, wins: 6, pnl: profit / 3, isolatedProfit: profit / 3 },
    "ETH/USD": { trades: 12, wins: 6, pnl: profit / 3, isolatedProfit: profit / 3 },
    "SOL/USD": { trades: 12, wins: 6, pnl: profit / 3, isolatedProfit: profit / 3 },
  };
  return {
    profit,
    endEquity: 10_000 + profit,
    trades: 36,
    wins: 18,
    losses: 18,
    winRate: 0.5,
    maxDd,
    sharpeDaily: sharpe,
    sharpeAnnual: sharpe * Math.sqrt(365),
    profitFactor: 1.2,
    meanTradeRet: 0.01,
    skew: 0,
    kurtosis: 3,
    observations: 250,
    buyHold: 500,
    bootstrapLow: profit - 50,
    bootstrapHigh: profit + 50,
    perCoin,
    regimes: {
      bull: { trades: 10, wins: 6, pnl: profit / 2, meanRet: 0.02 },
      bear: { trades: 10, wins: 4, pnl: profit / 4, meanRet: -0.01 },
      sideways: { trades: 16, wins: 8, pnl: profit / 4, meanRet: 0 },
    },
  };
}

function fakeBook(profit: number, maxDd: number, tradesPerCoin: number, sharpe = 0.2): SideMetrics {
  const window = fakeWindow(profit, maxDd, sharpe);
  return {
    train: window,
    holdout: { ...window, profit, maxDd },
    fullTrades: { "BTC/USD": tradesPerCoin, "ETH/USD": tradesPerCoin, "SOL/USD": tradesPerCoin },
    folds: [0, 1, 2, 3].map((fold) => ({
      from: `2025-0${fold + 1}-01`,
      to: `2025-0${fold + 1}-28`,
      profit: profit / 4 + fold,
      trades: 4,
      maxDd,
    })),
  };
}

function fakeRow(verdict: "ACCEPT" | "REJECT"): LedgerRow {
  const champion = fakeBook(80, 0.2, 40, 0.01);
  const challenger = fakeBook(verdict === "ACCEPT" ? 120 : 70, 0.2, 40, 0.2);
  return {
    cycle: 1,
    at: "2026-11-14T00:00:00.000Z",
    commit: "abc",
    seed: 20261114,
    data: null,
    champion: { config: BASELINE, hash: configHash(BASELINE), label: "baseline" },
    experiment: {
      config: { ...BASELINE, vproBand: 40 },
      hash: configHash({ ...BASELINE, vproBand: 40 }),
      knob: "vproBand",
      direction: "up",
      from: 34,
      to: 40,
      label: "V-Pro band 34 → 40",
      reasoning: ["one variable"],
    },
    metrics: { champion, challenger },
    neighbors: [],
    verdict,
    reason: verdict === "ACCEPT" ? "Accepted on the research ledger only." : "Rejected.",
    gates: [{ name: "holdout", pass: verdict === "ACCEPT", detail: "checked" }],
    trialsCounted: 1,
    deflated: { sharpe: 0.2, hurdle: 0, z: 2, clears: true, trials: 1, variance: 0 },
  };
}
