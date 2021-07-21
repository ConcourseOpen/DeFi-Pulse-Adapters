/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

 /*==================================================
  Vars
  ==================================================*/

  const listedTokens = [
    '0x27f8d03b3a2196956ed754badc28d73be8830a6e', //adai
    '0x1a13f4ca1d028320a707d99520abfefca3998b7f', //ausdc
    '0x60d55f02a771d515e077c9c2403a1ef324885cec', //ausdt
    '0x5c2ed810328349100a66b82b78a1791b101c9d61', //awbtc
    '0xdbf31df14b66535af65aac99c32e9ea844e14501', //renbtc
    // '0xe7a24ef0c5e95ffb0f6684b813a78f2a3ad7d171', //a3crv 
    '0x28424507fefb6f7f8e9d3860f56504e4e5f5f390' //aweth
  ];

  const holders = [
    '0x445FE580eF8d70FF569aB36e80c647af338db351',
    '0xC2d95EEF97Ec6C17551d45e77B590dc1F9117C67',
    '0x751B1e21756bDbc307CBcC5085c042a0e9AaEf36'
  ]

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {
      '0x0000000000000000000000000000000000000000': 0
    };

    let calls = [];
    _.each(listedTokens, (token) => {
        _.each(holders, (holder) => {
          calls.push({
            target: token,
            params: holder
          });
        });
    });

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf',
      chain: 'polygon'
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    return (await sdk.api.util.toSymbols(balances)).output;
}

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Curve Finance_Polygon',
    token: 'CRV',
    category: 'DEXes',
    start: 1618858763,
    chain: 'Polygon',
    tvl
  }
  