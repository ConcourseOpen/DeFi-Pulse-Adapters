const sdk = require('../../../sdk/index');

module.exports = {
  /* Project Metadata */
  name: 'xDai',
  token: null,
  category: 'Payments',
  start: 1539028166,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: [
        '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', // SAI
        '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
        '0x06af07097c9eeb7fd685c692751d5C66db49c215' // CHAI
      ],
      holders: '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016'
    },
    {
      tokens: async () => {
        const allTokens = await sdk.api.util.tokenList();
        return allTokens.map(token => token.contract);
      },
      holders: '0x88ad09518695c6c3712AC10a214bE5109a655671'
    }
  ],
};
