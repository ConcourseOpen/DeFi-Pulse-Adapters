/*==================================================
  Modules
  ==================================================*/
const BigNumber = require('bignumber.js');
const sdk = require('../../sdk');
const token0 = require('./abis/token0.json');
const token1 = require('./abis/token1.json');
const getReserves = require('./abis/getReserves.json');


/*==================================================
  Settings
  ==================================================*/
const START_BLOCK = 4931780;
const FACTORY = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32';

/*==================================================
  TVL
  ==================================================*/
module.exports = async function tvl(_, block) {
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
        topic: 'PairCreated(address,address,address,uint256)',
        chain: 'polygon'
      })
  ).output;

  const pairAddresses = (
    logs
      .map((log) =>         // sometimes the full log is emitted
        typeof log === 'string' ? log.toLowerCase() : `0x${log.data.slice(64 - 40 + 2, 64 + 2)}`.toLowerCase()
      )
  );

  const [token0Addresses, token1Addresses] = await Promise.all([
    (
      await sdk
        .api
        .abi
        .multiCall({
          abi: token0,
          calls: pairAddresses.map((pairAddress) => ({
            target: pairAddress,
          })),
          block,
          chain: 'polygon'
        })
    ).output,
    (
      await sdk
        .api
        .abi
        .multiCall({
          abi: token1,
          calls: pairAddresses.map((pairAddress) => ({
            target: pairAddress,
          })),
          block,
          chain: 'polygon'
        })
    ).output,
  ]);

  const pairs = {};
  // add token0Addresses
  token0Addresses.forEach((token0Address) => {
    if (token0Address.success) {
      const tokenAddress = token0Address.output.toLowerCase();

      if (supportedTokens.includes(tokenAddress)) {
        const pairAddress = token0Address.input.target.toLowerCase();
        pairs[pairAddress] = {
          token0Address: tokenAddress,
        }
      }
    }
  });

  // add token1Addresses
  token1Addresses.forEach((token1Address) => {
    if (token1Address.success) {
      const tokenAddress = token1Address.output.toLowerCase();
      if (supportedTokens.includes(tokenAddress)) {
        const pairAddress = token1Address.input.target.toLowerCase();
        pairs[pairAddress] = {
          ...(pairs[pairAddress] || {}),
          token1Address: tokenAddress,
        }
      }
    }
  });

  const reserves = (
    await sdk
      .api
      .abi
      .multiCall({
        abi: getReserves,
        calls: Object.keys(pairs).map((pairAddress) => ({
          target: pairAddress,
        })),
        block,
        chain: 'polygon'
      })
  ).output;

  return reserves.reduce((accumulator, reserve, i) => {
    if (reserve.success) {
      const pairAddress = reserve.input.target.toLowerCase();
      const pair = pairs[pairAddress] || {};

      // handle reserve0
      if (pair.token0Address) {
        const reserve0 = new BigNumber(reserve.output['0']);
        if (!reserve0.isZero()) {
          const existingBalance = new BigNumber(
            accumulator[pair.token0Address] || '0'
          );

          accumulator[pair.token0Address] = existingBalance
            .plus(reserve0)
            .toFixed()
        }
      }

      // handle reserve1
      if (pair.token1Address) {
        const reserve1 = new BigNumber(reserve.output['1']);

        if (!reserve1.isZero()) {
          const existingBalance = new BigNumber(
            accumulator[pair.token1Address] || '0'
          );

          accumulator[pair.token1Address] = existingBalance
            .plus(reserve1)
            .toFixed()
        }
      }
    }

    return accumulator
  }, {})
};
