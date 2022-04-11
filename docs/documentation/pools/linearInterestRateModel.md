# LinearInterestRateModel

Linear interest rate model, similar to which Aave uses: [https://docs.aave.com/risk/asset-risk/methodology](https://docs.aave.com/risk/asset-risk/methodology). In the next version, we are going to use a specially designed curve - see the [paper](https://colab.research.google.com/drive/1UciFX7BQ62mtme0r84FO95FfA8C\_zQKI).

LinearInterestRateModel implements IInterestRateModel

## Getters

### calcBorrowRate
Calculates borrow rate

```solidity
function calcBorrowRate(uint256 totalLiquidity, 
    uint256 availableLiquidity) 
    external 
    view 
    returns (uint256)
```



### getModelParameters
Gets interest rate model parameters

```solidity
function getModelParameters()
    external
    view
    returns (
        uint256 U_optimal,
        uint256 R_base,
        uint256 R_slope1,
        uint256 R_slope2
    )
```

