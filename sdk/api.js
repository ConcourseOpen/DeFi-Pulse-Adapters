/*==================================================
  Modules
  ==================================================*/

  require('dotenv').config();
  const axios = require('axios');

/*==================================================
  Helper Methods
  ==================================================*/

  async function POST(endpoint, options) {
    try {
      // console.log(endpoint, options)

      let url = `${process.env.DEFIPULSE_API_URL}/${process.env.DEFIPULSE_KEY}${endpoint}`;

      if(process.env.INFURA_KEY) {
        url = `${url}?infura-key=${process.env.INFURA_KEY}`;
      }

      let response = await axios.post(url, options);

      return response.data;
    } catch(error) {
      throw error.response ? error.response.data : error;
    }
  }

  async function erc20(endpoint, options) {
    return POST(`/erc20/${endpoint}`, options);
  }

  async function eth(endpoint, options) {
    return POST(`/eth/${endpoint}`, options);
  }

  async function util(endpoint, options) {
    return POST(`/util/${endpoint}`, options);
  }

  async function abi(endpoint, options) {
    return POST(`/abi/${endpoint}`, options);
  }

/*==================================================
  Exportsd
  ==================================================*/

  module.exports = {
    abi: {
      call: (options) => abi('call', { ...options }),
      multiCall: (options) => abi('multiCall', { ...options })
    },
    util: {
      getLogs: (options) => util('getLogs', { ...options }),
      kyberTokens: () => util('kyberTokens'),
      getEthCallCount: () => util('getEthCallCount'),
      resetEthCallCount: () => util('resetEthCallCount'),
      toSymbols: (data) => util('toSymbols', { data }),
      lookupBlock: (timestamp) => util('lookupBlock', { timestamp })
    },
    eth: {
      getBalance: (options) => eth('getBalance', options),
    },
    erc20: {
      info: (target) => erc20('info', { target }),
      symbol: (target) => erc20('symbol', { target }),
      decimals: (target) => erc20('decimals', { target }),
      totalSupply: (options) => erc20('totalSupply', { ...options }),
      balanceOf: (options) => erc20('balanceOf', { ...options }),
    }
  }
