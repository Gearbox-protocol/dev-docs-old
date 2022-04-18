# Monitor Your Health Factor

In this section, we're gonna make a simple monitor to check your `HealthFactor`.

  1. With our powerful `DataCompressor`, we can get the `CreditAccount` list of our wallet. There are many data in the return, you could try to output it.
  ```jsx
  const dataCompressorAddress = await addressProvider.getDataCompressor();
  const dataCompressor = DataCompressor__factory.connect(dataCompressorAddress, provider);
  const myCreditAccountList = await dataCompressor.getCreditAccountList(MY_WALLET);
  ```
  2. Since we want to build a monitor, the easy way is writting a while loop. And check the `blockNumber` each time, when a new block is finalized, we start doing our work.
  ```jsx
  let lastBlockNum: number = 0;
  while (true) {
    let currentBlockNum = await provider.getBlockNumber();
    if (currentBlockNum > lastBlockNum) {
      lastBlockNum = currentBlockNum;
      ... 
    }
    await sleep(5000);
  }
  ```
  3. For each `CreditAccount` we opened, get the `CreditFilter` from `CreditManager`(**Note** here that CreditFilter and CreditManager are one-to-one correspondence.). Then we can use `calcCreditAccountHealthFactor` function from `CreditFilter` to get the `HealthFactor` directly. (You can add some alert here.)
  ```jsx
    if (currentBlockNum > lastBlockNum) {
      lastBlockNum = currentBlockNum;
      for (let i = 0; i < myCreditAccountList.length; ++i) {
        const creditManager = CreditManager__factory.connect(myCreditAccountList[i].creditManager, provider);
        const creditFilterAddress = await creditManager.creditFilter();
        const creditFilter = CreditFilter__factory.connect(creditFilterAddress, provider);
        const healhFactor = await creditFilter.calcCreditAccountHealthFactor(myCreditAccountList[i].addr);
        console.log(`BlockNumber ${currentBlockNum}, CreditAccount ${myCreditAccountList[i].addr}'s healh factor is ${healhFactor}`);
      }
    }
  ```

  **NOTE:** In step 1, if you output the return data from `DataCompressor`, you will see the `HealthFactor` is also there. Why don't we query `getCreditAccountList` each time to get the `HealthFactor` of all our `CreditAccount`? The answer is that this query is inefficient, it will query many other data at the same. Further, we could actually save the `CreditFilter` list first, so that we don't need to query the `Creditfilter` every time.

