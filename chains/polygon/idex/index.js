const sdk = require('../../../../sdk');

module.exports = {
  name: "IDEX",
  token: "IDEX",
  chain: "polygon",
  category: "DEXes",
  start: 1638316800,
  tokenHolderMap: [{
    tokens: async () => {
      const allTokens = await sdk.api.util.tokenList();
      return allTokens.map(token => token.contract);
    },
    holders: '0x3bcc4eca0a40358558ca8d1bcd2d1dbde63eb468',
  }],
};
