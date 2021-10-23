const {
  getOptionAddresses,
  getPoolAddresses,
  getTokenAddresses
} = require('../../../projects/pods/queries')
const { NETWORK_MAINNET } = require('../../../projects/pods/constants')

module.exports = {
  /* Project Metadata */
  name: 'Pods',
  category: 'Derivatives',
  website: 'https://pods.finance',
  token: null,
  start: 1605000000,
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
