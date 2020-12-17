/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const hbtcTokenContract = '0x0316eb71485b0ab14103307bf65a021042c6d380';

/*==================================================
  TVL
  ==================================================*/

  async function balance(timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: hbtcTokenContract
      })
    ).output;

    return { [hbtcTokenContract]: btcTotalSupply };
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Huobi BTC',
    symbol: 'HBTC',
    type: 'custodial',
    start: 1575905983,
    balance,
  };
