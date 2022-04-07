# LinearInterestRateModel

Linear interest rate model, similar to which Aave uses: [https://docs.aave.com/risk/asset-risk/methodology](https://docs.aave.com/risk/asset-risk/methodology). In the next version, we are going to use a specially designed curve - see the [paper](https://colab.research.google.com/drive/1UciFX7BQ62mtme0r84FO95FfA8C\_zQKI).

LinearInterestRateModel implements [IInterestRateModel.sol](https://github.com/Gearbox-protocol/gearbox-v2/blob/master/contracts/interfaces/IInterestRateModel.sol).

## Code

[LinearInterestRateModel.sol](https://github.com/Gearbox-protocol/gearbox-contracts/blob/master/contracts/pool/LinearInterestRateModel.sol)

## Getters

### calcBorrowRate

```
function calcBorrowRate(uint256 totalLiquidity, 
    uint256 availableLiquidity) 
    external 
    view 
    returns (uint256)
```

�Calculates borrow rate

### getModelParameters

```
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

�Gets interest rate model parameters

