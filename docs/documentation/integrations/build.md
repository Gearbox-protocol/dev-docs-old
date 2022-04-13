# Building adapters

To use funds from credit accounts, users should interact with adapters - smart contracts which provide the same api like original ones (for example, IUniswapV2Router02.sol), but use funds from credit account.

So, if user has 2 credit accounts in DAI and in WETH, and he wants to swap one asset to another, he can:

* Send transaction to original Uniswap router and swap using his own assets
* Send transaction to DAI Uniswap adapter and swap using DAI credit account assets
* Send transaction to WETH adapter and swap using WETH credit account assets.

Adapters are proxy contracts, they change only swap functions, where using funds is needed.

### UniswapV3 adapter example

```solidity
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
        bytes4(0x414bf389), // +
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

Let's check the example of exactInputSingle adapter to clarify how it works.

At first, the adapter has the same signature than ISwapRouter.sol from original uniswap v3 package. So, you need only to reroute the same calldata to this adapter to execute transaction using funds from credit account.

At line 10, we get credit account address. The function reverts, if msg.sender has no opened accounts.

Then, at line 14, we check that credit account has enough allowance for operation and provide MAX_INT, if no.

Then, we check parameters, and change recipient to credit account to eliminate taking funds out from credit account, then we pack updated parameters in line 24-27.

In lines 29-36, we take existing balances of two assets which will be traded. The policy is not to trust for return values, because they could be malicious, and adapter is designed for particular interface not protocol (like UniswapV2 interface could be used for many services).

In lines 37-40,  the adapter calls executeOrder method of creditManager, which check that this adapter and contract are allowed, and then it calls the same call data using credit account contract and returns result.

It's significant to decode return values and return them because this adapter could be called programmatically and they could be used in the logic of other smart contracts,

At the last step, it calls checkCollateralChange function, which checks the following policies:

* tokenOut is in allowed token list
* operation could pass fastCheck / healthFactorCheck - [check more](/)


It's crucial to provide delta in two token balances to compute correct health factor computations.

&#x20;If the function doesn't pass these policies, it will be reverted.

