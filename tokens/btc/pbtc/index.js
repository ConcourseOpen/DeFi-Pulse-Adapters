/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const pbtcTokenContract = '0x5228a22e72ccC52d415EcFd199F99D0665E7733b';

/*==================================================
  TVL
  ==================================================*/

  async function balance(timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: pbtcTokenContract
      })
    ).output;

    return { [pbtcTokenContract]: btcTotalSupply };
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'pNetwork BTC',
    symbol: 'pBTC',
    type: 'hybrid',
    start: 1583366400,   // 03/05/2020 @ 12:00am (UTC)
    balance,
  };
