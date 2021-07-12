const sdk = require('../../../sdk');
const axios = require('axios');

module.exports = {
  name: "DODO",
  token: null,
  category: "DEXes",
  start: 1597126986, // Aug-07-2020 03:56:08 PM +UTC
  tokenHolderMap: [
    // DODO V1
    {
      tokens: [
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
        "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
        "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9", // AAVE
        "0x514910771af9ca656af840dff83e8264ecf986ca", // LINK
        "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03", // LEND
        "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f", // SNX
        "0xc00e94cb662c3520282e6f5717214004a7f26888", // COMP
        "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // WBTC
        "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e", // YFI
        "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
        "0x4691937a7508860f876c9c0a2a617e7d9e945d4b", // WOO
        "0xa0afAA285Ce85974c3C881256cB7F225e3A1178a", // wCRES
      ],

      holders: [
        "0x75c23271661d9d143dcb617222bc4bec783eff34",//WETH-USDC	
        "0x562c0b218cc9ba06d9eb42f3aef54c54cc5a4650",// LINK-USDC
        "0xc226118fcd120634400ce228d61e1538fb21755f",// LEND-USDC
        "0x94512fd4fb4feb63a6c0f4bedecc4a00ee260528",// AAVE-USDC
        "0xca7b0632bd0e646b0f823927d3d2e61b00fe4d80",// SNX-USDC
        "0x0d04146b2fe5d267629a7eb341fb4388dcdbd22f",// COMP-USDC
        "0x2109f78b46a789125598f5ad2b7f243751c2934d",// WBTC-USDC
        "0x1b7902a66f133d899130bf44d7d879da89913b2e",// YFI-USDC
        "0x9d9793e1e18cdee6cf63818315d55244f73ec006",// FIN-USDT
        "0xC9f93163c99695c6526b799EbcA2207Fdf7D61aD",// USDT-USDC
        "0x181d93ea28023bf40c8bb94796c55138719803b4",// WOO-USDT
        "0x85f9569b69083c3e6aeffd301bb2c65606b5d575",// wCRES-USDT
      ],
      //checkETHBalance: true,
    },
    // DODO V2
    { // DODO Stable Pooling Factory
      tokens: async () => {
        let tokens = (
          await axios.get('https://i-op.dodoex.io/erc-20-s?chains.name=mainnet')
        ).data.map(item => item.address);
        return tokens;
      },
      holders: [
        '0x3058ef90929cb8180174d74c507176cca6835d73',
        '0xd84820f0e66187c4f3245e1fe5ccc40655dbacc9',
        '0xc3ee741fce1302e367d75c4a3441694ae6220344',
        '0xccbb348998d323b7ea338fc4af841a830a9e40c5',
        '0x15bb11b1e5f9f15aa3e54fccf2558465848f7a5a',
        '0x6d0806dfa6ab5bf8e96defa42244b3ce9f62e920'
      ],
      //checkETHBalance: true,
    },

    {// DODO Vending Machine Factory
      tokens: async () => {
        let tokens = (
          await axios.get('https://i-op.dodoex.io/erc-20-s?chains.name=mainnet')
        ).data.map(item => item.address);
        return tokens;
      },
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: '0x72d220cE168C4f361dD4deE5D826a01AD8598f6C',
          topic: 'NewDVM(address,address,address,address)',
          fromBlock: 12049617,
        },
        transform: (poolLog) => `0x${poolLog.substr(poolLog.length - 40, 40)}`,
      },
      //checkETHBalance: true,
    },

    { // DODO Private Pool Factory
      tokens: async () => {
        let tokens = (
          await axios.get('https://i-op.dodoex.io/erc-20-s?chains.name=mainnet')
        ).data.map(item => item.address);
        return tokens;
      },

      holders: {
        pullFromLogs: true,
        logConfig: {
          target: '0x6B4Fa0bc61Eddc928e0Df9c7f01e407BfcD3e5EF',
          topic: 'NewDPP(address,address,address,address)',
          fromBlock: 11730391,
        },
        transform: (poolLog) => `0x${poolLog.substr(poolLog.length - 40, 40)}`,
      },
      //checkETHBalance: true,
    }
  ]
};
