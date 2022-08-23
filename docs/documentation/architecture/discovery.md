# Contracts discovery 

## Core contracts
Each interaction with Gearbox starts from retrieving the addresses of important contracts. `AddressProvider` stores the addresses of all core contracts.

| function                | return value                     | 
| ----------------------- | -------------------------------- |
| getACL()                | Address of ACL contract          |
| getContractsRegister()  | Address of ContractsRegister     |
| getAccountFactory()     | Address of AccountFactory        |
| getDataCompressor()     | Address of DataCompressor        |
| getGearToken()          | Address of GEAR token            |
| getWethToken()          | Address of WETH token            |
| getWETHGateway()        | Address of WETH Gateway          |
| getPriceOracle()        | Address of PriceOracle           |
| getTreasuryContract()   | Address of DAO Treasury Multisig |

   
:::note
AddressProvider stores the most up-to-date addresses. It is recommended to avoid caching Gearbox-related addresses for a long time and refresh them periodically through `AddressProvider`, since they can be changed by the governance.
:::

[List of all deployed contracts on mainnet](/docs/documentation/deployments/deployed-contracts)


## Getting list of pools & credit managers
`ContractsRegister` keeps a list of all active pools and Credit Managers:

```solidity
interface IContractsRegisterEvents {
    // emits each time when new pool was added to register
    event NewPoolAdded(address indexed pool);

    // emits each time when new credit Manager was added to register
    event NewCreditManagerAdded(address indexed creditManager);
}

/// @title Optimised for front-end Address Provider interface
interface IContractsRegister is IContractsRegisterEvents {
    //
    // POOLS
    //

    /// @dev Returns array of registered pool addresses
    function getPools() external view returns (address[] memory);

    /// @dev Returns pool address for i-element
    function pools(uint256 i) external returns (address);

    /// @return Returns quantity of registered pools
    function getPoolsCount() external view returns (uint256);

    /// @dev Returns true if address is pool
    function isPool(address) external view returns (bool);

    //
    // CREDIT MANAGERS
    //

    /// @dev Returns array of registered credit manager addresses
    function getCreditManagers() external view returns (address[] memory);

    /// @dev Returns pool address for i-element
    function creditManagers(uint256 i) external returns (address);

    /// @return Returns quantity of registered credit managers
    function getCreditManagersCount() external view returns (uint256);

    /// @dev Returns true if address is pool
    function isCreditManager(address) external view returns (bool);
}
```

## Versioning
Each contract in the protocol has a function `version` which returns the current version as a `uint256` value. Contract ABIs can change between versions, so it is recommended to get and verify the value before interacting with a particular contract.

Code snippet from CreditManager:
```solidity
// Contract version
uint256 public constant override version = 2;
```