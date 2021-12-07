/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const ibbtcTokenContract = '0xc4e15973e6ff2a35cc804c2cf9d2a1b817a8b40f';

/*==================================================
  TVL
  ==================================================*/

  async function balance(timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: ibbtcTokenContract
      })
    ).output;

    return (await sdk.api.util.toSymbols({ [ibbtcTokenContract]: btcTotalSupply })).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Interest Bearing Bitcoin',
    symbol: 'ibBTC',
    type: 'hybrid',
    start: 1619899623,
    balance,
  };
