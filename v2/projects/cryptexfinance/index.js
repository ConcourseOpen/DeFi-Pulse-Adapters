const sdk = require('../../../sdk/index');

module.exports = {
  /* Project Metadata */
  name: 'Cryptex',
  token: "CTX",
  category: 'Lending',
  start: 1617940800, // Thursday, April 8, 2021 11:00:00 PM GMT-05:00
  /* required for fetching token balances */
  tokenHolderMap: [{
      tokens: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
        '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
      ],
      holders: [
        '0x717170b66654292dfbd89c39f5ae6753d2ac1381', // ETHVaultHandler
        '0x443366a7a5821619d8d57405511e4fadd9964771' // DAIVaultHandler
      ]
    }
  ],
};
