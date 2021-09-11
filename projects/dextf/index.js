/*==================================================
  Modules
  ==================================================*/

  const TVLV1 = require('./v1');
  const TVLV2 = require('./v2');
  const TVLV2_STAKING = require('./v2-staking');

  const BigNumber = require('bignumber.js');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const [v1, v2, v2Staking] = await Promise.all([
      TVLV1(timestamp, block), TVLV2(timestamp, block), TVLV2_STAKING(timestamp, block)]);

    const tokenAddresses = new Set(Object.keys(v1).concat(Object.keys(v2)).concat(Object.keys(v2Staking)));

    const balances = (
      Array
        .from(tokenAddresses)
        .reduce((accumulator, tokenAddress) => {
          const v1Balance = new BigNumber(v1[tokenAddress] || '0');
          const v2Balance = new BigNumber(v2[tokenAddress] || '0');
          const v2StakingBalance = new BigNumber(v2Staking[tokenAddress] || '0');
          accumulator[tokenAddress] = v1Balance.plus(v2Balance).plus(v2StakingBalance).toFixed();

          return accumulator
        }, {})
    );

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'dextf',
    website: "https://dextf.com",
    token: "DEXTF",
    category: 'assets',
    start: 1595853825,  // 27/07/2020 @ 12:43:45am (UTC)
    tvl
  }
