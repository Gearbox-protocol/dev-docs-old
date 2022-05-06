# Composable stETH farming strategy using Multicall

In this example, we will utilize multicalls to open a WETH Credit Account and create a Curve stETH/ETH LP position in Yearn. The transaction will be executed through `openCreditAccountMulticall()` and will consist of 4 steps:

 1. Add WETH collateral to the Credit Account;
 2. Deposit WETH into Lido through the Lido adapter;
 3. Deposit stETH received from the previous step into the Curve stETH/ETH pool, using a custom `add_all_liquidity_one_coin()` adapter function;
 4. Deposit steCRV LP token into Yearn.

## Constructing calldata using Gearbox SDK

In order to construct a multicall, we first need to create the appropriate calldata. Fortunately, standard typings provided with the Gearbox SDK allow us to do just that:
```jsx
import { YearnV2Adapter__factory  } from '@gearbox-protocol/sdk';

const yearnCalldata = YearnV2Adapter__factory.createInterface().encodeFunctionData("deposit()");

```

## Strategy walkthrough

### Add collateral
When using `openCreditAccountMulticall`, collateral has to be added manually using the `addCollateral` function in Credit Facade (as opposed to `openCreditAccount`, where the amount will be transferred from the caller). Note that the borrowed amount is passed to `openCreditAccountMulticall` and will be credited to the account when opening it, so `increaseDebt` doesn't have to be called within the multicall explicitly. Before adding collateral, WETH has to be approved to the Credit Manager.

```
let weth = ERC20__factory.connect(WETH, walletSigner);

weth.approve(CREDIT_MANAGER_WETH_ADDRESS, MAX_INT);

const addCollateralCall = {
	target: CREDIT_FACADE_WETH_ADDRESS,
	callData: ICreditFacade_factory.createInterface().encodeFunctionData('addCollateral', [walletSigner, WETH, collateralWETH]
};
```

### Deposit into Lido
To turn WETH into stETH, we need to use `submit()` in the Lido adapter. Note that the Lido adapter does not point directly to the original Lido contract, and instead points to [Lido WETH Gateway](https://github.com/Gearbox-protocol/contracts-v2/blob/main/contracts/adapters/lido/LidoV1_WETHGateway.sol). This is because Lido requires sending ETH directly, which Gearbox does not support.

```
const lidoSubmitCall = {
	target: LIDOV1_ADAPTER_ADDRESS,
	callData: LidoV1Adapter__factory.createInterface().encodeFunctionData("submit", [totalWETH])
};
```

### Deposit into Curve steCRV
Next, stETH needs to be deposited into the Curve stETH/ETH to receive the LP token. This can be done in one of two ways - either using `add_liquidity()` directly, or with a `add_all_liquidity_one_coin()` convenience function that is specific to the Curve adapter.

```
const curveDepositCall = {
	target: CURVEV1_STETH_ADAPTER_ADDRESS,
	callData: CurveV1AdapterStETH__factory.createInterface().encodeFunctionData('add_all_liquidity_one_coin', [1, totalWETH])
};
```

### Deposit Curve LP into Yearn
Finally, we'll deposit the LP token into Yearn, which will then put it into Convex and autocompound Convex farming rewards. `deposit()` without parameters allows to deposit the entire LP balance.

```
const yearnDepositCall = {
                target: YEARN_CURVE_STETH_ADAPTER_ADDRESS,
                callData: YearnV2Adapter__factory.createInterface().encodeFunctionData('deposit()')
};
```
## Putting it together

Finally, once we have constructed all the calls, we can use the Credit Facade to open an account, borrow funds and perform all the necessary actions. Note that we are actually sending ETH to Credit Facade - it will wrap it and send it back to the caller, so that WETH can be pulled during `addCollateral()`.

```jsx

import {
	WETH,
	CREDIT_MANAGER_WETH_ADDRESS,
	CREDIT_FACADE_WETH_ADDRESS,
	LIDOV1_ADAPTER_ADDRESS,
	CURVEV1_STETH_ADAPTER_ADDRESS,
	YEARN_CURVE_STETH_ADAPTER_ADDRESS,
	MAX_INT,
	ICreditFacade_factory,
	LidoV1Adapter__factory,
	CurveV1AdapterStETH__factory,
	YearnV2Adapter__factory,
	ERC20__factory
} from  "@gearbox-protocol/sdk";

async function openYearnSteCRVAccount(amount: BN, leverage: BN, walletSigner: any) {
	let weth = ERC20__factory.connect(WETH, walletSigner);

	weth.approve(CREDIT_MANAGER_WETH_ADDRESS, MAX_INT);

	const collateralWETH = amount;
	const borrowWETH = amount.mul(leverage.sub(1));
	const totalWETH = collateralWETH.add(borrowWETH);

	const addCollateralCall = {
		target: CREDIT_FACADE_WETH_ADDRESS,
		callData: ICreditFacade_factory.createInterface().encodeFunctionData('addCollateral', [walletSigner, WETH, collateralWETH]
	};

	const lidoSubmitCall = {
		target: LIDOV1_ADAPTER_ADDRESS,
		callData: LidoV1Adapter__factory.createInterface().encodeFunctionData("submit", [totalWETH])
	};

	const curveDepositCall = {
		target: CURVEV1_STETH_ADAPTER_ADDRESS,
		callData: CurveV1AdapterStETH__factory.createInterface().encodeFunctionData('add_all_liquidity_one_coin', [1, totalWETH])
	};

	const yearnDepositCall = {
		target: YEARN_CURVE_STETH_ADAPTER_ADDRESS,
		callData: YearnV2Adapter__factory.createInterface().encodeFunctionData('deposit()')
	};
}

	const calls: Array<MultiCall> = [
		addCollateralCall,
		lidoSubmitCall,
		curveDepositCall,
		yearnDepositCall
	];

	let creditFacade = ICreditFacade_factory.connect(CREDIT_FACADE_WETH_ADDRESS, walletSigner);

	await creditFacade.openCreditAccountMulticall(
					borrowWETH,
					walletSigner.address,
					calls,
					0,
					{value: collateralWETH}
			)

```
