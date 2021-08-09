const axios = require('axios');

module.exports = {
    name: 'CompliFi',
    token: 'COMFI',
    category: 'Derivatives',
    start: 1616484124, // Mar-23-2021 07:22:04 AM +UTC
    tokenHolderMap: [
      {
        tokens: async () => {
          return (await axios.get('https://eth.complifi.me/api/protocol/pulse?networkId=1')).data.tokens || [];
        },
        holders: async () => {
          return (await axios.get('https://eth.complifi.me/api/protocol/pulse?networkId=1')).data.holders || [];
        },
      }
    ],
  };



