/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {
    let getBalance = await sdk.api.erc20.balanceOf({target: '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD', owner: '0xF4662bB1C4831fD411a95b8050B3A5998d8A4A5b', block});

    let balances = {
      '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD': getBalance.output
    };

    let symbolBalances = await sdk.api.util.toSymbols(balances);

    return symbolBalances.output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Loopring',
    token: 'LRC',
    category: 'Derivatives',
    start: 1574241665, // 11/20/2019 @ 09:21AM (UTC)
    run
  }
