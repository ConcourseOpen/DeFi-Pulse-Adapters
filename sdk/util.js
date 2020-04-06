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

/*==================================================
  Exportsd
  ==================================================*/

  module.exports = {
    sum: Sum
  }
