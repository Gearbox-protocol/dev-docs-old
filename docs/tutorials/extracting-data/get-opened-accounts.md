# Get Opened Accounts

In this section, we'll get all the opened CreditAccounts by querying the `CreditManager`s. Let's directly go through the code below. 
  1. First of all, we get the `AddressProvider` and then get the `ContractRegister` and get the `CreditManager` list by querying `ContractRegister`. 
  2. Now, we can querying the `OpenCreditAccount` event from each `CreditManager`. As shown in the code, we query the event from block `13858003` to latest since the first `OpenCreditAccount` event happened in block `13858003`. 
  3. After get all the `OpenCreditAccountEvent`s, we still need to filter out those have been closed or liquidated. Same as querying `OpenCreditAccountEvent`, we get all the `CloseCreditAccountEvent`s and `LiquidateCreditAccountEvent`s.

  **NOTE:** For filtering out, we sort all the event by `blockNum` and `transactionIndex` because it is possible that a borrower has opened an `CreditAccount` with a `CreditManager` twice and the addresses of both `CreditAccount`s are same.

```jsx title="scripts/get-opened-accounts.ts"
import {AccountFactory__factory, AddressProvider__factory, ContractsRegister__factory, CreditAccount__factory, CreditManager__factory, ERC20__factory} from '@diesellabs/gearbox-sdk';
import {Contract, Provider} from 'ethcall';
import {ethers, run} from 'hardhat';

const decimal = ethers.BigNumber.from('1000000000000000000');

async function main() {
  const provider = new ethers.providers.JsonRpcProvider();
  // The address of Account #0
  const ACCOUNT0 = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const accounts = await provider.getSigner(ACCOUNT0);
  // The address of Gearbox's AddressProvider contract
  const AddressProviderContract = '0xcF64698AFF7E5f27A11dff868AF228653ba53be0';
  const ap =
      await AddressProvider__factory.connect(AddressProviderContract, provider);

  // Start to query AddressProvider
  //
  // Get the latest version of Gearbox's contracts
  const version = await ap.version();
  console.log('version of Gearbox Contract is ', version);

  const network = await provider.getNetwork();
  console.log(network.name, ' ', network.chainId);

  // Get AccountFactory
  const AccountFactory = await ap.getAccountFactory();
  console.log('AccountFactory is ', AccountFactory);
  //******************** AccountFactory ********************
  // const mcallProvider = new Provider();
  // await mcallProvider.init(provider);

  const ContractsRegister = await ap.getContractsRegister();
  console.log('ContractsRegister is ', ContractsRegister);
  //******************** ContractsRegister ********************
  const cr =
      await ContractsRegister__factory.connect(ContractsRegister, provider);
  const credit_manager_list = await cr.getCreditManagers();

  console.log(
      'Borrower,CreditAccount,CreditManager,UnderlyingToken,BorrowerOwnedAmount,BorrowedAmount');
  for (let i = 0; i < credit_manager_list.length; ++i) {
    // connect to ith CreditManager contract
    const cm =
        await CreditManager__factory.connect(credit_manager_list[i], provider);
    const token = await cm.underlyingToken();
    const erc20 = await ERC20__factory.connect(token, provider);
    const token_symbol = await erc20.symbol();


    // We get all the CreditAccounts through all the OpenAccountEvent and filter
    // out those have been closed or liquidated. query OpenCreditAccount event
    // in this CreditManager from block 13858003 to the latest block
    let oca_events = await cm.queryFilter(
        cm.filters.OpenCreditAccount(), 13858003, 'latest');
    // query CloseCreditAccount event in this CreditManager from block 13858003
    // to the latest block
    let cca_events = await cm.queryFilter(
        cm.filters.CloseCreditAccount(), 13858003, 'latest');
    // query LiquidateCreditAccount event in this CreditManager from block
    // 13858003 to the latest block
    let lca_events = await cm.queryFilter(
        cm.filters.LiquidateCreditAccount(), 13858003, 'latest');

    // sorting for avoid some errors
    oca_events = oca_events.sort((a, b) => {
      if (a.blockNumber == b.blockNumber) {
        return a.transactionIndex < b.transactionIndex ? -1 : 1;
      }
      return a.blockNumber < b.blockNumber ? -1 : 1;
    });

    cca_events = cca_events.sort((a, b) => {
      if (a.blockNumber == b.blockNumber) {
        return a.transactionIndex < b.transactionIndex ? -1 : 1;
      }
      return a.blockNumber < b.blockNumber ? -1 : 1;
    });

    lca_events = lca_events.sort((a, b) => {
      if (a.blockNumber == b.blockNumber) {
        return a.transactionIndex < b.transactionIndex ? -1 : 1;
      }
      return a.blockNumber < b.blockNumber ? -1 : 1;
    });

    oca_events.forEach(event => {
      let have_been_closed_or_liqudated: boolean = false;
      // Check if it has been closed
      cca_events.every(close_event => {
        if (event.blockNumber < close_event.blockNumber ||
            (event.blockNumber === close_event.blockNumber &&
             event.transactionIndex < close_event.transactionIndex)) {
          if (event.args.onBehalfOf === close_event.args.owner) {
            have_been_closed_or_liqudated = true;
            return false;
          }
        }
        return true;
      });
      // Check if it has been liquidated
      lca_events.every(liquidate_event => {
        if (event.blockNumber < liquidate_event.blockNumber ||
            (event.blockNumber === liquidate_event.blockNumber &&
             event.transactionIndex < liquidate_event.transactionIndex)) {
          if (event.args.onBehalfOf === liquidate_event.args.owner) {
            have_been_closed_or_liqudated = true;
            return false;
          }
        }
        return true;
      });
      if (!have_been_closed_or_liqudated) {
        console.log(`${event.args.onBehalfOf}, ${event.args.creditAccount}, ${event.address}, ${token_symbol}, ${event.args.amount}, ${event.args.borrowAmount}`)
      }
    });
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
```

We can run this code by

```
npx hardhat run scripts/get-opened-accounts.ts
```
And you will get a table with columns `Borrower,CreditAccount,CreditManager,UnderlyingToken,BorrowerOwnedAmount,BorrowedAmount`.
