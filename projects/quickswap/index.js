/*==================================================
  Modules
  ==================================================*/
const BigNumber = require('bignumber.js');
const sdk = require('../../sdk');
const v2TVL = require('./v2');

/*==================================================
  Settings
  ==================================================*/

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const [v2] = await Promise.all([v2TVL(timestamp, block)]);

  const tokenAddresses = new Set(Object.keys(v2));

  let balances = (
    Array
      .from(tokenAddresses)
      .reduce((accumulator, tokenAddress) => {
        const v2Balance = new BigNumber(v2[tokenAddress] || '0');
        accumulator[tokenAddress] = v2Balance.toFixed();

        return accumulator
      }, {})
  );

  if (Object.keys(balances).length === 0) {
    balances = {
      '0x0000000000000000000000000000000000000000' : 0
    }
  }
  return (await sdk.api.util.toSymbols(balances, 'polygon')).output;
}

module.exports = {
  name: 'Quickswap',
  token: 'QUICK',
  category: 'DEXes',
  start: 1601614800, // 09/04/2020 @ 10:10:39am (UTC)
  tvl,
  chain: 'Polygon'
};
