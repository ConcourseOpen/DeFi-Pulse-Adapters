/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const abi = require('./abi.json');
  const fs = require('fs');
  const path = require('path');
  const BigNumber = require('bignumber.js');

  const ethVaults = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'eth-vaults.json'), 'utf-8')).data
  const ethPools = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'eth-pools.json'), 'utf-8')).data

  const singleAssetVaults = [
    'V_USDC_#V1',
    'V_WETH_#V1'
  ]

  function getDataByContractName(contractName) {
    return ethVaults.find((data) => {
      return data.contract.name === contractName
    })
  }



  async function getSingleAssetVault(contractName, timestamp, block) {
    const vault = getDataByContractName(contractName)

    const [totalSupply, sharePrice, underlying] = await Promise.all([
      sdk.api.abi.call({ block, target: vault.contract.address, abi: 'erc20:totalSupply', }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABISharePrice'], }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABIUnderlyingUnit'], })
    ])

    const underlyingCount = new BigNumber(totalSupply.output)
      .times(new BigNumber(sharePrice.output))
      .div(new BigNumber(underlying.output))
      .toFixed()

    return([
      vault.underlying.address,
      underlyingCount
    ])
  }

  async function tvl(timestamp, block) {
    const returnData = {}

    const vals = await Promise.all(singleAssetVaults.map((contractName) => getSingleAssetVault(contractName, timestamp, block)))

    vals.forEach((val) => {
      returnData[val[0]] = val[1]
    })

    console.table(returnData)
    return returnData
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Harvest Finance', // project name
    website: 'https://harvest.finance',
    token: 'FARM',            // null, or token symbol if project has a custom token
    category: 'assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1598893200,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
    tvl                       // tvl adapter
  };
