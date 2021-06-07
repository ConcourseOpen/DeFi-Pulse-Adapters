/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const abi = require('./abi.json');
  const BigNumber = require('bignumber.js');
  const fs = require('fs');
  const path = require('path');
  const { vaults, pools, singleAssetVaults, liquidityPools, getVaultByContractName } = require('./config');
  const liquidityPoolInfo = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'liquidity-pool-info.json'), 'utf-8')
  );

  const address0x = '0x0000000000000000000000000000000000000000'

  async function getSingleAssetVault(contractName, timestamp, block) {
    const vault = getVaultByContractName(contractName)

    if (!vault) {
      throw(`Error: ${contractName} not found in eth-vaults.json`)
    }

    const [totalSupply, sharePrice, underlyingUnit] = await Promise.all([
      sdk.api.abi.call({ block, target: vault.contract.address, abi: 'erc20:totalSupply', }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABISharePrice'], }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABIUnderlyingUnit'], })
    ])

    const underlyingCount = new BigNumber(totalSupply.output)
      .times(new BigNumber(sharePrice.output))
      .div(new BigNumber(underlyingUnit.output))

    return([
      vault.underlying.address,
      underlyingCount
    ])
  }

  // Handle OLD VAULTS which have been updated, yet not reflected in
  // in the ethparser-vaults data.
  function getUnderlyingAddressByVault(vault) {
    switch(vault.contract.name) {
      case 'V_SUSHI_WBTC_WETH_#V2':
        return '0xceff51756c56ceffca006cd410b03ffc46dd3a58';
      case 'V_SUSHI_USDC_WETH_#V2':
        return '0x397ff1542f962076d0bfe58ea045ffa2d347aca0';
      case 'V_SUSHI_WETH_USDT_#V2':
        return '0x06da0fd433c1a5d7a4faa01111c044910a184553';
      case 'V_SUSHI_DAI_WETH_#V3':
        return '0xc3d03e4f041fd4cd388c549ee2a29a9e5075882f';
      case 'V_1INCH_ETH_1INCH':
        return '0x0ef1b8a0e726fc3948e15b23993015eb1627f210';
      default:
        return vault.underlying.address
    }
  }

  async function getLiquidityPool(contractName, timestamp, block) {
    const vault = getVaultByContractName(contractName)

    if (!vault) {
      throw(`Error: ${contractName} not found in eth-vaults.json`)
    }

    const underlyingAddress = getUnderlyingAddressByVault(vault)

    const token0Address = liquidityPoolInfo[underlyingAddress].token0
    const token1Address = liquidityPoolInfo[underlyingAddress].token1

    const [
      totalSupply,
      sharePrice,
      underlyingUnit,
      underlyingTotalSupply,
      underlyingReserves
    ] = await Promise.all([
      sdk.api.abi.call({ block, target: vault.contract.address, abi: 'erc20:totalSupply', }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABISharePrice'], }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABIUnderlyingUnit'], }),
      sdk.api.abi.call({ block, target: underlyingAddress, abi: abi['totalSupply'], }),
      sdk.api.abi.call({ block, target: underlyingAddress, abi: abi['uniABIReserves'], })
    ])

    const lpTokenCount = new BigNumber(totalSupply.output)
      .times(new BigNumber(sharePrice.output))
      .div(new BigNumber(underlyingUnit.output))

    const harvestShareOfPool = lpTokenCount.div(BigNumber(underlyingTotalSupply.output))
    const amountToken0 = BigNumber(underlyingReserves.output[0]).times(harvestShareOfPool)
    const amountToken1 = BigNumber(underlyingReserves.output[1]).times(harvestShareOfPool)

    return {
      [token0Address]: amountToken0,
      [token1Address]: amountToken1
    }
  }

  async function tvl(timestamp, block) {
    const assetAmounts = {}

    // Single asset vaults
    const singleAssetVaultValues = await Promise.all(
      singleAssetVaults.map(
        (contractName) => getSingleAssetVault(contractName, timestamp, block)
      )
    )

    singleAssetVaultValues.forEach((val) => {
      let existingVal = BigNumber(assetAmounts[val[0]] || 0)
      assetAmounts[val[0]] = BigNumber.sum(existingVal, val[1])
    })

    // Liquidity pools
    const liquidityPoolValues = await Promise.all(
      liquidityPools.map(
        (contractName) => getLiquidityPool(contractName, timestamp, block)
      )
    )

    liquidityPoolValues.forEach((val) => {
      for (const [k, v] of Object.entries(val)) {
        let existingVal = BigNumber(assetAmounts[k] || 0)
        assetAmounts[k] = BigNumber.sum(existingVal, v)
      }
    })

    // Finally, convert the BigNums to strings
    const assetAmountStrings = {}
    for (const [k, v] of Object.entries(assetAmounts)) {
      assetAmountStrings[k] = v.toString()
    }
    console.table(assetAmountStrings)
    return assetAmountStrings
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
