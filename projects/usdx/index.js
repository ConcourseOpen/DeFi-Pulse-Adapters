/*==================================================
  Modules
  ==================================================*/
  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const asset = "0xeb269732ab75A6fD61Ea60b06fE994cD32a83549" // USDx

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {
    let balance = {};

    let totalSupplyResult = await sdk.api.erc20.totalSupply({
      target: asset,
    });

    balance[asset] = BigNumber(totalSupplyResult.output);

    return (await sdk.api.util.toSymbols(balance)).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'USDx',
    token: 'USDx',
    category: 'Assets',
    start: 1563991581, // Jul-25-2019 02:06:21 AM +UTC
    run
  }
