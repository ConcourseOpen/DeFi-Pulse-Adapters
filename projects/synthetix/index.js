/*==================================================
  Modules
==================================================*/

const sdk = require("../../sdk");
const BigNumber = require("bignumber.js");
const synthetixContractAbi = require("./synthetix.abi.json");
const synthetixStateContractAbi = require("./synthetix-state.abi.json");
const exchangeRatesContractAbi = require("./exchange-rates.abi.json");
const systemSettingsContractAbi = require("./system-settings.abi.json");
const pageResults = require("graph-results-pager");
/*==================================================
  Settings
==================================================*/

const synthetixState = "0x4b9Ca5607f1fF8019c1C6A3c2f0CC8de622D5B82";
const synthetix = "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F";
const exchangeRates = "0xd69b189020EF614796578AfE4d10378c5e7e1138";
const systemSettings = "0xD3C8d372bFCd36c2B452639a7ED6ef7dbFDC56F8";

const snxGraphEndpoint =
  "https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix";

/*==================================================
  Main
==================================================*/

async function tvl(timestamp, block) {
  const holders = await SNXHolders(block);

  const [
    { output: unformattedSnxPrice },
    { output: unformattedSnxTotalSupply },
    { output: unformattedLastDebtLedgerEntry },
    { output: unformattedTotalIssuedSynths },
    { output: unformattedIssuanceRatio },
  ] = await Promise.all([
    sdk.api.abi.call({
      block,
      target: exchangeRates,
      abi: exchangeRatesContractAbi["rateForCurrency"],
      params: [
        "0x534e580000000000000000000000000000000000000000000000000000000000", // SNX
      ],
    }),
    sdk.api.abi.call({
      block,
      target: synthetix,
      abi: synthetixContractAbi["totalSupply"],
    }),
    sdk.api.abi.call({
      block,
      target: synthetixState,
      abi: synthetixStateContractAbi["lastDebtLedgerEntry"],
    }),
    sdk.api.abi.call({
      block,
      target: synthetix,
      abi: synthetixContractAbi["totalIssuedSynthsExcludeEtherCollateral"],
      params: [
        "0x7355534400000000000000000000000000000000000000000000000000000000", // sUSD
      ],
    }),
    sdk.api.abi.call({
      block,
      target: systemSettings,
      abi: systemSettingsContractAbi["issuanceRatio"],
    }),
  ]);

  const [snxPrice, snxTotalSupply, totalIssuedSynths, issuanceRatio] = [
    unformattedSnxPrice,
    unformattedSnxTotalSupply,
    unformattedTotalIssuedSynths,
    unformattedIssuanceRatio,
  ].map((n) => toBig(n, 18));
  const lastDebtLedgerEntry = toBig(unformattedLastDebtLedgerEntry, 27);

  debug({ snxPrice, snxTotalSupply, totalIssuedSynths, issuanceRatio });

  let snxTotal = toBig(0);
  let snxLocked = toBig(0);

  for (const {
    collateral: unformattedCollateral,
    debtEntryAtIndex: unformattedDebtEntryAtIndex,
    initialDebtOwnership: unformattedInitialDebtOwnership,
  } of holders) {
    const collateral = toBig(unformattedCollateral, 18);
    const debtEntryAtIndex = toBig(unformattedDebtEntryAtIndex, 0);
    const initialDebtOwnership = toBig(unformattedInitialDebtOwnership, 0);

    let debtBalance = totalIssuedSynths
      .times(lastDebtLedgerEntry)
      .div(debtEntryAtIndex)
      .times(initialDebtOwnership);
    let collateralRatio = debtBalance.div(collateral).div(snxPrice);

    if (debtBalance.isNaN()) {
      debtBalance = toBig(0);
      collateralRatio = toBig(0);
    }
    const lockedSnx = collateral.times(
      BigNumber.min(toBig(1), collateralRatio.div(issuanceRatio))
    );

    snxTotal = snxTotal.plus(collateral);
    snxLocked = snxLocked.plus(lockedSnx);
  }

  debug({ snxLocked, snxTotal, snxTotalSupply, snxPrice });

  const percentLocked = snxLocked.div(snxTotal);
  debug({ percentLocked });
  const tvl = snxTotalSupply.times(percentLocked).times(snxPrice).toFixed();

  debug({ tvl });

  return {
    [synthetix]: tvl,
  };
}

// Uses graph protocol to run through SNX contract. Since there is a limit of 100 results per query
// we can use graph-results-pager library to increase the limit.
async function SNXHolders(blockNumber) {
  return await pageResults({
    api: snxGraphEndpoint,
    query: {
      entity: "snxholders",
      selection: {
        orderBy: "collateral",
        orderDirection: "desc",
        block: {
          number: blockNumber,
        },
        where: {
          collateral_gt: 0,
          block_gt: 5873222,
        },
      },
      properties: ["collateral", "debtEntryAtIndex", "initialDebtOwnership"],
    },
    max: 1000, // top 1000 SNX holders with collateral. At the time of this commit, there are 51,309 SNX holders. (7/27/2020)
  });
}

function toBig(n, decimals = 0) {
  if (!n) return new BigNumber(0);
  return new BigNumber(n.toString()).div(Math.pow(10, decimals));
}

function debug(o) {
  Object.entries(o).forEach(([k, v]) => {
    console.log("%s=%s", k, v);
  });
  console.log();
}

/*==================================================
  Exports
==================================================*/

module.exports = {
  name: "Synthetix",
  token: "SNX",
  category: "derivatives",
  start: 1565287200, // Fri Aug 09 2019 00:00:00
  tvl,
};
