/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    let tokens = (await sdk.api.cdp.compound.tokens()).output;

    // V1

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(tokens, (token, address) => ({
        target: address,
        params: '0x3FDA67f7583380E67ef93072294a7fAc882FD7E7'
      })),
      abi: 'erc20:balanceOf'
    });

    await sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    // V2

    let getCashResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(tokens, (token, address) => ({
        target: token.cToken
      })),
      abi: {
        "constant":true,
        "inputs":[

        ],
        "name":"getCash",
        "outputs":[
          {
            "name":"",
            "type":"uint256"
          }
        ],
        "payable":false,
        "signature":"0x3b1d21a2",
        "stateMutability":"view",
        "type":"function"
      }
    });

    _.each(tokens, (token, address) => {
      let getCash = _.find(getCashResults.output, (result) => { return result.success && result.input.target == token.cToken});

      if(getCash) {
        balances[address] = BigNumber(balances[address] || 0).plus(getCash.output).toFixed();
      }
    });

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Compound',
    token: null,
    category: 'lending',
    start: 1538006400, // 09/27/2018 @ 12:00am (UTC)
    tvl
  }


