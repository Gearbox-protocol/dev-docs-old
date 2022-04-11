# Liquidity


## Liquidity operations

### Add liquidity <a href="#add-liquidity" id="add-liquidity"></a>

$$
EL(t_n) = EL(t_{n-1})+amount_U+B(t_{n-1})*r(t_{n-1})*(t_{n}-t_{n-1})
$$

$$
mint\;diesel\;tokens =amount_{U}*\frac{diesel\;supply(t_n)}{EL(t_{n-1})}
$$

where amount\_U - is amount of added underlying liquidity.  Then called Pool Update().&#x20;

### Remove liquidity <a href="#remove-liquidity" id="remove-liquidity"></a>

$$
EL(t_n) = EL(t_{n-1})+
$$

$$
+B(t_{n-1})*r(t_{n-1})*(t_{n}-t_{n-1})-amount_{LP}*\frac{EL(t_n)}{diesel\;supply(t_n)},
$$

$$
burn\;diesel\;tokens =amount_{LP}
$$

where amount\_LP - amount of removed LP tokens.Then call Pool Update().&#x20;

## Adding / removing liquidity programatically

### addLiquidity

Adds liquidity to pool and send diesel (LP) tokens back to LP:

* Transfers underlying asset to pool
* Mints diesel (LP) token with current diesel rate
* Updates expected liquidity
* Updates borrow rate

```solidity
function addLiquidity(
        uint256 amount,
        address onBehalfOf,
        uint256 referralCode
    ) external 
```

| Parameter    | Description                                                                                                                                                                                               |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| amount       | Amount of tokens to be transfer                                                                                                                                                                           |
| onBehalfOf   | The address that will receive the diesel tokens, same as msg.sender if the user wants to receive them on his own wallet, or a different address if the beneficiary of diesel tokens is a different wallet |
| referralCode | Code used to register the integrator originating the operation, for potential rewards. 0 if the action is executed directly by the user, without any middle-man                                           |



### removeLiquidity

```solidity
function removeLiquidity(uint256 amount, address to)
external
```

| Parameter | Description                     |
| --------- | ------------------------------- |
| amount    | Amount of tokens to be transfer |
| to        | Address to transfer liquidity   |

It burns user diesel (LP) tokens and returns underlying tokens:

* Transfers to LP _underlying account_ = amount \* diesel rate
* Burns diesel tokens
* Decreases underlying amount from total\_liquidity&#x20;
* Updates borrow rate

