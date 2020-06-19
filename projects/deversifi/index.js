/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const sdk = require('../../sdk');

/*==================================================
  Settings
  ==================================================*/

  const deversifiStarkAddr = '0x5d22045daceab03b158031ecb7d9d06fad24609b';

  const listedTokens = [
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
    '0xd26114cd6EE289AccF82350c8d8487fedB8A0C07', // OMG
    '0x940a2db1b7008b6c776d4faaca729d6d4a4aa551', // DUSK
    '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // MKR
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
    '0xe41d2489571d322189246dafa5ebde1f4699f498', // ZRX
    '0xcc80c051057b774cd75067dc48f8987c4eb97a5e', // NEC
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0x419d0d8bdd9af5e606ae2232ed285aff190e711b', // FUN
    '0x93ed3fbe21207ec2e8f2d3c3de6e058cb73bc04d' // PNK
  ];

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const ethBalance = (await sdk.api.eth.getBalance({ target: deversifiStarkAddr, block })).output;

  const balances = {
    '0x0000000000000000000000000000000000000000': ethBalance
  };

  const calls = [];
  _.each(listedTokens, (token) => {
    calls.push({
      target: token,
      params: deversifiStarkAddr
    });
  });

  const balanceOfResults = await sdk.api.abi.multiCall({
    block,
    calls,
    abi: 'erc20:balanceOf',
  });

  await sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'DeversiFi',
  token: 'NEC',
  category: 'dexes',
  start: 1590969600, // 06/01/2020
  tvl,
};
