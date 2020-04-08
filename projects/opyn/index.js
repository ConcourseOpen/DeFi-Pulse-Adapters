/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

  const abi = require('./abi');

/*==================================================
  Settings
  ==================================================*/

  const factoriesAddresses = [
    "0xb529964F86fbf99a6aA67f72a27e59fA3fa4FEaC", // ocToken Factory Address
    "0xcC5d905b9c2c8C9329Eb4e25dc086369D6C7777C"  // oEth Factory Address
  ]

  const tokenAddresses = [
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0x6B175474E89094C44Da98b954EedeAC495271d0F' // DAI
  ]

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {    
    let balances = {};

    for(let i = 0; i < factoriesAddresses.length; i++) {
      // number of created oTokens
      let numberOfOptionsContracts = (
        await sdk.api.abi.call({
          target: factoriesAddresses[i],
          abi: abi.getNumberOfOptionsContracts,
        })
      ).output;

      // batch getOptionsContracts calls
      let getOptionsContractsCalls = [];

      for(let j = 0; j < numberOfOptionsContracts; j++) {
        getOptionsContractsCalls.push({
          target: factoriesAddresses[i],
          params: j
        })
      }

      let optionsContracts = (
        await sdk.api.abi.multiCall({
          calls: getOptionsContractsCalls,
          abi: abi.getOptionsContracts
        })
      ).output;

      // list of options addresses
      let optionsAddresses = []

      _.each(optionsContracts, async (contracts) => {
        optionsAddresses = [
          ...optionsAddresses,
          contracts.output
        ]
      });

      // get ETH balance
      _.each(optionsAddresses, async (optionAddress) => {
        let balance = (await sdk.api.eth.getBalance({target: optionAddress, block})).output;
        balances["0x0000000000000000000000000000000000000000"] = BigNumber(balances["0x0000000000000000000000000000000000000000"] || 0).plus(BigNumber(balance)).toFixed();
      })

      // batch balanceOf calls
      let balanceOfCalls = [];
  
      _.each(optionsAddresses, (optionsAddress) => {
        _.each(tokenAddresses, (tokenAddress) => {
          balanceOfCalls.push({
            target: tokenAddress,
            params: [optionsAddress]
          });
        });
      });
  
      // get tokens balances
      const balanceOfResults = await sdk.api.abi.multiCall({
        block,
        calls: balanceOfCalls,
        abi: "erc20:balanceOf"
      });
  
      _.each(balanceOfResults.output, (balanceOf) => {
        if(balanceOf.success) {
          let address = balanceOf.input.target
          balances[address] = BigNumber(balances[address] || 0).plus(balanceOf.output).toFixed();
        }
      });
    }

    return (await sdk.api.util.toSymbols(balances)).output;
  }

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Opyn',
  token: null,
  category: 'Derivatives',
  start: 1585699200,  // 04/01/2020 @ 12:00am (UTC)
  run
}
