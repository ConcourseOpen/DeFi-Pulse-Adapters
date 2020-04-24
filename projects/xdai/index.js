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
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215'  // CHAI
  ];

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    const balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(tokenAddresses, (address) => ({
        target: address,
        params: '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016'
      })),
      abi: 'erc20:balanceOf'
    });

    _.each(balanceOfResults.output, (balanceOf) => {
      if(balanceOf.success) {
        let balance = balanceOf.output;
        let address = balanceOf.input.target;

        if (BigNumber(balance).toNumber() <= 0) {
          return;
        }

        balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
      }
    });

    const symbolBalances = await sdk.api.util.toSymbols(balances);

    return symbolBalances.output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'xDai',
    token: null,
    category: 'Payments',
    start: 1539028166,
    tvl
  };
