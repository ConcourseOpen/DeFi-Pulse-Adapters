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
    // BTC++
    {
      "startTimestamp": 1585836606,
      "smartPool": "0x0327112423F3A68efdF1fcF402F6c5CB9f7C33fd",
      "balancerPool": "0x9891832633a83634765952b051bc7feF36714A46"
    },
    // USD++
    {
      "startTimestamp": 1591609517,
      "smartPool": "0x9A48BD0EC040ea4f1D3147C025cd4076A2e71e3e",
      "balancerPool": "0x1Ee383389c621C37Ee5Aa476F88413A815083c5D"
    }
  ];

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    const tokensCalls = await sdk.api.abi.multiCall({
      block: block,
      calls: pools.filter((pool) => timestamp >= pool.startTimestamp).map((pool) => ({
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

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'PieDAO', // project name
    token: null,              // null, or token symbol if project has a custom token
    category: 'assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1585872000,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
    tvl,                       // tvl adapter
  };
