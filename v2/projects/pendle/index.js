const MARKET_HOLDERS = {
  pullFromLogs: true,
  logConfig: {
    target: '0x1b6d3e5da9004668e14ca39d1553e9a46fe842b3',
    topic: 'MarketCreated(bytes32,address,address,address)',
    keys: ['topics'],
    fromBlock: 12638048
  },
  transform: (poolLog) => `0x${poolLog[3].slice(26)}`,
};
const SUSHI_HOLDERS = [
  '0xb124c4e18a282143d362a066736fd60d22393ef4', // OT-PE-29DEC2022
  '0x72972b21ce425cfd67935e07c68e84300ce3f40f', // OT-ETHUSDC-29DEC2022
  '0x8B758d7fD0fC58FCA8caA5e53AF2c7Da5F5F8De1', // OT-aUSDC-30DEC2021
  '0x0d8a21f2ea15269b7470c347083ee1f85e6a723b', // OT-aUSDC-29DEC2022
  '0x2C80D72af9AB0bb9D98F607C817c6F512dd647e6', // OT-cDAI-30DEC2021
  '0x4556C4488CC16D5e9552cC1a99a529c1392E4fe9', // OT-cDAI-29DEC2022
];
const HOLDERS = [MARKET_HOLDERS, SUSHI_HOLDERS];

const PENDLE_TOKEN_TYPE = ['token', 'xyt'];
const SUSHI_TOKEN_TYPE = ['token0', 'token1'];
const TOKEN_TYPES = [PENDLE_TOKEN_TYPE, SUSHI_TOKEN_TYPE];

const TOKEN_ABI = {
  inputs: [],
  name: "",
  outputs: [
    {
      internalType: "address",
      name: "",
      type: "address"
    }
  ],
  stateMutability: "view",
  type: "function"
};

let tokenHolders = [];

for (let h in HOLDERS) {
  for (let name of TOKEN_TYPES[h]) {    
    let tokenABI = Object.assign({}, TOKEN_ABI);
    tokenABI.name = name
    tokenHolders.push({      
      tokens: {
        pullFromPools: true,
        abi: tokenABI,
      },
      holders: HOLDERS[h],
      checkETHBalance: true,
    });
  }
}

module.exports = {
  /* Project Metadata */
  name: 'Pendle Finance',
  token: null,
  category: 'Derivatives',
  start: 1619495760, // 27-April-2021, 3:56:00 AM +UTC 
  tokenHolderMap: tokenHolders
};
 
