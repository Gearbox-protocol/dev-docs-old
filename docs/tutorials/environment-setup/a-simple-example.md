# A Simple Example

We have finished [Chapter 1.1](./initialize-hardhat) and [Chapter 1.2](./gearbox-sdk), so we have an environment to interact with Gearbox contracts, deploy our own software, etc. To make it feel more concrete, let's deploy a simple example to query the latest version of Gearbox's deployed contracts. First of all, we need to fork mainnet by executing:

```bash npm2yarn
npm run fork
```

After running the command above, we will see something like this in the terminal.

```bash
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

Congratulations, if you see an output like the above it means that we are running an instance of Hardhat Network that forks mainnet.
We are being shown 20 wallets that we can use to deploy. Using a Mainnet fork means that we have the same state as mainnet, but it will work as a local development network with JSON-RPC server at `http://127.0.0.1:8545`. Thus, we can start to write our example code, we open a new command window and create a Typescript file [scripts/simple-example.ts](https://github.com/Gearbox-protocol/play-with-gearbox/blob/main/scripts/simple-example.ts).

```tsx title="scripts/simple-example.ts"
async function main() {
  const provider = new ethers.providers.JsonRpcProvider();

  const addressProvider = AddressProvider__factory.connect(ADDRESS_PROVIDER_ADDRESS, provider);
  const version = await addressProvider.version();
  console.log(version);
}
```

Then we run this script by executing the following shell command:

```bash
npx hardhat run scripts/simple-example.ts
```

If you can see the below output in your terminal, it means that we were successful and the latest version is `v1`.

```
No need to generate any newer typings.
 ·-----------------|-------------·
 |  Contract Name  ·  Size (KB)  │
 ·-----------------|-------------·
BigNumber { value: "1" }
```
