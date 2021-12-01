/*==================================================
  Modules
==================================================*/

  const sdk = require('../../sdk');
  const BigNumber = require('bignumber.js');
  const _ = require('underscore');
  const abi = require('./abi');
  const dmm = require('./dmm.js');

/*==================================================
  Main
==================================================*/

  async function tvl (timestamp, block) {
    let balances = {};

    /* pull kyber market addresses */
    const reserve1Addresses = (await sdk.api.abi.call({
      target: abi['networkAddress1'],
      abi: abi['getReserves'],
      block
    })).output;

    const reserve2Addresses =
      block > 9003563
        ? (
            await sdk.api.abi.call({
              target: abi["networkAddress2"],
              abi: abi["getReserves"],
              block,
            })
          ).output
        : [];


    const reserve3Addresses =
    block > 10403228
      ? (
          await sdk.api.abi.call({
            target: abi["StorageAddress"],
            abi: abi["getReserves"],
            block,
          })
        ).output
      : [];
     const reserveAddresses = _.uniq(reserve1Addresses.concat(reserve2Addresses).concat(reserve3Addresses));

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
    if (block > 12178218){
      const dmmTVL = await dmm(timestamp, block);
      

      const tokenAddresses = new Set(Object.keys(balances).concat(Object.keys(dmmTVL)))
      balances = (
        Array
          .from(tokenAddresses)
          .reduce((accumulator, tokenAddress) => {
            const v1Balance = new BigNumber(balances[tokenAddress] || '0');
            const v2Balance = new BigNumber(dmmTVL[tokenAddress] || '0');
            accumulator[tokenAddress] = v1Balance.plus(v2Balance).toFixed();
    
            return accumulator
          }, {})
      );
    }
    //console.log(dmmTVL);
    balances['0x0000000000000000000000000000000000000000'] = balances['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'];
    delete balances['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee'];

    return balances;
  }

/*==================================================
  Exports
==================================================*/

  module.exports = {
    name: 'Kyber',
    token: 'KNC',
    category: 'DEXes',
    start: 1546560000,  // Jul-06-2020 02:41:15 AM +UTC
    tvl,
  };
