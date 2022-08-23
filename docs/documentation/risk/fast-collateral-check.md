# How Fast Check work

## Attack sequence description

1. Attacker opens a Credit Account denominated in ETH (for example).
2. Attacker takes flash loan, and changes USDC/ETH rate in Uniswap to pay more in ETH that normal rate.
3. Attacker swaps all ETH to USDC.
4. Attacker uses flashloan to change USDC/ETH rate on Uniswap to pay less than normal rate.
5. Attacker swaps UDSC back to ETH.
6. Attacker now has less ETH than at the beginning. Attacker repeats it in one block until he's drained all funds from `Credit Account`.
7. Then account will be liquidated, however, attacker gets funds from margin loan.

## Solution

To prevent such attack, we should compute health factor after each operation and reverts when HF is less than 1. We called that **health factor protection,** it saves funds, however computing HF is not gas efficeint.

### Fast check protection

To reduce gas costs, Gearbox uses "fast check protection" which just check the collateral change during swaps. Let's describe it in more details: 

where

- $c_{out}$ - number of units of asset, that credit account recieves (out-asset) as a result of financial operation,
- $p_{out}$ - price of asset to ETH
- $c_{in}$ - number of units, that credit account sends to external smart-contract while doing financial operations,
- $p_{in}$ - price of this asset to ETH

To eliminate risk of draining funds protocol checks equation 

$$
1 - \frac{LT_{out}c_{out} p_{out}}{LT_{in}c_{in} p_{in}} \le f_p,
$$
where $f_p$ is liqudation premium parameter. Protocol allows trade if this equation is true, overwise it calculates health factor of credit account after trade. 

Math proof of this approach is provided in next page. 