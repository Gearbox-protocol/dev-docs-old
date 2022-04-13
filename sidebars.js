/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  fundementalSidebar: [
    {
      type: "doc",
      label: "Deployed Contracts",
      id: "tutorials/deployed-contracts",
    },
    {
      type: "html",
      value: "<div />", // The HTML to be rendered
      defaultStyle: true, // Use the default menu item styling
    },
    "documentation/intro",

    {
      type: "category",
      label: "Architecture",
      link: {
        type: "doc",
        id: "documentation/architecture/intro",
      },
      items: [
        {
          type: "doc",
          label: "Contracts discovery",
          id: "documentation/architecture/discovery",
        },
        {
          type: "doc",
          label: "Account Factory",
          id: "documentation/architecture/account-factory",
        },
        {
          type: "doc",
          label: "Role model",
          id: "documentation/architecture/roles",
        },
      ],
    },
    {
      type: "category",
      label: "Pools",
      link: {
        type: "doc",
        id: "documentation/pools/intro",
      },
      items: [
        {
          type: "doc",
          label: "Liquidity",
          id: "documentation/pools/liquidity",
        },
        {
          type: "doc",
          label: "Interest rate model",
          id: "documentation/pools/linearInterestRateModel",
        },
        {
          type: "doc",
          label: "Fees collection",
          id: "documentation/pools/fees",
        },
        {
          type: "doc",
          label: "Insurance",
          id: "documentation/pools/insurance",
        },
      ],
    },
    {
      type: "category",
      label: "Credit accounts",
      link: {
        type: "doc",
        id: "documentation/credit/intro",
      },
      items: [
        {
          type: "doc",
          label: "Architecture",
          id: "documentation/credit/architecture",
        },

        {
          type: "doc",
          label: "Open credit account",
          id: "documentation/credit/open",
        },
        {
          type: "doc",
          label: "Executing transactions",
          id: "documentation/credit/execute",
        },
        {
          type: "doc",
          label: "Multicall",
          id: "documentation/credit/multicall",
        },
        {
          type: "doc",
          label: "Adding collateral",
          id: "documentation/credit/add-collateral",
        },
        {
          type: "doc",
          label: "Debt management",
          id: "documentation/credit/debt-management",
        },
        {
          type: "doc",
          label: "Closing credit account",
          id: "documentation/credit/closure",
        },
        {
          type: "doc",
          label: "Risk management",
          id: "documentation/credit/risk",
        },
        {
          type: "doc",
          label: "Liquidation",
          id: "documentation/credit/liquidation",
        },
        {
          type: "doc",
          label: "Account transfer",
          id: "documentation/credit/transfer",
        },
        {
          type: "doc",
          label: "Working with ETH",
          id: "documentation/credit/eth",
        },
      ],
    },
    {
      type: "category",
      label: "Integrations",
      link: {
        type: "doc",
        id: "documentation/integrations/intro",
      },
      items: [
        {
          type: "doc",
          label: "Building an adapter",
          id: "documentation/integrations/build",
        },
        {
          type: "category",
          label: "Existing adapters",
          link: {
            type: "doc",
            id: "documentation/integrations/existing/intro",
          },
          items: [
            {
              type: "doc",
              label: "Uniswap adapter",
              id: "documentation/integrations/existing/uniswap",
            },
            {
              type: "doc",
              label: "Curve adapter",
              id: "documentation/integrations/existing/curve",
            },
            {
              type: "doc",
              label: "Yearn adapter",
              id: "documentation/integrations/existing/yearn",
            },
            {
              type: "doc",
              label: "Lido adapter",
              id: "documentation/integrations/existing/lido",
            },
            {
              type: "doc",
              label: "Convex adapter",
              id: "documentation/integrations/existing/convex",
            },
          ],
        },
      ],
    },

    {
      type: "category",
      label: "Oracles",
      link: {
        type: "doc",
        id: "documentation/oracle/priceoracle",
      },
      items: [
        {
          type: "doc",
          label: "Yearn LP oracle",
          id: "documentation/oracle/yearn-oracle",
        },
        {
          type: "doc",
          label: "Curve LP oracle",
          id: "documentation/oracle/curve-oracle",
        },
        {
          type: "doc",
          label: "Convex LP oracle",
          id: "documentation/oracle/convex-oracle",
        },
      ],
    },
  ],
  tutorialSidebar: [
    "tutorials/intro",
    {
      type: "category",
      label: "1. Environment Setup",
      link: {
        type: "doc",
        id: "tutorials/environment-setup/intro",
      },
      items: [
        {
          type: "doc",
          label: "1.1 Initialize Hardhat",
          id: "tutorials/environment-setup/initialize-hardhat",
        },
        {
          type: "doc",
          label: "1.2 Gearbox SDK And Mainnet Forking",
          id: "tutorials/environment-setup/gearbox-sdk",
        },
        {
          type: "doc",
          label: "1.3 A Simple Example",
          id: "tutorials/environment-setup/a-simple-example",
        },
      ],
    },
    {
      type: "category",
      label: "2. Gearbox Discovery",
      link: {
        type: "doc",
        id: "tutorials/gearbox-discovery/gearbox-discovery",
      },
      items: [
        {
          type: "doc",
          label: "2.1 Gearbox Core",
          id: "tutorials/gearbox-discovery/gearbox-core",
        },
      ],
    },
    {
      type: "category",
      label: "3. Extracting Data",
      link: {
        type: "doc",
        id: "tutorials/extracting-data/extracting-data",
      },
      items: [
        {
          type: "doc",
          label: "3.1 Get Opened Accounts",
          id: "tutorials/extracting-data/get-opened-accounts",
        },
        {
          type: "doc",
          label: "3.2 Monitor Your Health Factor",
          id: "tutorials/extracting-data/monitor-your-health-factor",
        },
      ],
    },
    {
      type: "category",
      label: "4. Build Upon Gearbox",
      link: {
        type: "doc",
        id: "tutorials/build-upon-gearbox/build-upon-gearbox",
      },
      items: [
        {
          type: "doc",
          label: "4.1 Adapter",
          id: "tutorials/build-upon-gearbox/adapter",
        },
        {
          type: "category",
          label: "4.2 Trading Bot",
          link: {
            type: "doc",
            id: "tutorials/build-upon-gearbox/trading-bot/trading-bot",
          },
          items: [
            {
              type: "doc",
              label: "4.2.1 Composable BTC short",
              id: "tutorials/build-upon-gearbox/trading-bot/composable-btc-short",
            },
            {
              type: "doc",
              label: "4.2.2 Time Arbitrage on sETH",
              id: "tutorials/build-upon-gearbox/trading-bot/time-arbitrage-on-seth",
            },
          ],
        },
      ],
    },
    {
      type: "category",
      label: "5. Liquidation Bot",
      link: {
        type: "doc",
        id: "tutorials/liquidation-bot/liquidation-bot",
      },
      items: [
        {
          type: "doc",
          label: "5.1 Run Liquidation Bot",
          id: "tutorials/liquidation-bot/run-liquidation-bot",
        },
        {
          type: "doc",
          label: "5.2 Bot Smart Contracts",
          id: "tutorials/liquidation-bot/bot-smart-contracts",
        },
        {
          type: "doc",
          label: "5.3 Credit Service",
          id: "tutorials/liquidation-bot/credit-service",
        },
        {
          type: "doc",
          label: "5.4 Price Oracle",
          id: "tutorials/liquidation-bot/price-oracle",
        },
        {
          type: "doc",
          label: "5.5 Token Service",
          id: "tutorials/liquidation-bot/token-service",
        },
      ],
    },
    {
      type: "category",
      label: "6. Possible Attacks",
      link: {
        type: "doc",
        id: "tutorials/attacks/attacks",
      },
      items: [
        {
          type: "doc",
          label: "Fast check and HealthFactor protection",
          id: "tutorials/attacks/fast-check-and-healthfactor-protection",
        },
        {
          type: "doc",
          label: '"Risk Free Long" attack',
          id: "tutorials/attacks/risk-free-long-attack",
        },
      ],
    },
  ],
  analyticsSidebar: [
    "analytics/intro",
    {
      type: "doc",
      label: "1 Python Analytical Tool",
      id: "analytics/python-analytical-tool",
    },
  ],
};

module.exports = sidebars;
