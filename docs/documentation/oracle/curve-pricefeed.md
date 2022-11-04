---
title: Curve price feed
---


The Curve price feed returns the USD price for a single Curve LP share. The price is computed as `ICurvePool.get_virtual_price()` multiplied by the USD price of the cheapest asset in the Curve pool currently.

The intuition behind this is that it is more profitable to withdraw the asset with the largest balance in the pool (since otherwise the user will suffer imbalancing fees), which will be the cheapest asset. Therefore, a fair price for a Curve LP share is based on the price of the cheapest asset.

To avoid `get_virtual_price()` manipulation affecting Gearbox, the price feed checks the `get_virtual_price()` returned value against preset lower and upper bounds. If the value falls outside the bounds, the function reverts.

The bounds are configured by the governance and the upper bound is typically set to the current value + 2%.


## Math proof

Beyond the intuition, we also want to show that the defined calculation cannot overestimate the value of a Curve LP, since otherwise the discrepancy can be exploited to steal money from LPs.

### Definitions

Curve's invariant is defined as

$$
An^n\sum x_i + D = ADn^n + \frac{D^{n+1}}{n^n \prod x_i},
$$
where $x_i$ is balance for the i-th token in pool, $n$ is the number of tokens, $A$ is the amplification parameter and $D$ is a constant representing the virtual price of the $LP$ token. 

### Curve price oracle equation

We want to prove that 
$$
p_j \ge \min\limits_{i \in 1,..,n} p_{ij} \sum x_i, 
$$
is true for any Curve pool. $p_j$ is price of Curve LP token nominated in $j$-th coin.

### Proof

Real curve LP price is equal to 

$$
p_j = \sum x_i \frac{\partial x_i}{\partial x_j}, 
$$

where $\partial x_i/\partial x_j$ by definition is the price of $i$-th coin nominated in $j$-th coin (or $p_{ij}$). Substituting, we get:

$$
\sum x_i p_{ij}\ge \min\limits_{i \in 1,..,n} p_{ij} \sum x_i,
$$
which is always true by definition of $\min$.

Curve LP's `ICurvePool.get_virtual_price()` is calculated as $\sum x_i$. So the price oracle value calculated as 
`ICurvePool.get_virtual_price()*min(p_i)` corresponds to the right hand side in the inequality. Hence, Gearbox will always value Curve LP tokens conservatively as long as `get_virtual_price()` is not manipulated.
