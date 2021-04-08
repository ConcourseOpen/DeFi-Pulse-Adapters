const sdk = require('../../sdk');
const abi = require('./abi');
const _ = require('underscore');
const BigNumber = require('bignumber.js');

const bVaultAddresses = [
  "0x2c23276107b45E64c8c59482f4a24f4f2E568ea6", // bUsdt
  "0x8016907D54eD8BCf5da100c4D0EB434C0185dC0E", // bUsdc
  "0x750d30A8259E63eD72a075f5b6630f08ce7996d0", // bArpa
  "0x3fb6b07d77dace1BA6B5f6Ab1d8668643d15a2CC", // bWbtc
  "0x8D9A39706d3B66446a298f1ae735730257Ec6108", // bHbtc
  "0x378388aa69f3032FA46150221210C7FA70A35153", // bBusd
]

async function tvl(timestamp, block) {
  const balances = {};
  const bVaultToUnderlyingToken = {};


  // Get bVault's underlying tokens
  const underlyingBVaultAddressResults = await sdk.api.abi.multiCall({
    calls: _.map(bVaultAddresses, (address) => ({
      target: address
    })),
    abi: abi["token"]
  });

  _.each(underlyingBVaultAddressResults.output, (token) => {
    if(token.success) {
      const underlyingTokenAddress = token.output;
      const bVaultAddress = token.input.target;
      bVaultToUnderlyingToken[bVaultAddress] = underlyingTokenAddress;
      if (!balances.hasOwnProperty(underlyingTokenAddress)) {
        balances[underlyingTokenAddress] = 0;
      }
    }
  });

  // Get bVault's balances in underlying token
  const bVaultBalanceResults = await sdk.api.abi.multiCall({
    block,
    calls: _.map(bVaultAddresses, (address) => ({
      target: address
    })),
    abi: abi["balance"]
  });

  _.each(bVaultBalanceResults.output, (tokenBalanceResult) => {
    if(tokenBalanceResult.success) {
      const valueInToken = tokenBalanceResult.output;
      const bVaultAddress = tokenBalanceResult.input.target;
      balances[bVaultToUnderlyingToken[bVaultAddress]] = BigNumber(balances[bVaultToUnderlyingToken[bVaultAddress]]).plus(valueInToken);
    }
  });

  return balances;
}

module.exports = {
  name: 'Bella Flex Saving',
  token: 'BEL',
  category: 'assets',
  start: 1616371200,    // 03/22/2020 @ 12:00am (UTC)
  tvl,
};
