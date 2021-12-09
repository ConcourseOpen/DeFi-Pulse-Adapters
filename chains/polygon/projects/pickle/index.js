/*==================================================
  Modules
  ==================================================*/

  const sdk = require("../../../../sdk");
  const abi = require("./abi.json");
  const BigNumber = require("bignumber.js");
  const ERROR = BigNumber(
    "3963877391197344453575983046348115674221700746820753546331534351508065746944"
  );
  
  /*==================================================
    TVL
    ==================================================*/
  
  const pTokens = {
    pCOMETHWETHUSDC: {
      underlying: "comethwethusdc",
      decimals: 18,
      contract: "0x9eD7e3590F2fB9EEE382dfC55c71F9d3DF12556c",
      created: 13624727,
    },
    pCOMETHPICKLEMUST: {
      underlying: "comethpicklemust",
      decimals: 18,
      contract: "0x7512105DBb4C0E0432844070a45B7EA0D83a23fD",
      created: 15164840,
    },
    pCOMETHMATICMUST: {
      underlying: "comethmaticmust",
      decimals: 18,
      contract: "0x91bcc0BBC2ecA760e3b8A79903CbA53483A7012C",
      created: 15164454,
    },
    pAAVEDAI: {
      underlying: "aavedai",
      decimals: 18,
      contract: "0x0519848e57Ba0469AA5275283ec0712c91e20D8E",
      created: 14164165,
    },
    pCRVAAVE: {
      underlying: "crvaave",
      decimals: 18,
      contract: "0x261b5619d85B710f1c2570b65ee945975E2cC221",
      created: 14172938,
    },
    pSLPETHUSDT: {
      underlying: "sushiethusdt",
      decimals: 18,
      contract: "0x80aB65b1525816Ffe4222607EDa73F86D211AC95",
      created: 15165384,
    },
    pSLPMATICETH: {
      underlying: "sushimaticeth",
      decimals: 18,
      contract: "0xd438Ba7217240a378238AcE3f44EFaaaF8aaC75A",
      created: 15208969,
    },
    pQUICKMIMATICUSDC: {
      underlying: "quickmimaticusdc",
      decimals: 18,
      contract: "0x74dC9cdCa9a96Fd0B7900e6eb953d1EA8567c3Ce",
      created: 16364140,
    },
  };
  
  const uniPools = {
    // Polygon Pools
    comethwethusdc: {
      contract: "0x1Edb2D8f791D2a51D56979bf3A25673D6E783232",
      created: 11809952,
      token0: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      token1: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    },
    comethpicklemust: {
      contract: "0xb0b5E3Bd18eb1E316bcD0bBa876570b3c1779C55",
      created: 12103374,
      token0: "0x2b88ad57897a8b496595925f43048301c37615da",
      token1: "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f",
    },
    comethmaticmust: {
      contract: "0x80676b414a905De269D0ac593322Af821b683B92",
      created: 11877664,
      token0: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      token1: "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f",
    },
    sushiethusdt: {
      contract: "0xc2755915a85C6f6c1C0F3a86ac8C058F11Caa9C9",
      created: 13067704,
      token0: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
      token1: "0xc2132d05d31c914a87c6611c10748aeb04b58e8f",
    },
    sushimaticeth: {
      contract: "0xc4e595acDD7d12feC385E5dA5D43160e8A0bAC0E",
      created: 11333973,
      token0: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
      token1: "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619",
    },
    quickmimaticusdc: {
      contract: "0x160532D2536175d65C03B97b0630A9802c274daD",
      created: 14026112,
      token0: "0xa3fa99a148fa48d14ed51d610c367c61876997f1",
      token1: "0x2791bca1f2de4661ed88a30c99a7a9449aa84174",
    },
  };
  
  async function tvl(timestamp, block) {
  
    const pAAVEDAI = await getUnderlying("pAAVEDAI", block);
    const [
      pCRVAAVE,
      pCOMETHWETHUSDC,
      pCOMETHPICKLEMUST,
      pCOMETHMATICMUST,
      pSLPETHUSDT,
      pSLPMATICETH,
      pQUICKMIMATICUSDC
    ] = await Promise.all([
      getUnderlying("pCRVAAVE", block),
      getUniswapUnderlying("pCOMETHWETHUSDC", block),
      getUniswapUnderlying("pCOMETHPICKLEMUST", block),
      getUniswapUnderlying("pCOMETHMATICMUST", block),
      getUniswapUnderlying("pSLPETHUSDT", block),
      getUniswapUnderlying("pSLPMATICETH", block),
      getUniswapUnderlying("pQUICKMIMATICUSDC", block),
    ]);
  
    let balances = {};
    let WETH = ({
      // Polygon WETH
      "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619": (Number(pCOMETHWETHUSDC[0])
        + Number(pSLPETHUSDT[0])
        + Number(pSLPMATICETH[1]))
    });
    let USDC =
      {// Polygon USDC
      "0x2791bca1f2de4661ed88a30c99a7a9449aa84174": (Number(pCOMETHWETHUSDC[1]) + Number(pQUICKMIMATICUSDC[1]))
      };
    let PICKLE =
      // Polygon PICKLE
      {"0x2b88ad57897a8b496595925f43048301c37615da": pCOMETHPICKLEMUST[0]};
    let MUST =
      {   // Polygon MUST
        "0x9c78ee466d6cb57a4d01fd887d2b5dfb2d46288f": (Number(pCOMETHPICKLEMUST[1]) + Number(pCOMETHMATICMUST[1])) };
    // Polygon MATIC
    let MATIC = ({"0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": (Number(pCOMETHMATICMUST[0]) + Number(pSLPMATICETH[0]))});
    // Polygon DAI
    let DAI = ({"0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063": (Number(pAAVEDAI) + Number(pCRVAAVE))});
    // Polygon USDT
    let USDT = ({"0xc2132d05d31c914a87c6611c10748aeb04b58e8f": pSLPETHUSDT[1]});
    // Polygon MIMATIC
    let MIMATIC = ({"0xa3fa99a148fa48d14ed51d610c367c61876997f1": pQUICKMIMATICUSDC[0]});
  
    balances = Object.assign(WETH, USDC, PICKLE, MUST, MATIC, DAI, USDT, MIMATIC);
    //console.table(balances)
    return balances;
  }
  
  async function getUnderlying(token, block) {
    if (block > pTokens[token].created) {
      try {
        const balance = await sdk.api.abi.call({
          block,
          target: pTokens[token].contract,
          abi: abi["balance"],
          chain: 'polygon'
        });
  
        return balance.output;
      } catch (e) {
        return 0;
      }
    }
    return 0;
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
            chain: 'polygon'
          }),
          sdk.api.abi.call({
            block,
            target: underlyingPool.contract,
            abi: abi["getReserves"],
            chain: 'polygon'
          }),
          sdk.api.abi.call({
            block,
            target: pTokens[token].contract,
            abi: abi["balance"],
            chain: 'polygon'
          }),
        ]);
  
        const poolUnderlyingReservesToken0 = reserves.output[0];
        const poolUnderlyingReservesToken1 = reserves.output[1];
        const poolFraction = balance.output / totalSupply.output;
  
        if (!poolFraction.isNaN() && !poolFraction.isEqualTo(ERROR)) {
          return [
            poolFraction * poolUnderlyingReservesToken0,
            poolFraction * poolUnderlyingReservesToken1,
          ];
        }
      } catch (e) {
        return [(0), (0)];
      }
    }
    return [(0), (0)];
  }
  
  /*==================================================
    Exports
    ==================================================*/
  
  module.exports = {
    name: "Pickle Finance_Polygon", // project name
    website: "https://pickle.finance",
    token: "PICKLE", // null, or token symbol if project has a custom token
    chain: "polygon",
    category: "Assets", // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1620416851, // unix timestamp (utc 0) specifying when the project began, or where live data begins
    tvl, // tvl adapter
  };
  