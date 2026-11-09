# Paper desk

A paper-only crypto desk for Bitcoin, Ethereum, and Solana. No exchange keys and no live orders.

**Leading strategy: Livermore 3-Step** (MA direction filter + pivotal point break + volume confirmation).

The book also evaluates V-Pro MACD 34/9, EMA crosses, RSI, breakouts, and combinations. Livermore is preferred as the primary rule when it survives the unseen-window tests. Each coin holds one trade, and that coin is closed before it opens another.

Code lives in `src/lib/desk` (`fund.ts`, `livermore.ts`, `vpro.ts`) and the screen is `src/components/desk-view.tsx`.

Daily bars run from 18 November 2024 through 8 November 2026. Settings are chosen on 6 February 2025 through 24 February 2026 and checked on 25 February 2026 through 8 November 2026. Real capital stays locked.
