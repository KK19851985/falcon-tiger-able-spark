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

## Cycle 4 — INSUFFICIENT — signal rule agree → either

- At: 2026-11-14T09:17:50.967Z
- Commit: `f9374e553fe57290f2bfcc881a59022c3dc48b03`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus cached OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: signal rule agree → either (`effaa68902d739ccd06a0f22452f14fa1e6266184ef438232a608e84fa548606`).

### Why this experiment

- Daniel asked to lower the buy and sell requirement so each coin can reach 30 trades.
- Assumption: the baseline already enters when the latched V-Pro stance and the latched EMA 20/30 stance agree. It does not require both crosses on the same bar, so a 'state instead of cross' trial would not change a fill and is not run as its own config.
- Assumption: the volume threshold is already off. The next grid step turns that filter on, which raises the bar, so it is not run.
- Assumption: requiring the two latest crosses to land within 3 bars is tighter than the baseline latch. That window is a later cycle, still against this baseline.
- This cycle changes one variable: the signal rule from agree to either. A side is taken when V-Pro or the EMA has that side and the other is not opposite.
- EMA 20/50 is queued after the signal-rule trials. It is a separate one-variable change.
- Scored against the published baseline, V-Pro 34/9 and EMA 20/30, not against an earlier band trial.
- The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- Fees stay on. Seed stays 20261114. The OKX tape is the pinned one from the first cycles.
- This does not edit the desk.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $2,901.13 | 12 |
| ETH/USD | $5,743.72 | 9 | $5,743.72 | 9 |
| SOL/USD | $6,237.65 | 9 | $6,237.65 | 9 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $5,941.96 | 35.24% | 35.24% | 0.0566 | 0.0566 |
| holdout | $5,522.78 | $5,522.78 | 20.24% | 20.24% | 0.1002 | 0.1002 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$1,500.77 to $21,457.28.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$919.99 (9 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger $1,457.15 (9 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$603.42 (4 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $4,822.71 (6 trades).

Full-sample trades: BTC/USD 28 → 28, ETH/USD 25 → 25, SOL/USD 24 → 24.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 10 trades, profit $932.62, mean trade 2.59%.
- bear: 5 trades, profit $2,198.62, mean trade 11.26%.
- sideways: 15 trades, profit $2,391.54, mean trade 3.80%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 28 (champion 28), ETH/USD 25 (champion 25), SOL/USD 24 (champion 24). Other failed gates: train, holdout, walk-forward, deflated-sharpe, neighbours.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 28 (champion 28), ETH/USD 25 (champion 25), SOL/USD 24 (champion 24).
- fail `train`: Train profit $5,941.96 → $5,941.96.
- fail `holdout`: Holdout profit $5,522.78 → $5,522.78. Buy and hold on that window was -$562.01.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 35.24% → 35.24%, holdout 20.24% → 20.24%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.1002 did not clear hurdle 0.0088 (z=1.582, trials=4, variance=0.000070). The statistic is not a probability.
- fail `neighbours`: 5 of 15 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 4 trials. Daily Sharpe 0.1002, hurdle 0.0088, z=1.582. The z statistic is not a probability and it is not a confidence.

## Cycle 5 — INSUFFICIENT — signal rule agree → window3

- At: 2026-11-14T09:17:51.157Z
- Commit: `f9374e553fe57290f2bfcc881a59022c3dc48b03`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus cached OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: signal rule agree → window3 (`816489249a9b26e721723a1af120c27bafad37b608b89c4be2fa882cdb37b87b`).

### Why this experiment

- One variable: signal rule agree to window3.
- Assumption: this is stricter than the baseline. The baseline stays in while both latched stances agree, no matter how far apart the crosses were. Window3 allows a side only when the latest V-Pro cross and the latest EMA cross point the same way and are at most 3 bars apart.
- It is measured because Daniel asked for N=3, and it is still scored against the published baseline with the skeptic unchanged.
- Scored against the published baseline, V-Pro 34/9 and EMA 20/30, not against an earlier band trial.
- The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- Fees stay on. Seed stays 20261114. The OKX tape is the pinned one from the first cycles.
- This does not edit the desk.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $875.23 | 3 |
| ETH/USD | $5,743.72 | 9 | $0.00 | 0 |
| SOL/USD | $6,237.65 | 9 | -$225.56 | 1 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $4,895.63 | 35.24% | 19.00% | 0.0566 | 0.0647 |
| holdout | $5,522.78 | $219.80 | 20.24% | 2.66% | 0.1002 | 0.0309 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$409.42 to $1,182.55.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$164.45 (1 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger -$178.54 (5 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$103.14 (1 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $5,719.76 (3 trades).

Full-sample trades: BTC/USD 28 → 5, ETH/USD 25 → 4, SOL/USD 24 → 4.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 2 trades, profit $379.18, mean trade 5.77%.
- bear: 0 trades, profit $0.00, mean trade 0.00%.
- sideways: 2 trades, profit -$159.38, mean trade -2.40%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 5 (champion 28), ETH/USD 4 (champion 25), SOL/USD 4 (champion 24). Other failed gates: train, holdout, deflated-sharpe, neighbours.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 5 (champion 28), ETH/USD 4 (champion 25), SOL/USD 4 (champion 24).
- fail `train`: Train profit $5,941.96 → $4,895.63.
- fail `holdout`: Holdout profit $5,522.78 → $219.80. Buy and hold on that window was -$562.01.
- pass `walk-forward`: Beat the champion on 3 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 35.24% → 19.00%, holdout 20.24% → 2.66%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0309 did not clear hurdle 0.0387 (z=-0.134, trials=5, variance=0.001052). The statistic is not a probability.
- fail `neighbours`: 0 of 14 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 5 trials. Daily Sharpe 0.0309, hurdle 0.0387, z=-0.134. The z statistic is not a probability and it is not a confidence.

## Cycle 6 — INSUFFICIENT — EMA slow 30 → 50

- At: 2026-11-14T09:17:51.347Z
- Commit: `f9374e553fe57290f2bfcc881a59022c3dc48b03`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus cached OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: EMA slow 30 → 50 (`c1242aec02ebd36513e2f111423703d9c3aa096e9fc173c331fb95b5f323ca69`).

### Why this experiment

- One variable: EMA slow 30 to 50. EMA fast stays 20. V-Pro stays 34/9. The signal rule stays agree. Volume stays off.
- Queued after the signal-rule trials. Independent of them, and scored against the same published baseline.
- Scored against the published baseline, V-Pro 34/9 and EMA 20/30, not against an earlier band trial.
- The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- Fees stay on. Seed stays 20261114. The OKX tape is the pinned one from the first cycles.
- This does not edit the desk.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $2,297.51 | 10 |
| ETH/USD | $5,743.72 | 9 | $4,320.01 | 9 |
| SOL/USD | $6,237.65 | 9 | $2,876.27 | 10 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $7,088.95 | 35.24% | 32.18% | 0.0566 | 0.0638 |
| holdout | $5,522.78 | $3,601.37 | 20.24% | 19.30% | 0.1002 | 0.0793 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$2,217.44 to $16,056.59.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$735.38 (8 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger $1,763.63 (9 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$469.93 (3 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $5,062.94 (5 trades).

Full-sample trades: BTC/USD 28 → 26, ETH/USD 25 → 22, SOL/USD 24 → 23.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 12 trades, profit $728.55, mean trade 1.78%.
- bear: 7 trades, profit $1,709.26, mean trade 6.91%.
- sideways: 10 trades, profit $1,163.56, mean trade 2.84%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 26 (champion 28), ETH/USD 22 (champion 25), SOL/USD 23 (champion 24). Other failed gates: holdout, deflated-sharpe, neighbours.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 26 (champion 28), ETH/USD 22 (champion 25), SOL/USD 23 (champion 24).
- pass `train`: Train profit $5,941.96 → $7,088.95.
- fail `holdout`: Holdout profit $5,522.78 → $3,601.37. Buy and hold on that window was -$562.01.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 35.24% → 32.18%, holdout 20.24% → 19.30%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0793 did not clear hurdle 0.0380 (z=0.704, trials=6, variance=0.000853). The statistic is not a probability.
- fail `neighbours`: 0 of 14 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 6 trials. Daily Sharpe 0.0793, hurdle 0.0380, z=0.704. The z statistic is not a probability and it is not a confidence.

