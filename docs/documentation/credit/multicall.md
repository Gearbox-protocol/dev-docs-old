import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Multicall

## Overview

Multicall is new feature in Gearbox V2, which allows users to execute a batch of transactions in one transaction. Using multicall has a lot of advantages:

- **Gas efficiency**  
  Multicall makes only one collateral check after all transactions which dramatically reduce gas consumption

- **One-click strategies user experience**  
  Multicall could be used as a part of open credit account or could be run alone. Developers could build complex strategies which requires only one transactions should be signed

- **Low-cost liquidations**  
  Multicall changes closure and liquidation flow. In V2, you as developer should just make a list of transactions which swap all needed assets into underlying one. And then debt + interest rate will be paid from this funds

## How to make a multicall

To make a multicall, developer should prepare an array of `Multicall`, providing the list of transaction in desired order and use it as parameter to function in CreditFacade which supports multicall:

```solidity
    struct MultiCall {
        address target;
        bytes callData;
    }

    /// @dev Opens credit account and run a bunch of transactions for multicall
    /// - Opens credit account with desired borrowed amount
    /// - Executes multicall functions for it
    /// - Checks that the new account has enough collateral
    /// - Emits OpenCreditAccount event
    ///
    /// @param borrowedAmount Debt size
    /// @param onBehalfOf The address that we open credit account. Same as msg.sender if the user wants to open it for  his own wallet,
    ///   or a different address if the beneficiary is a different wallet
    /// @param calls Multicall structure for calls. Basic usage is to place addCollateral calls to provide collateral in
    ///   assets that differ than undelyring one
    /// @param referralCode Referral code which is used for potential rewards. 0 if no referral code provided

    function openCreditAccountMulticall(
        uint256 borrowedAmount,
        address onBehalfOf,
        MultiCall[] calldata calls,
        uint256 referralCode
    ) external payable;


    /// @dev Run a bunch of transactions for multicall and then close credit account
    /// - Wraps ETH to WETH and sends it msg.sender is value > 0
    /// - Executes multicall functions for it (the main function is to swap all assets into undelying one)
    /// - Close credit account:
    ///    + It checks underlying token balance, if it > than funds need to be paid to pool, the debt is paid
    ///      by funds from creditAccount
    ///    + if there is no enough funds in credit Account, it withdraws all funds from credit account, and then
    ///      transfers the diff from msg.sender address
    ///    + Then, if sendAllAssets is true, it transfers all non-zero balances from credit account to address "to"
    ///    + If convertWETH is true, the function converts WETH into ETH on the fly
    /// - Emits CloseCreditAccount event
    ///
    /// @param to Address to send funds during closing contract operation
    /// @param skipTokenMask Tokenmask contains 1 for tokens which needed to be skipped for sending
    /// @param convertWETH It true, it converts WETH token into ETH when sends it to "to" address
    /// @param calls Multicall structure for calls. Basic usage is to place addCollateral calls to provide collateral in
    ///   assets that differ than undelyring one
    function closeCreditAccount(
        address to,
        uint256 skipTokenMask,
        bool convertWETH,
        MultiCall[] calldata data
    ) external payable;

    /// @dev Run a bunch of transactions (multicall) and then liquidate credit account
    /// - Wraps ETH to WETH and sends it msg.sender (liquidator) is value > 0
    /// - It checks that hf < 1, otherwise it reverts
    /// - It computes the amount which should be paid back: borrowed amount + interest + fees
    /// - Executes multicall functions for it (the main function is to swap all assets into undelying one)
    /// - Close credit account:
    ///    + It checks underlying token balance, if it > than funds need to be paid to pool, the debt is paid
    ///      by funds from creditAccount
    ///    + if there is no enough funds in credit Account, it withdraws all funds from credit account, and then
    ///      transfers the diff from msg.sender address
    ///    + Then, if sendAllAssets is false, it transfers all non-zero balances from credit account to address "to".
    ///      Otherwise no transfers would be made. If liquidator is confident that all assets were transffered
    ///      During multicall, this option could save gas costs.
    ///    + If convertWETH is true, the function converts WETH into ETH on the fly
    /// - Emits LiquidateCreditAccount event
    ///
    /// @param to Address to send funds during closing contract operation
    /// @param skipTokenMask Tokenmask contains 1 for tokens which needed to be skipped for sending
    /// @param convertWETH It true, it converts WETH token into ETH when sends it to "to" address
    /// @param calls Multicall structure for calls. Basic usage is to place addCollateral calls to provide collateral in
    ///   assets that differ than undelyring one
    function liquidateCreditAccount(
        address borrower,
        address to,
        uint256 skipTokenMask,
        bool convertWETH,
        MultiCall[] calldata data
    ) external payable;

    /// @dev Executes a bunch of transactions and then make full collateral check:
    ///  - Wraps ETH and sends it back to msg.sender address, if value > 0
    ///  - Execute bunch of transactions
    ///  - Check that hf > 1 ather this bunch using fullCollateral check
    /// @param calls Multicall structure for calls. Basic usage is to place addCollateral calls to provide collateral in
    ///   assets that differ than undelyring one
    function multicall(MultiCall[] calldata calls)
        external
        payable;

```

### Examples

Let's check how to make multicall by example

<Tabs>
<TabItem value="solidity" label="Solidity">

```solidity
    MultiCall[] memory calls = new MultiCall[](2);
    calls[0] = MultiCall({
        target: address(creditFacade),
        callData: abi.encodeWithSelector(
            ICreditFacade.addCollateral.selector,
            FRIEND,
            underlying,
            200
        )
    });

    calls[1] = MultiCall({
        target: address(creditFacade),
        callData: abi.encodeWithSelector(
            ICreditFacade.decreaseDebt.selector,
            812
        )
    });

    creditFacade.multicall(calls);
```

</TabItem>
<TabItem value="typescript" label="Typescript">

```typescript

```

</TabItem>
</Tabs>


### How it works

- Multicall transfers account ownership to CreditFacade
- Multical executes operations one by one
- Multicall transafers account ownership back to borrower


### Functions which could be called
During multicall following funtions could be called:
- Adapters function: Note! you should provide `adapter` (not targetContract!) as `target` parameter if you want to execute transaction
- CreditFacade functions: addCollateral, increaseDebt, decreaseDebt. You should provide `creditFacade` as target prarameter. 

### Restrictions
- It's forbidden to increase and decrease debt in one multicall
- It's forbidden to decrease debt if multicall was called in openCreditAccountMulticall
- All creditFacade funtcions (addCollateral, increaseDebt, decreaseDebt) is forbidden during closure / liquidation multicall
