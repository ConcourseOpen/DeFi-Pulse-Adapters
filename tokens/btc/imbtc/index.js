/*==================================================
  Modules
==================================================*/

  const abi = require('./abi');
  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const wbtcContract = '0x3212b29E33587A00FB1C83346f5dBFA69A458923';

/*==================================================
  Main
==================================================*/

  async function balance (timestamp, block) {
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
    name: 'The Tokenized Bitcoin',
    symbol: 'imBTC',
    type: 'custodial',
    start: 1574524800,  // 12-25-2019 15:40:40 PM +UTC
    balance,
  };
