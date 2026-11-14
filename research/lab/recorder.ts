import { appendFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { PATHS } from "./paths.ts";
import { usd, pct, num } from "./format.ts";
import { SYMBOLS, type LedgerRow, type Logger } from "./types.ts";

export type RecorderPaths = {
  ledger: string;
  markdown: string;
  candidate: string;
};

const HEADER = `# Falcon research ledger

This is the readable copy of \`research/lab/ledger.jsonl\`. Each cycle appends one row and one section. Rows are not rewritten.

The lab does not change the desk. An accepted config is written to \`research/lab/candidate.json\` and stays there until Daniel applies it by hand. There is no promotion path into \`src/lib/desk\`.

Run one more cycle, then exit:

\`\`\`
npm run lab:cycle
\`\`\`

Read the result at the bottom of this file, or as the last line of \`research/lab/ledger.jsonl\`. The same summary is printed by the command. If the verdict is ACCEPT, also read \`research/lab/candidate.json\`.

`;

export function readLedger(file = PATHS.ledger): LedgerRow[] {
  if (!existsSync(file)) return [];
  const text = readFileSync(file, "utf8");
  if (!text.trim()) return [];
  return text
    .split("\n")
    .filter((line) => line.trim())
    .map((line, index) => {
      let row: LedgerRow;
      try {
        row = JSON.parse(line) as LedgerRow;
      } catch {
        throw new Error(`ledger line ${index + 1} is not valid JSON`);
      }
      if (!row || typeof row.cycle !== "number" || typeof row.verdict !== "string") {
        throw new Error(`ledger line ${index + 1} is not a cycle row`);
      }
      return row;
    });
}

/** Append one cycle. Existing lines are left byte-for-byte. */
export function appendCycle(row: LedgerRow, paths: RecorderPaths = PATHS, log: Logger = console.log): void {
  mkdirSync(path.dirname(paths.ledger), { recursive: true });
  mkdirSync(path.dirname(paths.markdown), { recursive: true });
  appendFileSync(paths.ledger, `${JSON.stringify(row)}\n`);
  if (!existsSync(paths.markdown)) writeFileSync(paths.markdown, HEADER);
  appendFileSync(paths.markdown, markdownSection(row));
  log(`[recorder] Appended cycle ${row.cycle} (${row.verdict}) to the ledger and the readable copy.`);
  if (row.verdict === "ACCEPT" && row.experiment && row.metrics) {
    const candidate = {
      promoted: false,
      note: "Accepted on the research ledger only. This file does not change the desk. Daniel applies it by hand, or not at all.",
      cycle: row.cycle,
      at: row.at,
      commit: row.commit,
      timeframe: row.timeframe ?? "1d",
      seed: row.seed,
      dataHash: row.data?.hash ?? null,
      label: row.experiment.label,
      config: row.experiment.config,
      hash: row.experiment.hash,
      holdoutProfit: {
        champion: row.metrics.champion.holdout.profit,
        challenger: row.metrics.challenger.holdout.profit,
      },
      fullTrades: row.metrics.challenger.fullTrades,
    };
    writeFileSync(paths.candidate, `${JSON.stringify(candidate, null, 2)}\n`);
    log("[recorder] Wrote research/lab/candidate.json. It is not wired into the app.");
  } else {
    log("[recorder] Did not write a candidate. The skeptic did not accept.");
  }
}

export function markdownSection(row: LedgerRow): string {
  const lines: string[] = [];
  const title = row.experiment?.label ?? "search exhausted";
  const frame = row.timeframe ? ` — ${row.timeframe}` : "";
  lines.push(`## Cycle ${row.cycle}${frame} — ${row.verdict} — ${title}`);
  lines.push("");
  lines.push(`- At: ${row.at}`);
  lines.push(`- Commit: \`${row.commit}\``);
  lines.push(`- Seed: ${row.seed}`);
  if (row.data) {
    lines.push(
      `- Data: ${row.data.source}. ${row.data.bars} bars, ${row.data.start} → ${row.data.end}. Hash \`${row.data.hash}\`.`,
    );
    lines.push(`- Binance probe: ${row.data.binance}.`);
    if (row.data.partialReplaced.length || row.data.appended.length) {
      lines.push(
        `- Extension: replaced ${row.data.partialReplaced.join(", ") || "no partial bar"}; appended ${row.data.appended.join(", ") || "nothing"}.`,
      );
    }
    const scales = SYMBOLS.map((symbol) => {
      const scale = row.data?.volumeScale[symbol];
      return scale == null ? null : `${symbol} ${scale.toFixed(4)}`;
    }).filter(Boolean);
    if (scales.length) lines.push(`- Volume scale (bundle / public): ${scales.join(", ")}.`);
  }
  lines.push(`- Champion: ${row.champion.label} (\`${row.champion.hash}\`).`);
  if (row.experiment) {
    lines.push(`- Experiment: ${row.experiment.label} (\`${row.experiment.hash}\`).`);
    lines.push("");
    lines.push("### Why this experiment");
    lines.push("");
    for (const line of row.experiment.reasoning) lines.push(`- ${line}`);
  }
  if (row.metrics) {
    lines.push("");
    lines.push("### Holdout, each coin on its own $10,000, after costs");
    lines.push("");
    lines.push("| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |");
    lines.push("| --- | ---: | ---: | ---: | ---: |");
    for (const symbol of SYMBOLS) {
      const before = row.metrics.champion.holdout.perCoin[symbol];
      const after = row.metrics.challenger.holdout.perCoin[symbol];
      lines.push(
        `| ${symbol} | ${usd(before.isolatedProfit)} | ${before.trades} | ${usd(after.isolatedProfit)} | ${after.trades} |`,
      );
    }
    lines.push("");
    lines.push("### Combined book");
    lines.push("");
    lines.push("| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |");
    lines.push("| --- | ---: | ---: | ---: | ---: | ---: | ---: |");
    for (const name of ["train", "holdout"] as const) {
      const before = row.metrics.champion[name];
      const after = row.metrics.challenger[name];
      lines.push(
        `| ${name} | ${usd(before.profit)} | ${usd(after.profit)} | ${pct(before.maxDd)} | ${pct(after.maxDd)} | ${num(before.sharpeDaily)} | ${num(after.sharpeDaily)} |`,
      );
    }
    lines.push("");
    lines.push(
      `Buy and hold on the holdout, equal weight, no costs: ${usd(row.metrics.challenger.holdout.buyHold)}.`,
    );
    lines.push("");
    lines.push(
      `Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed ${row.seed}: champion ${usd(row.metrics.champion.holdout.bootstrapLow)} to ${usd(row.metrics.champion.holdout.bootstrapHigh)}; challenger ${usd(row.metrics.challenger.holdout.bootstrapLow)} to ${usd(row.metrics.challenger.holdout.bootstrapHigh)}.`,
    );
    lines.push("");
    lines.push("Walk-forward folds (anchored, scored flat at each fold start):");
    lines.push("");
    for (let i = 0; i < row.metrics.challenger.folds.length; i++) {
      const before = row.metrics.champion.folds[i]!;
      const after = row.metrics.challenger.folds[i]!;
      lines.push(
        `- ${after.from} → ${after.to}: champion ${usd(before.profit)} (${before.trades} trades), challenger ${usd(after.profit)} (${after.trades} trades).`,
      );
    }
    lines.push("");
    lines.push(
      `Full-sample trades: ${SYMBOLS.map((symbol) => `${symbol} ${row.metrics!.champion.fullTrades[symbol]} → ${row.metrics!.challenger.fullTrades[symbol]}`).join(", ")}.`,
    );
    lines.push("");
    lines.push("Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):");
    lines.push("");
    for (const name of ["bull", "bear", "sideways"] as const) {
      const regime = row.metrics.challenger.holdout.regimes[name];
      lines.push(
        `- ${name}: ${regime.trades} trades, profit ${usd(regime.pnl)}, mean trade ${pct(regime.meanRet)}.`,
      );
    }
  }
  lines.push("");
  lines.push("### Verdict");
  lines.push("");
  lines.push(row.reason);
  lines.push("");
  if (row.gates.length) {
    for (const gate of row.gates) lines.push(`- ${gate.pass ? "pass" : "fail"} \`${gate.name}\`: ${gate.detail}`);
    lines.push("");
  }
  if (row.deflated) {
    lines.push(
      `Deflated Sharpe uses ${row.trialsCounted} trials. Daily Sharpe ${num(row.deflated.sharpe)}, hurdle ${num(row.deflated.hurdle)}, z=${num(row.deflated.z, 3)}. The z statistic is not a probability and it is not a confidence.`,
    );
    lines.push("");
  }
  if (row.study) {
    lines.push("### Long-tape checks (not skeptic gates)");
    lines.push("");
    lines.push(row.study.note);
    lines.push("");
    lines.push(row.study.regimeDefinition);
    lines.push("");
    lines.push(row.study.yearlyDefinition);
    lines.push("");
    lines.push(
      `Yearly wins: candidate ${row.study.yearlyWins.candidate} of ${row.study.yearlyWins.countedYears}, volume 2.0× variant ${row.study.yearlyWins.variant} of ${row.study.yearlyWins.countedYears}.`,
    );
    const stress = row.study.feeStress;
    lines.push(
      `Fee stress at ${(stress.fee * 100).toFixed(2)}% taker and ${(stress.slippage * 10000).toFixed(0)} bps slippage: train ${usd(stress.trainProfit)}, holdout ${usd(stress.holdoutProfit)}, holdout max drawdown ${pct(stress.holdoutMaxDd)}.`,
    );
    const luck = row.study.luck;
    lines.push(
      `Shuffled-entry control, ${luck.reps} draws, seed ${luck.seed}: ${luck.matchedBook} reached the book's holdout profit (${(luck.bookFraction * 100).toFixed(1)}%), and ${luck.matchedOrBeat} reached the same open-to-open scoring of the real entries (${(luck.fraction * 100).toFixed(1)}%). Median simulated profit ${usd(luck.median)}.`,
    );
    lines.push("");
    lines.push(luck.definition);
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

export function consoleSummary(row: LedgerRow): string {
  const lines: string[] = [];
  lines.push(`Cycle ${row.cycle}  ${row.timeframe ?? "1d"}  ${row.verdict}`);
  lines.push(row.experiment ? `Experiment: ${row.experiment.label}` : "Experiment: none. The search is exhausted.");
  lines.push(row.reason);
  if (row.metrics) {
    lines.push("");
    lines.push("Holdout, each coin on its own $10,000, after costs");
    for (const symbol of SYMBOLS) {
      const before = row.metrics.champion.holdout.perCoin[symbol];
      const after = row.metrics.challenger.holdout.perCoin[symbol];
      lines.push(
        `  ${symbol}  ${usd(before.isolatedProfit)} (${before.trades} trades) → ${usd(after.isolatedProfit)} (${after.trades} trades)`,
      );
    }
    lines.push(
      `Combined train    ${usd(row.metrics.champion.train.profit)} → ${usd(row.metrics.challenger.train.profit)}`,
    );
    lines.push(
      `Combined holdout  ${usd(row.metrics.champion.holdout.profit)} → ${usd(row.metrics.challenger.holdout.profit)}`,
    );
    lines.push(
      `Holdout max DD    ${pct(row.metrics.champion.holdout.maxDd)} → ${pct(row.metrics.challenger.holdout.maxDd)}`,
    );
    const folds = row.metrics.challenger.folds.length;
    const wins = row.metrics.challenger.folds.filter(
      (fold, index) => fold.profit > row.metrics!.champion.folds[index]!.profit,
    ).length;
    lines.push(`Folds beaten      ${wins}/${folds}`);
    lines.push(
      `Full-sample trades  ${SYMBOLS.map((symbol) => `${symbol} ${row.metrics!.champion.fullTrades[symbol]} → ${row.metrics!.challenger.fullTrades[symbol]}`).join("  ")}`,
    );
  }
  return lines.join("\n");
}
