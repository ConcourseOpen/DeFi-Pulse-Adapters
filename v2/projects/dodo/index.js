'use strict'
const sdk = require('../../../sdk');
//const axios = require('axios');
const tokensV1 = [
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
];
const poolsV1 = [
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
];

const BASE_TOKEN = {
  inputs: [],
  name: "_BASE_TOKEN_",
  outputs: [
    {
      internalType: "contract IERC20",
      name: "",
      type: "address"
    }
  ],
  stateMutability: "view",
  type: "function"
};

const QUOTE_TOKEN = {
  inputs: [],
  name: "_QUOTE_TOKEN_",
  outputs: [
    {
      internalType: "contract IERC20",
      name: "",
      type: "address"
    }
  ],
  stateMutability: "view",
  type: "function"
};

const DODO_FACTORY = [
  {
    name: 'DODO stable pool',
    contract: '0x6fdDB76c93299D985f4d3FC7ac468F9A168577A4',
    startBlock: 12269086,
    topic: 'NewDSP(address,address,address,address)'
  },
  {
    name: 'DODO vending machine',
    contract: '0x72d220cE168C4f361dD4deE5D826a01AD8598f6C',
    startBlock: 12056830,
    topic: 'NewDVM(address,address,address,address)'
  },
  {
    name: 'DODO private pool',
    contract: '0x6B4Fa0bc61Eddc928e0Df9c7f01e407BfcD3e5EF',
    startBlock: 11927758,
    topic: 'NewDPP(address,address,address,address)',
  },

]

function transformAddr(poolLog) {
  if (typeof (poolLog) === 'string')
    return `0x${poolLog.substr(poolLog.length - 40, 40)}`;
  if (typeof (poolLog) === 'object')
    return `0x${poolLog.data.substr(poolLog.data.length - 40, 40)}`;
}

let tokenHolders = [
  { // DODO V1 pools
    tokens: tokensV1,
    holders: poolsV1,
    //checkETHBalance: true,
  },
]

for (let poolInfo of DODO_FACTORY)
  for (let token of [BASE_TOKEN, QUOTE_TOKEN])
  // add DODO V2 pools
  {
    tokenHolders.push({
      tokens: {
        pullFromPools: true,
        abi: token,
      },
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: poolInfo.contract.toLowerCase(),
          topic: poolInfo.topic,
          fromBlock: poolInfo.startBlock,
        },
        transform: transformAddr,
      },
    })
  }

module.exports = {
  name: "DODO",
  token: null,
  category: "DEXes",
  start: 1597126986, // Aug-07-2020 03:56:08 PM +UTC
  tokenHolderMap: tokenHolders,
};
