/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");

const API_CALL_CHUNK_SIZE = 100;
const IDEX_CUSTODY_CONTRACT = "0xE5c405C5578d84c5231D3a9a29Ef4374423fA0c2";

/*==================================================
  TVL
  ==================================================*/

async function tvl(_timestamp, block) {
  const assets = await sdk.api.util.tokenList();

  const balances = {
    "0x0000000000000000000000000000000000000000": (
      await sdk.api.eth.getBalance({ target: IDEX_CUSTODY_CONTRACT, block })
    ).output
  };

  while (assets.length) {
    const assetBalancesResult = await sdk.api.abi.multiCall({
      abi: "erc20:balanceOf",
      block,
      calls: assets.splice(0,API_CALL_CHUNK_SIZE).reduce((arr, asset) => {
        if (asset.symbol !== "ETH") {
          arr.push({
            target: asset.contract,
            params: IDEX_CUSTODY_CONTRACT,
          });
        }
        return arr;
      }, []),
    });
    sdk.util.sumMultiBalanceOf(balances, assetBalancesResult);
  }

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "IDEX", // project name
  token: "IDEX", // null, or token symbol if project has a custom token
  category: "DEXes", // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1603166400, // unix timestamp (utc 0) specifying when the project began, 10-20-2020 UTC 0:00:00
  tvl, // tvl adapter
};
