const BigNumber = require('bignumber.js')

const sdk = require('../../sdk')
const token0 = require('./abis/token0.json')
const token1 = require('./abis/token1.json')
const getReserves = require('./abis/getReserves.json')

const START_BLOCK = 10000835
const FACTORY = '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'

module.exports = async function tvl(_, block) {
  const pairAddresses = await sdk.api.util
    .getLogs({
      keys: [],
      toBlock: block,
      target: FACTORY,
      fromBlock: START_BLOCK,
      topic: 'PairCreated(address,address,address,uint256)',
    })
    .then(({ output }) => output)

  const [token0Addresses, token1Addresses] = await Promise.all([
    sdk.api.abi
      .multiCall({
        abi: token0,
        calls: pairAddresses.map((pairAddress) => ({
          target: pairAddress,
        })),
        block,
      })
      .then(({ output }) => output),
    sdk.api.abi
      .multiCall({
        abi: token1,
        calls: pairAddresses.map((pairAddress) => ({
          target: pairAddress,
        })),
        block,
      })
      .then(({ output }) => output),
  ])

  const pairs = pairAddresses.reduce((accumulator, pairAddress, i) => {
    if (token0Addresses[i].success && token1Addresses[i].success) {
      const token0Address = token0Addresses[i].output
      const token1Address = token1Addresses[i].output

      return accumulator.concat({
        pairAddress,
        token0Address,
        token1Address,
      })
    }
    return accumulator
  }, [])

  const reserves = await sdk.api.abi
    .multiCall({
      abi: getReserves,
      calls: pairs.map(({ pairAddress }) => ({
        target: pairAddress,
      })),
      block,
    })
    .then(({ output }) => output)

  return reserves.reduce((accumulator, reserve, i) => {
    if (reserve.success) {
      const pair = pairs[i]
      // handle reserve0
      const reserve0 = new BigNumber(reserve.output[0])
      if (!reserve0.isZero()) {
        accumulator[pair.token0Address] = (accumulator[pair.token0Address] ===
        undefined
          ? reserve0
          : reserve0.plus(new BigNumber(accumulator[pair.token0Address]))
        ).toFixed()
      }
      // handle reserve1
      const reserve1 = new BigNumber(reserve.output[1])
      if (!reserve1.isZero()) {
        accumulator[pair.token1Address] = (accumulator[pair.token1Address] ===
        undefined
          ? reserve1
          : reserve1.plus(new BigNumber(accumulator[pair.token1Address]))
        ).toFixed()
      }
    }
    return accumulator
  }, {})
}
