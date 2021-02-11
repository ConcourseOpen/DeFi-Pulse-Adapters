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
  pUNIWBTC: {
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
  pUNIBAC: {
    underlying: "UNIV2_BAC_DAI",
    decimals: 18,
    contract: "0x2350fc7268F3f5a6cC31f26c38f706E41547505d",
    created: 11601177,
  },
  pSLPMIC: {
    underlying: "SLP_MIC_USDT",
    decimals: 18,
    contract: "0xC66583Dd4E25b3cfc8D881F6DbaD8288C7f5Fd30",
    created: 11616982,
  },
  pDAI: {
    underlying: "DAI",
    decimals: 18,
    contract: "0x6949Bb624E8e8A90F87cD2058139fcd77D2F3F87",
    created: 11044219,
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
};

async function tvl(timestamp, block) {
  const [
    psCRV,
    prenCRV,
    p3CRV,
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
    pDAI,
  ] = await Promise.all([
    getUnderlying("psCRV-v2", block),
    getUnderlying("prenCRV", block),
    getUnderlying("p3CRV", block),
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
    getUnderlying("pDAI", block),
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
      .toFixed(0),

    // DAI
    "0x6B175474E89094C44Da98b954EedeAC495271d0F": pDAI
      .plus(pUNIDAI[0])
      .plus(pSLPDAI[0])
      .plus(pUNIBAC[1])
      .plus(psCRV) // Estimate
      .plus(p3CRV) // Estimate
      .toFixed(0),

    // USDC
    "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48": pUNIUSDC[0]
      .plus(pSLPUSDC[0])
      .toFixed(0),

    // USDT
    "0xdAC17F958D2ee523a2206206994597C13D831ec7": pUNIUSDT[1]
      .plus(pSLPUSDT[1])
      .plus(pSLPMIC[1])
      .toFixed(0),

    // WBTC
    "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599": pUNIWBTC[0]
      .plus(pSLPWBTC[0])
      .toFixed(0),

    // YFI
    "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e": pSLPYFI[0].toFixed(0),

    // BAC
    "0x3449fc1cd036255ba1eb19d65ff4ba2b8903a69a": pUNIBAC[0].toFixed(0),

    // MIC
    "0x368b3a58b5f49392e5c9e4c998cb0bb966752e51": pSLPMIC[0].toFixed(0),

    // RenBTC
    "0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D": prenCRV
      .times(BigNumber("10").pow(-10))
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
