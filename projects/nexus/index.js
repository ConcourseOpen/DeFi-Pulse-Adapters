/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const tokenAddresses = [
    '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359', // SAI
  ];

  const poolAddress = '0xfd61352232157815cf7b71045557192bf0ce1884'

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {
    let getBalance = await sdk.api.eth.getBalance({target: poolAddress, block});

    let balances = {
      '0x0000000000000000000000000000000000000000': getBalance.output
    };

    let calls = _.map(tokenAddresses, (tokenAddress) => {
      return {
        target: tokenAddress,
        params: poolAddress
      }
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

    let symbolBalances = await sdk.api.util.toSymbols(balances);

    return symbolBalances.output;
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
