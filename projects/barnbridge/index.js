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
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';

const listedTokens = [
  // compound
  {
    address: USDC_ADDRESS,
    decimals: 6,
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
  }
];

/*==================================================
  Main
==================================================*/
async function tvl(timestamp, block) {
  const balances = {};

  await Promise.all(_.map(listedTokens, async token => {
    if (!balances[token.address]) {
      balances[token.address] = new BigNumber(0);
    }

    try {
      const balance = await token.getBalanceCall(block);
      const exchangeRate = await token.getExchangeRateCall(block);
      const totalValue = balance.multipliedBy(exchangeRate).multipliedBy(10 ** token.decimals);

      balances[token.address] = balances[token.address].plus(totalValue);
    } catch {
    }
  }));

  Object.keys(balances)
    .forEach(address => {
      balances[address] = balances[address].integerValue(BigNumber.ROUND_UP);
    });

  return balances;
}

/* Metadata */
module.exports = {
  name: 'BarnBridge',
  website: 'https://app.barnbridge.com',
  symbol: 'BOND',
  category: 'derivatives',
  start: 1615564559, // Mar-24-2021 02:17:40 PM +UTC
  tvl,
};
