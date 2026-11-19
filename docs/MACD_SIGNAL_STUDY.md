# MACD signal study

No MACD signal in this grid shows a positive edge after costs that survives the holdout, the non-overlapping replay, the stricter lab cost, Benjamini-Hochberg, and the walk-forward folds. No context filter clears that bar either. The skeptic was still run on the least-bad cell so the book test is on the record. A pass there would mean it lost less than buy-and-hold, or beat it, not that the event study found an edge.

12 Binance cells have a holdout bootstrap floor above zero, all on 1d. The largest is cross down below zero, 5/35/5, target 1, stop 1, 61 holdout trades. A floor above zero is not the claim. None of them also clears the 100-trade count, Benjamini-Hochberg, the lab-cost interval, and the walk-forward rule.

This is a research note. It does not change the desk, and it does not write `research/lab/candidate.json`.

## Sample

USDT-M tape 2025-11-01T00:00:00.000Z → 2026-11-14T23:45:00.000Z. Hash `506f0076542581be65ba6e8ee546eb99191c3f57e7615d090c484b892d4189ed`. BTC/USD, ETH/USD, SOL/USD, BNB/USD, XRP/USD, DOGE/USD, ADA/USD, AVAX/USD, LINK/USD, LTC/USD. Source: https://data.binance.vision/data/futures/um/monthly/klines/{symbol}/15m/{symbol}-15m-{yyyy-mm}.zip.

Pinned daily tape 2024-11-18 → 2026-11-13, 726 bars, hash `ea1894d6076c4e9305fd7c2b538af91c5deef84b08aa25921bbde1195806acbc`. bundled src/lib/desk/clocks.ts daily plus cached OKX 1Dutc. Scored only as a side panel on 12/26/9 at 1.5 / 1.

## How a number should be read

Hit rate is targets divided by all graded trades, timeouts included. The gross breakeven hit rate at 1.5 ATR versus 1 ATR is 40 percent. The cost-adjusted breakeven is higher and is the median across the trades in that cell. A timeout is marked to market, so expectancy can be negative even when the hit rate sits above 40 percent, and positive even when it sits below.

The bootstrap interval is the 2.5th and 97.5th percent of resampled means. q is the Benjamini-Hochberg score. The deflated-Sharpe z is a test statistic. None of these is a probability that the edge is real.

Confirmatory family size after dropping cells with fewer than 30 holdout trades: 768. Context family size, both sides at least 100 holdout trades, reference bracket 1.5 / 1.0, Binance cost: 269. The rule inside q is 0.05, used as a cutoff for the procedure, not as a probability.

## Reference bracket, 12/26/9, target 1.5 ATR, stop 1 ATR, Binance cost, holdout

| Signal | TF | N | Hit | Gross BE | Cost BE | Mean R | Boot R | Exp % | PF | Bars | Timeouts | Lab mean R | q |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: | ---: | ---: | ---: | ---: |
| cross up below zero | 15m | 3623 | 37.0% | 40.0% | 54.7% | -0.456 | -0.533 to -0.380 | -0.144% | 0.57 | 4.0 | 124 | -0.942 | 1.000 |
| cross up below zero | 1d | 24 | 50.0% | 40.0% | 41.3% | 0.244 | -0.409 to 0.891 | 0.947% | 1.43 | 2.0 | 1 | 0.203 | n/a |
| cross up below zero | 1h | 948 | 37.2% | 40.0% | 46.9% | -0.199 | -0.334 to -0.073 | -0.160% | 0.73 | 4.0 | 41 | -0.418 | 1.000 |
| cross up below zero | 4h | 288 | 33.3% | 40.0% | 43.4% | -0.252 | -0.460 to -0.044 | -0.488% | 0.61 | 4.0 | 2 | -0.357 | 1.000 |
| cross up above zero | 15m | 2121 | 38.5% | 40.0% | 56.0% | -0.502 | -0.626 to -0.381 | -0.143% | 0.55 | 3.0 | 32 | -1.051 | 1.000 |
| cross up above zero | 1d | 23 | 47.8% | 40.0% | 41.2% | 0.160 | -0.385 to 0.810 | 0.104% | 1.04 | 2.0 | 0 | 0.119 | n/a |
| cross up above zero | 1h | 450 | 38.2% | 40.0% | 47.4% | -0.242 | -0.403 to -0.048 | -0.139% | 0.76 | 3.0 | 6 | -0.483 | 1.000 |
| cross up above zero | 4h | 92 | 41.3% | 40.0% | 43.6% | -0.061 | -0.321 to 0.217 | -0.126% | 0.89 | 3.0 | 0 | -0.168 | 1.000 |
| cross down above zero | 15m | 3635 | 37.3% | 40.0% | 55.2% | -0.489 | -0.565 to -0.409 | -0.150% | 0.55 | 4.0 | 79 | -1.006 | 1.000 |
| cross down above zero | 1d | 36 | 27.8% | 40.0% | 41.2% | -0.204 | -0.616 to 0.185 | -0.787% | 0.74 | 4.5 | 2 | -0.242 | 1.000 |
| cross down above zero | 1h | 829 | 39.3% | 40.0% | 47.2% | -0.167 | -0.321 to -0.023 | -0.128% | 0.78 | 4.0 | 25 | -0.396 | 1.000 |
| cross down above zero | 4h | 187 | 42.8% | 40.0% | 43.4% | 0.052 | -0.163 to 0.286 | 0.141% | 1.13 | 4.0 | 6 | -0.049 | 1.000 |
| cross down below zero | 15m | 2115 | 41.5% | 40.0% | 55.1% | -0.385 | -0.479 to -0.287 | -0.120% | 0.62 | 3.0 | 19 | -0.885 | 1.000 |
| cross down below zero | 1d | 20 | 35.0% | 40.0% | 41.2% | -0.083 | -0.734 to 0.689 | -0.483% | 0.85 | 5.0 | 0 | -0.117 | n/a |
| cross down below zero | 1h | 569 | 38.0% | 40.0% | 46.8% | -0.220 | -0.385 to -0.060 | -0.227% | 0.64 | 3.0 | 10 | -0.444 | 1.000 |
| cross down below zero | 4h | 193 | 39.4% | 40.0% | 43.2% | -0.055 | -0.284 to 0.185 | -0.068% | 0.94 | 3.0 | 3 | -0.155 | 1.000 |
| zero cross up | 15m | 2617 | 39.1% | 40.0% | 55.7% | -0.462 | -0.541 to -0.390 | -0.131% | 0.58 | 3.0 | 48 | -0.987 | 1.000 |
| zero cross up | 1d | 15 | 73.3% | 40.0% | 41.6% | 0.792 | 0.456 to 1.127 | 2.729% | 3.39 | 2.0 | 0 | 0.744 | n/a |
| zero cross up | 1h | 682 | 36.1% | 40.0% | 47.5% | -0.275 | -0.418 to -0.133 | -0.185% | 0.68 | 3.0 | 21 | -0.518 | 1.000 |
| zero cross up | 4h | 168 | 33.3% | 40.0% | 43.6% | -0.267 | -0.541 to 0.047 | -0.453% | 0.61 | 3.0 | 0 | -0.382 | 1.000 |
| zero cross down | 15m | 2617 | 38.7% | 40.0% | 55.6% | -0.465 | -0.539 to -0.388 | -0.141% | 0.56 | 3.0 | 40 | -0.988 | 1.000 |
| zero cross down | 1d | 15 | 60.0% | 40.0% | 41.2% | 0.555 | -0.316 to 1.267 | 3.707% | 3.68 | 6.0 | 0 | 0.514 | n/a |
| zero cross down | 1h | 682 | 38.3% | 40.0% | 47.2% | -0.200 | -0.359 to -0.032 | -0.161% | 0.73 | 3.0 | 20 | -0.430 | 1.000 |
| zero cross down | 4h | 175 | 42.3% | 40.0% | 43.4% | 0.045 | -0.224 to 0.323 | -0.015% | 0.99 | 3.0 | 7 | -0.059 | 1.000 |

MFE and MAE percentiles for these rows are in the CSV. The median favorable excursion and the median adverse excursion, in R, sit in that file under `mfe_p50` and `mae_p50`.

## Cells closest to a positive holdout

Highest Binance holdout mean R among USDT-M cells with at least 100 holdout trades. A positive number here is not a claim.

| Signal | MACD | TF | Target | Stop | N | Mean R | Boot low | Plain N | Plain low | Train R | Folds | q | Survives |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | --- |
| cross down above zero | 5/35/5 | 4h | 3 | 1.5 | 278 | 0.170 | -0.106 | 232 | -0.070 | 0.140 | 2/4 | 0.877 | no |
| cross down above zero | 12/26/9 | 4h | 3 | 1.5 | 187 | 0.159 | -0.133 | 179 | -0.142 | 0.177 | 2/4 | 1.000 | no |
| cross down above zero | 5/35/5 | 4h | 2 | 1.5 | 278 | 0.147 | -0.059 | 238 | -0.077 | 0.052 | 1/4 | 0.877 | no |
| cross down above zero | 8/21/5 | 4h | 2 | 1.5 | 260 | 0.146 | -0.089 | 237 | -0.082 | 0.053 | 1/4 | 0.877 | no |
| cross down above zero | 8/21/5 | 4h | 1.5 | 1.5 | 260 | 0.142 | -0.046 | 239 | -0.077 | -0.050 | 1/4 | 0.836 | no |
| cross down above zero | 8/21/5 | 4h | 3 | 1.5 | 260 | 0.132 | -0.136 | 234 | -0.161 | 0.131 | 2/4 | 1.000 | no |
| cross down above zero | 12/26/9 | 4h | 2 | 1.5 | 187 | 0.129 | -0.121 | 180 | -0.123 | 0.179 | 2/4 | 1.000 | no |
| cross down above zero | 12/26/9 | 4h | 2 | 1 | 187 | 0.122 | -0.160 | 183 | -0.165 | 0.289 | 2/4 | 1.000 | no |
| cross down above zero | 5/35/5 | 4h | 1.5 | 1.5 | 278 | 0.111 | -0.073 | 241 | -0.089 | -0.031 | 1/4 | 0.877 | no |
| zero cross down | 12/26/9 | 4h | 2 | 1.5 | 175 | 0.099 | -0.178 | 169 | -0.158 | -0.048 | 1/4 | 1.000 | no |
| zero cross down | 12/26/9 | 4h | 1.5 | 1.5 | 175 | 0.082 | -0.159 | 171 | -0.143 | -0.058 | 1/4 | 1.000 | no |
| cross down above zero | 5/35/5 | 4h | 2 | 0.75 | 278 | 0.077 | -0.227 | 269 | -0.198 | 0.046 | 0/4 | 1.000 | no |

Cells that pass every pre-registered gate: 0.

## Holdout intervals above zero

Every USDT-M Binance cell whose holdout bootstrap floor is above zero. Daily N is one year of resampled bars, shared across ten coins.

| Signal | MACD | TF | Target | Stop | N | Mean R | Boot low | Train R | Plain low | Folds | q | Lab boot low |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| cross down below zero | 5/35/5 | 1d | 1 | 1 | 61 | 0.340 | 0.059 | 0.021 | 0.030 | 1/2 | 0.836 | -0.014 |
| cross down below zero | 5/35/5 | 1d | 1 | 1.5 | 61 | 0.256 | 0.034 | -0.125 | -0.036 | 0/2 | 0.836 | 0.004 |
| cross up above zero | 8/21/5 | 1d | 1.5 | 1 | 27 | 0.629 | 0.164 | -0.556 | 0.117 | 0/1 | n/a | 0.122 |
| zero cross down | 12/26/9 | 1d | 3 | 0.75 | 15 | 1.599 | 0.054 | 0.974 | 0.017 | 2/4 | n/a | -0.135 |
| zero cross down | 12/26/9 | 1d | 2 | 0.75 | 15 | 1.088 | 0.007 | 0.377 | 0.003 | 1/4 | n/a | -0.059 |
| zero cross up | 12/26/9 | 1d | 3 | 1.5 | 15 | 0.884 | 0.042 | -0.665 | 0.061 | 1/3 | n/a | 0.078 |
| zero cross up | 12/26/9 | 1d | 1.5 | 1 | 15 | 0.792 | 0.456 | -0.277 | 0.454 | 1/3 | n/a | 0.252 |
| zero cross up | 12/26/9 | 1d | 2 | 1.5 | 15 | 0.782 | 0.310 | -0.416 | 0.310 | 1/3 | n/a | 0.233 |
| zero cross up | 12/26/9 | 1d | 2 | 1 | 15 | 0.758 | 0.162 | -0.371 | 0.163 | 1/3 | n/a | 0.119 |
| zero cross up | 12/26/9 | 1d | 1.5 | 1.5 | 15 | 0.624 | 0.331 | -0.262 | 0.329 | 1/3 | n/a | 0.302 |
| zero cross up | 12/26/9 | 1d | 1 | 1 | 15 | 0.425 | 0.155 | -0.169 | 0.155 | 1/3 | n/a | -0.013 |
| zero cross up | 12/26/9 | 1d | 1 | 1.5 | 15 | 0.417 | 0.197 | -0.217 | 0.197 | 1/3 | n/a | 0.167 |

## What the one-slot grader would have counted

Full sample, 12/26/9, target 1.5, stop 1, no costs in the original hit rate. The original reconstruction keeps one open slot per type, fills at the signal close, and counts a timeout as a failed sample. Corrected N grades every signal from the next open. Ignored is the count the slot dropped.

| Signal | TF | Original N | Original hit | Ignored | Corrected N | Corrected hit |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| cross up below zero | 15m | 9118 | 36.2% | 157 | 9275 | 36.1% |
| cross up above zero | 15m | 4866 | 37.6% | 304 | 5170 | 37.4% |
| cross down above zero | 15m | 8738 | 38.8% | 183 | 8921 | 38.8% |
| cross down below zero | 15m | 5261 | 40.7% | 266 | 5527 | 40.4% |
| zero cross up | 15m | 6453 | 36.7% | 85 | 6538 | 36.5% |
| zero cross down | 15m | 6468 | 39.6% | 77 | 6545 | 39.8% |
| cross up below zero | 1h | 2364 | 37.9% | 38 | 2402 | 37.7% |
| cross up above zero | 1h | 1037 | 38.7% | 39 | 1076 | 38.5% |
| cross down above zero | 1h | 2018 | 42.7% | 38 | 2056 | 42.9% |
| cross down below zero | 1h | 1353 | 40.4% | 73 | 1426 | 40.8% |
| zero cross up | 1h | 1622 | 36.4% | 28 | 1650 | 36.6% |
| zero cross down | 1h | 1635 | 40.9% | 24 | 1659 | 40.7% |
| cross up below zero | 4h | 673 | 36.3% | 12 | 685 | 36.5% |
| cross up above zero | 4h | 222 | 43.7% | 12 | 234 | 42.7% |
| cross down above zero | 4h | 478 | 45.2% | 6 | 484 | 45.2% |
| cross down below zero | 4h | 415 | 40.0% | 30 | 445 | 40.0% |
| zero cross up | 4h | 418 | 32.5% | 4 | 422 | 32.5% |
| zero cross down | 4h | 417 | 39.8% | 5 | 422 | 39.1% |
| cross up below zero | 1d | 68 | 41.2% | 5 | 73 | 43.8% |
| cross up above zero | 1d | 33 | 51.5% | 0 | 33 | 51.5% |
| cross down above zero | 1d | 65 | 40.0% | 0 | 65 | 40.0% |
| cross down below zero | 1d | 46 | 17.4% | 4 | 50 | 18.0% |
| zero cross up | 1d | 50 | 42.0% | 2 | 52 | 42.3% |
| zero cross down | 1d | 51 | 51.0% | 1 | 52 | 50.0% |

## Drift against a time-matched random entry

Signed gross return from the entry open to the close `h` bars later, 12/26/9, minus the same-side random entry. The interval is on that difference. A positive difference is not a tradable edge: it is still before the bracket, and the net columns are the Binance round trip to that close.

| Signal | TF | h | N | Signal | Control | Diff | Boot diff | Signal net | Control net |
| --- | --- | ---: | ---: | ---: | ---: | ---: | --- | ---: | ---: |
| cross up below zero | 15m | 20 | 9269 | -0.025% | -0.034% | 0.009% | -0.085% to 0.095% | -0.165% | -0.173% |
| cross up above zero | 15m | 20 | 5170 | -0.048% | -0.019% | -0.029% | -0.140% to 0.087% | -0.188% | -0.159% |
| cross down above zero | 15m | 20 | 8921 | 0.081% | 0.062% | 0.019% | -0.075% to 0.100% | -0.059% | -0.078% |
| cross down below zero | 15m | 20 | 5517 | 0.086% | 0.036% | 0.050% | -0.076% to 0.193% | -0.054% | -0.104% |
| zero cross up | 15m | 20 | 6538 | -0.064% | -0.021% | -0.043% | -0.124% to 0.042% | -0.204% | -0.161% |
| zero cross down | 15m | 20 | 6545 | 0.118% | 0.065% | 0.053% | -0.039% to 0.143% | -0.022% | -0.075% |
| cross up below zero | 1h | 20 | 2397 | -0.011% | -0.051% | 0.041% | -0.318% to 0.379% | -0.151% | -0.191% |
| cross up above zero | 1h | 20 | 1076 | -0.009% | 0.019% | -0.028% | -0.485% to 0.482% | -0.149% | -0.121% |
| cross down above zero | 1h | 20 | 2056 | 0.244% | 0.150% | 0.095% | -0.267% to 0.413% | 0.104% | 0.009% |
| cross down below zero | 1h | 20 | 1421 | 0.032% | 0.176% | -0.144% | -0.556% to 0.356% | -0.108% | 0.035% |
| zero cross up | 1h | 20 | 1650 | -0.133% | -0.246% | 0.113% | -0.269% to 0.509% | -0.273% | -0.385% |
| zero cross down | 1h | 20 | 1659 | 0.253% | 0.265% | -0.012% | -0.318% to 0.271% | 0.113% | 0.125% |
| cross up below zero | 4h | 20 | 681 | -1.103% | -0.007% | -1.096% | -2.464% to 0.074% | -1.241% | -0.147% |
| cross up above zero | 4h | 20 | 234 | -0.387% | -0.498% | 0.110% | -1.173% to 1.295% | -0.527% | -0.637% |
| cross down above zero | 4h | 20 | 483 | 0.726% | 1.127% | -0.401% | -1.551% to 0.737% | 0.585% | 0.986% |
| cross down below zero | 4h | 20 | 432 | 0.328% | 1.088% | -0.760% | -2.247% to 0.764% | 0.188% | 0.947% |
| zero cross up | 4h | 20 | 422 | -0.582% | -0.736% | 0.154% | -1.142% to 1.658% | -0.721% | -0.875% |
| zero cross down | 4h | 20 | 421 | 0.250% | 0.534% | -0.284% | -1.487% to 1.026% | 0.109% | 0.393% |
| cross up below zero | 1d | 20 | 67 | 4.460% | -3.189% | 7.649% | 2.754% to 12.249% | 4.314% | -3.324% |
| cross up above zero | 1d | 20 | 33 | 3.460% | -0.328% | 3.787% | -3.369% to 10.790% | 3.315% | -0.467% |
| cross down above zero | 1d | 20 | 65 | 7.951% | 4.595% | 3.355% | -11.514% to 19.204% | 7.800% | 4.449% |
| cross down below zero | 1d | 20 | 44 | -6.430% | 4.796% | -11.226% | -17.009% to -5.676% | -6.561% | 4.650% |
| zero cross up | 1d | 20 | 52 | -2.795% | -2.033% | -0.762% | -10.207% to 8.383% | -2.931% | -2.170% |
| zero cross down | 1d | 20 | 52 | 14.340% | 0.961% | 13.379% | 3.953% to 24.367% | 14.180% | 0.820% |

The full 1-to-50 curve is in `research/lab/data/macd-signal-drift.csv`.

The 20-bar drift difference sits above zero for cross up below zero on 1d (N=67); zero cross down on 1d (N=52). That is a gross path, not the costed bracket, and the samples are the short daily ones.

## Pinned daily tape

12/26/9, target 1.5, stop 1, Binance cost, holdout. The pinned tape is BTC, ETH and SOL on the bundled daily series. The USDT-M row is the same three coins resampled from the 15-minute archive, so the windows are not the same years.

| Panel | Signal | N | Hit | Mean R | Boot R |
| --- | --- | ---: | ---: | ---: | --- |
| usdt-m-3 | cross up below zero | 6 | 66.7% | 0.624 | -0.215 to 1.461 |
| usdt-m-3 | cross up above zero | 6 | 50.0% | 0.206 | -0.633 to 1.046 |
| usdt-m-3 | cross down above zero | 11 | 27.3% | -0.232 | -0.704 to 0.231 |
| usdt-m-3 | cross down below zero | 4 | 25.0% | -0.347 | -0.986 to 0.293 |
| usdt-m-3 | zero cross up | 6 | 50.0% | 0.206 | -0.630 to 1.034 |
| usdt-m-3 | zero cross down | 6 | 50.0% | 0.261 | -1.026 to 1.552 |
| pinned | cross up below zero | 12 | 58.3% | 0.421 | -0.613 to 1.249 |
| pinned | cross up above zero | 9 | 44.4% | 0.067 | -0.493 to 0.627 |
| pinned | cross down above zero | 17 | 29.4% | -0.205 | -0.798 to 0.395 |
| pinned | cross down below zero | 7 | 14.3% | -0.620 | -0.988 to -0.250 |
| pinned | zero cross up | 15 | 40.0% | -0.039 | -0.538 to 0.460 |
| pinned | zero cross down | 15 | 33.3% | -0.154 | -0.813 to 0.360 |

## Context

No context split had two adequate holdout buckets, the same sign on the train, a bootstrap difference away from zero, a positive favored mean whose own bootstrap floor is above zero, and a q score at or under the cutoff.

Separating a bad bucket from a worse one is not the same thing. 54 contrasts have a q score at or under the cutoff, and none of those favored buckets has a bootstrap floor above zero. The least-negative examples:

| Filter | Signal | MACD | TF | Yes N | Yes R | Yes floor | No R | q |
| --- | --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
| EMA200 slope agrees | cross up below zero | 8/21/5 | 4h | 141 | 0.050 | -0.231 | -0.358 | 0.009 |
| US session vs Asia | cross down above zero | 12/26/9 | 1h | 272 | 0.013 | -0.237 | -0.324 | 0.006 |
| US session vs Asia | cross up below zero | 12/26/9 | 1h | 247 | -0.126 | -0.322 | -0.397 | 0.032 |
| EMA200 slope agrees | cross up above zero | 5/35/5 | 15m | 2757 | -0.422 | -0.520 | -0.612 | 0.000 |
| EMA200 slope agrees | cross up above zero | 8/21/5 | 15m | 2146 | -0.425 | -0.538 | -0.600 | 0.001 |
| EMA200 slope agrees | cross up above zero | 12/26/9 | 15m | 1465 | -0.430 | -0.560 | -0.665 | 0.001 |

## Skeptic

No cell survived the pre-registered bar. The skeptic book is the highest holdout mean R among cells with at least 100 train and 100 holdout trades. That selection is not itself a passed claim.

Chosen cell: cross down above zero, 5/35/5, 4h, target 3, stop 1.5. Holdout mean R 0.170. Non-overlapping holdout mean R 0.195 on 232 trades.

Event-study deflated Sharpe on the chosen cell's non-overlapping holdout trade R: z=-6.556, hurdle 0.5663, trials 768. This z is not a probability. Overlapping trades were removed before this Sharpe was computed. Trades still cluster in time, so the observation count is not an independent sample.

**cross down above zero 5/35/5 4h 3/1.5.** Verdict REJECT. Holdout book $1285.90 against buy-and-hold -$595.93. Trades in the holdout book: 232.

Rejected. Failed gates: walk-forward, deflated-sharpe.

This cell did not clear the event-study bar. The book is a check, not a promotion. Costs on this book are the Binance taker schedule. The skeptic's own trial count is the neighbour set, 3. That count does not include the grid search. The grid search is in the Benjamini-Hochberg family and in the event-study deflated Sharpe.

- pass `trades`: Each coin closed at least 30 trades on the full sample (BTC/USD 66 (champion 1), ETH/USD 66 (champion 1), SOL/USD 65 (champion 1), BNB/USD 72 (champion 1), XRP/USD 44 (champion 1), DOGE/USD 55 (champion 1), ADA/USD 48 (champion 1), AVAX/USD 63 (champion 1), LINK/USD 61 (champion 1), LTC/USD 64 (champion 1)).
- pass `train`: Train profit -$3,915.58 → $2,859.17.
- pass `holdout`: Holdout profit -$595.93 → $1,285.90. Buy and hold on that window was -$533.59.
- fail `walk-forward`: Beat the champion on 1 of 4 anchored folds. Most means more than half.
- pass `drawdown`: Max drawdown train 57.67% → 12.40%, holdout 36.89% → 5.54%. No worse means less than or equal to the champion on both windows.
- fail `deflated-sharpe`: Holdout daily Sharpe 0.0373 did not clear hurdle 0.0099 (z=0.855, trials=3, variance=0.000134). The statistic is not a probability.
- pass `neighbours`: 2 of 2 one-step neighbours beat the champion's holdout profit, which is a majority.

Deflated Sharpe inside this skeptic call: z=0.855 after 3 trials. That z is not a probability.

## Assumptions

- Prices for the confirmatory sample are Binance USDT-M 15-minute klines from data.binance.vision, futures/um, ten coins, no API key. Higher timeframes are resampled from those bars. A bucket that is short a 15-minute bar is dropped.
- The pinned daily tape is the lab's bundled daily series plus the saved extension, BTC/USD, ETH/USD and SOL/USD only. It is a different market from the USDT-M archive and is not in the confirmatory family.
- MACD is the TradingView definition: EMA seeded with an SMA, fast minus slow, signal EMA of that line. The settings are 12/26/9, 8/21/5 and 5/35/5. ATR is Wilder 14.
- A signal-line cross is below zero when the MACD line on that bar is negative, and above zero otherwise. A zero-line cross on the same bar is a second event. Events are not one slot.
- The fill is the next bar's open. The bracket is that entry plus or minus the signal bar's ATR. The same bar cannot be seen before it closes, and a higher-timeframe MACD value is used only after that higher bar has closed.
- Horizon is 20 bars from the entry bar. Stop before target. A gap through the stop fills at the open. A gap through the target fills at the target. A completed horizon exits at that close and is a timeout, not a failure. A trade that runs off the tape is censored at the last close.
- R is the net return divided by the fractional distance to the stop. Costs are charged on the entry and the exit. The Binance model is 0.05% taker and 2 bps slippage per side. The lab model is 0.1% and 5 bps per side. Funding was not applied: the historical funding print was not fetched.
- Train and holdout on the USDT-M tape use the archive's own train and holdout timestamps. Walk-forward folds are the lab's four anchored folds inside the train. The pinned daily tape uses 2025-02-06 and 2026-02-25.
- The random-entry baseline takes the same side at a bar in the same UTC weekday and session, outside a 20-bar window around the signal. The drift is the signed close-to-close move from the entry open, 1 to 50 bars.
- Context tags are known at the signal close: EMA200 side and 20-bar slope, ATR percentile over 200 bars, histogram change, regular divergence with pivot wing 5 active for 10 bars, and the higher timeframe's already-closed MACD histogram. Unknown tags are left out of that split.
- Benjamini-Hochberg is applied to the one-sided Student-t tail of holdout mean R on the Binance family. A second family is the Welch tail of each context contrast that has 100 holdout trades on both sides. q is not a probability.
- The skeptic is the lab's unchanged judge, run on a one-position-per-coin book against buy-and-hold after the same costs. Its deflated-Sharpe trial count is that book's neighbour set. The search across the grid is charged in the event-study BH and in a separate deflated Sharpe on non-overlapping trade R. Neither z is a probability.
- Bootstrap resample count is 1000, seed 20261114, moving blocks of about sqrt(N). The 2.5 and 97.5 percent order statistics are a resampling summary, not a confidence that a true edge sits inside them.

## Files

- `research/lab/data/macd-signal-study.json`
- `research/lab/data/macd-signal-cells.csv`
- `research/lab/data/macd-signal-context.csv`
- `research/lab/data/macd-signal-drift.csv`
- `tradingview/macd_signal_lab.pine` is the chart grader. It is not this backtest.

