# Falcon research ledger

This is the readable copy of `research/lab/ledger.jsonl`. Each cycle appends one row and one section. Rows are not rewritten.

The lab does not change the desk. An accepted config is written to `research/lab/candidate.json` and stays there until Daniel applies it by hand. There is no promotion path into `src/lib/desk`.

Run one more cycle, then exit:

```
npm run lab:cycle
```

Read the result at the bottom of this file, or as the last line of `research/lab/ledger.jsonl`. The same summary is printed by the command. If the verdict is ACCEPT, also read `research/lab/candidate.json`.

## Cycle 1 — INSUFFICIENT — V-Pro band 34 → 40

- At: 2026-11-14T06:48:55.345Z
- Commit: `3549b2f332edb3e5d9f2535640b2b9d61ffa6c80`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro band 34 → 40 (`d9a834ba7f6a43cf8948de31842fa7da078efa0252a6cfe9db5f602b0bceaad6`).

### Why this experiment

- No ledger yet. The champion is the published rule: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off.
- No direction has been rejected twice.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- Nothing that is still eligible improved the holdout, so the next untouched knob is probed one grid step at a time.
- Experiment: V-Pro band 34 → 40. One variable. 28 unused moves were eligible. Hash d9a834ba7f6a.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $4,245.05 | 9 |
| ETH/USD | $5,743.72 | 9 | $6,547.87 | 9 |
| SOL/USD | $6,237.65 | 9 | $6,920.97 | 8 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $7,681.24 | 35.24% | 29.50% | 0.0566 | 0.0646 |
| holdout | $5,522.78 | $6,501.37 | 20.24% | 18.93% | 0.1002 | 0.1096 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$1,254.51 to $24,778.00.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$1,116.76 (9 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger $2,173.82 (9 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$1,008.80 (4 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $5,051.28 (6 trades).

Full-sample trades: BTC/USD 28 → 26, ETH/USD 25 → 24, SOL/USD 24 → 22.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 7 trades, profit $1,378.67, mean trade 5.03%.
- bear: 4 trades, profit $2,031.20, mean trade 12.09%.
- sideways: 15 trades, profit $3,091.49, mean trade 4.90%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 26 (champion 28), ETH/USD 24 (champion 25), SOL/USD 22 (champion 24). Other failed gates: walk-forward.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 26 (champion 28), ETH/USD 24 (champion 25), SOL/USD 22 (champion 24).
- pass `train`: Train profit $5,941.96 → $7,681.24.
- pass `holdout`: Holdout profit $5,522.78 → $6,501.37. Buy and hold on that window was -$562.01.
- fail `walk-forward`: Beat the champion on 2 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 35.24% → 29.50%, holdout 20.24% → 18.93%. No worse means less than or equal to the champion on both windows.
- pass `deflated-sharpe`: Holdout daily Sharpe 0.1096 cleared hurdle 0.0000 with test statistic z=1.900 after 1 trials. This z is not a probability.
- pass `neighbours`: 10 of 13 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 1 trials. Daily Sharpe 0.1096, hurdle 0.0000, z=1.900. The z statistic is not a probability and it is not a confidence.

## Cycle 2 — INSUFFICIENT — V-Pro band 34 → 50

- At: 2026-11-14T06:48:56.343Z
- Commit: `3549b2f332edb3e5d9f2535640b2b9d61ffa6c80`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro band 34 → 50 (`3541dc14db361055fd30455565eba57527cb7693f47621a26d274ba1eb9f97dd`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- No direction has been rejected twice.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- vproBand:up improved holdout profit last time it was tried, so the next step stays on that knob and moves further that way before opening a new knob.
- Experiment: V-Pro band 34 → 50. One variable. 27 unused moves were eligible. Hash 3541dc14db36.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $3,957.39 | 9 |
| ETH/USD | $5,743.72 | 9 | $8,763.17 | 7 |
| SOL/USD | $6,237.65 | 9 | $5,422.26 | 10 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $10,604.07 | 35.24% | 25.76% | 0.0566 | 0.0756 |
| holdout | $5,522.78 | $6,613.73 | 20.24% | 18.19% | 0.1002 | 0.1061 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$1,371.60 to $25,209.73.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$351.55 (8 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger $2,466.72 (8 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$1,136.29 (10 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $4,291.71 (6 trades).

Full-sample trades: BTC/USD 28 → 30, ETH/USD 25 → 20, SOL/USD 24 → 25.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 7 trades, profit $1,637.22, mean trade 5.83%.
- bear: 6 trades, profit $2,378.14, mean trade 9.63%.
- sideways: 13 trades, profit $2,598.37, mean trade 4.69%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 30 (champion 28), ETH/USD 20 (champion 25), SOL/USD 25 (champion 24). Other failed gates: walk-forward.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 30 (champion 28), ETH/USD 20 (champion 25), SOL/USD 25 (champion 24).
- pass `train`: Train profit $5,941.96 → $10,604.07.
- pass `holdout`: Holdout profit $5,522.78 → $6,613.73. Buy and hold on that window was -$562.01.
- fail `walk-forward`: Beat the champion on 2 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 35.24% → 25.76%, holdout 20.24% → 18.19%. No worse means less than or equal to the champion on both windows.
- pass `deflated-sharpe`: Holdout daily Sharpe 0.1061 cleared hurdle 0.0013 with test statistic z=1.785 after 2 trials. This z is not a probability.
- pass `neighbours`: 10 of 12 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 2 trials. Daily Sharpe 0.1061, hurdle 0.0013, z=1.785. The z statistic is not a probability and it is not a confidence.

## Cycle 3 — INSUFFICIENT — V-Pro band 34 → 30

- At: 2026-11-14T06:48:57.302Z
- Commit: `3549b2f332edb3e5d9f2535640b2b9d61ffa6c80`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro band 34 → 30 (`31ade2ac1114b79f178d3cf0b5ee2db104b4fe265c32d02c101afb9af2645889`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- No direction has been rejected twice.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- vproBand:up improved holdout profit, and there is no unused step further that way. The next experiment tries the other side of V-Pro band before opening a new knob.
- Experiment: V-Pro band 34 → 30. One variable. 26 unused moves were eligible. Hash 31ade2ac1114.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $2,069.57 | 12 |
| ETH/USD | $5,743.72 | 9 | $5,077.34 | 9 |
| SOL/USD | $6,237.65 | 9 | $5,763.88 | 10 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $6,903.83 | 35.24% | 32.62% | 0.0566 | 0.0626 |
| holdout | $5,522.78 | $4,791.23 | 20.24% | 23.98% | 0.1002 | 0.0905 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$2,047.36 to $20,430.36.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$782.33 (9 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger $1,411.53 (10 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$696.45 (5 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $3,722.71 (7 trades).

Full-sample trades: BTC/USD 28 → 28, ETH/USD 25 → 26, SOL/USD 24 → 25.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 9 trades, profit -$192.22, mean trade -0.54%.
- bear: 3 trades, profit $1,590.94, mean trade 13.36%.
- sideways: 19 trades, profit $3,392.51, mean trade 4.69%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 28 (champion 28), ETH/USD 26 (champion 25), SOL/USD 25 (champion 24). Other failed gates: holdout, walk-forward, drawdown, deflated-sharpe, neighbours.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 28 (champion 28), ETH/USD 26 (champion 25), SOL/USD 25 (champion 24).
- pass `train`: Train profit $5,941.96 → $6,903.83.
- fail `holdout`: Holdout profit $5,522.78 → $4,791.23. Buy and hold on that window was -$562.01.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 35.24% → 32.62%, holdout 20.24% → 23.98%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0905 did not clear hurdle 0.0087 (z=1.410, trials=3, variance=0.000103). The statistic is not a probability.
- fail `neighbours`: 0 of 13 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 3 trials. Daily Sharpe 0.0905, hurdle 0.0087, z=1.410. The z statistic is not a probability and it is not a confidence.

