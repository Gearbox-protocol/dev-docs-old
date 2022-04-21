# Open credit account

To interact with Gearbox, user should open an credit account. During the opening flow, credit account takes margin loan from the pool and get collateral from user account as well.

Let's check an example:

![Opening credit account](/images/credit/openCreditAccount.jpg)

Trader takes 90 ETH loan and provide 10 ETH of his own initial funds. So, after opening account, the total balance on credit account would be 100 ETH.

Note! In our example, trader provides 10 ETH for simplicity, however, it's possible to provide collateral in different assets and use multicollateral if needed.

Credit account is an isolated smart contract, trader could execute different transactions, however, has no direct access to the funds.

## Limits & restrictions

Each creditManager has it's own limits for min and max allowed borrowed amount, which are set by DAO. To get these limits, use creditManager getters:

```solidity
/// @return minimal borrowed amount per credit account
function minBorrowedAmount() external view returns (uint256);

/// @return maximum borrowed amount per credit account
function maxBorrowedAmount() external view returns (uint256);
```

Note! It's forbidden to open & close (liquidate) credit account in the same block.

## Methods
To open credit account you can use 2 methods in `CreditFacade` contract. If you open creditAccount for other account (`onBehalfOf != msg.sender`), keep in mind, that you should have allowance for [account transfer](/).

### Open credit account

```solidity
function openCreditAccount(
    uint256 amount,
    address onBehalfOf,
    uint256 leverageFactor,
    uint256 referralCode
) external payable;
```

| Parameter      | Description                                                                          |
| -------------- | -------------------------------------------------------------------------------------|
| amount         | Borrowers initial funds                                                              |
| onBehalfOf     | The address that we open credit account. Same as msg.sender if the user wants to open it for  his own wallet, or a different address if the beneficiary is a different wallet | 
| leverageFactor | Multiplier to borrowers own funds                                                    |
| referralCode   | Referral code which is used for potential rewards. 0 if no referral code provided    |

### Open credit account with multicall

```solidity
function openCreditAccountMulticall(
    uint256 borrowedAmount,
    address onBehalfOf,
    MultiCall[] calldata calls,
    uint256 referralCode
) external payable;
```
| Parameter      | Description                                                                          |
| -------------- | -------------------------------------------------------------------------------------|
| borrowedAmount | Debt size                                                                            |
| onBehalfOf     | The address that we open credit account. Same as msg.sender if the user wants to open it for  his own wallet, or a different address if the beneficiary is a different wallet | 
| leverageFactor | Multiplier to borrowers own funds                                                    |
| referralCode   | Referral code which is used for potential rewards. 0 if no referral code provided    |

## Degen mode

Degen mode is designed for testing and iterations. If `degen mode` is enabled, only accounts which have `Degen Gearbox NFT` could open credit account. Furthermore, it's allowed to open such credit account only once, so, it account would be closed or liquidated, user can't open a new one.