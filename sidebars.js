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

    {
      type: "category",
      label: "Deployments",
      link: {
        type: "doc",
        id: "documentation/deployments/intro",
      },
      items: [
        {
          type: "doc",
          label: "Deployed Contracts",
          id: "documentation/deployments/deployed-contracts",
        },
        {
          type: "doc",
          label: "Supported tokens",
          id: "documentation/deployments/supported-tokens",
        },
        {
          type: "category",
          label: "Kovan playgound",
          link: {
            type: "doc",
            id: "documentation/deployments/kovan-playground/intro",
          },
          items: [
            {
              type: "doc",
              label: "Deployed Contracts",
              id: "documentation/deployments/kovan-playground/deployed-contracts",
            },
            {
              type: "doc",
              label: "Tokens",
              id: "documentation/deployments/kovan-playground/tokens",
            },
            {
              type: "doc",
              label: "PriceFeeds",
              id: "documentation/deployments/kovan-playground/pricefeeds",
            },
            {
              type: "doc",
              label: "Protocols",
              id: "documentation/deployments/kovan-playground/protocols",
            },
          ],
        },
      ],
    },
  ],
  tutorialSidebar: [
    "tutorials/intro",
    {
      type: "category",
      label: "Environment Setup",
      link: {
        type: "doc",
        id: "tutorials/environment-setup/intro",
      },
      items: [
        {
          type: "doc",
          label: "Initialize Hardhat",
          id: "tutorials/environment-setup/initialize-hardhat",
        },
        {
          type: "doc",
          label: "Gearbox SDK And Mainnet Forking",
          id: "tutorials/environment-setup/gearbox-sdk",
        },
        {
          type: "doc",
          label: "A Simple Example",
          id: "tutorials/environment-setup/a-simple-example",
        },
      ],
    },
    {
      type: "category",
      label: "Gearbox Discovery",
      link: {
        type: "doc",
        id: "tutorials/gearbox-discovery/intro",
      },
      items: [
        {
          type: "doc",
          label: "Gearbox Core",
          id: "tutorials/gearbox-discovery/gearbox-core",
        },
        {
          type: "doc",
          label: "2.2 Gearbox Pools",
          id: "tutorials/gearbox-discovery/gearbox-pools",
        },
        {
          type: "doc",
          label: "2.2 Gearbox Anomaly Detection",
          id: "tutorials/gearbox-discovery/anomaly-detection",
        },
      ],
    },
    {
      type: "category",
      label: "Extracting Data",
      link: {
        type: "doc",
        id: "tutorials/extracting-data/extracting-data",
      },
      items: [
        {
          type: "doc",
          label: "Get Opened Accounts",
          id: "tutorials/extracting-data/get-opened-accounts",
        },
        {
          type: "doc",
          label: "Monitor Your Health Factor",
          id: "tutorials/extracting-data/monitor-your-health-factor",
        },
      ],
    },
    {
      type: "category",
      label: "Build Upon Gearbox",
      link: {
        type: "doc",
        id: "tutorials/build-upon-gearbox/build-upon-gearbox",
      },
      items: [
        {
          type: "doc",
          label: "Composable BTC short",
          id: "tutorials/build-upon-gearbox/trading-bot/composable-btc-short",
        },
        {
          type: "doc",
          label: "Time Arbitrage on sETH",
          id: "tutorials/build-upon-gearbox/trading-bot/time-arbitrage-on-seth",
        },
      ],
    },
    {
      type: "category",
      label: "Liquidation Bot",
      link: {
        type: "doc",
        id: "tutorials/liquidation-bot/liquidation-bot",
      },
      items: [
        {
          type: "doc",
          label: "Run Liquidation Bot",
          id: "tutorials/liquidation-bot/run-liquidation-bot",
        },
        {
          type: "doc",
          label: "Bot Smart Contracts",
          id: "tutorials/liquidation-bot/bot-smart-contracts",
        },
        {
          type: "doc",
          label: "Credit Service",
          id: "tutorials/liquidation-bot/credit-service",
        },
        {
          type: "doc",
          label: "Price Oracle",
          id: "tutorials/liquidation-bot/price-oracle",
        },
        {
          type: "doc",
          label: "Token Service",
          id: "tutorials/liquidation-bot/token-service",
        },
      ],
    },
    {
      type: "category",
      label: "Possible Attacks",
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
  kovanSidebar: [
    "kovan/intro",
    {
      type: "doc",
      label: "Kovan Deployed Contracts",
      id: "kovan/deployed-contracts",
    },
  ],
};

module.exports = sidebars;
