/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi.json");
const Bignumber = require("bignumber.js");
const axios = require("axios");

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const startTimestamp = 1602054167;

  const ethAddress = "0x0000000000000000000000000000000000000000";
  let balances = {
    [ethAddress]: "0", // ETH
  };

  if (timestamp < startTimestamp) {
    return balances;
  }

  const { data } = await axios.get(
    "https://homora.alphafinance.io/static/contracts.json"
  );

  const bankAddress = data.bankAddress.toLowerCase();
  const WETHAddress = data.WETHAddress.toLowerCase();

  const pools = data.pools;

  const uniswapPools = pools.filter(
    (pool) => pool.exchange === "Uniswap" || pool.exchange === "IndexCoop"
  );
  const sushiswapPools = pools.filter(
    (pool) => pool.exchange === "Sushiswap" || pool.exchange === "Pickle"
  );

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

  balances[ethAddress] = tvl.toFixed(0);

  return balances;
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
