const {
  getOptionAddresses,
  getPoolAddresses,
  getTokenAddresses
} = require('../../../../v2/projects/pods/queries')
const { NETWORK_POLYGON } = require('../../../../v2/projects/pods/constants')

module.exports = {
  /* Project Metadata */
  name: 'Pods_Polygon',
  category: 'Derivatives',
  chain: 'polygon',
  website: 'https://pods.finance',
  token: null,
  start: 1627794000,
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
