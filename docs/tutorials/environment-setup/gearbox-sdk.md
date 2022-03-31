import CodeBlock from '@theme/CodeBlock';

# Gearbox SDK  and Mainnet Forking 

After we've set up [Hardhat](./initialize-hardhat.md), we will import the [Gearbox SDK](https://github.com/Gearbox-protocol/gearbox-sdk) into our codebase. We will then use Hardhat to fork the Ethereum Mainnet.

### Gearbox SDK ⚙️🧰

First of all, we need to import the Gearbox SDK into our project.

```bash npm2yarn
npm install --save-dev @diesellabs/gearbox-sdk
```

Next, we'll install some additional dependencies:

```bash npm2yarn
npm install --save-dev dotenv hardhat-abi-exporter hardhat-contract-sizer
```

We will modify `hardhat.config.ts` to set some parameters for using Gearbox SDK and forking mainnet.

```tsx title="hardhat.config.ts"
import "hardhat-contract-sizer";
import "solidity-coverage";
import dotenv from "dotenv";

import { LOCAL_NETWORK, MAINNET_NETWORK } from "@diesellabs/gearbox-sdk";

dotenv.config();

const INFURA_API_KEY = process.env.INFURA_API_KEY || "";
const KOVAN_PRIVATE_KEY = process.env.KOVAN_PRIVATE_KEY! || "0xc87509a1c067bbde78beb793e6fa76530b6382a4c0241e5e4a9ec0a0f44dc0d3"; // well known private key

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  solidity: {
    compilers: [{ version: "0.7.6", settings: {} }],
  },
  networks: {
    hardhat: {
      chainId: LOCAL_NETWORK,
      initialBaseFeePerGas: 0,
    },
    localhost: {},
    mainnet: {
      url: process.env.ETH_MAINNET_PROVIDER,
      accounts: [KOVAN_PRIVATE_KEY],
      chainId: MAINNET_NETWORK,
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [KOVAN_PRIVATE_KEY],
      gasPrice: 2e9,
      minGasPrice: 1e9,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
  gasReporter: {
    enabled: false,
    currency: "USD",
    gasPrice: 21,
  },
  typechain: {
    outDir: "types/ethers-v5",
    target: "ethers-v5",
  },
  abiExporter: {
    path: "./abi",
    clear: true,
    flat: true,
    spacing: 2,
  },
  contractSizer: {
    alphaSort: false,
    disambiguatePaths: false,
    runOnCompile: true,
  },
};

export default config;
```

:::info

As we can see, `hardhat.config.file` will read the `.env` file. Thus we create a `.env` file in the root of the project folder. For supporting mainnet forking, we only need `ETH_MAINNET_PROVIDER`.

:::

```title=".env"
  ETH_MAINNET_PROVIDER=https://eth-mainnet.alchemyapi.io/v2/YOUR_MAINNET_API_KEY

```

:::note
To use this feature you need to connect to an archive node. We recommend using [Alchemy](https://www.alchemy.com/). Please get your mainnet API key from there, once you've created an account.
:::
### Mainnet Forking

Since we have done most of the preparation works for mainnet fork. Now, we only need a script more to do the mainnet fork. Let's create a folder under `play-with-gearbox`.

`make scripts && cd scripts`

Then make a script file, let's call it `fork.sh`. What it does is exporting the configuration in `.env` file and use Hardhat to fork mainnet.

```shell title="fork.sh"
set -o allexport; source ./.env; set +o allexport;
npx hardhat node --fork $ETH_MAINNET_PROVIDER

```

We may want to use `yarn` to run this `fork.sh` file, so add 
```json
"scripts": {
    "fork": "scripts/fork.sh"
}
```
to the `package.json` file.

Now we can fork mainnet by running

```
yarn fork
```

