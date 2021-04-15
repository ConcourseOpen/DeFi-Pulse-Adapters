/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi.json");

/*==================================================
  TVL
  ==================================================*/

const constant = {
  lendingPool: {
    address: "0x47f3e6c1ef0cbe69502167095b592e61de108baa",
  },
};

async function tvl(timestamp, block) {
  const ethSupply = await sdk.api.abi.call({
    block,
    target: constant.lendingPool.address,
    abi: abi["totalStake"],
  });

  const aEthPledge = await sdk.api.abi.call({
    block,
    target: constant.lendingPool.address,
    abi: abi["totalPledge"],
  });

  let balances = {
    "0x0000000000000000000000000000000000000000": ethSupply.output,
    "0xE95A203B1a91a908F9B9CE46459d101078c2c3cb": aEthPledge.output,
  };

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "OnX Finance",
  website: "https://onx.finance",
  token: "ONX",
  category: "lending",
  start: 1614052706, // Feb-23-2021 03:58:26 AM +UTC
  tvl,
};
