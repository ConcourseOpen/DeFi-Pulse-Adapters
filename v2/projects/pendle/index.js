/*
 * For computing TVL in Pendle Markets
 */
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

/*
 * For computing TVL in Sushi Liquidity Pools
 */
const SUSHI_HOLDERS = [
  '0xb124c4e18a282143d362a066736fd60d22393ef4', // OT-PE-29DEC2022
  '0x72972b21ce425cfd67935e07c68e84300ce3f40f', // OT-ETHUSDC-29DEC2022
  '0x8B758d7fD0fC58FCA8caA5e53AF2c7Da5F5F8De1', // OT-aUSDC-30DEC2021
  '0x0d8a21f2ea15269b7470c347083ee1f85e6a723b', // OT-aUSDC-29DEC2022
  '0x2C80D72af9AB0bb9D98F607C817c6F512dd647e6', // OT-cDAI-30DEC2021
  '0x4556C4488CC16D5e9552cC1a99a529c1392E4fe9', // OT-cDAI-29DEC2022
];
const HOLDERS = [MARKET_HOLDERS, SUSHI_HOLDERS];

/*
 * For computing TVL in Pendle Yield Token Holders, when
 * underlying yield tokens are tokenized
 */
const YIELD_TOKENHOLDERS = [
  '0x1ef8d200e0b4127c5e1183670eab37676fedf579', // aUSDC-30DEC2021 PendleAaveV2YieldTokenHolder
  '0x33d3071cfa7404a406edb5826a11620282021745', // aUSDC-29DEC2022 PendleAaveV2YieldTokenHolder
  '0x75db58793f3943d84716fcac1ac3258169e8d319', // cDAI-30DEC2021 PendleCompoundYieldTokenHolder
  '0xb0aa68d8a0d56ae7276ab9e0e017965a67320c60', // cDAI-29DEC2022 PendleCompoundYieldTokenHolder
];
const TOKENHOLDER_TOKENS = [
  '0xBcca60bB61934080951369a648Fb03DF4F96263C', // aUSDC
  '0x4da27a545c0c5B758a6BA100e3a049001de870f5', // stkAave
  '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // cDAI
  '0xc00e94Cb662C3520282E6f5717214004A7f26888', // COMP
];

/*
 * For computing TVL in PENDLE single staking
 */
const PENDLE_SINGLE_STAKING = ['0x07282F2CEEbD7a65451Fcd268b364300D9e6D7f5']; // PendleSingleStaking
const PENDLE_TOKEN = ['0x808507121b80c02388fad14726482e061b8da827']; // PENDLE

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

tokenHolders.push({
  tokens: TOKENHOLDER_TOKENS,
  holders: YIELD_TOKENHOLDERS,
  checkETHBalance: false,
});

tokenHolders.push({
  tokens: PENDLE_SINGLE_STAKING,
  holders: PENDLE_TOKEN,
  checkETHBalance: false,
});

module.exports = {
  /* Project Metadata */
  name: 'Pendle Finance',
  token: null,
  category: 'Derivatives',
  start: 1619495760, // 27-April-2021, 3:56:00 AM +UTC 
  tokenHolderMap: tokenHolders
};
 
