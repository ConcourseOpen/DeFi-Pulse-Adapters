/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const sdk = require('../../sdk');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const zeroAddress = '0x0000000000000000000000000000000000000000'
  const globalFundAddress = '0x07cDB44fA1E7eCEb638c12A3451A3Dc9CE1400e4'
  const globalFundTokens = [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    '0x0D8775F648430679A709E98d2b0Cb6250d2887EF',
    '0x514910771AF9Ca656af840dff83E8264EcF986CA',
    '0xF629cBd94d3791C9250152BD8dfBDF380E2a3B9c',
    '0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C',
    '0x8dd5fbCe2F6a956C3022bA3663759011Dd51e73E',
    '0xE41d2489571d322189246DaFA5ebDe1F4699F498',
    '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
    '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9',
    '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55',
    '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  ]

/*==================================================
  TVL
  ==================================================*/

  async function getFundBalances(block) {
    let calls = [];
    let balances = {};

    _.each(globalFundTokens, (tokenAddress) => {
      calls.push({
        target: tokenAddress,
        params: globalFundAddress
      })
    });

    const balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    // Fetch ETH balance
    let balance = (await sdk.api.eth.getBalance({target: globalFundAddress, block})).output;
    balances[zeroAddress] = BigNumber(balances[zeroAddress] || 0).plus(balance).toFixed();

    return balances;
  }

  async function tvl(timestamp, block) {
    const balances = await getFundBalances(block);
    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'PEAKDEFI',         // Peakdefi
    token: 'PEAK',            // PEAK token
    category: 'assets',       // Allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1607405152,        // Dec-08-2020 05:25:52 PM +UTC
    tvl                       // Tvl adapter
  }