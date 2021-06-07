/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi.json");
const BigNumber = require("bignumber.js");
const ERROR = BigNumber(
  "3963877391197344453575983046348115674221700746820753546331534351508065746944"
);

/*==================================================
  TVL
  ==================================================*/

const pTokens = {
  "psCRV-v2": {
    underlying: "crvPlain3",
    decimals: 18,
    contract: "0x68d14d66B2B0d6E157c06Dc8Fefa3D8ba0e66a89",
    created: 10960582,
  },
  prenCRV: {
    underlying: "crvRenWBTC",
    decimals: 18,
    contract: "0x2E35392F4c36EBa7eCAFE4de34199b2373Af22ec",
    created: 11010899,
  },
  p3CRV: {
    underlying: "3Crv",
    decimals: 18,
    contract: "0x1BB74b5DdC1f4fC91D6f9E7906cf68bc93538e33",
    created: 11010886,
  },
  pstETHCRV: {
    underlying: "stETHCRV",
    decimals: 18,
    contract: "0x77c8a58d940a322aea02dbc8ee4a30350d4239ad",
    created: 11739120,
  },
  "pUNIETHDAI-v2": {
    underlying: "UNIV2_ETH_DAI",
    decimals: 18,
    contract: "0xCffA068F1E44D98D3753966eBd58D4CFe3BB5162",
    created: 10960589,
  },
  "pUNIUSDC-v2": {
    underlying: "UNIV2_ETH_USDC",
    decimals: 18,
    contract: "0x53Bf2E62fA20e2b4522f05de3597890Ec1b352C6",
    created: 10960600,
  },
  "pUNIUSDT-v2": {
    underlying: "UNIV2_ETH_USDT",
    decimals: 18,
    contract: "0x09FC573c502037B149ba87782ACC81cF093EC6ef",
    created: 10960613,
  },
  "pUNIWBTC": {
    underlying: "UNIV2_ETH_WBTC",
    decimals: 18,
    contract: "0xc80090AA05374d336875907372EE4ee636CBC562",
    created: 11010903,
  },
  pSLPDAI: {
    underlying: "SLP_ETH_DAI",
    decimals: 18,
    contract: "0x55282da27a3a02ffe599f6d11314d239dac89135",
    created: 11471458,
  },
  pSLPUSDC: {
    underlying: "SLP_ETH_USDC",
    decimals: 18,
    contract: "0x8c2d16b7f6d3f989eb4878ecf13d695a7d504e43",
    created: 11474356,
  },
  pSLPUSDT: {
    underlying: "SLP_ETH_USDT",
    decimals: 18,
    contract: "0xa7a37ae5cb163a3147de83f15e15d8e5f94d6bce",
    created: 11474366,
  },
  pSLPWBTC: {
    underlying: "SLP_ETH_WBTC",
    decimals: 18,
    contract: "0xde74b6c547bd574c3527316a2ee30cd8f6041525",
    created: 11474414,
  },
  pSLPYFI: {
    underlying: "SLP_ETH_YFI",
    decimals: 18,
    contract: "0x3261D9408604CC8607b687980D40135aFA26FfED",
    created: 11478790,
  },
  "pUNIBAC": {
    underlying: "UNIV2_BAC_DAI",
    decimals: 18,
    contract: "0x2350fc7268F3f5a6cC31f26c38f706E41547505d",
    created: 11601177,
  },
  "pSLPMIC": {
    underlying: "SLP_MIC_USDT",
    decimals: 18,
    contract: "0xC66583Dd4E25b3cfc8D881F6DbaD8288C7f5Fd30",
    created: 11616982,
  },
  "pSLPMIS": {
    underlying: "SLP_MIS_USDT",
    decimals: 18,
    contract: "0x0faa189afe8ae97de1d2f01e471297678842146d",
    created: 11732926,
  },
  pSLPYVECRV: {
    underlying: "SLP_ETH_YVECRV",
    decimals: 18,
    contract: "0x5eff6d166d66bacbc1bf52e2c54dd391ae6b1f48",
    created: 11804603,
  },
  pDAI: {
    underlying: "DAI",
    decimals: 18,
    contract: "0x6949Bb624E8e8A90F87cD2058139fcd77D2F3F87",
    created: 11044219,
  },
  pUNIMIRUST: {
    underlying: "UNIV2_MIR_UST",
    decimals: 18,
    contract: "0x3Bcd97dCA7b1CED292687c97702725F37af01CaC",
    created: 11888779,
  },
  pUNImTSLAUST: {
    underlying: "UNIV2_mTSLA_UST",
    decimals: 18,
    contract: "0xaFB2FE266c215B5aAe9c4a9DaDC325cC7a497230",
    created: 12053691,
  },
  pUNImAAPLUST: {
    underlying: "UNIV2_mAAPL_UST",
    decimals: 18,
    contract: "0xF303B35D5bCb4d9ED20fB122F5E268211dEc0EBd",
    created: 12055550,
  },
  pUNImQQQUST: {
    underlying: "UNIV2_QQQ_UST",
    decimals: 18,
    contract: "0x7C8de3eE2244207A54b57f45286c9eE1465fee9f",
    created: 12055602,
  },
  pUNImSLVUST: {
    underlying: "UNIV2_mSLV_UST",
    decimals: 18,
    contract: "0x1ed1fD33b62bEa268e527A622108fe0eE0104C07",
    created: 12055633,
  },
  pUNImBABAUST: {
    underlying: "UNIV2_mBABA_UST",
    decimals: 18,
    contract: "0x1CF137F651D8f0A4009deD168B442ea2E870323A",
    created: 12056041,
  },
  pSLPSUSHIETH: {
    underlying: "SLP_SUSHI_ETH",
    decimals: 18,
    contract: "0xECb520217DccC712448338B0BB9b08Ce75AD61AE",
    created: 12107605,
  },
  pUNIFEITRIBE: {
    underlying: "UNIV2_FEI_TRIBE",
    decimals: 18,
    contract: "0xC1513C1b0B359Bc5aCF7b772100061217838768B",
    created: 12185238,
  },
  pSLPYVBOOSTETH: {
    underlying: "SLP_YVBOOST_ETH",
    decimals: 18,
    contract: "0xCeD67a187b923F0E5ebcc77C7f2F7da20099e378",
    created: 12205849,
  },
  pUNILUSDETH: {
    underlying: "UNIV2_LUSD_ETH",
    decimals: 18,
    contract: "0x927e3bCBD329e89A8765B52950861482f0B227c4",
    created: 12254395,
  },
  pSUSHIALCX: {
    underlying: "SLP_SUSHI_ALCX",
    decimals: 18,
    contract: "0x9eb0aAd5Bb943D3b2F7603Deb772faa35f60aDF9",
    created: 12294044,
  },
  pYEARNUSDCV2: {
    underlying: "USDC",
    decimals: 6,
    contract: "0xEB801AB73E9A2A482aA48CaCA13B1954028F4c94",
    created: 12389759	,
  },
  pYEARNCRVLUSD: {
    underlying: "lusdCRV",
    decimals: 18,
    contract: "0x4fFe73Cf2EEf5E8C8E0E10160bCe440a029166D2",
    created: 12389563,
  },
};

const uniPools = {
  UNIV2_ETH_DAI: {
    contract: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
    created: 10042267,
    token0: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  UNIV2_ETH_USDC: {
    contract: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
    created: 10008355,
    token0: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  UNIV2_ETH_USDT: {
    contract: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
    created: 10093341,
    token0: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    token1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  UNIV2_ETH_WBTC: {
    contract: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
    created: 10091097,
    token0: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  UNIV2_BAC_DAI: {
    contract: "0xd4405F0704621DBe9d4dEA60E128E0C3b26bddbD",
    created: 11355401,
    token0: "0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a",
    token1: "0x6b175474e89094c44da98b954eedeac495271d0f",
  },
  UNIV2_MIR_UST: {
    contract: "0x87dA823B6fC8EB8575a235A824690fda94674c88",
    created: 11381053,
    token0: "0x09a3ecafa817268f77be1283176b946c4ff2e608",
    token1: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
  },
  UNIV2_mTSLA_UST: {
    contract: "0x5233349957586A8207c52693A959483F9aeAA50C",
    created: 11380570,
    token0: "0x21ca39943e91d704678f5d00b6616650f066fd63",
    token1: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
  },
  UNIV2_mAAPL_UST: {
    contract: "0xB022e08aDc8bA2dE6bA4fECb59C6D502f66e953B",
    created: 11380524,
    token0: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
    token1: "0xd36932143f6ebdedd872d5fb0651f4b72fd15a84",
  },
  UNIV2_QQQ_UST: {
    contract: "0x9E3B47B861B451879d43BBA404c35bdFb99F0a6c",
    created: 11380653,
    token0: "0x13b02c8de71680e71f0820c996e4be43c2f57d15",
    token1: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
  },
  UNIV2_mSLV_UST: {
    contract: "0x860425bE6ad1345DC7a3e287faCBF32B18bc4fAe",
    created: 11380858,
    token0: "0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676",
    token1: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
  },
  UNIV2_mBABA_UST: {
    contract: "0x676Ce85f66aDB8D7b8323AeEfe17087A3b8CB363",
    created: 11380792,
    token0: "0x56aa298a19c93c6801fdde870fa63ef75cc0af72",
    token1: "0xa47c8bf37f92abed4a126bda807a7b7498661acd",
  },
  UNIV2_FEI_TRIBE: {
    contract: "0x9928e4046d7c6513326cCeA028cD3e7a91c7590A",
    created: 12125707,
    token0: "0x956F47F50A910163D8BF957Cf5846D573E7f87CA",
    token1: "0xc7283b66eb1eb5fb86327f08e1b5816b0720212b",
  },
  UNIV2_LUSD_ETH: {
    contract: "0xF20EF17b889b437C151eB5bA15A47bFc62bfF469",
    created: 12178599,
    token0: "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  // Sushiswap Pools
  SLP_ETH_DAI: {
    contract: "0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f",
    created: 10829331,
    token0: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  SLP_ETH_USDC: {
    contract: "0x397FF1542f962076d0BFE58eA045FfA2d347ACa0",
    created: 10829331,
    token0: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  SLP_ETH_USDT: {
    contract: "0x06da0fd433c1a5d7a4faa01111c044910a184553",
    created: 10822038,
    token0: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    token1: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  SLP_ETH_WBTC: {
    contract: "0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58",
    created: 10840845,
    token0: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  SLP_ETH_YFI: {
    contract: "0x088ee5007C98a9677165D78dD2109AE4a3D04d0C",
    created: 10829310,
    token0: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  SLP_MIC_USDT: {
    contract: "0xC9cB53B48A2f3A9e75982685644c1870F1405CCb",
    created: 11549969,
    token0: "0x368b3a58b5f49392e5c9e4c998cb0bb966752e51",
    token1: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  SLP_MIS_USDT: {
    contract: "0x066f3a3b7c8fa077c71b9184d862ed0a4d5cf3e0",
    created: 11549972,
    token0: "0x4b4d2e899658fb59b1d518b68fe836b100ee8958",
    token1: "0xdac17f958d2ee523a2206206994597c13d831ec7",
  },
  SLP_ETH_YVECRV: {
    contract: "0x10b47177e92ef9d5c6059055d92ddf6290848991",
    created: 11549972,
    token0: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    token1: "0xc5bddf9843308380375a611c18b50fb9341f502a",
  },
  SLP_SUSHI_ETH: {
    contract: "0x795065dCc9f64b5614C407a6EFDC400DA6221FB0",
    created: 10829340,
    token0: "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  SLP_YVBOOST_ETH: {
    contract: "0x9461173740D27311b176476FA27e94C681b1Ea6b",
    created: 12197654,
    token0: "0x9d409a0a012cfba9b15f6d4b36ac57a46966ab9a",
    token1: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  SLP_SUSHI_ALCX: {
    contract: "0xC3f279090a47e80990Fe3a9c30d24Cb117EF91a8",
    created: 11937674,
    token0: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    token1: "0xdbdb4d16eda451d0503b854cf79d55697f90c8df",
  },
};

async function tvl(timestamp, block) {
  const [
    psCRV,
    prenCRV,
    p3CRV,
    pstETHCRV,
    pUNIDAI,
    pUNIUSDC,
    pUNIUSDT,
    pUNIWBTC,
    pSLPDAI,
    pSLPUSDC,
    pSLPUSDT,
    pSLPWBTC,
    pSLPYFI,
    pUNIBAC,
    pSLPMIC,
    pSLPMIS,
    pSLPYVECRV,
    pDAI,
    pUNIMIRUST,
    pUNImTSLAUST,
    pUNImAAPLUST,
    pUNImQQQUST,
    pUNImSLVUST,
    pUNImBABAUST,
    pSLPSUSHIETH,
    pUNIFEITRIBE,
    pSLPYVBOOSTETH,
    pUNILUSDETH,
    pSUSHIALCX,
    pYEARNUSDCV2,
    pYEARNCRVLUSD
  ] = await Promise.all([
    getUnderlying("psCRV-v2", block),
    getUnderlying("prenCRV", block),
    getUnderlying("p3CRV", block),
    getUnderlying("pstETHCRV", block),
    getUniswapUnderlying("pUNIETHDAI-v2", block),
    getUniswapUnderlying("pUNIUSDC-v2", block),
    getUniswapUnderlying("pUNIUSDT-v2", block),
    getUniswapUnderlying("pUNIWBTC", block),
    getUniswapUnderlying("pSLPDAI", block),
    getUniswapUnderlying("pSLPUSDC", block),
    getUniswapUnderlying("pSLPUSDT", block),
    getUniswapUnderlying("pSLPWBTC", block),
    getUniswapUnderlying("pSLPYFI", block),
    getUniswapUnderlying("pUNIBAC", block),
    getUniswapUnderlying("pSLPMIC", block),
    getUniswapUnderlying("pSLPMIS", block),
    getUniswapUnderlying("pSLPYVECRV", block),
    getUnderlying("pDAI", block),
    getUniswapUnderlying("pUNIMIRUST", block),
    getUniswapUnderlying("pUNImTSLAUST", block),
    getUniswapUnderlying("pUNImAAPLUST", block),
    getUniswapUnderlying("pUNImQQQUST", block),
    getUniswapUnderlying("pUNImSLVUST", block),
    getUniswapUnderlying("pUNImBABAUST", block),
    getUniswapUnderlying("pSLPSUSHIETH", block),
    getUniswapUnderlying("pUNIFEITRIBE", block),
    getUniswapUnderlying("pSLPYVBOOSTETH", block),
    getUniswapUnderlying("pUNILUSDETH", block),
    getUniswapUnderlying("pSUSHIALCX", block),
    getUnderlying("pYEARNUSDCV2", block),
    getUnderlying("pYEARNCRVLUSD", block),
  ]);

  let balances = {
    // WETH
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2": pUNIDAI[1]
      .plus(pUNIUSDC[1])
      .plus(pUNIUSDT[0])
      .plus(pUNIWBTC[1])
      .plus(pSLPDAI[1])
      .plus(pSLPUSDC[1])
      .plus(pSLPUSDT[0])
      .plus(pSLPWBTC[1])
      .plus(pSLPYFI[1])
      .plus(pSLPYVECRV[0])
      .plus(pstETHCRV) // Estimate
      .plus(pSLPSUSHIETH[1])
      .plus(pSLPYVBOOSTETH[1])
      .plus(pUNILUSDETH[1])
      .plus(pSUSHIALCX[0])
      .plus(pSLPSUSHIETH[1])
      .toFixed(0),

    // DAI
    "0x6B175474E89094C44Da98b954EedeAC495271d0F": pDAI
      .plus(pUNIDAI[0])
      .plus(pSLPDAI[0])
      .plus(pUNIBAC[1])
      .plus(psCRV) // Estimate
      .plus(p3CRV) // Estimate
      .plus(pYEARNCRVLUSD) // Estimate
      .toFixed(0),

    // USDC
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": pUNIUSDC[0]
      .plus(pSLPUSDC[0])
      .plus(pYEARNUSDCV2)
      .toFixed(0),

    // USDT
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": pUNIUSDT[1]
      .plus(pSLPUSDT[1])
      .plus(pSLPMIC[1])
      .plus(pSLPMIS[1])
      .toFixed(0),

    // WBTC
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": pUNIWBTC[0]
      .plus(pSLPWBTC[0])
      .toFixed(0),

    // YFI
    "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e": pSLPYFI[0].toFixed(0),

    // SUSHI
    "0x6b3595068778dd592e39a122f4f5a5cf09c90fe2": pSLPSUSHIETH[0].toFixed(0),

    // FEI
    "0x956F47F50A910163D8BF957Cf5846D573E7f87CA": pUNIFEITRIBE[0].toFixed(0),

    // TRIBE
    "0xc7283b66eb1eb5fb86327f08e1b5816b0720212b": pUNIFEITRIBE[1].toFixed(0),

    // YVBOOST
    "0x9d409a0a012cfba9b15f6d4b36ac57a46966ab9a": pSLPYVBOOSTETH[0].toFixed(0),

    // LUSD
    "0x5f98805A4E8be255a32880FDeC7F6728C6568bA0": pUNILUSDETH[0].toFixed(0),

    // ALCX
    "0xdbdb4d16eda451d0503b854cf79d55697f90c8df": pSUSHIALCX[1].toFixed(0),

    // BAC
    "0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a": pUNIBAC[0].toFixed(0),

    // MIC
    "0x368b3a58b5f49392e5c9e4c998cb0bb966752e51": pSLPMIC[0].toFixed(0),

    // MIS
    "0x4b4D2e899658FB59b1D518b68fe836B100ee8958": pSLPMIS[0].toFixed(0),

    // yveCRV
    "0xc5bddf9843308380375a611c18b50fb9341f502a": pSLPYVECRV[1].toFixed(0),    

    // RenBTC
    "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D": prenCRV
      .times(BigNumber("10").pow(-10))
      .toFixed(0),

    // MIR
    "0x09a3ecafa817268f77be1283176b946c4ff2e608": pUNIMIRUST[0].toFixed(0), 
    
    // mTSLA
    "0x21ca39943e91d704678f5d00b6616650f066fd63": pUNImTSLAUST[0].toFixed(0),

    // mAAPL
    "0xd36932143f6ebdedd872d5fb0651f4b72fd15a84": pUNImAAPLUST[0].toFixed(0),

    // mQQQ
    "0x13b02c8de71680e71f0820c996e4be43c2f57d15": pUNImQQQUST[0].toFixed(0),

    // mSLV
    "0x9d1555d8cB3C846Bb4f7D5B1B1080872c3166676": pUNImSLVUST[0].toFixed(0),

    // mBABA
    "0x56aa298a19c93c6801fdde870fa63ef75cc0af72": pUNImBABAUST[0].toFixed(0),

    // UST
    "0xa47c8bf37f92abed4a126bda807a7b7498661acd": pUNIMIRUST[1]
      .plus(pUNImTSLAUST[1])
      .plus(pUNImAAPLUST[1])
      .plus(pUNImQQQUST[1])
      .plus(pUNImSLVUST[1])
      .plus(pUNImBABAUST[1])
      .toFixed(0),
  };
  console.table(balances)
  return balances;
}

async function getUnderlying(token, block) {
  if (block > pTokens[token].created) {
    try {
      const balance = await sdk.api.abi.call({
        block,
        target: pTokens[token].contract,
        abi: abi["balance"],
      });

      return BigNumber(balance.output);
    } catch (e) {
      return BigNumber(0);
    }
  }
  return BigNumber(0);
}

async function getUniswapUnderlying(token, block) {
  if (block > pTokens[token].created) {
    try {
      const underlyingPool = uniPools[pTokens[token].underlying];

      const [totalSupply, reserves, balance] = await Promise.all([
        sdk.api.abi.call({
          block,
          target: underlyingPool.contract,
          abi: "erc20:totalSupply",
        }),
        sdk.api.abi.call({
          block,
          target: underlyingPool.contract,
          abi: abi["getReserves"],
        }),
        sdk.api.abi.call({
          block,
          target: pTokens[token].contract,
          abi: abi["balance"],
        }),
      ]);

      const poolUnderlyingReservesToken0 = BigNumber(reserves.output[0]);
      const poolUnderlyingReservesToken1 = BigNumber(reserves.output[1]);
      const poolFraction = BigNumber(balance.output).div(
        BigNumber(totalSupply.output)
      );

      if (!poolFraction.isNaN() && !poolFraction.isEqualTo(ERROR)) {
        return [
          poolFraction.times(poolUnderlyingReservesToken0),
          poolFraction.times(poolUnderlyingReservesToken1),
        ];
      }
    } catch (e) {
      return [BigNumber(0), BigNumber(0)];
    }
  }
  return [BigNumber(0), BigNumber(0)];
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Pickle Finance", // project name
  website: "https://pickle.finance",
  token: "PICKLE", // null, or token symbol if project has a custom token
  category: "Assets", // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1598893200, // unix timestamp (utc 0) specifying when the project began, or where live data begins
  tvl, // tvl adapter
};
