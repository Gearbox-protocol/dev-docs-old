# Adding collateral

We strongly recommend to use `addCollateral` method in `CreditFacade` contract instead of tranferring tokens directly to credit account.
This method is designed for your safety, let's check advantages:

- It works with `borrower` address instead of credit account address, so it would be reverted, if borrower closed his account or 
such account was liquidated
- It enables token, if such a token wasn't enabled before

## Method

### Normal call
```solidity
    function addCollateral(
        address onBehalfOf,
        address token,
        uint256 amount
    ) external payable;
```

| Parameter      | Description                                                                          |
| -------------- | -------------------------------------------------------------------------------------|
| onBehalfOf     | Address of borrower to add funds                                                     |
| token          | Token address, it should be whitelisted on CreditManagert, otherwise it reverts      |
| amount         | Amount to add                                                                        |


### Adding collateral in multicall

During multicall it's possible to addCollateral:

```solidity
    MultiCall[] memory calls = new MultiCall[](1);
    calls[0] = MultiCall({
        target: address(creditFacade),
        callData: abi.encodeWithSelector(
            ICreditFacade.addCollateral.selector,
            BORROWER,
            token,
            amount
        )
    });
```