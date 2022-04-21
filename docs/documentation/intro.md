---
title: What Is Gearbox?
sidebar_position: 1
---

## Introduction

Gearbox is a generalized leverage protocol: it allows anyone to take leverage in a DeFi-native way and then use it across various DeFi protocols. You take leverage with Gearbox and then use it on other protocols you already love. For example, you can leverage trade on Uniswap, leverage farm on Yearn or Curve and Convex, make complex delta-neutral strategies involving options and derivatives, get Leverage-as-a-Service for your structured product doing complex positions, etc.

The protocol has two sides to it: passive liquidity providers who earn higher APY by providing liquidity; - and active traders, farmers, or even other protocols who can borrow those assets to trade or farm with x4+ leverage.

That is possible thanks to Credit Accounts…

### Credit Accounts

![](/images/leverageinfra.png)

A Credit Account is an isolated smart contract which contains both the user funds and the borrowed funds. This is where your leverage is. After you open an account, all the operations go through this account and the assets stay on it as well. You can see a Credit Account as your automated DeFi wallet where you not only keep positions, but can also potentially program it the way you want.

Funds on Credit Accounts are used as collateral for debt, and users can operate these funds by sending financial orders to their Credit Accounts. That could be: margin trading on Uniswap or Sushiswap; leverage farming on Yearn; arbitraging pegged assets on Curve, and more!


### Cool Features

Composable. Gearbox does not have its own order book or trading environment. The leverage you get is used across multiple DeFi protocols and assets, fully composable! For example, a yield aggregator can be on the liquidity provider side of Gearbox Protocol, as well as be an avenue for Gearbox users to deploy their leverage into.
0% Funding Rates. The leverage offered is not based on synthetic positions but instead is executed with real assets on third-party protocols. Because Gearbox does not create its own trading pairs, there is no short-long ratio that needs to be maintained with funding rates.
Leverage as a Service. Other protocols can offer leverage to their users with the help of Gearbox Protocol, without modifying anything in their own architecture. As such, they also get exposure to the user base of Gearbox.
Permissionless Strategies. Positions and trades within Credit Accounts can be extended to include complex strategies, for example, making a short position farm in Yearn; or having LP tokens as collateral for more composable actions.
Low overhead on gas. Due to how data and operations are processed across isolated smart contracts, gas usage overhead is reduced to an insignificant overhead.




[Gearbox dApp](https://gearbox.fi/)