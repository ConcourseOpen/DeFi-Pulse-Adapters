/*==================================================
  Modules
==================================================*/

const sdk = require("../../sdk");
const BigNumber = require("bignumber.js");
const abi = require("./abi");
const pageResults = require("graph-results-pager");
/*==================================================
  Settings
==================================================*/

const synthetixState = "0x4b9Ca5607f1fF8019c1C6A3c2f0CC8de622D5B82";
const synthetix = "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F";
const exchangeRates = "0xd69b189020EF614796578AfE4d10378c5e7e1138";
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
      abi: abi["rateForCurrency"],
      params: [
        "0x534e580000000000000000000000000000000000000000000000000000000000", // SNX
      ],
    }),
    sdk.api.abi.call({
      block,
      target: synthetix,
      abi: abi["totalSupply"],
    }),
    sdk.api.abi.call({
      block,
      target: synthetixState,
      abi: abi["lastDebtLedgerEntry"],
    }),
    sdk.api.abi.call({
      block,
      target: synthetix,
      abi: abi["totalIssuedSynthsExcludeEtherCollateral"],
      params: [
        "0x7355534400000000000000000000000000000000000000000000000000000000", // sUSD
      ],
    }),
    sdk.api.abi.call({
      block,
      target: synthetixState,
      abi: abi["issuanceRatio"],
    }),
  ]);

  const [snxPrice, snxTotalSupply, totalIssuedSynths, issuanceRatio] = [
    unformattedSnxPrice,
    unformattedSnxTotalSupply,
    unformattedTotalIssuedSynths,
    unformattedIssuanceRatio,
  ].map((n) => toBig(n, 18));
  const lastDebtLedgerEntry = toBig(unformattedLastDebtLedgerEntry, 27);

  console.log(snxPrice.toFormat());

  let snxTotal = 0;
  let snxLocked = 0;

  for (const {
    collateral: unformattedCollateral,
    debtEntryAtIndex,
    initialDebtOwnership,
  } of holders) {
    const collateral = toBig(unformattedCollateral);
    let debtBalance = totalIssuedSynths
      .times(lastDebtLedgerEntry)
      .div(debtEntryAtIndex)
      .times(initialDebtOwnership);
    let collateralRatio = debtBalance.div(collateral).div(usdToSnxPrice);
    // if (debtBalance.) {
    //   debtBalance = toBig(0);
    //   collateralRatio = toBig(0);
    // }
    const lockedSnx = collateral.times(
      BigNumber.minimum(1, collateralRatio.div(issuanceRatio))
    );

    snxTotal = snxTotal.plus(collateral);
    snxLocked = snxLocked.plus(lockedSnx);
  }

  const percentLocked = snxLocked.div(snxTotal);
  const tvl = snxTotalSupply
    .times(percentLocked)
    .times(snxPrice)
    .times(Math.pow(10, 18))
    .toFixed();
  console.log(tvl);
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
        },
      },
      properties: ["collateral", "id"],
    },
    max: 1000, // top 1000 SNX holders with collateral. At the time of this commit, there are 51,309 SNX holders. (7/27/2020)
  });
}

function toBig(n, decimals = 0) {
  return new BigNumber(n.toString()).div(Math.pow(10, decimals));
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
