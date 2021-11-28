/*==================================================
  Modules
  ==================================================*/
  const abi = require('./abi');
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
  
    for (holder of holders) {
      try {
        let collateral = (await sdk.api.abi.call({
          target: holder,
          abi: abi['collateralToken'],
          chain: 'polygon'
        })).output;
  
        calls.push({
          target: collateral,
          params: holder
        });
      }
      catch(e){}
    }
  
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
  
    return balances;
  }
  
  module.exports = {
    name: 'CompliFi_Polygon',
    token: 'COMFI',
    category: 'Derivatives',
    chain: 'polygon',
    start: 1621938255,  // May-25-2021 10:24:15 AM UTC
    tvl,
  }
  