/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require("bignumber.js");

/*==================================================
  Settings
  ==================================================*/

  const aaveReserves = [
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

  const aaveLendingPoolCore = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";

  const uniswapReserves = [
    "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    "0x97dec872013f6b5fb443861090ad931542878126",
    "0xf173214c720f58e03e194085b1db28b50acdeead",
    "0x2a1530c4c41db0b0b2bb646cb5eb1a67b7158667",
    "0xcaa7e4656f6a2b59f5f99c745f91ab26d1210dce",
    "0x2c4bd064b998838076fa341a83d007fc2fa50957",
    "0xe9cf7887b93150d4f2da7dfc6d502b216438f244",
  ];

  const uniswapLendingPoolCore = "0x1012cfF81A1582ddD0616517eFB97D02c5c17E25";

/*==================================================
  Helper Functions
==================================================*/

  async function _multiMarketTvl(lendingPoolCore, reserves, block) {
    let _balances = {
      "0x0000000000000000000000000000000000000000": (
        await sdk.api.eth.getBalance({ target: lendingPoolCore, block })
      ).output,
    };

    const balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(reserves, (reserve) => ({
        target: reserve,
        params: lendingPoolCore,
      })),
      abi: "erc20:balanceOf",
    });

    sdk.util.sumMultiBalanceOf(_balances, balanceOfResults);

    return _balances;
  }

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = await _multiMarketTvl(aaveLendingPoolCore, aaveReserves, block);
    
    const uniswapMarketTvlBalances = await _multiMarketTvl(
      uniswapLendingPoolCore,
      uniswapReserves,
      block
    );

    // Combine TVL values into one dict
    Object.keys(uniswapMarketTvlBalances).forEach(address => {
      if (balances[address]) {
        balances[address] = BigNumber(
          balances[address]
        ).plus(uniswapMarketTvlBalances[address]).toFixed();
      } else {
        balances[address] = uniswapMarketTvlBalances[address];
      }
    });

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
  };
