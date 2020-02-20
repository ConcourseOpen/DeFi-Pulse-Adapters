/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const _ = require("underscore");
const BigNumber = require("bignumber.js");
const ethers = require("ethers");
// TODO: get list of active token addresses from package
const abis = require("@erasure/abis");

/*==================================================
  Helper Functions
  ==================================================*/

async function getRegistryBalances(registryName) {
  let calls = [];

  // get registry interface
  const registryInterface = new ethers.utils.Interface(
    abis.ErasureV130[registryName].artifact.abi
  );
  // get registry instances
  const instanceCount = await (
    await sdk.api.abi.call({
      target: abis.ErasureV130[registryName].mainnet,
      abi: registryInterface.functions.getInstanceCount,
      params: []
    })
  ).output;
  let index = 0;
  let instanceCountPerCall = 1000;
  let instances = [];
  while (index < instanceCount) {
    if (index + instanceCountPerCall > instanceCount) {
      instances.push(
        ...(
          await sdk.api.abi.call({
            target: abis.ErasureV130[registryName].mainnet,
            abi: registryInterface.functions.getPaginatedInstances,
            params: [index, instanceCount]
          })
        ).output
      );
      break;
    }
    instances.push(
      ...(
        await sdk.api.abi.call({
          target: abis.ErasureV130[registryName].mainnet,
          abi: registryInterface.functions.getPaginatedInstances,
          params: [index, index + instanceCountPerCall]
        })
      ).output
    );
    index += instanceCountPerCall;
  }
  // setup balanceOf calls to DAI and NMR
  _.each(instances, instance => {
    calls.push({
      target: abis.ErasureV130.DAI.mainnet,
      params: [instance]
    });
    calls.push({
      target: abis.ErasureV130.NMR.mainnet,
      params: [instance]
    });
  });

  return calls;
}

/*==================================================
  Main
  ==================================================*/

async function run(timestamp, block) {
  let balances = {
    "0x0000000000000000000000000000000000000000": 0 // ETH
  };

  // craft token balance calls to all registry instances
  // TODO: add user registry balances
  const Erasure_Agreements = await getRegistryBalances("Erasure_Agreements");
  const Erasure_Escrows = await getRegistryBalances("Erasure_Escrows");
  const Erasure_Posts = await getRegistryBalances("Erasure_Posts");

  const calls = [...Erasure_Agreements, ...Erasure_Escrows, ...Erasure_Posts];

  // call all balances
  const balanceOfResults = await sdk.api.abi.multiCall({
    block,
    calls,
    abi: "erc20:balanceOf"
  });

  // sum token balances across contracts
  _.each(balanceOfResults.output, balanceOf => {
    if (balanceOf.success) {
      let balance = balanceOf.output;
      let address = balanceOf.input.target;

      if (BigNumber(balance).toNumber() <= 0) {
        return;
      }

      balances[address] = BigNumber(balances[address] || 0)
        .plus(balance)
        .toFixed();
    }
  });

  let symbolBalances = await sdk.api.util.toSymbols(balances);

  return symbolBalances.output;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "Erasure",
  token: "NMR",
  category: "Derivatives",
  start: 1566518400, // 08/23/2019 @ 12:00am (UTC)
  run
};
