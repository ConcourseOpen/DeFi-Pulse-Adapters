/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  // currently only works on v2, recent time frame (post MCD transition)
  const addressV2 = '0x498b3BfaBE9F73db90D252bCD4Fa9548Cd0Fd981';

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let wallets = (await sdk.api.util.getLogs({
      target: addressV2,
      topic: 'Created(address,address,address)',
      decodeParameter: 'address',
      fromBlock: 0,
      toBlock: block
    })).output;

    let balances = (await sdk.api.cdp.getAssetsLocked({
      block,
      targets: wallets
    })).output;

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'InstaDApp',
    token: null,
    category: 'lending',
    contributesTo: ['Maker', 'Compound'],
    start: 1543622400,  // 12/01/2018 @ 12:00am (UTC)
    tvl
  }
