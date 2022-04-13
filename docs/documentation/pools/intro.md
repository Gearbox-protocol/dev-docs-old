# Pools

Capital is required for traders to get leverage on the platform. For this, there are Liquidity Pools(LPs): anyone can become a liquidity provider by depositing funds in the Liquidity Pool.

![Pool](/images/pools/schema.jpg)

The profitability of LPs depends on the pool utilization ratio - the higher utilization, the higher interest rate. Each pool has an underlying asset and risk parameters such as: allowed trading tokens, allowed DEXes, stable coin pool, and others.

In the current version, we implement linear extrapolation for interest rate calculation as Aave did, in v2 we are going to use a specially designed curve - see the [note](https://colab.research.google.com/drive/1bjBWHNGHiSDd27_WsINQLXa3ImhTrt-W).

## Diesel (LP) tokens

Each pool has its own diesel (LP) tokens. Each time, when a liquidity provider adds money to the pool, he gets diesel tokens back (like c-tokens in Compound).

$$
rate = \frac{expected\;liquidity}{diesel\;tokens\;supply}
$$

Liquidity providers get profits from holding diesel tokens because they grow with expected interest. LP can keep diesel tokens on their wallets and then withdraw the deposit + interest or can use them as collateral in lending protocols or even sell them on the secondary market.
Diesel tokens are 100% liquid yield-generating assets.

## Basic parameters

* EL(t) - expected liquidity
* B(t) - total borrowed
* r(t) - borrow rate
* d(t) - diesel rate
* CI(t) - cumulative index (it shows value of money at moment t)

### Periods and timestamp

All functions are piecewise linear functions. Each change in available liquidity  or borrowed amount [updates rate parameters](/). In follow formulas we use the convention:

$$
t_n - current\;timestamp,
$$
$$
t_{n-1} - timestamp\;of\;last\;rate\;update
$$

### Available liquidity

The amount of money available in pool.

### EL(t) - Expected Liquidity

The amount of money should be in the pool if all users close their Credit Accounts and return debt. If no action happens during $t_{n-1}$ and $t_n$, then the equation of $EL$ should be

$$
EL(t_{n})= EL(t_{n-1})+B(t_{n-1})*r(t_{n-1})*(t_{n}-t_{n-1})
$$

Beside, [Add Liquidity](/) and [Remove Liquidity](/) will have a new formula of $EL$.

### B(t) - Total borrowed

Represents total borrowed amount without accrued interest rate:

$$
B(t) = \sum b_i
$$

### r(t) - Borrow APY

Represents current borrow APY. Depends on pool utilisation parameter and computed independently using [Interest rate model](/).

### d(t) Diesel rate

Liquidity providers get profits from holding diesel tokens because they grow with expected interest. LP can keep diesel tokens on their wallets and then withdraw the deposit + interest.

Diesel Rate is the price of Diesel token (LP token).

$$
d(t) = \frac{EL(t)}{diesel\;supply(t)}, \text{if diesel supply >0}
$$
$$
d(t) = 1, \text{if diesel supply is 0}
$$

### Cumulative Index

Cumulative Index is aggregated variable that shows value of borrowing money.

$$
CI(t_{n})=CI(t_{n-1})(1+r(t_{n-1})*(t_{n}-t_{n-1})),
$$

$$
r(t_{n})=calc\;interest\;rate(EL(t_{n}), available\;liquidity(t_n))
$$

### Rate parameters update

Updates borrow rate & cumulative index. Called each time when borrowed amount or available liquidity is changed:

* Add liquidity
* Remove liquidity
* Credit account manager lends money
* Credit account manager repays debt

$$
CI(t_{n})=CI(t_{n-1})(1+r(t_{n-1})*(t_{n}-t_{n-1})),
$$

$$
r(t_{n})=calc\;interest\;rate(EL(t_{n}), available\;liquidity(t_n))
$$