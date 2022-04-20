/*==================================================
  Modules
  ==================================================*/
const BigNumber = require('bignumber.js');
const sdk = require('../../sdk');
const TVL = require('./utils');

/*==================================================
  TVL
  ==================================================*/
async function tvl(timestamp, block) {
  const [five, size] = await Promise.all([
    TVL(timestamp, block, 'five'), 
    TVL(timestamp, block, 'size')
  ]);

  const tokenAddresses = new Set(Object.keys(five).concat(Object.keys(size)));

  const balances = (
    Array
    .from(tokenAddresses)
    .reduce((accumulator, tokenAddress) => {
      const fiveBalance = new BigNumber(five[tokenAddress] || '0');
      const sizeBalance = new BigNumber(size[tokenAddress] || '0');
      accumulator[tokenAddress] = fiveBalance.plus(sizeBalance).toFixed();

      return accumulator;
    }, {})
  );

  return balances;
}

/*==================================================
  Exports
  ==================================================*/
module.exports = {
  name: 'Integral',
  token: 'ITGR',
  category: 'dexes',
  start: 1617031800, // 03/29/2021 @ 2:30PM (UTC)
  tvl,
};
