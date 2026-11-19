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

## Cycle 30 — 1d — INSUFFICIENT — V-Pro band 34 → 26

- At: 2026-11-14T19:02:03.566Z
- Commit: `93eaa05f9ea3377a102f779d3a80a0d1826ac10c`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro band 34 → 26 (`ab8f4df42be80866a2aad9b3b864153fb7a38aa78bcb383394d04d6a0db1cf29`).

### Why this experiment

- Champion is V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (f17c0e579772).
- No direction has been rejected twice.
- Volume lookback does not change a fill while the volume threshold is off, so those 3 moves wait.
- vproBand:up improved holdout profit, and there is no unused step further that way. The next experiment tries the other side of V-Pro band before opening a new knob.
- Experiment: V-Pro band 34 → 26. One variable. 24 unused moves were eligible. Hash ab8f4df42be8.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $2,243.70 | 12 |
| ETH/USD | $5,743.72 | 9 | $2,539.18 | 11 |
| SOL/USD | $6,237.65 | 9 | $5,834.72 | 10 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $6,537.33 | 35.24% | 30.90% | 0.0566 | 0.0607 |
| holdout | $5,522.78 | $3,941.33 | 20.24% | 23.55% | 0.1002 | 0.0822 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$1,959.72 to $17,278.32.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$1,012.87 (10 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger $1,393.57 (9 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$940.69 (5 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $3,712.05 (6 trades).

Full-sample trades: BTC/USD 28 → 26, ETH/USD 25 → 27, SOL/USD 24 → 26.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 9 trades, profit $318.17, mean trade 1.29%.
- bear: 3 trades, profit $1,448.37, mean trade 12.69%.
- sideways: 21 trades, profit $2,174.79, mean trade 2.67%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 26 (champion 28), ETH/USD 27 (champion 25), SOL/USD 26 (champion 24). Other failed gates: holdout, walk-forward, drawdown, deflated-sharpe, neighbours.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 26 (champion 28), ETH/USD 27 (champion 25), SOL/USD 26 (champion 24).
- pass `train`: Train profit $5,941.96 → $6,537.33.
- fail `holdout`: Holdout profit $5,522.78 → $3,941.33. Buy and hold on that window was -$562.01.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 35.24% → 30.90%, holdout 20.24% → 23.55%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0822 did not clear hurdle 0.0370 (z=0.766, trials=7, variance=0.000713). The statistic is not a probability.
- fail `neighbours`: 0 of 14 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 7 trials. Daily Sharpe 0.0822, hurdle 0.0370, z=0.766. The z statistic is not a probability and it is not a confidence.

## Cycle 31 — 1d — INSUFFICIENT — V-Pro signal 9 → 7

- At: 2026-11-15T05:23:44.250Z
- Commit: `5fd2f0fcf4a3a94bd4fe273eca0796730729da7e`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus cached OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: V-Pro signal 9 → 7 (`3a1942280996f0b1297246f3c007d093efd0744fd12a5ed79312a2c7cb64fd4e`).

### Why this experiment

- Directed one-variable change: vproSignal to 7.
- Scored against the published baseline, V-Pro 34/9 and EMA 20/30, not against an earlier band trial.
- The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- Fees stay on: 0.1% taker and 5 bps slippage on the entry and the exit. Seed stays 20261114.
- This does not edit the desk.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $3,517.05 | 11 |
| ETH/USD | $5,743.72 | 9 | $5,994.12 | 8 |
| SOL/USD | $6,237.65 | 9 | $6,625.98 | 9 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $6,969.24 | 35.24% | 30.84% | 0.0566 | 0.0623 |
| holdout | $5,522.78 | $5,960.26 | 20.24% | 20.83% | 0.1002 | 0.1048 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$1,209.92 to $22,232.90.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$1,060.65 (9 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger $1,689.22 (9 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$853.15 (5 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $4,673.00 (6 trades).

Full-sample trades: BTC/USD 28 → 28, ETH/USD 25 → 25, SOL/USD 24 → 23.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 7 trades, profit $976.48, mean trade 4.17%.
- bear: 4 trades, profit $2,153.49, mean trade 13.53%.
- sideways: 17 trades, profit $2,830.30, mean trade 3.76%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 28 (champion 28), ETH/USD 25 (champion 25), SOL/USD 23 (champion 24). Other failed gates: walk-forward, drawdown, deflated-sharpe.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 28 (champion 28), ETH/USD 25 (champion 25), SOL/USD 23 (champion 24).
- pass `train`: Train profit $5,941.96 → $6,969.24.
- pass `holdout`: Holdout profit $5,522.78 → $5,960.26. Buy and hold on that window was -$562.01.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 35.24% → 30.84%, holdout 20.24% → 20.83%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.1048 did not clear hurdle 0.0374 (z=1.172, trials=8, variance=0.000657). The statistic is not a probability.
- pass `neighbours`: 8 of 14 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 8 trials. Daily Sharpe 0.1048, hurdle 0.0374, z=1.172. The z statistic is not a probability and it is not a confidence.

## Cycle 32 — 1d — INSUFFICIENT — EMA fast 20 → 15

- At: 2026-11-15T05:23:44.540Z
- Commit: `5fd2f0fcf4a3a94bd4fe273eca0796730729da7e`
- Seed: 20261114
- Data: bundled src/lib/desk/clocks.ts daily plus cached OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Binance probe: HTTP 451, not used.
- Extension: replaced 2026-11-08; appended 2026-11-09, 2026-11-10, 2026-11-11, 2026-11-12, 2026-11-13.
- Volume scale (bundle / public): BTC/USD 0.4104, ETH/USD 0.2378, SOL/USD 0.3890.
- Champion: V-Pro 34/9, EMA 20/30, short-skip EMA 20, volume off (`f17c0e57977215b66ff31083e7d5118fdb0be734adb18eba43dc06d262cad753`).
- Experiment: EMA fast 20 → 15 (`67f085e46e41266e63e0bfa3abb684d5515ea35d76f831ecec494ab117f45588`).

### Why this experiment

- Directed one-variable change: emaFast to 15.
- Scored against the published baseline, V-Pro 34/9 and EMA 20/30, not against an earlier band trial.
- The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- Fees stay on: 0.1% taker and 5 bps slippage on the entry and the exit. Seed stays 20261114.
- This does not edit the desk.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | $2,901.13 | 12 | $2,416.80 | 13 |
| ETH/USD | $5,743.72 | 9 | $4,571.27 | 10 |
| SOL/USD | $6,237.65 | 9 | $4,725.00 | 11 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | $5,941.96 | $7,456.74 | 35.24% | 35.67% | 0.0566 | 0.0633 |
| holdout | $5,522.78 | $4,637.32 | 20.24% | 18.26% | 0.1002 | 0.0853 |

Buy and hold on the holdout, equal weight, no costs: -$562.01.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,500.77 to $21,457.28; challenger -$2,092.54 to $21,552.21.

Walk-forward folds (anchored, scored flat at each fold start):

- 2025-08-16 → 2025-10-03: champion -$919.99 (9 trades), challenger -$896.64 (9 trades).
- 2025-10-03 → 2025-11-20: champion $1,457.15 (9 trades), challenger $1,457.15 (9 trades).
- 2025-11-20 → 2026-01-07: champion -$603.42 (4 trades), challenger -$628.15 (5 trades).
- 2026-01-07 → 2026-02-24: champion $4,822.71 (6 trades), challenger $5,032.32 (6 trades).

Full-sample trades: BTC/USD 28 → 30, ETH/USD 25 → 26, SOL/USD 24 → 26.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 12 trades, profit -$1,080.71, mean trade -2.57%.
- bear: 6 trades, profit $2,112.77, mean trade 9.87%.
- sideways: 16 trades, profit $3,605.26, mean trade 5.96%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 30 (champion 28), ETH/USD 26 (champion 25), SOL/USD 26 (champion 24). Other failed gates: holdout, walk-forward, drawdown, deflated-sharpe, neighbours.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 30 (champion 28), ETH/USD 26 (champion 25), SOL/USD 26 (champion 24).
- pass `train`: Train profit $5,941.96 → $7,456.74.
- fail `holdout`: Holdout profit $5,522.78 → $4,637.32. Buy and hold on that window was -$562.01.
- fail `walk-forward`: Beat the champion on 2 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 35.24% → 35.67%, holdout 20.24% → 18.26%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0853 did not clear hurdle 0.0365 (z=0.834, trials=9, variance=0.000576). The statistic is not a probability.
- fail `neighbours`: 2 of 14 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 9 trials. Daily Sharpe 0.0853, hurdle 0.0365, z=0.834. The z statistic is not a probability and it is not a confidence.


## Comparison — Falcon vs Quantum

- At: 2026-11-15T07:12:16.933Z
- Commit: `059b6764c3475ba0eb9da5e261e80496089b6966`
- Seed: 20261114
- This is not a cycle. It was not appended to `research/lab/ledger.jsonl`, so it does not add a trial for the next `npm run lab:cycle`.
- docs/LAB_LEDGER.md and research/lab/data/quantum-falcon-result.json are the only files this run writes. `research/lab/candidate.json` was not written. `src/lib/desk` was not edited.

### What was compared

Falcon is the published book: V-Pro 34/9, EMA 20/30, and shorts skipped while the close is above the 20 EMA. Quantum is a separate book. Its daily signal is an EMA 9/21 cross. The take-profit is 0.5% and the stop is 10%. The full book also exits on the 15-minute failsafes. The daily-only book is the same cross, target, and stop with those failsafes turned off, so their effect is visible.

Every figure below gives each coin its own $10,000. The coins do not share a stake. A two-coin book therefore starts at $20,000, Falcon's three-coin book at $30,000, and Quantum's four-coin book at $40,000. Summed profits are not compared across those different sets. The head-to-head is Ethereum and Solana only.

The ranking rule was fixed in the runner before this tape was scored. On Ethereum and Solana, under the lab's own costs, a book held up better only when its holdout profit was higher and its holdout max drawdown was not worse. The Binance fee schedule is a sensitivity. The skeptic is the lab's skeptic and can refuse a book that won the comparison. Sharpe and the deflated-Sharpe z are test statistics, not probabilities.

### Assumptions

- Long and short are both allowed. The published short-skip above the 20 EMA belongs to Falcon and is not applied here. The desk has no description of this bot.
- A cross is the entry. The stance is not held. After a take-profit, stop, or failsafe, the coin stays flat until EMA 9 crosses EMA 21 again.
- The cross is known at the daily close and fills at the next day's open. An opposite cross closes at that next open. The new side waits one more day, the same one-bar delay the desk uses when it will not reverse on the exit bar.
- Take-profit is a resting limit at 0.5% from the fill. Stop-loss is a stop at 10% from the fill. Both are measured from the entry price, not from the signal close.
- When a bar's range touches the target and a stop, the stop fills. That is the pessimistic path. A gap through a stop fills at the open. A gap through the take-profit still fills at the limit price.
- The trailing stop is assumed at 1.5% from the best price since entry (the high for a long, the low for a short). It is active immediately, so it is tighter than the 10% stop from the first bar. It uses the extreme known before the current bar.
- The spike guard is the specified 1% move. On a 15-minute bar, a long exits if the low reaches 1% under that bar's open, and a short exits if the high reaches 1% over that open. The fill is that 1% level, or the open if the bar opens through it.
- EMA 9 reversal means the 15-minute close crosses the 15-minute EMA 9 against the position: a long exits when the close goes from at or above the EMA to below it, and a short does the opposite. It fills at the next 15-minute open. An EMA-slope flip was not used.
- The volume-surge exit is the specified 3×. The average is the prior 20 fifteen-minute bars, the same lookback the desk uses for its volume rule, and the current bar is not inside that average. Any 3× bar exits, in either direction. It fills at the next 15-minute open. If the EMA reversal and the surge arm on the same close, the exit is counted as the EMA reversal.
- Among stops touched in one bar, the one closest to the open in the adverse direction fills first. For a long that is the highest stop. For a short it is the lowest.
- Each window starts flat and flattens at its last bar's close. A 15-minute failsafe cannot see a bar that has not closed. Funding uses the fill bar's open time, so a round trip inside the entry bar accrues none.
- One times leverage is a fully funded cash return on that coin's own stake. There is no exchange liquidation engine and no shared margin.
- The lab cost is 0.1% taker and 5 bps of slippage on the entry and the exit, including the take-profit. The Binance USDT-M schedule is 0.05% taker, 0.02% maker on the resting take-profit, no extra slippage, and a flat 0.01% per day paid by longs and received by shorts. Falcon has no resting limit, so both of its sides pay the taker fee under that second schedule. Funding on Falcon is the same flat assumption, applied only so the cost models match. The desk itself is not a perpetual swap.
- Neighbours move only the two assumed widths: the trail 1.5% to 1.0% and to 2.0%, and the volume average from 20 bars to 10 and to 30. The specified 0.5% target, 10% stop, 1% spike, 3× surge, and EMA 9 were not searched.

### Tape

- Pinned daily tape: bundled src/lib/desk/clocks.ts daily plus cached OKX 1Dutc. 726 bars, 2024-11-18 → 2026-11-13. Hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`.
- Train signals start 2025-02-06. Holdout signals start 2026-02-25. The book is marked through 2026-11-13. Same split as the ledger.
- Ethereum and Solana 15-minute bars are the pinned OKX file, hash `91991f53169d15ef73e8ed26ec8dd2213576b85f8acefd255c038c1aea292a93`. The ETH+SOL slice hash is `e852a2e0e021c7af31eb0b2aabcb6048663893b12da0b4a9f5516227a641bdf3`. https://www.okx.com/api/v5/market/history-candles?bar=15m.
- BNB and XRP are not in that file. Spot USDT candles. Confirmed OKX rows only. No API key. Binance was probed and not used when OKX answered, so these coins match the pinned 15-minute tape's venue. Source `https://www.okx.com/api/v5/market/history-candles`, fallback `https://my.okx.com`, fetched 2026-11-15T07:10:18.755Z, kept from 2024-11-14T00:00:00.000Z. Hash `faf2440aac3cf4e560984e5cc304393b0dbd73ed8aeedda827cf8d200f0d8754`.
- Binance probe: fapi.binance.com HTTP 451; api.binance.com HTTP 451. Not used.
- BNB daily bars 726, 2024-11-18T00:00:00.000Z → 2026-11-13T00:00:00.000Z, missing slots 0, duplicates 0.
- XRP daily bars 726, 2024-11-18T00:00:00.000Z → 2026-11-13T00:00:00.000Z, missing slots 0, duplicates 0.
- ETH/USD 15-minute: 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z, missing slots 0, duplicates 0. Pinned days with no 15-minute bar: 0. Days with fewer than 90 bars: 0. Median absolute gap between the daily open and the first 15-minute open: 0.040% (max 0.381%, 726 days).
- SOL/USD 15-minute: 70120 bars, 2024-11-14T00:00:00.000Z → 2026-11-14T09:45:00.000Z, missing slots 0, duplicates 0. Pinned days with no 15-minute bar: 0. Days with fewer than 90 bars: 0. Median absolute gap between the daily open and the first 15-minute open: 0.039% (max 2.026%, 726 days).
- BNB/USD 15-minute: 70204 bars, 2024-11-14T00:00:00.000Z → 2026-11-15T06:45:00.000Z, missing slots 0, duplicates 0. Pinned days with no 15-minute bar: 0. Days with fewer than 90 bars: 0. Median absolute gap between the daily open and the first 15-minute open: 0.000% (max 0.000%, 726 days).
- XRP/USD 15-minute: 70204 bars, 2024-11-14T00:00:00.000Z → 2026-11-15T06:45:00.000Z, missing slots 0, duplicates 0. Pinned days with no 15-minute bar: 0. Days with fewer than 90 bars: 0. Median absolute gap between the daily open and the first 15-minute open: 0.000% (max 0.000%, 726 days).

### Ledger check

The published three-coin shared book, lab costs, still prints train $5,941.96 and holdout $5,522.78. Full-sample trades stay BTC 28, ETH 25, SOL 24. That is the ledger's book. The tables below are not that book: each coin has its own $10,000.

### Ethereum and Solana, lab costs

| Book | Train profit | Train trades | Holdout profit | Holdout max DD | Holdout trades |
| --- | ---: | ---: | ---: | ---: | ---: |
| Falcon | $10,699.81 | 30 | $11,981.37 | 22.93% | 18 |
| Quantum | -$723.26 | 24 | -$780.02 | 3.90% | 16 |
| Quantum, no failsafes | $145.87 | 24 | $322.58 | 1.01% | 16 |

Holdout, each coin on its own $10,000:

| Coin | Falcon profit | Falcon trades | Quantum profit | Quantum trades | No failsafes profit | No failsafes trades |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ETH/USD | $5,743.72 | 9 | -$204.32 | 6 | $120.66 | 6 |
| SOL/USD | $6,237.65 | 9 | -$575.70 | 10 | $201.92 | 10 |

Walk-forward folds, anchored, each fold started flat. Profit, trades, max drawdown:

| Fold | Falcon | Quantum | No failsafes |
| --- | ---: | ---: | ---: |
| 2025-08-16 → 2025-10-03 | -$1,627.63 (5, 12.57%) | -$143.56 (4, 0.72%) | $80.41 (4, 0.00%) |
| 2025-10-03 → 2025-11-20 | $2,384.19 (6, 23.80%) | -$335.76 (4, 1.68%) | $80.12 (4, 1.62%) |
| 2025-11-20 → 2026-01-07 | -$1,272.95 (3, 9.72%) | -$59.81 (4, 0.40%) | $79.91 (4, 0.13%) |
| 2026-01-07 → 2026-02-24 | $8,839.43 (4, 13.49%) | -$196.49 (2, 0.98%) | $40.27 (2, 0.00%) |

Holdout trade quality. Falcon: win rate 50.00%, average win $1,797.82, average loss -$466.55, worst -$983.23 (SOL/USD long -10.06%, desk), longest losing streak 3. Quantum: win rate 6.25%, average win $19.53, average loss -$53.30, worst -$165.12 (SOL/USD long -1.66%, trail), longest losing streak 11. No failsafes: win rate 100.00%, average win $20.16, average loss n/a, worst $19.89 (ETH/USD long 0.20%, tp), longest losing streak 0.

Full sample, from the first train signal through the last bar, one continuous run. Falcon trades ETH/USD 25, SOL/USD 24. win rate 44.90%, average win $2,048.49, average loss -$779.08, worst -$1,767.11 (ETH/USD long -15.30%, desk), longest losing streak 5. Quantum trades ETH/USD 18, SOL/USD 22. win rate 30.00%, average win $19.74, average loss -$61.31, worst -$161.24 (SOL/USD long -1.66%, trail), longest losing streak 13. No failsafes: ETH/USD 18, SOL/USD 22. win rate 97.50%, average win $20.09, average loss -$314.05, worst -$314.05 (SOL/USD short -3.12%, cross), longest losing streak 1.

Quantum exits. A tie between the EMA reversal and the volume surge on the same close is counted as the EMA reversal.

| Exit | Quantum train | Quantum holdout | Quantum full | No failsafes train | No failsafes holdout | No failsafes full |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| tp | 11 | 1 | 12 | 23 | 16 | 39 |
| sl | 0 | 0 | 0 | 0 | 0 | 0 |
| trail | 0 | 1 | 1 | 0 | 0 | 0 |
| spike | 3 | 0 | 3 | 0 | 0 | 0 |
| ema9 | 9 | 12 | 21 | 0 | 0 | 0 |
| volume | 1 | 2 | 3 | 0 | 0 | 0 |
| cross | 0 | 0 | 0 | 1 | 0 | 1 |
| flatten | 0 | 0 | 0 | 0 | 0 | 0 |

Signal ties: Quantum train 0, holdout 0, full 0. Days that fell back to the daily bar because the 15-minute session was missing: train 0, holdout 0. Short sessions: train 0, holdout 0.

### Ethereum and Solana, Binance USDT-M costs

| Book | Train profit | Train trades | Holdout profit | Holdout max DD | Holdout trades |
| --- | ---: | ---: | ---: | ---: | ---: |
| Falcon | $11,685.40 | 30 | $12,472.18 | 22.40% | 18 |
| Quantum | -$222.40 | 24 | -$468.17 | 2.34% | 16 |
| Quantum, no failsafes | $702.64 | 24 | $703.78 | 0.78% | 16 |

| Coin | Falcon profit | Falcon trades | Quantum profit | Quantum trades | No failsafes profit | No failsafes trades |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| ETH/USD | $5,985.39 | 9 | -$82.95 | 6 | $264.42 | 6 |
| SOL/USD | $6,486.79 | 9 | -$385.21 | 10 | $439.37 | 10 |

| Fold | Falcon | Quantum | No failsafes |
| --- | ---: | ---: | ---: |
| 2025-08-16 → 2025-10-03 | -$1,574.02 (5, 12.43%) | -$57.60 (4, 0.54%) | $173.18 (4, 0.00%) |
| 2025-10-03 → 2025-11-20 | $2,582.29 (6, 23.60%) | -$254.13 (4, 1.27%) | $170.73 (4, 1.44%) |
| 2025-11-20 → 2026-01-07 | -$1,200.65 (3, 9.72%) | $25.85 (4, 0.24%) | $171.66 (4, 0.03%) |
| 2026-01-07 → 2026-02-24 | $8,969.07 (4, 13.44%) | -$156.76 (2, 0.78%) | $86.43 (2, 0.00%) |

Holdout trade quality. Falcon: win rate 55.56%, average win $1,652.26, average loss -$506.30, worst -$997.41 (SOL/USD long -10.12%, desk), longest losing streak 3. Quantum: win rate 18.75%, average win $19.13, average loss -$40.43, worst -$146.24 (SOL/USD long -1.47%, trail), longest losing streak 7. No failsafes: win rate 100.00%, average win $43.99, average loss n/a, worst $42.97 (ETH/USD long 0.43%, tp), longest losing streak 0.

Full sample. Falcon ETH/USD 25, SOL/USD 24. win rate 46.94%, average win $2,048.57, average loss -$804.68, worst -$1,789.88 (ETH/USD long -15.18%, desk), longest losing streak 5. Quantum ETH/USD 18, SOL/USD 22. win rate 37.50%, average win $36.17, average loss -$49.28, worst -$146.58 (SOL/USD long -1.47%, trail), longest losing streak 7. No failsafes: ETH/USD 18, SOL/USD 22. win rate 97.50%, average win $44.20, average loss -$295.56, worst -$295.56 (SOL/USD short -2.92%, cross), longest losing streak 1.

| Exit | Quantum train | Quantum holdout | Quantum full | No failsafes train | No failsafes holdout | No failsafes full |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| tp | 11 | 1 | 12 | 23 | 16 | 39 |
| sl | 0 | 0 | 0 | 0 | 0 | 0 |
| trail | 0 | 1 | 1 | 0 | 0 | 0 |
| spike | 3 | 0 | 3 | 0 | 0 | 0 |
| ema9 | 9 | 12 | 21 | 0 | 0 | 0 |
| volume | 1 | 2 | 3 | 0 | 0 | 0 |
| cross | 0 | 0 | 0 | 1 | 0 | 1 |
| flatten | 0 | 0 | 0 | 0 | 0 | 0 |

### Each book on its own coins, lab costs

Falcon's coins are Bitcoin, Ethereum, and Solana. Quantum's coins are Ethereum, Solana, BNB, and XRP. Bitcoin is not in the Quantum book. These two sums do not share a denominator.

| Book | Train profit | Train trades | Holdout profit | Holdout max DD | Holdout trades |
| --- | ---: | ---: | ---: | ---: | ---: |
| Falcon, 3 coins | $12,989.62 | 47 | $14,882.50 | 18.76% | 30 |
| Quantum, 4 coins | -$1,720.34 | 50 | -$1,472.78 | 3.78% | 42 |
| Quantum, no failsafes | -$2,039.56 | 50 | -$2,732.01 | 7.47% | 41 |

Falcon holdout, each coin on its own $10,000:

| Coin | Falcon profit | Falcon trades |
| --- | ---: | ---: |
| BTC/USD | $2,901.13 | 12 |
| ETH/USD | $5,743.72 | 9 |
| SOL/USD | $6,237.65 | 9 |

Quantum holdout, each coin on its own $10,000:

| Coin | Quantum profit | Quantum trades | No failsafes profit | No failsafes trades |
| --- | ---: | ---: | ---: | ---: |
| ETH/USD | -$204.32 | 6 | $120.66 | 6 |
| SOL/USD | -$575.70 | 10 | $201.92 | 10 |
| BNB/USD | -$242.80 | 12 | -$1,939.51 | 12 |
| XRP/USD | -$449.96 | 14 | -$1,115.08 | 13 |

Falcon folds:

| Fold | Falcon |
| --- | ---: |
| 2025-08-16 → 2025-10-03 | -$2,762.97 (9, 9.87%) |
| 2025-10-03 → 2025-11-20 | $3,127.91 (9, 19.92%) |
| 2025-11-20 → 2026-01-07 | -$1,828.14 (4, 8.65%) |
| 2026-01-07 → 2026-02-24 | $12,022.58 (6, 12.51%) |

Quantum folds:

| Fold | Quantum | No failsafes |
| --- | ---: | ---: |
| 2025-08-16 → 2025-10-03 | -$215.82 (7, 0.54%) | $140.69 (7, 0.00%) |
| 2025-10-03 → 2025-11-20 | -$437.19 (7, 1.09%) | -$816.15 (7, 2.33%) |
| 2025-11-20 → 2026-01-07 | -$20.04 (6, 0.20%) | $119.68 (6, 0.06%) |
| 2026-01-07 → 2026-02-24 | -$266.60 (4, 0.67%) | $80.54 (4, 0.00%) |

Holdout quality. Falcon: win rate 50.00%, average win $1,415.00, average loss -$422.83, worst -$983.23 (SOL/USD long -10.06%, desk), longest losing streak 5. Quantum: win rate 26.19%, average win $19.68, average loss -$54.49, worst -$166.05 (BNB/USD short -1.67%, trail), longest losing streak 10. No failsafes: win rate 85.37%, average win $19.46, average loss -$568.85, worst -$920.67 (BNB/USD long -10.27%, sl), longest losing streak 1.

Full-sample trades. Falcon BTC/USD 28, ETH/USD 25, SOL/USD 24. win rate 41.56%, average win $1,776.96, average loss -$618.77, worst -$1,767.11 (ETH/USD long -15.30%, desk), longest losing streak 8. Quantum ETH/USD 18, SOL/USD 22, BNB/USD 24, XRP/USD 28. win rate 34.78%, average win $19.31, average loss -$62.56, worst -$173.95 (BNB/USD long -1.73%, trail), longest losing streak 10. No failsafes: ETH/USD 18, SOL/USD 22, BNB/USD 24, XRP/USD 27. win rate 87.91%, average win $19.00, average loss -$538.24, worst -$896.78 (XRP/USD short -8.91%, cross), longest losing streak 2.

| Exit | Quantum train | Quantum holdout | Quantum full | No failsafes train | No failsafes holdout | No failsafes full |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| tp | 21 | 11 | 32 | 45 | 35 | 80 |
| sl | 0 | 0 | 0 | 1 | 2 | 3 |
| trail | 1 | 2 | 3 | 0 | 0 | 0 |
| spike | 3 | 0 | 3 | 0 | 0 | 0 |
| ema9 | 23 | 25 | 48 | 0 | 0 | 0 |
| volume | 2 | 4 | 6 | 0 | 0 | 0 |
| cross | 0 | 0 | 0 | 4 | 4 | 8 |
| flatten | 0 | 0 | 0 | 0 | 0 | 0 |

### Each book on its own coins, Binance USDT-M costs

| Book | Train profit | Train trades | Holdout profit | Holdout max DD | Holdout trades |
| --- | ---: | ---: | ---: | ---: | ---: |
| Falcon, 3 coins | $14,450.63 | 47 | $15,649.03 | 18.18% | 30 |
| Quantum, 4 coins | -$688.89 | 50 | -$622.61 | 1.85% | 42 |
| Quantum, no failsafes | -$958.51 | 50 | -$1,860.04 | 6.06% | 41 |

| Coin | Falcon profit | Falcon trades |
| --- | ---: | ---: |
| BTC/USD | $3,176.85 | 12 |
| ETH/USD | $5,985.39 | 9 |
| SOL/USD | $6,486.79 | 9 |

| Coin | Quantum profit | Quantum trades | No failsafes profit | No failsafes trades |
| --- | ---: | ---: | ---: | ---: |
| ETH/USD | -$82.95 | 6 | $264.42 | 6 |
| SOL/USD | -$385.21 | 10 | $439.37 | 10 |
| BNB/USD | $12.41 | 12 | -$1,717.92 | 12 |
| XRP/USD | -$166.86 | 14 | -$845.91 | 13 |

| Fold | Falcon |
| --- | ---: |
| 2025-08-16 → 2025-10-03 | -$2,621.64 (9, 9.78%) |
| 2025-10-03 → 2025-11-20 | $3,409.67 (9, 19.50%) |
| 2025-11-20 → 2026-01-07 | -$1,724.94 (4, 8.65%) |
| 2026-01-07 → 2026-02-24 | $12,219.61 (6, 12.46%) |

| Fold | Quantum | No failsafes |
| --- | ---: | ---: |
| 2025-08-16 → 2025-10-03 | -$64.05 (7, 0.32%) | $303.14 (7, 0.00%) |
| 2025-10-03 → 2025-11-20 | -$292.61 (7, 0.75%) | -$657.09 (7, 2.27%) |
| 2025-11-20 → 2026-01-07 | $111.77 (6, 0.12%) | $257.60 (6, 0.02%) |
| 2026-01-07 → 2026-02-24 | -$186.93 (4, 0.48%) | $172.87 (4, 0.00%) |

Holdout quality. Falcon: win rate 53.33%, average win $1,359.71, average loss -$436.16, worst -$997.41 (SOL/USD long -10.12%, desk), longest losing streak 5. Quantum: win rate 33.33%, average win $35.19, average loss -$39.83, worst -$147.95 (BNB/USD short -1.47%, trail), longest losing streak 7. No failsafes: win rate 85.37%, average win $42.46, average loss -$557.67, worst -$925.44 (BNB/USD long -10.09%, sl), longest losing streak 1.

Full-sample trades. Falcon BTC/USD 28, ETH/USD 25, SOL/USD 24. win rate 42.86%, average win $1,805.84, average loss -$625.62, worst -$1,789.88 (ETH/USD long -15.18%, desk), longest losing streak 8. Quantum ETH/USD 18, SOL/USD 22, BNB/USD 24, XRP/USD 28. win rate 41.30%, average win $36.70, average loss -$50.05, worst -$154.98 (BNB/USD long -1.54%, trail), longest losing streak 7. No failsafes: ETH/USD 18, SOL/USD 22, BNB/USD 24, XRP/USD 27. win rate 87.91%, average win $41.69, average loss -$534.26, worst -$883.50 (XRP/USD short -8.72%, cross), longest losing streak 2.

| Exit | Quantum train | Quantum holdout | Quantum full | No failsafes train | No failsafes holdout | No failsafes full |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| tp | 21 | 11 | 32 | 45 | 35 | 80 |
| sl | 0 | 0 | 0 | 1 | 2 | 3 |
| trail | 1 | 2 | 3 | 0 | 0 | 0 |
| spike | 3 | 0 | 3 | 0 | 0 | 0 |
| ema9 | 23 | 25 | 48 | 0 | 0 | 0 |
| volume | 2 | 4 | 6 | 0 | 0 | 0 |
| cross | 0 | 0 | 0 | 4 | 4 | 8 |
| flatten | 0 | 0 | 0 | 0 | 0 | 0 |

### Skeptic

Quantum with the failsafes is the challenger. Falcon on the same two coins is the champion. The daily-only book is not a second challenger. The prior list is the daily V-Pro track already in the ledger, 9 holdout Sharpes, so this comparison is scored as trial 10 on that list. It was not written into the ledger, and the Binance pass uses the same prior list rather than stacking on the lab pass.

Lab costs: **INSUFFICIENT**. Insufficient sample: Need 30 closed trades on each coin over the full sample. Got ETH/USD 18 (champion 25), SOL/USD 22 (champion 24). Other failed gates: train, holdout, walk-forward, deflated-sharpe, neighbours.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got ETH/USD 18 (champion 25), SOL/USD 22 (champion 24).
- fail `train`: Train profit $10,699.81 → -$723.26.
- fail `holdout`: Holdout profit $11,981.37 → -$780.02. Buy and hold on that window was -$1,734.93.
- fail `walk-forward`: Beat the champion on 2 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 39.29% → 3.90%, holdout 22.93% → 3.90%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1958 did not clear hurdle 0.1456 (z=-11.162, trials=10, variance=0.008546). The statistic is not a probability.
- fail `neighbours`: 0 of 4 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 10 trials. Daily Sharpe -0.1958, hurdle 0.1456, z=-11.162. The z statistic is not a probability and it is not a confidence.

Neighbours, lab costs, holdout profit on Ethereum and Solana:

- trail 1.5% → 1.0%: -$783.08, does not beat Falcon.
- trail 1.5% → 2.0%: -$763.10, does not beat Falcon.
- volume lookback 20 → 10: -$778.96, does not beat Falcon.
- volume lookback 20 → 30: -$668.80, does not beat Falcon.

Binance costs: **INSUFFICIENT**. Insufficient sample: Need 30 closed trades on each coin over the full sample. Got ETH/USD 18 (champion 25), SOL/USD 22 (champion 24). Other failed gates: train, holdout, walk-forward, deflated-sharpe, neighbours.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got ETH/USD 18 (champion 25), SOL/USD 22 (champion 24).
- fail `train`: Train profit $11,685.40 → -$222.40.
- fail `holdout`: Holdout profit $12,472.18 → -$468.17. Buy and hold on that window was -$1,734.93.
- fail `walk-forward`: Beat the champion on 2 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 39.04% → 2.45%, holdout 22.40% → 2.34%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1475 did not clear hurdle 0.1224 (z=-7.862, trials=10, variance=0.006042). The statistic is not a probability.
- fail `neighbours`: 0 of 4 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 10 trials. Daily Sharpe -0.1475, hurdle 0.1224, z=-7.862. The z statistic is not a probability and it is not a confidence.

- trail 1.5% → 1.0%: -$471.02, does not beat Falcon.
- trail 1.5% → 2.0%: -$451.02, does not beat Falcon.
- volume lookback 20 → 10: -$467.11, does not beat Falcon.
- volume lookback 20 → 30: -$351.63, does not beat Falcon.

### Verdict

On Ethereum and Solana, with each coin on its own $10,000 and the lab's own costs, Falcon's holdout was $11,981.37 and Quantum's was -$780.02. Falcon's average winning trade was $1,797.82 against an average loss of -$466.55. Quantum's average win was $19.53 against an average loss of -$53.30, and the holdout win rate was 6.25%.

Falcon made more money on the holdout. Quantum had the shallower holdout drawdown. The rule needs both, so it does not name a winner. Quantum's drawdown is smaller because the loss itself is small, not because the book earned a smoother profit.

The same split shows up under the Binance fee schedule. Falcon made more money on the holdout. Quantum had the shallower holdout drawdown. The rule needs both, so it does not name a winner.

Quantum was ahead on 2 of 4 walk-forward folds. 2 of those were folds where both books lost and Quantum lost less.

Without the 15-minute failsafes, the same daily cross and 0.5% target made $322.58 on the Ethereum and Solana holdout (drawdown 1.01%, win rate 100.00%). Turning the failsafes on moved that to -$780.02 (-$1,102.60) and the drawdown to 3.90%. On the full two-coin sample the EMA 9 reversal was the exit on 21 of 40 trades. The 10% stop filled 0 times with the failsafes on, and 2 times in the four-coin daily-only holdout. That four-coin daily-only holdout lost money on BNB and XRP.

The skeptic's verdict, Quantum against Falcon, lab costs, is INSUFFICIENT. Insufficient sample: Need 30 closed trades on each coin over the full sample. Got ETH/USD 18 (champion 25), SOL/USD 22 (champion 24). Other failed gates: train, holdout, walk-forward, deflated-sharpe, neighbours. The Binance pass is INSUFFICIENT. The deflated-Sharpe figures are z=-11.162 on the lab costs and z=-7.862 on the Binance costs. Neither z is a probability.

Caveats. The holdout is one window, 25 Feb 2026 through 13 Nov 2026, and neither coin reached the skeptic's 30 closed trades. A few dozen EMA 9/21 crosses cannot identify a 0.5% target. The 1.5% trail and the 20-bar volume average were assumed before the run, not fit to this tape, and none of the four neighbours beat Falcon. Prices are OKX spot. Binance USDT-M and Binance spot both returned HTTP 451, so the funding line is a flat 0.01% per day rather than the historical perpetual rate. A bar that touches both the target and a stop is filled at the stop. One times leverage is a cash return on that coin's own stake, not an exchange liquidation engine. The published desk was not changed.
## Cycle 33 — 15m — REJECT — CURRENT Livermore against OLD Livermore

- At: 2026-11-15T09:03:29.612Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: OLD Livermore ma_length=50, ma_slope_bars=5, flat_slope_pct=0.0001, tangle_bars=5, pivot_lookback=20, pivot_wing=2, touch_tolerance_pct=0.001, min_touches=2, confirm_bars=2, vol_multiplier=1.5, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`cf04732f9cfc36872b14ed279d52d64a3f23625398da9b0c55528504f49614a5`).
- Experiment: CURRENT Livermore against OLD Livermore (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Parameter: `old_vs_current`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- This cycle scores CURRENT against OLD. Seven entry settings differ, so it is not a one-variable acceptance candidate. CURRENT is the challenger and OLD is the champion.
- Scored against OLD. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Prices are Binance USDT-M 15-minute klines from the public archive at data.binance.vision, futures/um, base-asset volume, no API key. api.binance.com and fapi.binance.com return HTTP 451 from this location, so the REST kline routes were not used.
- The book trades the close of each 15-minute bar. A signal on that close fills at the next bar's open. Each window starts flat, with no pending confirmation carried in, and a position still open on the last bar is flattened at that close.
- Slope is the EMA's change over ma_slope_bars, divided by the EMA at the start of the window. Long requires the close above the EMA and a slope at least flat_slope_pct. Short is the mirror. A zero threshold still requires the EMA to be rising or falling. A close that crosses or lands on the EMA inside the last tangle_bars bars, including the current bar, stays flat. tangle_bars 0 turns that off.
- A swing high is strictly above the pivot_wing bars on each side. A swing low is strictly below them. At bar i the usable swings are those centered from i - pivot_lookback through i - pivot_wing. Highs and lows cluster separately. A price joins a cluster when it is within touch_tolerance_pct of that cluster's lowest price, and the level is the mean. min_touches 1 keeps every swing.
- The long breaks the highest resistance the close clears. The short breaks the lowest support. The breakout close is the first of confirm_bars holds. Volume is tested only on that breakout bar, against the prior vol_lookback bars, and vol_multiplier 1 turns the filter off.
- A stop and a target touched in one bar fill the stop. A stop gapping through the open fills at the open. The target fills at the target price. An EMA exit is a close back through the line, at that close.
- Size is equal notional: one position per coin, each allocated the same fraction of current equity, compounded in coin-list order. Stake starts at $10,000 for the shared book.
- The lab cost is 0.1% taker and 5 bps slippage on the entry and on every exit, including the target. No funding. The Binance USDT-M sensitivity is 0.05% taker on the entry, the stop, the EMA exit, and the flatten, 0.02% maker on the target, 2 bps adverse slippage on taker fills, and no extra slippage on the target.
- Funding is an assumption, not a historical print: 0.01% of notional per day, paid by longs and received by shorts, pro-rated from the entry bar's open to the exit time. Binance returned HTTP 451, so the perpetual funding history was not fetched. A stop on the entry bar accrues none. A close-based exit is stamped at the bar's close, 15 minutes after its open.
- The skeptic is unchanged. Its Sharpe is the per-bar equity Sharpe on this 15-minute book, not a daily Sharpe. The deflated-Sharpe z is a test statistic, not a probability. On --all, every cycle in this sweep is one trial. Neighbours are one grid step on the entry parameters, or on the two exit parameters for an exit test. They are not extra trials.
- Train is the first 60% of the bars after 384 bars of warmup. Holdout is the rest. Four walk-forward folds cover the second half of the train, each started flat. Seed 20261114. Nothing here edits the desk.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$2,269.69 | 94 | -$7,038.40 | 378 |
| ETH/USD | -$1,840.93 | 88 | -$7,221.95 | 421 |
| SOL/USD | -$1,736.04 | 62 | -$7,586.52 | 420 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$2,376.72 | -$8,444.69 | 23.86% | 84.46% | -0.0623 | -0.1074 |
| holdout | -$1,556.19 | -$7,053.33 | 16.04% | 71.05% | -0.0574 | -0.1191 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$1,759.38 to -$1,345.21; challenger -$7,401.97 to -$6,639.44.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$309.45 (115 trades), challenger -$2,416.55 (875 trades).
- 2026-03-25 → 2026-04-22: champion -$324.04 (146 trades), challenger -$1,953.50 (788 trades).
- 2026-04-22 → 2026-05-20: champion -$320.16 (112 trades), challenger -$1,818.26 (715 trades).
- 2026-05-20 → 2026-06-17: champion -$325.07 (104 trades), challenger -$1,913.56 (816 trades).

Full-sample trades: BTC/USD 204 → 991, ETH/USD 191 → 1091, SOL/USD 157 → 1109.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1314 trades, profit -$2,233.09, mean trade -0.32%.
- bear: 753 trades, profit -$1,380.65, mean trade -0.35%.
- sideways: 2100 trades, profit -$3,439.60, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 991 (champion 204), ETH/USD 1091 (champion 191), SOL/USD 1109 (champion 157), BNB/USD 1010 (champion 181), XRP/USD 1106 (champion 138), DOGE/USD 1092 (champion 140), ADA/USD 1056 (champion 92), AVAX/USD 1094 (champion 116), LINK/USD 1059 (champion 120), LTC/USD 1000 (champion 113)).
- fail `train`: Train profit -$2,376.72 → -$8,444.69.
- fail `holdout`: Holdout profit -$1,556.19 → -$7,053.33. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 23.86% → 84.46%, holdout 16.04% → 71.05%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1191 did not clear hurdle 0.0487 (z=-21.760, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 0 of 17 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1191, hurdle 0.0487, z=-21.760. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 1452 → 10608 (3.872 → 28.288 per day). Holdout trades 604 → 4167 (4.026 → 27.778 per day).
Per coin, full sample then holdout: BTC/USD 204→991 full, 94→378 holdout; ETH/USD 191→1091 full, 88→421 holdout; SOL/USD 157→1109 full, 62→420 holdout; BNB/USD 181→1010 full, 67→375 holdout; XRP/USD 138→1106 full, 58→450 holdout; DOGE/USD 140→1092 full, 53→413 holdout; ADA/USD 92→1056 full, 27→421 holdout; AVAX/USD 116→1094 full, 49→437 holdout; LINK/USD 120→1059 full, 50→438 holdout; LTC/USD 113→1000 full, 56→414 holdout.
Full-sample win rate 60.47% → 65.21%. Average win 0.20% → 0.20% ($1.61 → $0.63). Average loss -1.07% → -1.21% (-$8.67 → -$3.76).
Holdout win rate 59.44% → 63.40%. Average win 0.20% → 0.20%. Average loss -0.98% → -1.15%.
Train profit -$2,376.72 → -$8,444.69. Holdout profit -$1,556.19 → -$7,053.33. Holdout max drawdown 16.04% → 71.05%.
Folds won 0 of 4. Longest losing streak, full sample, 10 → 15. Holdout streak 9 → 13.
Exits, full sample, challenger: target 6918, stop 1, EMA 3689, flatten 0. Champion: target 878, stop 1, EMA 573, flatten 0.
Per-bar Sharpe, holdout, -0.0574 → -0.1191. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-21.760 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 1452 → 10608 (3.872 → 28.288 per day). Holdout trades 604 → 4167 (4.026 → 27.778 per day).
Per coin, full sample then holdout: BTC/USD 204→991 full, 94→378 holdout; ETH/USD 191→1091 full, 88→421 holdout; SOL/USD 157→1109 full, 62→420 holdout; BNB/USD 181→1010 full, 67→375 holdout; XRP/USD 138→1106 full, 58→450 holdout; DOGE/USD 140→1092 full, 53→413 holdout; ADA/USD 92→1056 full, 27→421 holdout; AVAX/USD 116→1094 full, 49→437 holdout; LINK/USD 120→1059 full, 50→438 holdout; LTC/USD 113→1000 full, 56→414 holdout.
Full-sample win rate 60.47% → 65.21%. Average win 0.41% → 0.41% ($3.76 → $2.54). Average loss -0.91% → -1.05% (-$8.39 → -$6.51).
Holdout win rate 59.44% → 63.40%. Average win 0.41% → 0.41%. Average loss -0.82% → -0.99%.
Train profit -$1,039.86 → -$4,603.85. Holdout profit -$531.83 → -$3,453.82. Holdout max drawdown 6.16% → 36.65%.
Folds won 0 of 4. Longest losing streak, full sample, 10 → 15. Holdout streak 9 → 13.
Exits, full sample, challenger: target 6918, stop 1, EMA 3689, flatten 0. Champion: target 878, stop 1, EMA 573, flatten 0.
Per-bar Sharpe, holdout, -0.0194 → -0.0423. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-7.425 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 34 — 15m — REJECT — tangle_bars 3 → 0

- At: 2026-11-15T09:03:29.613Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: tangle_bars 3 → 0 (`751f2b8a8edb6304cc5553b9953577adef65a97b69db5505f3c0c032b2adc012`).
- Parameter: `tangle_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: tangle_bars from 3 to 0. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,761.35 | 461 |
| ETH/USD | -$7,221.95 | 421 | -$8,046.91 | 532 |
| SOL/USD | -$7,586.52 | 420 | -$8,215.12 | 530 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$9,107.16 | 84.46% | 91.08% | -0.1074 | -0.1244 |
| holdout | -$7,053.33 | -$7,861.11 | 71.05% | 78.99% | -0.1191 | -0.1375 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$8,194.07 to -$7,459.65.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,999.78 (1135 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$2,290.65 (989 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$2,378.52 (916 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$2,327.28 (1038 trades).

Full-sample trades: BTC/USD 991 → 1227, ETH/USD 1091 → 1399, SOL/USD 1109 → 1407.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1700 trades, profit -$2,382.54, mean trade -0.31%.
- bear: 930 trades, profit -$1,587.49, mean trade -0.36%.
- sideways: 2637 trades, profit -$3,891.07, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1227 (champion 991), ETH/USD 1399 (champion 1091), SOL/USD 1407 (champion 1109), BNB/USD 1243 (champion 1010), XRP/USD 1415 (champion 1106), DOGE/USD 1419 (champion 1092), ADA/USD 1357 (champion 1056), AVAX/USD 1388 (champion 1094), LINK/USD 1357 (champion 1059), LTC/USD 1281 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$9,107.16.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,861.11. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 91.08%, holdout 71.05% → 78.99%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1375 did not clear hurdle 0.0487 (z=-24.317, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 2 of 16 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1375, hurdle 0.0487, z=-24.317. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 13493 (28.288 → 35.981 per day). Holdout trades 4167 → 5267 (27.778 → 35.111 per day).
Per coin, full sample then holdout: BTC/USD 991→1227 full, 378→461 holdout; ETH/USD 1091→1399 full, 421→532 holdout; SOL/USD 1109→1407 full, 420→530 holdout; BNB/USD 1010→1243 full, 375→467 holdout; XRP/USD 1106→1415 full, 450→587 holdout; DOGE/USD 1092→1419 full, 413→534 holdout; ADA/USD 1056→1357 full, 421→534 holdout; AVAX/USD 1094→1388 full, 437→549 holdout; LINK/USD 1059→1357 full, 438→552 holdout; LTC/USD 1000→1281 full, 414→521 holdout.
Full-sample win rate 65.21% → 63.38%. Average win 0.20% → 0.20% ($0.63 → $0.50). Average loss -1.21% → -1.15% (-$3.76 → -$2.85).
Holdout win rate 63.40% → 61.61%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.08%.
Train profit -$8,444.69 → -$9,107.16. Holdout profit -$7,053.33 → -$7,861.11. Holdout max drawdown 71.05% → 78.99%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 20. Holdout streak 13 → 17.
Exits, full sample, challenger: target 8552, stop 1, EMA 4940, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1375. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-24.317 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 13493 (28.288 → 35.981 per day). Holdout trades 4167 → 5267 (27.778 → 35.111 per day).
Per coin, full sample then holdout: BTC/USD 991→1227 full, 378→461 holdout; ETH/USD 1091→1399 full, 421→532 holdout; SOL/USD 1109→1407 full, 420→530 holdout; BNB/USD 1010→1243 full, 375→467 holdout; XRP/USD 1106→1415 full, 450→587 holdout; DOGE/USD 1092→1419 full, 413→534 holdout; ADA/USD 1056→1357 full, 421→534 holdout; AVAX/USD 1094→1388 full, 437→549 holdout; LINK/USD 1059→1357 full, 438→552 holdout; LTC/USD 1000→1281 full, 414→521 holdout.
Full-sample win rate 65.21% → 63.38%. Average win 0.41% → 0.41% ($2.54 → $2.20). Average loss -1.05% → -0.99% (-$6.51 → -$5.32).
Holdout win rate 63.40% → 61.61%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.92%.
Train profit -$4,603.85 → -$5,661.39. Holdout profit -$3,453.82 → -$4,161.48. Holdout max drawdown 36.65% → 43.50%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 20. Holdout streak 13 → 17.
Exits, full sample, challenger: target 8552, stop 1, EMA 4940, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0491. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-8.273 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 35 — 15m — REJECT — tangle_bars 3 → 1

- At: 2026-11-15T09:03:29.614Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: tangle_bars 3 → 1 (`092b22bb7068aee549a680014cdccc813dabce119ed6ec2236f05f3ddd131abd`).
- Parameter: `tangle_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: tangle_bars from 3 to 1. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,629.82 | 443 |
| ETH/USD | -$7,221.95 | 421 | -$7,855.98 | 504 |
| SOL/USD | -$7,586.52 | 420 | -$7,946.21 | 500 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,960.30 | 84.46% | 89.61% | -0.1074 | -0.1200 |
| holdout | -$7,053.33 | -$7,688.19 | 71.05% | 77.30% | -0.1191 | -0.1348 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$8,018.44 to -$7,303.19.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,888.49 (1050 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$2,227.41 (934 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$2,232.14 (868 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$2,193.02 (985 trades).

Full-sample trades: BTC/USD 991 → 1175, ETH/USD 1091 → 1322, SOL/USD 1109 → 1322.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1594 trades, profit -$2,379.97, mean trade -0.32%.
- bear: 880 trades, profit -$1,454.44, mean trade -0.35%.
- sideways: 2511 trades, profit -$3,853.78, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1175 (champion 991), ETH/USD 1322 (champion 1091), SOL/USD 1322 (champion 1109), BNB/USD 1186 (champion 1010), XRP/USD 1330 (champion 1106), DOGE/USD 1328 (champion 1092), ADA/USD 1285 (champion 1056), AVAX/USD 1300 (champion 1094), LINK/USD 1278 (champion 1059), LTC/USD 1199 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,960.30.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,688.19. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 89.61%, holdout 71.05% → 77.30%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1348 did not clear hurdle 0.0487 (z=-23.799, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 6 of 17 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1348, hurdle 0.0487, z=-23.799. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 12725 (28.288 → 33.933 per day). Holdout trades 4167 → 4985 (27.778 → 33.231 per day).
Per coin, full sample then holdout: BTC/USD 991→1175 full, 378→443 holdout; ETH/USD 1091→1322 full, 421→504 holdout; SOL/USD 1109→1322 full, 420→500 holdout; BNB/USD 1010→1186 full, 375→446 holdout; XRP/USD 1106→1330 full, 450→554 holdout; DOGE/USD 1092→1328 full, 413→504 holdout; ADA/USD 1056→1285 full, 421→507 holdout; AVAX/USD 1094→1300 full, 437→515 holdout; LINK/USD 1059→1278 full, 438→522 holdout; LTC/USD 1000→1199 full, 414→490 holdout.
Full-sample win rate 65.21% → 63.71%. Average win 0.20% → 0.20% ($0.63 → $0.53). Average loss -1.21% → -1.16% (-$3.76 → -$3.04).
Holdout win rate 63.40% → 61.89%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.10%.
Train profit -$8,444.69 → -$8,960.30. Holdout profit -$7,053.33 → -$7,688.19. Holdout max drawdown 71.05% → 77.30%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 18. Holdout streak 13 → 16.
Exits, full sample, challenger: target 8107, stop 1, EMA 4617, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1348. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-23.799 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 12725 (28.288 → 33.933 per day). Holdout trades 4167 → 4985 (27.778 → 33.231 per day).
Per coin, full sample then holdout: BTC/USD 991→1175 full, 378→443 holdout; ETH/USD 1091→1322 full, 421→504 holdout; SOL/USD 1109→1322 full, 420→500 holdout; BNB/USD 1010→1186 full, 375→446 holdout; XRP/USD 1106→1330 full, 450→554 holdout; DOGE/USD 1092→1328 full, 413→504 holdout; ADA/USD 1056→1285 full, 421→507 holdout; AVAX/USD 1094→1300 full, 437→515 holdout; LINK/USD 1059→1278 full, 438→522 holdout; LTC/USD 1000→1199 full, 414→490 holdout.
Full-sample win rate 65.21% → 63.71%. Average win 0.41% → 0.41% ($2.54 → $2.28). Average loss -1.05% → -1.00% (-$6.51 → -$5.58).
Holdout win rate 63.40% → 61.89%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.94%.
Train profit -$4,603.85 → -$5,391.62. Holdout profit -$3,453.82 → -$4,015.66. Holdout max drawdown 36.65% → 42.18%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 18. Holdout streak 13 → 16.
Exits, full sample, challenger: target 8107, stop 1, EMA 4617, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0484. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-8.171 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 36 — 15m — REJECT — tangle_bars 3 → 2

- At: 2026-11-15T09:03:29.614Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: tangle_bars 3 → 2 (`46c650ff098e2f521816484e0ca1eb4482329f0863dfd22d1d1717f123d11953`).
- Parameter: `tangle_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: tangle_bars from 3 to 2. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,185.80 | 407 |
| ETH/USD | -$7,221.95 | 421 | -$7,516.19 | 456 |
| SOL/USD | -$7,586.52 | 420 | -$7,552.47 | 456 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,728.96 | 84.46% | 87.30% | -0.1074 | -0.1132 |
| holdout | -$7,053.33 | -$7,314.22 | 71.05% | 73.62% | -0.1191 | -0.1253 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,662.95 to -$6,911.63.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,693.34 (956 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$2,052.40 (859 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,937.00 (774 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$2,120.87 (888 trades).

Full-sample trades: BTC/USD 991 → 1078, ETH/USD 1091 → 1192, SOL/USD 1109 → 1205.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1428 trades, profit -$2,222.66, mean trade -0.31%.
- bear: 814 trades, profit -$1,403.19, mean trade -0.35%.
- sideways: 2283 trades, profit -$3,688.37, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1078 (champion 991), ETH/USD 1192 (champion 1091), SOL/USD 1205 (champion 1109), BNB/USD 1094 (champion 1010), XRP/USD 1211 (champion 1106), DOGE/USD 1202 (champion 1092), ADA/USD 1152 (champion 1056), AVAX/USD 1182 (champion 1094), LINK/USD 1153 (champion 1059), LTC/USD 1093 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,728.96.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,314.22. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 87.30%, holdout 71.05% → 73.62%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1253 did not clear hurdle 0.0487 (z=-22.559, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 6 of 17 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1253, hurdle 0.0487, z=-22.559. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 11562 (28.288 → 30.832 per day). Holdout trades 4167 → 4525 (27.778 → 30.165 per day).
Per coin, full sample then holdout: BTC/USD 991→1078 full, 378→407 holdout; ETH/USD 1091→1192 full, 421→456 holdout; SOL/USD 1109→1205 full, 420→456 holdout; BNB/USD 1010→1094 full, 375→405 holdout; XRP/USD 1106→1211 full, 450→504 holdout; DOGE/USD 1092→1202 full, 413→451 holdout; ADA/USD 1056→1152 full, 421→450 holdout; AVAX/USD 1094→1182 full, 437→469 holdout; LINK/USD 1059→1153 full, 438→474 holdout; LTC/USD 1000→1093 full, 414→453 holdout.
Full-sample win rate 65.21% → 64.46%. Average win 0.20% → 0.20% ($0.63 → $0.57). Average loss -1.21% → -1.18% (-$3.76 → -$3.39).
Holdout win rate 63.40% → 62.78%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.12%.
Train profit -$8,444.69 → -$8,728.96. Holdout profit -$7,053.33 → -$7,314.22. Holdout max drawdown 71.05% → 73.62%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 14.
Exits, full sample, challenger: target 7453, stop 1, EMA 4108, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1253. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-22.559 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 11562 (28.288 → 30.832 per day). Holdout trades 4167 → 4525 (27.778 → 30.165 per day).
Per coin, full sample then holdout: BTC/USD 991→1078 full, 378→407 holdout; ETH/USD 1091→1192 full, 421→456 holdout; SOL/USD 1109→1205 full, 420→456 holdout; BNB/USD 1010→1094 full, 375→405 holdout; XRP/USD 1106→1211 full, 450→504 holdout; DOGE/USD 1092→1202 full, 413→451 holdout; ADA/USD 1056→1152 full, 421→450 holdout; AVAX/USD 1094→1182 full, 437→469 holdout; LINK/USD 1059→1153 full, 438→474 holdout; LTC/USD 1000→1093 full, 414→453 holdout.
Full-sample win rate 65.21% → 64.46%. Average win 0.41% → 0.41% ($2.54 → $2.40). Average loss -1.05% → -1.03% (-$6.51 → -$6.01).
Holdout win rate 63.40% → 62.78%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.96%.
Train profit -$4,603.85 → -$5,067.37. Holdout profit -$3,453.82 → -$3,618.61. Holdout max drawdown 36.65% → 38.27%.
Folds won 1 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 14.
Exits, full sample, challenger: target 7453, stop 1, EMA 4108, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0438. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-7.607 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 37 — 15m — REJECT — tangle_bars 3 → 5

- At: 2026-11-15T09:03:29.614Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: tangle_bars 3 → 5 (`0eedde3353a31d33840f9c0e853b5d5b2101ed9e18243473263a431399a07da9`).
- Parameter: `tangle_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: tangle_bars from 3 to 5. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$6,590.13 | 325 |
| ETH/USD | -$7,221.95 | 421 | -$6,888.43 | 370 |
| SOL/USD | -$7,586.52 | 420 | -$7,067.64 | 375 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,088.46 | 84.46% | 80.89% | -0.1074 | -0.1021 |
| holdout | -$7,053.33 | -$6,466.97 | 71.05% | 65.23% | -0.1191 | -0.1086 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$6,827.21 to -$6,027.94.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,159.87 (761 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,888.64 (701 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,635.42 (614 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,570.81 (706 trades).

Full-sample trades: BTC/USD 991 → 879, ETH/USD 1091 → 950, SOL/USD 1109 → 970.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1149 trades, profit -$2,170.86, mean trade -0.32%.
- bear: 657 trades, profit -$1,279.15, mean trade -0.35%.
- sideways: 1813 trades, profit -$3,016.97, mean trade -0.24%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 879 (champion 991), ETH/USD 950 (champion 1091), SOL/USD 970 (champion 1109), BNB/USD 895 (champion 1010), XRP/USD 960 (champion 1106), DOGE/USD 942 (champion 1092), ADA/USD 921 (champion 1056), AVAX/USD 934 (champion 1094), LINK/USD 914 (champion 1059), LTC/USD 855 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$8,088.46.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,466.97. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 80.89%, holdout 71.05% → 65.23%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1086 did not clear hurdle 0.0487 (z=-20.362, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 15 of 17 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1086, hurdle 0.0487, z=-20.362. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 9220 (28.288 → 24.587 per day). Holdout trades 4167 → 3619 (27.778 → 24.125 per day).
Per coin, full sample then holdout: BTC/USD 991→879 full, 378→325 holdout; ETH/USD 1091→950 full, 421→370 holdout; SOL/USD 1109→970 full, 420→375 holdout; BNB/USD 1010→895 full, 375→332 holdout; XRP/USD 1106→960 full, 450→397 holdout; DOGE/USD 1092→942 full, 413→357 holdout; ADA/USD 1056→921 full, 421→347 holdout; AVAX/USD 1094→934 full, 437→371 holdout; LINK/USD 1059→914 full, 438→384 holdout; LTC/USD 1000→855 full, 414→361 holdout.
Full-sample win rate 65.21% → 66.14%. Average win 0.20% → 0.20% ($0.63 → $0.68). Average loss -1.21% → -1.25% (-$3.76 → -$4.31).
Holdout win rate 63.40% → 64.91%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.19%.
Train profit -$8,444.69 → -$8,088.46. Holdout profit -$7,053.33 → -$6,466.97. Holdout max drawdown 71.05% → 65.23%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 19. Holdout streak 13 → 17.
Exits, full sample, challenger: target 6098, stop 1, EMA 3121, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1086. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-20.362 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 9220 (28.288 → 24.587 per day). Holdout trades 4167 → 3619 (27.778 → 24.125 per day).
Per coin, full sample then holdout: BTC/USD 991→879 full, 378→325 holdout; ETH/USD 1091→950 full, 421→370 holdout; SOL/USD 1109→970 full, 420→375 holdout; BNB/USD 1010→895 full, 375→332 holdout; XRP/USD 1106→960 full, 450→397 holdout; DOGE/USD 1092→942 full, 413→357 holdout; ADA/USD 1056→921 full, 421→347 holdout; AVAX/USD 1094→934 full, 437→371 holdout; LINK/USD 1059→914 full, 438→384 holdout; LTC/USD 1000→855 full, 414→361 holdout.
Full-sample win rate 65.21% → 66.14%. Average win 0.41% → 0.41% ($2.54 → $2.61). Average loss -1.05% → -1.10% (-$6.51 → -$7.03).
Holdout win rate 63.40% → 64.91%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.03%.
Train profit -$4,603.85 → -$4,352.26. Holdout profit -$3,453.82 → -$2,914.02. Holdout max drawdown 36.65% → 31.14%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 19. Holdout streak 13 → 17.
Exits, full sample, challenger: target 6098, stop 1, EMA 3121, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0367. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-6.729 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 38 — 15m — REJECT — tangle_bars 3 → 8

- At: 2026-11-15T09:03:29.615Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: tangle_bars 3 → 8 (`74f8215867168f6955147e8f8757cc9f9e79ce66274379829438ef867048fe07`).
- Parameter: `tangle_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: tangle_bars from 3 to 8. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$5,767.78 | 275 |
| ETH/USD | -$7,221.95 | 421 | -$5,981.82 | 308 |
| SOL/USD | -$7,586.52 | 420 | -$6,627.28 | 325 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$7,371.60 | 84.46% | 73.75% | -0.1074 | -0.0909 |
| holdout | -$7,053.33 | -$5,787.30 | 71.05% | 58.52% | -0.1191 | -0.0978 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$6,160.45 to -$5,344.78.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$1,896.45 (639 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,662.71 (584 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,359.11 (509 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,310.58 (619 trades).

Full-sample trades: BTC/USD 991 → 739, ETH/USD 1091 → 811, SOL/USD 1109 → 827.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 943 trades, profit -$1,837.55, mean trade -0.31%.
- bear: 570 trades, profit -$1,243.57, mean trade -0.35%.
- sideways: 1500 trades, profit -$2,706.18, mean trade -0.25%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 739 (champion 991), ETH/USD 811 (champion 1091), SOL/USD 827 (champion 1109), BNB/USD 755 (champion 1010), XRP/USD 805 (champion 1106), DOGE/USD 789 (champion 1092), ADA/USD 755 (champion 1056), AVAX/USD 778 (champion 1094), LINK/USD 745 (champion 1059), LTC/USD 711 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$7,371.60.
- pass `holdout`: Holdout profit -$7,053.33 → -$5,787.30. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 73.75%, holdout 71.05% → 58.52%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0978 did not clear hurdle 0.0487 (z=-19.069, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 15 of 16 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0978, hurdle 0.0487, z=-19.069. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 7715 (28.288 → 20.573 per day). Holdout trades 4167 → 3013 (27.778 → 20.085 per day).
Per coin, full sample then holdout: BTC/USD 991→739 full, 378→275 holdout; ETH/USD 1091→811 full, 421→308 holdout; SOL/USD 1109→827 full, 420→325 holdout; BNB/USD 1010→755 full, 375→287 holdout; XRP/USD 1106→805 full, 450→330 holdout; DOGE/USD 1092→789 full, 413→292 holdout; ADA/USD 1056→755 full, 421→280 holdout; AVAX/USD 1094→778 full, 437→307 holdout; LINK/USD 1059→745 full, 438→305 holdout; LTC/USD 1000→711 full, 414→304 holdout.
Full-sample win rate 65.21% → 67.35%. Average win 0.20% → 0.20% ($0.63 → $0.81). Average loss -1.21% → -1.29% (-$3.76 → -$5.20).
Holdout win rate 63.40% → 65.81%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.22%.
Train profit -$8,444.69 → -$7,371.60. Holdout profit -$7,053.33 → -$5,787.30. Holdout max drawdown 71.05% → 58.52%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 19. Holdout streak 13 → 19.
Exits, full sample, challenger: target 5196, stop 1, EMA 2518, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0978. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-19.069 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 7715 (28.288 → 20.573 per day). Holdout trades 4167 → 3013 (27.778 → 20.085 per day).
Per coin, full sample then holdout: BTC/USD 991→739 full, 378→275 holdout; ETH/USD 1091→811 full, 421→308 holdout; SOL/USD 1109→827 full, 420→325 holdout; BNB/USD 1010→755 full, 375→287 holdout; XRP/USD 1106→805 full, 450→330 holdout; DOGE/USD 1092→789 full, 413→292 holdout; ADA/USD 1056→755 full, 421→280 holdout; AVAX/USD 1094→778 full, 437→307 holdout; LINK/USD 1059→745 full, 438→305 holdout; LTC/USD 1000→711 full, 414→304 holdout.
Full-sample win rate 65.21% → 67.35%. Average win 0.41% → 0.41% ($2.54 → $2.92). Average loss -1.05% → -1.13% (-$6.51 → -$8.05).
Holdout win rate 63.40% → 65.81%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.07%.
Train profit -$4,603.85 → -$3,451.75. Holdout profit -$3,453.82 → -$2,469.95. Holdout max drawdown 36.65% → 26.69%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 19. Holdout streak 13 → 19.
Exits, full sample, challenger: target 5196, stop 1, EMA 2518, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0327. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-6.261 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 39 — 15m — REJECT — pivot_lookback 10 → 5

- At: 2026-11-15T09:03:29.615Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: pivot_lookback 10 → 5 (`d7ee386bff1adef71afcf8bce95daed844a4a18e1544fc3878c135e4de9bc453`).
- Parameter: `pivot_lookback`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: pivot_lookback from 10 to 5. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$6,743.58 | 336 |
| ETH/USD | -$7,221.95 | 421 | -$6,457.25 | 359 |
| SOL/USD | -$7,586.52 | 420 | -$6,552.04 | 347 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$7,891.21 | 84.46% | 78.96% | -0.1074 | -0.0988 |
| holdout | -$7,053.33 | -$6,311.50 | 71.05% | 63.71% | -0.1191 | -0.1082 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$6,735.32 to -$5,813.57.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,015.26 (740 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,876.62 (688 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,456.33 (581 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,640.07 (678 trades).

Full-sample trades: BTC/USD 991 → 866, ETH/USD 1091 → 947, SOL/USD 1109 → 909.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1081 trades, profit -$1,937.20, mean trade -0.30%.
- bear: 638 trades, profit -$1,320.91, mean trade -0.36%.
- sideways: 1765 trades, profit -$3,053.40, mean trade -0.25%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 866 (champion 991), ETH/USD 947 (champion 1091), SOL/USD 909 (champion 1109), BNB/USD 858 (champion 1010), XRP/USD 915 (champion 1106), DOGE/USD 917 (champion 1092), ADA/USD 830 (champion 1056), AVAX/USD 912 (champion 1094), LINK/USD 871 (champion 1059), LTC/USD 809 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$7,891.21.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,311.50. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 78.96%, holdout 71.05% → 63.71%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1082 did not clear hurdle 0.0487 (z=-20.461, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 14 of 16 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1082, hurdle 0.0487, z=-20.461. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 8834 (28.288 → 23.557 per day). Holdout trades 4167 → 3484 (27.778 → 23.225 per day).
Per coin, full sample then holdout: BTC/USD 991→866 full, 378→336 holdout; ETH/USD 1091→947 full, 421→359 holdout; SOL/USD 1109→909 full, 420→347 holdout; BNB/USD 1010→858 full, 375→326 holdout; XRP/USD 1106→915 full, 450→377 holdout; DOGE/USD 1092→917 full, 413→352 holdout; ADA/USD 1056→830 full, 421→334 holdout; AVAX/USD 1094→912 full, 437→365 holdout; LINK/USD 1059→871 full, 438→353 holdout; LTC/USD 1000→809 full, 414→335 holdout.
Full-sample win rate 65.21% → 65.43%. Average win 0.20% → 0.20% ($0.63 → $0.73). Average loss -1.21% → -1.21% (-$3.76 → -$4.39).
Holdout win rate 63.40% → 63.95%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.15%.
Train profit -$8,444.69 → -$7,891.21. Holdout profit -$7,053.33 → -$6,311.50. Holdout max drawdown 71.05% → 63.71%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 14. Holdout streak 13 → 12.
Exits, full sample, challenger: target 5780, stop 1, EMA 3053, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1082. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-20.461 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 8834 (28.288 → 23.557 per day). Holdout trades 4167 → 3484 (27.778 → 23.225 per day).
Per coin, full sample then holdout: BTC/USD 991→866 full, 378→336 holdout; ETH/USD 1091→947 full, 421→359 holdout; SOL/USD 1109→909 full, 420→347 holdout; BNB/USD 1010→858 full, 375→326 holdout; XRP/USD 1106→915 full, 450→377 holdout; DOGE/USD 1092→917 full, 413→352 holdout; ADA/USD 1056→830 full, 421→334 holdout; AVAX/USD 1094→912 full, 437→365 holdout; LINK/USD 1059→871 full, 438→353 holdout; LTC/USD 1000→809 full, 414→335 holdout.
Full-sample win rate 65.21% → 65.43%. Average win 0.41% → 0.41% ($2.54 → $2.73). Average loss -1.05% → -1.06% (-$6.51 → -$7.05).
Holdout win rate 63.40% → 63.95%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.99%.
Train profit -$4,603.85 → -$4,073.64. Holdout profit -$3,453.82 → -$2,803.78. Holdout max drawdown 36.65% → 30.08%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 14. Holdout streak 13 → 12.
Exits, full sample, challenger: target 5780, stop 1, EMA 3053, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0366. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-6.743 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 40 — 15m — REJECT — pivot_lookback 10 → 20

- At: 2026-11-15T09:03:29.615Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: pivot_lookback 10 → 20 (`1967dd4854178ee2daabb8263bbb3c50ac6ca752d7356d103b29a3a8e1bdbe26`).
- Parameter: `pivot_lookback`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: pivot_lookback from 10 to 20. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,235.72 | 420 |
| ETH/USD | -$7,221.95 | 421 | -$7,347.48 | 456 |
| SOL/USD | -$7,586.52 | 420 | -$7,488.88 | 476 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,793.16 | 84.46% | 87.94% | -0.1074 | -0.1109 |
| holdout | -$7,053.33 | -$7,378.79 | 71.05% | 74.24% | -0.1191 | -0.1245 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,707.79 to -$6,953.37.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,587.13 (977 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$2,140.97 (866 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,977.17 (811 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$2,254.34 (931 trades).

Full-sample trades: BTC/USD 991 → 1095, ETH/USD 1091 → 1202, SOL/USD 1109 → 1250.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1502 trades, profit -$2,228.91, mean trade -0.29%.
- bear: 856 trades, profit -$1,479.92, mean trade -0.35%.
- sideways: 2348 trades, profit -$3,669.96, mean trade -0.25%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1095 (champion 991), ETH/USD 1202 (champion 1091), SOL/USD 1250 (champion 1109), BNB/USD 1102 (champion 1010), XRP/USD 1232 (champion 1106), DOGE/USD 1233 (champion 1092), ADA/USD 1235 (champion 1056), AVAX/USD 1245 (champion 1094), LINK/USD 1212 (champion 1059), LTC/USD 1151 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,793.16.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,378.79. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 87.94%, holdout 71.05% → 74.24%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1245 did not clear hurdle 0.0487 (z=-22.390, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 6 of 17 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1245, hurdle 0.0487, z=-22.390. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 11957 (28.288 → 31.885 per day). Holdout trades 4167 → 4706 (27.778 → 31.371 per day).
Per coin, full sample then holdout: BTC/USD 991→1095 full, 378→420 holdout; ETH/USD 1091→1202 full, 421→456 holdout; SOL/USD 1109→1250 full, 420→476 holdout; BNB/USD 1010→1102 full, 375→416 holdout; XRP/USD 1106→1232 full, 450→488 holdout; DOGE/USD 1092→1233 full, 413→470 holdout; ADA/USD 1056→1235 full, 421→496 holdout; AVAX/USD 1094→1245 full, 437→497 holdout; LINK/USD 1059→1212 full, 438→505 holdout; LTC/USD 1000→1151 full, 414→482 holdout.
Full-sample win rate 65.21% → 65.13%. Average win 0.20% → 0.20% ($0.63 → $0.55). Average loss -1.21% → -1.20% (-$3.76 → -$3.36).
Holdout win rate 63.40% → 63.71%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.13%.
Train profit -$8,444.69 → -$8,793.16. Holdout profit -$7,053.33 → -$7,378.79. Holdout max drawdown 71.05% → 74.24%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 15.
Exits, full sample, challenger: target 7788, stop 1, EMA 4168, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1245. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-22.390 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 11957 (28.288 → 31.885 per day). Holdout trades 4167 → 4706 (27.778 → 31.371 per day).
Per coin, full sample then holdout: BTC/USD 991→1095 full, 378→420 holdout; ETH/USD 1091→1202 full, 421→456 holdout; SOL/USD 1109→1250 full, 420→476 holdout; BNB/USD 1010→1102 full, 375→416 holdout; XRP/USD 1106→1232 full, 450→488 holdout; DOGE/USD 1092→1233 full, 413→470 holdout; ADA/USD 1056→1235 full, 421→496 holdout; AVAX/USD 1094→1245 full, 437→497 holdout; LINK/USD 1059→1212 full, 438→505 holdout; LTC/USD 1000→1151 full, 414→482 holdout.
Full-sample win rate 65.21% → 65.13%. Average win 0.41% → 0.41% ($2.54 → $2.37). Average loss -1.05% → -1.04% (-$6.51 → -$6.07).
Holdout win rate 63.40% → 63.71%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.98%.
Train profit -$4,603.85 → -$5,109.48. Holdout profit -$3,453.82 → -$3,538.32. Holdout max drawdown 36.65% → 37.52%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 15.
Exits, full sample, challenger: target 7788, stop 1, EMA 4168, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0415. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe. z=-7.303 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 41 — 15m — REJECT — pivot_lookback 10 → 30

- At: 2026-11-15T09:03:29.616Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: pivot_lookback 10 → 30 (`f2f7c3672f94f90681cb50e98df2c77a15c6595c887ca80694a64bee3723f787`).
- Parameter: `pivot_lookback`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: pivot_lookback from 10 to 30. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,433.20 | 441 |
| ETH/USD | -$7,221.95 | 421 | -$7,376.63 | 476 |
| SOL/USD | -$7,586.52 | 420 | -$7,850.75 | 517 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,917.08 | 84.46% | 89.17% | -0.1074 | -0.1123 |
| holdout | -$7,053.33 | -$7,661.14 | 71.05% | 77.00% | -0.1191 | -0.1311 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,964.70 to -$7,280.55.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,705.58 (1025 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$2,317.26 (918 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$2,141.74 (850 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$2,378.90 (981 trades).

Full-sample trades: BTC/USD 991 → 1148, ETH/USD 1091 → 1257, SOL/USD 1109 → 1331.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1611 trades, profit -$2,366.98, mean trade -0.30%.
- bear: 912 trades, profit -$1,509.88, mean trade -0.35%.
- sideways: 2480 trades, profit -$3,784.28, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1148 (champion 991), ETH/USD 1257 (champion 1091), SOL/USD 1331 (champion 1109), BNB/USD 1152 (champion 1010), XRP/USD 1294 (champion 1106), DOGE/USD 1294 (champion 1092), ADA/USD 1308 (champion 1056), AVAX/USD 1326 (champion 1094), LINK/USD 1290 (champion 1059), LTC/USD 1244 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,917.08.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,661.14. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 89.17%, holdout 71.05% → 77.00%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1311 did not clear hurdle 0.0487 (z=-23.054, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 4 of 16 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1311, hurdle 0.0487, z=-23.054. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 12644 (28.288 → 33.717 per day). Holdout trades 4167 → 5003 (27.778 → 33.351 per day).
Per coin, full sample then holdout: BTC/USD 991→1148 full, 378→441 holdout; ETH/USD 1091→1257 full, 421→476 holdout; SOL/USD 1109→1331 full, 420→517 holdout; BNB/USD 1010→1152 full, 375→438 holdout; XRP/USD 1106→1294 full, 450→516 holdout; DOGE/USD 1092→1294 full, 413→490 holdout; ADA/USD 1056→1308 full, 421→530 holdout; AVAX/USD 1094→1326 full, 437→541 holdout; LINK/USD 1059→1290 full, 438→539 holdout; LTC/USD 1000→1244 full, 414→515 holdout.
Full-sample win rate 65.21% → 64.80%. Average win 0.20% → 0.20% ($0.63 → $0.54). Average loss -1.21% → -1.19% (-$3.76 → -$3.18).
Holdout win rate 63.40% → 63.16%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.13%.
Train profit -$8,444.69 → -$8,917.08. Holdout profit -$7,053.33 → -$7,661.14. Holdout max drawdown 71.05% → 77.00%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 19. Holdout streak 13 → 19.
Exits, full sample, challenger: target 8193, stop 1, EMA 4450, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1311. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-23.054 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 12644 (28.288 → 33.717 per day). Holdout trades 4167 → 5003 (27.778 → 33.351 per day).
Per coin, full sample then holdout: BTC/USD 991→1148 full, 378→441 holdout; ETH/USD 1091→1257 full, 421→476 holdout; SOL/USD 1109→1331 full, 420→517 holdout; BNB/USD 1010→1152 full, 375→438 holdout; XRP/USD 1106→1294 full, 450→516 holdout; DOGE/USD 1092→1294 full, 413→490 holdout; ADA/USD 1056→1308 full, 421→530 holdout; AVAX/USD 1094→1326 full, 437→541 holdout; LINK/USD 1059→1290 full, 438→539 holdout; LTC/USD 1000→1244 full, 414→515 holdout.
Full-sample win rate 65.21% → 64.80%. Average win 0.41% → 0.41% ($2.54 → $2.33). Average loss -1.05% → -1.04% (-$6.51 → -$5.89).
Holdout win rate 63.40% → 63.16%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.97%.
Train profit -$4,603.85 → -$5,272.22. Holdout profit -$3,453.82 → -$3,905.21. Holdout max drawdown 36.65% → 40.96%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 19. Holdout streak 13 → 19.
Exits, full sample, challenger: target 8193, stop 1, EMA 4450, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0456. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-7.823 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 42 — 15m — REJECT — pivot_wing 1 → 2

- At: 2026-11-15T09:03:29.616Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: pivot_wing 1 → 2 (`d7046d1a6f2f3756e502c67c42c1b040958ad29a78203eb40562236b377b8685`).
- Parameter: `pivot_wing`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: pivot_wing from 1 to 2. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$5,990.07 | 281 |
| ETH/USD | -$7,221.95 | 421 | -$6,514.51 | 332 |
| SOL/USD | -$7,586.52 | 420 | -$6,269.08 | 321 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$7,500.38 | 84.46% | 75.01% | -0.1074 | -0.0981 |
| holdout | -$7,053.33 | -$6,045.76 | 71.05% | 60.87% | -0.1191 | -0.1044 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$6,553.90 to -$5,492.08.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$1,817.56 (624 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,319.47 (605 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,448.97 (519 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,649.32 (613 trades).

Full-sample trades: BTC/USD 991 → 749, ETH/USD 1091 → 845, SOL/USD 1109 → 828.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 977 trades, profit -$2,184.17, mean trade -0.36%.
- bear: 530 trades, profit -$1,144.68, mean trade -0.38%.
- sideways: 1532 trades, profit -$2,716.92, mean trade -0.24%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 749 (champion 991), ETH/USD 845 (champion 1091), SOL/USD 828 (champion 1109), BNB/USD 750 (champion 1010), XRP/USD 796 (champion 1106), DOGE/USD 811 (champion 1092), ADA/USD 732 (champion 1056), AVAX/USD 786 (champion 1094), LINK/USD 765 (champion 1059), LTC/USD 724 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$7,500.38.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,045.76. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 75.01%, holdout 71.05% → 60.87%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1044 did not clear hurdle 0.0487 (z=-17.442, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 16 of 18 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1044, hurdle 0.0487, z=-17.442. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 7786 (28.288 → 20.763 per day). Holdout trades 4167 → 3039 (27.778 → 20.259 per day).
Per coin, full sample then holdout: BTC/USD 991→749 full, 378→281 holdout; ETH/USD 1091→845 full, 421→332 holdout; SOL/USD 1109→828 full, 420→321 holdout; BNB/USD 1010→750 full, 375→288 holdout; XRP/USD 1106→796 full, 450→324 holdout; DOGE/USD 1092→811 full, 413→299 holdout; ADA/USD 1056→732 full, 421→277 holdout; AVAX/USD 1094→786 full, 437→310 holdout; LINK/USD 1059→765 full, 438→306 holdout; LTC/USD 1000→724 full, 414→301 holdout.
Full-sample win rate 65.21% → 65.13%. Average win 0.20% → 0.20% ($0.63 → $0.79). Average loss -1.21% → -1.23% (-$3.76 → -$4.79).
Holdout win rate 63.40% → 63.18%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.17%.
Train profit -$8,444.69 → -$7,500.38. Holdout profit -$7,053.33 → -$6,045.76. Holdout max drawdown 71.05% → 60.87%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 14. Holdout streak 13 → 14.
Exits, full sample, challenger: target 5071, stop 2, EMA 2713, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1044. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-17.442 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 7786 (28.288 → 20.763 per day). Holdout trades 4167 → 3039 (27.778 → 20.259 per day).
Per coin, full sample then holdout: BTC/USD 991→749 full, 378→281 holdout; ETH/USD 1091→845 full, 421→332 holdout; SOL/USD 1109→828 full, 420→321 holdout; BNB/USD 1010→750 full, 375→288 holdout; XRP/USD 1106→796 full, 450→324 holdout; DOGE/USD 1092→811 full, 413→299 holdout; ADA/USD 1056→732 full, 421→277 holdout; AVAX/USD 1094→786 full, 437→310 holdout; LINK/USD 1059→765 full, 438→306 holdout; LTC/USD 1000→724 full, 414→301 holdout.
Full-sample win rate 65.21% → 65.14%. Average win 0.41% → 0.41% ($2.54 → $2.82). Average loss -1.05% → -1.07% (-$6.51 → -$7.33).
Holdout win rate 63.40% → 63.21%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.01%.
Train profit -$4,603.85 → -$3,747.27. Holdout profit -$3,453.82 → -$2,925.79. Holdout max drawdown 36.65% → 30.81%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 14. Holdout streak 13 → 14.
Exits, full sample, challenger: target 5071, stop 2, EMA 2713, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0399. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-7.686 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 43 — 15m — REJECT — pivot_wing 1 → 3

- At: 2026-11-15T09:03:29.616Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: pivot_wing 1 → 3 (`b0579eb6b54cff979dc9e51bd61cdcd9ead094dfcb8018204ccfe7cddd256c5c`).
- Parameter: `pivot_wing`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: pivot_wing from 1 to 3. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$4,965.30 | 211 |
| ETH/USD | -$7,221.95 | 421 | -$5,406.36 | 242 |
| SOL/USD | -$7,586.52 | 420 | -$5,512.16 | 246 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$6,307.85 | 84.46% | 63.10% | -0.1074 | -0.0866 |
| holdout | -$7,053.33 | -$4,992.61 | 71.05% | 50.31% | -0.1191 | -0.0912 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$5,568.72 to -$4,358.19.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$1,425.75 (444 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,047.46 (451 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,050.13 (384 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,134.49 (440 trades).

Full-sample trades: BTC/USD 991 → 562, ETH/USD 1091 → 613, SOL/USD 1109 → 624.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 709 trades, profit -$1,972.35, mean trade -0.39%.
- bear: 363 trades, profit -$872.57, mean trade -0.39%.
- sideways: 1131 trades, profit -$2,147.69, mean trade -0.24%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 562 (champion 991), ETH/USD 613 (champion 1091), SOL/USD 624 (champion 1109), BNB/USD 570 (champion 1010), XRP/USD 574 (champion 1106), DOGE/USD 583 (champion 1092), ADA/USD 513 (champion 1056), AVAX/USD 556 (champion 1094), LINK/USD 562 (champion 1059), LTC/USD 504 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$6,307.85.
- pass `holdout`: Holdout profit -$7,053.33 → -$4,992.61. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 63.10%, holdout 71.05% → 50.31%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0912 did not clear hurdle 0.0487 (z=-15.167, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 17 of 17 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0912, hurdle 0.0487, z=-15.167. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 5661 (28.288 → 15.096 per day). Holdout trades 4167 → 2203 (27.778 → 14.686 per day).
Per coin, full sample then holdout: BTC/USD 991→562 full, 378→211 holdout; ETH/USD 1091→613 full, 421→242 holdout; SOL/USD 1109→624 full, 420→246 holdout; BNB/USD 1010→570 full, 375→224 holdout; XRP/USD 1106→574 full, 450→237 holdout; DOGE/USD 1092→583 full, 413→213 holdout; ADA/USD 1056→513 full, 421→195 holdout; AVAX/USD 1094→556 full, 437→207 holdout; LINK/USD 1059→562 full, 438→225 holdout; LTC/USD 1000→504 full, 414→203 holdout.
Full-sample win rate 65.21% → 65.34%. Average win 0.20% → 0.20% ($0.63 → $0.99). Average loss -1.21% → -1.24% (-$3.76 → -$6.02).
Holdout win rate 63.40% → 62.78%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.18%.
Train profit -$8,444.69 → -$6,307.85. Holdout profit -$7,053.33 → -$4,992.61. Holdout max drawdown 71.05% → 50.31%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 12.
Exits, full sample, challenger: target 3699, stop 2, EMA 1960, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0912. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-15.167 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 5661 (28.288 → 15.096 per day). Holdout trades 4167 → 2203 (27.778 → 14.686 per day).
Per coin, full sample then holdout: BTC/USD 991→562 full, 378→211 holdout; ETH/USD 1091→613 full, 421→242 holdout; SOL/USD 1109→624 full, 420→246 holdout; BNB/USD 1010→570 full, 375→224 holdout; XRP/USD 1106→574 full, 450→237 holdout; DOGE/USD 1092→583 full, 413→213 holdout; ADA/USD 1056→513 full, 421→195 holdout; AVAX/USD 1094→556 full, 437→207 holdout; LINK/USD 1059→562 full, 438→225 holdout; LTC/USD 1000→504 full, 414→203 holdout.
Full-sample win rate 65.21% → 65.36%. Average win 0.41% → 0.41% ($2.54 → $3.15). Average loss -1.05% → -1.08% (-$6.51 → -$8.24).
Holdout win rate 63.40% → 62.82%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.02%.
Train profit -$4,603.85 → -$2,792.43. Holdout profit -$3,453.82 → -$2,370.11. Holdout max drawdown 36.65% → 24.87%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 12.
Exits, full sample, challenger: target 3699, stop 2, EMA 1960, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0366. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-7.538 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 44 — 15m — REJECT — ma_slope_bars 3 → 1

- At: 2026-11-15T09:03:29.617Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: ma_slope_bars 3 → 1 (`8e6551b4ec331ba1c2ed0c6f8f5a6b63090814081459f8cc4cfbdae966161b07`).
- Parameter: `ma_slope_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: ma_slope_bars from 3 to 1. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$6,765.72 | 349 |
| ETH/USD | -$7,221.95 | 421 | -$7,152.72 | 410 |
| SOL/USD | -$7,586.52 | 420 | -$7,573.78 | 416 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,399.97 | 84.46% | 84.02% | -0.1074 | -0.1060 |
| holdout | -$7,053.33 | -$6,946.03 | 71.05% | 70.00% | -0.1191 | -0.1159 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,325.56 to -$6,510.34.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,410.83 (871 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,936.17 (775 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,756.31 (690 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,887.65 (805 trades).

Full-sample trades: BTC/USD 991 → 942, ETH/USD 1091 → 1064, SOL/USD 1109 → 1099.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1288 trades, profit -$2,226.32, mean trade -0.32%.
- bear: 743 trades, profit -$1,367.52, mean trade -0.35%.
- sideways: 2036 trades, profit -$3,352.18, mean trade -0.25%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 942 (champion 991), ETH/USD 1064 (champion 1091), SOL/USD 1099 (champion 1109), BNB/USD 976 (champion 1010), XRP/USD 1078 (champion 1106), DOGE/USD 1072 (champion 1092), ADA/USD 1052 (champion 1056), AVAX/USD 1090 (champion 1094), LINK/USD 1051 (champion 1059), LTC/USD 988 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$8,399.97.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,946.03. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 84.02%, holdout 71.05% → 70.00%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1159 did not clear hurdle 0.0487 (z=-21.345, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 11 of 16 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1159, hurdle 0.0487, z=-21.345. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10412 (28.288 → 27.765 per day). Holdout trades 4167 → 4067 (27.778 → 27.111 per day).
Per coin, full sample then holdout: BTC/USD 991→942 full, 378→349 holdout; ETH/USD 1091→1064 full, 421→410 holdout; SOL/USD 1109→1099 full, 420→416 holdout; BNB/USD 1010→976 full, 375→360 holdout; XRP/USD 1106→1078 full, 450→434 holdout; DOGE/USD 1092→1072 full, 413→398 holdout; ADA/USD 1056→1052 full, 421→420 holdout; AVAX/USD 1094→1090 full, 437→436 holdout; LINK/USD 1059→1051 full, 438→436 holdout; LTC/USD 1000→988 full, 414→408 holdout.
Full-sample win rate 65.21% → 65.93%. Average win 0.20% → 0.20% ($0.63 → $0.63). Average loss -1.21% → -1.24% (-$3.76 → -$3.91).
Holdout win rate 63.40% → 64.42%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.18%.
Train profit -$8,444.69 → -$8,399.97. Holdout profit -$7,053.33 → -$6,946.03. Holdout max drawdown 71.05% → 70.00%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6865, stop 1, EMA 3546, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1159. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-21.345 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10412 (28.288 → 27.765 per day). Holdout trades 4167 → 4067 (27.778 → 27.111 per day).
Per coin, full sample then holdout: BTC/USD 991→942 full, 378→349 holdout; ETH/USD 1091→1064 full, 421→410 holdout; SOL/USD 1109→1099 full, 420→416 holdout; BNB/USD 1010→976 full, 375→360 holdout; XRP/USD 1106→1078 full, 450→434 holdout; DOGE/USD 1092→1072 full, 413→398 holdout; ADA/USD 1056→1052 full, 421→420 holdout; AVAX/USD 1094→1090 full, 437→436 holdout; LINK/USD 1059→1051 full, 438→436 holdout; LTC/USD 1000→988 full, 414→408 holdout.
Full-sample win rate 65.21% → 65.93%. Average win 0.41% → 0.41% ($2.54 → $2.57). Average loss -1.05% → -1.08% (-$6.51 → -$6.76).
Holdout win rate 63.40% → 64.42%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.02%.
Train profit -$4,603.85 → -$4,541.62. Holdout profit -$3,453.82 → -$3,330.25. Holdout max drawdown 36.65% → 35.48%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6865, stop 1, EMA 3546, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0405. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-7.200 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 45 — 15m — REJECT — ma_slope_bars 3 → 5

- At: 2026-11-15T09:03:29.617Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: ma_slope_bars 3 → 5 (`dc86d88fcf2f7d591b3d0a0e53ab58728e94733bbe84ae538a15b11d081a87a7`).
- Parameter: `ma_slope_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: ma_slope_bars from 3 to 5. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,010.24 | 379 |
| ETH/USD | -$7,221.95 | 421 | -$7,249.00 | 423 |
| SOL/USD | -$7,586.52 | 420 | -$7,587.53 | 420 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,443.86 | 84.46% | 84.46% | -0.1074 | -0.1074 |
| holdout | -$7,053.33 | -$7,051.40 | 71.05% | 71.04% | -0.1191 | -0.1190 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,406.89 to -$6,635.57.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,411.16 (874 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,949.74 (788 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,828.96 (716 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,920.13 (817 trades).

Full-sample trades: BTC/USD 991 → 996, ETH/USD 1091 → 1093, SOL/USD 1109 → 1108.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1316 trades, profit -$2,242.69, mean trade -0.32%.
- bear: 752 trades, profit -$1,382.86, mean trade -0.36%.
- sideways: 2099 trades, profit -$3,425.85, mean trade -0.25%.

### Verdict

Rejected. Failed gates: walk-forward, deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 996 (champion 991), ETH/USD 1093 (champion 1091), SOL/USD 1108 (champion 1109), BNB/USD 1014 (champion 1010), XRP/USD 1102 (champion 1106), DOGE/USD 1090 (champion 1092), ADA/USD 1056 (champion 1056), AVAX/USD 1094 (champion 1094), LINK/USD 1058 (champion 1059), LTC/USD 998 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$8,443.86.
- pass `holdout`: Holdout profit -$7,053.33 → -$7,051.40. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 2 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 84.46%, holdout 71.05% → 71.04%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1190 did not clear hurdle 0.0487 (z=-21.754, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 10 of 17 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1190, hurdle 0.0487, z=-21.754. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10609 (28.288 → 28.291 per day). Holdout trades 4167 → 4167 (27.778 → 27.778 per day).
Per coin, full sample then holdout: BTC/USD 991→996 full, 378→379 holdout; ETH/USD 1091→1093 full, 421→423 holdout; SOL/USD 1109→1108 full, 420→420 holdout; BNB/USD 1010→1014 full, 375→377 holdout; XRP/USD 1106→1102 full, 450→447 holdout; DOGE/USD 1092→1090 full, 413→413 holdout; ADA/USD 1056→1056 full, 421→421 holdout; AVAX/USD 1094→1094 full, 437→435 holdout; LINK/USD 1059→1058 full, 438→438 holdout; LTC/USD 1000→998 full, 414→414 holdout.
Full-sample win rate 65.21% → 65.21%. Average win 0.20% → 0.20% ($0.63 → $0.63). Average loss -1.21% → -1.21% (-$3.76 → -$3.76).
Holdout win rate 63.40% → 63.40%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.15%.
Train profit -$8,444.69 → -$8,443.86. Holdout profit -$7,053.33 → -$7,051.40. Holdout max drawdown 71.05% → 71.04%.
Folds won 2 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6918, stop 1, EMA 3690, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1190. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: walk-forward, deflated-sharpe. z=-21.754 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10609 (28.288 → 28.291 per day). Holdout trades 4167 → 4167 (27.778 → 27.778 per day).
Per coin, full sample then holdout: BTC/USD 991→996 full, 378→379 holdout; ETH/USD 1091→1093 full, 421→423 holdout; SOL/USD 1109→1108 full, 420→420 holdout; BNB/USD 1010→1014 full, 375→377 holdout; XRP/USD 1106→1102 full, 450→447 holdout; DOGE/USD 1092→1090 full, 413→413 holdout; ADA/USD 1056→1056 full, 421→421 holdout; AVAX/USD 1094→1094 full, 437→435 holdout; LINK/USD 1059→1058 full, 438→438 holdout; LTC/USD 1000→998 full, 414→414 holdout.
Full-sample win rate 65.21% → 65.21%. Average win 0.41% → 0.41% ($2.54 → $2.54). Average loss -1.05% → -1.05% (-$6.51 → -$6.52).
Holdout win rate 63.40% → 63.40%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.99%.
Train profit -$4,603.85 → -$4,600.11. Holdout profit -$3,453.82 → -$3,449.51. Holdout max drawdown 36.65% → 36.61%.
Folds won 2 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6918, stop 1, EMA 3690, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0422. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: walk-forward, deflated-sharpe. z=-7.414 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; fail walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 46 — 15m — REJECT — ma_slope_bars 3 → 8

- At: 2026-11-15T09:03:29.617Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: ma_slope_bars 3 → 8 (`202b4030e8c8dc2795d5bae10a76d74166d1ff12da8dde9a8edb1f206057394d`).
- Parameter: `ma_slope_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: ma_slope_bars from 3 to 8. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,106.09 | 371 |
| ETH/USD | -$7,221.95 | 421 | -$7,133.29 | 412 |
| SOL/USD | -$7,586.52 | 420 | -$7,548.60 | 416 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,361.20 | 84.46% | 83.63% | -0.1074 | -0.1056 |
| holdout | -$7,053.33 | -$6,999.04 | 71.05% | 70.52% | -0.1191 | -0.1183 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,355.89 to -$6,578.36.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,375.05 (859 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,904.55 (769 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,775.22 (698 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,803.46 (787 trades).

Full-sample trades: BTC/USD 991 → 978, ETH/USD 1091 → 1059, SOL/USD 1109 → 1079.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1296 trades, profit -$2,253.82, mean trade -0.32%.
- bear: 741 trades, profit -$1,363.34, mean trade -0.35%.
- sideways: 2061 trades, profit -$3,381.88, mean trade -0.25%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 978 (champion 991), ETH/USD 1059 (champion 1091), SOL/USD 1079 (champion 1109), BNB/USD 990 (champion 1010), XRP/USD 1084 (champion 1106), DOGE/USD 1070 (champion 1092), ADA/USD 1033 (champion 1056), AVAX/USD 1072 (champion 1094), LINK/USD 1036 (champion 1059), LTC/USD 978 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$8,361.20.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,999.04. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 83.63%, holdout 71.05% → 70.52%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1183 did not clear hurdle 0.0487 (z=-21.663, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 12 of 16 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1183, hurdle 0.0487, z=-21.663. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10379 (28.288 → 27.677 per day). Holdout trades 4167 → 4098 (27.778 → 27.318 per day).
Per coin, full sample then holdout: BTC/USD 991→978 full, 378→371 holdout; ETH/USD 1091→1059 full, 421→412 holdout; SOL/USD 1109→1079 full, 420→416 holdout; BNB/USD 1010→990 full, 375→371 holdout; XRP/USD 1106→1084 full, 450→443 holdout; DOGE/USD 1092→1070 full, 413→409 holdout; ADA/USD 1056→1033 full, 421→410 holdout; AVAX/USD 1094→1072 full, 437→433 holdout; LINK/USD 1059→1036 full, 438→428 holdout; LTC/USD 1000→978 full, 414→405 holdout.
Full-sample win rate 65.21% → 65.49%. Average win 0.20% → 0.20% ($0.63 → $0.64). Average loss -1.21% → -1.22% (-$3.76 → -$3.86).
Holdout win rate 63.40% → 63.49%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.15%.
Train profit -$8,444.69 → -$8,361.20. Holdout profit -$7,053.33 → -$6,999.04. Holdout max drawdown 71.05% → 70.52%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6797, stop 1, EMA 3581, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1183. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-21.663 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10379 (28.288 → 27.677 per day). Holdout trades 4167 → 4098 (27.778 → 27.318 per day).
Per coin, full sample then holdout: BTC/USD 991→978 full, 378→371 holdout; ETH/USD 1091→1059 full, 421→412 holdout; SOL/USD 1109→1079 full, 420→416 holdout; BNB/USD 1010→990 full, 375→371 holdout; XRP/USD 1106→1084 full, 450→443 holdout; DOGE/USD 1092→1070 full, 413→409 holdout; ADA/USD 1056→1033 full, 421→410 holdout; AVAX/USD 1094→1072 full, 437→433 holdout; LINK/USD 1059→1036 full, 438→428 holdout; LTC/USD 1000→978 full, 414→405 holdout.
Full-sample win rate 65.21% → 65.49%. Average win 0.41% → 0.41% ($2.54 → $2.57). Average loss -1.05% → -1.06% (-$6.51 → -$6.65).
Holdout win rate 63.40% → 63.49%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.99%.
Train profit -$4,603.85 → -$4,479.99. Holdout profit -$3,453.82 → -$3,419.58. Holdout max drawdown 36.65% → 36.35%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6797, stop 1, EMA 3581, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0421. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-7.402 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 47 — 15m — REJECT — flat_slope_pct 0.0001 → 0

- At: 2026-11-15T09:03:29.617Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: flat_slope_pct 0.0001 → 0 (`300e826684f790a6df9630be6ff2269fbe891867ed066d72ad57b2c7afb74a46`).
- Parameter: `flat_slope_pct`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: flat_slope_pct from 0.0001 to 0. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,073.88 | 385 |
| ETH/USD | -$7,221.95 | 421 | -$7,246.50 | 426 |
| SOL/USD | -$7,586.52 | 420 | -$7,586.52 | 420 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,453.52 | 84.46% | 84.55% | -0.1074 | -0.1077 |
| holdout | -$7,053.33 | -$7,064.04 | 71.05% | 71.16% | -0.1191 | -0.1194 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,410.76 to -$6,650.25.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,416.55 (875 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,956.46 (789 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,828.96 (716 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,928.13 (819 trades).

Full-sample trades: BTC/USD 991 → 1005, ETH/USD 1091 → 1098, SOL/USD 1109 → 1109.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1318 trades, profit -$2,237.09, mean trade -0.32%.
- bear: 753 trades, profit -$1,378.45, mean trade -0.35%.
- sideways: 2112 trades, profit -$3,448.49, mean trade -0.25%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1005 (champion 991), ETH/USD 1098 (champion 1091), SOL/USD 1109 (champion 1109), BNB/USD 1016 (champion 1010), XRP/USD 1107 (champion 1106), DOGE/USD 1092 (champion 1092), ADA/USD 1056 (champion 1056), AVAX/USD 1097 (champion 1094), LINK/USD 1059 (champion 1059), LTC/USD 1000 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,453.52.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,064.04. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 84.55%, holdout 71.05% → 71.16%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1194 did not clear hurdle 0.0487 (z=-21.802, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 8 of 16 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1194, hurdle 0.0487, z=-21.802. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10639 (28.288 → 28.371 per day). Holdout trades 4167 → 4183 (27.778 → 27.885 per day).
Per coin, full sample then holdout: BTC/USD 991→1005 full, 378→385 holdout; ETH/USD 1091→1098 full, 421→426 holdout; SOL/USD 1109→1109 full, 420→420 holdout; BNB/USD 1010→1016 full, 375→379 holdout; XRP/USD 1106→1107 full, 450→450 holdout; DOGE/USD 1092→1092 full, 413→413 holdout; ADA/USD 1056→1056 full, 421→421 holdout; AVAX/USD 1094→1097 full, 437→437 holdout; LINK/USD 1059→1059 full, 438→438 holdout; LTC/USD 1000→1000 full, 414→414 holdout.
Full-sample win rate 65.21% → 65.09%. Average win 0.20% → 0.20% ($0.63 → $0.62). Average loss -1.21% → -1.21% (-$3.76 → -$3.73).
Holdout win rate 63.40% → 63.28%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.14%.
Train profit -$8,444.69 → -$8,453.52. Holdout profit -$7,053.33 → -$7,064.04. Holdout max drawdown 71.05% → 71.16%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6925, stop 1, EMA 3713, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1194. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-21.802 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10639 (28.288 → 28.371 per day). Holdout trades 4167 → 4183 (27.778 → 27.885 per day).
Per coin, full sample then holdout: BTC/USD 991→1005 full, 378→385 holdout; ETH/USD 1091→1098 full, 421→426 holdout; SOL/USD 1109→1109 full, 420→420 holdout; BNB/USD 1010→1016 full, 375→379 holdout; XRP/USD 1106→1107 full, 450→450 holdout; DOGE/USD 1092→1092 full, 413→413 holdout; ADA/USD 1056→1056 full, 421→421 holdout; AVAX/USD 1094→1097 full, 437→437 holdout; LINK/USD 1059→1059 full, 438→438 holdout; LTC/USD 1000→1000 full, 414→414 holdout.
Full-sample win rate 65.21% → 65.09%. Average win 0.41% → 0.41% ($2.54 → $2.53). Average loss -1.05% → -1.05% (-$6.51 → -$6.47).
Holdout win rate 63.40% → 63.28%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.98%.
Train profit -$4,603.85 → -$4,621.09. Holdout profit -$3,453.82 → -$3,459.25. Holdout max drawdown 36.65% → 36.70%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6925, stop 1, EMA 3713, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0424. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-7.432 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 48 — 15m — REJECT — flat_slope_pct 0.0001 → 0.00005

- At: 2026-11-15T09:03:29.618Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: flat_slope_pct 0.0001 → 0.00005 (`a04d3f3da8f407d20ab4a24bd496e9b93a32b82511e2fa67826ca1631e177592`).
- Parameter: `flat_slope_pct`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: flat_slope_pct from 0.0001 to 0.00005. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,063.99 | 384 |
| ETH/USD | -$7,221.95 | 421 | -$7,250.56 | 426 |
| SOL/USD | -$7,586.52 | 420 | -$7,586.52 | 420 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,453.44 | 84.46% | 84.55% | -0.1074 | -0.1077 |
| holdout | -$7,053.33 | -$7,063.48 | 71.05% | 71.15% | -0.1191 | -0.1194 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,412.27 to -$6,650.25.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,416.55 (875 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,956.46 (789 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,828.96 (716 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,928.13 (819 trades).

Full-sample trades: BTC/USD 991 → 1004, ETH/USD 1091 → 1097, SOL/USD 1109 → 1109.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1318 trades, profit -$2,238.21, mean trade -0.32%.
- bear: 753 trades, profit -$1,378.57, mean trade -0.35%.
- sideways: 2111 trades, profit -$3,446.69, mean trade -0.25%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1004 (champion 991), ETH/USD 1097 (champion 1091), SOL/USD 1109 (champion 1109), BNB/USD 1016 (champion 1010), XRP/USD 1107 (champion 1106), DOGE/USD 1092 (champion 1092), ADA/USD 1056 (champion 1056), AVAX/USD 1097 (champion 1094), LINK/USD 1059 (champion 1059), LTC/USD 1000 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,453.44.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,063.48. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 84.55%, holdout 71.05% → 71.15%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1194 did not clear hurdle 0.0487 (z=-21.801, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 9 of 17 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1194, hurdle 0.0487, z=-21.801. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10637 (28.288 → 28.365 per day). Holdout trades 4167 → 4182 (27.778 → 27.878 per day).
Per coin, full sample then holdout: BTC/USD 991→1004 full, 378→384 holdout; ETH/USD 1091→1097 full, 421→426 holdout; SOL/USD 1109→1109 full, 420→420 holdout; BNB/USD 1010→1016 full, 375→379 holdout; XRP/USD 1106→1107 full, 450→450 holdout; DOGE/USD 1092→1092 full, 413→413 holdout; ADA/USD 1056→1056 full, 421→421 holdout; AVAX/USD 1094→1097 full, 437→437 holdout; LINK/USD 1059→1059 full, 438→438 holdout; LTC/USD 1000→1000 full, 414→414 holdout.
Full-sample win rate 65.21% → 65.10%. Average win 0.20% → 0.20% ($0.63 → $0.62). Average loss -1.21% → -1.21% (-$3.76 → -$3.74).
Holdout win rate 63.40% → 63.30%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.14%.
Train profit -$8,444.69 → -$8,453.44. Holdout profit -$7,053.33 → -$7,063.48. Holdout max drawdown 71.05% → 71.15%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6925, stop 1, EMA 3711, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1194. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe. z=-21.801 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10637 (28.288 → 28.365 per day). Holdout trades 4167 → 4182 (27.778 → 27.878 per day).
Per coin, full sample then holdout: BTC/USD 991→1004 full, 378→384 holdout; ETH/USD 1091→1097 full, 421→426 holdout; SOL/USD 1109→1109 full, 420→420 holdout; BNB/USD 1010→1016 full, 375→379 holdout; XRP/USD 1106→1107 full, 450→450 holdout; DOGE/USD 1092→1092 full, 413→413 holdout; ADA/USD 1056→1056 full, 421→421 holdout; AVAX/USD 1094→1097 full, 437→437 holdout; LINK/USD 1059→1059 full, 438→438 holdout; LTC/USD 1000→1000 full, 414→414 holdout.
Full-sample win rate 65.21% → 65.10%. Average win 0.41% → 0.41% ($2.54 → $2.53). Average loss -1.05% → -1.05% (-$6.51 → -$6.48).
Holdout win rate 63.40% → 63.30%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.98%.
Train profit -$4,603.85 → -$4,621.67. Holdout profit -$3,453.82 → -$3,459.04. Holdout max drawdown 36.65% → 36.70%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 16. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6925, stop 1, EMA 3711, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0424. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe. z=-7.431 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 49 — 15m — REJECT — flat_slope_pct 0.0001 → 0.0002

- At: 2026-11-15T09:03:29.618Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: flat_slope_pct 0.0001 → 0.0002 (`880f6e780cee00441cbbb44229c8e2b69470dcceeccd49d4b08f707bae55e4e7`).
- Parameter: `flat_slope_pct`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: flat_slope_pct from 0.0001 to 0.0002. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$6,797.20 | 349 |
| ETH/USD | -$7,221.95 | 421 | -$7,049.24 | 405 |
| SOL/USD | -$7,586.52 | 420 | -$7,575.61 | 417 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,371.86 | 84.46% | 83.74% | -0.1074 | -0.1051 |
| holdout | -$7,053.33 | -$6,947.94 | 71.05% | 70.02% | -0.1191 | -0.1161 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,318.28 to -$6,512.95.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,418.11 (871 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,872.79 (762 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,715.73 (679 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,875.65 (801 trades).

Full-sample trades: BTC/USD 991 → 941, ETH/USD 1091 → 1054, SOL/USD 1109 → 1099.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1292 trades, profit -$2,251.42, mean trade -0.32%.
- bear: 737 trades, profit -$1,350.37, mean trade -0.35%.
- sideways: 2032 trades, profit -$3,346.15, mean trade -0.25%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 941 (champion 991), ETH/USD 1054 (champion 1091), SOL/USD 1099 (champion 1109), BNB/USD 967 (champion 1010), XRP/USD 1074 (champion 1106), DOGE/USD 1069 (champion 1092), ADA/USD 1053 (champion 1056), AVAX/USD 1089 (champion 1094), LINK/USD 1053 (champion 1059), LTC/USD 979 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$8,371.86.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,947.94. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 3 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 83.74%, holdout 71.05% → 70.02%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1161 did not clear hurdle 0.0487 (z=-21.355, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 11 of 16 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1161, hurdle 0.0487, z=-21.355. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10378 (28.288 → 27.675 per day). Holdout trades 4167 → 4061 (27.778 → 27.071 per day).
Per coin, full sample then holdout: BTC/USD 991→941 full, 378→349 holdout; ETH/USD 1091→1054 full, 421→405 holdout; SOL/USD 1109→1099 full, 420→417 holdout; BNB/USD 1010→967 full, 375→357 holdout; XRP/USD 1106→1074 full, 450→436 holdout; DOGE/USD 1092→1069 full, 413→399 holdout; ADA/USD 1056→1053 full, 421→420 holdout; AVAX/USD 1094→1089 full, 437→435 holdout; LINK/USD 1059→1053 full, 438→436 holdout; LTC/USD 1000→979 full, 414→407 holdout.
Full-sample win rate 65.21% → 66.05%. Average win 0.20% → 0.20% ($0.63 → $0.64). Average loss -1.21% → -1.24% (-$3.76 → -$3.94).
Holdout win rate 63.40% → 64.34%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.18%.
Train profit -$8,444.69 → -$8,371.86. Holdout profit -$7,053.33 → -$6,947.94. Holdout max drawdown 71.05% → 70.02%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6855, stop 1, EMA 3522, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1161. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-21.355 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10378 (28.288 → 27.675 per day). Holdout trades 4167 → 4061 (27.778 → 27.071 per day).
Per coin, full sample then holdout: BTC/USD 991→941 full, 378→349 holdout; ETH/USD 1091→1054 full, 421→405 holdout; SOL/USD 1109→1099 full, 420→417 holdout; BNB/USD 1010→967 full, 375→357 holdout; XRP/USD 1106→1074 full, 450→436 holdout; DOGE/USD 1092→1069 full, 413→399 holdout; ADA/USD 1056→1053 full, 421→420 holdout; AVAX/USD 1094→1089 full, 437→435 holdout; LINK/USD 1059→1053 full, 438→436 holdout; LTC/USD 1000→979 full, 414→407 holdout.
Full-sample win rate 65.21% → 66.05%. Average win 0.41% → 0.41% ($2.54 → $2.58). Average loss -1.05% → -1.08% (-$6.51 → -$6.82).
Holdout win rate 63.40% → 64.34%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.02%.
Train profit -$4,603.85 → -$4,471.30. Holdout profit -$3,453.82 → -$3,343.15. Holdout max drawdown 36.65% → 35.64%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6855, stop 1, EMA 3522, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0407. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-7.226 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 50 — 15m — REJECT — ma_length 50 → 20

- At: 2026-11-15T09:03:29.618Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: ma_length 50 → 20 (`41e5ac33d7abbf587ee5965e7c37ef2e4dadffa31435b2866429992f7086a056`).
- Parameter: `ma_length`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: ma_length from 50 to 20. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,580.80 | 417 |
| ETH/USD | -$7,221.95 | 421 | -$7,705.88 | 459 |
| SOL/USD | -$7,586.52 | 420 | -$7,712.21 | 439 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,661.24 | 84.46% | 86.62% | -0.1074 | -0.1318 |
| holdout | -$7,053.33 | -$7,429.14 | 71.05% | 74.52% | -0.1191 | -0.1493 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,771.98 to -$7,013.89.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,380.81 (915 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$2,207.16 (871 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,979.12 (763 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$2,018.87 (814 trades).

Full-sample trades: BTC/USD 991 → 1075, ETH/USD 1091 → 1187, SOL/USD 1109 → 1139.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1385 trades, profit -$2,300.85, mean trade -0.34%.
- bear: 799 trades, profit -$1,522.09, mean trade -0.36%.
- sideways: 2230 trades, profit -$3,606.19, mean trade -0.27%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1075 (champion 991), ETH/USD 1187 (champion 1091), SOL/USD 1139 (champion 1109), BNB/USD 1075 (champion 1010), XRP/USD 1143 (champion 1106), DOGE/USD 1159 (champion 1092), ADA/USD 1090 (champion 1056), AVAX/USD 1141 (champion 1094), LINK/USD 1093 (champion 1059), LTC/USD 1049 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,661.24.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,429.14. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 86.62%, holdout 71.05% → 74.52%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1493 did not clear hurdle 0.0487 (z=-26.473, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 6 of 16 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1493, hurdle 0.0487, z=-26.473. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 11151 (28.288 → 29.736 per day). Holdout trades 4167 → 4414 (27.778 → 29.425 per day).
Per coin, full sample then holdout: BTC/USD 991→1075 full, 378→417 holdout; ETH/USD 1091→1187 full, 421→459 holdout; SOL/USD 1109→1139 full, 420→439 holdout; BNB/USD 1010→1075 full, 375→422 holdout; XRP/USD 1106→1143 full, 450→474 holdout; DOGE/USD 1092→1159 full, 413→424 holdout; ADA/USD 1056→1090 full, 421→448 holdout; AVAX/USD 1094→1141 full, 437→448 holdout; LINK/USD 1059→1093 full, 438→446 holdout; LTC/USD 1000→1049 full, 414→437 holdout.
Full-sample win rate 65.21% → 56.28%. Average win 0.20% → 0.20% ($0.63 → $0.59). Average loss -1.21% → -0.95% (-$3.76 → -$2.74).
Holdout win rate 63.40% → 54.44%. Average win 0.20% → 0.20%. Average loss -1.15% → -0.91%.
Train profit -$8,444.69 → -$8,661.24. Holdout profit -$7,053.33 → -$7,429.14. Holdout max drawdown 71.05% → 74.52%.
Folds won 1 of 4. Longest losing streak, full sample, 15 → 23. Holdout streak 13 → 18.
Exits, full sample, challenger: target 6276, stop 1, EMA 4874, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1493. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-26.473 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 11151 (28.288 → 29.736 per day). Holdout trades 4167 → 4414 (27.778 → 29.425 per day).
Per coin, full sample then holdout: BTC/USD 991→1075 full, 378→417 holdout; ETH/USD 1091→1187 full, 421→459 holdout; SOL/USD 1109→1139 full, 420→439 holdout; BNB/USD 1010→1075 full, 375→422 holdout; XRP/USD 1106→1143 full, 450→474 holdout; DOGE/USD 1092→1159 full, 413→424 holdout; ADA/USD 1056→1090 full, 421→448 holdout; AVAX/USD 1094→1141 full, 437→448 holdout; LINK/USD 1059→1093 full, 438→446 holdout; LTC/USD 1000→1049 full, 414→437 holdout.
Full-sample win rate 65.21% → 56.32%. Average win 0.41% → 0.41% ($2.54 → $2.33). Average loss -1.05% → -0.79% (-$6.51 → -$4.48).
Holdout win rate 63.40% → 54.49%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.76%.
Train profit -$4,603.85 → -$5,228.77. Holdout profit -$3,453.82 → -$4,129.83. Holdout max drawdown 36.65% → 42.44%.
Folds won 1 of 4. Longest losing streak, full sample, 15 → 23. Holdout streak 13 → 18.
Exits, full sample, challenger: target 6276, stop 1, EMA 4874, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0613. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-10.005 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 51 — 15m — REJECT — ma_length 50 → 34

- At: 2026-11-15T09:03:29.618Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: ma_length 50 → 34 (`ddde2a39296b60043c628f9ff982f7f2488f5a46a06004745cccd17e5aa33e8e`).
- Parameter: `ma_length`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: ma_length from 50 to 34. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,461.86 | 396 |
| ETH/USD | -$7,221.95 | 421 | -$7,763.89 | 455 |
| SOL/USD | -$7,586.52 | 420 | -$7,741.99 | 419 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,551.68 | 84.46% | 85.52% | -0.1074 | -0.1168 |
| holdout | -$7,053.33 | -$7,290.31 | 71.05% | 73.32% | -0.1191 | -0.1333 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,643.70 to -$6,881.73.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,423.37 (891 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$2,042.39 (816 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,871.95 (734 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,914.50 (830 trades).

Full-sample trades: BTC/USD 991 → 1029, ETH/USD 1091 → 1148, SOL/USD 1109 → 1123.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1366 trades, profit -$2,350.82, mean trade -0.34%.
- bear: 776 trades, profit -$1,358.63, mean trade -0.34%.
- sideways: 2182 trades, profit -$3,580.86, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1029 (champion 991), ETH/USD 1148 (champion 1091), SOL/USD 1123 (champion 1109), BNB/USD 1030 (champion 1010), XRP/USD 1154 (champion 1106), DOGE/USD 1132 (champion 1092), ADA/USD 1064 (champion 1056), AVAX/USD 1137 (champion 1094), LINK/USD 1083 (champion 1059), LTC/USD 1028 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,551.68.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,290.31. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 85.52%, holdout 71.05% → 73.32%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1333 did not clear hurdle 0.0487 (z=-23.839, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 6 of 17 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1333, hurdle 0.0487, z=-23.839. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10928 (28.288 → 29.141 per day). Holdout trades 4167 → 4324 (27.778 → 28.825 per day).
Per coin, full sample then holdout: BTC/USD 991→1029 full, 378→396 holdout; ETH/USD 1091→1148 full, 421→455 holdout; SOL/USD 1109→1123 full, 420→419 holdout; BNB/USD 1010→1030 full, 375→397 holdout; XRP/USD 1106→1154 full, 450→470 holdout; DOGE/USD 1092→1132 full, 413→425 holdout; ADA/USD 1056→1064 full, 421→427 holdout; AVAX/USD 1094→1137 full, 437→459 holdout; LINK/USD 1059→1083 full, 438→439 holdout; LTC/USD 1000→1028 full, 414→437 holdout.
Full-sample win rate 65.21% → 61.52%. Average win 0.20% → 0.20% ($0.63 → $0.60). Average loss -1.21% → -1.09% (-$3.76 → -$3.25).
Holdout win rate 63.40% → 59.53%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.04%.
Train profit -$8,444.69 → -$8,551.68. Holdout profit -$7,053.33 → -$7,290.31. Holdout max drawdown 71.05% → 73.32%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 18. Holdout streak 13 → 15.
Exits, full sample, challenger: target 6723, stop 1, EMA 4204, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1333. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-23.839 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10928 (28.288 → 29.141 per day). Holdout trades 4167 → 4324 (27.778 → 28.825 per day).
Per coin, full sample then holdout: BTC/USD 991→1029 full, 378→396 holdout; ETH/USD 1091→1148 full, 421→455 holdout; SOL/USD 1109→1123 full, 420→419 holdout; BNB/USD 1010→1030 full, 375→397 holdout; XRP/USD 1106→1154 full, 450→470 holdout; DOGE/USD 1092→1132 full, 413→425 holdout; ADA/USD 1056→1064 full, 421→427 holdout; AVAX/USD 1094→1137 full, 437→459 holdout; LINK/USD 1059→1083 full, 438→439 holdout; LTC/USD 1000→1028 full, 414→437 holdout.
Full-sample win rate 65.21% → 61.52%. Average win 0.41% → 0.41% ($2.54 → $2.43). Average loss -1.05% → -0.93% (-$6.51 → -$5.51).
Holdout win rate 63.40% → 59.53%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.88%.
Train profit -$4,603.85 → -$4,875.66. Holdout profit -$3,453.82 → -$3,848.50. Holdout max drawdown 36.65% → 40.15%.
Folds won 2 of 4. Longest losing streak, full sample, 15 → 18. Holdout streak 13 → 15.
Exits, full sample, challenger: target 6723, stop 1, EMA 4204, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0512. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-8.589 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 52 — 15m — REJECT — ma_length 50 → 100

- At: 2026-11-15T09:03:29.619Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: ma_length 50 → 100 (`4f51588d02759c031db26167007af91234216d3b60676dcfaddb6cecc4a1e81a`).
- Parameter: `ma_length`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: ma_length from 50 to 100. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$6,208.57 | 310 |
| ETH/USD | -$7,221.95 | 421 | -$6,975.75 | 368 |
| SOL/USD | -$7,586.52 | 420 | -$7,128.74 | 395 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,206.16 | 84.46% | 82.07% | -0.1074 | -0.0880 |
| holdout | -$7,053.33 | -$6,671.76 | 71.05% | 67.41% | -0.1191 | -0.0993 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,103.50 to -$6,176.87.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,051.69 (793 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$2,038.52 (722 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,685.17 (636 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,597.55 (751 trades).

Full-sample trades: BTC/USD 991 → 864, ETH/USD 1091 → 970, SOL/USD 1109 → 1028.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1226 trades, profit -$2,244.53, mean trade -0.32%.
- bear: 680 trades, profit -$1,165.30, mean trade -0.30%.
- sideways: 1898 trades, profit -$3,261.92, mean trade -0.26%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 864 (champion 991), ETH/USD 970 (champion 1091), SOL/USD 1028 (champion 1109), BNB/USD 900 (champion 1010), XRP/USD 1001 (champion 1106), DOGE/USD 1012 (champion 1092), ADA/USD 976 (champion 1056), AVAX/USD 1015 (champion 1094), LINK/USD 988 (champion 1059), LTC/USD 923 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$8,206.16.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,671.76. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 3 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 82.07%, holdout 71.05% → 67.41%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0993 did not clear hurdle 0.0487 (z=-18.878, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 14 of 16 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0993, hurdle 0.0487, z=-18.878. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 9677 (28.288 → 25.805 per day). Holdout trades 4167 → 3804 (27.778 → 25.358 per day).
Per coin, full sample then holdout: BTC/USD 991→864 full, 378→310 holdout; ETH/USD 1091→970 full, 421→368 holdout; SOL/USD 1109→1028 full, 420→395 holdout; BNB/USD 1010→900 full, 375→341 holdout; XRP/USD 1106→1001 full, 450→408 holdout; DOGE/USD 1092→1012 full, 413→380 holdout; ADA/USD 1056→976 full, 421→394 holdout; AVAX/USD 1094→1015 full, 437→404 holdout; LINK/USD 1059→988 full, 438→413 holdout; LTC/USD 1000→923 full, 414→391 holdout.
Full-sample win rate 65.21% → 71.03%. Average win 0.20% → 0.20% ($0.63 → $0.64). Average loss -1.21% → -1.49% (-$3.76 → -$4.93).
Holdout win rate 63.40% → 69.56%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.41%.
Train profit -$8,444.69 → -$8,206.16. Holdout profit -$7,053.33 → -$6,671.76. Holdout max drawdown 71.05% → 67.41%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 13. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6874, stop 1, EMA 2802, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0993. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-18.878 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 9677 (28.288 → 25.805 per day). Holdout trades 4167 → 3804 (27.778 → 25.358 per day).
Per coin, full sample then holdout: BTC/USD 991→864 full, 378→310 holdout; ETH/USD 1091→970 full, 421→368 holdout; SOL/USD 1109→1028 full, 420→395 holdout; BNB/USD 1010→900 full, 375→341 holdout; XRP/USD 1106→1001 full, 450→408 holdout; DOGE/USD 1092→1012 full, 413→380 holdout; ADA/USD 1056→976 full, 421→394 holdout; AVAX/USD 1094→1015 full, 437→404 holdout; LINK/USD 1059→988 full, 438→413 holdout; LTC/USD 1000→923 full, 414→391 holdout.
Full-sample win rate 65.21% → 71.03%. Average win 0.41% → 0.41% ($2.54 → $2.58). Average loss -1.05% → -1.34% (-$6.51 → -$8.47).
Holdout win rate 63.40% → 69.56%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.25%.
Train profit -$4,603.85 → -$4,327.14. Holdout profit -$3,453.82 → -$3,020.01. Holdout max drawdown 36.65% → 32.96%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 13. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6874, stop 1, EMA 2802, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0327. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-6.205 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 53 — 15m — REJECT — vol_multiplier 1.2 → 1

- At: 2026-11-15T09:03:29.619Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: vol_multiplier 1.2 → 1 (`b71743c5d8f8da1579d3c3791f75f5e9ad3333ac13e52e538512b842e04ea932`).
- Parameter: `vol_multiplier`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: vol_multiplier from 1.2 to 1. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,684.99 | 536 |
| ETH/USD | -$7,221.95 | 421 | -$8,315.68 | 623 |
| SOL/USD | -$7,586.52 | 420 | -$8,681.33 | 674 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$9,642.99 | 84.46% | 96.44% | -0.1074 | -0.1399 |
| holdout | -$7,053.33 | -$8,538.09 | 71.05% | 85.71% | -0.1191 | -0.1419 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$8,802.53 to -$8,245.89.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$3,800.78 (1443 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$2,828.86 (1214 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$2,961.52 (1123 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$3,465.06 (1393 trades).

Full-sample trades: BTC/USD 991 → 1507, ETH/USD 1091 → 1697, SOL/USD 1109 → 1779.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 2122 trades, profit -$2,507.02, mean trade -0.31%.
- bear: 1206 trades, profit -$1,510.33, mean trade -0.29%.
- sideways: 3277 trades, profit -$4,520.74, mean trade -0.28%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1507 (champion 991), ETH/USD 1697 (champion 1091), SOL/USD 1779 (champion 1109), BNB/USD 1575 (champion 1010), XRP/USD 1811 (champion 1106), DOGE/USD 1831 (champion 1092), ADA/USD 1803 (champion 1056), AVAX/USD 1837 (champion 1094), LINK/USD 1817 (champion 1059), LTC/USD 1690 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$9,642.99.
- fail `holdout`: Holdout profit -$7,053.33 → -$8,538.09. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 0 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 96.44%, holdout 71.05% → 85.71%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1419 did not clear hurdle 0.0487 (z=-24.092, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 1 of 16 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1419, hurdle 0.0487, z=-24.092. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 17347 (28.288 → 46.259 per day). Holdout trades 4167 → 6605 (27.778 → 44.030 per day).
Per coin, full sample then holdout: BTC/USD 991→1507 full, 378→536 holdout; ETH/USD 1091→1697 full, 421→623 holdout; SOL/USD 1109→1779 full, 420→674 holdout; BNB/USD 1010→1575 full, 375→587 holdout; XRP/USD 1106→1811 full, 450→700 holdout; DOGE/USD 1092→1831 full, 413→676 holdout; ADA/USD 1056→1803 full, 421→702 holdout; AVAX/USD 1094→1837 full, 437→729 holdout; LINK/USD 1059→1817 full, 438→709 holdout; LTC/USD 1000→1690 full, 414→669 holdout.
Full-sample win rate 65.21% → 62.77%. Average win 0.20% → 0.20% ($0.63 → $0.38). Average loss -1.21% → -1.15% (-$3.76 → -$2.18).
Holdout win rate 63.40% → 61.59%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.08%.
Train profit -$8,444.69 → -$9,642.99. Holdout profit -$7,053.33 → -$8,538.09. Holdout max drawdown 71.05% → 85.71%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 33. Holdout streak 13 → 22.
Exits, full sample, challenger: target 10889, stop 1, EMA 6457, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1419. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-24.092 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 17347 (28.288 → 46.259 per day). Holdout trades 4167 → 6605 (27.778 → 44.030 per day).
Per coin, full sample then holdout: BTC/USD 991→1507 full, 378→536 holdout; ETH/USD 1091→1697 full, 421→623 holdout; SOL/USD 1109→1779 full, 420→674 holdout; BNB/USD 1010→1575 full, 375→587 holdout; XRP/USD 1106→1811 full, 450→700 holdout; DOGE/USD 1092→1831 full, 413→676 holdout; ADA/USD 1056→1803 full, 421→702 holdout; AVAX/USD 1094→1837 full, 437→729 holdout; LINK/USD 1059→1817 full, 438→709 holdout; LTC/USD 1000→1690 full, 414→669 holdout.
Full-sample win rate 65.21% → 62.77%. Average win 0.41% → 0.41% ($2.54 → $1.75). Average loss -1.05% → -0.99% (-$6.51 → -$4.28).
Holdout win rate 63.40% → 61.59%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.92%.
Train profit -$4,603.85 → -$7,201.57. Holdout profit -$3,453.82 → -$4,849.26. Holdout max drawdown 36.65% → 50.77%.
Folds won 0 of 4. Longest losing streak, full sample, 15 → 33. Holdout streak 13 → 22.
Exits, full sample, challenger: target 10889, stop 1, EMA 6457, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0495. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-8.330 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 54 — 15m — REJECT — vol_multiplier 1.2 → 1.5

- At: 2026-11-15T09:03:29.619Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: vol_multiplier 1.2 → 1.5 (`f3937e020dc83fe8ec0c6d2cb93681472efd48ff94c99e0923217519a222608b`).
- Parameter: `vol_multiplier`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: vol_multiplier from 1.2 to 1.5. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$6,542.70 | 324 |
| ETH/USD | -$7,221.95 | 421 | -$6,149.18 | 349 |
| SOL/USD | -$7,586.52 | 420 | -$7,000.11 | 342 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$7,730.93 | 84.46% | 77.36% | -0.1074 | -0.0959 |
| holdout | -$7,053.33 | -$6,206.08 | 71.05% | 62.65% | -0.1191 | -0.1041 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$6,641.77 to -$5,717.06.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$1,845.33 (700 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,757.97 (686 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,439.12 (584 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,613.34 (659 trades).

Full-sample trades: BTC/USD 991 → 837, ETH/USD 1091 → 925, SOL/USD 1109 → 882.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1044 trades, profit -$1,926.34, mean trade -0.31%.
- bear: 612 trades, profit -$1,323.26, mean trade -0.38%.
- sideways: 1698 trades, profit -$2,956.48, mean trade -0.25%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 837 (champion 991), ETH/USD 925 (champion 1091), SOL/USD 882 (champion 1109), BNB/USD 826 (champion 1010), XRP/USD 864 (champion 1106), DOGE/USD 895 (champion 1092), ADA/USD 839 (champion 1056), AVAX/USD 853 (champion 1094), LINK/USD 840 (champion 1059), LTC/USD 777 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$7,730.93.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,206.08. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 77.36%, holdout 71.05% → 62.65%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1041 did not clear hurdle 0.0487 (z=-20.068, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 16 of 17 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1041, hurdle 0.0487, z=-20.068. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 8538 (28.288 → 22.768 per day). Holdout trades 4167 → 3354 (27.778 → 22.358 per day).
Per coin, full sample then holdout: BTC/USD 991→837 full, 378→324 holdout; ETH/USD 1091→925 full, 421→349 holdout; SOL/USD 1109→882 full, 420→342 holdout; BNB/USD 1010→826 full, 375→303 holdout; XRP/USD 1106→864 full, 450→355 holdout; DOGE/USD 1092→895 full, 413→339 holdout; ADA/USD 1056→839 full, 421→336 holdout; AVAX/USD 1094→853 full, 437→334 holdout; LINK/USD 1059→840 full, 438→342 holdout; LTC/USD 1000→777 full, 414→330 holdout.
Full-sample win rate 65.21% → 66.39%. Average win 0.20% → 0.20% ($0.63 → $0.75). Average loss -1.21% → -1.25% (-$3.76 → -$4.66).
Holdout win rate 63.40% → 64.85%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.19%.
Train profit -$8,444.69 → -$7,730.93. Holdout profit -$7,053.33 → -$6,206.08. Holdout max drawdown 71.05% → 62.65%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 19. Holdout streak 13 → 12.
Exits, full sample, challenger: target 5668, stop 1, EMA 2869, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1041. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-20.068 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 8538 (28.288 → 22.768 per day). Holdout trades 4167 → 3354 (27.778 → 22.358 per day).
Per coin, full sample then holdout: BTC/USD 991→837 full, 378→324 holdout; ETH/USD 1091→925 full, 421→349 holdout; SOL/USD 1109→882 full, 420→342 holdout; BNB/USD 1010→826 full, 375→303 holdout; XRP/USD 1106→864 full, 450→355 holdout; DOGE/USD 1092→895 full, 413→339 holdout; ADA/USD 1056→839 full, 421→336 holdout; AVAX/USD 1094→853 full, 437→334 holdout; LINK/USD 1059→840 full, 438→342 holdout; LTC/USD 1000→777 full, 414→330 holdout.
Full-sample win rate 65.21% → 66.39%. Average win 0.41% → 0.41% ($2.54 → $2.79). Average loss -1.05% → -1.09% (-$6.51 → -$7.45).
Holdout win rate 63.40% → 64.85%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.03%.
Train profit -$4,603.85 → -$3,807.85. Holdout profit -$3,453.82 → -$2,769.05. Holdout max drawdown 36.65% → 29.73%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 19. Holdout streak 13 → 12.
Exits, full sample, challenger: target 5668, stop 1, EMA 2869, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0358. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-6.615 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 55 — 15m — REJECT — vol_multiplier 1.2 → 2

- At: 2026-11-15T09:03:29.619Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: vol_multiplier 1.2 → 2 (`6aaf64bccbb512ddb848fac08caab04f983ecf3cd3e25f8b89d88e13c75acfc8`).
- Parameter: `vol_multiplier`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: vol_multiplier from 1.2 to 2. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$5,693.71 | 249 |
| ETH/USD | -$7,221.95 | 421 | -$5,403.02 | 288 |
| SOL/USD | -$7,586.52 | 420 | -$5,729.34 | 264 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$6,548.57 | 84.46% | 65.61% | -0.1074 | -0.0811 |
| holdout | -$7,053.33 | -$5,104.80 | 71.05% | 51.73% | -0.1191 | -0.0908 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$5,555.79 to -$4,579.55.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$1,375.67 (498 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,364.23 (507 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$928.10 (420 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,389.99 (477 trades).

Full-sample trades: BTC/USD 991 → 656, ETH/USD 1091 → 739, SOL/USD 1109 → 643.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 744 trades, profit -$1,700.11, mean trade -0.33%.
- bear: 450 trades, profit -$1,012.62, mean trade -0.36%.
- sideways: 1239 trades, profit -$2,392.06, mean trade -0.25%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 656 (champion 991), ETH/USD 739 (champion 1091), SOL/USD 643 (champion 1109), BNB/USD 590 (champion 1010), XRP/USD 583 (champion 1106), DOGE/USD 630 (champion 1092), ADA/USD 582 (champion 1056), AVAX/USD 570 (champion 1094), LINK/USD 575 (champion 1059), LTC/USD 556 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$6,548.57.
- pass `holdout`: Holdout profit -$7,053.33 → -$5,104.80. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 65.61%, holdout 71.05% → 51.73%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0908 did not clear hurdle 0.0487 (z=-18.377, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 16 of 16 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0908, hurdle 0.0487, z=-18.377. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 6124 (28.288 → 16.331 per day). Holdout trades 4167 → 2433 (27.778 → 16.219 per day).
Per coin, full sample then holdout: BTC/USD 991→656 full, 378→249 holdout; ETH/USD 1091→739 full, 421→288 holdout; SOL/USD 1109→643 full, 420→264 holdout; BNB/USD 1010→590 full, 375→218 holdout; XRP/USD 1106→583 full, 450→244 holdout; DOGE/USD 1092→630 full, 413→240 holdout; ADA/USD 1056→582 full, 421→232 holdout; AVAX/USD 1094→570 full, 437→219 holdout; LINK/USD 1059→575 full, 438→237 holdout; LTC/USD 1000→556 full, 414→242 holdout.
Full-sample win rate 65.21% → 67.28%. Average win 0.20% → 0.20% ($0.63 → $0.94). Average loss -1.21% → -1.30% (-$3.76 → -$6.07).
Holdout win rate 63.40% → 65.68%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.24%.
Train profit -$8,444.69 → -$6,548.57. Holdout profit -$7,053.33 → -$5,104.80. Holdout max drawdown 71.05% → 51.73%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 14.
Exits, full sample, challenger: target 4120, stop 1, EMA 2003, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0908. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-18.377 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 6124 (28.288 → 16.331 per day). Holdout trades 4167 → 2433 (27.778 → 16.219 per day).
Per coin, full sample then holdout: BTC/USD 991→656 full, 378→249 holdout; ETH/USD 1091→739 full, 421→288 holdout; SOL/USD 1109→643 full, 420→264 holdout; BNB/USD 1010→590 full, 375→218 holdout; XRP/USD 1106→583 full, 450→244 holdout; DOGE/USD 1092→630 full, 413→240 holdout; ADA/USD 1056→582 full, 421→232 holdout; AVAX/USD 1094→570 full, 437→219 holdout; LINK/USD 1059→575 full, 438→237 holdout; LTC/USD 1000→556 full, 414→242 holdout.
Full-sample win rate 65.21% → 67.28%. Average win 0.41% → 0.41% ($2.54 → $3.09). Average loss -1.05% → -1.14% (-$6.51 → -$8.58).
Holdout win rate 63.40% → 65.68%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.08%.
Train profit -$4,603.85 → -$2,934.05. Holdout profit -$3,453.82 → -$2,176.04. Holdout max drawdown 36.65% → 23.77%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 14.
Exits, full sample, challenger: target 4120, stop 1, EMA 2003, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0322. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-6.158 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 56 — 15m — REJECT — min_touches 1 → 2

- At: 2026-11-15T09:03:29.619Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: min_touches 1 → 2 (`09b8fd98299e6bf661cb78e01fbfd3fc45321f034ce8bf1d7f87c334e8a1dfd4`).
- Parameter: `min_touches`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: min_touches from 1 to 2. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$3,985.71 | 174 |
| ETH/USD | -$7,221.95 | 421 | -$3,874.22 | 161 |
| SOL/USD | -$7,586.52 | 420 | -$3,214.36 | 122 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$4,207.46 | 84.46% | 42.08% | -0.1074 | -0.0807 |
| holdout | -$7,053.33 | -$3,101.96 | 71.05% | 31.37% | -0.1191 | -0.0946 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$3,557.31 to -$2,590.51.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$781.55 (229 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$772.74 (287 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$668.97 (217 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$484.72 (242 trades).

Full-sample trades: BTC/USD 991 → 385, ETH/USD 1091 → 385, SOL/USD 1109 → 318.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 386 trades, profit -$1,065.95, mean trade -0.33%.
- bear: 199 trades, profit -$614.56, mean trade -0.39%.
- sideways: 632 trades, profit -$1,421.45, mean trade -0.26%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 385 (champion 991), ETH/USD 385 (champion 1091), SOL/USD 318 (champion 1109), BNB/USD 364 (champion 1010), XRP/USD 307 (champion 1106), DOGE/USD 290 (champion 1092), ADA/USD 192 (champion 1056), AVAX/USD 264 (champion 1094), LINK/USD 281 (champion 1059), LTC/USD 269 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$4,207.46.
- pass `holdout`: Holdout profit -$7,053.33 → -$3,101.96. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 42.08%, holdout 71.05% → 31.37%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0946 did not clear hurdle 0.0487 (z=-18.444, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 17 of 18 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0946, hurdle 0.0487, z=-18.444. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 3055 (28.288 → 8.147 per day). Holdout trades 4167 → 1217 (27.778 → 8.113 per day).
Per coin, full sample then holdout: BTC/USD 991→385 full, 378→174 holdout; ETH/USD 1091→385 full, 421→161 holdout; SOL/USD 1109→318 full, 420→122 holdout; BNB/USD 1010→364 full, 375→148 holdout; XRP/USD 1106→307 full, 450→115 holdout; DOGE/USD 1092→290 full, 413→117 holdout; ADA/USD 1056→192 full, 421→58 holdout; AVAX/USD 1094→264 full, 437→99 holdout; LINK/USD 1059→281 full, 438→104 holdout; LTC/USD 1000→269 full, 414→119 holdout.
Full-sample win rate 65.21% → 59.44%. Average win 0.20% → 0.20% ($0.63 → $1.31). Average loss -1.21% → -1.03% (-$3.76 → -$6.77).
Holdout win rate 63.40% → 57.03%. Average win 0.20% → 0.20%. Average loss -1.15% → -0.98%.
Train profit -$8,444.69 → -$4,207.46. Holdout profit -$7,053.33 → -$3,101.96. Holdout max drawdown 71.05% → 31.37%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 23. Holdout streak 13 → 14.
Exits, full sample, challenger: target 1816, stop 0, EMA 1239, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0946. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-18.444 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 3055 (28.288 → 8.147 per day). Holdout trades 4167 → 1217 (27.778 → 8.113 per day).
Per coin, full sample then holdout: BTC/USD 991→385 full, 378→174 holdout; ETH/USD 1091→385 full, 421→161 holdout; SOL/USD 1109→318 full, 420→122 holdout; BNB/USD 1010→364 full, 375→148 holdout; XRP/USD 1106→307 full, 450→115 holdout; DOGE/USD 1092→290 full, 413→117 holdout; ADA/USD 1056→192 full, 421→58 holdout; AVAX/USD 1094→264 full, 437→99 holdout; LINK/USD 1059→281 full, 438→104 holdout; LTC/USD 1000→269 full, 414→119 holdout.
Full-sample win rate 65.21% → 59.44%. Average win 0.41% → 0.41% ($2.54 → $3.47). Average loss -1.05% → -0.87% (-$6.51 → -$7.41).
Holdout win rate 63.40% → 57.03%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.82%.
Train profit -$4,603.85 → -$1,779.98. Holdout profit -$3,453.82 → -$1,325.43. Holdout max drawdown 36.65% → 14.04%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 23. Holdout streak 13 → 14.
Exits, full sample, challenger: target 1816, stop 0, EMA 1239, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0381. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-6.798 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 57 — 15m — INSUFFICIENT — min_touches 1 → 3

- At: 2026-11-15T09:03:29.620Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: min_touches 1 → 3 (`f67f4b4a35d0f8585a5dcaa06fdaeea02ad72ec4d4ce061d1a7174be9d6718ed`).
- Parameter: `min_touches`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: min_touches from 1 to 3. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$1,144.10 | 35 |
| ETH/USD | -$7,221.95 | 421 | -$962.74 | 31 |
| SOL/USD | -$7,586.52 | 420 | -$314.48 | 19 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$711.44 | 84.46% | 7.11% | -0.1074 | -0.0427 |
| holdout | -$7,053.33 | -$511.13 | 71.05% | 5.31% | -0.1191 | -0.0462 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$674.36 to -$355.14.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$74.28 (19 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$142.70 (48 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$144.42 (34 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$55.45 (33 trades).

Full-sample trades: BTC/USD 991 → 78, ETH/USD 1091 → 64, SOL/USD 1109 → 42.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 45 trades, profit -$112.71, mean trade -0.26%.
- bear: 37 trades, profit -$155.67, mean trade -0.43%.
- sideways: 104 trades, profit -$242.75, mean trade -0.24%.

### Verdict

Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 78 (champion 991), ETH/USD 64 (champion 1091), SOL/USD 42 (champion 1109), BNB/USD 66 (champion 1010), XRP/USD 36 (champion 1106), DOGE/USD 38 (champion 1092), ADA/USD 10 (champion 1056), AVAX/USD 28 (champion 1094), LINK/USD 34 (champion 1059), LTC/USD 38 (champion 1000). Other failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is INSUFFICIENT. candidate.json was not written.

- fail `trades`: Need 30 closed trades on each coin over the full sample. Got BTC/USD 78 (champion 991), ETH/USD 64 (champion 1091), SOL/USD 42 (champion 1109), BNB/USD 66 (champion 1010), XRP/USD 36 (champion 1106), DOGE/USD 38 (champion 1092), ADA/USD 10 (champion 1056), AVAX/USD 28 (champion 1094), LINK/USD 34 (champion 1059), LTC/USD 38 (champion 1000).
- pass `train`: Train profit -$8,444.69 → -$711.44.
- pass `holdout`: Holdout profit -$7,053.33 → -$511.13. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 7.11%, holdout 71.05% → 5.31%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0462 did not clear hurdle 0.0487 (z=-12.270, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 17 of 17 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0462, hurdle 0.0487, z=-12.270. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 434 (28.288 → 1.157 per day). Holdout trades 4167 → 186 (27.778 → 1.240 per day).
Per coin, full sample then holdout: BTC/USD 991→78 full, 378→35 holdout; ETH/USD 1091→64 full, 421→31 holdout; SOL/USD 1109→42 full, 420→19 holdout; BNB/USD 1010→66 full, 375→28 holdout; XRP/USD 1106→36 full, 450→14 holdout; DOGE/USD 1092→38 full, 413→14 holdout; ADA/USD 1056→10 full, 421→4 holdout; AVAX/USD 1094→28 full, 437→11 holdout; LINK/USD 1059→34 full, 438→12 holdout; LTC/USD 1000→38 full, 414→18 holdout.
Full-sample win rate 65.21% → 54.38%. Average win 0.20% → 0.20% ($0.63 → $1.88). Average loss -1.21% → -0.88% (-$3.76 → -$8.23).
Holdout win rate 63.40% → 52.69%. Average win 0.20% → 0.20%. Average loss -1.15% → -0.82%.
Train profit -$8,444.69 → -$711.44. Holdout profit -$7,053.33 → -$511.13. Holdout max drawdown 71.05% → 5.31%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 9. Holdout streak 13 → 9.
Exits, full sample, challenger: target 236, stop 0, EMA 198, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0462. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: INSUFFICIENT. Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 78 (champion 991), ETH/USD 64 (champion 1091), SOL/USD 42 (champion 1109), BNB/USD 66 (champion 1010), XRP/USD 36 (champion 1106), DOGE/USD 38 (champion 1092), ADA/USD 10 (champion 1056), AVAX/USD 28 (champion 1094), LINK/USD 34 (champion 1059), LTC/USD 38 (champion 1000). Other failed gates: deflated-sharpe. z=-12.270 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 434 (28.288 → 1.157 per day). Holdout trades 4167 → 186 (27.778 → 1.240 per day).
Per coin, full sample then holdout: BTC/USD 991→78 full, 378→35 holdout; ETH/USD 1091→64 full, 421→31 holdout; SOL/USD 1109→42 full, 420→19 holdout; BNB/USD 1010→66 full, 375→28 holdout; XRP/USD 1106→36 full, 450→14 holdout; DOGE/USD 1092→38 full, 413→14 holdout; ADA/USD 1056→10 full, 421→4 holdout; AVAX/USD 1094→28 full, 437→11 holdout; LINK/USD 1059→34 full, 438→12 holdout; LTC/USD 1000→38 full, 414→18 holdout.
Full-sample win rate 65.21% → 54.38%. Average win 0.41% → 0.41% ($2.54 → $4.01). Average loss -1.05% → -0.72% (-$6.51 → -$7.01).
Holdout win rate 63.40% → 52.69%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.66%.
Train profit -$4,603.85 → -$268.72. Holdout profit -$3,453.82 → -$177.31. Holdout max drawdown 36.65% → 2.13%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 9. Holdout streak 13 → 9.
Exits, full sample, challenger: target 236, stop 0, EMA 198, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0168. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: INSUFFICIENT. Insufficient sample: Need 30 closed trades on each coin over the full sample. Got BTC/USD 78 (champion 991), ETH/USD 64 (champion 1091), SOL/USD 42 (champion 1109), BNB/USD 66 (champion 1010), XRP/USD 36 (champion 1106), DOGE/USD 38 (champion 1092), ADA/USD 10 (champion 1056), AVAX/USD 28 (champion 1094), LINK/USD 34 (champion 1059), LTC/USD 38 (champion 1000). Other failed gates: deflated-sharpe. z=-4.244 after 33 trials. The z is not a probability.

Binance gates: fail trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 58 — 15m — REJECT — confirm_bars 1 → 2

- At: 2026-11-15T09:03:29.620Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: confirm_bars 1 → 2 (`1c8d2a2360c979dc5b58743c8dcb7ea89e5b066cd26884ffb7c9f307a48cfef4`).
- Parameter: `confirm_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: confirm_bars from 1 to 2. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$5,833.16 | 293 |
| ETH/USD | -$7,221.95 | 421 | -$5,502.86 | 324 |
| SOL/USD | -$7,586.52 | 420 | -$6,900.54 | 324 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$7,623.76 | 84.46% | 76.35% | -0.1074 | -0.0894 |
| holdout | -$7,053.33 | -$6,130.94 | 71.05% | 61.80% | -0.1191 | -0.0922 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$6,534.86 to -$5,721.81.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$1,556.51 (656 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,462.26 (621 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,448.44 (532 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,423.90 (619 trades).

Full-sample trades: BTC/USD 991 → 777, ETH/USD 1091 → 835, SOL/USD 1109 → 840.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 983 trades, profit -$1,893.32, mean trade -0.31%.
- bear: 558 trades, profit -$987.44, mean trade -0.30%.
- sideways: 1642 trades, profit -$3,250.18, mean trade -0.29%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 777 (champion 991), ETH/USD 835 (champion 1091), SOL/USD 840 (champion 1109), BNB/USD 782 (champion 1010), XRP/USD 844 (champion 1106), DOGE/USD 814 (champion 1092), ADA/USD 798 (champion 1056), AVAX/USD 832 (champion 1094), LINK/USD 800 (champion 1059), LTC/USD 745 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$7,623.76.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,130.94. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 76.35%, holdout 71.05% → 61.80%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0922 did not clear hurdle 0.0487 (z=-16.166, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 16 of 18 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0922, hurdle 0.0487, z=-16.166. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 8067 (28.288 → 21.512 per day). Holdout trades 4167 → 3183 (27.778 → 21.219 per day).
Per coin, full sample then holdout: BTC/USD 991→777 full, 378→293 holdout; ETH/USD 1091→835 full, 421→324 holdout; SOL/USD 1109→840 full, 420→324 holdout; BNB/USD 1010→782 full, 375→287 holdout; XRP/USD 1106→844 full, 450→345 holdout; DOGE/USD 1092→814 full, 413→310 holdout; ADA/USD 1056→798 full, 421→321 holdout; AVAX/USD 1094→832 full, 437→333 holdout; LINK/USD 1059→800 full, 438→338 holdout; LTC/USD 1000→745 full, 414→308 holdout.
Full-sample win rate 65.21% → 66.29%. Average win 0.20% → 0.20% ($0.63 → $0.76). Average loss -1.21% → -1.27% (-$3.76 → -$4.83).
Holdout win rate 63.40% → 64.37%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.20%.
Train profit -$8,444.69 → -$7,623.76. Holdout profit -$7,053.33 → -$6,130.94. Holdout max drawdown 71.05% → 61.80%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 14. Holdout streak 13 → 14.
Exits, full sample, challenger: target 5348, stop 7, EMA 2712, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0922. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-16.166 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 8067 (28.288 → 21.512 per day). Holdout trades 4167 → 3183 (27.778 → 21.219 per day).
Per coin, full sample then holdout: BTC/USD 991→777 full, 378→293 holdout; ETH/USD 1091→835 full, 421→324 holdout; SOL/USD 1109→840 full, 420→324 holdout; BNB/USD 1010→782 full, 375→287 holdout; XRP/USD 1106→844 full, 450→345 holdout; DOGE/USD 1092→814 full, 413→310 holdout; ADA/USD 1056→798 full, 421→321 holdout; AVAX/USD 1094→832 full, 437→333 holdout; LINK/USD 1059→800 full, 438→338 holdout; LTC/USD 1000→745 full, 414→308 holdout.
Full-sample win rate 65.21% → 66.29%. Average win 0.41% → 0.41% ($2.54 → $2.75). Average loss -1.05% → -1.11% (-$6.51 → -$7.48).
Holdout win rate 63.40% → 64.37%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.04%.
Train profit -$4,603.85 → -$3,878.63. Holdout profit -$3,453.82 → -$2,869.47. Holdout max drawdown 36.65% → 30.56%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 14. Holdout streak 13 → 14.
Exits, full sample, challenger: target 5348, stop 7, EMA 2712, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0336. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-7.025 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 59 — 15m — REJECT — confirm_bars 1 → 3

- At: 2026-11-15T09:03:29.620Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: confirm_bars 1 → 3 (`0cd41946c28733c6fc3e57f61a8d35ba9e50a327ef063ab2be798beaf74408bc`).
- Parameter: `confirm_bars`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: confirm_bars from 1 to 3. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$5,478.93 | 250 |
| ETH/USD | -$7,221.95 | 421 | -$5,321.40 | 279 |
| SOL/USD | -$7,586.52 | 420 | -$5,331.44 | 270 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$6,728.29 | 84.46% | 67.49% | -0.1074 | -0.0806 |
| holdout | -$7,053.33 | -$5,369.83 | 71.05% | 54.29% | -0.1191 | -0.0951 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$5,763.71 to -$4,947.19.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$1,206.12 (540 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,193.13 (531 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,259.28 (462 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,277.57 (516 trades).

Full-sample trades: BTC/USD 991 → 659, ETH/USD 1091 → 701, SOL/USD 1109 → 703.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 819 trades, profit -$1,535.00, mean trade -0.27%.
- bear: 459 trades, profit -$745.58, mean trade -0.25%.
- sideways: 1380 trades, profit -$3,089.24, mean trade -0.31%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 659 (champion 991), ETH/USD 701 (champion 1091), SOL/USD 703 (champion 1109), BNB/USD 676 (champion 1010), XRP/USD 709 (champion 1106), DOGE/USD 678 (champion 1092), ADA/USD 660 (champion 1056), AVAX/USD 680 (champion 1094), LINK/USD 673 (champion 1059), LTC/USD 607 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$6,728.29.
- pass `holdout`: Holdout profit -$7,053.33 → -$5,369.83. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 67.49%, holdout 71.05% → 54.29%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0951 did not clear hurdle 0.0487 (z=-18.762, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 17 of 17 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0951, hurdle 0.0487, z=-18.762. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 6746 (28.288 → 17.989 per day). Holdout trades 4167 → 2658 (27.778 → 17.719 per day).
Per coin, full sample then holdout: BTC/USD 991→659 full, 378→250 holdout; ETH/USD 1091→701 full, 421→279 holdout; SOL/USD 1109→703 full, 420→270 holdout; BNB/USD 1010→676 full, 375→243 holdout; XRP/USD 1106→709 full, 450→291 holdout; DOGE/USD 1092→678 full, 413→253 holdout; ADA/USD 1056→660 full, 421→259 holdout; AVAX/USD 1094→680 full, 437→277 holdout; LINK/USD 1059→673 full, 438→281 holdout; LTC/USD 1000→607 full, 414→255 holdout.
Full-sample win rate 65.21% → 67.37%. Average win 0.20% → 0.20% ($0.63 → $0.91). Average loss -1.21% → -1.27% (-$3.76 → -$5.73).
Holdout win rate 63.40% → 65.50%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.22%.
Train profit -$8,444.69 → -$6,728.29. Holdout profit -$7,053.33 → -$5,369.83. Holdout max drawdown 71.05% → 54.29%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 13. Holdout streak 13 → 11.
Exits, full sample, challenger: target 4545, stop 2, EMA 2199, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0951. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-18.762 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 6746 (28.288 → 17.989 per day). Holdout trades 4167 → 2658 (27.778 → 17.719 per day).
Per coin, full sample then holdout: BTC/USD 991→659 full, 378→250 holdout; ETH/USD 1091→701 full, 421→279 holdout; SOL/USD 1109→703 full, 420→270 holdout; BNB/USD 1010→676 full, 375→243 holdout; XRP/USD 1106→709 full, 450→291 holdout; DOGE/USD 1092→678 full, 413→253 holdout; ADA/USD 1056→660 full, 421→259 holdout; AVAX/USD 1094→680 full, 437→277 holdout; LINK/USD 1059→673 full, 438→281 holdout; LTC/USD 1000→607 full, 414→255 holdout.
Full-sample win rate 65.21% → 67.37%. Average win 0.41% → 0.41% ($2.54 → $3.13). Average loss -1.05% → -1.11% (-$6.51 → -$8.47).
Holdout win rate 63.40% → 65.50%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.06%.
Train profit -$4,603.85 → -$2,759.94. Holdout profit -$3,453.82 → -$2,273.40. Holdout max drawdown 36.65% → 24.62%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 13. Holdout streak 13 → 11.
Exits, full sample, challenger: target 4545, stop 2, EMA 2199, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0325. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-6.261 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 60 — 15m — REJECT — touch_tolerance_pct 0.001 → 0.0005

- At: 2026-11-15T09:03:29.620Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: touch_tolerance_pct 0.001 → 0.0005 (`daec36a88fcbf81fa3ce09c4bfb0810961c96b4100f5326b799833f9923a81f6`).
- Parameter: `touch_tolerance_pct`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: touch_tolerance_pct from 0.001 to 0.0005. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,055.35 | 381 |
| ETH/USD | -$7,221.95 | 421 | -$7,262.29 | 428 |
| SOL/USD | -$7,586.52 | 420 | -$7,620.76 | 428 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,467.26 | 84.46% | 84.69% | -0.1074 | -0.1078 |
| holdout | -$7,053.33 | -$7,096.64 | 71.05% | 71.49% | -0.1191 | -0.1201 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,447.76 to -$6,681.68.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,447.56 (884 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,964.86 (798 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,832.08 (727 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,907.54 (818 trades).

Full-sample trades: BTC/USD 991 → 1001, ETH/USD 1091 → 1104, SOL/USD 1109 → 1124.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1326 trades, profit -$2,218.09, mean trade -0.32%.
- bear: 763 trades, profit -$1,395.72, mean trade -0.35%.
- sideways: 2123 trades, profit -$3,482.83, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 1001 (champion 991), ETH/USD 1104 (champion 1091), SOL/USD 1124 (champion 1109), BNB/USD 1023 (champion 1010), XRP/USD 1114 (champion 1106), DOGE/USD 1099 (champion 1092), ADA/USD 1061 (champion 1056), AVAX/USD 1104 (champion 1094), LINK/USD 1074 (champion 1059), LTC/USD 1010 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,467.26.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,096.64. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 84.69%, holdout 71.05% → 71.49%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1201 did not clear hurdle 0.0487 (z=-21.874, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 9 of 16 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1201, hurdle 0.0487, z=-21.874. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10714 (28.288 → 28.571 per day). Holdout trades 4167 → 4212 (27.778 → 28.078 per day).
Per coin, full sample then holdout: BTC/USD 991→1001 full, 378→381 holdout; ETH/USD 1091→1104 full, 421→428 holdout; SOL/USD 1109→1124 full, 420→428 holdout; BNB/USD 1010→1023 full, 375→382 holdout; XRP/USD 1106→1114 full, 450→452 holdout; DOGE/USD 1092→1099 full, 413→414 holdout; ADA/USD 1056→1061 full, 421→423 holdout; AVAX/USD 1094→1104 full, 437→444 holdout; LINK/USD 1059→1074 full, 438→443 holdout; LTC/USD 1000→1010 full, 414→417 holdout.
Full-sample win rate 65.21% → 65.15%. Average win 0.20% → 0.20% ($0.63 → $0.62). Average loss -1.21% → -1.21% (-$3.76 → -$3.72).
Holdout win rate 63.40% → 63.30%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.14%.
Train profit -$8,444.69 → -$8,467.26. Holdout profit -$7,053.33 → -$7,096.64. Holdout max drawdown 71.05% → 71.49%.
Folds won 1 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6980, stop 1, EMA 3733, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1201. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, walk-forward, drawdown, deflated-sharpe. z=-21.874 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10714 (28.288 → 28.571 per day). Holdout trades 4167 → 4212 (27.778 → 28.078 per day).
Per coin, full sample then holdout: BTC/USD 991→1001 full, 378→381 holdout; ETH/USD 1091→1104 full, 421→428 holdout; SOL/USD 1109→1124 full, 420→428 holdout; BNB/USD 1010→1023 full, 375→382 holdout; XRP/USD 1106→1114 full, 450→452 holdout; DOGE/USD 1092→1099 full, 413→414 holdout; ADA/USD 1056→1061 full, 421→423 holdout; AVAX/USD 1094→1104 full, 437→444 holdout; LINK/USD 1059→1074 full, 438→443 holdout; LTC/USD 1000→1010 full, 414→417 holdout.
Full-sample win rate 65.21% → 65.15%. Average win 0.41% → 0.41% ($2.54 → $2.53). Average loss -1.05% → -1.05% (-$6.51 → -$6.47).
Holdout win rate 63.40% → 63.30%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.99%.
Train profit -$4,603.85 → -$4,619.78. Holdout profit -$3,453.82 → -$3,495.71. Holdout max drawdown 36.65% → 37.08%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6980, stop 1, EMA 3733, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0428. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, drawdown, deflated-sharpe. z=-7.481 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; pass walk-forward; fail drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 61 — 15m — REJECT — touch_tolerance_pct 0.001 → 0.002

- At: 2026-11-15T09:03:29.623Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: touch_tolerance_pct 0.001 → 0.002 (`b695505e1e57a1c4653e14284fa4ed5e4c432376114afd20a853fd68c5e50e77`).
- Parameter: `touch_tolerance_pct`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- One variable: touch_tolerance_pct from 0.001 to 0.002. Every other Livermore setting stays at CURRENT.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$6,905.84 | 360 |
| ETH/USD | -$7,221.95 | 421 | -$7,166.77 | 401 |
| SOL/USD | -$7,586.52 | 420 | -$7,530.80 | 407 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,404.20 | 84.46% | 84.06% | -0.1074 | -0.1071 |
| holdout | -$7,053.33 | -$6,934.46 | 71.05% | 69.86% | -0.1191 | -0.1166 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,288.96 to -$6,515.03.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,384.14 (852 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,859.05 (763 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,747.83 (688 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,957.29 (803 trades).

Full-sample trades: BTC/USD 991 → 959, ETH/USD 1091 → 1055, SOL/USD 1109 → 1080.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1268 trades, profit -$2,184.41, mean trade -0.32%.
- bear: 733 trades, profit -$1,369.16, mean trade -0.36%.
- sideways: 2022 trades, profit -$3,380.90, mean trade -0.26%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 959 (champion 991), ETH/USD 1055 (champion 1091), SOL/USD 1080 (champion 1109), BNB/USD 971 (champion 1010), XRP/USD 1068 (champion 1106), DOGE/USD 1067 (champion 1092), ADA/USD 1038 (champion 1056), AVAX/USD 1068 (champion 1094), LINK/USD 1032 (champion 1059), LTC/USD 975 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$8,404.20.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,934.46. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 3 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 84.06%, holdout 71.05% → 69.86%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1166 did not clear hurdle 0.0487 (z=-21.477, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 11 of 16 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1166, hurdle 0.0487, z=-21.477. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10313 (28.288 → 27.501 per day). Holdout trades 4167 → 4023 (27.778 → 26.818 per day).
Per coin, full sample then holdout: BTC/USD 991→959 full, 378→360 holdout; ETH/USD 1091→1055 full, 421→401 holdout; SOL/USD 1109→1080 full, 420→407 holdout; BNB/USD 1010→971 full, 375→366 holdout; XRP/USD 1106→1068 full, 450→430 holdout; DOGE/USD 1092→1067 full, 413→398 holdout; ADA/USD 1056→1038 full, 421→413 holdout; AVAX/USD 1094→1068 full, 437→425 holdout; LINK/USD 1059→1032 full, 438→421 holdout; LTC/USD 1000→975 full, 414→402 holdout.
Full-sample win rate 65.21% → 65.40%. Average win 0.20% → 0.20% ($0.63 → $0.63). Average loss -1.21% → -1.22% (-$3.76 → -$3.86).
Holdout win rate 63.40% → 63.76%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.16%.
Train profit -$8,444.69 → -$8,404.20. Holdout profit -$7,053.33 → -$6,934.46. Holdout max drawdown 71.05% → 69.86%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6745, stop 1, EMA 3567, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1166. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-21.477 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10313 (28.288 → 27.501 per day). Holdout trades 4167 → 4023 (27.778 → 26.818 per day).
Per coin, full sample then holdout: BTC/USD 991→959 full, 378→360 holdout; ETH/USD 1091→1055 full, 421→401 holdout; SOL/USD 1109→1080 full, 420→407 holdout; BNB/USD 1010→971 full, 375→366 holdout; XRP/USD 1106→1068 full, 450→430 holdout; DOGE/USD 1092→1067 full, 413→398 holdout; ADA/USD 1056→1038 full, 421→413 holdout; AVAX/USD 1094→1068 full, 437→425 holdout; LINK/USD 1059→1032 full, 438→421 holdout; LTC/USD 1000→975 full, 414→402 holdout.
Full-sample win rate 65.21% → 65.40%. Average win 0.41% → 0.41% ($2.54 → $2.54). Average loss -1.05% → -1.07% (-$6.51 → -$6.60).
Holdout win rate 63.40% → 63.76%. Average win 0.41% → 0.41%. Average loss -0.99% → -1.00%.
Train profit -$4,603.85 → -$4,621.46. Holdout profit -$3,453.82 → -$3,370.25. Holdout max drawdown 36.65% → 35.77%.
Folds won 2 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6745, stop 1, EMA 3567, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0415. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, walk-forward, drawdown, deflated-sharpe. z=-7.333 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; pass holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 62 — 15m — REJECT — Exit test: take_profit 0.005 → 0.01

- At: 2026-11-15T09:03:29.624Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: Exit test: take_profit 0.005 → 0.01 (`da37cc2f7d26e224f3407f500f348b784f05bc18b8c7be0f4e2095b11ee6aee5`).
- Parameter: `take_profit`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- Exit test. One variable: take_profit from 0.005 to 0.01. The entry settings stay at CURRENT. This is marked as an exit test and is not an entry-filter result.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$6,530.04 | 325 |
| ETH/USD | -$7,221.95 | 421 | -$6,292.78 | 357 |
| SOL/USD | -$7,586.52 | 420 | -$6,903.27 | 353 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$7,950.48 | 84.46% | 79.66% | -0.1074 | -0.0673 |
| holdout | -$7,053.33 | -$6,552.17 | 71.05% | 66.91% | -0.1191 | -0.0772 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,136.46 to -$5,821.62.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,147.18 (740 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,616.24 (683 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,612.13 (601 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,436.79 (699 trades).

Full-sample trades: BTC/USD 991 → 846, ETH/USD 1091 → 927, SOL/USD 1109 → 939.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1133 trades, profit -$2,059.67, mean trade -0.31%.
- bear: 644 trades, profit -$1,435.01, mean trade -0.39%.
- sideways: 1785 trades, profit -$3,057.49, mean trade -0.26%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 846 (champion 991), ETH/USD 927 (champion 1091), SOL/USD 939 (champion 1109), BNB/USD 847 (champion 1010), XRP/USD 947 (champion 1106), DOGE/USD 946 (champion 1092), ADA/USD 913 (champion 1056), AVAX/USD 941 (champion 1094), LINK/USD 910 (champion 1059), LTC/USD 847 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$7,950.48.
- pass `holdout`: Holdout profit -$7,053.33 → -$6,552.17. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 79.66%, holdout 71.05% → 66.91%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0772 did not clear hurdle 0.0487 (z=-15.576, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 2 of 3 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0772, hurdle 0.0487, z=-15.576. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 9063 (28.288 → 24.168 per day). Holdout trades 4167 → 3562 (27.778 → 23.745 per day).
Per coin, full sample then holdout: BTC/USD 991→846 full, 378→325 holdout; ETH/USD 1091→927 full, 421→357 holdout; SOL/USD 1109→939 full, 420→353 holdout; BNB/USD 1010→847 full, 375→316 holdout; XRP/USD 1106→947 full, 450→387 holdout; DOGE/USD 1092→946 full, 413→362 holdout; ADA/USD 1056→913 full, 421→367 holdout; AVAX/USD 1094→941 full, 437→383 holdout; LINK/USD 1059→910 full, 438→365 holdout; LTC/USD 1000→847 full, 414→347 holdout.
Full-sample win rate 65.21% → 46.93%. Average win 0.20% → 0.70% ($0.63 → $2.51). Average loss -1.21% → -1.17% (-$3.76 → -$4.15).
Holdout win rate 63.40% → 44.95%. Average win 0.20% → 0.70%. Average loss -1.15% → -1.11%.
Train profit -$8,444.69 → -$7,950.48. Holdout profit -$7,053.33 → -$6,552.17. Holdout max drawdown 71.05% → 66.91%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 36. Holdout streak 13 → 36.
Exits, full sample, challenger: target 4245, stop 2, EMA 4816, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0772. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-15.576 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 9063 (28.288 → 24.168 per day). Holdout trades 4167 → 3562 (27.778 → 23.745 per day).
Per coin, full sample then holdout: BTC/USD 991→846 full, 378→325 holdout; ETH/USD 1091→927 full, 421→357 holdout; SOL/USD 1109→939 full, 420→353 holdout; BNB/USD 1010→847 full, 375→316 holdout; XRP/USD 1106→947 full, 450→387 holdout; DOGE/USD 1092→946 full, 413→362 holdout; ADA/USD 1056→913 full, 421→367 holdout; AVAX/USD 1094→941 full, 437→383 holdout; LINK/USD 1059→910 full, 438→365 holdout; LTC/USD 1000→847 full, 414→347 holdout.
Full-sample win rate 65.21% → 47.17%. Average win 0.41% → 0.91% ($2.54 → $5.76). Average loss -1.05% → -1.02% (-$6.51 → -$6.45).
Holdout win rate 63.40% → 45.31%. Average win 0.41% → 0.91%. Average loss -0.99% → -0.96%.
Train profit -$4,603.85 → -$4,355.85. Holdout profit -$3,453.82 → -$3,398.28. Holdout max drawdown 36.65% → 37.45%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 36. Holdout streak 13 → 36.
Exits, full sample, challenger: target 4245, stop 2, EMA 4816, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0300. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: drawdown, deflated-sharpe. z=-5.845 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; fail drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 63 — 15m — REJECT — Exit test: take_profit 0.005 → 0.02

- At: 2026-11-15T09:03:29.624Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: Exit test: take_profit 0.005 → 0.02 (`db955d34179dd3fad2e2c984c13085a1ed89843aa8c5c01f940ab08e4218d314`).
- Parameter: `take_profit`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- Exit test. One variable: take_profit from 0.005 to 0.02. The entry settings stay at CURRENT. This is marked as an exit test and is not an entry-filter result.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$6,312.21 | 290 |
| ETH/USD | -$7,221.95 | 421 | -$5,673.15 | 314 |
| SOL/USD | -$7,586.52 | 420 | -$6,095.83 | 301 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$7,177.51 | 84.46% | 72.18% | -0.1074 | -0.0412 |
| holdout | -$7,053.33 | -$5,915.89 | 71.05% | 62.07% | -0.1191 | -0.0495 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$6,785.21 to -$4,711.48.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$1,550.08 (627 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,146.31 (562 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,384.86 (528 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,022.45 (593 trades).

Full-sample trades: BTC/USD 991 → 730, ETH/USD 1091 → 804, SOL/USD 1109 → 793.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 974 trades, profit -$1,792.39, mean trade -0.29%.
- bear: 563 trades, profit -$1,476.36, mean trade -0.43%.
- sideways: 1552 trades, profit -$2,647.14, mean trade -0.24%.

### Verdict

Rejected. Failed gates: deflated-sharpe. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 730 (champion 991), ETH/USD 804 (champion 1091), SOL/USD 793 (champion 1109), BNB/USD 745 (champion 1010), XRP/USD 794 (champion 1106), DOGE/USD 803 (champion 1092), ADA/USD 785 (champion 1056), AVAX/USD 813 (champion 1094), LINK/USD 781 (champion 1059), LTC/USD 729 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$7,177.51.
- pass `holdout`: Holdout profit -$7,053.33 → -$5,915.89. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 4 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 84.46% → 72.18%, holdout 71.05% → 62.07%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.0495 did not clear hurdle 0.0487 (z=-12.058, trials=33, variance=0.000532). The statistic is not a probability.
- pass `neighbours`: 2 of 2 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.0495, hurdle 0.0487, z=-12.058. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 7777 (28.288 → 20.739 per day). Holdout trades 4167 → 3089 (27.778 → 20.592 per day).
Per coin, full sample then holdout: BTC/USD 991→730 full, 378→290 holdout; ETH/USD 1091→804 full, 421→314 holdout; SOL/USD 1109→793 full, 420→301 holdout; BNB/USD 1010→745 full, 375→276 holdout; XRP/USD 1106→794 full, 450→324 holdout; DOGE/USD 1092→803 full, 413→313 holdout; ADA/USD 1056→785 full, 421→323 holdout; AVAX/USD 1094→813 full, 437→336 holdout; LINK/USD 1059→781 full, 438→317 holdout; LTC/USD 1000→729 full, 414→295 holdout.
Full-sample win rate 65.21% → 30.31%. Average win 0.20% → 1.57% ($0.63 → $6.56). Average loss -1.21% → -1.08% (-$3.76 → -$4.48).
Holdout win rate 63.40% → 29.04%. Average win 0.20% → 1.54%. Average loss -1.15% → -1.04%.
Train profit -$8,444.69 → -$7,177.51. Holdout profit -$7,053.33 → -$5,915.89. Holdout max drawdown 71.05% → 62.07%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 70. Holdout streak 13 → 70.
Exits, full sample, challenger: target 2123, stop 3, EMA 5650, flatten 1. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.0495. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-12.058 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 7777 (28.288 → 20.739 per day). Holdout trades 4167 → 3089 (27.778 → 20.592 per day).
Per coin, full sample then holdout: BTC/USD 991→730 full, 378→290 holdout; ETH/USD 1091→804 full, 421→314 holdout; SOL/USD 1109→793 full, 420→301 holdout; BNB/USD 1010→745 full, 375→276 holdout; XRP/USD 1106→794 full, 450→324 holdout; DOGE/USD 1092→803 full, 413→313 holdout; ADA/USD 1056→785 full, 421→323 holdout; AVAX/USD 1094→813 full, 437→336 holdout; LINK/USD 1059→781 full, 438→317 holdout; LTC/USD 1000→729 full, 414→295 holdout.
Full-sample win rate 65.21% → 32.07%. Average win 0.41% → 1.69% ($2.54 → $11.49). Average loss -1.05% → -0.95% (-$6.51 → -$6.48).
Holdout win rate 63.40% → 31.01%. Average win 0.41% → 1.64%. Average loss -0.99% → -0.91%.
Train profit -$4,603.85 → -$3,606.31. Holdout profit -$3,453.82 → -$3,033.70. Holdout max drawdown 36.65% → 36.01%.
Folds won 4 of 4. Longest losing streak, full sample, 15 → 48. Holdout streak 13 → 48.
Exits, full sample, challenger: target 2123, stop 3, EMA 5650, flatten 1. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0197. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: deflated-sharpe. z=-4.589 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; pass holdout; pass walk-forward; pass drawdown; fail deflated-sharpe; pass neighbours.

## Cycle 64 — 15m — REJECT — Exit test: stop_loss 0.1 → 0.02

- At: 2026-11-15T09:03:29.624Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: Exit test: stop_loss 0.1 → 0.02 (`c828887bebfb54ef785b5fd8d7d3aecee2d5448c67522e31bd0a99090d262abe`).
- Parameter: `stop_loss`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- Exit test. One variable: stop_loss from 0.1 to 0.02. The entry settings stay at CURRENT. This is marked as an exit test and is not an entry-filter result.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,022.27 | 378 |
| ETH/USD | -$7,221.95 | 421 | -$7,234.00 | 422 |
| SOL/USD | -$7,586.52 | 420 | -$7,505.05 | 421 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,492.37 | 84.46% | 84.94% | -0.1074 | -0.1105 |
| holdout | -$7,053.33 | -$7,127.50 | 71.05% | 71.78% | -0.1191 | -0.1270 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,480.68 to -$6,735.89.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,273.32 (878 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,961.65 (789 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,805.72 (715 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,909.94 (817 trades).

Full-sample trades: BTC/USD 991 → 993, ETH/USD 1091 → 1097, SOL/USD 1109 → 1114.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1331 trades, profit -$2,293.49, mean trade -0.33%.
- bear: 758 trades, profit -$1,325.82, mean trade -0.34%.
- sideways: 2108 trades, profit -$3,508.19, mean trade -0.26%.

### Verdict

Rejected. Failed gates: train, holdout, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 993 (champion 991), ETH/USD 1097 (champion 1091), SOL/USD 1114 (champion 1109), BNB/USD 1010 (champion 1010), XRP/USD 1115 (champion 1106), DOGE/USD 1098 (champion 1092), ADA/USD 1064 (champion 1056), AVAX/USD 1103 (champion 1094), LINK/USD 1066 (champion 1059), LTC/USD 1003 (champion 1000)).
- fail `train`: Train profit -$8,444.69 → -$8,492.37.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,127.50. Buy and hold on that window was -$590.56.
- pass `walk-forward`: Beat the champion on 3 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 84.94%, holdout 71.05% → 71.78%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1270 did not clear hurdle 0.0487 (z=-22.914, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 1 of 2 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1270, hurdle 0.0487, z=-22.914. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10663 (28.288 → 28.435 per day). Holdout trades 4167 → 4197 (27.778 → 27.978 per day).
Per coin, full sample then holdout: BTC/USD 991→993 full, 378→378 holdout; ETH/USD 1091→1097 full, 421→422 holdout; SOL/USD 1109→1114 full, 420→421 holdout; BNB/USD 1010→1010 full, 375→375 holdout; XRP/USD 1106→1115 full, 450→455 holdout; DOGE/USD 1092→1098 full, 413→418 holdout; ADA/USD 1056→1064 full, 421→427 holdout; AVAX/USD 1094→1103 full, 437→444 holdout; LINK/USD 1059→1066 full, 438→442 holdout; LTC/USD 1000→1003 full, 414→415 holdout.
Full-sample win rate 65.21% → 64.63%. Average win 0.20% → 0.20% ($0.63 → $0.61). Average loss -1.21% → -1.20% (-$3.76 → -$3.66).
Holdout win rate 63.40% → 62.85%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.14%.
Train profit -$8,444.69 → -$8,492.37. Holdout profit -$7,053.33 → -$7,127.50. Holdout max drawdown 71.05% → 71.78%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6892, stop 408, EMA 3363, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1270. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: train, holdout, drawdown, deflated-sharpe, neighbours. z=-22.914 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10663 (28.288 → 28.435 per day). Holdout trades 4167 → 4197 (27.778 → 27.978 per day).
Per coin, full sample then holdout: BTC/USD 991→993 full, 378→378 holdout; ETH/USD 1091→1097 full, 421→422 holdout; SOL/USD 1109→1114 full, 420→421 holdout; BNB/USD 1010→1010 full, 375→375 holdout; XRP/USD 1106→1115 full, 450→455 holdout; DOGE/USD 1092→1098 full, 413→418 holdout; ADA/USD 1056→1064 full, 421→427 holdout; AVAX/USD 1094→1103 full, 437→444 holdout; LINK/USD 1059→1066 full, 438→442 holdout; LTC/USD 1000→1003 full, 414→415 holdout.
Full-sample win rate 65.21% → 64.63%. Average win 0.41% → 0.41% ($2.54 → $2.48). Average loss -1.05% → -1.04% (-$6.51 → -$6.29).
Holdout win rate 63.40% → 62.85%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.98%.
Train profit -$4,603.85 → -$4,754.39. Holdout profit -$3,453.82 → -$3,589.23. Holdout max drawdown 36.65% → 37.96%.
Folds won 3 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6892, stop 408, EMA 3363, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0466. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: train, holdout, drawdown, deflated-sharpe, neighbours. z=-7.897 after 33 trials. The z is not a probability.

Binance gates: pass trades; fail train; fail holdout; pass walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Cycle 65 — 15m — REJECT — Exit test: stop_loss 0.1 → 0.05

- At: 2026-11-15T09:03:29.624Z
- Commit: `ef39322f278b877dcb73c29e73edac90a925ad10`
- Seed: 20261114
- Data: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip (BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD). 36384 bars, 2025-11-01 → 2026-11-14. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`.
- Binance probe: spot REST HTTP 451; usdt-m REST HTTP 451; klines from data.binance.vision futures/um.
- Champion: CURRENT Livermore ma_length=50, ma_slope_bars=3, flat_slope_pct=0.0001, tangle_bars=3, pivot_lookback=10, pivot_wing=1, touch_tolerance_pct=0.001, min_touches=1, confirm_bars=1, vol_multiplier=1.2, vol_lookback=20, take_profit=0.005, stop_loss=0.1 (`1910e2420a9d7725278e1da0347f0a1bd0987dd6e4e17e8607f070b769002c19`).
- Experiment: Exit test: stop_loss 0.1 → 0.05 (`83aeac191a0f5a167c6df73a4cc0cd237df0db22400aa42a94e1f58e2349201f`).
- Parameter: `stop_loss`.

### Why this experiment

- Quantum Livermore parameter sweep against CURRENT
- The experiment knob stored on this row is directionTf only because the ledger type is the V-Pro search. This is not a timeframe change. The parameter line is the variable that moved.
- The config object on the champion and the experiment is the published V-Pro baseline and is not the rule being scored. The hashes and labels are the Livermore specs.
- Exit test. One variable: stop_loss from 0.1 to 0.05. The entry settings stay at CURRENT. This is marked as an exit test and is not an entry-filter result.
- Scored against CURRENT. The skeptic is unchanged: 30 trades per coin, train, holdout, most walk-forward folds, drawdown, the deflated-Sharpe hurdle, and neighbour stability.
- The deflated-Sharpe trial count for this run is 33. Those trials are the cycles in this sweep. The z statistic is not a probability.
- The ledger numbers use the lab cost, 0.1% taker and 5 bps slippage on both sides. The Binance schedule is in the cycle notes. Seed 20261114.
- This does not edit the desk and does not write research/lab/candidate.json.
- Assumptions for the tape, the fills, and both cost models are on the OLD versus CURRENT cycle.

### Holdout, each coin on its own $10,000, after costs

| Coin | Champion profit | Champion trades | Challenger profit | Challenger trades |
| --- | ---: | ---: | ---: | ---: |
| BTC/USD | -$7,038.40 | 378 | -$7,038.40 | 378 |
| ETH/USD | -$7,221.95 | 421 | -$7,271.52 | 421 |
| SOL/USD | -$7,586.52 | 420 | -$7,586.52 | 420 |

### Combined book

| Window | Champion profit | Challenger profit | Champion max DD | Challenger max DD | Champion daily Sharpe | Challenger daily Sharpe |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| train | -$8,444.69 | -$8,443.87 | 84.46% | 84.46% | -0.1074 | -0.1074 |
| holdout | -$7,053.33 | -$7,065.58 | 71.05% | 71.18% | -0.1191 | -0.1206 |

Buy and hold on the holdout, equal weight, no costs: -$590.56.

Bootstrap 2.5 to 97.5 percent of holdout profit, block resample of daily returns, seed 20261114: champion -$7,401.97 to -$6,639.44; challenger -$7,419.07 to -$6,652.68.

Walk-forward folds (anchored, scored flat at each fold start):

- 2026-02-25 → 2026-03-25: champion -$2,416.55 (875 trades), challenger -$2,410.31 (875 trades).
- 2026-03-25 → 2026-04-22: champion -$1,953.50 (788 trades), challenger -$1,953.50 (788 trades).
- 2026-04-22 → 2026-05-20: champion -$1,818.26 (715 trades), challenger -$1,818.26 (715 trades).
- 2026-05-20 → 2026-06-17: champion -$1,913.56 (816 trades), challenger -$1,913.56 (816 trades).

Full-sample trades: BTC/USD 991 → 991, ETH/USD 1091 → 1091, SOL/USD 1109 → 1109.

Challenger holdout by BTC regime at the entry signal (bull above +5% over 20 days, bear below −5%):

- bull: 1317 trades, profit -$2,257.10, mean trade -0.32%.
- bear: 753 trades, profit -$1,372.42, mean trade -0.35%.
- sideways: 2100 trades, profit -$3,436.06, mean trade -0.26%.

### Verdict

Rejected. Failed gates: holdout, walk-forward, drawdown, deflated-sharpe, neighbours. The ledger verdict uses the lab cost. The Binance USDT-M sensitivity is REJECT. candidate.json was not written.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 991 (champion 991), ETH/USD 1091 (champion 1091), SOL/USD 1109 (champion 1109), BNB/USD 1010 (champion 1010), XRP/USD 1109 (champion 1106), DOGE/USD 1092 (champion 1092), ADA/USD 1056 (champion 1056), AVAX/USD 1094 (champion 1094), LINK/USD 1059 (champion 1059), LTC/USD 1000 (champion 1000)).
- pass `train`: Train profit -$8,444.69 → -$8,443.87.
- fail `holdout`: Holdout profit -$7,053.33 → -$7,065.58. Buy and hold on that window was -$590.56.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- fail `drawdown`: Max drawdown train 84.46% → 84.46%, holdout 71.05% → 71.18%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe -0.1206 did not clear hurdle 0.0487 (z=-21.995, trials=33, variance=0.000532). The statistic is not a probability.
- fail `neighbours`: 1 of 3 one-step neighbours beat the champion's holdout profit. A majority is required, so a one-cell spike does not pass.

Deflated Sharpe uses 33 trials. Daily Sharpe -0.1206, hurdle 0.0487, z=-21.995. The z statistic is not a probability and it is not a confidence.

### Cycle notes

**Lab cost.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10611 (28.288 → 28.296 per day). Holdout trades 4167 → 4170 (27.778 → 27.798 per day).
Per coin, full sample then holdout: BTC/USD 991→991 full, 378→378 holdout; ETH/USD 1091→1091 full, 421→421 holdout; SOL/USD 1109→1109 full, 420→420 holdout; BNB/USD 1010→1010 full, 375→375 holdout; XRP/USD 1106→1109 full, 450→453 holdout; DOGE/USD 1092→1092 full, 413→413 holdout; ADA/USD 1056→1056 full, 421→421 holdout; AVAX/USD 1094→1094 full, 437→437 holdout; LINK/USD 1059→1059 full, 438→438 holdout; LTC/USD 1000→1000 full, 414→414 holdout.
Full-sample win rate 65.21% → 65.22%. Average win 0.20% → 0.20% ($0.63 → $0.62). Average loss -1.21% → -1.21% (-$3.76 → -$3.76).
Holdout win rate 63.40% → 63.41%. Average win 0.20% → 0.20%. Average loss -1.15% → -1.15%.
Train profit -$8,444.69 → -$8,443.87. Holdout profit -$7,053.33 → -$7,065.58. Holdout max drawdown 71.05% → 71.18%.
Folds won 1 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6920, stop 18, EMA 3673, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.1191 → -0.1206. This is not a daily Sharpe and it is not a probability.

Skeptic on the lab cost: REJECT. Rejected. Failed gates: holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-21.995 after 33 trials. The z is not a probability.

**Binance USDT-M sensitivity.** Shared book, equal weight, $10,000.
Full-sample trades 10608 → 10611 (28.288 → 28.296 per day). Holdout trades 4167 → 4170 (27.778 → 27.798 per day).
Per coin, full sample then holdout: BTC/USD 991→991 full, 378→378 holdout; ETH/USD 1091→1091 full, 421→421 holdout; SOL/USD 1109→1109 full, 420→420 holdout; BNB/USD 1010→1010 full, 375→375 holdout; XRP/USD 1106→1109 full, 450→453 holdout; DOGE/USD 1092→1092 full, 413→413 holdout; ADA/USD 1056→1056 full, 421→421 holdout; AVAX/USD 1094→1094 full, 437→437 holdout; LINK/USD 1059→1059 full, 438→438 holdout; LTC/USD 1000→1000 full, 414→414 holdout.
Full-sample win rate 65.21% → 65.22%. Average win 0.41% → 0.41% ($2.54 → $2.54). Average loss -1.05% → -1.05% (-$6.51 → -$6.51).
Holdout win rate 63.40% → 63.41%. Average win 0.41% → 0.41%. Average loss -0.99% → -0.99%.
Train profit -$4,603.85 → -$4,601.00. Holdout profit -$3,453.82 → -$3,477.22. Holdout max drawdown 36.65% → 36.87%.
Folds won 1 of 4. Longest losing streak, full sample, 15 → 15. Holdout streak 13 → 13.
Exits, full sample, challenger: target 6920, stop 18, EMA 3673, flatten 0. Champion: target 6918, stop 1, EMA 3689, flatten 0.
Per-bar Sharpe, holdout, -0.0423 → -0.0431. This is not a daily Sharpe and it is not a probability.

Skeptic on the Binance cost: REJECT. Rejected. Failed gates: holdout, walk-forward, drawdown, deflated-sharpe, neighbours. z=-7.499 after 33 trials. The z is not a probability.

Binance gates: pass trades; pass train; fail holdout; fail walk-forward; fail drawdown; fail deflated-sharpe; fail neighbours.

## Quantum Livermore parameter sweep — reading, not an extra cycle

This reading is not a trial. The cycles above are the trials. `research/lab/candidate.json` was not written. `src/lib/desk` was not edited.

Tape: Binance USDT-M perpetual. Public data.binance.vision archive. Base-asset volume. Closed 15m bars. BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD. 2025-11-01T00:00:00.000Z → 2026-11-14T23:45:00.000Z. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`. Binance spot REST HTTP 451; Binance USDT-M REST HTTP 451; klines from data.binance.vision futures/um. BTC/USD gaps 0, dropped 0; ETH/USD gaps 0, dropped 0; SOL/USD gaps 0, dropped 0; BNB/USD gaps 0, dropped 0; XRP/USD gaps 0, dropped 0; DOGE/USD gaps 0, dropped 0; ADA/USD gaps 0, dropped 0; AVAX/USD gaps 0, dropped 0; LINK/USD gaps 0, dropped 0; LTC/USD gaps 0, dropped 0.

CURRENT against OLD. On lab costs, CURRENT has 9156 more full-sample trades (1452 to 10608), holdout profit -$1,556.19 to -$7,053.33 (lower by $5,497.14), and holdout max drawdown 16.04% to 71.05% (worse). The lab skeptic says REJECT. On Binance costs, CURRENT has 9156 more full-sample trades (1452 to 10608), holdout profit -$531.83 to -$3,453.82 (lower by $2,921.99), and holdout max drawdown 6.16% to 36.65% (worse). The Binance skeptic says REJECT.

Changes that raise the full-sample trade count against CURRENT: tangle_bars 3→0 (10608 to 13493 trades; trades up, but a profit or drawdown result is worse; lab REJECT); tangle_bars 3→1 (10608 to 12725 trades; trades up, but a profit or drawdown result is worse; lab REJECT); tangle_bars 3→2 (10608 to 11562 trades; trades up, but a profit or drawdown result is worse; lab REJECT); pivot_lookback 10→20 (10608 to 11957 trades; trades up, but a profit or drawdown result is worse; lab REJECT); pivot_lookback 10→30 (10608 to 12644 trades; trades up, but a profit or drawdown result is worse; lab REJECT); ma_slope_bars 3→5 (10608 to 10609 trades; trades up and net results not worse on both cost models; lab REJECT); flat_slope_pct 0.0001→0 (10608 to 10639 trades; trades up, but a profit or drawdown result is worse; lab REJECT); flat_slope_pct 0.0001→0.00005 (10608 to 10637 trades; trades up, but a profit or drawdown result is worse; lab REJECT); ma_length 50→20 (10608 to 11151 trades; trades up, but a profit or drawdown result is worse; lab REJECT); ma_length 50→34 (10608 to 10928 trades; trades up, but a profit or drawdown result is worse; lab REJECT); vol_multiplier 1.2→1 (10608 to 17347 trades; trades up, but a profit or drawdown result is worse; lab REJECT); touch_tolerance_pct 0.001→0.0005 (10608 to 10714 trades; trades up, but a profit or drawdown result is worse; lab REJECT); stop_loss 0.1→0.02 (10608 to 10663 trades; trades up, but a profit or drawdown result is worse; lab REJECT); stop_loss 0.1→0.05 (10608 to 10611 trades; trades up, but a profit or drawdown result is worse; lab REJECT).

Changes that lower lab-cost holdout profit against CURRENT (13 of the one-variable cycles): vol_multiplier 1.2→1 (-$7,053.33 to -$8,538.09); tangle_bars 3→0 (-$7,053.33 to -$7,861.11); tangle_bars 3→1 (-$7,053.33 to -$7,688.19); pivot_lookback 10→30 (-$7,053.33 to -$7,661.14); ma_length 50→20 (-$7,053.33 to -$7,429.14); pivot_lookback 10→20 (-$7,053.33 to -$7,378.79); tangle_bars 3→2 (-$7,053.33 to -$7,314.22); ma_length 50→34 (-$7,053.33 to -$7,290.31).

Recommended config, research suggestion, not accepted unless skeptic ACCEPTs. The suggestion is the single entry change ma_slope_bars 3 → 5. A combination of several one-variable changes was not run, so this is not a joint result. The skeptic's own verdict on each cycle is in the table. None of those verdicts is a probability.

```yaml
strategies:
  livermore:
    ma_length: 50
    ma_slope_bars: 5
    flat_slope_pct: 0.0001
    tangle_bars: 3
    pivot_lookback: 10
    pivot_wing: 1
    touch_tolerance_pct: 0.001
    min_touches: 1
    confirm_bars: 1
    vol_multiplier: 1.2
    vol_lookback: 20
    take_profit: 0.005
    stop_loss: 0.1
```

### One-variable results

| Change | Full trades | Lab holdout profit | Lab holdout max DD | Lab verdict | Binance holdout profit | Binance verdict |
| --- | ---: | ---: | ---: | --- | ---: | --- |
| CURRENT vs OLD | 1452 → 10608 | -$1,556.19 → -$7,053.33 | 16.04% → 71.05% | REJECT | -$531.83 → -$3,453.82 | REJECT |
| tangle_bars 3 → 0 | 10608 → 13493 | -$7,053.33 → -$7,861.11 | 71.05% → 78.99% | REJECT | -$3,453.82 → -$4,161.48 | REJECT |
| tangle_bars 3 → 1 | 10608 → 12725 | -$7,053.33 → -$7,688.19 | 71.05% → 77.30% | REJECT | -$3,453.82 → -$4,015.66 | REJECT |
| tangle_bars 3 → 2 | 10608 → 11562 | -$7,053.33 → -$7,314.22 | 71.05% → 73.62% | REJECT | -$3,453.82 → -$3,618.61 | REJECT |
| tangle_bars 3 → 5 | 10608 → 9220 | -$7,053.33 → -$6,466.97 | 71.05% → 65.23% | REJECT | -$3,453.82 → -$2,914.02 | REJECT |
| tangle_bars 3 → 8 | 10608 → 7715 | -$7,053.33 → -$5,787.30 | 71.05% → 58.52% | REJECT | -$3,453.82 → -$2,469.95 | REJECT |
| pivot_lookback 10 → 5 | 10608 → 8834 | -$7,053.33 → -$6,311.50 | 71.05% → 63.71% | REJECT | -$3,453.82 → -$2,803.78 | REJECT |
| pivot_lookback 10 → 20 | 10608 → 11957 | -$7,053.33 → -$7,378.79 | 71.05% → 74.24% | REJECT | -$3,453.82 → -$3,538.32 | REJECT |
| pivot_lookback 10 → 30 | 10608 → 12644 | -$7,053.33 → -$7,661.14 | 71.05% → 77.00% | REJECT | -$3,453.82 → -$3,905.21 | REJECT |
| pivot_wing 1 → 2 | 10608 → 7786 | -$7,053.33 → -$6,045.76 | 71.05% → 60.87% | REJECT | -$3,453.82 → -$2,925.79 | REJECT |
| pivot_wing 1 → 3 | 10608 → 5661 | -$7,053.33 → -$4,992.61 | 71.05% → 50.31% | REJECT | -$3,453.82 → -$2,370.11 | REJECT |
| ma_slope_bars 3 → 1 | 10608 → 10412 | -$7,053.33 → -$6,946.03 | 71.05% → 70.00% | REJECT | -$3,453.82 → -$3,330.25 | REJECT |
| ma_slope_bars 3 → 5 | 10608 → 10609 | -$7,053.33 → -$7,051.40 | 71.05% → 71.04% | REJECT | -$3,453.82 → -$3,449.51 | REJECT |
| ma_slope_bars 3 → 8 | 10608 → 10379 | -$7,053.33 → -$6,999.04 | 71.05% → 70.52% | REJECT | -$3,453.82 → -$3,419.58 | REJECT |
| flat_slope_pct 0.0001 → 0 | 10608 → 10639 | -$7,053.33 → -$7,064.04 | 71.05% → 71.16% | REJECT | -$3,453.82 → -$3,459.25 | REJECT |
| flat_slope_pct 0.0001 → 0.00005 | 10608 → 10637 | -$7,053.33 → -$7,063.48 | 71.05% → 71.15% | REJECT | -$3,453.82 → -$3,459.04 | REJECT |
| flat_slope_pct 0.0001 → 0.0002 | 10608 → 10378 | -$7,053.33 → -$6,947.94 | 71.05% → 70.02% | REJECT | -$3,453.82 → -$3,343.15 | REJECT |
| ma_length 50 → 20 | 10608 → 11151 | -$7,053.33 → -$7,429.14 | 71.05% → 74.52% | REJECT | -$3,453.82 → -$4,129.83 | REJECT |
| ma_length 50 → 34 | 10608 → 10928 | -$7,053.33 → -$7,290.31 | 71.05% → 73.32% | REJECT | -$3,453.82 → -$3,848.50 | REJECT |
| ma_length 50 → 100 | 10608 → 9677 | -$7,053.33 → -$6,671.76 | 71.05% → 67.41% | REJECT | -$3,453.82 → -$3,020.01 | REJECT |
| vol_multiplier 1.2 → 1 | 10608 → 17347 | -$7,053.33 → -$8,538.09 | 71.05% → 85.71% | REJECT | -$3,453.82 → -$4,849.26 | REJECT |
| vol_multiplier 1.2 → 1.5 | 10608 → 8538 | -$7,053.33 → -$6,206.08 | 71.05% → 62.65% | REJECT | -$3,453.82 → -$2,769.05 | REJECT |
| vol_multiplier 1.2 → 2 | 10608 → 6124 | -$7,053.33 → -$5,104.80 | 71.05% → 51.73% | REJECT | -$3,453.82 → -$2,176.04 | REJECT |
| min_touches 1 → 2 | 10608 → 3055 | -$7,053.33 → -$3,101.96 | 71.05% → 31.37% | REJECT | -$3,453.82 → -$1,325.43 | REJECT |
| min_touches 1 → 3 | 10608 → 434 | -$7,053.33 → -$511.13 | 71.05% → 5.31% | INSUFFICIENT | -$3,453.82 → -$177.31 | INSUFFICIENT |
| confirm_bars 1 → 2 | 10608 → 8067 | -$7,053.33 → -$6,130.94 | 71.05% → 61.80% | REJECT | -$3,453.82 → -$2,869.47 | REJECT |
| confirm_bars 1 → 3 | 10608 → 6746 | -$7,053.33 → -$5,369.83 | 71.05% → 54.29% | REJECT | -$3,453.82 → -$2,273.40 | REJECT |
| touch_tolerance_pct 0.001 → 0.0005 | 10608 → 10714 | -$7,053.33 → -$7,096.64 | 71.05% → 71.49% | REJECT | -$3,453.82 → -$3,495.71 | REJECT |
| touch_tolerance_pct 0.001 → 0.002 | 10608 → 10313 | -$7,053.33 → -$6,934.46 | 71.05% → 69.86% | REJECT | -$3,453.82 → -$3,370.25 | REJECT |
| exit take_profit 0.005 → 0.01 | 10608 → 9063 | -$7,053.33 → -$6,552.17 | 71.05% → 66.91% | REJECT | -$3,453.82 → -$3,398.28 | REJECT |
| exit take_profit 0.005 → 0.02 | 10608 → 7777 | -$7,053.33 → -$5,915.89 | 71.05% → 62.07% | REJECT | -$3,453.82 → -$3,033.70 | REJECT |
| exit stop_loss 0.1 → 0.02 | 10608 → 10663 | -$7,053.33 → -$7,127.50 | 71.05% → 71.78% | REJECT | -$3,453.82 → -$3,589.23 | REJECT |
| exit stop_loss 0.1 → 0.05 | 10608 → 10611 | -$7,053.33 → -$7,065.58 | 71.05% → 71.18% | REJECT | -$3,453.82 → -$3,477.22 | REJECT |

### Caveats

- Prices are Binance USDT-M 15-minute klines from the public archive at data.binance.vision, futures/um, base-asset volume, no API key. api.binance.com and fapi.binance.com return HTTP 451 from this location, so the REST kline routes were not used.
- The book trades the close of each 15-minute bar. A signal on that close fills at the next bar's open. Each window starts flat, with no pending confirmation carried in, and a position still open on the last bar is flattened at that close.
- Slope is the EMA's change over ma_slope_bars, divided by the EMA at the start of the window. Long requires the close above the EMA and a slope at least flat_slope_pct. Short is the mirror. A zero threshold still requires the EMA to be rising or falling. A close that crosses or lands on the EMA inside the last tangle_bars bars, including the current bar, stays flat. tangle_bars 0 turns that off.
- A swing high is strictly above the pivot_wing bars on each side. A swing low is strictly below them. At bar i the usable swings are those centered from i - pivot_lookback through i - pivot_wing. Highs and lows cluster separately. A price joins a cluster when it is within touch_tolerance_pct of that cluster's lowest price, and the level is the mean. min_touches 1 keeps every swing.
- The long breaks the highest resistance the close clears. The short breaks the lowest support. The breakout close is the first of confirm_bars holds. Volume is tested only on that breakout bar, against the prior vol_lookback bars, and vol_multiplier 1 turns the filter off.
- A stop and a target touched in one bar fill the stop. A stop gapping through the open fills at the open. The target fills at the target price. An EMA exit is a close back through the line, at that close.
- Size is equal notional: one position per coin, each allocated the same fraction of current equity, compounded in coin-list order. Stake starts at $10,000 for the shared book.
- The lab cost is 0.1% taker and 5 bps slippage on the entry and on every exit, including the target. No funding. The Binance USDT-M sensitivity is 0.05% taker on the entry, the stop, the EMA exit, and the flatten, 0.02% maker on the target, 2 bps adverse slippage on taker fills, and no extra slippage on the target.
- Funding is an assumption, not a historical print: 0.01% of notional per day, paid by longs and received by shorts, pro-rated from the entry bar's open to the exit time. Binance returned HTTP 451, so the perpetual funding history was not fetched. A stop on the entry bar accrues none. A close-based exit is stamped at the bar's close, 15 minutes after its open.
- The skeptic is unchanged. Its Sharpe is the per-bar equity Sharpe on this 15-minute book, not a daily Sharpe. The deflated-Sharpe z is a test statistic, not a probability. On --all, every cycle in this sweep is one trial. Neighbours are one grid step on the entry parameters, or on the two exit parameters for an exit test. They are not extra trials.
- Train is the first 60% of the bars after 384 bars of warmup. Holdout is the rest. Four walk-forward folds cover the second half of the train, each started flat. Seed 20261114. Nothing here edits the desk.
- The suggested config is not applied. An ACCEPT would still have stayed in the ledger only, and this run does not write a candidate file.

## MACD signal study — not a cycle

This section is not a cycle. It is not in `research/lab/ledger.jsonl`, it is not a trial for the V-Pro or Livermore search, and it does not write `research/lab/candidate.json`. `src/lib/desk` was not edited.

No MACD signal in this grid shows a positive edge after costs that survives the holdout, the non-overlapping replay, the stricter lab cost, Benjamini-Hochberg, and the walk-forward folds. No context filter clears that bar either. The skeptic was still run on the least-bad cell so the book test is on the record. A pass there would mean it lost less than buy-and-hold, or beat it, not that the event study found an edge.

The reading, the assumptions, and the machine-readable tables are in `docs/MACD_SIGNAL_STUDY.md`.
