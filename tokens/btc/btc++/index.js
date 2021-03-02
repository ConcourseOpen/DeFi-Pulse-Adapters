/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const btcPlusPlusTokenContract = '0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd';

/*==================================================
  TVL
  ==================================================*/

  async function balance(timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: btcPlusPlusTokenContract
      })
    ).output;

    return { [btcPlusPlusTokenContract]: btcTotalSupply };
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'PieDAO BTC++',
    symbol: 'BTC++',
    type: 'hybrid',
    start: 1585916707,
    balance,
  };
