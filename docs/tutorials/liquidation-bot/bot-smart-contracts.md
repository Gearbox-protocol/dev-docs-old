# Bot Smart Contracts

You may have saw there are some `.sol` files in `contracts/` of [liquidation bot](https://github.com/Gearbox-protocol/liquidation-bot). They include a main contract `Terminator.sol` and some auxiliary contract like interfaces, etc. Thus we will focus on the `Terminator.sol` file in this chapter. This the tables of variables and functions.

### Variables
| Variable                                  | Interpretation                                                        |
|-------------------------------------------|-----------------------------------------------------------------------|
| mapping(address => bool) public executors | Map from address to a bool indicating if this address is an executor. |
| address[] public yearn                    | List of yearn vaults connected.                                       |

### Functions

| Functions                                                                                                                                             | Interpretation                                                                                          |
|-------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| allowExecutor(address _executor)                                                                                                                      | Add executor.                                                                                           |
| forbidExecutor(address _executor)                                                                                                                     | Remove executor.                                                                                        |
| addYearn(address _yearn)                                                                                                                              | Add yearn deposit vault.                                                                                |
| liquidateAndSellOnV2(<br />address _creditManager,<br />address _borrower,<br />address _router,<br />UniV2Params[] calldata _paths<br />) | Execute liquidation action on <br />`_borrower`'s CreditAccount of <br /> `_creditManager` and sell on<br />  Uniswap V2. |





