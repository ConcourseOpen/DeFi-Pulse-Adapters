module.exports = {
  /* Project Metadata */
  name: 'Saddle',   // project name
  website: "https://saddle.finance",
  token: null,              // null, or token symbol if project has a custom token
  category: 'DEXes',        // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1611057090,        // January 19, 2021 11:51:30 AM
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: [
        '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa', // TBTC
        '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d', // RENBTC
        '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
        '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6', // SBTC
      ],
      holders: '0x4f6A43Ad7cba042606dECaCA730d4CE0A57ac62e',
    }
  ],
};
