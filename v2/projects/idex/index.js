const axios = require('axios');

module.exports = {
  /* Project Metadata */
  name: "IDEX", // project name
  token: "IDEX", // null, or token symbol if project has a custom token
  category: "DEXes", // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1603166400, // unix timestamp (utc 0) specifying when the project began, 10-20-2020 UTC 0:00:00
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: async () => {
        const allTokens = (await axios.get('https://api.idex.io/v1/assets')).data;
        return allTokens.map(token => token.contractAddress);
      },
      holders: '0xE5c405C5578d84c5231D3a9a29Ef4374423fA0c2',
      checkETHBalance: true,
    }
  ],
};
