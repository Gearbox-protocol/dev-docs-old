# Get Opened Accounts

In this chapter, let's get all the opened Accounts by querying the `OpenCreditAccount` event in the `CreditManager` contract. First of all we create a scripit called `get-opened-accounts.ts`. As usual, we get the `AddressProvider` and then get the `ContractRegister`. After that, we get the `CreditManager` list by querying `ContractRegister`. Now, we can querying the `OpenCreditAccount` event from each `CreditManager`. As shown in the code, we query the event from block `13858003` to latest since the first `OpenCreditAccount` event happened in block `13858003`.

```jsx title="scripits/get-opened-accounts.ts"
import { run, ethers } from "hardhat";
import { Contract, Provider  } from 'ethcall';
import { ERC20__factory, CreditManager__factory, AccountFactory__factory, AddressProvider__factory, ContractsRegister__factory, CreditAccount__factory } from "@diesellabs/gearbox-sdk";

const decimal = ethers.BigNumber.from("1000000000000000000");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider(); 
  // The address of Account #0
  const ACCOUNT0 = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266";
  const accounts = await provider.getSigner(ACCOUNT0);
  // The address of Gearbox's AddressProvider contract
  const AddressProviderContract = "0xcF64698AFF7E5f27A11dff868AF228653ba53be0";
  const ap = await AddressProvider__factory.connect(AddressProviderContract, provider);

  const ContractsRegister = await ap.getContractsRegister();
  console.log("ContractsRegister is ", ContractsRegister);
  //******************** ContractsRegister ********************
  const cr = await ContractsRegister__factory.connect(ContractsRegister, provider);
  const credit_manager_list = await cr.getCreditManagers();

  console.log("CreditAccount,CreditManager,UnderlyingToken,BorrowerOwnedAmount,BorrowedAmount");
  for (let i = 0; i < credit_manager_list.length; ++i) {
    // connect to ith CreditManager contract
    const cm = await CreditManager__factory.connect(credit_manager_list[i], provider);
    const token = await cm.underlyingToken();
    const erc20 = await ERC20__factory.connect(token, provider);
    const token_symbol = await erc20.symbol();
    // query OpenCreditAccount event in this CreditManager from block 13858003 to the latest block 
    const oca_events = await cm.queryFilter(cm.filters.OpenCreditAccount(), 13858003, "latest");
    oca_events.forEach(event => console.log(event.args.creditAccount, ",", event.address, ",", token_symbol, ",", event.args.amount, ",", event.args.borrowAmount));
  }
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

We can run this code by

```
npx hardhat run scripts/get-opened-accounts.ts
```
And you will get a table with columns `CreditAccount,CreditManager,UnderlyingToken,BorrowerOwnedAmount,BorrowedAmount`.
