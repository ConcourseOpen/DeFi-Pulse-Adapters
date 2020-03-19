/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const pools = [
    '0xfd61352232157815cf7b71045557192bf0ce1884',  // currency assets
    '0x7cbe5682be6b648cc1100c76d4f6c96997f753d6'   // investment assets
  ];

  const tokensAddresses = [
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359', // SAI
  ]

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {
    let balances = {};

    let calls = [];

    _.each(pools, (pool) => {
      _.each(tokensAddresses, (tokenAddress) => {
        calls.push({
          target: tokenAddress,
          params: pool
        })
      });
    });

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    _.each(balanceOfResults.output, (balanceOf) => {
      if(balanceOf.success) {
        let address = balanceOf.input.target
        balances[address] = BigNumber(balances[address] || 0).plus(balanceOf.output).toFixed();
      }
    });

    for(let pool of pools) {
      let balance = (await sdk.api.eth.getBalance({target: pool, block})).output;
      balances['0x0000000000000000000000000000000000000000'] = BigNumber(balances['0x0000000000000000000000000000000000000000'] || 0).plus(balance).toFixed();
    }

    return (await sdk.api.util.toSymbols(balances)).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Nexus Mutual',
    token: 'NXM',
    category: 'Derivatives',
    start: 1558569600, // 05/23/2019 @ 12:00am (UTC)
    run
  }
