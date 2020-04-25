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
      '0x845838DF265Dcd2c412A1Dc9e959c7d08537f8a2',
      '0x9fC689CCaDa600B6DF723D9E47D84d76664a1F23',
      '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8',
      '0x3B3Ac5386837Dc563660FB6a0937DFAa5924333B',
      '0xC25a3A3b969415c80451098fa907EC722572917F',
    ]

    let totalSupplyCalls = tokens.map(token => ({ target: token }))
    let totalSupplyResults = await sdk.api.abi.multiCall({
      block,
      calls: totalSupplyCalls,
      abi: 'erc20:totalSupply'
    })

    let swaps = [
       '0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56',
       '0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C',
       '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51',
       '0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27',
       '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD',
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
      balances[totalSupply.input.target] = totalSupply.output * virtualPriceResults.output[i].output
    }

    return balances;
  }


/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Curve Finance',
    token: null,
    category: 'dexes',
    start: 1582609711,        // 25/02/2020 @ 5.48am UTC
    tvl
  }
