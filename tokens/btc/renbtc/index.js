/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../sdk');
  const moment = require('moment');
  let now = moment();
  now = now.add(-257, 'days').unix();

/*==================================================
  Settings
==================================================*/

  const renbtcTokenContract = '0xeb4c2781e4eba804ce9a9803c67d0893436bb27d';

/*==================================================
  TVL
  ==================================================*/

  async function balance(timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: renbtcTokenContract
      })
    ).output;

    return { [renbtcTokenContract]: btcTotalSupply };
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'renBTC',
    symbol: 'RENBTC',
    type: 'hybrid',
    start: 1585154848,
    balance,
  };
