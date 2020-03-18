/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

const pool1 = '0xfd61352232157815cf7b71045557192bf0ce1884';  // currency assets
const pool2 = '0x7cbe5682be6b648cc1100c76d4f6c96997f753d6';  // investment assets
const pools = [pool1, pool2];

const tokens = [
  '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359', // SAI
]

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {

    let balances = {};

    // ERC20 Assests Balances
    let calls = [];

    _.each(pools, (pool) => {
      _.each(tokens, (token) => {
        calls.push({
          target: token,
          params: pool
        })
      });
    });

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    _.each(balanceOfResults.output, (balanceOf) => {
      if(balanceOf.success) {
        let address = balanceOf.input.target
        balances[address] = BigNumber(balances[address] || 0).plus(balanceOf.output).toFixed();
      }
    });

    // ETH Asset Balances
    let ethBalanceP1 = await sdk.api.eth.getBalance({target: pool1, block});
    let ethBalanceP2 = await sdk.api.eth.getBalance({target: pool2, block});
    balances['0x0000000000000000000000000000000000000000'] = BigNumber(ethBalanceP1.output).plus(ethBalanceP2.output);

    return (await sdk.api.util.toSymbols(balances)).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Nexus Mutual',
    token: null,
    category: 'Assets',
    start: 1558611486,
    run
  }
