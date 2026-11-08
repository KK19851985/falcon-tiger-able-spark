# Paper desk

A paper-only crypto desk for Bitcoin, Ethereum, and Solana. No exchange keys and no live orders.

The book trades V-Pro MACD 34/9 together with the 20/30 EMA. Both must agree. A short closes when price crosses above the 20 EMA. Each coin holds one trade, and that coin is closed before it opens another.

Code lives in `src/lib/desk` (`fund.ts`, `vpro.ts`) and the screen is `src/components/desk-view.tsx`.

Daily bars run from 18 November 2024 through 8 November 2026. Settings are chosen on 6 February 2025 through 24 February 2026 and checked on 25 February 2026 through 8 November 2026. Real capital stays locked.
