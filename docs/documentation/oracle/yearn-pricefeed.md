---
title: Yearn Vault Price Feed
---

The Yearn vault price feed returns the USD price for a single Yearn Vault share. It is calculated as a price of a single share in vault underlying (which is fetched from `IYVault.pricePerShare()`), multiplied by the underlying price in USD.

To avoid `pricePerShare()` manipulation affecting Gearbox, the price feed checks the `pricePerShare()` returned value against preset lower and upper bounds. If the value falls outside the bounds, the function reverts.

The bounds are configured by the governance and the upper bound is typically set to the current price per share + 2%.

