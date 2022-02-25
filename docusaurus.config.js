// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");
const math = require('remark-math');
const katex = require('rehype-katex');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "Gearbox Protocol Developer Docs",
  tagline: "How to build with the Gearbox Leverage Protocol",
  url: "https://dev-docs-gearbox.vercel.app",
  baseUrl: "/",
  onBrokenLinks: "throw",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "GearboxProtocol", // Usually your GitHub org/user name.
  projectName: "dev-docs", // Usually your repo name.

  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          remarkPlugins: [math],
          rehypePlugins: [katex],
          // Please change this to your repo.
          editUrl:
            "https://github.com/Gearbox-protocol/dev-docs/tree/main/packages/create-docusaurus/templates/shared/",
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            "https://github.com/Gearbox-protocol/dev-docs/tree/main/packages/create-docusaurus/templates/shared/",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
    [
      "docusaurus-preset-shiki-twoslash",
      {
        themes: ["min-light", "nord"],
      },
    ],
  ],

	stylesheets: [
  	{
    	href: 'https://cdn.jsdelivr.net/npm/katex@0.13.24/dist/katex.min.css',
    	type: 'text/css',
    	integrity:
    	  'sha384-odtC+0UGzzFL/6PNoE8rX/SPcQDXBJ+uRepguP4QkPCm2LBxH3FA3y+fKSiJ+AmM',
    	crossorigin: 'anonymous',
  	},
	],

  themeConfig: {
    navbar: {
      title: "Gearbox",
      logo: {
        alt: "Gearbox Finance",
        src: "img/gearbox.png",
      },
      items: [
        {
                    type: "doc",
                    docId: "intro",
                    position: "left",
                    label: "Introduction",

        },
        {
                    type: "doc",
                    docId: "fundaments/intro",
                    position: "left",
                    label: "Fundaments",

        },
        {
          type: "doc",
          docId: "intro",
          position: "left",
          label: "Tutorials",
        },
        {
          type: "doc",
          docId: "sdk/intro",
          position: "left",
          label: "SDK",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "Tutorial",
              to: "/docs/intro",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Stack Overflow",
              href: "https://stackoverflow.com/questions/tagged/gearboxprotocol",
            },
            {
              label: "Discord",
              href: "https://discord.gg/xfZhjsAQ",
            },
            {
              label: "Twitter",
              href: "https://twitter.com/GearboxProtocol",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/facebook/docusaurus",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Gearbox Protocol. Built with Docusaurus.`,
    },
    prism: {
      theme: lightCodeTheme,
      darkTheme: darkCodeTheme,
    },
  },
};

module.exports = config;
