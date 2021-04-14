/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const axios = require("axios");
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');


/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const balances = {};

    const { data } = await axios.get(
      "https://static.opium.network/data/opium-addresses.json"
    );

    const calls = []
    _.each(data.tokens, (token) => {
      _.each(data.contracts, (contract) => {
        calls.push({
          target: token,
          params: contract
        })
      })
    })

    const balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    _.each(balanceOfResults.output, (balanceOf) => {
      if(balanceOf.success) {
        const address = balanceOf.input.target;
        const balance = balances[address] ? BigNumber(balanceOf.output).plus(BigNumber(balances[address])).toFixed().toString(): balanceOf.output;

        balances[address] = balance;
      }
    });

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Opium Network',
    token: null,
    category: 'derivatives',
    start: 1579601633, // 2020-01-21T10:13:53+00:00
    tvl
  }
