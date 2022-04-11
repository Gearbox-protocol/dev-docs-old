# Insurance and rebalancing

## Closing account

When user closes account or his account is liquidated:

PnL - is result of repaying:

$$
PnL = total\;funds - amount_B - interest
$$

Updating total borrowed amount:

$$
B(t_n) = B(t_{n-1})-amount_B
$$

**PnL>=0:**

This case means that return value > borrowed amount + expected interest accrued. Interest accrued is already included in expected liquidity. At this point, the protocol keeps all funds in the pool and mint diesel tokens to treasury fund.

$$
EL(t_n) = EL(t_{n-1})+PnL
$$

$$
amount\;minted\;to\;treasury = \frac{PnL}{diesel\;rate(t_{n})}
$$

**PnL<0:**

This case means, that returned value < borrowed amount + expected interest rate. At this cases, pool uses treasury fund as insurance and burn tokens to keep _diesel rate_ on the same level.

$$
amount\;to\;burn\;from\;treasury = min(treasury\;balance, \frac{|PnL|}{diesel\;rate(t_n)})
$$

$$
EL(t_n) = EL(t_{n-1})-|PnL|+amount\;to\;burn\;from\;treasury*diesel\;rate(t_n)
$$


## Insurance example

In some rare cases, the remaining funds after paying liquidation premium could be less than borrowed amount + interest rate + fee. In this case, the protocol uses treasury to compensate for the shortage by burning diesel tokens to keep the diesel rate as it should be.

Let's consider an example:

1\) LP adds 1000 DAI to the pool. Diesel rate =1, he got 1000 dDAI (diesel DAI tokens). Total liquidity = 2000, and diesel supply = 2000.

2\) Trader borrowed 1000 DAI and used them for some period. Let's assume that interest accrued is 100DAI. So, at time of return: total liquidity = 2100, diesel rate= 2100 / 2000 = 1.05

3\)  LP earns on diesel rate, so their interest rate income is already accounted in 1.05 rate.

4\) Trader's account was liquidated, and the remaining funds are 1000 DAI only. So, if there is no insurance fund was there, the diesel rate should return to 1 which means that LP earns nothing. However, in this case, protocol burns treasure's tokens to keep the diesel rate on the same level:

$$
token\;to\;burn=  2000\;*(1.05-1)/1.05 \approx 95.23
$$

5\) Let's check that burning 95.23 will keep diesel rate as it was before this accident:

$$
diesel\;rate = \frac{2000}{2000-95.23} \approx1.05
$$

So, in this case, the treasury was used to cover some losses and behave like an insurance fund.