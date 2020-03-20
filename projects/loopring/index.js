{
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
  const listedTokens = [
    "0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD", // LRC
    "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
    "0x6B175474E89094C44Da98b954EedeAC495271d0F", // DAI
    "0x514910771AF9Ca656af840dff83E8264EcF986CA"  // LINK
  ];

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {
    let getBalance = await sdk.api.eth.getBalance({target: loopringExchangeAddr, block});

    let balances = {
      '0x0000000000000000000000000000000000000000': getBalance.output
    };

    let calls = [];
    _.each(listedTokens, (token) => {
      calls.push({
        target: token,
        params: loopringExchangeAddr
      })
    });

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    _.each(balanceOfResults.output, (balanceOf) => {
      if(balanceOf.success) {
        let balance = balanceOf.output;
        let address = balanceOf.input.target;

        if (BigNumber(balance).toNumber() <= 0) {
          return;
        }

        balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
      }
    });

    let symbolBalances = await sdk.api.util.toSymbols(balances);

    return symbolBalances.output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Loopring',
    token: 'LRC',
    category: 'DEXes',
    start: 1574241665, // 11/20/2019 @ 09:21AM (UTC)
    run
  }
}
