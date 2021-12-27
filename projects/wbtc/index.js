/*==================================================
  Modules
==================================================*/

const abi = require('./abi');
const sdk = require('../../sdk');

/*==================================================
  Settings
==================================================*/

const wbtcContract = '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599';

/*==================================================
  Main
==================================================*/

async function tvl (timestamp, block) {
  const totalSupply = (await sdk.api.abi.call({
    block,
    target: wbtcContract,
    abi: abi['totalSupply'],
  })).output;

    return { [wbtcContract]: totalSupply };
  }

/*==================================================
  Exports
==================================================*/

module.exports = {
  name: 'WBTC',
  token: null,
  category: 'Assets',
  start: 1543104000,  // 11/25/2018 @ 12:00am (UTC)
  tvl,
};
