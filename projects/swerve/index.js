/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');
const _ = require('underscore');
_.flatMap = _.compose(_.flatten, _.map);


/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  let balances = {};

  // both declarations are in array format, since Swerve will be supporting more pools soon :)
  const poolAddrs = [
    '0x329239599afB305DA0A2eC69c58F8a6697F9F88d',
  ]
  const numCoinsForPoolAtIndex = [4]

  const balancesCalls = _.flatMap(poolAddrs, (token, i) => {
    return Array.from(Array(numCoinsForPoolAtIndex[i]), (e, idx) => ({
      target: token,
      params: idx
    }))
  })

  const balancesResults = await sdk.api.abi.multiCall({
    block,
    calls: balancesCalls,
    abi: {
      "name": "balances",
      "outputs": [
        {
          "type": "uint256",
          "name": "out"
        }
      ],
      "inputs": [
        {
          "type": "int128",
          "name": "arg0"
        }
      ],
      "constant": true,
      "payable": false,
      "type": "function",
      "gas": 2250
    },
  })

  const coinsCalls = _.flatMap(poolAddrs, (token, i) => {
    return Array.from(Array(numCoinsForPoolAtIndex[i]), (e, idx) => ({
      target: token,
      params: idx
    }))
  })

  const coinsResults = await sdk.api.abi.multiCall({
    block,
    calls: coinsCalls,
    abi: {
      "name": "coins",
      "outputs": [
        {
          "type": "address",
          "name": "out"
        }
      ],
      "inputs": [
        {
          "type": "int128",
          "name": "arg0"
        }
      ],
      "constant": true,
      "payable": false,
      "type": "function",
      "gas": 2190
    },
  })

  for (let [i, balance] of balancesResults.output.entries()) {
    if (!balance || !balance.output) continue;
    // Balance doesn't exist yet
    const out = coinsResults.output[i].output;
    if (!balances[out]) balances[out] = 0;
    // Update balance
    balances[out] = String(parseFloat(balances[out]) + parseFloat(balance.output));
  }

  return balances;
}


/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Swerve Finance',
  token: 'SWRV',
  category: 'dexes',
  start: 1599264000,        // 09/05/2020 @ 12:00am (UTC)
  tvl
}
