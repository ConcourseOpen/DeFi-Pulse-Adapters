/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Helper Methods
  ==================================================*/

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
    sumMultiBalanceOf: SumMultiBalanceOf
  }
