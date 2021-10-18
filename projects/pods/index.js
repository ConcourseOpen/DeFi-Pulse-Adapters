const { NETWORK_MAINNET, EXPIRATION_START_FROM } = require('./constants.js')
const { getTVL } = require('./queries.js')

async function getEthereumTVL (block) {
  return getTVL(NETWORK_MAINNET, block)
}

async function tvl (timestamp, block) {
  return getEthereumTVL(block)
}

module.exports = {
  name: 'Pods',
  category: 'Derivatives',
  token: null,
  start: EXPIRATION_START_FROM, // 09/04/2020 @ 10:10:39am (UTC)
  tvl
}
