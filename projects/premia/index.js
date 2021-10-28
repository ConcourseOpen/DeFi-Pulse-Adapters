/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");

const wethPool = "0x398D1622B10fE01f5F90a7bdA7A97eD4B54D6e28";
const wbtcPool = "0xC88aE38Cc8dF85dA9de09F9C0f587249Cc98eE23";
const linkPool = "0x26Bc47E2b076FC7EC68cB6D5824fac2047653246";

const weth = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const wbtc = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const link = "0x514910771AF9Ca656af840dff83E8264EcF986CA";
const dai = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

/*==================================================
  TVL
  ==================================================*/

async function getTotalPoolBalances(token, pools, block) {
  try {
    const balances = {};

    const balanceOfResults = await sdk.api.abi.multiCall({
      calls: pools.map((pool) => ({
        target: token,
        params: pool,
      })),
      abi: "erc20:balanceOf",
      block,
    });

    await sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    return balances;
  } catch (err) {
    console.log("Error gettin pool balances:", err);
    return 0;
  }
}

async function tvl(timestamp, block) {
  const [
    wethPoolBalances,
    wbtcPoolBalances,
    linkPoolBalances,
    daiPoolBalances,
  ] = await Promise.all([
    getTotalPoolBalances(weth, [wethPool], block),
    getTotalPoolBalances(wbtc, [wbtcPool], block),
    getTotalPoolBalances(link, [linkPool], block),
    getTotalPoolBalances(dai, [wethPool, wbtcPool, linkPool], block),
  ]);

  return {
    ...wethPoolBalances,
    ...wbtcPoolBalances,
    ...linkPoolBalances,
    ...daiPoolBalances,
  };
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Premia Finance",
  token: "PREMIA",
  website: "https://premia.finance",
  category: "derivatives",
  start: 1635449900,
  tvl,
};
