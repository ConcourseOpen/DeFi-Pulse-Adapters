'use strict'
const sdk = require('../../../sdk');
const axios = require('axios');
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
]
const tokensV2 = [
  '0x43dfc4159d86f3a37a5a4b3d4580b888ad7d4ddd',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
  '0xdac17f958d2ee523a2206206994597c13d831ec7',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  '0xa0afAA285Ce85974c3C881256cB7F225e3A1178a',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
  '0x514910771af9ca656af840dff83e8264ecf986ca',
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
  '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
  '0xc00e94cb662c3520282e6f5717214004a7f26888',
  '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e',
  '0x054f76beED60AB6dBEb23502178C52d6C5dEbE40',
  '0x106538cc16f938776c7c180186975bca23875287',
  '0x4691937a7508860f876c9c0a2a617e7d9e945d4b',
  '0x6b175474e89094c44da98b954eedeac495271d0f',
  '0x1985365e9f78359a9B6AD760e32412f4a445E862',
  '0xe41d2489571d322189246dafa5ebde1f4699f498',
  '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
  '0x89dcff5fd892f2bfc8b75dba12804b651f769579',
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
  '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
  '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
  '0x1f573d6fb3f13d689ff844b4ce37794d79a7ff1c',
  '0x216e9d8a521d93ec769635859c57938119fe5369',
  '0x6810e776880c02933d47db1b9fc05908e5386b96',
  '0x408e41876cccdc0f92210600ef50372656052a38',
  '0xd26114cd6ee289accf82350c8d8487fedb8a0c07',
  '0x960b236a07cf122663c4303350609a66a7b288c0',
  '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  '0x5adc961d6ac3f7062d2ea45fefb8d8167d44b190',
  '0x4946fcea7c692606e8908002e55a582af44ac121',
  '0x27054b13b1b798b345b591a4d22e6562d47ea75a',
  '0x4ceda7906a5ed2179785cd3a40a69ee8bc99c466',
  '0x300a902513815028e97fc79e92082ce6a98d3b74',
  '0x543ff227f64aa17ea132bf9886cab5db55dcaddf',
  '0xb64ef51c888972c908cfacf59b47c1afbc0ab8ac',
  '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
  '0x5bc7e5f0ab8b2e10d2d0a3f21739fce62459aef3',
  '0xa4e8c3ec456107ea67d3075bf9e3df3a75823db0',
  '0x4f9254c83eb525f9fcf346490bbb3ed28a81c667',
  '0x607f4c5bb672230e8672085532f7e901544a7375',
  '0x888666ca69e0f178ded6d75b5726cee99a87d698',
  '0xe0b7927c4af23765cb51314a0e0521a9645f0e2a',
  '0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27',
  '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e',
  '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643',
  '0xf5dce57282a584d2746faf1593d3121fcac444dc',
  '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5',
  '0x158079ee67fce2f58472a96584a73c7ab9ac95c1',
  '0x39aa39c021dfbae8fac545936693ac917d5e7563',
  '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407',
  '0xb6ed7644c69416d67b522e20bc294a9a9b405b31',
  '0x744d70fdbe2ba4cf95131626614a1763df805b9e',
  '0x42d6622dece394b54999fbd73d108123806f6a18',
  '0x6b01c3170ae1efebee1a3159172cb3f7a5ecf9e5',
  '0x8400d94a5cb0fa0d041a3788e395285d61c9ee5e',
  '0xb5a5f22694352c15b00323844ad545abb2b11028',
  '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671',
  '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd',
  '0x419d0d8bdd9af5e606ae2232ed285aff190e711b',
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1',
  '0x0000000000085d4780b73119b644ae5ecd22b376',
  '0x58b6a8a3302369daec383334672404ee733ab239',
  '0xf629cbd94d3791c9250152bd8dfbdf380e2a3b9c',
  '0x595832f8fc6bf59c85c527fec3740a1b7a361269',
  '0x8f8221afbb33998d8584a2b05749ba73c37a938a',
  '0x0abdace70d3790235af448c88547603b945604ea',
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0',
  '0xbbbbca6a901c926f240b89eacb641d8aec7aeafd',
  '0x255aa6df07540cb5d3d297f0d0d4d84cb52bc8e6',
  '0x0000000000b3f879cb30fe243b4dfee438691c04',
  '0x04fa0d235c4abf4bcf4787af4cf447de572ef828',
  '0x56d811088235f11c8920698a204a5010a788f4b3',
  '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d',
  '0xba100000625a3754423978a60c9317c58a424e3d',
  '0x80fb784b7ed66730e8b1dbd9820afd29931aab03',
  '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
  '0x85eee30c52b0b379b046fb0f85f4f3dc3009afec',
  '0xe2f2a5c287993345a840db3b0845fbc70f5935a5',
  '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
  '0xd533a949740bb3306d119cc777fa900ba034cd52',
  '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2',
  '0xB8BAa0e4287890a5F79863aB62b7F175ceCbD433',
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984',
  '0xe28b3b32b6c345a34ff64674606124dd5aceca30',
  '0x1ceb5cb57c4d4e2b2433641b95dd330a33185a44',
  '0xc944e90c64b2c07662a292be6244bdf05cda44a7',
  '0x57b946008913b82e4df85f501cbaed910e58d26c',
  '0x111111111117dc0aa78b770fa6a738034120c302',
  '0x0000000000095413afc295d19edeb1ad7b71c952',
  '0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a',
  '0xa7ED29B253D8B4E3109ce07c80fc570f81B63696',
  '0xe481f2311c774564d517d015e678c2736a25ddd3',
  '0x037a54aab062628c9bbae1fdb1583c195585fe41',
  '0x83e6f1E41cdd28eAcEB20Cb649155049Fac3D5Aa',
  '0x3893b9422cd5d70a81edeffe3d5a1c6a978310bb',
  '0xee573a945b01b788b9287ce062a0cfc15be9fd86',
  '0x853d955acef822db058eb8505911ed77f175b99e',
  '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0'
]

module.exports = {
  name: "DODO",
  token: null,
  category: "DEXes",
  start: 1597126986, // Aug-07-2020 03:56:08 PM +UTC
  tokenHolderMap: [
    // DODO V1
    {
      tokens: tokensV1,
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
      tokens: tokensV2,

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
      tokens: tokensV2,
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: '0x72d220cE168C4f361dD4deE5D826a01AD8598f6C',
          topic: 'NewDVM(address,address,address,address)',
          fromBlock: 12049617,
        },
        transform: (poolLog) => {
          if (typeof (poolLog) === 'string')
            return `0x${poolLog.substr(poolLog.length - 40, 40)}`;
          else
            return '0x6d0806dfa6ab5bf8e96defa42244b3ce9f62e920';
        },
      },
      //checkETHBalance: true,
    },

    { // DODO Private Pool Factory
      tokens: tokensV2,
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: '0x6B4Fa0bc61Eddc928e0Df9c7f01e407BfcD3e5EF',
          topic: 'NewDPP(address,address,address,address)',
          fromBlock: 11730391,
        },
        transform:
          (poolLog) => {
            if (typeof (poolLog) === 'string ')
              return `0x${poolLog.substr(poolLog.length - 40, 40)}`;
            else
              return '0x6d0806dfa6ab5bf8e96defa42244b3ce9f62e920';
          },
        //(poolLog) => `0x${poolLog.substr(poolLog.length - 40, 40)}`,
      },
      //checkETHBalance: true,
    }
  ]
};
