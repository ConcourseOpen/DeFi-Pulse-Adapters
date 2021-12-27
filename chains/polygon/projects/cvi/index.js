module.exports = {
  /* Project Metadata */
  name: "Crypto Volatility Index_Polygon",
  website: "https://cvi.finance/",
  token: "GOVI",
  chain: "Polygon",
  category: "Derivatives",
  start: 1622352129,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", // USDT
      holders: "0x88D01eF3a4D586D5e4ce30357ec57B073D45ff9d", // USDTPlatform
    },
    {
      tokens: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // USDC
      holders: "0x3863D0C9b7552cD0d0dE99fe9f08a32fED6ab72f", // USDCPlatform
    },
  ],
};
