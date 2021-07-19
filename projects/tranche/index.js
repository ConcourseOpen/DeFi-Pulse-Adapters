/*==================================================
Modules
==================================================*/
const BigNumber = require('bignumber.js');
const sdk = require('../../sdk');
const axios = require('axios');
const _ = require('underscore');


/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const balances = {};


    // returns undefined in test script
    let tokenList = await axios.get('https://api.tranche.finance/api/v1/common/token-address?network=ethereum');
    let holderList = await axios.get('https://api.tranche.finance/api/v1/common/holder-address?network=ethereum');
    tokenList = tokenList.data.result;
    holderList = holderList.data.result;

    const calls = [];
    _.each(tokenList, (token) => {
        _.each(holderList, (contract) =>{
            calls.push({
                target: token,
                params: contract
            })
        })
    });

    const balanceOfResults = await sdk.api.abi.multiCall({
        block,
        calls,
        abi: 'erc20:balanceOf'
      });
    
    _.each(balanceOfResults.output, (balanceOf) => {
    if(balanceOf.success) {
        const address = balanceOf.input.target;
        const balance = balances[address] ? BigNumber(balanceOf.output).plus(BigNumber(balances[address])).toFixed().toString(): balanceOf.output;

        balances[address] = balance;
    }
    });

  
    return (await sdk.api.util.toSymbols(balances)).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'TRANCHE',
    token: "SLICE",
    category: 'Derivatives',
    start: 1621340071,
    tvl,
  }