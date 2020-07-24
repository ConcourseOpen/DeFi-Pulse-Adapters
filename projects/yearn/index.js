/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');
const abi = require('./abi');
const _ = require('underscore');

/*==================================================
  Settings
  ==================================================*/

const yTokenAddresses = [
  '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01', // yDAI
  '0xd6aD7a6750A7593E092a9B218d66C0A814a3436e', // yUSDC
  '0x83f798e925BcD4017Eb265844FDDAbb448f1707D', // yUSDT
  '0x73a052500105205d34Daf004eAb301916DA8190f'  // yTUSD
];

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const balances = {};
  const yTokenToUnderlyingToken = {};


  const underlyingTokenAddressResults = await sdk.api.abi.multiCall({
    calls: _.map(yTokenAddresses, (address) => ({
      target: address
    })),
    abi: abi["token"]
  });

  _.each(underlyingTokenAddressResults.output, (token) => {
    if(token.success) {
      const underlyingTokenAddress = token.output;
      const yTokenAddress = token.input.target;
      yTokenToUnderlyingToken[yTokenAddress] = underlyingTokenAddress;
      balances[underlyingTokenAddress] = 0;
    }
  });

  const tokenValueResults = await sdk.api.abi.multiCall({
    block,
    calls: _.map(yTokenAddresses, (address) => ({
      target: address
    })),
    abi: abi["calcPoolValueInToken"]
  });

  _.each(tokenValueResults.output, (tokenBalance) => {
    if(tokenBalance.success) {
      const valueInToken = tokenBalance.output;
      const yTokenAddress = tokenBalance.input.target;
      balances[yTokenToUnderlyingToken[yTokenAddress]] = valueInToken;
    }
  });

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'yearn.finance',
  token: 'YFI',
  category: 'assets',
  start: 1581465600,    // 02/12/2020 @ 12:00am (UTC)
  tvl
};
