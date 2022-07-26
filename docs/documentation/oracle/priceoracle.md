---
title: Price oracle
---

# PriceOracle

PriceOracleV2 aggregates price data from connected price feeds and uses it to value collateral assets to, e.g., compute Credit Account health. 

Feeds must be USD-denominated and have 8 decimals.

Each priceFeed (data source) has 3 key parameters:

| Parameter         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| priceFeed address | The address of the price feed, which should be a contract implementing `AggregatorV3Interface` or `IPriceFeedAddress interface`. |
| dependOnAddress   | A flag that determines whether the price feed's output is dependent on the target address. This is mainly used to value NFT's (see below).                           |
| skipPriceCheck    | A flag determining whether the check for price feed result correctness should be skipped. Used for `ZeroPriceFeed`, and LP price feeds, which have their own correctness checks. |


## Price feeds by token type

| Token type       | Price feed type                                 |
| ---------------- | ---------------------------------------------------------------- |
| Normal token     | Original Chainlink price feed                                              |
| Yearn LP tokens  | [Yearn LP price feed](/docs/documentation/oracle/yearn-pricefeed) |
| Curve LP tokens  | [Curve LP price feed](/docs/documentation/oracle/curve-pricefeed) |
| Convex LP tokens | Curve LP price feed for the underlying token is used                      |
| Forbidden token  | Forbidden tokens would typically have their price feeds changed to `ZeroPriceFeed`, to prevent the system from being exploited.  |
| Other            | `ZeroPriceFeed` would typicaly be used for tokens without price feeds or clear ways to evaluate them.  |

### Chainlink price feed

PriceOracleV2 supports Chainlink price feeds that implement `AggregatorV3Interface`. By default, all results from Chainlink feeds goes through a correctness check, which reverts if the result is incorrect or stale:

```solidity

function _checkAnswer(
        uint80 roundID,
        int256 price,
        uint256 updatedAt,
        uint80 answeredInRound
    ) internal pure {
        if (price <= 0) revert ZeroPriceException(); // F:[PO-5]
        if (answeredInRound < roundID || updatedAt == 0)
            revert ChainPriceStaleException(); // F:[PO-5]
    }

```

### LP price feeds

LP price feeds usually return a function computed from ordinary token price feeds, as well as some additional data, depending on the protocol.

An abstract contract `LPPriceFeed` serves as a base for all LP price feeds and contains logic for bound control for results. In some cases, values used for LP price feed calculation (e.g., Yearn `pricePerShare`) may be manipulatable, and the bounds ensure that short-term manipulation does not affect Gearbox.

### NFT and address dependent pricefeeds

Unlike fungible tokens, NFTs, such as Uniswap V3 LP positions, do not have a single uniform price. There is no reliable way to compute the actual value of NFTs on an account from balance alone.

Passing the credit account's address allows the price feed to determine the NFTs a CA has, and correctly compute their value. 

### ZeroPriceFeed

`ZeroPriceFeed` returns zero at all times. Only one `ZeroPriceFeed` contract is deployed on each network and serves all tokens for which there are no Chainlink feeds, or those feeds are unreliable.


## Methods
### ConvertToUSD

Converts an asset amount into USD (decimals = 8). Reverts if priceFeed doesn't exist.

```solidity
function convertToUSD(
    address creditAccount,
    uint256 amount,
    address token
) external view returns (uint256);
```
| Parameter         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| creditAccount | The address of the credit account to convert for. Only relevant for price feeds with `dependOnAddress == true`, and is ignored otherwise.  |
| amount   | Amount to convert into USD.                       |
| token    | The token for which the conversion is performed. |

### ConvertFromUSD

Converts an amount of USD (decimals = 8) into an asset.

```solidity
function convertFromUSD(
    address creditAccount,
    uint256 amount,
    address token
) external view returns (uint256);
```
| Parameter         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| creditAccount | The address of the credit account to convert for. Only relevant for price feeds with `dependOnAddress == true`, and is ignored otherwise.  |
| amount   | Amount of USD to convert.                      |
| token    | The token for which the conversion is performed. |


### getPrice

Returns price of a single token unit in USD (decimals = 8).

```solidity
function getPrice(address creditAccount, address token)
    external
    view
    returns (uint256 price);
```
| Parameter         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| creditAccount | The address of the credit account to get the price for. Only relevant for price feeds with `dependOnAddress == true`, and is ignored otherwise.  |
| token    | The token for which the price is requested. |

### convert

Convers an amount of one asset to an equivalent amount of another asset.

```=solidity
function convert(
    address creditAccount,
    uint256 amount,
    address tokenFrom,
    address tokenTo
) external view returns (uint256)
```
| Parameter         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| creditAccount | The address of the credit account to convert for. Only relevant for price feeds with `dependOnAddress == true`, and is ignored otherwise.  |
| amount   | Amount of `tokenFrom` to convert.                  |
| tokenFrom    | Token to convert from. |
| tokenTo    | Token to convert into. |

### priceFeedsWithFlags

Returns a price feed with all relevant parameters for a token. Reverts if there is no price feed for the passed token.

```=solidity
function priceFeedsWithFlags(address token)
    public
    view
    returns (
        address priceFeed,
        bool dependsOnAddress,
        bool skipCheck,
        uint256 decimals
    );
```
| Parameter         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| token | The token to get the price feed for.  |

