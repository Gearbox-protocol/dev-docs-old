# Composable BTC short


```jsx title='scripts/composable-btc-short.ts'
import {AccountFactory__factory, AddressProvider__factory, ContractsRegister__factory, CreditAccount__factory, CreditFilter__factory, CreditManager__factory, DataCompressor__factory, ERC20__factory} from '@gearbox-protocol/sdk';
import { UniswapV3Adapter__factory, YearnAdapter__factory } from '@gearbox-protocol/sdk';
import { ethers } from 'hardhat';
import { manipulateBalance } from './manipulate-balance';

const sleep = (milliseconds: number) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};

const toBytes32 = (bn : any) => {
  return ethers.utils.hexlify(ethers.utils.zeroPad(bn.toHexString(), 32));
};

// In this example, we will do Composable BTC short

//
//
// So after we got wBTC, we'll do composable BTC short in 5 steps:
// 1. Open wBTC credit account
// 2. put there USDC as collateral
// 3. borrow x4 wBTC
// 4. sell wBTC for USDC
// 5. put USDC to Yearn

async function main() {
  const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');

  // The address of Account #0
  // const ACCOUNT0 = '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266';
  const ACCOUNT0 = '0x90f79bf6eb2c4f870365e785982e1f101e93b906';


  // Create a wallet signer by private key
  const wallet = new ethers.Wallet("0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6");
  let wallet_signer = wallet.connect(provider);


  // Assume we have got the address of wBTC Credit Manager contract
  const wBTC_CM_address = "0xC38478B0A4bAFE964C3526EEFF534d70E1E09017";
  const wBTC_CM = CreditManager__factory.connect(wBTC_CM_address, wallet_signer);

  const wBTC_address = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const wBTC = ERC20__factory.connect(wBTC_address, wallet_signer);

  const USDC_address = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
  const USDC = ERC20__factory.connect(USDC_address, wallet_signer);

  //***************************************************************************
  // For test locally, we need some wBTC and USDC in hardhat's test wallet. I think there are two ways to get tokens:
  //    1. Swap eth to tokens at Uniswap
  //    2. Use 'hardhat_setStorageAt' method to manipulate the banlance.
  await manipulateBalance(USDC_address, ACCOUNT0, 9, "1000", provider);
  await manipulateBalance(wBTC_address, ACCOUNT0, 0, "1000", provider);

  const wBTC_bal = await wBTC.balanceOf(ACCOUNT0);
  console.log("wBTC balance: ", wBTC_bal);

  const USDC_bal = await USDC.balanceOf(ACCOUNT0);
  console.log("USDC balanceOf: ", USDC_bal);
  //***************************************************************************


  const approve_contract = async (token_contract: any, contract: string) => {
    const amount = ethers.BigNumber.from('115792089237316195423570985008687907853269984665640564039457584007913129639935');
    await token_contract.approve(contract, amount, {gasLimit: 2500000 });
  }

  await approve_contract(wBTC, wBTC_CM_address);
  console.log("openCreditAccount txn; ", await wBTC_CM.openCreditAccount(10000000, ACCOUNT0, 2, 0, { gasLimit: 2500000 }));

  const opened_credit_account = await wBTC_CM.getCreditAccountOrRevert(ACCOUNT0);
  console.log("My wBTC credit account", opened_credit_account);

  await approve_contract(USDC, wBTC_CM_address);
  console.log("Add 1000 USDC as collateralL: ", await wBTC_CM.addCollateral(ACCOUNT0, USDC_address, 1000, { gasLimit: 2500000 }));

  // Borrow the equivalent of $4000 wBtc
  console.log("Borrow more 0.1 wBTC: ", await wBTC_CM.increaseBorrowedAmount(10000000));

  const wBTC_CM_UniswapV3_adapter_address = "0x1D2d299C8cB6260F64dAF7aD7f5a6ABc58c88022";
  const wBTC_CM_UniswapV3_adapter = UniswapV3Adapter__factory.connect(wBTC_CM_UniswapV3_adapter_address, wallet_signer);

  const exact_input_single_order = {
    "tokenIn": wBTC_address,
    "tokenOut": USDC_address,
    "fee": 3000,
    "recipient": ACCOUNT0,
    "amountIn": 20000000,
    "amountOutMinimum": 0,
    "deadline": Math.floor(Date.now() / 1000) + 1200,
    "sqrtPriceLimitX96": 0
  };

  console.log("swap 0.2 wBTC to USDC: ", await wBTC_CM_UniswapV3_adapter.exactInputSingle(exact_input_single_order, { gasLimit: 2500000 }));

  const wBTC_CM_Yearn_adapter_address = "0x759cF6ab3F9c6Edc504572d735bD383eF4e3Ce59";
  const wBTC_CM_Yearn_adapter = YearnAdapter__factory.connect(wBTC_CM_Yearn_adapter_address, wallet_signer);
  console.log("deposit all USDC to yearn: ", await wBTC_CM_Yearn_adapter['deposit()']( { gasLimit: 2500000 } ));
}

main().then(() => process.exit(0)).catch((error) => {
  console.error(error);
  process.exit(1);
});
```
