/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');
  _.flatMap = _.compose(_.flatten, _.map);

/*==================================================
  Settings
  ==================================================*/

  const yTokens = {
    '0xF61718057901F84C4eEC4339EF8f0D86D2B45600': '0x57Ab1ec28D129707052df4dF418D58a2D46d5f51',

    // yTokens curve.fi/y
    '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    '0xd6aD7a6750A7593E092a9B218d66C0A814a3436e': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    '0x83f798e925BcD4017Eb265844FDDAbb448f1707D': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    '0x73a052500105205d34Daf004eAb301916DA8190f': '0x0000000000085d4780B73119b644AE5ecd22b376',

    // yTokens curve.fi/busd
    '0xC2cB1040220768554cf699b0d863A3cd4324ce32': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    '0x26EA744E5B887E5205727f55dFBE8685e3b21951': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    '0xE6354ed5bC4b393a5Aad09f21c46E101e692d447': '0xdAC17F958D2ee523a2206206994597C13D831ec7',
    '0x04bC0Ab673d88aE9dbC9DA2380cB6B79C4BCa9aE': '0x4Fabb145d64652a948d72533023f6E7A623C7C53',

    // ycTokens curve.fi/pax
    '0x99d1Fa417f94dcD62BfE781a1213c092a47041Bc': '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    '0x9777d7E2b60bB01759D0E2f8be2095df444cb07E': '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    '0x1bE5d71F2dA660BFdee8012dDc58D024448A0A59': '0xdAC17F958D2ee523a2206206994597C13D831ec7'
  }

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let rawBalances = {};
    let balances = {};

    let swaps = [
      '0xe5FdBab9Ad428bBB469Dee4CB6608C0a8895CbA5',
      '0x2e60CF74d81ac34eB21eEff58Db4D385920ef419',
      '0xA2B47E3D5c44877cca798226B7B8118F9BFb7A56',
      '0x52EA46506B9CC5Ef470C5bf89f17Dc28bB35D85C',
      '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51',
      '0x79a8C46DeA5aDa233ABaFFD40F3A0A2B1e5A4F27',
      '0xeDf54bC005bc2Df0Cc6A675596e843D28b16A966',
      '0xA5407eAE9Ba41422680e2e00537571bcC53efBfD',
      '0x06364f10B501e868329afBc005b3492902d6C763',
    ]

    let coins = [2, 2, 2, 3, 4, 4, 2, 4, 4]

    let balancesCalls = _.flatMap(swaps, (token, i) => {
      return Array.from(Array(coins[i]), (e, idx) =>({target: token, params: idx}))
    });

    balancesCalls = balancesCalls.filter(call => !(call.target == '0xeDf54bC005bc2Df0Cc6A675596e843D28b16A966' && call.params == 1));

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
      }
    });

    let coinsCalls = _.flatMap(swaps, (token, i) => {
      return Array.from(Array(coins[i]), (e, idx) =>({target: token, params: idx}))
    });

    coinsCalls = coinsCalls.filter(call => !(call.target == '0xeDf54bC005bc2Df0Cc6A675596e843D28b16A966' && call.params == 1))

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
      }
    });

    for(let [i, balance] of balancesResults.output.entries()) {
      if(balance.success) {
        rawBalances[coinsResults.output[i].output] = balance.output
      }
    }

    let yRates = (await sdk.api.abi.multiCall({
      block,
      calls: _.map(_.keys(yTokens), (token) => ({
        target: token
      })),
      abi:  {
        "constant":true,
        "inputs":[],
        "name":"getPricePerFullShare",
        "outputs":[{"internalType":"uint256","name":"","type":"uint256"}],
        "payable":false,
        "stateMutability":"view",
        "type":"function"
      }
    })).output;

    _.each(rawBalances, (balance, address) => {
      if(yTokens[address]) {
        let rate = _.find(yRates, (call) => call.input.target == address);
        balance = BigNumber(rate.output).div(1e18).times(balance).toFixed();
        address = yTokens[address];
      }

      balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
    });

    return balances;
  }


/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Curve Finance',
    token: null,
    category: 'dexes',
    start: 1578009600, // 01/04/2020 @ 12:00am (UTC)
    tvl
  }
