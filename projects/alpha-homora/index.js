/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi.json");
const Bignumber = require("bignumber.js");

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const bankAddress = "0x67b66c99d3eb37fa76aa3ed1ff33e8e39f0b9c7a";
  const WETHAddress = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";

  const pools = [
    {
      name: "WETH/WBTC",
      tokenAddress: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      goblinAddress: "0x41f07d87a28adec58dba1d063d540b86ccbb989f",
      lpTokenAddress: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940",
      lpStakingAddress: "0xCA35e32e7926b96A9988f61d510E038108d8068e",
    },
    {
      name: "WETH/USDC",
      tokenAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      goblinAddress: "0xb7bf6d2e6c4fa291d6073b51911bac17890e92ec",
      lpTokenAddress: "0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc",
      lpStakingAddress: "0x7FBa4B8Dc5E7616e59622806932DBea72537A56b",
    },
    {
      name: "WETH/USDT",
      tokenAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
      goblinAddress: "0x4668ff4d478c5459d6023c4a7efda853412fb999",
      lpTokenAddress: "0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852",
      lpStakingAddress: "0x6C3e4cb2E96B01F4b866965A91ed4437839A121a",
    },
    {
      name: "WETH/DAI",
      tokenAddress: "0x6b175474e89094c44da98b954eedeac495271d0f",
      goblinAddress: "0x14804802592c0f6e2fd03e78ec3efc9b56f1963d",
      lpTokenAddress: "0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11",
      lpStakingAddress: "0xa1484C3aa22a66C62b77E0AE78E15258bd0cB711",
    },
    {
      name: "WETH/DPI",
      tokenAddress: "0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b",
      goblinAddress: "0xdaa93955982d32451f90a1109ecec7fecb7ee4b3",
      lpTokenAddress: "0x4d5ef58aac27d99935e5b6b4a6778ff292059991",
      lpStakingAddress: "0x8f06fba4684b5e0988f215a47775bb611af0f986",
    },
  ];

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

  const { output: _lpTokens } = await sdk.api.abi.multiCall({
    calls: pools.map((pool) => ({
      target: pool.lpStakingAddress,
      params: [pool.goblinAddress],
    })),
    abi: abi["balanceOf"],
    block,
  });

  const lpTokens = _lpTokens.map((_lpToken) => Bignumber(_lpToken.output));

  const { output: _totalETHOnStakings } = await sdk.api.abi.multiCall({
    calls: pools.map((pool) => ({
      target: WETHAddress,
      params: [pool.lpTokenAddress],
    })),
    abi: abi["balanceOf"],
    block,
  });

  const totalETHOnStakings = _totalETHOnStakings.map((stake) =>
    Bignumber(stake.output)
  );

  const { output: _totalLpTokens } = await sdk.api.abi.multiCall({
    calls: pools.map((pool) => ({
      target: pool.lpStakingAddress,
    })),
    abi: abi["totalSupply"],
    block,
  });

  const totalLpTokens = _totalLpTokens.map((_totalLpToken) =>
    Bignumber(_totalLpToken.output)
  );

  const unUtilizedValue = totalETH.minus(totalDebt);

  let tvl = Bignumber(unUtilizedValue);

  for (let i = 0; i < lpTokens.length; i++) {
    const amount = lpTokens[i]
      .times(totalETHOnStakings[i])
      .div(totalLpTokens[i])
      .times(Bignumber(2));

    tvl = tvl.plus(amount);
  }

  return {
    "0x0000000000000000000000000000000000000000": tvl.toFixed(0), // ETH
  };
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Alpha Homora", // project name
  token: null, // null, or token symbol if project has a custom token
  category: "assets", // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1514764800, // unix timestamp (utc 0) specifying when the project began, or where live data begins
  tvl, // tvl adapter
};
