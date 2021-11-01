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
 * For computing TVL in Pendle Yield Token Holders, when
 * underlying yield tokens are tokenized
 */
const YIELD_TOKENHOLDERS = [
  '0x1ef8d200e0b4127c5e1183670eab37676fedf579', // aUSDC-30DEC2021 PendleAaveV2YieldTokenHolder
  '0x33d3071cfa7404a406edb5826a11620282021745', // aUSDC-29DEC2022 PendleAaveV2YieldTokenHolder
  '0x75db58793f3943d84716fcac1ac3258169e8d319', // cDAI-30DEC2021 PendleCompoundYieldTokenHolder
  '0xb0aa68d8a0d56ae7276ab9e0e017965a67320c60', // cDAI-29DEC2022 PendleCompoundYieldTokenHolder
  '0xbFD6b497dCa3e5D1fA4BbD52996d400980C29Eb7', // SushiSwapSimple SLP-29DEC2022 PendlSushiYieldTokenHolder
  '0xa06634be609153b77355bfd09f9d59345939c59b', // SushiSwapComplex SLP-29DEC2022 PendlSushiYieldTokenHolder
];
const TOKENHOLDER_TOKENS = [
  '0xBcca60bB61934080951369a648Fb03DF4F96263C', // aUSDC
  '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // cDAI
  '0x6B3595068778DD592e39A122f4f5a5cF09C90fE2', // SUSHI
  '0x37922C69b08BABcCEaE735A31235c81f1d1e8E43', // SushiSwap PENDLE/ETH LP (SLP)
];

const PENDLE_TOKEN_TYPE = ['token', 'xyt'];

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

for (let name of PENDLE_TOKEN_TYPE) {    
  let tokenABI = Object.assign({}, TOKEN_ABI);
  tokenABI.name = name
  tokenHolders.push({      
    tokens: {
      pullFromPools: true,
      abi: tokenABI,
    },
    holders: MARKET_HOLDERS,
    checkETHBalance: true,
  });
}

tokenHolders.push({
  tokens: TOKENHOLDER_TOKENS,
  holders: YIELD_TOKENHOLDERS,
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
