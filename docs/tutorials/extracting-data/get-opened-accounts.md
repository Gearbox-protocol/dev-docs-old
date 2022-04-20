# Get Opened Accounts

In this section, we'll get all the opened CreditAccounts by querying the `CreditManager`s. Let's directly go through the code below.  

  1. First of all, we get the `AddressProvider` and then get the `ContractRegister` and get the `CreditManager` list by querying `ContractRegister`.
  2. Now, we can querying the `OpenCreditAccount` event from each `CreditManager`. As shown in the code, we query the event from block `13858003` to latest since the first `OpenCreditAccount` event happened in block `13858003`.  
  3. After get all the `OpenCreditAccountEvent`s, we still need to filter out those have been closed or liquidated. Same as querying `OpenCreditAccountEvent`, we get all the `CloseCreditAccountEvent`s and `LiquidateCreditAccountEvent`s.

  **NOTE:** For filtering out, we sort all the event by `blockNum` and `transactionIndex` because it is possible that a borrower has opened an `CreditAccount` with a `CreditManager` twice and the addresses of both `CreditAccount`s are same.

We use the primary codes in [get-opened-accounts](https://github.com/Gearbox-protocol/play-with-gearbox/blob/main/scripts/get-opened-accounts.ts) to illustrate the details of step 2 and 3.

If you check the code, you could see we have a for loop to iterate the `CreditManagerList`, for each `CreditManager`, we use the code below to get three types of events including `openCreditAccountEvents`, `closeCreditAccountEvents` and `liquidateCreditAccountEvents`. And sort them by `blockNum` and `transactionIndex`.
```jsx 
    // We get all the CreditAccounts through all the OpenAccountEvent and filter
    // out those have been closed or liquidated. query OpenCreditAccount event
    // in this CreditManager from block 13858003 to the latest block
    let openCreditAccountEvents = await creditManager.queryFilter(
        creditManager.filters.OpenCreditAccount(), 13858003, 'latest');
    // query CloseCreditAccount event in this CreditManager from block 13858003
    // to the latest block
    let closeCreditAccountEvents = await creditManager.queryFilter(
        creditManager.filters.CloseCreditAccount(), 13858003, 'latest');
    // query LiquidateCreditAccount event in this CreditManager from block
    // 13858003 to the latest block
    let liquidateCreditAccountEvents = await creditManager.queryFilter(
        creditManager.filters.LiquidateCreditAccount(), 13858003, 'latest');

    // sorting for avoid some errors
    openCreditAccountEvents = openCreditAccountEvents.sort(compareBlockNumberAndTransactionIndex);
    closeCreditAccountEvents = closeCreditAccountEvents.sort(compareBlockNumberAndTransactionIndex);
    liquidateCreditAccountEvents = liquidateCreditAccountEvents.sort(compareBlockNumberAndTransactionIndex);
```

After got the sorted events, we need to filter out the accounts that have been closed or liquidated after opening.
```jsx
    openCreditAccountEvents.forEach(event => {
      let closedOrLiqudated: boolean = false;
      // Check if it has been closed
      closeCreditAccountEvents.every(closeEvent => {
        if (event.blockNumber < closeEvent.blockNumber ||
            (event.blockNumber == closeEvent.blockNumber &&
             event.transactionIndex < closeEvent.transactionIndex)) {
          if (event.args.onBehalfOf == closeEvent.args.owner) {
            closedOrLiqudated = true;
            return false;
          }
        }
        return true;
      });
      // Check if it has been liquidated
      liquidateCreditAccountEvents.every(liquidateEvent => {
        if (event.blockNumber < liquidateEvent.blockNumber ||
            (event.blockNumber == liquidateEvent.blockNumber &&
             event.transactionIndex < liquidateEvent.transactionIndex)) {
          if (event.args.onBehalfOf == liquidateEvent.args.owner) {
            closedOrLiqudated = true;
            return false;
          }
        }
        return true;
      });
      if (!closedOrLiqudated) {
        console.log(
            event.args.onBehalfOf, ',', event.args.creditAccount, ',',
            event.address, ',', tokenSymbol, ',', event.args.amount, ',',
            event.args.borrowAmount)
      }
    });
```

We can run this code by

```bash
npx hardhat run scripts/get-opened-accounts.ts
```

And you will get a table with columns `Borrower,CreditAccount,CreditManager,UnderlyingToken,BorrowerOwnedAmount,BorrowedAmount`.
