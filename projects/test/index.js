const BigNumber = require('bignumber.js')

const sdk = require('../../sdk')
const token0 = require('./abis/token0.json')
const token1 = require('./abis/token1.json')
const getReserves = require('./abis/getReserves.json')

// const START_BLOCK = 586851
// for testing we can use a smaller range
const START_BLOCK = 6548398
const FACTORY = '0xbcfccbde45ce874adcb698cc183debcf17952812'
const CAKE = '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82'

/* For SDK Testing */
async function tvl(_, block) {
  console.log(
    'bep20',
    (await sdk.bsc.api.bep20.info(CAKE)).output,
    (await sdk.bsc.api.bep20.symbol(CAKE)).output,
    (await sdk.bsc.api.bep20.decimals(CAKE)).output,
    (await sdk.bsc.api.bep20.totalSupply({ target: CAKE })).output,
    (await sdk.bsc.api.bep20.balanceOf({ target: CAKE, owner: FACTORY })).output
  )

  console.log(
    'bnb',
    (await sdk.bsc.api.bnb.getBalance({ target: CAKE })).output,
    (await sdk.bsc.api.bnb.getBalances({ targets: [CAKE, FACTORY] })).output
  )

  console.log(
    'util',
    (
      await sdk.bsc.api.util.getLogs({
        target: CAKE,
        fromBlock: 6578300,
        toBlock: 6578315,
        topic: 'Transfer(from,to,value)'
      })
    ).output,
    await sdk.bsc.api.util.tokenList(),
    (
      await sdk.bsc.api.util.toSymbols({
        '0x2170ed0880ac9a755fd29b2688956bd959f933f8': 123456
      })
    ).output
  )
  /* For SDK Testing */

  const supportedTokens = await sdk.bsc.api.util
    .tokenList()
    .then(supportedTokens => supportedTokens.map(({ contract }) => contract))

  const logs = (
    await sdk.bsc.api.util.getLogs({
      keys: [],
      toBlock: block,
      target: FACTORY,
      fromBlock: START_BLOCK,
      topic: 'PairCreated(address,address,address,uint256)'
    })
  ).output

  const pairAddresses = logs
    // sometimes the full log is emitted
    .map(log =>
      typeof log === 'string' ? log : `0x${log.data.slice(64 - 40 + 2, 64 + 2)}`
    )
    // lowercase
    .map(pairAddress => pairAddress.toLowerCase())

  const [token0Addresses, token1Addresses] = await Promise.all([
    sdk.bsc.api.abi
      .multiCall({
        abi: token0,
        calls: pairAddresses.map(pairAddress => ({
          target: pairAddress
        })),
        block
      })
      .then(({ output }) => output),
    sdk.bsc.api.abi
      .multiCall({
        abi: token1,
        calls: pairAddresses.map(pairAddress => ({
          target: pairAddress
        })),
        block
      })
      .then(({ output }) => output)
  ])

  console.log('got addrs', token0Addresses, token1Addresses)

  const pairs = {}
  // add token0Addresses
  token0Addresses.forEach(token0Address => {
    if (token0Address.success) {
      const tokenAddress = token0Address.output.toLowerCase()

      if (supportedTokens.includes(tokenAddress)) {
        const pairAddress = token0Address.input.target.toLowerCase()
        pairs[pairAddress] = {
          token0Address: tokenAddress
        }
      }
    }
  })

  // add token1Addresses
  token1Addresses.forEach(token1Address => {
    if (token1Address.success) {
      const tokenAddress = token1Address.output.toLowerCase()
      if (supportedTokens.includes(tokenAddress)) {
        const pairAddress = token1Address.input.target.toLowerCase()
        pairs[pairAddress] = {
          ...(pairs[pairAddress] || {}),
          token1Address: tokenAddress
        }
      }
    }
  })

  const reserves = (
    await sdk.bsc.api.abi.multiCall({
      abi: getReserves,
      calls: Object.keys(pairs).map(pairAddress => ({
        target: pairAddress
      })),
      block
    })
  ).output

  return reserves.reduce((accumulator, reserve, i) => {
    if (reserve.success) {
      const pairAddress = reserve.input.target.toLowerCase()
      const pair = pairs[pairAddress] || {}

      // handle reserve0
      if (pair.token0Address) {
        const reserve0 = new BigNumber(reserve.output['0'])
        if (!reserve0.isZero()) {
          const existingBalance = new BigNumber(
            accumulator[pair.token0Address] || '0'
          )

          accumulator[pair.token0Address] = existingBalance
            .plus(reserve0)
            .toFixed()
        }
      }

      // handle reserve1
      if (pair.token1Address) {
        const reserve1 = new BigNumber(reserve.output['1'])

        if (!reserve1.isZero()) {
          const existingBalance = new BigNumber(
            accumulator[pair.token1Address] || '0'
          )

          accumulator[pair.token1Address] = existingBalance
            .plus(reserve1)
            .toFixed()
        }
      }
    }

    return accumulator
  }, {})
}

module.exports = {
  name: 'Test',
  token: 'TEST',
  category: 'dexes',
  start: 1541116800, // 11/02/2018 @ 12:00am (UTC)
  tvl
}
