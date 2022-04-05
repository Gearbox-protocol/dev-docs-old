import CodeBlock from '@theme/CodeBlock';

# Gearbox SDK  and Mainnet Forking 

After we've [set up Hardhat](./initialize-hardhat.md), we will import the [Gearbox SDK](https://github.com/Gearbox-protocol/gearbox-sdk) into our codebase. We will then use Hardhat to fork the Ethereum Mainnet.

### Gearbox SDK ⚙️🧰

First of all, we need to import the Gearbox SDK into our project.

```bash npm2yarn
npm install --save-dev @diesellabs/gearbox-sdk
```

Next, we'll install some additional dependencies:

```bash npm2yarn
npm install --save-dev dotenv hardhat-abi-exporter hardhat-contract-sizer
```

We will replace the content of `hardhat.config.ts` to set some parameters for using Gearbox SDK and forking mainnet.

:::info
We are adding the Hardhat network here
:::

```tsx title="hardhat.config.ts"
import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { LOCAL_NETWORK, MAINNET_NETWORK } from "@diesellabs/gearbox-sdk";

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    hardhat: {
      chainId: LOCAL_NETWORK,
      initialBaseFeePerGas: 0,
    },
    mainnet: {
      url: process.env.ETH_MAINNET_PROVIDER,
      accounts: [KOVAN_PRIVATE_KEY],
      chainId: MAINNET_NETWORK,
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
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

We've set up a working environment with our tooling now. We will now move on to forking the Ethereum Mainnet.

We'll set up a script in our script folder.

```bash
cd scripts
```

Then create a script file, let's call it `fork.sh`. It exports the configuration in `.env` file and use Hardhat to fork the Ethereum Mainnet.

```shell title="fork.sh"
set -o allexport; source ./.env; set +o allexport;
npx hardhat node --fork $ETH_MAINNET_PROVIDER
```

We may want to use `yarn` or `npm` to run this `fork.sh` file, so add the following to the `package.json` file.
```json
"scripts": {
    "fork": "scripts/fork.sh"
}
```

Now we can fork mainnet by running

```bash npm2yarn
npm run fork
```

