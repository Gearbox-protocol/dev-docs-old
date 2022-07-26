# Adapters

To use funds from `CreditAccount`s, users must interact with `Adapters` - smart contracts which provide the same api like the original ones (for example, [ISwapRouter.sol](https://docs.uniswap.org/protocol/reference/periphery/interfaces/ISwapRouter)), but instead use funds from `CreditAccount`. A `CreditManager` can connect to multiple adapters, but an adapter can only connect to one `CreditManager`, so for a DeFi protocol, there may be multiple adapters corresponding to different `CreditManager`s. Adapters are proxy contracts whos concern is to modify the swap functions when using funds is required.

Let's read the code of `exactInputSingle` function in UniswapV3 adapter contract.

## UniswapV3 adapter example

```solidity title="contracts/adapters/UniswapV3.sol"
/// @notice Swaps `amountIn` of one token for as much as possible of another token
/// @param params The parameters necessary for the swap, encoded as `ExactInputSingleParams` in calldata
/// @return amountOut The amount of the received token
function exactInputSingle(ExactInputSingleParams calldata params)
    external
    payable
    override
    returns (uint256 amountOut)
{
    address creditAccount = creditManager.getCreditAccountOrRevert(
        msg.sender
    );

    creditManager.provideCreditAccountAllowance(
        creditAccount,
        router,
        params.tokenIn
    );

    ExactInputSingleParams memory paramsUpdate = params;
    paramsUpdate.recipient = creditAccount;

    // 0x414bf389 = exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))
    bytes memory data = abi.encodeWithSelector(
        bytes4(0x414bf389),
        paramsUpdate
    );

    uint256 balanceInBefore = IERC20(paramsUpdate.tokenIn).balanceOf(
        creditAccount
    );

    uint256 balanceOutBefore = IERC20(paramsUpdate.tokenOut).balanceOf(
        creditAccount
    );

    (amountOut) = abi.decode(
        creditManager.executeOrder(msg.sender, router, data),
        (uint256)
    );

    creditFilter.checkCollateralChange(
        creditAccount,
        params.tokenIn,
        params.tokenOut,
        balanceInBefore.sub(
            IERC20(paramsUpdate.tokenIn).balanceOf(creditAccount)
        ),
        balanceOutBefore.add(
            IERC20(paramsUpdate.tokenOut).balanceOf(creditAccount)
        )
    );
}
```

Let's check the example of `exactInputSingle` adapter to clarify how it works.  
First of all, the adapter has the same signature as [ISwapRouter.sol](https://docs.uniswap.org/protocol/reference/periphery/interfaces/ISwapRouter) from original uniswap v3 package.  
You need only to reroute the same calldata to this adapter to execute transaction using funds from `CreditAccount`.

1. We query the `CreditAccount` address through `CreditManager`. The function will revert if `msg.sender` has no open accounts.
2. Then, we check whether the credit account has enough allowance for operation and privide MAX_INT. If that's not the case, the function should revert.
3. Then, we check parameters, and change recipient to `CreditAccount` to eliminate taking funds out from `CreditAccount`, thenn we pack the `exactInputSingle` function and updated parameters into memory bytes.
4. We take existing balances of two assets which will be traded. The policy is not to trust for return values because they could be malicous, and adapter is designed for particiular interface not protocol (like UniswapV2 interface could be used for many services).
5. The adaper calls `executeOrder` method of `creditManager`, which check that this adapter and contract are allowed, and then it calls the same call data (which we packed and encoded in step 3) using credit account contract and returns result.

**NOTE: It's significant to decode return values and return them cause this adapter could be called programatically and they could be used in the logic of other smart contracts.** 6. At the last step, it calls checkCollateralChange function, which checks the following policies:
_`tokenOut` is in allowed token list.
_ Operation could pass fastCheck / healthFactorCheck \* It's crucial to provide delta in two token balances to compute correct health factor computations. If the function doesn't pass these policies, it will revert.
