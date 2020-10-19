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
      '0x93054188d876f558f4a66B2EF1d97d16eDf0895B',
      '0x7fC77b5c7614E1533320Ea6DDc2Eb61fa00A9714',
    ]

    let coins = [2, 2, 2, 3, 4, 4, 2, 4, 4, 2, 3]

    let balancesCalls = _.flatMap(swaps, (token, i) => {
      return Array.from(Array(coins[i]), (e, idx) =>({target: token, params: idx}))
    })
    balancesCalls = balancesCalls.filter(call => !(call.target == '0xeDf54bC005bc2Df0Cc6A675596e843D28b16A966' && call.params == 1))

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

    let coinsCalls = _.flatMap(swaps, (token, i) => {
      return Array.from(Array(coins[i]), (e, idx) =>({target: token, params: idx}))
    })
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
      },
    })

    for(let [i, balance] of balancesResults.output.entries()) {
      if(!balance || !balance.output) continue;
      // Balance doesn't exist yet
      const out = coinsResults.output[i].output;
      if(!balances[out]) balances[out] = 0;
      // Update balance
      balances[out] = String(parseFloat(balances[out]) + parseFloat(balance.output));
    }

    let { output } = (await sdk.api.util.toSymbols(balances));

    const yTokens = [
      { symbol: 'ySUSD', underlying: 'SUSD', contract: '0x57ab1ec28d129707052df4df418d58a2d46d5f51' },
      { symbol: 'yUSDC', underlying: 'USDC', contract: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' },
      { symbol: 'ycDAI', underlying: 'cDAI' },
      { symbol: 'yUSDT', underlying: 'USDT', contract: '0xdac17f958d2ee523a2206206994597c13d831ec7' },
      { symbol: 'ycUSDC', underlying: 'cUSDC' },
      { symbol: 'ycUSDT', underlying: 'cUSDT' },
      { symbol: 'yBUSD', underlying: 'BUSD', contract: '0x4fabb145d64652a948d72533023f6e7a623c7c53' },
      { symbol: 'yDAI', underlying: 'DAI', contract: '0x6b175474e89094c44da98b954eedeac495271d0f' },
      { symbol: 'yTUSD', underlying: 'TUSD', contract: '0x0000000000085d4780b73119b644ae5ecd22b376' },
    ]

    // Count y tokens as their underlying asset, ie ycDAI = cDAI
    output.map(( _token ) => {
      const yToken = yTokens.filter( token => token.symbol === _token.symbol)[0];
      // is y token
      if(yToken) {
        let _data = output.find((t) => t.symbol === yToken.underlying);

        if(!_data) {
          _data = {
            symbol: yToken.underlying,
            address: yToken.contract,
            balance: 0,
          };

          output.push(_data);
        }
        // Update balance
        _data.balance = String(
          parseFloat(_data.balance) +
          parseFloat(_token.balance)
        );
      }
    });

    output = output.filter((_token) => !yTokens.find( token => token.symbol === _token.symbol));
    
    return output;
  }

  /**async function rates(timestamp, block) {
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
  }**/


/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Curve Finance',
    token: null,
    category: 'DEXes',
    start: 1581138000,        // 03/01/2020 @ 5:54pm UTC
    tvl
  }
