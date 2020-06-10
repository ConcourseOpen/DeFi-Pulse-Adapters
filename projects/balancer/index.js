/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {
      '0x0000000000000000000000000000000000000000': '0', // ETH
    };

    let poolLogs = await sdk.api.util.getLogs({
      target: '0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd',
      topic: 'LOG_NEW_POOL(address,address)',
      keys: ['topics'],
      fromBlock: 9562480,
      toBlock: block
    });

    let pools = _.map(poolLogs.output, (poolLog) => {
      return `0x${poolLog[2].slice(26)}`
    });

    let kyberTokens = (await sdk.api.util.kyberTokens()).output;

    let poolCalls = [];

    _.each(kyberTokens, (data, address) => {
      if(data.ethPrice) {
        _.each(pools, (pool) => {
          poolCalls.push({
            target: address,
            params: pool
          });
        });
      }
    });

    let poolBalances = (await sdk.api.abi.multiCall({
      block,
      calls: poolCalls,
      abi: 'erc20:balanceOf'
    })).output;

    _.each(poolBalances, (balanceOf) => {
      if(balanceOf.success) {
        let balance = balanceOf.output;
        let address = balanceOf.input.target;

        if (BigNumber(balance).toNumber() <= 0) {
          return;
        }

        balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
      }
    });

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Balancer',
    token: null,
    category: 'dexes',
    contributesTo: [],
    start : 1582761600, // 02/27/2020 @ 12:00am (UTC)
    tvl
  }
