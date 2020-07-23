/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');

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
    const balances = {};

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
        const balance = balanceOf.output;
        const address = balanceOf.input.target;

        balances[address] = balance;
      }
    });

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'xDai',
    token: null,
    category: 'payments',
    start: 1539028166,
    tvl
  };