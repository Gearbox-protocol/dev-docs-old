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
      type: "doc",
      label: "Architecture",
      id: "documentation/architecture",
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
          label: "2.2 Gearbox Core",
          id: "tutorials/gearbox-discovery/gearbox-core",
        },
        {
          type: "doc",
          label: "2.3 Gearbox Pool",
          id: "tutorials/gearbox-discovery/gearbox-pools",
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
