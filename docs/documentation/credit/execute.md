import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Executing transactions

## Overview

User can consider credit account as your additional account, because all opeartions are executed on behalf of it.

![Opening credit account](/images/credit/execute.jpg)

To interact with 3rd party protocol, each it's contract should be connected with CreditManager via special
contract called [Adapter](/docs/documentation/integrations/intro). This contract has the same API as original contract, so you should "prepare" your calldata and send it to adapter instead original contract.

Transaction would be reverted if:

- If token which would be sent as result is forbidden
- If health factor after operation becomes < 1

## How to make a transaction

To make a transaction, developer should get address of particular adapter and make the same call as with original contract.

<Tabs>
<TabItem value="solidity" label="Solidity">

```solidity
    // This code snippet shows how to make a swap using your own funds and credit account funds

    /// @dev Uniswap router address
    address UNISWAP_V2_ROUTER = 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D;

    /// @dev Swap parameters
    uint256 amountIn = 1000 * 10**18;
    uint256 amountOutMin = 0;

    address[] memory path = new address[](2);
    path[0] = 0x6B175474E89094C44Da98b954EedeAC495271d0F; // DAI Token
    path[1] = 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2; // WETH Token

    address to = msg.sender;
    uint256 deadline = block.timestamp + 1;

    // Gets adapter address
    address adapter = ICreditFacade(creditFacade).contractToAdapter(
        UNISWAP_V2_ROUTER
    );

    // This transaction make a swap using funds on your own account
    IUniswapV2Router02(UNISWAP_V2_ROUTER).swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        to,
        deadline
    );

    // This transaction make a swap using funds on your Credit account
    IUniswapV2Router02(adapter).swapExactTokensForTokens(
        amountIn,
        amountOutMin,
        path,
        to,
        deadline
    );
```

</TabItem>
<TabItem value="typescript" label="Typescript">

```typescript

```

</TabItem>

</Tabs>
