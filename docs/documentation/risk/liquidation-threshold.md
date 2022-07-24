# Liquidation Threshold in details

Gearbox uses Chainlink price feeds (as do Aave and Compound) to estimate Credit Account’s Health Factors. The problem here is to set correct values of  Liquidation Thresholds, so that while a liquidation is in progress (a liquidation always takes some time), the price does not become too low,resulting in a loss of LP's funds. 

This problem can be formulated in math language as 

$$
LT \le 1 - dP- f_L-f_p,
$$
where $dP$ is max price drop during liquidation time, $f_L$ - liquidation fee (goes to liquidator), $f_p$ - liquidation premium. 

