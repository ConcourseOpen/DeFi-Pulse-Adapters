const sdk = require('../../../sdk/index');

module.exports = {
  /* Project Metadata */
  name: 'FinNexus',
  token: "FNX",
  category: 'Option',
  start:11188241, // Nov-04-2020 03:26:42 AM +UTC
  /* required for fetching token balances */
  tokenHolderMap: [{
      tokens: [
        '0xdac17f958d2ee523a2206206994597c13d831ec7', // usdt
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // usdc
        '0x853d955acef822db058eb8505911ed77f175b99e', //FRAX
        '0xeF9Cd7882c067686691B6fF49e650b43AFBBCC6B'  //FNX
      ],
      holders: [
        '0xff60d81287bf425f7b2838a61274e926440ddaa6', //CollateralPool(USDC)
        '0x919a35a4f40c479b3319e3c3a2484893c06fd7de',  //CollateralPool(FNX)
        '0x6f88e8fbF5311ab47527f4Fb5eC10078ec30ab10'   //CollateralPool(FRAX)
      ]
    }
  ],
};
