module.exports = {
    /* Project Metadata */
    name: 'DmmExchange',
    token: null,
    category: 'DEXes',
    start: 1617606651, // @5-Apr-2021, 7:10:51 AM+UTC 
    /*fetching token balances */
    tokenHolderMap: [
      {
            tokens: async () => {
              const allTokens = await sdk.api.util.tokenList();
              return allTokens.map(token => token.contract);
            },
        holders: {
          pullFromLogs: true,
          logConfig: {
            target: '0x833e4083B7ae46CeA85695c4f7ed25CDAd8886dE',
            topic: 'poolCreated(uint256,uint256)',
            fromBlock: 12178218
          },
          transform: null,
        },
        checkETHBalance: true,
      }
    ]
  };
 