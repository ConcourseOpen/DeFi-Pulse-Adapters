/**
 *
 * Project: Clipper
 * Chain: Ethereum
 * Tech Lead: Edo#9130  edo@shipyardsoftware.org
 * Docs: https://docs.clipper.exchange/ https://github.com/shipyard-software
 *
 */

module.exports = {
  /* Project Metadata */
  name: "Clipper",
  token: null,
  category: "DEXes",
  start: 1624383620, // Unix timestamp (utc 0) specifying when the project began, or where live data begins
  chain: "ethereum",

  /* Fetching token balances */
  tokenHolderMap: [
    {
      /* Tokens */
      tokens: [
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // WBTC
        "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
        "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
        "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
      ],

      /* Contracts that hold value */
      holders: "0xe82906b6b1b04f631d126c974af57a3a7b6a99d9", // ClipperPool

      checkETHBalance: true,
    },
  ],
};
