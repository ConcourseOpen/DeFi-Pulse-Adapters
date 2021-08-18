/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');
  const axios = require('axios');

/*==================================================
 Vars
==================================================*/

/*==================================================
  TVL
  ==================================================*/
async function tvl(timestamp, block){
    let tokenList = await axios.get('https://eth.complifi.me/api/protocol/pulse?networkId=137');
    let tokens = tokenList.data.tokens || [];
    let holders = tokenList.data.holders || [];
    let calls = [];
    let balances = {};

    _.each(tokens, (token) => {
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
    if (_.isEmpty(balances)) {
      balances = {
        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174': 0,
      };
    }
    
    return (await sdk.api.util.toSymbols(balances, 'polygon')).output;
}

module.exports = {
    name: 'CompliFi_Polygon',
    token: 'COMFI',
    category: 'Derivatives',
    start: 1621938255,  // May-25-2021 10:24:15 AM UTC
    tvl,
    chain: 'polygon',
  }
