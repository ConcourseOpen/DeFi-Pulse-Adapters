/*==================================================
  Modules
==================================================*/
const sdk = require('../../sdk');
const _ = require('underscore');
const BigNumber = require('bignumber.js');
const compoundProviderABI = require('./abis/compound.json');

/*==================================================
  Settings
==================================================*/
const listedTokens = [
  // compound
  {
    async getBalanceCall(block) {
      const {output} = await sdk.api.abi.call({
        abi: compoundProviderABI['balance'],
        target: '0xDAA037F99d168b552c0c61B7Fb64cF7819D78310',
        block,
      });

      return new BigNumber(output).dividedBy(1e8);
    },
    async getExchangeRateCall(block) {
      const {output} = await sdk.api.abi.call({
        abi: compoundProviderABI['exchangeRate'],
        target: '0x39aa39c021dfbae8fac545936693ac917d5e7563',
        block,
      });

      return new BigNumber(output).dividedBy(1e16);
    },
    async getUnderlyingPriceCall(block) {
      const {output} = await sdk.api.abi.call({
        abi: compoundProviderABI['price'],
        target: '0x922018674c12a7f0d394ebeef9b58f186cde13c1',
        params: ['USDC'],
        block,
      });

      return new BigNumber(output).dividedBy(1e6);
    }
  }
];

/*==================================================
  Main
==================================================*/
async function tvl(timestamp, block) {
  const balances = await Promise.all(_.map(listedTokens, async token => {
    const balance = await token.getBalanceCall(block);
    const exchangeRate = await token.getExchangeRateCall(block);
    const underlyingPrice = await token.getUnderlyingPriceCall(block);

    return new BigNumber(balance)
      .multipliedBy(exchangeRate)
      .multipliedBy(underlyingPrice);
  }));

  const totalBalance = balances.reduce((ac, value) => {
    return ac.plus(value);
  }, new BigNumber(0));

  return {
    '0x0000000000000000000000000000000000000000': totalBalance.toFixed(2),
  };
}

/* Metadata */
module.exports = {
  name: 'BarnBridge',
  website: 'https://app.barnbridge.com',
  symbol: 'BOND',
  type: 'derivatives',
  start: 1615564559, // Mar-24-2021 02:17:40 PM +UTC
  tvl,
};
