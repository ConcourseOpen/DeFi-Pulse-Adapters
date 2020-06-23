const BigNumber = require('bignumber.js')

const sdk = require('../../sdk')

const START_BLOCK = 6627917
const FACTORY = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95'

module.exports = async function tvl(_, block) {
  const events = (
    await sdk.api.util.getLogs({
      keys: [],
      toBlock: block,
      target: FACTORY,
      fromBlock: START_BLOCK,
      topic: 'NewExchange(address,address)',
    })
  ).output

  const allExchanges = []
  events.forEach((event) => {
    allExchanges.push({
      tokenAddress: `0x${event.topics[1].substring(26)}`,
      exchangeAddress: `0x${event.topics[2].substring(26)}`,
    })
  })

  const balances = (
    await sdk.api.abi.multiCall({
      abi: 'erc20:balanceOf',
      calls: allExchanges.map(({ tokenAddress, exchangeAddress }) => ({
        target: tokenAddress,
        params: exchangeAddress,
      })),
      block,
    })
  ).output

  return balances.reduce((accumulator, balance) => {
    if (accumulator[balance.input.target] !== undefined) {
      throw Error(`Duplicate token address: ${balance.input.target}`)
    }
    if (balance.success && !new BigNumber(balance.output).isZero()) {
      accumulator[balance.input.target] = balance.output
    }
    return accumulator
  }, {})
}
