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

    let swaps = [
       '0x329239599afB305DA0A2eC69c58F8a6697F9F88d',
     ]
    
    let virtualPriceCalls = swaps.map(token => ({ target: token }))
    let virtualPriceResults = await sdk.api.abi.multiCall({
      block,
      calls: virtualPriceCalls,
      abi: {
        "name": "get_virtual_price",
        "outputs": [
         {
          "type": "uint256",
          "name": "out"
         }
        ],
        "inputs": [],
        "constant": true,
        "payable": false,
        "type": "function",
        "gas": 1084167
      }
    })

    for(let [i, totalSupply] of totalSupplyResults.output.entries()) {
      balances[totalSupply.input.target] = totalSupply.output * virtualPriceResults.output[i].output //TVL in USD (non decimal-converted)
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
