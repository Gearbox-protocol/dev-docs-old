---
title: Curve price feed
---

The Curve price feed returns the USD price for a single Curve LP share. The price is computed as `ICurvePool.get_virtual_price()` multiplied by the USD price of the cheapest asset in the Curve pool currently.

The intuition behind this is that it is more profitable to withdraw the asset with the largest balance in the pool (since otherwise the user will suffer imbalancing fees), which will be the cheapest asset. Therefore, a fair price for a Curve LP share is based on the price of the cheapest asset.

To avoid `get_virtual_price()` manipulation affecting Gearbox, the price feed checks the `get_virtual_price()` returned value against preset lower and upper bounds. If the value falls outside the bounds, the function reverts.

The bounds are configured by the governance and the upper bound is typically set to the current value + 4%.
