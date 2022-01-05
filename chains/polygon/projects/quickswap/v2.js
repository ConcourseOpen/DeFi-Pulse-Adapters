/*==================================================
  Modules
  ==================================================*/
const sdk = require('../../../../sdk');
const assert = require('assert');
const factoryAbi = require('./abis/factory.json');
const token0 = require('./abis/token0.json');
const token1 = require('./abis/token1.json');
const BigNumber = require('bignumber.js');
const getReserves = require('./abis/getReserves.json');
/*==================================================
  Settings
  ==================================================*/
const START_BLOCK = 4931780;
const FACTORY = '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32';

/*==================================================
  TVL
  ==================================================*/
  async function requery(results, block, abi, times = 2){
    for(let i=0; i<times; i++){
      await requeryOnce(results, block, abi)
    }
  }

  async function requeryOnce(results, block, abi){
    if(results.some(r=>!r.success)){
      const failed = results.map((r,i)=>[r,i]).filter(r=>!r[0].success);
      const newResults = await sdk.api.abi
      .multiCall({
        abi,
        chain: 'polygon',
        calls: failed.map((f) => f[0].input),
        block,
      }).then(({ output }) => output);
      failed.forEach((f, i)=>{
        results[f[1]] = newResults[i]
      })
    }
  }

module.exports = async function tvl(_, block) {
  let pairAddresses;

  const pairLength = (await sdk.api.abi.call({
    target: FACTORY,
    abi: factoryAbi.allPairsLength,
    chain: 'polygon',
    block
  })).output
  if(pairLength === null){
    throw new Error("allPairsLength() failed")
  }
  const pairNums = Array.from(Array(Number(pairLength)).keys());
  const pools = (await sdk.api.abi.multiCall({
    abi: factoryAbi.allPairs,
    chain: 'polygon',
    calls: pairNums.map(num => ({
      target: FACTORY,
      params: [num]
    })),
    block
  })).output
  await requery(pools, block, factoryAbi.allPairs);
  pairAddresses = pools.map(result => result.output.toLowerCase())


  const [token0Addresses, token1Addresses, reserves] = await Promise.all([
    sdk.api.abi
      .multiCall({
        abi: token0,
        chain: 'polygon',
        calls: pairAddresses.map((pairAddress) => ({
          target: pairAddress,
        })),
        block,
      })
      .then(({ output }) => output),
    sdk.api.abi
      .multiCall({
        abi: token1,
        chain: 'polygon',
        calls: pairAddresses.map((pairAddress) => ({
          target: pairAddress,
        })),
        block,
      })
      .then(({ output }) => output),
    sdk.api.abi
      .multiCall({
        abi: getReserves,
        chain: 'polygon',
        calls: pairAddresses.map((pairAddress) => ({
          target: pairAddress,
        })),
        block,
      }).then(({ output }) => output),
  ]);
  await requery(token0Addresses, block, token0);
  await requery(token1Addresses, block, token1);
  await requery(reserves, block, getReserves);

  const pairs = {};
  // add token0Addresses
  token0Addresses.forEach((token0Address) => {
    const tokenAddress = token0Address.output.toLowerCase();

    const pairAddress = token0Address.input.target.toLowerCase();
    pairs[pairAddress] = {
      token0Address: tokenAddress,
    }
  });

  // add token1Addresses
  token1Addresses.forEach((token1Address) => {
    const tokenAddress = token1Address.output.toLowerCase();
    const pairAddress = token1Address.input.target.toLowerCase();
    pairs[pairAddress] = {
      ...(pairs[pairAddress] || {}),
      token1Address: tokenAddress,
    }
  });

  const balances = reserves.reduce((accumulator, reserve, i) => {
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

    return accumulator
  }, {})

  return balances;
};
