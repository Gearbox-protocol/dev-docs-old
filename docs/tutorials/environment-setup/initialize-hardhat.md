# Initialize Hardhat

In the guide, we will do the [Hardhat](https://hardhat.org/) installation and configuration. Hardhat is a development environment to compile, deploy, test and debug your Ethereum software. You can start an instance of Hardhat Network that forks mainnet. This means that it will simulate having the same state as mainnet, but it will work as a local development network. Thus you can interact with the deplyed contract of Gearbox Protocol locally to test your integration software.

### Install Hardhat

Now, we create an empty project by

```console
gear@box:~$ mkdir play-with-gearbox
gear@box:~$ cd play-with-gearbox
```


```console
gear@box:~$ npx hardhat init
```

You need to install hardhat locally to use it, we recommand use version `^2.8.4`. Please run:

```
npm install --save-dev hardhat
```

### Typescript support 

In this guide, we will go through the steps to get a Hardhat project working with [TypeScript](https://www.typescriptlang.org/) following [TypeScript Support](https://hardhat.org/guides/typescript.html).

```
npm install --save-dev ts-node typescript
```

```
npm install --save-dev chai @types/node @types/mocha @types/chai
```

Now, we are going to rename the config file from `hardhat.config.js` to `hardhat.config.ts`, just run:

```
mv hardhat.config.js hardhat.config.ts
```

We need to make a small changes to our config file for it to work with TypeScript. Since we create an empty project, the config file should look like:
```js
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.7.3"
};
```
we change it into `hardhat.config.ts`

```ts
export default {
  solidity: "0.7.3"
};
```
We also need a `tsconfig.json` file. Here's a example:

```ts
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
