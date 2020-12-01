/*==================================================
  Modules
==================================================*/

  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const imbtcContract = '0x3212b29e33587a00fb1c83346f5dbfa69a458923';

/*==================================================
  Main
==================================================*/

  async function balance (timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: imbtcContract
      })
    ).output;

    return { [imbtcContract]: btcTotalSupply };
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
