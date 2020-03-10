/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const lendingReserves = [
    '0x0316EB71485b0Ab14103307bf65a021042c6d380', // HBTC
    '0x3212b29E33587A00FB1C83346f5dBFA69A458923', // imBTC
    '0x8E870D67F660D95d5be530380D0eC0bd388289E1', // PAX
    '0x0000000000085d4780B73119b644AE5ecd22b376', // TUSD
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    '0xeb269732ab75A6fD61Ea60b06fE994cD32a83549', // USDx
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
  ]
  const market = '0x0eEe3E3828A45f7601D5F54bF49bB01d1A9dF5ea' // market

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {
    let balances = {};

    let calls = _.reduce(lendingReserves, (accum, reserve) => [...accum, {
        target: reserve,
        params: market
    }], []);

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    _.each(balanceOfResults.output, (balanceOf) => {
      if(balanceOf.success) {
        let address = balanceOf.input.target;
        balances[address] = BigNumber(balances[address] || 0).plus(BigNumber(balanceOf.output)).toFixed();
      }
    });

    return (await sdk.api.util.toSymbols(balances)).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'dForce',
    token: 'DF',
    category: 'Lending',
    start: 1565043417, // Aug-06-2019 06:16:57 AM +UTC
    run
  }
