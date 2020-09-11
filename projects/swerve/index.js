/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    let tokens = [
      '0x77C6E4a580c0dCE4E5c7a17d0bc077188a83A059',
    ]

    let totalSupplyCalls = tokens.map(token => ({ target: token }))
    let totalSupplyResults = await sdk.api.abi.multiCall({
      block,
      calls: totalSupplyCalls,
      abi: 'erc20:totalSupply'
    })

//    let swaps = [
//       '0x329239599afB305DA0A2eC69c58F8a6697F9F88d',
//     ]


    for(let [i, totalSupply] of totalSupplyResults.output.entries()) {
      balances[totalSupply.input.target] = totalSupply.output
    }

    return balances;
  }


/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Swerve Finance',
    token: null,
    category: 'dexes',
    start: 1599202211,        // September 4, 2020 6:50:11 AM UTC
    tvl
  }
