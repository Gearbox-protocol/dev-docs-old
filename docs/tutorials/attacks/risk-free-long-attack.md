# "Risk free long" attack

## Attack

1. Attacker opens 2 positions (lets assume that 1ETH = 2500USDC)

   **\[Position #1:  Long USDC->ETH]**: 1000 USDX x5 = 5K USDC -> 2 ETH

   **\[Position #2:  Long ETH -> USDC]**: 0.4ETH x5 = 2 ETH -> 5000 USDC

   Each position has 1.16 heath factor.
2. Then attacker waits when hf of one position will be \~ 1, and take N `fastCheckOperatins` with minimal allowed $\chi$ (which means decrease in collateral).
3. Then attacker liquidates his account during the same transaction (because account's $HF < 1$ and liquidation is more profitable than closing at the case).

## Protection

This attack could beneficial only if attarcker could take money from pool, and this amount could be >> gas consumed. To be protected from Gearbox side, at first let's compute maximum possible drop between full health factor check:

$$
drop_{max} = \chi^{n}, where\;n\;-\;hfCheckInterval
$$

The edge case is where $hf = 1.0001$, and user has already asset convert to underlying (because all other assets has lower $LT$). Protocol has constraint for $LT$ for underlying asset

$$
LT_{U} \leqslant 1 - l_p - f_l, \\where\; l_p - liquidation \;premium, f_l - liquidation\;fee.
$$

$$
if\; h_f\approx 1,\;debt + interest = amount*(1-l_p-f_l)
$$

On the other side, the liquidator pays, and we want to construct constraint for drop\_max:

$$
amount * drop_{max} * (1-l_p) \geqslant amount * (1-l_p -f_l)
$$

$$
drop_{max} \geqslant \frac{1-l_p-f_l}{1-l_p} = 1 - \frac{f_l}{1-l_p}
$$

so, if we construct limit as:

$$
drop_{max}\geqslant 1-f_l
$$

it will be stronger, because:

$$
1-f_l \geqslant 1 - \frac{f_l}{1-l_p}
$$

So, to make fast check safe, Gearbox has contraint:

$$
1 - \chi^n < f_l,\\ where\; n - nfCheckInverval, f_l  - liquidation fee
$$
