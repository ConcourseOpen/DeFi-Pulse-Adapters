/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");

const DUSD = "0x5BC25f649fc4e26069dDF4cF4010F9f706c23831";

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const DUSDTotalSupply = (
    await sdk.api.erc20.totalSupply({
      target: DUSD,
    })
  ).output;

  const balances = { [DUSD]: DUSDTotalSupply };
  return (await sdk.api.util.toSymbols(balances)).output;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "DefiDollar",
  token: null, // null, or token symbol if project has a custom token
  category: "Assets",
  start: 1598415139, // Aug-26-2020 04:12:19 AM +UTC
  tvl,
};
