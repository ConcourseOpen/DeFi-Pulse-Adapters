/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const acbtcTokenContract = '0xeF6e45af9a422c5469928F927ca04ed332322e2e';

/*==================================================
  TVL
  ==================================================*/

  async function balance(timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: acbtcTokenContract
      })
    ).output;

    return { [acbtcTokenContract]: btcTotalSupply };
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'ACoconut BTC',
    symbol: 'acBTC',
    type: 'custodial',
    start: 1603380835,  // Oct-22-2020 03:33:55 PM +UTC
    balance,
  };
