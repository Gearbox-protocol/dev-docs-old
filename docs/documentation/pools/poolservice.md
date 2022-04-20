# PoolService

Pool Service is a base class for all pools. It encapsulates business logic for:

* Adding/removing pool liquidity
* Managing diesel tokens & diesel rates
* Provide liquidity to Credit account manages

PoolService implements [IPoolService](https://github.com/Gearbox-protocol/gearbox-v2/blob/master/contracts/interfaces/IPoolService.sol) interface.

## Code

[PoolService.sol](https://github.com/Gearbox-protocol/gearbox-contracts/blob/master/contracts/interfaces/IPoolService.sol)

## Events

### AddLiquidity <a href="#event_addliquidity" id="event_addliquidity"></a>

```solidity
event AddLiquidity(
   address indexed sender,
   address indexed onBehalfOf,
   uint256 amount,
   uint256 referralCode
);
```

Emits each time when LP adds liquidity to the pool

### RemoveLiquidity <a href="#event_removeliquidity" id="event_removeliquidity"></a>

```solidity
event RemoveLiquidity(
    address indexed sender, 
    address indexed to, 
    uint256 amount);
```

�Emits each time when LP removes liquidity to the pool

### Borrow

```solidity
event Borrow(
    address indexed creditManager,
    address indexed creditAccount,
    uint256 amount
);
```

Emits each time when Virtual account manager borrows money from pool

### Repay

```solidity
event Repay(
   address indexed creditManager,
   uint256 borrowedAmount,
   uint256 profit,
   uint256 loss
);
```

�Emits each time when Virtual account manager repays money from pool

### NewInterestRateModel

```solidity
event NewInterestRateModel(
    address indexed newInterestRateModel);
```

Emits each time when Interest Rate model was changed

### NewCreditManagerConnected

```solidity
event NewCreditManagerConnected(
    address indexed creditManager);
```

Emits each time when new credit Manager was connected

### BorrowForbidden

```solidity
event BorrowForbidden(
    address indexed creditManager);
```

Emits each time when borrow forbidden for credit manager

### UncoveredLoss

```solidity
event UncoveredLoss(
    address indexed creditManager, 
    uint256 loss);
```

Emits each time when uncovered (non insured) loss accrued

### NewExpectedLiquidityLimit

```solidity
event NewExpectedLiquidityLimit(
    uint256 newLimit);
```

Emits after expected liquidity limit update

## State-Changing Functions <a href="#state-changing-functions" id="state-changing-functions"></a>



### lendCreditAccount

```solidity
  function lendCreditAccount(
    uint256 borrowedAmount, 
    address creditAccount)
    external
```

| Parameter      | Description                        |
| -------------- | ---------------------------------- |
| borrowedAmount | Borrowed amount for credit account |
| creditAccount  | Credit account address             |

* Lends funds to virtual account
* Update pool parameters

Restricted to be called by connected credit managers only with borrow permission.

### repayCreditAccount

```solidity
function repayCreditAccount(
    uint256 borrowedAmount,
    uint256 profit,
    uint256 loss
    ) external
```

�It's called to repay credit account funds back to pool and to update pool parameters.

\


## Getters

### expectedLiquidity

```solidity
function expectedLiquidity() public 
view override returns (uint256)
```

Gets total liquidity which includes the amount in the pool and forecasted interest:

$$
total\;liquidity= total\;liquidity\;last\;update+interest\;rate\;on\;borrowed\;amount
$$



### availableLiquidity&#x20;

```solidity
function availableLiquidity() 
external 
view 
returns (uint256)
```

Gets available liquidity in the pool (pool balance) by getting balance of udnerlyin token

###

### getBorrowRate\_RAY

```solidity
function getBorrowRate_RAY() 
external 
view 
returns (uint256)
```

Calculates borrow rate in RAY format

### totalBorrowed

```solidity
function totalBorrowed() 
external 
view 
returns (uint256)
```

Gets the amount of total borrowed funds

### underlyingToken&#x20;

```solidity
function underlyingToken() 
external 
view 
returns (address)
```

Gets underlying token address

### dieselToken

```solidity
function dieselToken() 
external 
view
returns (address)
```

Gets Diesel(LP) token address

