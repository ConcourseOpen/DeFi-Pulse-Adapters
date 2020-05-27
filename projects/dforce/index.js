/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');

/*==================================================
  Settings
  ==================================================*/

  const tokenAddresses = [
    '0x8E870D67F660D95d5be530380D0eC0bd388289E1', // PAX
    '0x0000000000085d4780B73119b644AE5ecd22b376', // TUSD
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
  ]
  const pool = '0x786bF554473f9aB733Fd683C528212492A23D895' // USDx Stablecoin Pool

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(tokenAddresses, (token) => ({
        target: token,
        params: pool
      })),
      abi: 'erc20:balanceOf'
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'dForce',
    token: 'DF',
    category: 'assets',
    start: 1563992244, // Jul-25-2019 02:17:24 AM +UTC
    tvl
  }
