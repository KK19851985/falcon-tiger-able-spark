# Paper desk

A paper-only crypto desk for Bitcoin, Ethereum, and Solana. No exchange keys and no live orders.

The book lives in `src/lib/desk/fund.ts`. Each coin holds one trade, filled at the next bar's open, and that coin is closed before it opens another. The published combination is V-Pro 34/9 together with the EMA 20/30 cross. A short is skipped, and an open short is closed, while the close is above the 20 EMA. The screen is `src/components/desk-view.tsx`.

Daily bars run from 18 November 2024. Settings are chosen on 6 February 2025 through 24 February 2026 and checked from 25 February 2026 onward. Real capital stays locked.

## Research lab

`npm run lab:cycle` runs one offline cycle and exits. It proposes a single change to V-Pro, the EMA pair, the short-skip line, or the volume trend, tests it, and appends the verdict to `docs/LAB_LEDGER.md` and `research/lab/ledger.jsonl`. An accepted idea is written to `research/lab/candidate.json` only. Nothing in the cycle edits the desk.
