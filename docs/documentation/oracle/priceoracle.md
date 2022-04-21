---
title: Price oracle

---

# PriceOracle

In Gearbox V2, PriceOracle returns USD price for particular assets, result is returned with 8 decimals.

### ConvertToUSD
Converts one asset into USD (decimals = 8). Reverts if priceFeed doesn't exist
```solidity
 
    /// @param amount Amount to convert
    /// @param token Token address converts from
    /// @return Amount converted to USD
    function convertToUSD(uint256 amount, address token)
        external
        view
        returns (uint256);
```