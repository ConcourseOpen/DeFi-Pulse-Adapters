/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi");
const _ = require("underscore");
const BigNumber = require("bignumber.js");

/*==================================================
  Settings
  ==================================================*/

const registryAdapterAddresses = [
  "0xF4fB8903A41fC78686b26DE55502cdE42a4c6c78", // V1 Vaults
  "0x14d6E0908baE40A2487352B2a9Cb1A6232DA8785", // V2 Vaults
  "0xec7Ac8AC897f5082B2c3d4e8D2173F992A097F24", // Iron Bank
  "0x560144C25E53149aC410E5D33BDB131e49A850e5", // veCRV
  "0x1007eD6fdFAC72bbea9c719cf1Fa9C355D248691", // Earn
];

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 4,
});

const balances = {};
let tvlByAdapter = {};
let totalTvl = new BigNumber(0);

/*==================================================
  TVL
  ==================================================*/

async function buildBalancesForAdapter(registryAdapterAddress, block) {
  const adapterAddresses = (
    await sdk.api.abi.call({
      target: registryAdapterAddress,
      abi: abi["assetsAddresses"],
      block,
    })
  ).output;
  const adapterInfo = (
    await sdk.api.abi.call({
      target: registryAdapterAddress,
      abi: abi["adapterInfo"],
      block,
    })
  ).output;
  const adapterTypeId = adapterInfo[1];

  let totalAdapterTvl = new BigNumber(0);
  const tvlByAsset = {};
  for (const adapterAddress of adapterAddresses) {
    const tvlBreakdown = (
      await sdk.api.abi.call({
        target: registryAdapterAddress,
        params: adapterAddress,
        abi: abi["assetTvlBreakdown"],
        block,
      })
    ).output;
    const assetAddress = tvlBreakdown[0]; // Not used
    const tokenAddress = tvlBreakdown[1];
    const tokenPriceUsdc = tvlBreakdown[2]; // Not used
    const tokenBalance = tvlBreakdown[3]; // Not used
    const delegatedBalance = tvlBreakdown[4]; // Not used
    const adjustedBalance = tvlBreakdown[5]; // tokenBalance - delegatedBalance
    const assetTvl = tvlBreakdown[6]; // Not used
    totalAdapterTvl = totalAdapterTvl.plus(assetTvl);
    totalTvl = totalTvl.plus(assetTvl);
    const currentBalancesForAsset = balances[tokenAddress];
    if (currentBalancesForAsset) {
      balances[tokenAddress] = currentBalancesForAsset.plus(adjustedBalance);
    } else {
      balances[tokenAddress] = new BigNumber(adjustedBalance);
    }

    tvlByAsset[assetAddress] = {
      assetTvl,
      assetAddress,
    };
  }

  console.log("");
  console.log("-----------------------------");
  if (adapterTypeId === "VE_CRV") {
    console.log(`${adapterTypeId} (${adapterAddresses.length} asset)`);
  } else {
    console.log(`${adapterTypeId} (${adapterAddresses.length} assets)`);
  }
  console.log("-----------------------------");

  const sortedTvlByAsset = _.sortBy(tvlByAsset, (item) => item.assetTvl * -1);
  _.each(sortedTvlByAsset, ({ assetTvl, assetAddress }) => {
    console.log(`${assetAddress} ${formatter.format(assetTvl / 10 ** 6)}`);
  });
  console.log(
    `TVL: ${formatter.format(totalAdapterTvl.div(10 ** 6).toFixed())}`
  );

  tvlByAdapter[adapterTypeId] = {
    adapterTvl: totalAdapterTvl,
    adapterTypeId,
  };
}

async function tvl(timestamp, block) {
  for (const registryAdapterAddress of registryAdapterAddresses) {
    await buildBalancesForAdapter(registryAdapterAddress, block);
  }

  const sortedTvlByAdapter = _.sortBy(
    tvlByAdapter,
    (item) => item.adapterTvl * -1
  );
  const sortedBalances = _.sortBy(balances, (item) => item.toFixed() * -1);
  console.log("");
  console.log("=============================");
  console.log(" TVL Summary");
  console.log("=============================");
  _.each(sortedTvlByAdapter, ({ adapterTvl, adapterTypeId }) => {
    console.log(`${adapterTypeId}: ${formatter.format(adapterTvl / 10 ** 6)}`);
  });
  console.log("");
  console.log(`Total TVL ${formatter.format(totalTvl.toFixed() / 10 ** 6)}`);
  console.log("");
  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "yearn.finance",
  token: "YFI",
  category: "assets",
  start: 1581465600, // 02/12/2020 @ 12:00am (UTC)
  tvl,
  // contributesTo: ["Curve", "Aave"], // TODO: Determine entire list of contributions
};
