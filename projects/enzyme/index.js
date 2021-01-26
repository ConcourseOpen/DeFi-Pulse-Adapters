const v1TVL = require('./v1');
const v2TVL = require('./v2');
const sdk = require('../../sdk');
const BigNumber = require('bignumber.js')


async function tvl(timestamp, block) {
  const [v1, v2] = await Promise.all([v1TVL(timestamp, block), v2TVL(timestamp, block)]);

  const tokenAddresses = new Set(Object.keys(v1).concat(Object.keys(v2)));

  const balances = (
    Array
      .from(tokenAddresses)
      .reduce((accumulator, tokenAddress) => {
        const v1Balance = new BigNumber(v1[tokenAddress] || '0');
        const v2Balance = new BigNumber(v2[tokenAddress] || '0');
        accumulator[tokenAddress] = v1Balance.plus(v2Balance).toFixed();

        return accumulator
      }, {})
  );

  return (await sdk.api.util.toSymbols(balances)).output;
}

module.exports = {
  name: "Enzyme Finance",
  token: "MLN",
  category: "Assets",
  start: 1551398400, // 03/01/2019 @ 12:00am (UTC)
  tvl
};
