import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { gapReport } from "./gaps.ts";

describe("15-minute gap report", () => {
  it("counts a duplicate timestamp and a missing quarter-hour", () => {
    const start = Date.parse("2024-01-01T00:00:00.000Z");
    const step = 15 * 60 * 1000;
    const report = gapReport([start, start, start + step, start + 3 * step]);
    assert.equal(report.duplicates, 1);
    assert.equal(report.missing, 1);
    assert.equal(report.bars, 3);
  });
});
