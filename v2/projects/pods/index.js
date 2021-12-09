const {
  getOptionAddresses,
  getPoolAddresses,
  getTokenAddresses
} = require('./queries')
const { NETWORK_MAINNET } = require('./constants')

module.exports = {
  /* Project Metadata */
  name: 'Pods',
  category: 'Derivatives',
  website: 'https://pods.finance',
  token: null,
  start: 1633410000,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: async () => {
        const result = await getTokenAddresses(NETWORK_MAINNET)
        return result
      },
      holders: async () => {
        const options = await getOptionAddresses(NETWORK_MAINNET)
        const pools = await getPoolAddresses(NETWORK_MAINNET)
        const result = options.concat(pools)
        return result
      },
      checkETHBalance: true
    }
  ]
}
