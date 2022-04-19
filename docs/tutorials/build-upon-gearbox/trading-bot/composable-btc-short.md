# Composable BTC short

In this example, we will use some functions in [code](https://github.com/curiosityyy/play-with-gearbox/blob/main/scripts/composable-wBTC-short.ts) to illustrate how to use Gearbox to do composable wBTC short. The workflow is mainly in 5 steps:

 1. Open wBTC credit account (deposit `wBTC_deposit_amount` wBTC and open the wBTC credit account.)
 2. Add `USDC_deposit_amount` USDC as collateral.
 3. Borrow `wBTC_borrow_amount` wBTC.
 4. Sell all wBTC (`wBTC_deposit_amount` + `wBTC_borrow_amount`) to USDC.
 5. Deposit all USDC to Yearn.

So `composableWBTCShort` is the function to prepare token address, connect to token contract and call each step's function.

```jsx
async function composableWBTCShort(wBTCDepositAmount: number, usdcDepositAmount: number, wBTCBorrowAmount: number, walletSigner: any) {

  // Assume we have got the address of wBTC Credit Manager contract
  let wbtc = ERC20__factory.connect(WBTC_ADDRESS, walletSigner);
  let usdc = ERC20__factory.connect(USDC_ADDRESS, walletSigner);

  console.log("wBTC balance: ", await wbtc.balanceOf(walletSigner.address));
  console.log("USDC balanceOf: ", await usdc.balanceOf(walletSigner.address));

  // gasPrice and gasLimit for hardhat testnet
  const gasPrice: number = 30;
  const gasLimit: number = 2500000;

  //
  // So after we got wBTC, we'll do composable BTC short in 5 steps:
  // 1. Open wBTC credit account
  await openCreditAccount(WBTC_CREDIT_MANAGER_ADDRESS, WBTC_ADDRESS, wBTCDepositAmount, 1, walletSigner, gasPrice, gasLimit);
  // 2. put there USDC as collateral
  await addCollateral(USDC_ADDRESS, usdcDepositAmount, WBTC_CREDIT_MANAGER_ADDRESS, walletSigner, gasPrice, gasLimit);
  // 3. borrow x4 wBTC
  await increaseBorrowedAmount(wBTCBorrowAmount, WBTC_ADDRESS, WBTC_CREDIT_MANAGER_ADDRESS, walletSigner, gasPrice, gasLimit);
  // 4. sell wBTC for USDC
  await exactInputSingleUniswapV3(WBTC_ADDRESS, USDC_ADDRESS, wBTCDepositAmount + wBTCBorrowAmount, walletSigner, gasPrice, gasLimit);
  // 5. put USDC to Yearn
  await depositToYearn(walletSigner, gasPrice, gasLimit);
}
```

## Open wBTC credit account

The first step is to open a wBTC credit account. As we can see in `composableWBTCShort`, we call the function `openCreditAccount` to open a credit account.

```jsx
  // 1. Open wBTC credit account
  await openCreditAccount(WBTC_CREDIT_MANAGER_ADDRESS, WBTC_ADDRESS, wBTCDepositAmount, 1, walletSigner, gasPrice, gasLimit);
```

`openCreditAccount` is for opening a credit account by interacting with credit manager contract. `wbtc_credit_manager_address` is passed to this function for opening a credit account under `wbtc_credit_manage`. Before opening credit account, we should approve the credit manager to spend tokens from our account. (We use a pre-defined function here, you can check the details in the github repo.) We also pass `wbtc_deposit_amount` and `leverage_factor` to tell the contract how much wBTC we want to deposit and borrow at the beginning. **Note that `leverage_factor/100` is the real leverage factor.**

```jsx
async function openCreditAccount(creditManagerAddress: string, underlyingTokenAddress: string, depositAmount: number, leverageFactor: number, walletSigner: Wallet, gasPrice: number, gasLimit: number) {
  // Assume we have got the address of wBTC Credit Manager contract
  const creditManager = CreditManager__factory.connect(creditManagerAddress, walletSigner);
  const underlyingToken = ERC20__factory.connect(underlyingTokenAddress, walletSigner);
  const underlyingTokenDecimals = await underlyingToken.decimals();

  await approveContract(underlyingToken, creditManagerAddress);
  console.log("openCreditAccount txn; ", await creditManager.openCreditAccount(depositAmount * 10**underlyingTokenDecimals, walletSigner.address, leverageFactor, 0, { gasPrice: gasPrice, gasLimit: gasLimit }));
}
```

## Add Some USDC as Collateral

We have no much wBTC deposited as collateral since we want to do a wBTC short, so we may add some other token as collateral. In this example, we choose USDC, we use this line of code in `composableWBTCShort` to add some USDC as collateral.

```jsx
  // 2. put there USDC as collateral
  await addCollateral(USDC_ADDRESS, usdcDepositAmount, WBTC_CREDIT_MANAGER_ADDRESS, walletSigner, gasPrice, gasLimit);
```

`addCollateral` function is simple which includes an `approve_contract` function call and an `addCollateral` call to tell the credit manager that we want to deposit `deposit_amount` token (e.g. USDC) to `wallet_signer.address` as collateral.

```jsx
async function addCollateral(tokenAddress: string, depositAmount: number, creditManagerAddress: string, walletSigner: Wallet, gasPrice: number, gasLimit: number) {
  const token = ERC20__factory.connect(tokenAddress, walletSigner);
  const tokenDecimals = await token.decimals();
  await approveContract(token, creditManagerAddress);
  const creditManager = CreditManager__factory.connect(creditManagerAddress, walletSigner);
  console.log("Add collateralL: ", await creditManager.addCollateral(walletSigner.address, tokenAddress, depositAmount * 10 ** tokenDecimals, { gasPrice: gasPrice, gasLimit: gasLimit }));
}
```

## Borrow 4x wBTC

Now, we have some wBTC and USDC as collateral, don't forget that we wang to do a wBTC short and we haven't borrow wBTC (Actually we borrow a little at the beginning, but it's a little.). We need more wBTC in this step, we call `increaseBorrowedAmount` to borrow more `wbtc_borrow_amount` wBTC.

```jsx
  // 3. borrow x4 wBTC
  await increaseBorrowedAmount(wBTCBorrowAmount, WBTC_ADDRESS, WBTC_CREDIT_MANAGER_ADDRESS, walletSigner, gasPrice, gasLimit);
```

```jsx
async function increaseBorrowedAmount(borrowAmount: number, underlyingTokenAddress: string, creditManagerAddress: string, walletSigner: Wallet, gasPrice: number, gasLimit: number) {
  const creditManager = CreditManager__factory.connect(creditManagerAddress, walletSigner);
  const underlyingToken = ERC20__factory.connect(underlyingTokenAddress, walletSigner);
  const underlyingTokenDecimals = await underlyingToken.decimals();
  console.log(await creditManager.increaseBorrowedAmount(Math.floor(borrowAmount * 10**underlyingTokenDecimals), { gasPrice: gasPrice, gasLimit: gasLimit }));
}
```

## Sell wBTC for USDC

Okay, it's time to swap wBTC to USDC. At this time, we make the transaction in uniswapV3 dex. Since we deposited `wbtc_deposit_amount` wBTC and borrowed `wbtc_borrow_amount` wBTC, we can swap `wbtc_deposit_amount + wbtc_borrow_amount` wBTC to USDC.

```jsx
  // 4. sell wBTC for USDC
  await exactInputSingleUniswapV3(WBTC_ADDRESS, USDC_ADDRESS, wBTCDepositAmount + wBTCBorrowAmount, walletSigner, gasPrice, gasLimit);
```

Fuction `exactInputSingleUniswapV3` is a little longer than other functions, because there is a swap order. We know how much amount of `tokenIn` exactly, so we use the `exactInputSingle` function in uniswapV3 adapter. The `exact_input_single_order` clealy shows the details of the swap transaction.

```jsx
async function exactInputSingleUniswapV3(tokenInAddress: string, tokenOutAddress: string, tokenInAmount: number, walletSigner: Wallet, gasPrice: number, gasLimit: number) {
  const wBTCCreditManagerUniswapv3Adapter = UniswapV3Adapter__factory.connect(WBTC_CM_UNISWAPV3_ADAPTER_ADDRESS, walletSigner);
  const tokenIn = ERC20__factory.connect(tokenInAddress, walletSigner);
  const tokenInDecimals = await tokenIn.decimals();

  const exactInputSingleOrder = {
    "tokenIn": tokenInAddress,
    "tokenOut": tokenOutAddress,
    "fee": 3000,
    "recipient": walletSigner.address,
    "amountIn": Math.floor(tokenInAmount * 10**tokenInDecimals),
    "amountOutMinimum": 0,
    "deadline": Math.floor(Date.now() / 1000) + 1200,
    "sqrtPriceLimitX96": 0
  };

  console.log(await wBTCCreditManagerUniswapv3Adapter.exactInputSingle(exactInputSingleOrder, { gasPrice: gasPrice, gasLimit: gasLimit }));
}
```

## Deposit all USDC to Yearn

Finally, we got lots of USDC in our credit account. I think nobody would want to hold USDC in an account and not do any operation on it, so we should find a place to stake USDC and earn rewards. Yearn is a good choice, we also have a yearn adapter. So let's do it

```jsx
  // 5. put USDC to Yearn
  await depositToYearn(walletSigner, gasPrice, gasLimit);
```

```jsx
async function depositToYearn(walletSigner: Wallet, gasPrice: number, gasLimit: number) {
  const wBTCCreditManagerYearnAdapter = YearnAdapter__factory.connect(WBTC_CM_YEARN_ADAPTER_ADDRESS, walletSigner);
  console.log("deposit all USDC to yearn: ", await wBTCCreditManagerYearnAdapter['deposit()']( { gasPrice: gasPrice, gasLimit: gasLimit } ));
}
```

Above is the functions for composable wBTC short. If you want to test it in the kovan testnet or use it directly in the mainnet, you should make sure that you modify it correctly and pass the right parameters. For example, if you have opened a credit account for you wallet, you have no need to do it again (Actually, if you open it again, the transaction will revert). The code below shows how to use it in the hardhat local network (forking mainnet), because we don't have wBTC or USDC in our test wallet in local network, I use the function in [manipulate-balance.tx](https://github.com/curiosityyy/play-with-gearbox/blob/main/scripts/manipulate-balance.ts) to modify the storage of hardhat local network to manipulate our test wallet's balance (You can check this [post](https://kndrck.co/posts/local_erc20_bal_mani_w_hh/) for details). After we got the tokens, we call `composableWBTCShort` to finish our composable wBTC short strategy.

```jsx title='scripts/composable-btc-short.ts'
async function main() {
  // hardhat local net rpc
  const provider = new ethers.providers.JsonRpcProvider();
  // Create a wallet signer by private key
  const wallet = new ethers.Wallet(ACCOUNT_1_PRIVATE_KEY);
  // const wallet = new ethers.Wallet(private_key);
  let walletSigner = wallet.connect(provider);

  //***************************************************************************
  // For test locally, we need some wBTC and USDC in hardhat's test wallet. I think there are two ways to get tokens:
  //    1. Swap eth to tokens at Uniswap
  //    2. Use 'hardhat_setStorageAt' method to manipulate the banlance.
  await manipulateBalance(USDC_ADDRESS, walletSigner.address, USDC_STORAGE_SLOT, "4000", provider);
  await manipulateBalance(WBTC_ADDRESS, walletSigner.address, WBTC_STORAGE_SLOT, "4000", provider);

  await composableWBTCShort(0.1, 4000, 0.45, walletSigner);
}
```
