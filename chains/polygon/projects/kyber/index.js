
const sdk = require('../../../../sdk');

const START_BLOCK = 15968294;
const FACTORY = '0x5f1fe642060b5b9658c15721ea22e982643c095c';

async function tvl(timestamp, block) {
  let supportedTokens = await (
    sdk
      .api
      .util
      .supportedTokens()
      .then((supportedTokens) => supportedTokens.map((token) => {
        if (token.platforms && token.platforms['polygon-pos']) {
          return token.platforms['polygon-pos'];
        }
      }))
  );
  supportedTokens = supportedTokens.filter(token => token)

  const logs = (
    await sdk.api.util
      .getLogs({
        keys: [],
        toBlock: block,
        target: FACTORY,
        fromBlock: START_BLOCK,
        topic: 'PoolCreated(address,address,address,uint32,uint256)',
        chain: 'polygon'
      })
  ).output;

  let pairAddresses = []
  const token0Addresses = []
  const token1Addresses = []
  for (let log of logs) {
    token0Addresses.push(`0x${log.topics[1].substr(-40)}`.toLowerCase())
    token1Addresses.push(`0x${log.topics[2].substr(-40)}`.toLowerCase())
  }

  pairAddresses = (logs.map((log) =>         // sometimes the full log is emitted
    typeof log === 'string' ? log.toLowerCase() : `0x${log.data.slice(64 - 40 + 2, 64 + 2)}`.toLowerCase()));


  const pairs = {}
  // add token0Addresses
  token0Addresses.forEach((token0Address, i) => {
    if (supportedTokens.includes(token0Address)) {
      const pairAddress = pairAddresses[i]
      pairs[pairAddress] = {
        token0Address: token0Address,
      }
    }
  })

  // add token1Addresses
  token1Addresses.forEach((token1Address, i) => {
    if (supportedTokens.includes(token1Address)) {
      const pairAddress = pairAddresses[i]
      pairs[pairAddress] = {
        ...(pairs[pairAddress] || {}),
        token1Address: token1Address,
      }
    }
  })

  let balanceCalls = []

  for (let pair of Object.keys(pairs)) {
    if (pairs[pair].token0Address) {
      balanceCalls.push({
        target: pairs[pair].token0Address,
        params: pair,
      })
    }

    if (pairs[pair].token1Address) {
      balanceCalls.push({
        target: pairs[pair].token1Address,
        params: pair,
      })
    }
  }

  const tokenBalances = (
    await sdk.api.abi.multiCall({
      abi: 'erc20:balanceOf',
      calls: balanceCalls,
      block,
      chain: 'polygon'
    })
  )

  let balances = {};

  sdk.util.sumMultiBalanceOf(balances, tokenBalances)

  return balances;
}


module.exports = {
    /* Project Metadata */
    name: 'Kyber_Polygon',
    chain: 'polygon',
    token: null,
    category: 'DEXes',
    start: 1622961237, // @6-Jun-2021, 6:33:57 AM+UTC
    /*fetching token balances */
    tvl
  };
