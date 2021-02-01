/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi.json");
const Bignumber = require("bignumber.js");
const axios = require("axios");
const { request, gql } = require("graphql-request");

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const ethAddress = "0x0000000000000000000000000000000000000000";
  let balances = {
    [ethAddress]: "0", // ETH
  };

  const tvls = await Promise.all([
    tvlV1(timestamp, block),
    tvlV2(timestamp, block),
  ]);

  const tvl = Bignumber.sum(...tvls);

  balances[ethAddress] = tvl.toFixed(0);

  return balances;
}

async function tvlV1(timestamp, block) {
  const startTimestamp = 1602054167;
  const startBlock = 11007158;

  if (timestamp < startTimestamp || block < startBlock) {
    return Bignumber(0);
  }

  const { data } = await axios.get(
    "https://homora.alphafinance.io/static/contracts.json"
  );

  const bankAddress = data.bankAddress.toLowerCase();
  const WETHAddress = data.WETHAddress.toLowerCase();

  let pools = data.pools;

  const uniswapPools = pools.filter(
    (pool) => pool.exchange === "Uniswap" || pool.exchange === "IndexCoop"
  );

  const sushiswapPools = pools.filter(
    (pool) => pool.exchange === "Sushi" || pool.exchange === "Pickle"
  );
  pools = [...uniswapPools, ...sushiswapPools];

  const { output: _totalETH } = await sdk.api.abi.call({
    target: bankAddress,
    block,
    abi: abi["totalETH"],
  });

  const totalETH = Bignumber(_totalETH);

  const { output: _totalDebt } = await sdk.api.abi.call({
    target: bankAddress,
    block,
    abi: abi["glbDebtVal"],
  });

  const totalDebt = Bignumber(_totalDebt);

  // Uniswap Pools
  const { output: _UnilpTokens } = await sdk.api.abi.multiCall({
    calls: uniswapPools.map((pool) => ({
      target: pool.lpStakingAddress,
      params: [pool.goblinAddress],
    })),
    abi: abi["balanceOf"],
    block,
  });

  // Sushiswap Pools
  const { output: _SushilpTokens } = await sdk.api.abi.multiCall({
    calls: sushiswapPools.map((pool) => ({
      target: pool.lpStakingAddress,
      params: [pool.id, pool.goblinAddress],
    })),
    abi: abi["userInfo"],
    block,
  });

  const _lpTokens = [
    ..._UnilpTokens,
    ..._SushilpTokens.map((x) => ({
      output: x.output[0],
    })),
  ];

  const lpTokens = _lpTokens.map((_lpToken) => Bignumber(_lpToken.output || 0));

  const { output: _totalETHOnStakings } = await sdk.api.abi.multiCall({
    calls: pools.map((pool) => ({
      target: WETHAddress,
      params: [pool.lpTokenAddress],
    })),
    abi: abi["balanceOf"],
    block,
  });

  const totalETHOnStakings = _totalETHOnStakings.map((stake) =>
    Bignumber(stake.output || 0)
  );

  const { output: _totalLpTokens } = await sdk.api.abi.multiCall({
    calls: pools.map((pool) => ({
      target: pool.lpTokenAddress,
    })),
    abi: abi["totalSupply"],
    block,
  });

  const totalLpTokens = _totalLpTokens.map((_totalLpToken) =>
    Bignumber(_totalLpToken.output || 0)
  );

  const unUtilizedValue = totalETH.minus(totalDebt);

  let tvl = Bignumber(unUtilizedValue);
  for (let i = 0; i < lpTokens.length; i++) {
    if (totalLpTokens[i].gt(0)) {
      const amount = lpTokens[i]
        .times(totalETHOnStakings[i])
        .div(totalLpTokens[i])
        .times(Bignumber(2));

      tvl = tvl.plus(amount);
    }
  }
  return tvl;
}

const coreOracleAddress = "0x1e5bddd0cdf8839d6b27b34927869ef0ad7bf692";
const werc20Address = "0xe28d9df7718b0b5ba69e01073fe82254a9ed2f98";
const wMasterChefAddress = "0x373ae78a14577682591e088f2e78ef1417612c68";
const wLiquidityGauge = "0xfdb4f97953150e47c8606758c13e70b5a789a7ec";
const wStakingRewardIndex = "0x713df2ddda9c7d7bda98a9f8fcd82c06c50fbd90";
const wStakingRewardPerp = "0xc4635854480fff80f742645da0310e9e59795c63";
const AlphaHomoraV2GraphUrl = `https://api.thegraph.com/subgraphs/name/hermioneeth/alpha-homora-v2-mainnet`;
const QUERY_POSITIONS_AT_BLOCK = gql`
  query queryPositionsAtBlock($block: Int) {
    positions(where: { collateralSize_gt: 0 }, block: { number: $block }) {
      collateralToken {
        token
        tokenId
      }
      collateralSize
    }
  }
`;

async function tvlV2(timestamp, block) {
  const data = await request(AlphaHomoraV2GraphUrl, QUERY_POSITIONS_AT_BLOCK, {
    block,
  });
  const collaterals = await Promise.all(
    data.positions.map(getPositionCollateral)
  );

  const lpTokens = Array.from(
    new Set(
      collaterals
        .map((collateral) => collateral.lpTokenAddress)
        .filter((lpToken) => !!lpToken)
    )
  );

  const lpTokenPrices = await getLpTokenPrices(lpTokens, block);

  const totalCollateral = Bignumber.sum(
    0, // Default value
    ...collaterals.map((collateral) =>
      collateral.lpTokenAddress in lpTokenPrices
        ? Bignumber(collateral.collateralSize).times(
            lpTokenPrices[collateral.lpTokenAddress]
          )
        : 0
    )
  );
  return totalCollateral;
}

async function getLpTokenPrices(lpTokens, block) {
  const { output: _ethPrices } = await sdk.api.abi.multiCall({
    calls: lpTokens.map((lpToken) => ({
      target: coreOracleAddress,
      params: [lpToken],
    })),
    abi: abi["getETHPx"],
    block,
  });

  const lpTokenPrices = {};
  for (let i = 0; i < _ethPrices.length; i++) {
    lpTokenPrices[lpTokens[i]] = Bignumber(_ethPrices[i].output).div(
      Bignumber(2).pow(112)
    );
  }
  return lpTokenPrices;
}

async function getPositionCollateral(position) {
  const wToken = position.collateralToken.token;
  const tokenId = position.collateralToken.tokenId;

  const pool = await getPoolFromWToken(wToken, Bignumber(tokenId).toString());

  const lpTokenAddress = pool ? pool.lpTokenAddress : null;

  return {
    lpTokenAddress,
    collateralSize: Bignumber(position.collateralSize),
  };
}

async function getPoolFromWToken(wTokenAddress, id) {
  const { data: pools } = await axios.get(
    "https://homora-v2.alphafinance.io/static/pools.json"
  );

  let pool = null;
  const _wTokenAddress = wTokenAddress.toLowerCase();

  if (_wTokenAddress === werc20Address) {
    const lpTokenAddress =
      "0x" + Bignumber(id).toString(16).padStart(40, "0").toLowerCase();

    for (const _pool of pools) {
      if (
        _pool.lpTokenAddress === lpTokenAddress &&
        _pool.type === "Liquidity Providing"
      ) {
        pool = _pool;
        break;
      }
    }
  } else if (_wTokenAddress === wMasterChefAddress) {
    const parsedId = Bignumber(id).toString(16).padStart(40, "0");
    const pid = parseInt(parsedId.substr(0, 2));

    for (const _pool of pools) {
      if (
        _pool.pid === pid &&
        _wTokenAddress === _pool.wTokenAddress &&
        _pool.type === "Yield Farming"
      ) {
        pool = _pool;
        break;
      }
    }
  } else if (_wTokenAddress === wLiquidityGauge) {
    const pid = parseInt(id.substr(0, 2), 16);
    const gid = parseInt(id.substr(2, 4), 16);

    for (const _pool of pools) {
      if (_pool.pid === pid && _wTokenAddress === _pool.wTokenAddress) {
        pool = _pool;
        break;
      }
    }
  } else {
    for (const _pool of pools) {
      if (
        _pool.wTokenAddress === _wTokenAddress &&
        _pool.type === "Yield Farming"
      ) {
        pool = _pool;
        break;
      }
    }
  }

  return pool;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Alpha Homora", // project name
  token: "ALPHA", // null, or token symbol if project has a custom token
  category: "lending", // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1602054167, // unix timestamp (utc 0) specifying when the project began, or where live data begins
  tvl, // tvl adapter
};
