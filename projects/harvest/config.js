const fs = require('fs');
const path = require('path');

const vaults = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'ethparser-vaults.json'), 'utf-8')).data;

const getVaultByContractName = (contractName) => {
  return vaults.find((data) => {
    return data.contract.name === contractName
  })
}

const singleAssetVaults = [
  'V_CRV_3',
  'V_CRV_a3CRV',
  'V_CRV_cDAI_cUSDC',
  'V_CRV_eursCRV',
  'V_CRV_gusd3CRV_#V1',
  'V_CRV_gusd3CRV',
  'V_CRV_hCRV',
  'V_CRV_husd3CRV',
  'V_CRV_linkCRV',
  'V_CRV_oBTC_sbtcCRV_#V1',
  'V_CRV_oBTC_sbtcCRV_#V2',
  'V_CRV_oBTC_sbtcCRV',
  'V_CRV_steCRV',
  'V_CRV_tbtc_sbtc',
  'V_CRV_usdn3CRV',
  'V_CRV_usdp3CRV',
  'V_CRV_ust3CRV_#V1',
  'V_CRV_ust3CRV',
  'V_CRV_yDAI_yUSDC_yUSDT_yBUSD',
  'V_CRV_yDAI_yUSDC_yUSDT_yTUSD_#V1',
  'V_DAI_#V1',
  'V_DSD',
  'V_ESD',
  'V_renBTC',
  'V_SUSHI',
  'V_TUSD_#V1',
  'V_USDC_#V1',
  'V_USDC_#V1',
  'V_USDT_#V1',
  'V_WBTC',
  'V_WETH_#V1',
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
  'V_SUSHI_WBTC_WETH_#V1',
  'V_SUSHI_DAI_WETH_#V3',
]

const oldMooniswapVaults = [
  'V_1INCH_1INCH_USDC',
  'V_1INCH_ETH_1INCH',
  'V_1INCH_1INCH_WBTC'
]

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
    default:
      return vault.underlying.address
  }
}

const curveTokens = {
  USDC: { address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', decimals: 6 },
  BTC: { address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', decimals: 8 },
  ETH: { address: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', decimals: 18 },
  LINK: { address: '0x514910771af9ca656af840dff83e8264ecf986ca', decimals: 18 },
  EURS: { address: '0xdb25f211ab05b1c97d595516f45794528a807ad8', decimals: 2 },
}

// CRV vaults need to be "redirected" so the adapter thinks that their value
// is in the underlying token
const curveMappings = {
  'V_CRV_3': curveTokens.USDC,
  'V_CRV_a3CRV': curveTokens.USDC,
  'V_CRV_eursCRV': curveTokens.EURS,
  'V_CRV_gusd3CRV_#V1': curveTokens.USDC,
  'V_CRV_gusd3CRV': curveTokens.USDC,
  'V_CRV_hCRV': curveTokens.BTC,
  'V_CRV_husd3CRV': curveTokens.USDC,
  'V_CRV_linkCRV': curveTokens.LINK,
  'V_CRV_oBTC_sbtcCRV_#V1': curveTokens.BTC,
  'V_CRV_oBTC_sbtcCRV_#V2': curveTokens.BTC,
  'V_CRV_oBTC_sbtcCRV': curveTokens.BTC,
  'V_CRV_steCRV': curveTokens.ETH,
  'V_CRV_tbtc_sbtc': curveTokens.BTC,
  'V_CRV_usdn3CRV': curveTokens.USDC,
  'V_CRV_usdp3CRV': curveTokens.USDC,
  'V_CRV_ust3CRV_#V1': curveTokens.USDC,
  'V_CRV_ust3CRV': curveTokens.USDC,
}

module.exports = {
  vaults,
  singleAssetVaults,
  liquidityPools,
  oldMooniswapVaults,
  getVaultByContractName,
  getUnderlyingAddressByVault,
  curveMappings
}
