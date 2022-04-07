# Architecture

The Gearbox protocol contracts can be assigned into three groups: Core, Pool and Credit Manager.

![Core contracts](../../../static/img/tutorial/Gearbox\_white\_high.011.png)

## Core

Core is a service layer which provides unified services for contracts discovery, price oracles, ACL and so on.

## Pool

Pool is responsible for liquidity operations for LPs. It also manages diesel (LP) tokens and provides funds to credit account

Pool is connected with Credit Manager, which is responsible for all policies for Credit Account.  
Pool corresponds to one underlying token and there could be more than one Credit Manager connected to one Pool.  

Credit Manager can borrow money from Pool to provide to Credit Account.  
Credit Manager reroutes financial orders from Adapter to Credit Account.  

![](../../../static/img/tutorial/Gearbox\_white\_high.001.png)

Liquidity providers interact with Pool contracts by using the `addLiquidity` / `removeLiquidity` methods. Credit Managers can interact with Pool contracts by using the  `lendCreditAccount` / `repayCreditAccount` methods.

![](../../../static/img/tutorial/Gearbox\_white\_high.003.png)

[FIXME: Clarify exactly which methods are to be invoked]
Credit Manager contracts are connected to Pool contracts and can `borrow` / `repay` money from them. They implement logic to `open` / `close` leveraged positions using virtual account concepts and also manages trading / farming operations.

## Credit Manager (CM)

Credit Manager takes margin loans from pools, and provides leveraged positions to Credit Accounts (open/close/liquidate/repay etc.). It also filters users operations using a Credit Manager filter to allow whitelisted DEXes and tokens only

Each Credit Manager connects only with one Pool, but Pool can have multiple Credit Managers connected. Each Credit Manager has only one CreditFilter.


![](../../../static/img/tutorial/Gearbox\_white\_high.012.jpeg)


:::info

A quick overview of all core components:

| Contract            | Function                                                                                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Interest rate model | Computes interest rate based on utilization & pool parameters                                                                                                                                  |
| Pool Service        | Responsible for liquidity operation for LP. It also manages diesel (LP) tokens and borrow funds to credit account                                                                              |
| Credit Manager (CM) | Provides operation with leveraged position using credit accounts (open/close/liquidate/repay etc.). It also filters users operation using CM filter to allow whitelisted DEXes and tokens only |
| Account Factory     | Keeps and provide on demand Reusable Credit Accounts                                                                                                                                           |
| CreditFilter        | Keeps allowed smart contracts & tokens list. It also computes total portfolio value using Price oracle and Liquidation value.                                                                  |
| Price Oracle        | Computes rates using Chainlink oracles information                                                                                                                                             |

:::

