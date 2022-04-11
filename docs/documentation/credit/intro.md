# Credit accounts

Composable leverage is based on credit account (DEFI primitive), which is an isolated smart contract which can execute trader's financial orders on third party protocol, but do not provide direct access to the funds on it. Credit Account could take margin loan from the pool, so there are two types of funds on it: user initial funds and borrowed funds.

## Open credit account
To interact with Gearbox, user should open an credit account. During the opening flow, credit account takes margin loan from the pool and get collateral from user account as well. 

Let's check an example:

![Opening credit account](</images/credit/openCreditAccount.jpg>)

Trader takes 90 ETH loan and provide 10 ETH of his own initial funds. So, after opening account, the total balance on credit account would be 100 ETH. 

Note! In our example, trader provides 10 ETH for simplicity, however, it's possible to provide collateral in different assets and use multicollateral if needed.

Credit account is an isolated smart contract, trader could execute different transactions, however, has no direct access to the funds.

## Credit manager key parameters

There is a special smartcontract, which is called CreditManager (in V2 we have 3 linked contracts: CreditFacade, CreditManager and CreditConfigurator), which is responsible for managing credit accounts.

One of the key parameter of each CreditManager is allowed tokens list. This policy allows to use limited list of assets for all accounts opened in one credit manager.

So, in some terms, we can consider credit account as list of different tokens with balances, and introduce here two key parameters:

![Opening credit account](</images/credit/creditAccount.jpg>)


### Interacting with 3rd party protocols

User can consider credit account as additional account. Working with credit account is pretty native. Each contract connected to 

