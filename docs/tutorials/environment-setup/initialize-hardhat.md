import CodeBlock from '@theme/CodeBlock';

# Initialize Hardhat

In the guide, we will do the [Hardhat](https://hardhat.org/) installation and configuration. Hardhat is a development environment to compile, deploy, test and debug your Ethereum software. You can start an instance of Hardhat Network that forks mainnet. This means that it will simulate having the same state as mainnet, but it will work as a local development network. Thus you can interact with the deplyed contract of Gearbox Protocol locally to test your integration software.

## Install compatible version of NodeJS (16.x)

Hardhat and the rest of the tooling are currently (as of March 2022) uncompatible with NodeJX 18.x
To use the tooling successfully, please install NodeJS 16.x on your system.

To manage NodeJS versions, we recommend to use `n`. [You can find installation instructions for your OS here](https://www.npmjs.com/package/n#installation)

Once you've installed `n`, please run the following to install NodeJS 16.x:

```bash
n install 16
```

## 👷 Install Hardhat 👷

We will create an empty project which uses Typescript. To do so, you'll need to create an empty folder and enter it by running the following commands:

```bash
mkdir gearbox-sandbox;
cd gearbox-sandbox
```

Next, initialize Hardhat to this folder:

```bash
npx hardhat init
```

:::note
Choose the `Create an advanced sample project that uses TypeScript` option to set up the project using TS.
:::

## Congratulations on setting up hardhat

You're now all set, and have a local installation of hardhat ready to use!
