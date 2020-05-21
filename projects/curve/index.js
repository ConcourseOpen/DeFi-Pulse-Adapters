/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    let swaps = [
      '0xe5FdBab9Ad428bBB469Dee4CB6608C0a8895CbA5',
      '0x2e60CF74d81ac34eB21eEff58Db4D385920ef419',
      '0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56',
      '0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C',
      '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51',
      '0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27',
      '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD',
      '0x06364f10B501e868329afBc005b3492902d6C763',
    ]

    let coins = [2, 2, 2, 3, 4, 4, 4, 4]

    let balancesCalls = swaps.flatMap((token, i) => {
      return Array.from(Array(coins[i]), (e, idx) =>({target: token, params: idx}))
    })
    let balancesResults = await sdk.api.abi.multiCall({
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

    let coinsCalls = swaps.flatMap((token, i) => {
      return Array.from(Array(coins[i]), (e, idx) =>({target: token, params: idx}))
    })
    let coinsResults = await sdk.api.abi.multiCall({
      block,
      calls: coinsCalls,
      abi:  {
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

    for(let [i, balance] of balancesResults.output.entries()) {
      if(!balance.output) continue;
      balances[coinsResults.output[i].output] = balance.output
    }

    return balances;
  }

  async function rates(timestamp, block) {
    let yTokens = [
      //yTokens curve.fi/y
      '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01',
      '0xd6aD7a6750A7593E092a9B218d66C0A814a3436e',
      '0x83f798e925BcD4017Eb265844FDDAbb448f1707D',
      '0x73a052500105205d34Daf004eAb301916DA8190f',

      //yTokens curve.fi/busd
      '0xC2cB1040220768554cf699b0d863A3cd4324ce32',
      '0x26EA744E5B887E5205727f55dFBE8685e3b21951',
      '0xE6354ed5bC4b393a5Aad09f21c46E101e692d447',
      '0x04bC0Ab673d88aE9dbC9DA2380cB6B79C4BCa9aE',

      //ycTokens curve.fi/pax
      '0x99d1Fa417f94dcD62BfE781a1213c092a47041Bc',
      '0x9777d7E2b60bB01759D0E2f8be2095df444cb07E',
      '0x1bE5d71F2dA660BFdee8012dDc58D024448A0A59',
    ]

    let yCalls = yTokens.map((token, i) => ({ target: token }))

    let yRates = await sdk.api.abi.multiCall({
      block,
      calls: yCalls,
      abi:  {
        "constant":true,
        "inputs":[],
        "name":"getPricePerFullShare",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
      }
    })
  }


/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Curve Finance',
    token: null,
    category: 'dexes',
    start: 1578074057,        // 03/01/2020 @ 5:54pm UTC
    tvl
  }