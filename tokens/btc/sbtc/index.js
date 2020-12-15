/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

  const sbtcTokenContract = '0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6';

/*==================================================
  TVL
  ==================================================*/

  async function balance(timestamp, block) {
    const btcTotalSupply = (
      await sdk.api.erc20.totalSupply({
        block,
        target: sbtcTokenContract
      })
    ).output;

    return { [sbtcTokenContract]: btcTotalSupply };
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'sBTC',
    symbol: 'SBTC',
    type: 'synthetic',
    start: 1569569400,
    balance,
  };
