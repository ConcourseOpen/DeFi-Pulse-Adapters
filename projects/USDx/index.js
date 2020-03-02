/*==================================================
  Modules
  ==================================================*/
  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const reserves = [
    '0x8E870D67F660D95d5be530380D0eC0bd388289E1', // PAX
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0x0000000000085d4780B73119b644AE5ecd22b376' // TUSD
  ]

  const poolCore = "0x786bF554473f9aB733Fd683C528212492A23D895" // dForce: Stablecoin Pool

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {
    let balances = {};

    const calls = _.reduce(reserves, (accum, reserve) => [...accum, {
        target: reserve,
        params: poolCore
    }] , []);

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

    return (await sdk.api.util.toSymbols(balances)).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'USDx',
    token: 'USDx',
    category: 'Assets',
    start: 1563991581, // Jul-25-2019 02:06:21 AM +UTC
    run
  }

