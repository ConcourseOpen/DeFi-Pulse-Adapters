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
  category: 'derivatives',
  token: null,
  start: EXPIRATION_START_FROM,
  tvl
}
