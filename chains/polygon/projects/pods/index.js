const {
  getOptionAddresses,
  getPoolAddresses,
  getTokenAddresses
} = require('../../../../projects/pods/queries')
const { NETWORK_POLYGON } = require('../../../../projects/pods/constants')

module.exports = {
  /* Project Metadata */
  name: 'Pods',
  category: 'Derivatives',
  chain: 'polygon',
  website: 'https://pods.finance',
  token: null,
  start: 1605000000,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: async () => {
        const result = await getTokenAddresses(NETWORK_POLYGON)
        return result
      },
      holders: async () => {
        const options = await getOptionAddresses(NETWORK_POLYGON)
        const pools = await getPoolAddresses(NETWORK_POLYGON)
        const result = options.concat(pools)
        return result
      },
      checkNativeBalance: true
    }
  ]
}
