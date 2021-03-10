/*==================================================
  Modules
  ==================================================*/

const abi = require("./abi");
const sdk = require("../../sdk");
const BigNumber = require("bignumber.js");

/*==================================================
  Settings
  ==================================================*/
const metaVault = "0xBFbEC72F2450eF9Ab742e4A27441Fa06Ca79eA6a";

const threeCrv = "0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490";

/*==================================================
  Helpers
  ==================================================*/

function collapseDecimals(value) {
  return new BigNumber(value).div(10 ** 18);
}

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  let balance = collapseDecimals(
    (
      await sdk.api.abi.call({
        target: metaVault,
        abi: abi["balance"],
        block,
      })
    ).output
  );

  let balances = {
    [threeCrv]: balance, // 3Crv
  };

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "yAxis",
  token: "YAX",
  category: "assets",
  start: 1604167200, // 10/31/2020 @ 06:00:00pm (UTC)
  tvl,
};
