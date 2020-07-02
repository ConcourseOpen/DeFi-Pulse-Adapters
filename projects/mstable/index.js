/*==================================================
  Modules
==================================================*/

const sdk = require('../../sdk');

/*==================================================
Settings
==================================================*/

const mUSD = '0xe2f2a5C287993345a840Db3B0845fbC70f5935a5';

/*==================================================
Main
==================================================*/

async function tvl(timestamp, block) {
  const totalSupply = (await sdk.api.erc20.totalSupply({
    target: mUSD,
    block
  })).output;

  return { [mUSD]: totalSupply };
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'mStable',
  token: null, // TODO - Add $MTA after launch
  category: 'assets',
  start: 1590624000, // May-28-2020 00:00:00
  tvl
}
