---
title: Curve price feed
---

\newtheorem{theorem}{Theorem}[section]
\newtheorem{corollary}{Corollary}[theorem]


The Curve price feed returns the USD price for a single Curve LP share. The price is computed as `ICurvePool.get_virtual_price()` multiplied by the USD price of the cheapest asset in the Curve pool currently.

The intuition behind this is that it is more profitable to withdraw the asset with the largest balance in the pool (since otherwise the user will suffer imbalancing fees), which will be the cheapest asset. Therefore, a fair price for a Curve LP share is based on the price of the cheapest asset.

To avoid `get_virtual_price()` manipulation affecting Gearbox, the price feed checks the `get_virtual_price()` returned value against preset lower and upper bounds. If the value falls outside the bounds, the function reverts.

The bounds are configured by the governance and the upper bound is typically set to the current value + 4%.


## Math proof

### Definitions

Curve invariant works as 

$$
An^n\sum x_i + D = ADn^n + \frac{D^{n+1}}{n^n \prod x_i},
$$
where $x_i$ is balance for i-th token in pool, $n$ - number of tokens, $A$ - amplification parameter and $D$ - constant representing virtual price of $LP$ token. 

### Curve price oracle equation

Let's look on equation below: 
$$
p_j \ge \min\limits_{i \in 1,..,n} p_{ij} \sum x_i, 
$$
where $p_j$ is price of Curve LP token nominated in $j$-th coin. This equation is true for any Curve pool. 


### Proof

Real curve LP price is equal to 

$$
p_j = \sum x_i \frac{\partial x_i}{\partial x_j}, 
$$

where $\partial x_i/\partial x_j$ can be noticed as price if $i$-th coin nominated in $j$-th coin (or $p_{ij}$). Let's put this $p_j$ to oracle's equation and we've got

$$
\sum x_i p_{ij}\ge \min\limits_{i \in 1,..,n} p_{ij} \sum x_i,
$$
which is always true by $\min$ characteristics.


## Tech design

Curve LP's `ICurvePool.get_virtual_price()` is calculated as $\sum x_i$. So price oracle calculated as 
`ICurvePool.get_virtual_price()*min(p_i)` calculates the right expression of Curve price oracle equation. So Gearbox always value conservatively Curve LPs positions and such design is safe for LPs.