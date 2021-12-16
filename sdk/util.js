/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Helper Methods
  ==================================================*/

/**
 *
 * @param {Array} inputArr
 * @param {Number} chuckSize
 * @returns {*}
 */
const splitArrIntoChunks = (inputArr, chuckSize = 100) => {
  const chunkArr = [];

  while (inputArr.length) {
    chunkArr.push(inputArr.splice(0, chuckSize));
  }

  return chunkArr;
};

  function Sum(balanceArray) {
    let balances = {};

    _.each(balanceArray, (balanceEntries) => {
      _.each(balanceEntries, (balance, address) => {
        balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
      })
    });

    return balances;
  }

  function SumMultiBalanceOf(balances, results) {
    _.each(results.output, (result) => {
      if(result.success) {
        let address = result.input.target;
        let balance = result.output;

        if (BigNumber(balance).toNumber() <= 0) {
          return;
        }

        balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
      }
    });
  }

/*==================================================
  Exportsd
  ==================================================*/

  module.exports = {
    sum: Sum,
    splitArrIntoChunks,
    sumMultiBalanceOf: SumMultiBalanceOf
  }
