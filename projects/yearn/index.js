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
  // yearn v2
  '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01', // yDAI
  '0xd6aD7a6750A7593E092a9B218d66C0A814a3436e', // yUSDC
  '0xF61718057901F84C4eEC4339EF8f0D86D2B45600', // ySUSD
  '0xe6354ed5bc4b393a5aad09f21c46e101e692d447', // yUSDT
  '0x04Aa51bbcB46541455cCF1B8bef2ebc5d3787EC9', // ywBTC

  // yearn v3
  '0xc2cb1040220768554cf699b0d863a3cd4324ce32', // yDAI
  '0x26ea744e5b887e5205727f55dfbe8685e3b21951', // yUSDC
  '0x83f798e925BcD4017Eb265844FDDAbb448f1707D', // yUSDT
  '0x73a052500105205d34Daf004eAb301916DA8190f', // yTUSD
  '0x04bc0ab673d88ae9dbc9da2380cb6b79c4bca9ae', // yBUSD

];

const yVaultAddresses = [
  '0x597aD1e0c13Bfe8025993D9e79C69E1c0233522e'  // y//USDC
]

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const balances = {};
  const yTokenToUnderlyingToken = {};
  const yVaultToUnderlyingToken = {};

  // Get yToken's underlying tokens
  const underlyingYTokenAddressResults = await sdk.api.abi.multiCall({
    calls: _.map(yTokenAddresses, (address) => ({
      target: address
    })),
    abi: abi["token"]
  });

  _.each(underlyingYTokenAddressResults.output, (token) => {
    if(token.success) {
      const underlyingTokenAddress = token.output;
      const yTokenAddress = token.input.target;
      yTokenToUnderlyingToken[yTokenAddress] = underlyingTokenAddress;
      if (!balances.hasOwnProperty(underlyingTokenAddress)) {
        balances[underlyingTokenAddress] = 0;
      }
    }
  });

  // Calculate yToken's values
  const yTokenValueResults = await sdk.api.abi.multiCall({
    block,
    calls: _.map(yTokenAddresses, (address) => ({
      target: address
    })),
    abi: abi["calcPoolValueInToken"]
  });

  _.each(yTokenValueResults.output, (tokenBalance) => {
    if(tokenBalance.success) {
      const valueInToken = tokenBalance.output;
      const yTokenAddress = tokenBalance.input.target;
      balances[yTokenToUnderlyingToken[yTokenAddress]] += valueInToken;
    }
  });

  // Get yVault's underlying tokens
  const underlyingYVaultAddressResults = await sdk.api.abi.multiCall({
    calls: _.map(yVaultAddresses, (address) => ({
      target: address
    })),
    abi: abi["token"]
  });

  _.each(underlyingYVaultAddressResults.output, (token) => {
    if(token.success) {
      const underlyingTokenAddress = token.output;
      const yVaultAddress = token.input.target;
      yVaultToUnderlyingToken[yVaultAddress] = underlyingTokenAddress;
      if (!balances.hasOwnProperty(underlyingTokenAddress)) {
        balances[underlyingTokenAddress] = 0;
      }
    }
  });

  // Get yVault's balances in underlying token
  const yVaultBalanceResults = await sdk.api.abi.multiCall({
    block,
    calls: _.map(yVaultAddresses, (address) => ({
      target: address
    })),
    abi: abi["balance"]
  });

  _.each(yVaultBalanceResults.output, (tokenBalanceResult) => {
    if(tokenBalanceResult.success) {
      const valueInToken = tokenBalanceResult.output;
      const yVaultAddress = tokenBalanceResult.input.target;
      balances[yVaultToUnderlyingToken[yVaultAddress]] += valueInToken;
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
  tvl,
  contributesTo: ['Curve'],
};
