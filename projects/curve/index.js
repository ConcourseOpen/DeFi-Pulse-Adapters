/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const sdk = require('../../sdk');

/*==================================================
  Settings
==================================================*/

  let tokens = [
    '0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2',
    '0x9fC689CCaDa600B6DF723D9E47D84d76664a1F23',
    '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
    '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B',
    '0xC25a3A3b969415c80451098fa907EC722572917F',
  ];

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    let totalSupplyResults = (await sdk.api.abi.multiCall({
      block,
      abi: 'erc20:totalSupply',
      calls: _.map(tokens, token => ({ target: token })),
    })).output;

    _.forEach(totalSupplyResults, result => { balances[result.input.target] = result.output; });

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Curve',
    token: null,
    category: 'dexes',
    start: 1582609711,        // 25/02/2020 @ 5.48am UTC
    tvl,
  };
