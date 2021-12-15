/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const mbtcContract = '0x945facb997494cc2570096c74b5f66a3507330a1';

/*==================================================
  TVL
  ==================================================*/

  async function balance(timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: mbtcContract
      })
    ).output;

    return (await sdk.api.util.toSymbols({ [mbtcContract]: btcTotalSupply })).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'mStable BTC',
    symbol: 'mBTC',
    type: 'hybrid',
    start: 1613246414,
    balance,
  };
