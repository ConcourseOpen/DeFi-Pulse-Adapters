module.exports = {
  /* Project Metadata */
  name: "CVI",
  website: "https://cvi.finance/",
  token: "GOVI",
  category: "Derivatives",
  start: 1611073144,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: [
        "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
      ],
      holders: [
        "0xe0437BeB5bb7Cf980e90983f6029033d710bd1da", // USDTPlatform
        "0x5005e8Dc0033E78AF80cfc8d10f5163f2FcF0E79", // ETHPlatform
      ],
      checkETHBalance: true,
    },
  ],
};
