/*==================================================
  Modules
==================================================*/

  const sdk = require('../../sdk');
  const BigNumber = require('bignumber.js');
  const _ = require('underscore');
  const abi = require('./abi');

/*==================================================
  Main
==================================================*/

  async function tvl (timestamp, block) {
    const balances = {};

    /* pull kyber market addresses */
    const reserveAddresses = (await sdk.api.abi.call({
      target: abi['storageAddress'], //cuz now reserves will be recorded on the storage contract
      abi: abi['getReserves'],
      block
    })).output;

    const kyberTokens = (await sdk.api.util.kyberTokens()).output;

    let balanceOfCalls = [];
    _.forEach(reserveAddresses, (reserveAddress) => {
      balanceOfCalls = [
        ...balanceOfCalls,
        ..._.map(kyberTokens, (data, address) => ({
          target: reserveAddress,
          params: address
        }))
      ];
    });

    const balanceOfResult = await sdk.api.abi.multiCall({
      block,
      calls: balanceOfCalls,
      abi: abi['getBalance'],
    });

    /* combine token volumes on multiple markets */
    _.forEach(balanceOfResult.output, (result) => {
      let balance = new BigNumber(result.output || 0);
      if (balance <= 0) return;

      let asset = result.input.params[0];
      let total = balances[asset];

      if (total) {
        balances[asset] = balance.plus(total).toFixed();
      } else {
        balances[asset] = balance.toFixed();
      }
    });

    return balances;
  }

/*==================================================
  Exports
==================================================*/

  module.exports = {
    name: 'Kyber',
    token: 'KNC',
    category: 'DEXes',
    start: 1594003275,  // Jul-06-2020 02:41:15 AM +UTC
    tvl,
  };
