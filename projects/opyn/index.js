/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

  const getNumberOfOptionsContractsAbi = require('./abis/getNumberOfOptionsContracts.json');
  const optionsContractsAbi = require('./abis/optionsContracts.json');
  const collateralAbi = require('./abis/collateral.json');

/*==================================================
  Settings
  ==================================================*/

  const factoriesAddresses = [
    "0xb529964F86fbf99a6aA67f72a27e59fA3fa4FEaC", // ocToken Factory Address
    "0xcC5d905b9c2c8C9329Eb4e25dc086369D6C7777C"  // oEth Factory Address
  ]

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const supportedTokens = await (
      sdk
        .api
        .util
        .tokenList()
        .then((supportedTokens) => supportedTokens.map(({ contract }) => contract))
    );
  
    let balances = {};

    for(let i = 0; i < factoriesAddresses.length; i++) {
      // number of created oTokens
      let numberOfOptionsContracts = (
        await sdk.api.abi.call({
          target: factoriesAddresses[i],
          abi: getNumberOfOptionsContractsAbi,
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
          abi: optionsContractsAbi
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
      
      // batch getCollateralAsset calls
      let getCollateralAssetCalls = [];

      for(let j = 0; j < optionsAddresses; j++) {
        getCollateralAssetCalls.push({
          target: optionsAddresses[j]
        })
      }

      // console.log(
      //   await sdk.api.abi.call({
      //     target: optionsAddresses[0],
      //     abi: otokenAbi.getRandomData
      //   })
      // )

      // get list of options collateral assets
      let optionsCollateral = (
        await sdk.api.abi.multiCall({
          calls: getCollateralAssetCalls,
          abi: collateralAbi
        })
      ).output;

      console.log(optionsCollateral)

      let optionsCollateralAddresses = []

      _.each(optionsCollateral, async (collateralAsset) => {        
        optionsCollateralAddresses = [
          ...optionsCollateralAddresses,
          collateralAsset.output
        ]
      });

      console.log(optionsCollateralAddresses)

      // get ETH balance
      _.each(optionsAddresses, async (optionAddress) => {
        let balance = (await sdk.api.eth.getBalance({target: optionAddress, block})).output;
        balances["0x0000000000000000000000000000000000000000"] = BigNumber(balances["0x0000000000000000000000000000000000000000"] || 0).plus(BigNumber(balance)).toFixed();
      })

      // batch balanceOf calls
      let balanceOfCalls = [];
      let j = 0;

      _.each(optionsAddresses, async (optionsAddress) => {
        if (supportedTokens.includes(optionsCollateralAddresses[j])) {
          balanceOfCalls.push({
            target: optionsCollateralAddresses[j],
            params: [optionsAddress]
          });
        }
        j++;
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

    console.log(balances)

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Opyn',
  token: null,
  category: 'derivatives',
  start: 1581542700,  // 02/12/2020 @ 09:25PM (UTC)
  tvl
}
