/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const abi = require('./abi.json');
  const BigNumber = require('bignumber.js');
  const fs = require('fs');
  const path = require('path');
  const {
    vaults,
    pools,
    singleAssetVaults,
    liquidityPools,
    oldMooniswapVaults,
    getVaultByContractName,
    getUnderlyingAddressByVault
  } = require('./config');
  const liquidityPoolInfo = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'liquidity-pool-info.json'), 'utf-8')
  );

  const FARM_TOKEN_ADDRESS = '0xa0246c9032bC3A600820415aE600c6388619A14D'
  const FARM_REWARD_POOL_ADDRESS = '0x8f5adc58b32d4e5ca02eac0e293d35855999436c'

  async function getSingleAssetVault(contractName, timestamp, block) {
    const vault = getVaultByContractName(contractName)

    if (!vault) throw(`Error: ${contractName} not found in eth-vaults.json`);
    if (vault.created > timestamp) return [];

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

  async function getStakedFarm(timestamp, block) {
    const vault = getVaultByContractName('V_PS_#V1')

    if (vault.created > timestamp) return [];

    let result = await sdk.api.abi.call({
      target: FARM_TOKEN_ADDRESS,
      params: FARM_REWARD_POOL_ADDRESS,
      abi: 'erc20:balanceOf',
      block: block
    })

    return result.output
  }

  async function getLiquidityPool(contractName, timestamp, block) {
    const vault = getVaultByContractName(contractName)

    if (!vault) throw(`Error: ${contractName} not found in eth-vaults.json`);
    if (vault.created > timestamp) return [];

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

  async function getMooniswapLP(contractName, timestamp, block) {
    const vault = getVaultByContractName(contractName)

    if (!vault) throw(`Error: ${contractName} not found in eth-vaults.json`);
    if (vault.created > timestamp) return [];

    const underlyingAddress = getUnderlyingAddressByVault(vault)

    const token0Address = liquidityPoolInfo[underlyingAddress].token0
    const token1Address = liquidityPoolInfo[underlyingAddress].token1

    const [
      totalSupply,
      sharePrice,
      underlyingUnit,
      underlyingTotalSupply,
      underlyingToken0,
      underlyingToken1
    ] = await Promise.all([
      sdk.api.abi.call({ block, target: vault.contract.address, abi: 'erc20:totalSupply', }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABISharePrice'], }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABIUnderlyingUnit'], }),
      sdk.api.abi.call({ block, target: underlyingAddress, abi: abi['totalSupply'], }),
      sdk.api.abi.call({ block, target: underlyingAddress, abi: abi['1inchGetBalanceForAddition'], params: [token0Address] }),
      sdk.api.abi.call({ block, target: underlyingAddress, abi: abi['1inchGetBalanceForAddition'], params: [token1Address] }),
    ])

    const lpTokenCount = new BigNumber(totalSupply.output)
      .times(new BigNumber(sharePrice.output))
      .div(new BigNumber(underlyingUnit.output))

    const harvestShareOfPool = lpTokenCount.div(BigNumber(underlyingTotalSupply.output))
    const amountToken0 = BigNumber(underlyingToken0.output).times(harvestShareOfPool)
    const amountToken1 = BigNumber(underlyingToken1.output).times(harvestShareOfPool)

    return {
      [token0Address]: amountToken0,
      [token1Address]: amountToken1
    }
  }

  async function tvl(timestamp, block) {
    const assetAmounts = {}

    /////////////// Old mooniswap vaults //////////////////
    const mooniswapVaultValues = await Promise.all(
      oldMooniswapVaults.map(
        (contractName) => getMooniswapLP(contractName, timestamp, block)
      )
    )

    mooniswapVaultValues.forEach((val) => {
      for (const [k, v] of Object.entries(val)) {
        let existingVal = BigNumber(assetAmounts[k] || 0)
        assetAmounts[k] = BigNumber.sum(existingVal, v)
      }
    })

    /////////////// FARM staking ////////////////////
    assetAmounts[FARM_TOKEN_ADDRESS] = await getStakedFarm(timestamp, block)

    /////////////// Single asset vaults ///////////////////////
    const singleAssetVaultValues = await Promise.all(
      singleAssetVaults.map(
        (contractName) => getSingleAssetVault(contractName, timestamp, block)
      )
    )

    singleAssetVaultValues.forEach((val) => {
      let existingVal = BigNumber(assetAmounts[val[0]] || 0)
      assetAmounts[val[0]] = BigNumber.sum(existingVal, val[1])
    })

    //////////////  Liquidity pools ///////////////////////////
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
