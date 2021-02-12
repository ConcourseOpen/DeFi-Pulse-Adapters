/*==================================================
  Modules
  ==================================================*/

  const TVLV1 = require('./v1');
  const sdk = require('../../sdk');

  const BigNumber = require('bignumber.js');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const v1 = await TVLV1(timestamp, block);

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

    return (await sdk.api.util.toSymbols(balances)).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'dextf',
    website: "https://dextf.com",
    token: "DEXTF",
    category: 'Assets',
    start: 1595853825,  // 27/07/2020 @ 12:43:45am (UTC)
    tvl
  }
