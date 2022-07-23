# Closing a credit account

To repay the debt and close a Credit Account normally, the following `CreditFacade` function can be used:

```=solidity
function closeCreditAccount(
    address to,
    uint256 skipTokenMask,
    bool convertWETH,
    MultiCall[] calldata calls
) external payable;
```

| Parameter      | Description                                                                          |
| -------------- | -------------------------------------------------------------------------------------|
| to | The address to which the remaining collateral is sent after repaying the loan and closing the account.                                               |
| skipTokenMask     | A mask that encodes the tokens which should not be sent back to the user. Can be used to avoid sending dust or tokens that revert on transfer. | 
| convertWETH  | Whether to convert WETH to ETH before sending it to the user.  |
| calls | The array of calls to execute before closing the account.                                                  |

The multicall within `closeCreditAccount` would typically be used to convert collateral assets into underlying. If there is not enough underlying on the CA after performing the multicall, the Credit Manager will try to transfer the shortfall from the borrower.

This means that it is possible to normally close even an unhealthy account, as long as either the user deposits more underlying during a multicall through `addCollateral`, or has enough underlying on their address that is approved to the Credit Manager. 

Trying to close a Credit Account normally will fail if the Credit Manager cannot repay the entire debt to the pool.