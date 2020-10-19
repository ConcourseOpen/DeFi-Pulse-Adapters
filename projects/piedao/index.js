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
    },
    // DeFi Small Cap
    {
      "startTimestamp": 1596442617,
      "smartPool": "0xad6a626ae2b43dcb1b39430ce496d2fa0365ba9c",
      "balancerPool": "0x94743cfaa3fdc62e9693572314b5ee377eba5d11"
    },
    // DeFi Large Cap
    {
      "startTimestamp": 1591609517,
      "smartPool": "0x24D1917c1ae6C085e6b68B6c1A41B8f9dE5bd441",
      "balancerPool": "0x71c4f1a8d95ad1faa0f893b74ca67fdf53ee63fb"
    },
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
