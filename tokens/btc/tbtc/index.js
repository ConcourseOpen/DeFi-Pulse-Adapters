/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const tbtcTokenContract = '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa';

/*==================================================
  TVL
  ==================================================*/

  async function balance(timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: tbtcTokenContract
      })
    ).output;

    return { [tbtcTokenContract]: btcTotalSupply };
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'tBTC',
    symbol: 'TBTC',
    type: 'decentralized',
    start: 1600214400,   // 09/16/2020 @ 12:00am (UTC)
    balance,
  };
