/*==================================================
  Modules
  ==================================================*/

const axios = require('axios');

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const result = await axios.get('https://ethapi.wing.finance/eth/governance/tvl');
  return result.data;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Wing Finance (Ethereum)',
  category: 'lending',
  token: 'WING',
  start: 1617717600,
  tvl
}
