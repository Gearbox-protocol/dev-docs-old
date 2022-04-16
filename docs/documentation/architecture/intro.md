# Architecture

## Overview 

![Core contracts](/images/architecture.jpg)

Gearbox is two-side protocol, on the left side you can see Liquidity Proviers who are interested in
passive investent strategy. They provide money and get APY. This part is similar to major lending protocols
like Aave or Compound.

On the right side, you can see a trader, who is intereested to get leverage and use it accross diffeerent DEFI protocol.
He opens a Credit Account providing initial funds, and Credit Account takes margin loan from the pool. After opening credit 
accoount, it has both trader's and borrowed funds on it. It's where leverage comes.

## Credit account

Credit Account is new DEFI primitive, technically it's an isolated smart contract, which allows to execute financial orders
(interactions with third-party protocols), but do not provide direct access to the funds on it.

![Core contracts](/images/core/execute-transaction.jpg)

Credit Account executes transaction on behalf of itself, however, each transaction to be executed should pass following requrements:

- Target contract should be in whitelist (allowed contract)
- Tokens which would be get as result should be in (allowed token list)[]
- Credit Account should have enough collateral to pay debt + interest rate back (health factor >1) after transaction

Technically, Credit Account is a simple contracts which is used for transactions, all policies mentioned about are kept in CreditManager 
contracts. Pools - CreditManagers are connected with `one-to-many` relationship, list of available pools & credit managers are availalbe 
through ContractRegister which is a part of Core contracts.

[Credit Accounts](../credit/intro.md)


## Core contracts

Core contracts provide unified services for contracts discovery, price feeds, access control, etc.

![](/images/core/core.jpg)

| Contract             | Responsibility                              |
| -------------------- | ------------------------------------------- |
| AddressProvider      | Keeps addresses of core contracts           |
| AccountFactory       | Supplies reusable credit accounts           |
| ACL                  | Manages access control                      |
| ContractsRegister    | Pools & CreditManagers contrascts register  |
| DataCompressor       | Prepares data for offchain services         |
| PriceOracle          | Provides price data for CreditManager       |
| WETHGateway          | Converts ETH to WETH and vice versa         |
