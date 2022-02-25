# Gearbox Core

As illustreated in [Architecture](./architecture), Gearbox core is a service layer which provides unified services including six component: AddressProvider, PoolRegistry, ACL, WETHGateway, AccountFactory, PriceOracle. These services are provided by serveal i smart contracts: AddressProvider, AccountFactory, ContractsRegister, WETHGateway, ACL&ACL Trait, DataCompressor and Oracles. In this section, let's dig deep in these smart contracts.


### AddressProvider

Let's start from AddressProvider. AddressProvider keeps addresses of core contracts which is used for smart contract address discovery. Continuing from the [simple example](../setting-up-environment/a-simple-example.md) we build previous, we start to use other functionality of AddressProvider. Assume we have a mainnet forking now (if you haven't fork the mainnet, please run `yarn fork` first), we create a script file `scripts/gearbox-discovery.ts`.
```jsx title="scripts/gearbox-discovery.ts"
import { run, ethers } from "hardhat";
import { AddressProvider__factory } from "@diesellabs/gearbox-sdk";

async function main() {
  // If you don't specify a //url//, Ethers connects to the default 
  // (i.e. ``http:/\/localhost:8545``)
  const provider = new ethers.providers.JsonRpcProvider(); 
  // The address of Account #0
  const ACCOUNT0 = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  const accounts = await provider.getSigner(ACCOUNT0);
  // The address of Gearbox's AddressProvider contract
  const AddressProviderContract = "0xcF64698AFF7E5f27A11dff868AF228653ba53be0";
  const ap = AddressProvider__factory.connect(AddressProviderContract, provider);

  // Start to query AddressProvider
  //
  // Get the latest version of Gearbox's contracts
  const version = await ap.version();
  console.log("version of Gearbox Contract is ", version);

  // Get ContractsRegister
  const ContractsRegister = await ap.getContractsRegister();
  console.log("ContractsRegister is ", ContractsRegister);

  // Get ACL
  const ACL = await ap.getACL();
  console.log("ACL is ", ACL);

  // Get PriceOracle
  const PriceOracle = await ap.getPriceOracle();
  console.log("PriceOracle is ", PriceOracle);

  // Get AccountFactory
  const AccountFactory = await ap.getAccountFactory();
  console.log("AccountFactory is ", AccountFactory);

  // Get DataCompressor
  const DataCompressor = await ap.getDataCompressor();
  console.log("DataCompressor is ", DataCompressor);

  // Get WETH Token
  const WETHGateway = await ap.getWETHGateway();
  console.log("WETHGateway is ", WETHGateway);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```
Run this code by `npx hardhat run scripts/gearbox-discovery.ts`, we can get
```
No need to generate any newer typings.
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


### ContractsRegister

If you complete the process above, we can get the `ContractsRegister` by querying `AddressProvider`. Now let's move into `ContractsRegister`. `ContractsRegister` maintains all the pools and credit managers, there are mainly two function that we can use. Now we import `ContractsRegister__factory` from `gearbox-sdk` and add some code between `ContractsRegister` and `ACL` in `scripts/gearbox-discovery.ts` to check it:
```jsx title="scripts/gearbox-discovery.ts"
  ...
  // Get ContractsRegister
  const ContractsRegister = await ap.getContractsRegister();
  console.log("ContractsRegister is ", ContractsRegister);
  //******************** ContractsRegister ********************
  const cr = await ContractsRegister__factory.connect(ContractsRegister, provider);
  const pool_list = await cr.getPools();
  console.log("Pool List: ", pool_list);
  const credit_manager_list = await cr.getCreditManagers();
  console.log("Credit Manager List: ", credit_manager_list);
  //******************** ContractsRegister ********************

  // Get ACL
  const ACL = await ap.getACL();
  console.log("ACL is ", ACL);
  ...
```
We can see the pool list and credit list if we run the code:
```
No need to generate any newer typings.
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


### ACL

ACL keeps permission for different addresses. For the moment, it keeps 2 different roles:

  * **PausableAdmin**: Can pause and unpause contracts
  * **Configurator**: Can configure contracts parameters

This part is mainly related to security and we can see from this [article](./anomaly-detection) how it will be used. 


### WETHGateway

ETH <=> WETH wrapper for Gearbox protocol. It implements IWETHGateway interface.


### AccountFactory

Reusable Credit Accounts is an innovative technology that makes Gearbox gas-efficient by keeping user balances with minimal overhead. Users "rent" deployed credit account smart contracts from protocol to save deployment costs.

![](../../static/img/tutorial/Gearbox\_white\_high.021.png)

Each time, when a user opens a credit account in Gearbox protocol, `CreditManager` takes a pre-deployed credit account contract from the `AccountFactory` and when the user closes the credit account, `CreditManager` returns it.

If `AccountFactory` has no pre-deployed contracts, it clones it using [https://eips.ethereum.org/EIPS/eip-1167](https://eips.ethereum.org/EIPS/eip-1167)

#### Advantages

  * **Gas efficiency:** This solution is much more gas-efficient, cause it doesn't require creating a new contract each time and has minimal operational overhead.

  * **Hacker-proof:** Contract funds are allocated on isolated contracts which makes a possible attack more complex and less economically reasonable.  Furthermore, the gearbox protocol uses anomaly detection to pause contracts and keep funds safe if suspicious behavior is found. User can protect their funds by splitting them between a few virtual accounts, and it makes the attack less economic reasonable.

  * **Balance transparency on Etherscan:** Trader or farmer could check all their transactions on Etherscan if they know at which block they start and finish virtual account renting.

  * **Ethereum network ecology:** It generates significantly less data in comparison with deployment credit contract for each new customer, and consume significantly less gas than keeping all balances in one place. As result it makes less impact on Ethereum infrastructure.

#### Implementation

`AccountFactory` supplies credit account for `CreditManager` on demand and keeps them when they are not used.

The account factory uses a list to keep credit accounts and two pointers: head and tail.

![](../../static/img/tutorial/va\_list.jpeg)

When a user open a credit account, `CreditManager` will ask `AccountFactory` for a virtual account by calling function `takeCreditAccount` which takes one `CreditAccount` from the head pointer. When returns a `CreditAccount`, `AccountFactory` adds it to the tail.


### DataCompressor

`DataCompressor` collects data from different contracts and send it to dApp. We can get any kind of states of Gearbox by interacting with `DataCompressor`. Let's list some main function in `DataCompressor`:
  * `getCreditAccountList(address borrower)` for getting the list of `CreditAccountData`s of a specified borrower
  * `getCreditAccountData(address _creditManager, address borrower)` for getting `CreditAccountData` of a specified borrower under a specified `CreditManager`
  * `getCreditAccountDataExtended(address creditManager, address borrower)` for getting `CreditAccountDataExtended` of a specified borrower under a specified `CreditManager`, `CreditAccountDataExtended` is the extension types of `CreditAccountData`, you can check `Types.sol` for more details.
  * `getCreditManagersList(address borrower)` for getting list of `CreditManagerData` of a specified borrower
  * `getPoolsList()` for getting list of `PoolData`

Because most of the functions need a `borrower` address as parameter, so we would not show how to use it in this document, you can use a wallet to open an account and try to use it.


