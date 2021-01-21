const BigNumber = require('bignumber.js');
const sdk = require('../../sdk');
const v1TVL = require('./v1');

const ETH = '0x0000000000000000000000000000000000000000';
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const YFL = '0x28cb7e841ee97947a86B06fA4090C8451f64c0be';
const yYFL = '0x75d1aa733920b14fc74c9f6e6fab7ac1ece8482e';

async function _stakingTvl(block) {
  return (
    await sdk.api.abi.call({
      target: YFL,
      params: yYFL,
      abi: "erc20:balanceOf",
    })
  ).output;
}

async function tvl(timestamp, block) {
  const [v1] = await Promise.all([v1TVL(timestamp, block)]);

  // replace WETH with ETH for v1
  v1[ETH] = v1[WETH];
  delete v1[WETH];

  const tokenAddresses = new Set(Object.keys(v1));

  const balances = (
    Array
      .from(tokenAddresses)
      .reduce((accumulator, tokenAddress) => {
        const v1Balance = new BigNumber(v1[tokenAddress] || '0');
        accumulator[tokenAddress] = v1Balance.toFixed();

        return accumulator
      }, {})
  );
  
  // Governance Staking TVL
  const stakedYFLAmount = await _stakingTvl(block);
  balances[YFL] = balances[YFL] ?
    BigNumber(balances[YFL]).plus(stakedYFLAmount).toFixed() :
    stakedYFLAmount

  return balances;
}

module.exports = {
  name: 'LINKSWAP',
  token: 'YFL',
  category: 'dexes',
  start: 1606392528, // 11/26/2020 @ 12:08:48am (UTC)
  tvl,
};
