# Gearbox Core

As illustrated in [Architecture](/), Gearbox Core is a service layer which provides unified services including six component: AddressProvider, PoolRegistry, ACL, WETHGateway, AccountFactory, PriceOracle.  
These services are provided by serveal smart contracts: AddressProvider, AccountFactory, ContractsRegister, WETHGateway, ACL&ACL Trait, DataCompressor and Oracles.  

In this section we'll dig deeper into these smart contracts.

## AddressProvider

AddressProvider keeps addresses of core contracts which is used for smart contract address discovery.
Continuing from the [simple example](../environment-setup/a-simple-example) we built previously,
we can start to use other functionality of AddressProvider.

:::note
We assume that you're running a Mainnet fork by now. Please refer to the last step in [Gearbox SDK and Mainnet Forking](../environment-setup/gearbox-sdk) for instructions.
:::

Create a new source file [scripts/gearbox-discovery.ts](https://github.com/Gearbox-protocol/play-with-gearbox/blob/main/scripts/gearbox-discovery.ts) and query the latest vesion of Gearbox Contract. 
Let's take a look at the code. We can see that the code queries the address of contracts register `contractsRegisterAddress` from `addressProvider` and gets the list of pools and credit managers from `contractsRegister`. After quering the address of AccountFactory from AddressProvider and connecting to AccountFactory, we can get the accounts stats from `AccountFactory`.

```jsx title="scripts/gearbox-discovery.ts"
async function main() {
  // If you don't specify a //url//, Ethers connects to the default
  // (i.e. ``http:/\/localhost:8545``)
  const provider = new ethers.providers.JsonRpcProvider();
  // The address of Gearbox's AddressProvider contract
  const addressProvider = AddressProvider__factory.connect(ADDRESS_PROVIDER_ADDRESS, provider);

  // Start to query AddressProvider
  //
  // Get the latest version of Gearbox's contracts
  const version = await addressProvider.version();
  console.log("version of Gearbox Contract is ", version);

  // Get ContractsRegister
  const contractsRegisterAddress = await addressProvider.getContractsRegister();
  console.log("ContractsRegisterAddress is ", contractsRegisterAddress);
  //******************** ContractsRegister ********************
  const contractsRegister = ContractsRegister__factory.connect(contractsRegisterAddress, provider);
  const poolList = await contractsRegister.getPools();
  console.log("Pool List: ", poolList);
  const creditManagerList = await contractsRegister.getCreditManagers();
  console.log("Credit Manager List: ", creditManagerList);
  //******************** ContractsRegister ********************

  // Get ACL
  const ACLAddress = await addressProvider.getACL();
  console.log("ACL is ", ACLAddress);

  // Get PriceOracle
  const priceOracleAddress = await addressProvider.getPriceOracle();
  console.log("PriceOracle is ", priceOracleAddress);

  // Get AccountFactory
  const accountFactoryAddress = await addressProvider.getAccountFactory();
  console.log("AccountFactory is ", accountFactoryAddress);
  //******************** AccountFactory ********************
  const accountFactory = AccountFactory__factory.connect(accountFactoryAddress, provider);
  const countCreditAccount = await accountFactory.countCreditAccounts();
  console.log("Count of Credit Accounts: ", countCreditAccount);
  const countCreditAccountInStock = await accountFactory.countCreditAccountsInStock();
  console.log("Count of Credit Accounts InStock: ", countCreditAccountInStock);
  //******************** AccountFactory ********************

  // Get DataCompressor
  const dataCompressorAddress = await addressProvider.getDataCompressor();
  console.log("DataCompressor is ", dataCompressorAddress);

  // Get WETH Token
  const WETHGateway = await addressProvider.getWETHGateway();
  console.log("WETHGateway is ", WETHGateway);
}
```

Run this code by executing this shell command:

```bash
npx hardhat run scripts/gearbox-discovery.ts
```

This should produce the following output:

```

 ·-----------------|-------------·                                 
 |  Contract Name  ·  Size (KB)  │                                    
 ·-----------------|-------------·
version of Gearbox Contract is  BigNumber { value: "1" }
ContractsRegister is  0xA50d4E7D8946a7c90652339CDBd262c375d54D99
ACL is  0x523dA3a8961E4dD4f6206DBf7E6c749f51796bb3
PriceOracle is  0x0e74a08443c5E39108520589176Ac12EF65AB080
AccountFactory is  0x444CD42BaEdDEB707eeD823f7177b9ABcC779C04
DataCompressor is  0x0050b1ABD1DD2D9b01ce954E663ff3DbCa9193B1
WETHGateway is  0x4F952c4C5415B2609899AbDC2F8F352F600d14D6
```

## ContractsRegister

ContractsRegister maintains all the pools and credit managers.

The `ContractsRegister` can be retrieved by querying `AddressProvider`.  
`ContractsRegister` exports two functions that we can use, `getpools` and `getCreditManagers`.

The `gearbox-sdk` allows us to import `ContractsRegister__factory` to perform these operations.

We'll add some code in `scripts/gearbox-discovery.ts` between `ContractsRegister` and `ACL` to use this functionality.

```jsx title="scripts/gearbox-discovery.ts"
  ...
  // Get ContractsRegister
  const contractsRegisterAddress = await addressProvider.getContractsRegister();
  console.log("ContractsRegisterAddress is ", contractsRegisterAddress);
  //******************** ContractsRegister ********************
  const contractsRegister = ContractsRegister__factory.connect(contractsRegisterAddress, provider);
  const poolList = await contractsRegister.getPools();
  console.log("Pool List: ", poolList);
  const creditManagerList = await contractsRegister.getCreditManagers();
  console.log("Credit Manager List: ", creditManagerList);
  //******************** ContractsRegister ********************
  ...
```

Run this code by executing this shell command:

```bash
npx hardhat run scripts/gearbox-discovery.ts
```

This should produce the following output, where we can see the pool list and credit account list:

```
 ·-----------------|-------------·                    
 |  Contract Name  ·  Size (KB)  │                  
 ·-----------------|-------------·
version of Gearbox Contract is  BigNumber { value: "1" }
ContractsRegister is  0xA50d4E7D8946a7c90652339CDBd262c375d54D99
Pool List:  [                                       
  '0x24946bCbBd028D5ABb62ad9B635EB1b1a67AF668',
  '0x86130bDD69143D8a4E5fc50bf4323D48049E98E4',
  '0xB03670c20F87f2169A7c4eBE35746007e9575901', 
  '0xB2A015c71c17bCAC6af36645DEad8c572bA08A08'
]
Credit Manager List:  [
  '0x777E23A2AcB2fCbB35f6ccF98272d03C722Ba6EB',                      
  '0x2664cc24CBAd28749B3Dd6fC97A6B402484De527',
  '0x968f9a68a98819E2e6Bb910466e191A7b6cf02F0',
  '0xC38478B0A4bAFE964C3526EEFF534d70E1E09017'
]                    
ACL is  0x523dA3a8961E4dD4f6206DBf7E6c749f51796bb3
PriceOracle is  0x0e74a08443c5E39108520589176Ac12EF65AB080
AccountFactory is  0x444CD42BaEdDEB707eeD823f7177b9ABcC779C04
DataCompressor is  0x0050b1ABD1DD2D9b01ce954E663ff3DbCa9193B1
WETHGateway is  0x4F952c4C5415B2609899AbDC2F8F352F600d14D6
```

## ACL

ACL keeps permissions for different addresses. For the moment, it keeps 2 different roles:

* **PausableAdmin**: Can pause and unpause contracts
* **Configurator**: Can configure contracts parameters

This part is mainly related to security and we can see from this [article](./anomaly-detection) how it will be used.

## WETHGateway

ETH <=> WETH wrapper for Gearbox protocol. It implements IWETHGateway interface.

## AccountFactory

Reusable Credit Accounts are one of the main innovations of Gearbox. Users rent a predeployed credit account smart contract from the protocol, and thus save on deployment gas costs.

![](/images/tutorial/Gearbox\_white\_high.021.png)

Each time, when a user opens a credit account in Gearbox protocol, `CreditManager` takes a pre-deployed credit account contract from the `AccountFactory` and when the user closes the credit account, `CreditManager` returns it.

If `AccountFactory` has no pre-deployed contracts, it clones it using [https://eips.ethereum.org/EIPS/eip-1167](https://eips.ethereum.org/EIPS/eip-1167)

### Advantages

* **Gas efficiency:** This solution is much more gas-efficient, because it doesn't require creating a new contract each time and has minimal operational overhead.

* **Hacker-proof:** Contract funds are allocated on isolated contracts which makes a possible attack more complex and less economically reasonable. Furthermore, the gearbox protocol uses anomaly detection to pause contracts and keep funds safe if suspicious behavior is found. User can protect their funds by splitting them between a few virtual accounts, and it makes the attack less economic reasonable.

* **Balance transparency on Etherscan:** Trader or farmer could check all their transactions on Etherscan if they know at which block they start and finish virtual account renting.

* **Ethereum network ecology:** It generates significantly less data in comparison with deployment credit contract for each new customer, and consume significantly less gas than keeping all balances in one place. As result it makes less impact on Ethereum infrastructure.

### Implementation

`AccountFactory` supplies a Credit Account to `CreditManager` on demand and keeps them when they are not used.

The account factory uses a list to keep credit accounts and two pointers: head and tail.

![](/images/tutorial/va\_list.jpeg)

When a user open a credit account, `CreditManager` will ask `AccountFactory` for a virtual account by calling function `takeCreditAccount` which takes one `CreditAccount` from the head pointer. When returns a `CreditAccount`, `AccountFactory` adds it to the tail.

## DataCompressor

`DataCompressor` collects data from different contracts in order to transmit this information in an aggregated way to a dApp.  

Let's list some main function in `DataCompressor`:

* `getCreditAccountList(address borrower)` for getting the list of `CreditAccountData`s of a specified borrower
* `getCreditAccountData(address _creditManager, address borrower)` for getting `CreditAccountData` of a specified borrower under a specified `CreditManager`
* `getCreditAccountDataExtended(address creditManager, address borrower)` for getting `CreditAccountDataExtended` of a specified borrower under a specified `CreditManager`, `CreditAccountDataExtended` is the extension types of `CreditAccountData`, you can check `Types.sol` for more details.
* `getCreditManagersList(address borrower)` for getting list of `CreditManagerData` of a specified borrower
* `getPoolsList()` for getting list of `PoolData`

:::info
Datacompressor has an unstable API
:::

Because most of the functions need a `borrower` address as parameter, we are unable to demo its output. You can use your (test) wallet to open an account and try to use it yourself.
