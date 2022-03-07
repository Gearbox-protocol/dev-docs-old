# Architecture

The Gearbox protocol contracts can be assigned into three groups: Core contracts, Pools and Credit contracts. 

![Core contracts](../../../static/img/tutorial/Gearbox\_white\_high.011.png)

### Core 

Core is a service layer which provides unified services for contracts discovery, price oracles, ACL and so on.

### Pool

Pool is connected with creditManager, which is responsible for all policies for credit account. One pool is corresponding to one underlying token and there could be more than Credit Manager connected to one pool. Credit manager also could borrow money from pool and provide to the credit account. Credit manager is also reroutes financial orders from adapter to credit account.

![](../../../static/img/tutorial/Gearbox\_white\_high.001.png)

Liquidity providers interact with Pool contracts which implement operations with liquidity (add / remove) and also lend to/ repay from credit managers contracts.

![](../../../static/img/tutorial/Gearbox\_white\_high.003.png)

Credit manager contracts are connected to pool contracts and can borrow / repay money from them. The implement logic for open / close leveraged position using virtual account concepts and also manages trading / farming operations.

### Credit manager

Each Credit Manager connects with one pool, pool can have some Credit Managers connected. Each Credit Manager has only one CreditFilter.

![](../../../static/img/tutorial/Gearbox\_white\_high.012.jpeg)

Each credit manager (CM), which can takes margin loans from pools.

On the full schema you can see contracts interaction:

| Contract            | Function                                                                                                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Interest rate model | Computes interest rate based on utilization & pool parameters                                                                                                                                  |
| Pool Service        | Responsible for liquidity operation for LP. It also manages diesel (LP) tokens and borrow funds to credit account                                                                              |
| Credit Manager (CM) | Provides operation with leveraged position using credit accounts (open/close/liquidate/repay etc.). It also filters users operation using CM filter to allow whitelisted DEXes and tokens only |
| Account Factory     | Keeps and provide on demand Reusable Credit Accounts                                                                                                                                           |
| CreditFilter        | Keeps allowed smart contracts & tokens list. It also computes total portfolio value using Price oracle and Liquidation value.                                                                  |
| Price Oracle        | Computes rates using Chainlink oracles information                                                                                                                                             |
