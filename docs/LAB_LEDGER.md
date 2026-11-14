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

## Cycle 7 — 15m — REJECT — V-Pro band 34 → 40

- At: 2026-11-14T10:18:21.438Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro band 34 → 40 (`d9a834ba7f6a43cf8948de31842fa7da078efa0252a6cfe9db5f602b0bceaad6`).

### Why this experiment

- No ledger yet. The champion is the published rule: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off.
- No direction has been rejected twice.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- Nothing that is still eligible improved the holdout, so the next untouched knob is probed one grid step at a time.
- Experiment: V-Pro band 34 → 40. One variable. 23 unused moves were eligible. Hash d9a834ba7f6a.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,767.38 | 1251 |
| ETH/USD | -$9,749.10 | 1271 | -$9,766.31 | 1262 |
| SOL/USD | -$9,809.91 | 1295 | -$9,824.38 | 1291 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,929.66 | 99.33% | 99.30% | -0.0468 | -0.0456 |
| holdout | -$9,774.66 | -$9,775.32 | 98.00% | 98.00% | -0.0623 | -0.0615 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,887.18 to -$9,568.95.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$5,097.99 (752 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,385.40 (708 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,011.89 (705 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$6,159.61 (780 trades).

Full-sample trades: BTC/USD 3247 → 3230, ETH/USD 3173 → 3174, SOL/USD 3206 → 3203.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1144 trades, profit -$3,014.09, mean trade -0.35%.
- bear: 1052 trades, profit -$3,469.11, mean trade -0.31%.
- sideways: 1608 trades, profit -$3,292.12, mean trade -0.25%.

### Verdict

Rejected. Failed gates: holdout, walk-forward, drawdown, deflated-sharpe, neighbours.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3230 (champion 3247), ETH/USD 3174 (champion 3173), SOL/USD 3203 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,929.66.
- fail `holdout`: Holdout profit -$9,774.66 → -$9,775.32. Buy and hold on that window was -$3,376.06.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 99.33% → 99.30%, holdout 98.00% → 98.00%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0615 did not clear hurdle 0.0000 (z=-9.892, trials=1, variance=0.000000). The statistic is not a probability.
- fail `neighbours`: 5 of 14 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 1 trials. Daily Sharpe -0.0615, hurdle 0.0000, z=-9.892. The z statistic is not a probability and it is not a confidence.

## Cycle 8 — 15m — REJECT — V-Pro signal 9 → 12

- At: 2026-11-14T10:18:26.173Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro signal 9 → 12 (`93b27459bbdc8ec5c6d43a70cea4f6955f1bb678c08c598ca48aaefa8ca41a39`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- No direction has been rejected twice.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- Nothing that is still eligible improved the holdout, so the next untouched knob is probed one grid step at a time.
- Experiment: V-Pro signal 9 → 12. One variable. 22 unused moves were eligible. Hash 93b27459bbdc.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,774.57 | 1230 |
| ETH/USD | -$9,749.10 | 1271 | -$9,693.89 | 1226 |
| SOL/USD | -$9,809.91 | 1295 | -$9,792.70 | 1255 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,904.29 | 99.33% | 99.06% | -0.0468 | -0.0435 |
| holdout | -$9,774.66 | -$9,743.00 | 98.00% | 97.70% | -0.0623 | -0.0603 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,863.94 to -$9,523.53.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$4,862.09 (712 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,183.73 (684 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,183.51 (689 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$5,852.94 (741 trades).

Full-sample trades: BTC/USD 3247 → 3136, ETH/USD 3173 → 3064, SOL/USD 3206 → 3099.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1102 trades, profit -$3,122.63, mean trade -0.35%.
- bear: 1046 trades, profit -$2,866.73, mean trade -0.29%.
- sideways: 1563 trades, profit -$3,753.64, mean trade -0.26%.

### Verdict

Rejected. Failed gates: deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3136 (champion 3247), ETH/USD 3064 (champion 3173), SOL/USD 3099 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,904.29.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,743.00. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 99.06%, holdout 98.00% → 97.70%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0603 did not clear hurdle 0.0005 (z=-9.741, trials=2, variance=0.000001). The statistic is not a probability.
- pass `neighbours`: 9 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 2 trials. Daily Sharpe -0.0603, hurdle 0.0005, z=-9.741. The z statistic is not a probability and it is not a confidence.

## Cycle 9 — 15m — REJECT — V-Pro signal 9 → 15

- At: 2026-11-14T10:18:30.985Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro signal 9 → 15 (`230b62f9e50f3fcecf91d7a70eaabbf0dcf9012780c768db84b25856370899e2`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- No direction has been rejected twice.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- vproSignal:up improved holdout profit last time it was tried, so the next step stays on that knob and moves further that way before opening a new knob.
- Experiment: V-Pro signal 9 → 15. One variable. 21 unused moves were eligible. Hash 230b62f9e50f.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,734.66 | 1200 |
| ETH/USD | -$9,749.10 | 1271 | -$9,688.90 | 1206 |
| SOL/USD | -$9,809.91 | 1295 | -$9,767.47 | 1234 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,884.98 | 99.33% | 98.87% | -0.0468 | -0.0417 |
| holdout | -$9,774.66 | -$9,716.94 | 98.00% | 97.41% | -0.0623 | -0.0584 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,850.99 to -$9,476.71.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$4,733.13 (690 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,081.84 (674 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,027.70 (674 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$5,703.20 (727 trades).

Full-sample trades: BTC/USD 3247 → 3081, ETH/USD 3173 → 3016, SOL/USD 3206 → 3016.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1076 trades, profit -$3,146.36, mean trade -0.34%.
- bear: 1026 trades, profit -$2,736.54, mean trade -0.29%.
- sideways: 1538 trades, profit -$3,834.03, mean trade -0.26%.

### Verdict

Rejected. Failed gates: deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3081 (champion 3247), ETH/USD 3016 (champion 3173), SOL/USD 3016 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,884.98.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,716.94. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 98.87%, holdout 98.00% → 97.41%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0584 did not clear hurdle 0.0013 (z=-9.583, trials=3, variance=0.000003). The statistic is not a probability.
- pass `neighbours`: 12 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 3 trials. Daily Sharpe -0.0584, hurdle 0.0013, z=-9.583. The z statistic is not a probability and it is not a confidence.

## Cycle 10 — 15m — REJECT — EMA fast 20 → 25

- At: 2026-11-14T10:18:35.547Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: EMA fast 20 → 25 (`8f33ee93897eb64c2ef052d71821d53ad17a7f6648c9fddf4376d370adb8f288`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- Retired after two rejections: vproSignal:up.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- Nothing that is still eligible improved the holdout, so the next untouched knob is probed one grid step at a time.
- Experiment: EMA fast 20 → 25. One variable. 19 unused moves were eligible. Hash 8f33ee93897e.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,769.25 | 1232 |
| ETH/USD | -$9,749.10 | 1271 | -$9,677.31 | 1221 |
| SOL/USD | -$9,809.91 | 1295 | -$9,767.79 | 1236 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,925.00 | 99.33% | 99.26% | -0.0468 | -0.0468 |
| holdout | -$9,774.66 | -$9,726.65 | 98.00% | 97.59% | -0.0623 | -0.0603 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,854.99 to -$9,495.27.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$4,772.07 (709 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,470.66 (685 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,493.55 (671 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$5,886.78 (730 trades).

Full-sample trades: BTC/USD 3247 → 3114, ETH/USD 3173 → 3040, SOL/USD 3206 → 3059.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1109 trades, profit -$3,066.17, mean trade -0.34%.
- bear: 1028 trades, profit -$2,772.49, mean trade -0.29%.
- sideways: 1552 trades, profit -$3,887.99, mean trade -0.26%.

### Verdict

Rejected. Failed gates: deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3114 (champion 3247), ETH/USD 3040 (champion 3173), SOL/USD 3059 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,925.00.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,726.65. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 3 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 99.26%, holdout 98.00% → 97.59%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0603 did not clear hurdle 0.0014 (z=-9.904, trials=4, variance=0.000002). The statistic is not a probability.
- pass `neighbours`: 9 of 12 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 4 trials. Daily Sharpe -0.0603, hurdle 0.0014, z=-9.904. The z statistic is not a probability and it is not a confidence.

## Cycle 11 — 15m — REJECT — EMA fast 20 → 15

- At: 2026-11-14T10:18:40.241Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: EMA fast 20 → 15 (`67f085e46e41266e63e0bfa3abb684d5515ea35d76f831ecec494ab117f45588`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- Retired after two rejections: vproSignal:up.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- emaFast:up improved holdout profit, and there is no unused step further that way. The next experiment tries the other side of EMA fast before opening a new knob.
- Experiment: EMA fast 20 → 15. One variable. 18 unused moves were eligible. Hash 67f085e46e41.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,837.56 | 1345 |
| ETH/USD | -$9,749.10 | 1271 | -$9,782.55 | 1338 |
| SOL/USD | -$9,809.91 | 1295 | -$9,857.38 | 1372 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,944.46 | 99.33% | 99.45% | -0.0468 | -0.0478 |
| holdout | -$9,774.66 | -$9,818.18 | 98.00% | 98.39% | -0.0623 | -0.0644 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,909.39 to -$9,652.93.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$5,217.73 (783 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,561.60 (744 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,561.53 (739 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$6,195.62 (814 trades).

Full-sample trades: BTC/USD 3247 → 3404, ETH/USD 3173 → 3338, SOL/USD 3206 → 3374.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1219 trades, profit -$2,647.29, mean trade -0.33%.
- bear: 1134 trades, profit -$3,277.06, mean trade -0.31%.
- sideways: 1702 trades, profit -$3,893.84, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3404 (champion 3247), ETH/USD 3338 (champion 3173), SOL/USD 3374 (champion 3206)).
- fail `train`: Train profit -$9,932.08 → -$9,944.46.
- fail `holdout`: Holdout profit -$9,774.66 → -$9,818.18. Buy and hold on that window was -$3,376.06.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 99.33% → 99.45%, holdout 98.00% → 98.39%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0644 did not clear hurdle 0.0027 (z=-10.748, trials=5, variance=0.000005). The statistic is not a probability.
- fail `neighbours`: 2 of 14 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 5 trials. Daily Sharpe -0.0644, hurdle 0.0027, z=-10.748. The z statistic is not a probability and it is not a confidence.

## Cycle 12 — 15m — REJECT — EMA fast 20 → 12

- At: 2026-11-14T10:18:44.872Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: EMA fast 20 → 12 (`2167761186b47d77b6c40424139313fa3d371edf23473866930435d7099a0fe6`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- Retired after two rejections: vproSignal:up.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- emaFast:up improved holdout profit, and there is no unused step further that way. The next experiment tries the other side of EMA fast before opening a new knob.
- Experiment: EMA fast 20 → 12. One variable. 17 unused moves were eligible. Hash 2167761186b4.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,863.73 | 1407 |
| ETH/USD | -$9,749.10 | 1271 | -$9,813.88 | 1387 |
| SOL/USD | -$9,809.91 | 1295 | -$9,890.64 | 1429 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,958.71 | 99.33% | 99.59% | -0.0468 | -0.0498 |
| holdout | -$9,774.66 | -$9,850.60 | 98.00% | 98.67% | -0.0623 | -0.0663 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,926.68 to -$9,712.64.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$5,532.84 (814 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,777.79 (775 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,583.18 (764 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$6,166.64 (839 trades).

Full-sample trades: BTC/USD 3247 → 3527, ETH/USD 3173 → 3473, SOL/USD 3206 → 3518.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1260 trades, profit -$2,596.20, mean trade -0.33%.
- bear: 1174 trades, profit -$3,305.57, mean trade -0.31%.
- sideways: 1789 trades, profit -$3,948.83, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3527 (champion 3247), ETH/USD 3473 (champion 3173), SOL/USD 3518 (champion 3206)).
- fail `train`: Train profit -$9,932.08 → -$9,958.71.
- fail `holdout`: Holdout profit -$9,774.66 → -$9,850.60. Buy and hold on that window was -$3,376.06.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 99.33% → 99.59%, holdout 98.00% → 98.67%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0663 did not clear hurdle 0.0038 (z=-11.241, trials=6, variance=0.000009). The statistic is not a probability.
- fail `neighbours`: 0 of 14 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 6 trials. Daily Sharpe -0.0663, hurdle 0.0038, z=-11.241. The z statistic is not a probability and it is not a confidence.

## Cycle 13 — 15m — REJECT — EMA slow 30 → 40

- At: 2026-11-14T10:18:49.446Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: EMA slow 30 → 40 (`4c292e3dc0c71bb33642a151e39af446bc11674b2a7bb104daf8051377c7dbe8`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- Retired after two rejections: vproSignal:up, emaFast:down.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- Nothing that is still eligible improved the holdout, so the next untouched knob is probed one grid step at a time.
- Experiment: EMA slow 30 → 40. One variable. 15 unused moves were eligible. Hash 4c292e3dc0c7.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,738.41 | 1193 |
| ETH/USD | -$9,749.10 | 1271 | -$9,652.82 | 1205 |
| SOL/USD | -$9,809.91 | 1295 | -$9,785.64 | 1226 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,921.03 | 99.33% | 99.22% | -0.0468 | -0.0467 |
| holdout | -$9,774.66 | -$9,715.84 | 98.00% | 97.50% | -0.0623 | -0.0601 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,845.44 to -$9,486.45.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$4,696.47 (697 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,391.47 (672 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,311.07 (659 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$5,902.96 (722 trades).

Full-sample trades: BTC/USD 3247 → 3038, ETH/USD 3173 → 2995, SOL/USD 3206 → 3026.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1086 trades, profit -$3,001.11, mean trade -0.34%.
- bear: 1012 trades, profit -$2,890.00, mean trade -0.28%.
- sideways: 1526 trades, profit -$3,824.74, mean trade -0.27%.

### Verdict

Rejected. Failed gates: deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3038 (champion 3247), ETH/USD 2995 (champion 3173), SOL/USD 3026 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,921.03.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,715.84. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 3 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 99.22%, holdout 98.00% → 97.50%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0601 did not clear hurdle 0.0039 (z=-10.259, trials=7, variance=0.000008). The statistic is not a probability.
- pass `neighbours`: 11 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 7 trials. Daily Sharpe -0.0601, hurdle 0.0039, z=-10.259. The z statistic is not a probability and it is not a confidence.

## Cycle 14 — 15m — REJECT — EMA slow 30 → 50

- At: 2026-11-14T10:18:54.417Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: EMA slow 30 → 50 (`c1242aec02ebd36513e2f111423703d9c3aa096e9fc173c331fb95b5f323ca69`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- Retired after two rejections: vproSignal:up, emaFast:down.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- emaSlow:up improved holdout profit last time it was tried, so the next step stays on that knob and moves further that way before opening a new knob.
- Experiment: EMA slow 30 → 50. One variable. 14 unused moves were eligible. Hash c1242aec02eb.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,671.58 | 1146 |
| ETH/USD | -$9,749.10 | 1271 | -$9,554.02 | 1147 |
| SOL/USD | -$9,809.91 | 1295 | -$9,773.57 | 1179 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,894.97 | 99.33% | 98.97% | -0.0468 | -0.0450 |
| holdout | -$9,774.66 | -$9,661.45 | 98.00% | 97.01% | -0.0623 | -0.0583 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,813.91 to -$9,378.93.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$4,344.81 (661 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,344.19 (650 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,154.68 (633 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$5,717.10 (684 trades).

Full-sample trades: BTC/USD 3247 → 2889, ETH/USD 3173 → 2850, SOL/USD 3206 → 2906.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1034 trades, profit -$3,041.40, mean trade -0.33%.
- bear: 961 trades, profit -$2,532.28, mean trade -0.27%.
- sideways: 1477 trades, profit -$4,087.76, mean trade -0.28%.

### Verdict

Rejected. Failed gates: deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 2889 (champion 3247), ETH/USD 2850 (champion 3173), SOL/USD 2906 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,894.97.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,661.45. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 98.97%, holdout 98.00% → 97.01%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0583 did not clear hurdle 0.0041 (z=-10.007, trials=8, variance=0.000008). The statistic is not a probability.
- pass `neighbours`: 13 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 8 trials. Daily Sharpe -0.0583, hurdle 0.0041, z=-10.007. The z statistic is not a probability and it is not a confidence.

## Cycle 15 — 15m — REJECT — volume threshold off → 0.8

- At: 2026-11-14T10:19:22.071Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: volume threshold off → 0.8 (`83709c1b4a8b31f0a54133bb3a4a1437cd6fa1c205e29fceb6480cca1824bdae`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- Retired after two rejections: vproSignal:up, emaFast:down, emaSlow:up.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- Nothing that is still eligible improved the holdout, so the next untouched knob is probed one grid step at a time.
- Experiment: volume threshold off → 0.8. One variable. 12 unused moves were eligible. Hash 83709c1b4a8b.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,994.09 | 2430 |
| ETH/USD | -$9,749.10 | 1271 | -$9,992.10 | 2382 |
| SOL/USD | -$9,809.91 | 1295 | -$9,994.98 | 2561 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,999.88 | 99.33% | 100.00% | -0.0468 | -0.1471 |
| holdout | -$9,774.66 | -$9,993.59 | 98.00% | 99.94% | -0.0623 | -0.1588 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,996.09 to -$9,989.50.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$7,683.75 (1471 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$7,267.65 (1392 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$7,563.95 (1402 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$7,806.55 (1414 trades).

Full-sample trades: BTC/USD 3247 → 6302, ETH/USD 3173 → 6220, SOL/USD 3206 → 6527.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 2177 trades, profit -$1,811.90, mean trade -0.31%.
- bear: 2135 trades, profit -$5,329.09, mean trade -0.30%.
- sideways: 3061 trades, profit -$2,852.60, mean trade -0.29%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 6302 (champion 3247), ETH/USD 6220 (champion 3173), SOL/USD 6527 (champion 3206)).
- fail `train`: Train profit -$9,932.08 → -$9,999.88.
- fail `holdout`: Holdout profit -$9,774.66 → -$9,993.59. Buy and hold on that window was -$3,376.06.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 99.33% → 100.00%, holdout 98.00% → 99.94%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1588 did not clear hurdle 0.0496 (z=-27.908, trials=9, variance=0.001065). The statistic is not a probability.
- fail `neighbours`: 0 of 15 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 9 trials. Daily Sharpe -0.1588, hurdle 0.0496, z=-27.908. The z statistic is not a probability and it is not a confidence.

## Cycle 16 — 15m — REJECT — V-Pro band 34 → 30

- At: 2026-11-14T10:19:26.988Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro band 34 → 30 (`31ade2ac1114b79f178d3cf0b5ee2db104b4fe265c32d02c101afb9af2645889`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- Retired after two rejections: vproSignal:up, emaFast:down, emaSlow:up.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- Eligible held-up steps are exhausted. The next unused one-knob step is the closest remaining grid neighbour.
- Experiment: V-Pro band 34 → 30. One variable. 11 unused moves were eligible. Hash 31ade2ac1114.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,810.33 | 1300 |
| ETH/USD | -$9,749.10 | 1271 | -$9,702.60 | 1274 |
| SOL/USD | -$9,809.91 | 1295 | -$9,793.97 | 1302 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,924.39 | 99.33% | 99.26% | -0.0468 | -0.0463 |
| holdout | -$9,774.66 | -$9,760.19 | 98.00% | 97.84% | -0.0623 | -0.0624 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,878.36 to -$9,535.97.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$5,235.92 (755 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,442.18 (720 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,082.00 (713 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$5,896.94 (766 trades).

Full-sample trades: BTC/USD 3247 → 3288, ETH/USD 3173 → 3187, SOL/USD 3206 → 3213.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1156 trades, profit -$2,935.59, mean trade -0.32%.
- bear: 1094 trades, profit -$2,976.96, mean trade -0.29%.
- sideways: 1626 trades, profit -$3,847.64, mean trade -0.25%.

### Verdict

Rejected. Failed gates: walk-forward, deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3288 (champion 3247), ETH/USD 3187 (champion 3173), SOL/USD 3213 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,924.39.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,760.19. Buy and hold on that window was -$3,376.06.
- fail `walk-forward`: Beat the champion on 2 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 99.26%, holdout 98.00% → 97.84%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0624 did not clear hurdle 0.0487 (z=-17.727, trials=10, variance=0.000956). The statistic is not a probability.
- pass `neighbours`: 8 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 10 trials. Daily Sharpe -0.0624, hurdle 0.0487, z=-17.727. The z statistic is not a probability and it is not a confidence.

## Cycle 17 — 15m — REJECT — V-Pro band 34 → 26

- At: 2026-11-14T10:19:31.604Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro band 34 → 26 (`ab8f4df42be80866a2aad9b3b864153fb7a38aa78bcb383394d04d6a0db1cf29`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- Retired after two rejections: vproSignal:up, emaFast:down, emaSlow:up.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- vproBand:down improved holdout profit last time it was tried, so the next step stays on that knob and moves further that way before opening a new knob.
- Experiment: V-Pro band 34 → 26. One variable. 10 unused moves were eligible. Hash ab8f4df42be8.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,834.98 | 1328 |
| ETH/USD | -$9,749.10 | 1271 | -$9,712.39 | 1296 |
| SOL/USD | -$9,809.91 | 1295 | -$9,789.73 | 1320 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,932.55 | 99.33% | 99.34% | -0.0468 | -0.0486 |
| holdout | -$9,774.66 | -$9,772.96 | 98.00% | 97.92% | -0.0623 | -0.0643 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,882.42 to -$9,572.88.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$5,326.76 (768 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,282.38 (725 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$3,762.37 (714 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$5,869.77 (760 trades).

Full-sample trades: BTC/USD 3247 → 3334, ETH/USD 3173 → 3253, SOL/USD 3206 → 3228.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1180 trades, profit -$2,785.65, mean trade -0.31%.
- bear: 1133 trades, profit -$3,335.04, mean trade -0.30%.
- sideways: 1631 trades, profit -$3,652.27, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, drawdown, deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3334 (champion 3247), ETH/USD 3253 (champion 3173), SOL/USD 3228 (champion 3206)).
- fail `train`: Train profit -$9,932.08 → -$9,932.55.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,772.96. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 3 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 99.33% → 99.34%, holdout 98.00% → 97.92%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0643 did not clear hurdle 0.0477 (z=-17.866, trials=11, variance=0.000865). The statistic is not a probability.
- pass `neighbours`: 8 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 11 trials. Daily Sharpe -0.0643, hurdle 0.0477, z=-17.866. The z statistic is not a probability and it is not a confidence.

## Cycle 18 — 15m — REJECT — V-Pro signal 9 → 7

- At: 2026-11-14T10:19:36.275Z
- Commit: `c8ddd38281c0ff1ca8b5909b4f647be71347808e`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro signal 9 → 7 (`3a1942280996f0b1297246f3c007d093efd0744fd12a5ed79312a2c7cb64fd4e`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- Retired after two rejections: vproSignal:up, emaFast:down, emaSlow:up, vproBand:down.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- Eligible held-up steps are exhausted. The next unused one-knob step is the closest remaining grid neighbour.
- Experiment: V-Pro signal 9 → 7. One variable. 8 unused moves were eligible. Hash 3a1942280996.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,837.16 | 1342 |
| ETH/USD | -$9,749.10 | 1271 | -$9,775.54 | 1329 |
| SOL/USD | -$9,809.91 | 1295 | -$9,810.07 | 1339 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,943.59 | 99.33% | 99.44% | -0.0468 | -0.0487 |
| holdout | -$9,774.66 | -$9,797.85 | 98.00% | 98.19% | -0.0623 | -0.0644 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,897.02 to -$9,600.27.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$5,377.85 (789 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,475.59 (739 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,327.90 (734 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$6,062.49 (787 trades).

Full-sample trades: BTC/USD 3247 → 3387, ETH/USD 3173 → 3293, SOL/USD 3206 → 3328.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1207 trades, profit -$2,890.65, mean trade -0.33%.
- bear: 1109 trades, profit -$3,168.32, mean trade -0.29%.
- sideways: 1694 trades, profit -$3,738.88, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 3387 (champion 3247), ETH/USD 3293 (champion 3173), SOL/USD 3328 (champion 3206)).
- fail `train`: Train profit -$9,932.08 → -$9,943.59.
- fail `holdout`: Holdout profit -$9,774.66 → -$9,797.85. Buy and hold on that window was -$3,376.06.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 99.33% → 99.44%, holdout 98.00% → 98.19%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0644 did not clear hurdle 0.0468 (z=-17.740, trials=12, variance=0.000789). The statistic is not a probability.
- fail `neighbours`: 3 of 14 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 12 trials. Daily Sharpe -0.0644, hurdle 0.0468, z=-17.740. The z statistic is not a probability and it is not a confidence.

## Cycle 19 — 15m — REJECT — direction timeframe 15m → 1h

- At: 2026-11-14T10:25:10.720Z
- Commit: `8172617c8a859db9e801ec45feab88b33b39b8fc`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: direction timeframe 15m → 1h (`de818e1ac23dbe8fa20384cf33ac88a441d3a94a1de64157d7055e303e8b0d4c`).

### Why this experiment

- One variable: direction timeframe 15m to 1h. Trades still fill on the 15-minute chart.
- Direction is the higher-timeframe EMA 20/30: long only while the fast average is above the slow average, short only while it is below. The higher bar is used only after it has closed.
- The entry trigger stays the 15-minute V-Pro 34/9. The volume filter stays off. The 15-minute short-skip stays on. Fees and the seed stay the same.
- Scored against the 15-minute baseline, not against another higher timeframe.
- Scored against the published baseline, V-Pro 34/9 and EMA 20/30, not against an earlier band trial.
- The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- Fees stay on: 0.1% taker and 5 bps slippage on the entry and the exit. Seed stays 20261114.
- This does not edit the desk.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,361.67 | 920 |
| ETH/USD | -$9,749.10 | 1271 | -$9,360.35 | 940 |
| SOL/USD | -$9,809.91 | 1295 | -$9,635.03 | 950 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,783.66 | 99.33% | 97.86% | -0.0468 | -0.0448 |
| holdout | -$9,774.66 | -$9,447.51 | 98.00% | 95.17% | -0.0623 | -0.0567 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,669.56 to -$9,038.47.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$4,008.95 (520 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$3,333.27 (512 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$3,934.20 (518 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$4,826.78 (527 trades).

Full-sample trades: BTC/USD 3247 → 2268, ETH/USD 3173 → 2287, SOL/USD 3206 → 2318.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 803 trades, profit -$2,474.99, mean trade -0.35%.
- bear: 819 trades, profit -$3,112.20, mean trade -0.28%.
- sideways: 1188 trades, profit -$3,860.32, mean trade -0.30%.

### Verdict

Rejected. Failed gates: deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 2268 (champion 3247), ETH/USD 2287 (champion 3173), SOL/USD 2318 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,783.66.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,447.51. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 97.86%, holdout 98.00% → 95.17%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0567 did not clear hurdle 0.0462 (z=-16.435, trials=13, variance=0.000737). The statistic is not a probability.
- pass `neighbours`: 13 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 13 trials. Daily Sharpe -0.0567, hurdle 0.0462, z=-16.435. The z statistic is not a probability and it is not a confidence.

## Cycle 20 — 15m — REJECT — direction timeframe 15m → 4h

- At: 2026-11-14T10:25:15.387Z
- Commit: `8172617c8a859db9e801ec45feab88b33b39b8fc`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: direction timeframe 15m → 4h (`2aee16279bf72c32965c463ee3d48de8d8ab3f20368b194e6f99071fa126dbdb`).

### Why this experiment

- One variable: direction timeframe 15m to 4h. Trades still fill on the 15-minute chart.
- Direction is the higher-timeframe EMA 20/30: long only while the fast average is above the slow average, short only while it is below. The higher bar is used only after it has closed.
- The entry trigger stays the 15-minute V-Pro 34/9. The volume filter stays off. The 15-minute short-skip stays on. Fees and the seed stay the same.
- Scored against the 15-minute baseline, not against another higher timeframe.
- Scored against the published baseline, V-Pro 34/9 and EMA 20/30, not against an earlier band trial.
- The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- Fees stay on: 0.1% taker and 5 bps slippage on the entry and the exit. Seed stays 20261114.
- This does not edit the desk.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,538.51 | 990 |
| ETH/USD | -$9,749.10 | 1271 | -$9,408.93 | 986 |
| SOL/USD | -$9,809.91 | 1295 | -$9,706.94 | 1046 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,816.67 | 99.33% | 98.19% | -0.0468 | -0.0477 |
| holdout | -$9,774.66 | -$9,550.84 | 98.00% | 96.03% | -0.0623 | -0.0598 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,735.62 to -$9,211.05.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$3,432.53 (503 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$3,765.65 (535 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,461.54 (618 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$4,694.99 (555 trades).

Full-sample trades: BTC/USD 3247 → 2426, ETH/USD 3173 → 2418, SOL/USD 3206 → 2492.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 725 trades, profit -$1,921.22, mean trade -0.34%.
- bear: 968 trades, profit -$4,261.46, mean trade -0.32%.
- sideways: 1329 trades, profit -$3,368.16, mean trade -0.28%.

### Verdict

Rejected. Failed gates: deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 2426 (champion 3247), ETH/USD 2418 (champion 3173), SOL/USD 2492 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,816.67.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,550.84. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 98.19%, holdout 98.00% → 96.03%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0598 did not clear hurdle 0.0455 (z=-16.832, trials=14, variance=0.000686). The statistic is not a probability.
- pass `neighbours`: 13 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 14 trials. Daily Sharpe -0.0598, hurdle 0.0455, z=-16.832. The z statistic is not a probability and it is not a confidence.

## Cycle 21 — 15m — REJECT — direction timeframe 15m → 1d

- At: 2026-11-14T10:25:20.186Z
- Commit: `8172617c8a859db9e801ec45feab88b33b39b8fc`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: direction timeframe 15m → 1d (`f48c6ca58912462d8386ee4d184cd847e3eb87ee06fdb1e189238990e5a2f9c3`).

### Why this experiment

- One variable: direction timeframe 15m to 1d. Trades still fill on the 15-minute chart.
- Direction is the higher-timeframe EMA 20/30: long only while the fast average is above the slow average, short only while it is below. The higher bar is used only after it has closed.
- The entry trigger stays the 15-minute V-Pro 34/9. The volume filter stays off. The 15-minute short-skip stays on. Fees and the seed stay the same.
- Scored against the 15-minute baseline, not against another higher timeframe.
- Scored against the published baseline, V-Pro 34/9 and EMA 20/30, not against an earlier band trial.
- The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- Fees stay on: 0.1% taker and 5 bps slippage on the entry and the exit. Seed stays 20261114.
- This does not edit the desk.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$9,542.92 | 1023 |
| ETH/USD | -$9,749.10 | 1271 | -$9,269.35 | 1009 |
| SOL/USD | -$9,809.91 | 1295 | -$9,652.65 | 1075 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$9,809.37 | 99.33% | 98.13% | -0.0468 | -0.0486 |
| holdout | -$9,774.66 | -$9,491.04 | 98.00% | 95.56% | -0.0623 | -0.0571 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$9,722.25 to -$9,029.03.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$3,453.11 (479 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$4,440.26 (487 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$4,417.04 (682 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$5,035.73 (645 trades).

Full-sample trades: BTC/USD 3247 → 2488, ETH/USD 3173 → 2517, SOL/USD 3206 → 2534.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 766 trades, profit -$1,906.79, mean trade -0.30%.
- bear: 1015 trades, profit -$3,709.80, mean trade -0.28%.
- sideways: 1326 trades, profit -$3,874.44, mean trade -0.28%.

### Verdict

Rejected. Failed gates: deflated-sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 2488 (champion 3247), ETH/USD 2517 (champion 3173), SOL/USD 2534 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$9,809.37.
- pass `holdout`: Holdout profit -$9,774.66 → -$9,491.04. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 3 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 98.13%, holdout 98.00% → 95.56%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0571 did not clear hurdle 0.0450 (z=-16.315, trials=15, variance=0.000646). The statistic is not a probability.
- pass `neighbours`: 13 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 15 trials. Daily Sharpe -0.0571, hurdle 0.0450, z=-16.315. The z statistic is not a probability and it is not a confidence.

## Cycle 22 — 1d — INSUFFICIENT — Livermore 3-step, 1d EMA direction

- At: 2026-11-14T10:42:32.949Z
- Commit: `a7b39dfa9f90cd3b40e0aab229233b5c4df7b648`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus cached OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: Livermore 3-step, 1d EMA direction (`ec53e792027e1de47cfe58f4d6bd977f8efe0685bd49463fc502973c6a927797`).

### Why this experiment

- Livermore order: direction, then the pivotal level, then volume.
- EMA 50 on the traded timeframe. Long only above a rising average, short only below a falling average.
- Pivot is the prior 20 bars, excluding the current bar. Breakout volume must be at least 1.5× the prior 20-bar average.
- The breakout bar does not enter. The next 1 close(s) must still be beyond the level. Fill is the following open.
- Stop is the broken pivotal level. The trade also exits when the close comes back through the EMA.
- One position per coin. Compared with V-Pro 34/9 plus EMA 20/30 on this same tape. The skeptic is unchanged.
- A higher bar is used only after it has closed.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $375.69 | 4 |
| ETH/USD | $5,743.72 | 9 | -$192.00 | 5 |
| SOL/USD | $6,237.65 | 9 | $2,333.54 | 6 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $2,637.08 | 35.24% | 14.17% | 0.0566 | 0.0417 |
| holdout | $5,522.78 | $912.80 | 20.24% | 12.91% | 0.1002 | 0.0299 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$2,724.35 to $7,358.59.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$277.25 (3 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger $508.25 (4 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$94.79 (1 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $3,030.22 (6 trades).

Full-sample trades: BTC/USD 28 → 12, ETH/USD 25 → 12, SOL/USD 24 → 13.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 7 trades, profit $760.61, mean trade 3.49%.
- bear: 7 trades, profit $289.03, mean trade 1.16%.
- sideways: 1 trades, profit -$136.84, mean trade -4.41%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 12 (champion 28), ETH/USD 12 (champion 25), SOL/USD 13 (champion 24). Other failed gates: train, holdout, walk-forward, deflated-sharpe, neighbours. Holdout buy-and-hold was -$562.01.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 12 (champion 28), ETH/USD 12 (champion 25), SOL/USD 13 (champion 24).
- fail `train`: Train profit $5,941.96 → $2,637.08.
- fail `holdout`: Holdout profit $5,522.78 → $912.80. Buy and hold on that window was -$562.01.
- fail `walk-forward`: Beat the champion on 2 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 35.24% → 14.17%, holdout 20.24% → 12.91%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0299 did not clear hurdle 0.0473 (z=-0.286, trials=7, variance=0.001161). The statistic is not a probability.
- fail `neighbours`: 0 of 7 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 7 trials. Daily Sharpe 0.0299, hurdle 0.0473, z=-0.286. The z statistic is not a probability and it is not a confidence.

## Cycle 23 — 15m — REJECT — Livermore 3-step, 15m EMA direction

- At: 2026-11-14T10:42:37.474Z
- Commit: `a7b39dfa9f90cd3b40e0aab229233b5c4df7b648`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: Livermore 3-step, 15m EMA direction (`ec53e792027e1de47cfe58f4d6bd977f8efe0685bd49463fc502973c6a927797`).

### Why this experiment

- Livermore order: direction, then the pivotal level, then volume.
- EMA 50 on the traded timeframe. Long only above a rising average, short only below a falling average.
- Pivot is the prior 20 bars, excluding the current bar. Breakout volume must be at least 1.5× the prior 20-bar average.
- The breakout bar does not enter. The next 1 close(s) must still be beyond the level. Fill is the following open.
- Stop is the broken pivotal level. The trade also exits when the close comes back through the EMA.
- One position per coin. Compared with V-Pro 34/9 plus EMA 20/30 on this same tape. The skeptic is unchanged.
- A higher bar is used only after it has closed.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$8,091.22 | 553 |
| ETH/USD | -$9,749.10 | 1271 | -$7,018.59 | 530 |
| SOL/USD | -$9,809.91 | 1295 | -$7,744.27 | 526 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$8,565.92 | 99.33% | 85.67% | -0.0468 | -0.0251 |
| holdout | -$9,774.66 | -$7,577.39 | 98.00% | 78.78% | -0.0623 | -0.0338 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$8,464.92 to -$6,086.89.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$2,320.01 (293 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$1,351.78 (284 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$1,520.01 (302 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$3,317.33 (306 trades).

Full-sample trades: BTC/USD 3247 → 1350, ETH/USD 3173 → 1297, SOL/USD 3206 → 1339.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 475 trades, profit -$2,259.09, mean trade -0.32%.
- bear: 449 trades, profit -$3,050.83, mean trade -0.35%.
- sideways: 685 trades, profit -$2,267.48, mean trade -0.17%.

### Verdict

Rejected. Failed gates: deflated-sharpe. Holdout buy-and-hold was -$3,376.06.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1350 (champion 3247), ETH/USD 1297 (champion 3173), SOL/USD 1339 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$8,565.92.
- pass `holdout`: Holdout profit -$9,774.66 → -$7,577.39. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 85.67%, holdout 98.00% → 78.78%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0338 did not clear hurdle 0.0467 (z=-13.019, trials=16, variance=0.000674). The statistic is not a probability.
- pass `neighbours`: 7 of 7 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 16 trials. Daily Sharpe -0.0338, hurdle 0.0467, z=-13.019. The z statistic is not a probability and it is not a confidence.

## Cycle 24 — 15m — REJECT — Livermore 3-step, 4h EMA direction

- At: 2026-11-14T10:42:41.880Z
- Commit: `a7b39dfa9f90cd3b40e0aab229233b5c4df7b648`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: Livermore 3-step, 4h EMA direction (`0de1f24e37ba5dd3488a108c25c2fe3d9e85d60a2b8d9da8f5057e22aad592e8`).

### Why this experiment

- Livermore order: direction, then the pivotal level, then volume.
- EMA 50 on closed 4-hour bars. Long only above a rising average, short only below a falling average.
- Pivot is the prior 20 bars, excluding the current bar. Breakout volume must be at least 1.5× the prior 20-bar average.
- The breakout bar does not enter. The next 1 close(s) must still be beyond the level. Fill is the following open.
- Stop is the broken pivotal level. The trade also exits when the close comes back through the EMA.
- One position per coin. Compared with V-Pro 34/9 plus EMA 20/30 on this same tape. The skeptic is unchanged.
- A higher bar is used only after it has closed.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$1,365.10 | 79 |
| ETH/USD | -$9,749.10 | 1271 | $2,500.29 | 74 |
| SOL/USD | -$9,809.91 | 1295 | $1,891.82 | 92 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$3,653.13 | 99.33% | 45.87% | -0.0468 | -0.0086 |
| holdout | -$9,774.66 | $1,424.46 | 98.00% | 38.60% | -0.0623 | 0.0037 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$3,824.78 to $14,251.34.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$716.71 (41 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$363.31 (59 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$887.49 (49 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$523.02 (46 trades).

Full-sample trades: BTC/USD 3247 → 195, ETH/USD 3173 → 199, SOL/USD 3206 → 225.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 61 trades, profit -$1,064.86, mean trade -0.48%.
- bear: 49 trades, profit -$1,497.48, mean trade -0.82%.
- sideways: 135 trades, profit $3,986.80, mean trade 0.88%.

### Verdict

Rejected. Failed gates: deflated-sharpe. Holdout buy-and-hold was -$3,376.06.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 195 (champion 3247), ETH/USD 199 (champion 3173), SOL/USD 225 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$3,653.13.
- pass `holdout`: Holdout profit -$9,774.66 → $1,424.46. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 45.87%, holdout 98.00% → 38.60%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0037 did not clear hurdle 0.0552 (z=-8.618, trials=17, variance=0.000913). The statistic is not a probability.
- pass `neighbours`: 7 of 7 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 17 trials. Daily Sharpe 0.0037, hurdle 0.0552, z=-8.618. The z statistic is not a probability and it is not a confidence.

## Cycle 25 — 15m — REJECT — Livermore 3-step, 4h EMA direction, volume 2×

- At: 2026-11-14T10:43:00.243Z
- Commit: `a7b39dfa9f90cd3b40e0aab229233b5c4df7b648`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: Livermore 3-step, 4h EMA direction, volume 2× (`e5d531260e6e189fd5dfa18af14b87c83b74cf41669384f962e3002457fcd06f`).

### Why this experiment

- Livermore order: direction, then the pivotal level, then volume.
- EMA 50 on closed 4-hour bars. Long only above a rising average, short only below a falling average.
- Pivot is the prior 20 bars, excluding the current bar. Breakout volume must be at least 2× the prior 20-bar average.
- The breakout bar does not enter. The next 1 close(s) must still be beyond the level. Fill is the following open.
- Stop is the broken pivotal level. The trade also exits when the close comes back through the EMA.
- One position per coin. Compared with V-Pro 34/9 plus EMA 20/30 on this same tape. The skeptic is unchanged.
- A higher bar is used only after it has closed.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$832.24 | 73 |
| ETH/USD | -$9,749.10 | 1271 | $2,416.67 | 72 |
| SOL/USD | -$9,809.91 | 1295 | $1,703.69 | 87 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$3,563.50 | 99.33% | 47.65% | -0.0468 | -0.0084 |
| holdout | -$9,774.66 | $1,568.14 | 98.00% | 38.83% | -0.0623 | 0.0040 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$3,743.59 to $14,899.79.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$665.89 (37 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$413.21 (55 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$1,032.52 (48 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$488.22 (44 trades).

Full-sample trades: BTC/USD 3247 → 181, ETH/USD 3173 → 189, SOL/USD 3206 → 211.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 56 trades, profit -$1,019.74, mean trade -0.50%.
- bear: 46 trades, profit -$1,418.50, mean trade -0.83%.
- sideways: 130 trades, profit $4,006.38, mean trade 0.91%.

### Verdict

Rejected. Failed gates: deflated-sharpe. Holdout buy-and-hold was -$3,376.06.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 181 (champion 3247), ETH/USD 189 (champion 3173), SOL/USD 211 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$3,563.50.
- pass `holdout`: Holdout profit -$9,774.66 → $1,568.14. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 47.65%, holdout 98.00% → 38.83%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0040 did not clear hurdle 0.0614 (z=-9.606, trials=18, variance=0.001096). The statistic is not a probability.
- pass `neighbours`: 7 of 7 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 18 trials. Daily Sharpe 0.0040, hurdle 0.0614, z=-9.606. The z statistic is not a probability and it is not a confidence.

## Cycle 26 — 15m — REJECT — Livermore 3-step, 4h EMA direction, pivot 40

- At: 2026-11-14T10:43:04.516Z
- Commit: `a7b39dfa9f90cd3b40e0aab229233b5c4df7b648`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: Livermore 3-step, 4h EMA direction, pivot 40 (`4854582feb4ff71961cac8ee3371a27db1f5975dae6bc0701e839239a2f94ec7`).

### Why this experiment

- Livermore order: direction, then the pivotal level, then volume.
- EMA 50 on closed 4-hour bars. Long only above a rising average, short only below a falling average.
- Pivot is the prior 40 bars, excluding the current bar. Breakout volume must be at least 1.5× the prior 20-bar average.
- The breakout bar does not enter. The next 1 close(s) must still be beyond the level. Fill is the following open.
- Stop is the broken pivotal level. The trade also exits when the close comes back through the EMA.
- One position per coin. Compared with V-Pro 34/9 plus EMA 20/30 on this same tape. The skeptic is unchanged.
- A higher bar is used only after it has closed.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$1,190.00 | 75 |
| ETH/USD | -$9,749.10 | 1271 | -$182.64 | 66 |
| SOL/USD | -$9,809.91 | 1295 | $2,680.19 | 80 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$3,555.05 | 99.33% | 42.82% | -0.0468 | -0.0089 |
| holdout | -$9,774.66 | $767.06 | 98.00% | 36.24% | -0.0623 | 0.0025 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$3,603.15 to $11,179.96.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$72.05 (38 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$44.11 (52 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$767.35 (45 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$644.79 (41 trades).

Full-sample trades: BTC/USD 3247 → 184, ETH/USD 3173 → 178, SOL/USD 3206 → 204.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 56 trades, profit -$1,023.67, mean trade -0.50%.
- bear: 46 trades, profit -$1,192.28, mean trade -0.68%.
- sideways: 119 trades, profit $2,983.01, mean trade 0.75%.

### Verdict

Rejected. Failed gates: deflated-sharpe. Holdout buy-and-hold was -$3,376.06.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 184 (champion 3247), ETH/USD 178 (champion 3173), SOL/USD 204 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$3,555.05.
- pass `holdout`: Holdout profit -$9,774.66 → $767.06. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 42.82%, holdout 98.00% → 36.24%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0025 did not clear hurdle 0.0658 (z=-10.580, trials=19, variance=0.001226). The statistic is not a probability.
- pass `neighbours`: 7 of 7 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 19 trials. Daily Sharpe 0.0025, hurdle 0.0658, z=-10.580. The z statistic is not a probability and it is not a confidence.

## Cycle 27 — 15m — REJECT — Livermore 3-step, 4h EMA direction, EMA 20

- At: 2026-11-14T10:43:08.729Z
- Commit: `a7b39dfa9f90cd3b40e0aab229233b5c4df7b648`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m. 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z. Hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: Livermore 3-step, 4h EMA direction, EMA 20 (`8bb990b88702c9751e05fecc807645103e17a2866e5f5ec4275858598c532cba`).

### Why this experiment

- Livermore order: direction, then the pivotal level, then volume.
- EMA 20 on closed 4-hour bars. Long only above a rising average, short only below a falling average.
- Pivot is the prior 20 bars, excluding the current bar. Breakout volume must be at least 1.5× the prior 20-bar average.
- The breakout bar does not enter. The next 1 close(s) must still be beyond the level. Fill is the following open.
- Stop is the broken pivotal level. The trade also exits when the close comes back through the EMA.
- One position per coin. Compared with V-Pro 34/9 plus EMA 20/30 on this same tape. The skeptic is unchanged.
- A higher bar is used only after it has closed.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,798.04 | 1280 | -$1,180.56 | 126 |
| ETH/USD | -$9,749.10 | 1271 | -$719.85 | 132 |
| SOL/USD | -$9,809.91 | 1295 | -$1,492.86 | 127 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$9,932.08 | -$4,717.17 | 99.33% | 52.18% | -0.0468 | -0.0102 |
| holdout | -$9,774.66 | -$672.90 | 98.00% | 49.29% | -0.0623 | -0.0006 |

Buy and hold on the holdout, equal weight, no costs: -$3,376.06.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,884.46 to -$9,570.95; challenger -$5,145.89 to $11,511.78.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-06-23 → 2025-08-17: champion -$5,042.22 (750 trades), challenger -$1,142.25 (73 trades).
- 2025-08-17 → 2025-10-10: champion -$4,379.51 (708 trades), challenger -$614.70 (73 trades).
- 2025-10-10 → 2025-12-04: champion -$4,586.04 (710 trades), challenger -$1,283.71 (71 trades).
- 2025-12-04 → 2026-01-27: champion -$6,005.61 (768 trades), challenger -$951.44 (66 trades).

Full-sample trades: BTC/USD 3247 → 317, ETH/USD 3173 → 316, SOL/USD 3206 → 341.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 113 trades, profit -$1,833.13, mean trade -0.46%.
- bear: 90 trades, profit -$2,179.97, mean trade -0.62%.
- sideways: 182 trades, profit $3,340.20, mean trade 0.53%.

### Verdict

Rejected. Failed gates: deflated-sharpe. Holdout buy-and-hold was -$3,376.06.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 317 (champion 3247), ETH/USD 316 (champion 3173), SOL/USD 341 (champion 3206)).
- pass `train`: Train profit -$9,932.08 → -$4,717.17.
- pass `holdout`: Holdout profit -$9,774.66 → -$672.90. Buy and hold on that window was -$3,376.06.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 99.33% → 52.18%, holdout 98.00% → 49.29%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0006 did not clear hurdle 0.0687 (z=-11.568, trials=20, variance=0.001307). The statistic is not a probability.
- pass `neighbours`: 7 of 7 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 20 trials. Daily Sharpe -0.0006, hurdle 0.0687, z=-11.568. The z statistic is not a probability and it is not a confidence.

## Cycle 28 — 15m — REJECT — Livermore 3-step, 4h EMA direction, long tape

- At: 2026-11-14T11:03:46.815Z
- Commit: `3120af684560798cdf86a0aa8189b676cdd1a360`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m (long tape, fetched 2026-11-14T10:58:56.355Z). 214659 bars, 2020-09-30T10:00:00.000Z → 2026-11-14T10:30:00.000Z. Hash `ad6835c4a0b6cc0c9747e8b07c7266c51670cdeb715ad23e663115f24aa71619`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: Livermore 3-step, 4h EMA direction, long tape (`0de1f24e37ba5dd3488a108c25c2fe3d9e85d60a2b8d9da8f5057e22aad592e8`).

### Why this experiment

- Same Livermore rule as the short-tape candidate: 15-minute entries, EMA 50 direction from closed 4-hour bars, 20-bar pivot, confirmation on the next close.
- The tape is the longer OKX public 15-minute history. The short tape file was not overwritten.
- Joined range 2020-09-30T10:00:00.000Z → 2026-11-14T10:30:00.000Z, 214659 bars, sha256 ad6835c4a0b6cc0c9747e8b07c7266c51670cdeb715ad23e663115f24aa71619.
- Joined missing slots 0, joined duplicate timestamps 0.
- Bitcoin and Ethereum history begins before Solana. The book uses only timestamps present on all three.
- Train is the first 60% after 384 warmup bars. Holdout is the rest. Those timestamps are frozen in the long-tape file.
- Fees are 0.1% taker plus 5 bps slippage on entry and exit. The skeptic's gates are unchanged. Nothing is applied to the desk.
- This is the validation of the 1.5× volume candidate. Yearly books, regime split, fee stress, the named neighbours, and the shuffled-entry control are recorded on this row. They do not add or remove a skeptic gate.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,999.94 | 3983 | -$2,366.92 | 238 |
| ETH/USD | -$9,999.59 | 3938 | -$2,262.35 | 254 |
| SOL/USD | -$9,999.89 | 3981 | -$1,533.47 | 266 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$10,000.00 | $11,628.98 | 100.00% | 51.06% | -0.0267 | 0.0037 |
| holdout | -$9,999.83 | -$1,180.06 | 100.00% | 47.75% | -0.0531 | -0.0002 |

Buy and hold on the holdout, equal weight, no costs: -$3,585.61.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,999.94 to -$9,999.39; challenger -$6,405.57 to $13,126.55.

Walk-forward folds (anchored, scored flat at each fold start):

- 2022-08-05 → 2023-01-19: champion -$9,124.18 (2292 trades), challenger $2,531.94 (118 trades).
- 2023-01-19 → 2023-07-05: champion -$8,326.35 (2189 trades), challenger -$721.23 (134 trades).
- 2023-07-05 → 2023-12-20: champion -$8,894.29 (2317 trades), challenger $2,593.77 (127 trades).
- 2023-12-20 → 2024-06-04: champion -$9,019.14 (2332 trades), challenger -$2,046.57 (141 trades).

Full-sample trades: BTC/USD 10079 → 578, ETH/USD 9935 → 612, SOL/USD 9897 → 622.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 207 trades, profit $700.94, mean trade 0.10%.
- bear: 194 trades, profit -$3,724.06, mean trade -0.60%.
- sideways: 357 trades, profit $1,843.06, mean trade 0.22%.

### Verdict

Rejected. Failed gates: deflated-sharpe. Holdout buy-and-hold was -$3,585.61.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 578 (champion 10079), ETH/USD 612 (champion 9935), SOL/USD 622 (champion 9897)).
- pass `train`: Train profit -$10,000.00 → $11,628.98.
- pass `holdout`: Holdout profit -$9,999.83 → -$1,180.06. Buy and hold on that window was -$3,585.61.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 100.00% → 51.06%, holdout 100.00% → 47.75%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0002 did not clear hurdle 0.0711 (z=-20.874, trials=21, variance=0.001369). The statistic is not a probability.
- pass `neighbours`: 6 of 6 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 21 trials. Daily Sharpe -0.0002, hurdle 0.0711, z=-20.874. The z statistic is not a probability and it is not a confidence.

### Long-tape checks (not skeptic gates)

Joined book starts when all three coins exist. Solana's own tape starts later than Bitcoin and Ethereum, so the earlier Bitcoin and Ethereum bars are kept in the per-coin audit and left out of the book. Missing means absent 15-minute slots between the first and last bar. Duplicate means the same timestamp stored twice. Costs stay 0.1% taker and 5 bps slippage, doubled only in the fee stress. Seed 20261114.

Regime is declared up front and is not a skeptic gate. A trade is bull when Bitcoin's close on the entry bar is more than 5% above its close 1,920 bars earlier (20 days of 15-minute bars), bear when it is more than 5% below, and sideways otherwise. Bars before that lookback count as sideways.

A yearly book starts flat on the first 15-minute bar of that UTC year inside the sample and ends on the last. A year with at least 1,920 bars is counted. Beating V-Pro on that year is a yearly win. The skeptic still uses its own four anchored folds. The yearly split does not replace them.

Yearly wins: candidate 7 of 7, volume 2.0× variant 7 of 7.
Fee stress at 0.20% taker and 10 bps slippage: train -$2,468.19, holdout -$5,865.43, holdout max drawdown 71.84%.
Shuffled-entry control, 1000 draws, seed 20261114: 19 reached the book's holdout profit (1.9%), and 0 reached the same open-to-open scoring of the real entries (0.0%). Median simulated profit -$4,932.00.

Each holdout trade keeps its coin, its side, and how many bars it was open. The entry bar is redrawn inside the holdout so that one coin's trades do not overlap. Entry is that bar's open. Exit is the open that many bars later, or the same bar's close when the trade did not last a full bar. The same costs apply. A draw matches the candidate when its timing profit is at least the candidate's own timing profit. This is not the book's stop-to-stop profit, and it is not a skeptic gate.

## Cycle 29 — 15m — REJECT — Livermore 3-step, 4h EMA direction, long tape, volume 2×

- At: 2026-11-14T11:03:46.819Z
- Commit: `3120af684560798cdf86a0aa8189b676cdd1a360`
- Seed: 20261114
- Data: https://www.okx.com/api/v5/market/history-candles?bar=15m (long tape, fetched 2026-11-14T10:58:56.355Z). 214659 bars, 2020-09-30T10:00:00.000Z → 2026-11-14T10:30:00.000Z. Hash `ad6835c4a0b6cc0c9747e8b07c7266c51670cdeb715ad23e663115f24aa71619`.
- Binance probe: HTTP 451, not used.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: Livermore 3-step, 4h EMA direction, long tape, volume 2× (`e5d531260e6e189fd5dfa18af14b87c83b74cf41669384f962e3002457fcd06f`).

### Why this experiment

- Same Livermore rule as the short-tape candidate: 15-minute entries, EMA 50 direction from closed 4-hour bars, 20-bar pivot, confirmation on the next close.
- The tape is the longer OKX public 15-minute history. The short tape file was not overwritten.
- Joined range 2020-09-30T10:00:00.000Z → 2026-11-14T10:30:00.000Z, 214659 bars, sha256 ad6835c4a0b6cc0c9747e8b07c7266c51670cdeb715ad23e663115f24aa71619.
- Joined missing slots 0, joined duplicate timestamps 0.
- Bitcoin and Ethereum history begins before Solana. The book uses only timestamps present on all three.
- Train is the first 60% after 384 warmup bars. Holdout is the rest. Those timestamps are frozen in the long-tape file.
- Fees are 0.1% taker plus 5 bps slippage on entry and exit. The skeptic's gates are unchanged. Nothing is applied to the desk.
- Volume multiplier 1.5 → 2 on the same long tape and the same 4-hour direction. The neighbour list is the candidate's declared neighbourhood (pivot 15/25, EMA 40/60, volume 1.25/1.75), not a looser one.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$9,999.94 | 3983 | -$2,373.69 | 220 |
| ETH/USD | -$9,999.59 | 3938 | -$2,484.54 | 241 |
| SOL/USD | -$9,999.89 | 3981 | -$2,010.27 | 249 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$10,000.00 | $20,106.73 | 100.00% | 51.60% | -0.0267 | 0.0047 |
| holdout | -$9,999.83 | -$1,473.86 | 100.00% | 49.66% | -0.0531 | -0.0005 |

Buy and hold on the holdout, equal weight, no costs: -$3,585.61.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$9,999.94 to -$9,999.39; challenger -$6,321.96 to $12,146.52.

Walk-forward folds (anchored, scored flat at each fold start):

- 2022-08-05 → 2023-01-19: champion -$9,124.18 (2292 trades), challenger $2,575.34 (114 trades).
- 2023-01-19 → 2023-07-05: champion -$8,326.35 (2189 trades), challenger -$646.88 (129 trades).
- 2023-07-05 → 2023-12-20: champion -$8,894.29 (2317 trades), challenger $3,349.26 (122 trades).
- 2023-12-20 → 2024-06-04: champion -$9,019.14 (2332 trades), challenger -$1,809.09 (132 trades).

Full-sample trades: BTC/USD 10079 → 551, ETH/USD 9935 → 584, SOL/USD 9897 → 564.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 193 trades, profit $1,646.74, mean trade 0.24%.
- bear: 182 trades, profit -$3,377.48, mean trade -0.61%.
- sideways: 335 trades, profit $256.87, mean trade 0.11%.

### Verdict

Rejected. Failed gates: deflated-sharpe. Holdout buy-and-hold was -$3,585.61.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 551 (champion 10079), ETH/USD 584 (champion 9935), SOL/USD 564 (champion 9897)).
- pass `train`: Train profit -$10,000.00 → $20,106.73.
- pass `holdout`: Holdout profit -$9,999.83 → -$1,473.86. Buy and hold on that window was -$3,585.61.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 100.00% → 51.60%, holdout 100.00% → 49.66%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0005 did not clear hurdle 0.0730 (z=-21.524, trials=22, variance=0.001412). The statistic is not a probability.
- pass `neighbours`: 6 of 6 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 22 trials. Daily Sharpe -0.0005, hurdle 0.0730, z=-21.524. The z statistic is not a probability and it is not a confidence.

