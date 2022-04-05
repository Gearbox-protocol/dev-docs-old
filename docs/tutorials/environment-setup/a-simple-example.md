# A Simple Example

We have finished [Chapter 1.1](./initialize-hardhat) and [Chapter 1.2](./gearbox-sdk), so we have an environment to interact with Gearbox contracts, deploy our own software, etc. To make you feel more concrete, let's deploy a simple example to query the latest version of Gearbox's deployed contracts. First of all, we need to fork mainnet by

```
yarn fork
```
After run the command above, we will see something like this in the terminal.
```
yarn run v1.22.17
warning package.json: No license field
$ scripts/fork.sh                                                   
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/                                                                        

Accounts       
========       
                                                                      
WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.
                                                                      
Account #0: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

...

Account #19: 0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199 (10000 ETH)
Private Key: 0xdf57089febbacf7ba0bc227dafbffa9fc08a93fdc68e1e42411a14efcf23656e

WARNING: These accounts, and their private keys, are publicly known.
Any funds sent to them on Mainnet or any other live network WILL BE LOST.

```
It means that we are running an instance of Hardhat Network that forks mainnet, there 20 accounts that we can use to deploy. This means that it will simulate having the same state as mainnet, but it will work as a local development network with JSON-RPC server at `http://127.0.0.1:8545`. Thus, we can start to write our example code, we open a new command window and create a Typescript file `scripts/simple-example.ts`.
```tsx title="scripts/simple-example.ts"
// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

import { run, ethers } from "hardhat";
import { AddressProvider__factory } from "@gearbox-protocol/sdk";

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

  // Get the latest version of Gearbox's contracts
  const version = await ap.version();

  console.log(version);
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
Then we run this script by 
```
npx hardhat run scripts/simple-example.ts
```
We can see the below infomations showing in the window, it means that we have made it and the latest version is `v1`.
```
No need to generate any newer typings.
 ·-----------------|-------------·
 |  Contract Name  ·  Size (KB)  │
 ·-----------------|-------------·
BigNumber { value: "1" }
```
