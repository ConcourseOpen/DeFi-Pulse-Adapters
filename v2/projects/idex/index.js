const sdk = require("../../sdk");

module.exports = {
  name: "IDEX",
  token: "IDEX",
  category: "DEXes",
  start: 1603166400,
  tokenHolderMap: [{
    tokens: async () => {
      const allTokens = await sdk.api.util.tokenList();
      return allTokens.map(token => token.contract);
    },
    holders: '0xE5c405C5578d84c5231D3a9a29Ef4374423fA0c2',
  }],
};