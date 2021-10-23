const sdk = require('../../sdk')

const { EXPIRATION_START_FROM } = require('./constants.js')
const { getOptions } = require('./subgraph.js')

async function getOptionAddresses (network) {
  const options = await getOptions(network, EXPIRATION_START_FROM)

  return options
    .filter(option => option && option.address)
    .map(option => option.address)
}

async function getPoolAddresses (network) {
  const options = await getOptions(network, EXPIRATION_START_FROM)

  return options
    .filter(option => option && option.pool && option.pool.address)
    .map(option => option.pool.address)
}

async function getTokenAddresses (network) {
  const options = await getOptions(network, EXPIRATION_START_FROM)
  return options
    .filter(option => option && option.underlyingAsset && option.strikeAsset)
    .map(option => [option.strikeAsset, option.underlyingAsset])
    .reduce((prev, curr) => prev.concat(curr), [])
    .filter((value, index, array) => array.lastIndexOf(value) === index)
}

async function getTVL (network, block) {
  const balances = {}
  const options = await getOptions(network, EXPIRATION_START_FROM)

  const collateralInOptions = await sdk.api.abi.multiCall({
    abi: 'erc20:balanceOf',
    block,
    calls: options
      .filter(
        option =>
          option &&
          option.strikeAsset &&
          option.underlyingAsset &&
          option.address
      )
      .map(option => [
        {
          target: option.strikeAsset,
          params: [option.address]
        },
        {
          target: option.underlyingAsset,
          params: [option.address]
        }
      ])
      .reduce((prev, curr) => prev.concat(curr), [])
  })

  const stablesInPools = await sdk.api.abi.multiCall({
    abi: 'erc20:balanceOf',
    block,
    calls: options
      .filter(option => option && option.pool && option.pool.address)
      .map(option => ({
        target: option.pool.tokenB,
        params: [option.pool.address]
      }))
  })

  const transform = address => `${network.name}:${address}`

  sdk.util.sumMultiBalanceOf(balances, collateralInOptions, true, transform)
  sdk.util.sumMultiBalanceOf(balances, stablesInPools, true, transform)
  return balances
}

module.exports = {
  getTVL,
  getOptionAddresses,
  getPoolAddresses,
  getTokenAddresses
}
