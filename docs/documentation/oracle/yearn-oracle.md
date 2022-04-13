---
title: Yearn oracle

---

1. Yearn price oracle reads pricePerShare value from Yearn's Vault.

2. To avoid manipulations of pricePerShare, the oracle has upper and lower boundaries of pricePerShare. If yearn vault retruns value inside this interval, then oracle returns pricePerShare value. If yearn vault returns value higher than upperBound, the oracle returns upperBound value and similarly oracle returns lowerBound value if pricePerShare < lowerBound.

3. Max and min allowed values of pricePerShare can be changed by governance. 


