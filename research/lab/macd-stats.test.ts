import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { ZERO_COSTS } from "./execute.ts";
import {
  BINANCE_TAKER_COST,
  DIV_ACTIVE,
  HORIZON,
  LAB_COST,
  PIVOT_WING,
  alignClosed,
  cellSurvives,
  contrastClaim,
  benjaminiHochberg,
  bootstrapMean,
  collectEvents,
  costBreakeven,
  divergenceFlags,
  gradeOriginal,
  grossBreakeven,
  priceTrade,
  regularizedBeta,
  resampleFactor,
  resampleWeeks,
  resolveTrade,
  runBracketBook,
  signalTypesAt,
  studentSurvival,
  tvAtr,
  tvEma,
  tvMacd,
  weekStart,
  welchT,
  type BookEvent,
  type SurvivalInput,
} from "./macd-stats.ts";
import type { Bar } from "./types.ts";

function bar(i: number, close: number, range = 1, step = 60_000): Bar {
  return {
    t: Date.parse("2024-01-01T00:00:00.000Z") + i * step,
    open: close - range * 0.2,
    high: close + range,
    low: close - range,
    close,
    volume: 1,
  };
}

describe("MACD signal math", () => {
  it("seeds the EMA with an SMA, the way TradingView does", () => {
    const ema = tvEma([1, 2, 3, 4, 5], 3);
    assert.ok(Number.isNaN(ema[0]));
    assert.ok(Number.isNaN(ema[1]));
    assert.equal(ema[2], 2);
    assert.equal(ema[3], 3);
    assert.equal(ema[4], 4);
  });

  it("keeps ATR at the Wilder RMA after the seed", () => {
    const bars = [10, 12, 11, 13].map((close, i) => bar(i, close, 1));
    const atr = tvAtr(bars, 3);
    assert.ok(Number.isNaN(atr[1]));
    assert.ok(atr[2]! > 0);
    assert.ok(Number.isFinite(atr[3]));
  });

  it("maps the six signal types and allows a zero cross beside a signal cross", () => {
    assert.deepEqual(signalTypesAt(-0.4, -0.1, -0.2, -0.3), [0]);
    assert.deepEqual(signalTypesAt(0.1, 0.4, 0.3, 0.2), [1]);
    assert.deepEqual(signalTypesAt(0.4, 0.1, 0.2, 0.3), [2]);
    assert.deepEqual(signalTypesAt(-0.1, -0.4, -0.3, -0.2), [3]);
    assert.deepEqual(signalTypesAt(-0.2, 0.2, 0.4, 0.5), [4]);
    assert.deepEqual(signalTypesAt(0.2, -0.2, -0.4, -0.5), [5]);
    const both = signalTypesAt(-0.2, 0.3, -0.1, 0.1);
    assert.deepEqual(both, [1, 4]);
  });

  it("does not read a later bar when it classifies the current one", () => {
    const bars = Array.from({ length: 360 }, (_, i) => bar(i, 100 + Math.sin(i / 6) * 8, 0.4));
    const full = tvMacd(
      bars.map((row) => row.close),
      12,
      26,
      9,
    );
    for (let i = 30; i < bars.length; i++) {
      const cut = tvMacd(
        bars.slice(0, i + 1).map((row) => row.close),
        12,
        26,
        9,
      );
      assert.equal(signalTypesAt(cut.macd[i - 1]!, cut.macd[i]!, cut.signal[i - 1]!, cut.signal[i]!).join(), signalTypesAt(full.macd[i - 1]!, full.macd[i]!, full.signal[i - 1]!, full.signal[i]!).join());
    }
  });
});

describe("trade resolution", () => {
  it("fills the stop when the same bar also trades the target", () => {
    const bars = [bar(0, 100), bar(1, 110, 20)];
    bars[1] = { ...bars[1]!, open: 100, high: 120, low: 90, close: 110 };
    const resolved = resolveTrade(bars, "LONG", 1, 100, 10, 1.5, 1, 5);
    assert.equal(resolved!.outcome, "stop");
    assert.equal(resolved!.exitPrice, 90);
  });

  it("fills a gap through the stop at the open", () => {
    const bars = [bar(0, 100), bar(1, 82, 5)];
    bars[1] = { ...bars[1]!, open: 80, high: 85, low: 70, close: 82 };
    const resolved = resolveTrade(bars, "LONG", 1, 100, 10, 1.5, 1, 5);
    assert.equal(resolved!.outcome, "stop");
    assert.equal(resolved!.exitPrice, 80);
  });

  it("marks a finished horizon at the close and does not call it a stop", () => {
    const bars = Array.from({ length: 6 }, (_, i) => bar(i, 100 + i * 0.1, 0.2));
    const resolved = resolveTrade(bars, "LONG", 1, bars[1]!.open, 10, 1.5, 1, 3);
    assert.equal(resolved!.outcome, "timeout");
    assert.equal(resolved!.exitIndex, 3);
    assert.equal(resolved!.exitPrice, bars[3]!.close);
    assert.equal(resolved!.barsHeld, 3);
  });

  it("marks the last available close when the tape ends inside the horizon", () => {
    const bars = [bar(0, 100), bar(1, 100.1, 0.2), bar(2, 100.2, 0.2)];
    const resolved = resolveTrade(bars, "SHORT", 1, bars[1]!.open, 10, 1.5, 1, HORIZON);
    assert.equal(resolved!.outcome, "censored");
    assert.equal(resolved!.exitPrice, bars[2]!.close);
  });

  it("charges both sides and turns a scratch fill into a loss", () => {
    const bars = [bar(0, 100), bar(1, 100, 0.1)];
    const resolved = resolveTrade(bars, "LONG", 1, 100, 10, 3, 1, 1)!;
    resolved.outcome = "timeout";
    resolved.exitPrice = 100;
    const priced = priceTrade("LONG", 100, 10, 1, resolved, BINANCE_TAKER_COST);
    assert.ok(priced.netRet < 0);
    assert.ok(priced.netR < 0);
    const free = priceTrade("LONG", 100, 10, 1, resolved, ZERO_COSTS);
    assert.equal(free.netRet, 0);
  });

  it("puts the 1.5 to 1 breakeven at 40 percent before costs and higher after them", () => {
    assert.equal(grossBreakeven(1.5, 1), 0.4);
    assert.ok(Math.abs(costBreakeven(1.5, 1, 100, 1, ZERO_COSTS) - 0.4) < 1e-12);
    const after = costBreakeven(1.5, 1, 100, 1, LAB_COST);
    assert.ok(after > 0.4);
    assert.ok(after < 0.6);
  });
});

describe("sample construction", () => {
  it("grades a later signal of the same type while the first trade is still open", () => {
    const bars = Array.from({ length: 420 }, (_, i) => bar(i, 100 + Math.sin(i / 4) * 6, 0.3));
    const events = collectEvents(bars, 12, 26, 9, bars.map(() => null));
    const byType = [0, 0, 0, 0, 0, 0];
    for (const event of events) byType[event.type] += 1;
    assert.ok(events.length > 6);
    assert.ok(byType.some((count) => count > 1));
    const original = gradeOriginal(bars, 12, 26, 9, 1.5, 1);
    for (let type = 0; type < 6; type++) {
      assert.equal(original[type]!.n + original[type]!.ignored, byType[type]);
      assert.ok(original[type]!.n <= byType[type]!);
    }
  });

  it("does not confirm a divergence before the pivot's right wing has printed", () => {
    const lows = new Array<number>(40).fill(5);
    const highs = new Array<number>(40).fill(8);
    const hist = new Array<number>(40).fill(0);
    lows[10] = 3;
    lows[22] = 2;
    hist[10] = -2;
    hist[22] = -1;
    const flags = divergenceFlags(lows, highs, hist, PIVOT_WING, DIV_ACTIVE);
    assert.equal(flags.bull[10 + PIVOT_WING - 1], false);
    assert.equal(flags.bull[22 + PIVOT_WING], true);
    assert.equal(flags.bull[22 + PIVOT_WING + DIV_ACTIVE], false);
  });

  it("keeps only complete resample buckets and closed weeks", () => {
    const bars = Array.from({ length: 6 }, (_, i) => bar(i, 100 + i, 0.5, 15 * 60_000));
    const hourly = resampleFactor(bars, 4, 60 * 60_000);
    assert.equal(hourly.length, 1);
    assert.equal(hourly[0]!.open, bars[0]!.open);
    assert.equal(hourly[0]!.close, bars[3]!.close);
    assert.equal(weekStart(Date.parse("2024-01-01T00:00:00.000Z")), Date.parse("2024-01-01T00:00:00.000Z"));
    assert.equal(weekStart(Date.parse("1970-01-01T00:00:00.000Z")), Date.parse("1969-12-29T00:00:00.000Z"));
    const days = Array.from({ length: 10 }, (_, i) => bar(i, 100 + i, 1, 86_400_000));
    const weeks = resampleWeeks(days);
    assert.equal(weeks.length, 1);
  });

  it("does not align a higher-timeframe bar before that bar has closed", () => {
    const ltf = [0, 1, 2, 3, 4].map((i) => bar(i, 100, 1, 60_000));
    const htf = [bar(0, 100, 1, 60_000)];
    htf[0] = { ...htf[0]!, t: ltf[0]!.t };
    const aligned = alignClosed(ltf, 60_000, htf, 4 * 60_000, [7]);
    assert.equal(aligned[0], null);
    assert.equal(aligned[2], null);
    assert.equal(aligned[3], 7);
  });
});

describe("multiple testing and the book", () => {
  it("ranks Benjamini-Hochberg from the large end", () => {
    const q = benjaminiHochberg([0.01, 0.04, 0.03, 0.2]);
    assert.ok(Math.abs(q[0]! - 0.04) < 1e-12);
    assert.ok(Math.abs(q[1]! - 0.05333333333333334) < 1e-12);
    assert.ok(Math.abs(q[2]! - 0.05333333333333334) < 1e-12);
    assert.equal(q[3], 0.2);
  });

  it("puts a zero t at one half and a known 10-df critical value near 0.05", () => {
    assert.equal(regularizedBeta(0.5, 1, 1), 0.5);
    assert.ok(Math.abs(studentSurvival(0, 10) - 0.5) < 1e-9);
    assert.ok(Math.abs(studentSurvival(1.8124611226, 10) - 0.05) < 0.001);
    const band = bootstrapMean([1, 2, 3, 4], 7, 200);
    assert.ok(band.low <= band.mean && band.mean <= band.high);
  });

  it("takes every independent signal in the event list and only one position in the book", () => {
    const bars = Array.from({ length: 30 }, (_, i) => bar(i, 100, 0.2));
    const shared = {
      type: 0 as const,
      side: "LONG" as const,
      entry: 100,
      atr: 1,
      priceSide: 1 as const,
      slopeSide: 1 as const,
      vol: 1 as const,
      histSide: 1 as const,
      divergence: 0 as const,
      htf: 1 as const,
      session: 2 as const,
      dow: 1,
      coin: 0,
    };
    const events: BookEvent[] = [
      { ...shared, signalIndex: 1, entryIndex: 2 },
      { ...shared, signalIndex: 3, entryIndex: 4 },
    ];
    const first = resolveTrade(bars, "LONG", 2, 100, 1, 1.5, 1, 20)!;
    assert.equal(first.outcome, "timeout");
    const book = runBracketBook([bars], events, 1.5, 1, ZERO_COSTS, 0, 29);
    assert.equal(book.fills.length, 1);
    assert.equal(book.fills[0]!.entryIndex, 2);
    assert.ok(book.fills[0]!.exitIndex >= 4);
  });

  it("requires every pre-registered gate, and treats a two-sample shift as a ranking score", () => {
    const pass: SurvivalInput = {
      trainN: 100,
      holdN: 100,
      trainMean: 0.1,
      holdMean: 0.1,
      holdBootLow: 0.01,
      plainTrainN: 40,
      plainTrainMean: 0.05,
      plainHoldN: 40,
      plainHoldBootLow: 0.01,
      labHoldMean: 0.02,
      labHoldBootLow: 0.001,
      bhQ: 0.04,
      foldsPositive: 3,
      foldsScored: 4,
    };
    assert.equal(cellSurvives(pass), true);
    assert.equal(cellSurvives({ ...pass, holdBootLow: -0.01 }), false);
    assert.equal(cellSurvives({ ...pass, labHoldBootLow: -0.01 }), false);
    assert.equal(cellSurvives({ ...pass, bhQ: 0.06 }), false);
    assert.equal(cellSurvives({ ...pass, foldsPositive: 2 }), false);
    const flat = welchT([0, 1, 0, 1], [1, 0, 1, 0]);
    assert.ok(flat.pTwo > 0.2);
    const shift = welchT([0, 0.1, 0, 0.1], [2, 2.1, 2, 2.2]);
    assert.ok(shift.pTwo < 0.01);
    assert.equal(
      contrastClaim({
        holdYes: 100,
        holdNo: 100,
        trainYes: 50,
        trainNo: 50,
        trainDiff: 0.1,
        holdDiffLow: 0.02,
        holdDiffHigh: 0.2,
        yesHoldMean: 0.05,
        yesHoldLow: 0.01,
        noHoldMean: -0.02,
        noHoldLow: -0.04,
        bhQ: 0.01,
      }),
      "yes",
    );
  });
});
