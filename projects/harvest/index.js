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
    'V_WETH_#V1',
    'V_TUSD_#V1',
    'V_CRV_yDAI_yUSDC_yUSDT_yTUSD_#V1',
    'V_USDT_#V1',
    'V_CRV_3',
    'V_renBTC',
    'V_CRV_yDAI_yUSDC_yUSDT_yBUSD',
    'V_CRV_tbtc_sbtc',
    'V_CRV_cDAI_cUSDC',
    'V_CRV_usdn3CRV',
    'V_CRV_hCRV',
    'V_CRV_husd3CRV',
    'V_DSD',
    'V_CRV_oBTC_sbtcCRV',
    'V_CRV_oBTC_sbtcCRV_#V2',
    'V_CRV_oBTC_sbtcCRV_#V1',
    'V_ESD',
    'V_CRV_ust3CRV',
    'V_CRV_ust3CRV_#V1',
    'V_CRV_eursCRV',
    'V_CRV_steCRV',
    'V_CRV_a3CRV',
    'V_CRV_linkCRV',
    'V_SUSHI',
    'V_CRV_gusd3CRV_#V1',
    'V_CRV_gusd3CRV',
    'V_WBTC',
    'V_DAI_#V1',
    'V_USDC_#V1'
  ]

  const liquidityPools = [
    // 'V_UNI_WETH_USDT_#V1',
    // 'V_UNI_DAI_WETH_#V1',
    // 'V_UNI_WBTC_WETH_#V1',
    // 'V_SUSHI_WBTC_WETH',
    // 'V_SUSHI_WBTC_WETH_#V1',
    // 'V_SUSHI_WBTC_WETH_#V2',
    // 'V_SUSHI_DAI_WETH',
    // 'V_SUSHI_DAI_WETH_#V2',
    // 'V_UNI_USDC_WETH',
    // 'V_UNI_USDC_WETH_#V1',
    // 'V_SUSHI_WETH_USDT',
    // 'V_SUSHI_WETH_USDT_#V1',
    // 'V_UNI_DPI_WETH',
    // 'V_SUSHI_MIC_USDT',
    // 'V_UNI_BASv2_DAI',
    // 'V_SUSHI_MIS_USDT',
    // 'V_SUSHI_USDC_WETH_#V2',
    // 'V_UNI_DAI_BSGS',
    // 'V_UNI_DAI_BSGS_#V1',
    // 'V_UNI_DAI_BSG',
    // 'V_UNI_DAI_BSG_#V1',
    // 'V_UNI_DAI_BSG_#V2',
    // 'V_1INCH_ETH_DAI',
    // 'V_SUSHI_DAI_WETH_#V3',
    // 'V_SUSHI_WETH_USDT_#V2',
    // 'V_SUSHI_WBTC_WETH_#V2',
    // 'V_UNI_mTSLA_UST_#V1',
    // 'V_UNI_mTSLA_UST',
    // 'V_UNI_BAC_DAI',
    // 'V_UNI_UST_mAAPL',
    // 'V_UNI_mAMZN_UST',
    // 'V_UNI_mGOOGL_UST',
    // 'V_SUSHI_SUSHI_WETH',
    // 'V_UNI_WBTC_KLON',
    // 'V_UNI_WBTC_KlonX',
    // 'V_1INCH_ETH_1INCH',
    // 'V_SUSHI_UST_WETH',
    // 'V_UNI_UST_mTWTR',
    // 'V_UNI_WBTC_KBTC',
    // 'V_UNI_WBTC_KBTC_#V1',
    // 'V_UNI_UST_mNFLX',
    // 'V_UNI_ROPE20_WETH',
    // 'V_UNI_DUDES20_WETH',
    // 'V_UNI_WETH_MASK20',
    // 'V_UNI_MUSE_WETH',
    // 'V_CRV_usdp3CRV',
    // 'V_1INCH_1INCH_WBTC',
    // 'V_1INCH_1INCH_USDC',
    // 'V_UNI_MVI_WETH',
    // 'V_UNI_WETH_GPUNKS20',
    // 'V_UNI_MEME20_WETH',
    // 'V_UNI_KXUSD_DAI',
    // 'V_SUSHI_PERP_WETH',
    // 'V_BAC',
    // 'V_UNI_COMFI_WETH',
    'V_UNI_WETH_MCAT20',
    // 'V_ETHx5-USDC-1Jun21-LP',
    // 'V_SUSHI_LFBTC_LIFT',
    // 'V_SUSHI_WBTC_LFBTC',
    // 'V_SUSHI_USDC_WETH',
    // 'V_SUSHI_USDC_WETH_#V1'
  ]

  function getDataByContractName(contractName) {
    return ethVaults.find((data) => {
      return data.contract.name === contractName
    })
  }

  async function getSingleAssetVault(contractName, timestamp, block) {
    const vault = getDataByContractName(contractName)

    if (!vault) {
      throw(`Error: ${contractName} not found in eth-vaults.json`)
    }

    const [totalSupply, sharePrice, underlying] = await Promise.all([
      sdk.api.abi.call({ block, target: vault.contract.address, abi: 'erc20:totalSupply', }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABISharePrice'], }),
      sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABIUnderlyingUnit'], })
    ])

    const underlyingCount = new BigNumber(totalSupply.output)
      .times(new BigNumber(sharePrice.output))
      .div(new BigNumber(underlying.output))

    return([
      vault.underlying.address,
      underlyingCount
    ])
  }

  async function getLiquidityPool(contractName, timestamp, block) {
    const vault = getDataByContractName(contractName)

    if (!vault) {
      throw(`Error: ${contractName} not found in eth-vaults.json`)
    }

    console.log('yup')

    // const [totalSupply, sharePrice, underlying] = await Promise.all([
    //   sdk.api.abi.call({ block, target: vault.contract.address, abi: 'erc20:totalSupply', }),
    //   sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABISharePrice'], }),
    //   sdk.api.abi.call({ block, target: vault.contract.address, abi: abi['fABIUnderlyingUnit'], })
    // ])
    //
    // const underlyingCount = new BigNumber(totalSupply.output)
    //   .times(new BigNumber(sharePrice.output))
    //   .div(new BigNumber(underlying.output))
    //
    // return([
    //   vault.underlying.address,
    //   underlyingCount
    // ])
  }

  async function tvl(timestamp, block) {
    const assetAmounts = {}




    // Single asset vaults

    const vals = await Promise.all(singleAssetVaults.map((contractName) => getSingleAssetVault(contractName, timestamp, block)))

    vals.forEach((val) => {
      let existingVal = BigNumber(assetAmounts[val[0]] || 0)
      assetAmounts[val[0]] = BigNumber.sum(existingVal, val[1])
    })





    // Liquidity pools


    const vals = await Promise.all(liquidityPools.map((contractName) => getLiquidityPool(contractName, timestamp, block)))




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
