# Open credit account

To interact with Gearbox, a user must open a credit account. During the opening, the credit account borrows funds in underlying from the pool and transfers collateral from the user.

Example:

![Opening credit account](/images/credit/openCreditAccount.jpg)

The trader borrows 90 ETH and provides 10 ETH of their own funds. After opening an account, its total balance is 100 ETH. The trader can then use the credit account to interact with various protocols, but has no access to funds.

**Note:** It is possible to provide collateral in an asset different from the underlying, however, this can only be done through `openCreditAccountMulticall`.

## Borrowing limits and other restrictions

Each CreditFacade imposes limits on the borrowed amount for a single CA, set by the DAO. Those limits can retrieved by using a CreditFacade getter `CreditFacade.limits()`, which returns a tuple of `(minAmount, maxAmount)`.

It is also forbidden to open and close a Credit Account in the same block, and reducing the debt immediately after opening the account.

Opening a CreditAccount on behalf of another user (`onBehalfOf != msg.sender`) is only possible of [account transfer allowance](/) from the account opener to the user is set to `true`.

## Methods

To open a Credit Account, two `CreditFacade` functions can be used:

### Open credit account

```solidity
function openCreditAccount(
    uint256 amount,
    address onBehalfOf,
    uint16 leverageFactor,
    uint16 referralCode
) external payable;
```

| Parameter      | Description                                                                                                                                                     |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| amount         | Borrower's initial funds                                                                                                                                        |
| onBehalfOf     | The address for which the Credit Account is being opened                                                                                                        |
| leverageFactor | The amount of leverage to take on. The borrowed amount is computed as `amount * leverageFactor / 100`, hence `leverageFactor = 100` corresponds to 2x leverage. |
| referralCode   | Referral code, which is used for potential partner rewards. 0 if no referral code provided.                                                                     |

### Open credit account with a multicall

```solidity
function openCreditAccountMulticall(
    uint256 borrowedAmount,
    address onBehalfOf,
    MultiCall[] calldata calls,
    uint16 referralCode
) external payable;
```

| Parameter      | Description                                                                                 |
| -------------- | ------------------------------------------------------------------------------------------- |
| borrowedAmount | Amount of the underlying to borrow.                                                         |
| onBehalfOf     | The address for which the Credit Account is being opened.                                   |
| calls          | The array of calls to execute immediately after opening an account.                         |
| referralCode   | Referral code, which is used for potential partner rewards. 0 if no referral code provided. |

**NB!** While collateral is automatically transferred from the `msg.sender` during `openCreditAccount`, for `openCreditAccountMulticall` that is no longer the case, and collateral has to be transferred within a multicall by adding a call to `CreditFacade.addCollateral()` to the `calls` array.

## Degen mode

Degen Mode is a special restricted mode in the Credit Facade, designed for testing in production. If Degen Mode is enabled, opening a credit account requires burning a special NFT from `msg.sender`. If `msg.sender`'s NFT balance is 0, account opening will fail.

The NFT is not returned after closing or liquidating the account, so each NFT allows to open 1 account only.

The NFTs are distributed by the DAO to well-known traders and builders in the space, in order to test the system with limited exposure of pool funds.

`CreditFacade.whitelisted()` can be used to determine whether the Credit Facade has Degen Mode enabled. `CreditFacade.degenNFT()` can be used to retrieve the NFT address.
