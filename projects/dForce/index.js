/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const assetReserves = [
    '0x8E870D67F660D95d5be530380D0eC0bd388289E1', // PAX
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
    '0x0000000000085d4780B73119b644AE5ecd22b376'  // TUSD
  ]
  const poolCore = '0x786bF554473f9aB733Fd683C528212492A23D895' // dForce: Stablecoin Pool


  const lendingReserves = [
    '0x0316EB71485b0Ab14103307bf65a021042c6d380', // HBTC
    '0x3212b29E33587A00FB1C83346f5dBFA69A458923', // imBTC
    '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
    '0xeb269732ab75A6fD61Ea60b06fE994cD32a83549', // USDx
  ]
  const market = '0x0eEe3E3828A45f7601D5F54bF49bB01d1A9dF5ea' // market

  let reserveDetails = {
    '0x0316EB71485b0Ab14103307bf65a021042c6d380': {'symbol':'HBTC', 'decimals': 18},
    '0x3212b29E33587A00FB1C83346f5dBFA69A458923': {'symbol':'imBTC', 'decimals': 8},
    '0xeb269732ab75A6fD61Ea60b06fE994cD32a83549': {'symbol':'USDx', 'decimals': 18},
  }

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {
    let balances = {};

    let calls = _.reduce(assetReserves, (accum, reserve) => [...accum, {
        target: reserve,
        params: poolCore
    }], []);

    _.each(lendingReserves, (reserve) => {
      calls.push({
        target: reserve,
        params: market
      })
    });

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

    let usdxBalance = balances['0xeb269732ab75A6fD61Ea60b06fE994cD32a83549'] !== undefined
      ? balances['0xeb269732ab75A6fD61Ea60b06fE994cD32a83549']
      : '0';
    delete balances['0xeb269732ab75A6fD61Ea60b06fE994cD32a83549'];

    let result = (await sdk.api.util.toSymbols(balances)).output;
    _.each(reserveDetails, (detail, reserve) => {
      let totalAmount = balances[reserve] !== undefined ? balances[reserve] : usdxBalance;
      result[detail.symbol] = (BigNumber(totalAmount).div(10 ** (detail.decimals))).toString();
    })

    return result;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'dForce',
    token: null,
    category: 'Lending',
    start: 1563991581, // Jul-25-2019 02:06:21 AM +UTC
    run
  }
