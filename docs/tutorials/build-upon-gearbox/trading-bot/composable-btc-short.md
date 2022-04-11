# Composable BTC short

In this example, we will use some functions in [code](https://github.com/curiosityyy/play-with-gearbox/blob/main/scripts/composable-wBTC-short.ts) to illustrate how to use Gearbox to do composable wBTC short. The workflow is mainly in 5 steps:
 1. Open wBTC credit account (deposit `wBTC_deposit_amount` wBTC and open the wBTC credit account.)
 2. Add `USDC_deposit_amount` USDC as collateral.
 3. Borrow `wBTC_borrow_amount` wBTC.
 4. Sell all wBTC (`wBTC_deposit_amount` + `wBTC_borrow_amount`) to USDC.
 5. Deposit all USDC to Yearn.

So `composableWBTCShort` is the function to prepare token address, connect to token contract and call each step's function.
```jsx
async function composableWBTCShort(wbtc_deposit_amount: number, usdc_deposit_amount: number, wbtc_borrow_amount: number, wallet_signer: any, account: string) {

  // Assume we have got the address of wBTC Credit Manager contract
  const wbtc_credit_manager_address = "0xC38478B0A4bAFE964C3526EEFF534d70E1E09017";
  const wbtc_credit_manager = CreditManager__factory.connect(wbtc_credit_manager_address, wallet_signer);

  const wbtc_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const wbtc = ERC20__factory.connect(wbtc_address, wallet_signer);

  const usdc_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const usdc = ERC20__factory.connect(usdc_address, wallet_signer);

  console.log("wBTC balance: ", await wbtc.balanceOf(wallet_signer.address));
  console.log("USDC balanceOf: ", await usdc.balanceOf(account));

  // So after we got wBTC, we'll do composable BTC short in 5 steps:
  // 1. Open wBTC credit account
  await openCreditAccount(wbtc_credit_manager_address, wbtc_address, wbtc_deposit_amount, 1, wallet_signer);
  // 2. put there USDC as collateral
  await addCollateral(usdc_address, usdc_deposit_amount, wbtc_credit_manager_address, wallet_signer);
  // 3. borrow x4 wBTC
  await increaseBorrowedAmount(wbtc_borrow_amount, wbtc_address, wbtc_credit_manager_address, wallet_signer);
  // 4. sell wBTC for USDC
  await exactInputSingleUniswapV3(wbtc_address, usdc_address, wbtc_deposit_amount + wbtc_borrow_amount, wallet_signer);
  // 5. put USDC to Yearn
  await depositToYearn(wallet_signer);
}
```

### Open wBTC credit account
The first step is to open a wBTC credit account. As we can see in `composableWBTCShort`, we call the function `openCreditAccount` to open a credit account. 
```jsx
// 1. Open wBTC credit account
await openCreditAccount(wbtc_credit_manager_address, wbtc_address, wbtc_deposit_amount, 1, wallet_signer);
```
`openCreditAccount` is for opening a credit account by interacting with credit manager contract. `wbtc_credit_manager_address` is passed to this function for opening a credit account under `wbtc_credit_manage`. Before opening credit account, we should approve the credit manager to spend tokens from our account. (We use a pre-defined function here, you can check the details in the github repo.) We also pass `wbtc_deposit_amount` and `leverage_factor` to tell the contract how much wBTC we want to deposit and borrow at the beginning. **Note that `leverage_factor/100` is the real leverage factor.**
```jsx
async function openCreditAccount(credit_manager_address: string, underlying_token_address: string, deposit_amount: number, leverage_factor: number, wallet_signer: any) {
  // Assume we have got the address of wBTC Credit Manager contract
  const credit_manager = CreditManager__factory.connect(credit_manager_address, wallet_signer);
  const underlying_token = ERC20__factory.connect(underlying_token_address, wallet_signer);
  const underlying_token_decimals = await underlying_token.decimals();

  await approve_contract(underlying_token, credit_manager_address);
  console.log("openCreditAccount txn; ", await credit_manager.openCreditAccount(deposit_amount * 10**underlying_token_decimals, wallet_signer.address, leverage_factor, 0, { gasLimit: 2500000 }));                                                                                   
}
```

### Add Some USDC as Collateral
We have no much wBTC deposited as collateral since we want to do a wBTC short, so we may add some other token as collateral. In this example, we choose USDC, we use this line of code in `composableWBTCShort` to add some USDC as collateral. 
```jsx
// 2. put there USDC as collateral
await addCollateral(usdc_address, usdc_deposit_amount, wbtc_credit_manager_address, wallet_signer);
```
`addCollateral` function is simple which includes an `approve_contract` function call and an `addCollateral` call to tell the credit manager that we want to deposit `deposit_amount` token (e.g. USDC) to `wallet_signer.address` as collateral.
```jsx
async function addCollateral(token_address: string, deposit_amount: number, credit_manager_address: string, wallet_signer: any) {
  const token = ERC20__factory.connect(token_address, wallet_signer);
  const token_decimals = await token.decimals();
  await approve_contract(token, credit_manager_address);
  const credit_manager = CreditManager__factory.connect(credit_manager_address, wallet_signer);
  console.log("Add collateralL: ", await credit_manager.addCollateral(wallet_signer.address, token_address, deposit_amount * 10 ** token_decimals, { gasLimit: 2500000 }));
}
```

### Borrow 4x wBTC
Now, we have some wBTC and USDC as collateral, don't forget that we wang to do a wBTC short and we haven't borrow wBTC (Actually we borrow a little at the beginning, but it's a little.). We need more wBTC in this step, we call `increaseBorrowedAmount` to borrow more `wbtc_borrow_amount` wBTC.
```jsx
// 3. borrow x4 wBTC
await increaseBorrowedAmount(wbtc_borrow_amount, wbtc_address, wbtc_credit_manager_address, wallet_signer);
```
```jsx
async function increaseBorrowedAmount(borrow_amount: number, underlying_token_address: string, credit_manager_address: string, wallet_signer: any) {
  const credit_manager = CreditManager__factory.connect(credit_manager_address, wallet_signer);
  const underlying_token = ERC20__factory.connect(underlying_token_address, wallet_signer);
  const underlying_token_decimals = await underlying_token.decimals();
  console.log(await credit_manager.increaseBorrowedAmount(Math.floor(borrow_amount * 10**underlying_token_decimals), { gasLimit: 2500000 }));
}
```

### Sell wBTC for USDC
Okay, it's time to swap wBTC to USDC. At this time, we make the transaction in uniswapV3 dex. Since we deposited `wbtc_deposit_amount` wBTC and borrowed `wbtc_borrow_amount` wBTC, we can swap `wbtc_deposit_amount + wbtc_borrow_amount` wBTC to USDC.
```jsx
// 4. sell wBTC for USDC
await exactInputSingleUniswapV3(wbtc_address, usdc_address, wbtc_deposit_amount + wbtc_borrow_amount, wallet_signer);
```
Fuction `exactInputSingleUniswapV3` is a little longer than other functions, because there is a swap order. We know how much amount of `tokenIn` exactly, so we use the `exactInputSingle` function in uniswapV3 adapter. The `exact_input_single_order` clealy shows the details of the swap transaction. 
```jsx
async function exactInputSingleUniswapV3(token_in_address: string, token_out_address: string, token_in_amount: number, wallet_signer: any) {
  const wbtc_credit_manager_uniswapv3_adapter_address = "0x1D2d299C8cB6260F64dAF7aD7f5a6ABc58c88022";
  const wbtc_credit_manager_uniswapv3_adapter = UniswapV3Adapter__factory.connect(wbtc_credit_manager_uniswapv3_adapter_address, wallet_signer);
  const token_in = ERC20__factory.connect(token_in_address, wallet_signer);
  const token_in_decimals = await token_in.decimals();

  const exact_input_single_order = {
    "tokenIn": token_in_address,
    "tokenOut": token_out_address,
    "fee": 3000,
    "recipient": wallet_signer.address,
    "amountIn": Math.floor(token_in_amount * 10**token_in_decimals),
    "amountOutMinimum": 0,
    "deadline": Math.floor(Date.now() / 1000) + 1200,
    "sqrtPriceLimitX96": 0
  };

  console.log(await wbtc_credit_manager_uniswapv3_adapter.exactInputSingle(exact_input_single_order, { gasLimit: 2500000 }));
}
```

### Deposit all USDC to Yearn
Finally, we got lots of USDC in our credit account. I think nobody would want to hold USDC in an account and not do any operation on it, so we should find a place to stake USDC and earn rewards. Yearn is a good choice, we also have a yearn adapter. So let's do it
```jsx
// 5. put USDC to Yearn
await depositToYearn(wallet_signer);
```
```jsx
async function depositToYearn(wallet_signer: any) {
  const wBTC_CM_Yearn_adapter_address = "0x759cF6ab3F9c6Edc504572d735bD383eF4e3Ce59";
  const wBTC_CM_Yearn_adapter = YearnAdapter__factory.connect(wBTC_CM_Yearn_adapter_address, wallet_signer);
  console.log("deposit all USDC to yearn: ", await wBTC_CM_Yearn_adapter['deposit()']( { gasLimit: 2500000 } ));
}
```

Above is the functions for composable wBTC short. If you want to test it in the kovan testnet or use it directly in the mainnet, you should make sure that you modify it correctly and pass the right parameters. For example, if you have opened a credit account for you wallet, you have no need to do it again (Actually, if you open it again, the transaction will revert). The code below shows how to use it in the hardhat local network (forking mainnet), because we don't have wBTC or USDC in our test wallet in local network, I use the function in [manipulate-balance.tx](https://github.com/curiosityyy/play-with-gearbox/blob/main/scripts/manipulate-balance.ts) to modify the storage of hardhat local network to manipulate our test wallet's balance (You can check this [post](https://kndrck.co/posts/local_erc20_bal_mani_w_hh/) for details). After we got the tokens, we call `composableWBTCShort` to finish our composable wBTC short strategy.

```jsx title='scripts/composable-btc-short.ts'
async function main() {
  // hardhat test account
  const account = '0x90f79bf6eb2c4f870365e785982e1f101e93b906';
  // hardhat local net rpc
  const provider = new ethers.providers.JsonRpcProvider();

  // Create a wallet signer by private key
  const wallet = new ethers.Wallet("0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6");
  // const wallet = new ethers.Wallet(private_key);
  let wallet_signer = wallet.connect(provider);

  const wBTC_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";

  const USDC_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  //***************************************************************************
  // For test locally, we need some wBTC and USDC in hardhat's test wallet. I think there are two ways to get tokens:
  //    1. Swap eth to tokens at Uniswap
  //    2. Use 'hardhat_setStorageAt' method to manipulate the banlance.
  await manipulateBalance(USDC_address, account, 9, "4000", provider);
  await manipulateBalance(wBTC_address, account, 0, "4000", provider);

  await composableWBTCShort(0.1, 4000, 0.45, wallet_signer, account);
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
```
