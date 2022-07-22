---
title: Price oracle
---

# PriceOracle

PriceOracleV2 aggregates priceData from connected priceFeed. Datasources should be Chainlink USD pricefeeds and pricefeeds based on their data with decimals = 8. It also supports address-dependent priceFeeds to evaluate average price for NFT tokens on its balance.

Each priceFeed (data source) has 3 key parameters:

| Parameter         | Description                                                                                     |
| ----------------- | ----------------------------------------------------------------------------------------------- |
| priceFeed address | Address of the contract which is implement AggregatorV3Interface or IPriceFeedAddress interface |
| dependOnAddress   | Flag. If true the PriceFeed requires address to compute result                                  |
| skipPriceCheck    | Flag. If true price check should be skipped                                                     |

### Chainlink pricefeed

PriceOracleV2 supports Chailink Pricefeeds which implements AggregatorV3Interface. By default, all data from chainlink priceFeeds is going through sanity check, which reverts if data incorrect:

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

### LP PriceFeeds

LP pricefeeds should use Chainlink priceOracles and could be dependent of some smartcontract values. It's strongly recommendent to inherit `abstract contract LPPriceFeed` and use bound control for any values which is used from contracts to eliminate price manipulation issues.

### NFT and address dependent pricefeeds

### ZeroPriceFeed

### ConvertToUSD

Converts one asset into USD (decimals = 8). Reverts if priceFeed doesn't exist.

```solidity

    /// @param creditAccount which is needed for average NFT computations only. If provided
    /// token is address dependent and address(0) is provided, such transaction would be reverted
    /// @param amount Amount to convert
    /// @param token Token address converts from
    /// @return Amount converted to USD
    function convertToUSD(
        address creditAccount,
        uint256 amount,
        address token
    ) external view returns (uint256);
```

## Methods

### ConvertFromUSD

Converts one asset into another using price feed rate. Reverts if price feed doesn't exist
/// @param amount Amount to convert
/// @param token Token address converts from
/// @return Amount converted to tokenTo asset
function convertFromUSD(uint256 amount, address token)
external
view
returns (uint256);
