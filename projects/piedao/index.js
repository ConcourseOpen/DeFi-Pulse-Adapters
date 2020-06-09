/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');

/*==================================================
  Settings
==================================================*/
  // Pools hardcoded for now to reduce amount of calls to the API
  const pools = [
    {
      "smartPool": "0x0327112423f3a68efdf1fcf402f6c5cb9f7c33fd",
      "balancerPool": "0x9891832633a83634765952b051bc7fef36714a46"
    }
  ]

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    const tokensCalls = await sdk.api.abi.multiCall({
      block: block,
      calls: pools.map((pool) => ({
        target: pool.smartPool
      })),
      abi: {
        "inputs": [],
        "name": "getTokens",
        "outputs": [
          {
            "internalType": "address[]",
            "name": "",
            "type": "address[]"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    });

    const balanceOfCalls = [];

    _.each(tokensCalls.output, (tokensCall, i) => {
      _.each(tokensCall.output, (token) => {
        balanceOfCalls.push({
          target: token,
          params: pools[i].balancerPool
        });
      });
    });

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: balanceOfCalls,
      abi: 'erc20:balanceOf'
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults)

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'PieDAO', // project name
    token: null,              // null, or token symbol if project has a custom token
    category: 'assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1585836606,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
    tvl                       // tvl adapter
  }
