# Architecture

Credit part of the Gearbox Protocol is based on Facade pattern. CreditAccounts are simple contracts, which could executed transaction passed through all requred checks. CreditManager is backend which is responsbile for all core operations, users could interact with it via CreditFacade / Adapters contract. 

![](/images/credit/creditArchitecture.jpg)

Each user could have only one credit account per creditManager, this one-to-one relationship is stored in `mapping(address => address) public override creditAccounts`, CM routes calls and operations to particulat credit account.

AccountFactory is used to supply reusable credit accounts when it's needed (for more info, check [AccountFactory](/docs/documentation/architecture/account-factory)). CreditManager is allowed to borrow / repay funds from one particular pool. WETHGateway is used to convert WETH into ETH during closing account and liquidations as well.

PriceOracle provide price data based on Chainlink oracles or complex oracles. This data is used to compute collateral value. For more information, please check Oracles chapter.

To interact with 3rd party protocols, this protocols could have special contracts which are called adapters (for more information: adapters), which has one-to-one relationship: one contarct could be called through one adapter only. Adapters provide the same ABI as original contacts, so when user send transaction to adapter with the same `calldata` as for original contract, it would be executed using funds on credit account.

### Credit contacts

| Contract           | Responsibility                                                                     |
| ------------------ | ---------------------------------------------------------------------------------- |
| CreditAccount      | Primitive, which executes transaction on behalf of                                 |
| CreditManager      | Backed contract, which execute operations, however, it could no be called directly |
| CreditFacade       | Provide user interface and used for multicall                                      |
| CreditConfigurator | Configure credit manager, could be called by DAO only                              |


### CreditManager

CreditManager is core contract to manager credit accounts. In V2, CreditManager itself is designed as low-level backed contract.  One pool could be connected with a few of creditManagers, however, CreditManager could be connected with one pool only. It's possible to forbid borrowing money from pool, however, each CreditManager could repay money back.

![](/images/credit/poolCreditManagers.jpg)

### CreditFacade

CreditFacade provides user interface for all operations with credit accounts:

- Opening credit account
- Closing credit account
- Adding collateral
- Managing debt
- Liquidating credit account

It also implements Multicall feature. For more information, please check [Multicall feature](/docs/documentation/credit/multicall)
