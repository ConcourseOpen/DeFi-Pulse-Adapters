const fs = require('fs');
const path = require('path');

const vaults = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'ethparser-vaults.json'), 'utf-8')).data;

const pools = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'ethparser-pools.json'), 'utf-8')).data;

const getVaultByContractName = (contractName) => {
  return vaults.find((data) => {
    return data.contract.name === contractName
  })
}

// should we include iFarm??

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
  'V_USDC_#V1',
  'V_CRV_usdp3CRV'
];

const liquidityPools = [
  'V_UNI_WETH_USDT_#V1',
  'V_UNI_DAI_WETH_#V1',
  'V_UNI_WBTC_WETH_#V1',
  'V_SUSHI_WBTC_WETH',
  'V_SUSHI_DAI_WETH',
  'V_SUSHI_DAI_WETH_#V2',
  'V_UNI_USDC_WETH_#V1',
  'V_SUSHI_WETH_USDT',
  'V_SUSHI_WETH_USDT_#V1',
  'V_UNI_DPI_WETH',
  'V_SUSHI_MIC_USDT',
  'V_UNI_BASv2_DAI',
  'V_SUSHI_MIS_USDT',
  'V_UNI_DAI_BSGS',
  'V_UNI_DAI_BSGS_#V1',
  'V_UNI_DAI_BSG',
  'V_UNI_DAI_BSG_#V1',
  'V_UNI_DAI_BSG_#V2',
  'V_UNI_mTSLA_UST_#V1',
  'V_UNI_mTSLA_UST',
  'V_UNI_BAC_DAI',
  'V_UNI_UST_mAAPL',
  'V_UNI_mAMZN_UST',
  'V_UNI_mGOOGL_UST',
  'V_SUSHI_SUSHI_WETH',
  'V_UNI_WBTC_KLON',
  'V_UNI_WBTC_KlonX',
  'V_SUSHI_UST_WETH',
  'V_UNI_UST_mTWTR',
  'V_UNI_WBTC_KBTC',
  'V_UNI_WBTC_KBTC_#V1',
  'V_UNI_UST_mNFLX',
  'V_UNI_ROPE20_WETH',
  'V_UNI_DUDES20_WETH',
  'V_UNI_WETH_MASK20',
  'V_UNI_MUSE_WETH',
  'V_UNI_MVI_WETH',
  'V_UNI_WETH_GPUNKS20',
  'V_UNI_MEME20_WETH',
  'V_UNI_KXUSD_DAI',
  'V_SUSHI_PERP_WETH',
  'V_UNI_COMFI_WETH',
  'V_SUSHI_LFBTC_LIFT',
  'V_SUSHI_WBTC_LFBTC',
  'V_SUSHI_USDC_WETH',
  'V_SUSHI_USDC_WETH_#V1',
  'V_UNI_WETH_MCAT20',
  'V_SUSHI_WBTC_WETH_#V2',
  'V_SUSHI_WBTC_WETH_#V1',
  'V_SUSHI_USDC_WETH_#V2',
  'V_SUSHI_WETH_USDT_#V2',
  'V_SUSHI_DAI_WETH_#V3',
]

// TODO old mooniswap vaults
// V_1INCH_1INCH_USDC,
// V_1INCH_ETH_1INCH
// V_1INCH_1INCH_WBTC

module.exports = {
  vaults,
  pools,
  singleAssetVaults,
  liquidityPools,
  getVaultByContractName
}
