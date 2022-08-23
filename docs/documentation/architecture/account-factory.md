# AccountFactory

## Reusable credit accounts

Each Credit account is implemented as an isolated smart contract. This helps to reduce gas consumption, as balances, account health and other data can be tracked naturally on a per-address basis, instead of being stored in a contract.

![Core contracts](/images/core/factory.jpg)

Reusability means that Credit Account contracts are deployed once, and then "rented" by a Credit Manager when a user opens an account. Once the account is closed or liquidated, the contract is retuned. Users do not need to pay to deploy a new `CreditAccount` each time, which saves gas.

## Account Factory

`AccountFactory` is responsible for supplying Credit Accounts to Credit Managers. The pre-deployed Credit Accounts are organized into a linked list, and the current head is given each time a Credit Manager requests one. Returned accounts are appended to the list tail:

![Core contracts](/images/core/linked-list.jpg)

If the Account Factory has no pre-deployed contracts available and a user tries to open a new Credit Account, a new one is cloned using [EIP-1167](https://eips.ethereum.org/EIPS/eip-1167).

## Advantages

- **Gas efficiency**  
This solution is more gas-efficient compared to creating a new Credit Account, since deployment costs do not need to be paid as long as there are available pre-deployed contracts in the `AccountFactory`.

- **Resistance to insolvency contagion**
Funds being kept on isolated accounts ensures that there is no system-wide contagion when a particular account, Credit Manager or integrated protocol is compromised. Collateralization and safety of Credit Accounts unrelated to the event is not affected.

- **Balance transparency on Etherscan**  
Transactions for each account can be directly tracked on Etherscan - a user only needs to know the blocks in which the account was opened and closed in order to index transactions made by a particular borrower.

- **Ethereum network ecology**  
The pattern generates significantly less data in comparison with deploying new accounts every time; and saves a considerable amount of gas both at account opening and during usage. As a result, less of an impact is made on Ethereum infrastructure.

## Getters

Despite `AccountFactory` being primarily for internal use, developers can retrieve information on the current account stock if they require it:

```solidity
interface IAccountFactoryGetters {
    /// @dev Returns address of next available creditAccount
    function getNext(address creditAccount) external view returns (address);

    /// @dev Returns head of list of unused credit accounts
    function head() external view returns (address);

    /// @dev Returns tail of list of unused credit accounts
    function tail() external view returns (address);

    /// @dev Returns quantity of unused credit accounts in the stock
    function countCreditAccountsInStock() external view returns (uint256);

    /// @dev Returns credit account address by its id
    function creditAccounts(uint256 id) external view returns (address);

    /// @dev Quantity of credit accounts
    function countCreditAccounts() external view returns (uint256);
}
```
