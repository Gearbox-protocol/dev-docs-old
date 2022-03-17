# Fast check and healthFactor protection

### Attack description

1. Attacker opens Credit Account in ETH (for example)
2. The attacker takes flash loan, and change USDC/ETH rate in Uniswap  to pay more in ETH that normal rate.
3. The attacker swap all ETH to USDC.
4. The attacker use flashloan to change USDC/ETH rate on Uniswap to may less than normal rate.
5. He trades UDSC to ETH back.
6. After this transaction he got less ETH, than at the beginning. Attacker repeats it in one block till he didn't drain all funds from credit Account
7. Then account will be liquidated, however, attacker gets funds from margin loan.

### Solution

To prevent such attack, we should compute health factor after each operation and reverts when HF is less than 1. We called that **health factor protection,** it saves funds, however computing HF is not gas efficeint.

### Fast check protection

To reduce gas costs, Gearbox uses "fast check protection" which just check the collateral change. For fast check we can compute $\chi$ parameter:

where
* $c_{out}$ - number of units of asset, that credit account recieves (out-asset) as a result of financial operation,
* $p_{out}$ - price of asset to ETH
* $c_{in}$ - number of units, that credit account sends to external smart-contract while doing financial operations,
* $p_{in}$ - price of this asset to ETH

If $\chi > 1$, it means that we get more collateral in than out, and this operations is safe. 

In other cases, we compare $\chi$ with $\chi_{min}$ -  maximum allowed colllateral drop without healthFactor check. This parameter is set by DAO.

To eliminate risk of draining funds using repeatable swaps with:

$$
\chi_{min} < \chi < 1
$$

We have fast check counter, a parameters which increments each time fast check was done.&#x20;

If $fastCheckCounter > hfCheckInterval$, we use health factor check, and if it's successful, set $fastCheckCounter$ to 1.

So, the maximum possible collateral loss during fast check:

$$
max\;collateral\;loss = \chi^n, where \; n - \; hfCheckInterval
$$

There are some limitations for $\chi$ and $hfCheckInterval$, for more read ["Risk free long" attack](./risk-free-long-attack.md).

