# Debt management

User can manage debt size using 2 methods in ICreditFacade:

## Increase debt

```solidity
function increaseDebt(uint256 amount) external;
```

Increases debt by tranferring funds from the pool. To account increased debt, it updates cumulativeIndexAtOpen parameter.

| Parameter | Description                        |
| --------- | ---------------------------------- |
| amount    | Amount to increase borrowed amount |

## Decrease debt

Decreases debt by paying funds back to pool. The payment also include interest rate accrued at the moment and fees for whole debt. So, you would be charged for:
` amount + interestAccrued + fees`.

```solidity
    function decreaseDebt(uint256 amount) external;
```

| Parameter | Description                         |
| --------- | ----------------------------------- |
| amount    | Amount to descrease borrowed amount |

### How to compute the total?

```solidity
/// NEED TO ADD COMPUTATION CODE HERE
```