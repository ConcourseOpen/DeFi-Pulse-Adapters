const BigNumber = require('bignumber.js')

const v2TVL = require('./v2');

const ETH = '0x0000000000000000000000000000000000000000'.toLowerCase();
const WETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'.toLowerCase();

async function tvl(timestamp, block) {
  const [v2] = await Promise.all([v2TVL(timestamp, block)]);

  // replace WETH with ETH for v2
  v2[ETH] = v2[WETH];
  delete v2[WETH];

  const tokenAddresses = new Set(Object.keys(v1).concat(Object.keys(v2)));

  const balances = (
    Array
      .from(tokenAddresses)
      .reduce((accumulator, tokenAddress) => {
        const v2Balance = new BigNumber(v2[tokenAddress] || '0');
        accumulator[tokenAddress] = v2Balance.toFixed();

        return accumulator
      }, {})
  );

  return balances;
}

module.exports = {
  name: 'SushiSwap',
  token: 'SUSHI',
  category: 'dexes',
  start: 1599214239, // 09/04/2020 @ 10:10:39am (UTC)
  tvl,
};
