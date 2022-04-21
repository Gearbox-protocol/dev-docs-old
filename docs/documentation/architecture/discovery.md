# Contracts discovery 

## Core contracts
Each interaction with Gearbox protocol start from contracts discovery to find corresponding contract which you need. 
You need to know AddressProvider address to get all others, which has methods to get addresses of all core contracts 
in the system.

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
AddressProvider keeps addresses of the latest version of smart contacts, so previously deployed contracts could relate on 
previous versions.
:::

[List of all deployed contracts on mainnet](/docs/documentation/deployments/deployed-contracts)


## Getting list of pools & credit managers
ContractsRegister keeps list of all pools and creditManagers. For getting them directly, we advise to use IContractsRegister.sol:

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
Each contract in the protocol has a function `version` which returns version in format uint256. 
API could be changed in other versions, so it's recommended to get it before interacting with 
some particular contract.

Code snippet from CreditManager:
```solidity
// Contract version
uint256 public constant override version = 2;
```