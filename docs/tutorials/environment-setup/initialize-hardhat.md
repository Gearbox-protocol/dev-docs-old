import CodeBlock from '@theme/CodeBlock';

# Initialize Hardhat

In the guide, we will do the [Hardhat](https://hardhat.org/) installation and configuration. Hardhat is a development environment to compile, deploy, test and debug your Ethereum software. You can start an instance of Hardhat Network that forks mainnet. This means that it will simulate having the same state as mainnet, but it will work as a local development network. Thus you can interact with the deplyed contract of Gearbox Protocol locally to test your integration software.

## Install compatible version of NodeJS (16.x)

Hardhat and the rest of the tooling are currently (as of March 2022) uncompatible with NodeJX 18.x
To use the tooling successfully, please install NodeJS 17.x on your system.

To manage NodeJS versions, we recommend to use `n`. [You can find installation instructions for your OS here](https://www.npmjs.com/package/n#installation)

Once you've installed `n`, please run the following to install NodeJS 16.x:

```bash
n install 16
```

## Install Hardhat

Now, you'll need to create an empty folder and enter it by running the following commands:

```bash
mkdir gearbox-sandbox;
cd gearbox-sandbox
```

Next, initialize Hardhat to this folder:

```bash
npx hardhat init
```

You need to install hardhat locally to use it, we recommand use version `^2.8.4`. Please run:

```bash npm2yarn
npm install --save-dev hardhat
```

And finally build it all:

```bash npm2yarn
npm run build
```


## Typescript support

In this guide, you will go through the steps to get a Hardhat project working with [TypeScript](https://www.typescriptlang.org/) following [TypeScript Support](https://hardhat.org/guides/typescript.html).

```bash npm2yarn
npm install --save-dev ts-node typescript
```

```bash npm2yarn
npm install --save-dev chai @types/node @types/mocha @types/chai
```

You will need to make a small adjustment to the the config file as you're migrating it from Javascript to Typescript. Your `hardhat.config.js` will look like this by default:

```js title="hardhat.config.js"
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3"
};
```

You must rename the config file from `hardhat.config.js` to `hardhat.config.ts`. To do so, just run the following:

```bash
mv hardhat.config.js hardhat.config.ts
```

You need to make a change to `hardhat.config.ts` now, and modify the export mechanism to be in line with the Typescript export mechanism:

```js title="hardhat.config.ts"
export default {
  solidity: "0.7.3"
};
```

You will also need a `tsconfig.json` file. Here's a example:

```ts title="tsconfig.json"
{
  "compilerOptions": {
    /* Basic Options */
    // "incremental": true,                   /* Enable incremental compilation */
    "target": "es2018" /* Specify ECMAScript target version: 'ES3' (default), 'ES5', 'ES2015', 'ES2016', 'ES2017', 'ES2018', 'ES2019', 'ES2020', or 'ESNEXT'. */,
    "module": "commonjs" /* Specify module code generation: 'none', 'commonjs', 'amd', 'system', 'umd', 'es2015', 'es2020', or 'ESNext'. */,

     /* Strict Type-Checking Options */
    "strict": true /* Enable all strict type-checking options. */,


    /* Module Resolution Options */
    "esModuleInterop": true /* Enables emit interoperability between CommonJS and ES Modules via creation of namespace objects for all imports. Implies 'allowSyntheticDefaultImports'. */,
    "outDir": "dist"
  },
  "include": ["./scripts", "./test"],
  "files": ["./hardhat.config.ts"]
}
```
