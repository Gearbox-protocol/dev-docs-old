# Architecture

## Overview 

![Core contracts](/images/architecture.jpg)

Gearbox is a two-sided protocol, with passive liquidity providers on one side and active traders and position managers on the other.

Liquidity providers can commit their funds into the liquidity pool to be borrowed and receive yield from interest. This works similarly in principle to other major lending protocols, such as Aave or Compound.

Active traders seek to get leverage and use it across different DeFi protocols. They open a Credit Account, providing initial funds, and additional funds are borrowed from the pool. The trader can then use their new Credit Account with borrowed funds to interact with connected protocols.

## Credit account

A Credit Account is new DeFi primitive - an isolated smart contract that allows to execute financial orders
(interactions with third-party protocols), but doesn't provide direct access to funds contained within it.

![Core contracts](/images/core/execute-transaction.jpg)

Credit Accounts execute transactions on behalf of themselves, however, each executed transaction has to pass several checks:

- The target contract must be in a whitelist
- Incoming tokens must be in a whitelist 
- The Credit Account's health factor must be more than 1 after the transaction (i.e., it must be able to repay its debt with interest)

More technically, Credit Accounts themselves are simple contracts that route calls, and all aforementioned policies are enforced by the Credit Manager.

[Credit Accounts](../credit/intro.md)


## Core contracts

Core contracts provide functionality necessary to interact with the protocol, including contract discovery, price feeds, access control, etc.

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

[Contracts Discovery](./discovery)