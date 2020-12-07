 /*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require("bignumber.js");

 /*==================================================
  Vars
  ==================================================*/

  const loopringExchangeAddr = '0x944644Ea989Ec64c2Ab9eF341D383cEf586A5777';
  const wedexExchangeAddr = '0xD97D09f3bd931a14382ac60f156C1285a56Bb51B';

  const listedTokens = [
    "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD", // LRC
    "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
    "0x514910771AF9Ca656af840dff83E8264EcF986CA"  // LINK
  ];

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let getBalance = await sdk.api.eth.getBalance({target: loopringExchangeAddr, block});
    let getWedexBalance = await sdk.api.eth.getBalance({target: wedexExchangeAddr, block});
    let ethBlanace = BigNumber(getBalance.output || 0).plus(getWedexBalance.output);

    let balances = {
      '0x0000000000000000000000000000000000000000': ethBlanace
    };

    let calls = [];
    _.each(listedTokens, (token) => {
      calls.push({
        target: token,
        params: loopringExchangeAddr
      });
      calls.push({
        target: token,
        params: wedexExchangeAddr
      });
    });

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Loopring',
    token: 'LRC',
    category: 'dexes',
    start: 1574241665, // 11/20/2019 @ 09:21AM (UTC)
    tvl
  }
