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
    getUnderlyingAddressByVault,
    curveMappings
  } = require('./config');
  const liquidityPoolInfo = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'liquidity-pool-info.json'), 'utf-8')
  );

  const FARM_TOKEN_ADDRESS = '0xa0246c9032bC3A600820415aE600c6388619A14D'
  const FARM_REWARD_POOL_ADDRESS = '0x8f5adc58b32d4e5ca02eac0e293d35855999436c'

  async function getSingleAssetVault(contractName, timestamp, block) {
    const vault = getVaultByContractName(contractName)

    if (!vault) throw(`Error: ${contractName} not found in eth-vaults.json`);
    if (vault.contract.created > block) return [];

    const [totalSupply, sharePrice, underlyingUnit] = await Promise.all([
      sdk.api.abi.call({ block, target: vault.contract.address, abi: 'erc20:totalSupply', }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABISharePrice'], }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABIUnderlyingUnit'], })
    ])

    let underlyingCount = new BigNumber(totalSupply.output)
      .times(new BigNumber(sharePrice.output))
      .div(new BigNumber(underlyingUnit.output))


    const curveMapping = curveMappings[contractName]
    let address;

    if (curveMapping) {
      address = curveMappings[contractName].address
      decimalDifference = 18 - curveMappings[contractName].decimals
      underlyingCount = underlyingCount.div(BigNumber(10 ** decimalDifference))
    } else {
      address = vault.underlying.address
    }

    return([
      address,
      underlyingCount
    ])
  }

  async function getStakedFarm(timestamp, block) {
    const vault = getVaultByContractName('V_PS_#V1')

    if (vault.contract.created > block) return 0;

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
    if (vault.contract.created > block) return [];

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
    if (vault.contract.created > block) return [];

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

  // TODO: calculate these mappings automatically from ethparser data
  const uniV3Tokens = {
    USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    WETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
    UNI: '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984'
  }

  const uniV3Vaults = {
    'UNIV3: USDC-ETH': {
      address: '0x0b4C4EA418Cd596B1204C0dd07E419707149C7C6',
      created: 12594149,
      nftId: '40404',
      uniNFTContract: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      uniPoolAddress: '0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8',
      token0: uniV3Tokens.USDC,
      token1: uniV3Tokens.WETH
    },
    'UNIV3: USDC-USDT': {
      address: '0xe29385F6B90F25082972B75ccBC69900cE8A176A',
      created: 12594159,
      nftId: '40410',
      uniNFTContract: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      uniPoolAddress: '0x7858e59e0c01ea06df3af3d20ac7b0003275d4bf',
      token0: uniV3Tokens.USDC,
      token1: uniV3Tokens.USDT
    },
    'UNIV3: WBTC-ETH': {
      address: '0x2357685B07469eE80A389819C7A41edCD70cd88C',
      created: 12588569,
      nftId: '39445',
      uniNFTContract: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      uniPoolAddress: '0xCBCdF9626bC03E24f779434178A73a0B4bad62eD',
      token0: uniV3Tokens.WBTC,
      token1: uniV3Tokens.WETH
    },
    'UNIV3: ETH-USDT': {
      address: '0x5c49E0386215077d1A3eCc425CC30ce34Ec08B60',
      created: 12594171,
      nftId: '40413',
      uniNFTContract: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      uniPoolAddress: '0x4e68Ccd3E89f51C3074ca5072bbAC773960dFa36',
      token0: uniV3Tokens.WETH,
      token1: uniV3Tokens.USDT
    },
    'UNIV3: DAI-USDC': {
      address: '0xFb387177fF9Db15294F7Aebb1ea1e941f55695bc',
      created: 12588584,
      nftId: '39453',
      uniNFTContract: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
      uniPoolAddress: '0x6c6Bc977E13Df9b0de53b251522280BB72383700',
      token0: uniV3Tokens.DAI,
      token1: uniV3Tokens.USDC
    },
    'UNIV3: DAI-ETH': {
      address: '0x970CC1E0Bdb3B29a6A12BDE1954A8509acbC9158',
      created: 12594179,
      nftId: '40417',
      uniNFTContract: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      uniPoolAddress: '0xC2e9F25Be6257c210d7Adf0D4Cd6E3E881ba25f8',
      token0: uniV3Tokens.DAI,
      token1: uniV3Tokens.WETH
    },
    'UNIV3: UNI-ETH': {
      address: '0x3F16b084Ff94c8a3f5A1b60834046f1febD15595',
      created: 12594190,
      nftId: '40420',
      uniNFTContract: '0xc36442b4a4522e871399cd717abdd847ab11fe88',
      uniPoolAddress: '0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801',
      token0: uniV3Tokens.UNI,
      token1: uniV3Tokens.WETH
    },
  }

  async function getUniV3Vaults(vault, timestamp, block) {
    if (vault.created > block) return [];

    const positionsFn = sdk.api.abi.call({
      block,
      target: vault.uniNFTContract,
      abi: abi['uniV3Positions'],
      params: [vault.nftId]
    })

    const poolLiquidityFn = sdk.api.abi.call({
      block,
      target: vault.uniPoolAddress,
      abi: abi['uniV3Pool:liquidity']
    })

    const uniBalanceToken0Fn = sdk.api.abi.call({
      block,
      target: vault.token0,
      abi: 'erc20:balanceOf',
      params: [vault.uniPoolAddress]
    })

    const uniBalanceToken1Fn = sdk.api.abi.call({
      block,
      target: vault.token1,
      abi: 'erc20:balanceOf',
      params: [vault.uniPoolAddress]
    })

    const [positions, poolLiquidity, uniBalanceToken0, uniBalanceToken1] = await Promise.all([
      positionsFn,
      poolLiquidityFn,
      uniBalanceToken0Fn,
      uniBalanceToken1Fn
    ])

    const liquidityShare = BigNumber(positions.output.liquidity).div(BigNumber(poolLiquidity.output))

    const harvestBalanceToken0 = BigNumber.sum(
      BigNumber(uniBalanceToken0.output).times(liquidityShare),
      BigNumber(positions.output.tokensOwed0)
    )

    const harvestBalanceToken1 = BigNumber.sum(
      BigNumber(uniBalanceToken1.output).times(liquidityShare),
      BigNumber(positions.output.tokensOwed1)
    )

    return {
      [vault.token0]: harvestBalanceToken0,
      [vault.token1]: harvestBalanceToken1
    }
  }

  async function tvl(timestamp, block) {
    const assetAmounts = {}

    /////////////// Uni V3 vaults //////////////////
    const uniV3Values = await Promise.all(
      Object.values(uniV3Vaults).map(
        (vault) => getUniV3Vaults(vault, timestamp, block)
      )
    )

    uniV3Values.forEach((val) => {
      for (const [k, v] of Object.entries(val)) {
        let existingVal = BigNumber(assetAmounts[k] || 0)
        assetAmounts[k] = BigNumber.sum(existingVal, v)
      }
    })

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

    /// Cleanup undefined values
    delete assetAmounts[undefined]

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
