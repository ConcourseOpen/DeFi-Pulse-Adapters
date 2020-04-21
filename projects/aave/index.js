/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');

/*==================================================
  Settings
  ==================================================*/

  const reserves = [
    '0x6b175474e89094c44da98b954eedeac495271d0f',
    '0x0000000000085d4780B73119b644AE5ecd22b376',
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    '0xdac17f958d2ee523a2206206994597c13d831ec7',
    '0x57ab1ec28d129707052df4df418d58a2d46d5f51',
    '0x80fB784B7eD66730e8b1DBd9820aFD29931aab03',
    '0x0d8775f648430679a709e98d2b0cb6250d2887ef',
    '0x1985365e9f78359a9B6AD760e32412f4a445E862',
    '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    '0x514910771af9ca656af840dff83e8264ecf986ca',
    '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    '0x0f5d2fb29fb7d3cfee444a200298f468908cc942',
    '0xe41d2489571d322189246dafa5ebde1f4699f498',
    '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F',
    '0x4Fabb145d64652a948d72533023f6E7A623C7C53'
  ];

  const lendingPoolCore = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {
      '0x0000000000000000000000000000000000000000': (await sdk.api.eth.getBalance({target: lendingPoolCore, block})).output
    };

    const balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(reserves, (reserve) => ({
        target: reserve,
        params: lendingPoolCore
      })),
      abi: 'erc20:balanceOf'
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Aave',
    token: 'LEND',
    category: 'lending',
    start: 1578355200,  // 01/07/2020 @ 12:00am (UTC)
    tvl
  }
