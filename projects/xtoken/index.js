/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const abi = require("./abi.json");
const SNX = require("./SNX.json");
const TradeAccountingContract = require("./TradeAccountingContract.json");
const ethers = require("ethers");

/*==================================================
  Settings
  ==================================================*/

// xtoken addresses
const xaaveaAddr = "0x80DC468671316E50D4E9023D3db38D3105c1C146";
const xaavebAddr = "0x704De5696dF237c5B9ba0De9ba7e0C63dA8eA0Df";
const xbntaAddr = "0x39F8e6c7877478de0604fe693c6080511Bc0A6DA";
const xinchaAddr = "0x8F6A193C8B3c949E1046f1547C3A3f0836944E4b";
const xinchbAddr = "0x6B33f15360cedBFB8F60539ec828ef52910acA9b";
const xkncaAddr = "0x0bfEc35a1A3550Deed3F6fC76Dde7FC412729a91";
const xkncbAddr = "0x06890D4c65A4cB75be73D7CCb4a8ee7962819E81";
const xkncaV1Addr = "0xB088b2C7cE300f3fe679d471C2cE49dFE312Ce75";
const xkncbV1Addr = "0x0c8bCCc8eADa871656266A1f7ad37aaFFC4b20b3";
const xsnxaAddr = "0x2367012aB9c3da91290F71590D5ce217721eEfE4";
const xsnxaAdminAddr = "0x7Cd5E2d0056a7A7F09CBb86e540Ef4f6dCcc97dd";
const tradeAccountingContractAddr =
  "0x6461E964D687E7ca3082bECC595D079C6c775Ac8";

// token addresses
const ethAddr = "0x0000000000000000000000000000000000000000";
const aaveAddr = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
const bntAddr = "0x1F573D6Fb3F13d689FF844B4cE37794d79a7FF1C";
const inchAddr = "0x111111111117dC0aa78b770fA6A738034120C302";
const kncAddr = "0xdeFA4e8a7bcBA345F687a2f1456F5Edd9CE97202";
const snxAddr = "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F";
const ethrsi6040Addr = "0x93E01899c10532d76C0E864537a1D26433dBbDdB";
const sUsdAddr = "0x57ab1e02fee23774580c119740129eac7081e9d3";

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  // xAAVEa created at block 11338426
  let xaaveaFundHoldings = "0x00";
  if (block >= 11338426) {
    xaaveaFundHoldings = await sdk.api.abi.call({
      block,
      target: xaaveaAddr,
      abi: abi["getFundHoldings"],
    });
    xaaveaFundHoldings = xaaveaFundHoldings.output;
  }

  // xAAVEb created at block 11341971
  let xaavebFundHoldings = "0x00";
  if (block >= 11341971) {
    xaavebFundHoldings = await sdk.api.abi.call({
      block,
      target: xaavebAddr,
      abi: abi["getFundHoldings"],
    });

    xaavebFundHoldings = xaavebFundHoldings.output;
  }

  // combine xAAVEa and xAAVEb AAVE amts
  const xaaveaFundHoldingsBn = ethers.BigNumber.from(xaaveaFundHoldings);
  const xaavebFundHoldingsBn = ethers.BigNumber.from(xaavebFundHoldings);
  const combinedXaaveAave = xaaveaFundHoldingsBn.add(xaavebFundHoldingsBn);
  const formatAave = ethers.utils
    .formatUnits(combinedXaaveAave, 0)
    .split(".")[0];

  // xBNTa created at block 12285460
  let xbntaStaked = "0x00";
  let xbntaBuffer = "0x00";
  let xbntaPending = "0x00";
  if (block >= 12285460) {
    xbntaStaked = await sdk.api.abi.call({
      block,
      target: xbntaAddr,
      abi: abi["totalAllocatedNavBnt"],
    });

    xbntaBuffer = await sdk.api.abi.call({
      block,
      target: xbntaAddr,
      abi: abi["getBufferBalanceBnt"],
    });

    xbntaPending = await sdk.api.abi.call({
      block,
      target: xbntaAddr,
      abi: abi["getRewardsContributionToNavBnt"],
    });

    xbntaStaked = xbntaStaked.output;
    xbntaBuffer = xbntaBuffer.output;
    xbntaPending = xbntaPending.output;
  }

  const xbntaStakedBn = ethers.BigNumber.from(xbntaStaked);
  const xbntaBufferBn = ethers.BigNumber.from(xbntaBuffer);
  const xbntaPendingBn = ethers.BigNumber.from(xbntaPending);
  const combinedXbntBnt = xbntaStakedBn.add(xbntaBufferBn).add(xbntaPendingBn);
  const formatBnt = ethers.utils.formatUnits(combinedXbntBnt, 0).split(".")[0];

  // xINCHa created at block 11739841
  let xinchaFundHoldings = "0x00";
  if (block >= 11739841) {
    xinchaFundHoldings = await sdk.api.abi.call({
      block,
      target: xinchaAddr,
      abi: abi["getNav"],
    });
    xinchaFundHoldings = xinchaFundHoldings.output;
  }

  // xINCHb created at block 11740005
  let xinchbFundHoldings = "0x00";
  if (block >= 11740005) {
    xinchbFundHoldings = await sdk.api.abi.call({
      block,
      target: xinchbAddr,
      abi: abi["getNav"],
    });

    xinchbFundHoldings = xinchbFundHoldings.output;
  }

  // combine xINCHa and xINCHb 1INCH amts
  const xinchaFundHoldingsBn = ethers.BigNumber.from(xinchaFundHoldings);
  const xinchbFundHoldingsBn = ethers.BigNumber.from(xinchbFundHoldings);
  const combinedXinchInch = xinchaFundHoldingsBn.add(xinchbFundHoldingsBn);
  const formatInch = ethers.utils
    .formatUnits(combinedXinchInch, 0)
    .split(".")[0];

  // xKNCa v1 created at block 10431752 - project start
  // xKNCa v2 created at block 11818344
  let xkncaFundHoldings = "0x00";
  let xkncaFundHoldingsV1 = "0x00";
  if (block >= 10431752 && block < 11818344) {
    xkncaFundHoldingsV1 = await sdk.api.abi.call({
      block,
      target: xkncaV1Addr,
      abi: abi["getFundKncBalanceTwei"],
    });

    xkncaFundHoldingsV1 = xkncaFundHoldingsV1.output;
  }

  if (block >= 11818344) {
    xkncaFundHoldings = await sdk.api.abi.call({
      block,
      target: xkncaAddr,
      abi: abi["getFundKncBalanceTwei"],
    });

    xkncaFundHoldings = xkncaFundHoldings.output;
  }

  // xKNCb v1 created at block 10432544
  // xKNCb v2 created at block 11836794
  let xkncbFundHoldings = "0x00";
  let xkncbFundHoldingsV1 = "0x00";
  if (block >= 10432544 && block < 11836794) {
    xkncbFundHoldingsV1 = await sdk.api.abi.call({
      block,
      target: xkncbV1Addr,
      abi: abi["getFundKncBalanceTwei"],
    });

    xkncbFundHoldingsV1 = xkncbFundHoldingsV1.output;
  }

  if (block >= 11836794) {
    xkncbFundHoldings = await sdk.api.abi.call({
      block,
      target: xkncbAddr,
      abi: abi["getFundKncBalanceTwei"],
    });

    xkncbFundHoldings = xkncbFundHoldings.output;
  }

  // combine xKNCa and xKNCb KNC amts
  const xkncaFundHoldingsBn = ethers.BigNumber.from(xkncaFundHoldings);
  const xkncbFundHoldingsBn = ethers.BigNumber.from(xkncbFundHoldings);
  const xkncaFundHoldingsBnV1 = ethers.BigNumber.from(xkncaFundHoldingsV1);
  const xkncbFundHoldingsBnV1 = ethers.BigNumber.from(xkncbFundHoldingsV1);
  const combinedXkncKnc = xkncaFundHoldingsBn
    .add(xkncbFundHoldingsBn)
    .add(xkncaFundHoldingsBnV1)
    .add(xkncbFundHoldingsBnV1);
  const formatKnc = ethers.utils.formatUnits(combinedXkncKnc, 0).split(".")[0];

  // xSNXa created at block 10971007
  let xsnxaSnx = "0x00";
  let xsnxaSusd = "0x00";
  let xsnxaEth = "0x00";
  let xsnxaEthrsi6040 = "0x00";
  if (block >= 10971007) {
    // SNX amount
    xsnxaSnx = await sdk.api.abi.call({
      block,
      target: tradeAccountingContractAddr,
      abi: TradeAccountingContract["getSnxBalance"],
    });

    xsnxaSnx = xsnxaSnx.output;

    // sUSD amount
    xsnxaSusd = await sdk.api.abi.call({
      block,
      target: snxAddr,
      abi: SNX["debtBalanceOf"],
      params: [xsnxaAdminAddr, ethers.utils.formatBytes32String("sUSD")],
    });

    xsnxaSusd = xsnxaSusd.output;

    // ETH amount
    xsnxaEth = await sdk.api.abi.call({
      block,
      target: tradeAccountingContractAddr,
      abi: TradeAccountingContract["getEthBalance"],
    });

    xsnxaEth = xsnxaEth.output;

    // ETHRSI6040 amount
    xsnxaEthrsi6040 = await sdk.api.erc20.balanceOf({
      block,
      target: ethrsi6040Addr,
      owner: xsnxaAdminAddr,
    });

    xsnxaEthrsi6040 = xsnxaEthrsi6040.output;
  }

  let balances = {
    [aaveAddr]: formatAave, // AAVE
    [bntAddr]: formatBnt, // BNT
    [inchAddr]: formatInch, // 1INCH
    [kncAddr]: formatKnc, // KNC
    [snxAddr]: xsnxaSnx, // SNX
    [ethAddr]: xsnxaEth, // ETH
    [ethrsi6040Addr]: xsnxaEthrsi6040, // ETHRSI6040
    [sUsdAddr]: xsnxaSusd, // sUSD debt (should be negative)
  };

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: "xToken", // project name
  token: "XTK", // null, or token symbol if project has a custom token
  category: "assets", // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1594383978, // unix timestamp (utc 0) specifying when the project began, or where live data begins
  tvl, // tvl adapter
};
