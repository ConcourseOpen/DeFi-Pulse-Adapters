const axios = require('axios');

module.exports = {
    name: 'CompliFi',
    token: 'COMFI',
    chain: 'Polygon',
    category: 'Derivatives',
    start: 1621938255,  // May-25-2021 10:24:15 AM UTC
    tokenHolderMap: [
      {
        tokens: async () => {
          return (await axios.get('https://eth.complifi.me/api/protocol/pulse?networkId=137')).data.tokens || [];
        },
        holders: async () => {
          return (await axios.get('https://eth.complifi.me/api/protocol/pulse?networkId=137')).data.holders || [];
        },
      }
    ],
  };
