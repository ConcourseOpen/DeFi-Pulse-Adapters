const axios = require('axios');

module.exports = {
  /* Project Metadata */
  name: "Enzyme Finance",
  token: "MLN", 
  category: "Assets", 
  start: 1551398400, // Fri Mar 01 2019 00:00:00 GMT+0000
  tokenHolderMap: [
    {
      tokens: async () => {
        const allTokens = (await axios.get('https://data.enzyme.finance/api/asset/list')).data.data;
        return allTokens.map(token => token.id);
      },
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: '0xC3DC853dD716bd5754f421ef94fdCbac3902ab32',
          topic: 'VaultProxyDeployed(address,address,address,address,address,string)',
          keys: ['topics'],
          fromBlock: 11636493
        },
        transform: null
      },
      checkETHBalance: true,
    }
  ],
};
