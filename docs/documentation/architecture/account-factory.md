# AccountFactory

## Reusable credit accounts

Credit account is implemented as an isolated smart contract. It helps to reduce gas consumption, 
cause all balances are kept dcentralised, and there is no overhead to update pool balances and 
internal balances as well.

![Core contracts](/images/core/factory.jpg)

Reusability means than once deployed this contract is "rented" by CreditManager, when user opens 
Credit Account and returned when account is closed or liquidated. This approached allow users 
not to pay gas cost for contract deployment and make protocol more gas-efficient.

## Account Factory

AccountFactory is responsible to supply credit accounts to CreditManager. It's organised as linked list,
and takes an credit account from the head and adds it to the tale when it's returned:

![Core contracts](/images/core/linked-list.jpg)

If the Account Factory has no pre-deployed contracts and a user opens a new Credit Account, it clones it using [https://eips.ethereum.org/EIPS/eip-1167](https://eips.ethereum.org/EIPS/eip-1167)

## Advantages

- **Gas efficiency**  
This solution is much more gas-efficient, cause it doesn't require creating a new contract each time and has minimal operational overhead.

- **Hacker-proof**  
Funds are distributed between credit accounts (isolated contracts) which makes a possible attack more complex and less economically reasonable.  

- **Balance transparency on Etherscan**  
Traders could check transactions on Etherscan between blocks when they opened and closed credit accounts.

- **Ethereum network ecology**  
It generates significantly less data in comparison with deployment credit contract for each new customer, and consume significantly less gas than keeping all balances in one place. As result it makes less impact on Ethereum infrastructure.

## Getters
Despite AccountFactory is primary used internally, developers could get valuable data from AccountFactory.

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
