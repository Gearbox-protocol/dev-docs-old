# Fast check proof

In this article, we prove the safety of fast checks to ensure protocol overcollateralization.

## Assumptions

1. Health factor $H_f$ is more than 1
2. Credit account has debt (loan plus interest) $D$ and $c_1$ units of asset 1. It's liquidity threshold is $LT_1$, price $p_1$.
    
3. Liquidation thresholds are calculated for both assets as
$$
LT = 1 - dP- f_L-f_p,
$$
where $dP$ is max price drop during liquidation time, $f_L$ - liquidation fee (goes to liquidator), $f_p$ - liquidation premium (goes to DAO treasury). 

4. User swaps $\Delta c_1$ units of asset 1 to $\Delta c_2$ asset 2 with liquidation threshold $LT_2$ and price $p_2$.
    
5. During swap protocol calculates fast check 
$$
1 - \frac{LT_2\Delta c_2 p_2}{LT_1\Delta c_1 p_1} \le f_p
$$
and allows trade if and only if fast check is successful

6.  Gearbox is enough overcollateralized if in case of liquidation protocol can ensure repaying debt $D$ and paying liquidation fee $f_LD$.
    



## Problem formalization / Theorem

To ensure Gearbox protocol's overcollateralization after a financial transaction, it is enough to perform fast checks.

## Proof

Our theorem can be written as optimization problem: 

Let's define
$$
V=\displaystyle\min_{ \Delta c_1\in[0,c_1],\Delta c_2\ge0, dp\in [0,dP_2]} \left\{ (c_1-\Delta c_1)p_1+\Delta c_2p_2(1-dp) \right\}
$$
as Credit Account's Total Value after trade. Here $dp$ means possible price drop during swap (or immediately after it).

It is necessary to proof that $V \ge D/(1-f_L)$ under conditions of described in Assumptions section. If this equation is true, than gearbox has enough overcollaterization even in case of liquidations happens next. 

Let's find minimum for $V$ equation. We can find minimum using linear programming methods: 

$$
V = \displaystyle\min_{\Delta c_1\in[0,c_1]} \left\{c_1p_1-\Delta c_1 p_1+
(1-f_p)(1-dP_2)\Delta c_1 p_1 \frac{LT_1}{LT_2}  \right\}:
$$

1. If $(1-f_p)(1-dP_2)\frac{LT_1}{LT_2}>1$, then minimum is reached at $\Delta c_1 = 0$. In this case system stays overcollateralized as there is no any trades/actions. 

2. If $(1-f_p)(1-dP_2)\frac{LT_1}{LT_2}=1$, then $V=c_1p_1$. Taking into account that at start health factor $H_f\ge 1$ we get $V=c_1p_1=DH_f/LT_1\ge D/LT_1 \ge D/(1-dP_1-f_p-f_L) \ge D/(1-f_L)$, so system is overcollateralized.

3. If $(1-f_p)(1-dP_2)\frac{LT_1}{LT_2}<1$, then $\Delta c_1 = c_1$ and 
$$
V = (1-f_p)(1-dP_2)c_1p_1\frac{LT_1}{LT_2} = (1-f_p)(1-dP_2)\frac{DH_f}{LT_2}
$$

Let's compare this equation with $D/(1-f_L)$:

$$
(1-f_p)(1-dP_2)\frac{DH_f}{LT_2} \bigwedge \frac{D}{1-f_L}
$$

Which is equal to 
$$
(1-f_p)(1-f_L)(1-dP_2)H_f \bigwedge 1-dP_2-f_p-f_L
$$

As $H_f \ge 1$ and 
$$
(1-f_p-f_L+f_pf_L)-dP_2(1-f_p-f_L+f_pf_L) \ge
1 - dP_2-f_p-f_L
$$
(as
$$
f_pf_L+dP_2(f_p+f_L-f_pf_L)\ge 0
$$
for any $f_p,\;f_L\in[0,1]$), we get that 
$$
\bigwedge = \ge 
$$

So we get that for case 3 inequality $V\ge D/(1-f_L)$ is also true. 

Then this inequality is true for all cases and system is always overcollateralized.
