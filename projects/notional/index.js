/*==================================================
  Modules
==================================================*/

const v1abi = require("./v1-abi");
const v2abi = require("./v2-abi");
const cTokenABI = require("./ctoken-abi");
const sdk = require("../../sdk");

/*==================================================
  Settings
==================================================*/

const v1EscrowContract = "0x9abd0b8868546105F6F48298eaDC1D9c82f7f683";
const v2ProxyContract = "0x1344A36A1B56144C3Bc62E7757377D288fDE0369";
const v1LaunchBlock = 11007909
const v2LaunchBlock = 13492539
const TokenType = {
  UnderlyingToken: '0',
  cToken: '1',
  cETH: '2',
  Ether: '3',
  NonMintable: '4'
}

/*==================================================
  V1 TVL
==================================================*/

async function v1TVL(timestamp, block) {
  if (block <= v1LaunchBlock) return {}

  const maxCurrencyId = (
    await sdk.api.abi.call({
      block,
      target: v1EscrowContract,
      abi: v1abi["maxCurrencyId"],
    })
  ).output;

  const addressCalls = [];
  for (let i = 0; i <= maxCurrencyId; i++) {
    addressCalls.push({
      target: v1EscrowContract,
      params: i,
    });
  }

  const supportedTokens = (
    await sdk.api.abi.multiCall({
      calls: addressCalls,
      target: v1EscrowContract,
      abi: v1abi["currencyIdToAddress"],
      block,
    })
  ).output;

  const balanceCalls = supportedTokens.map((s) => {
    return {
      target: s.output,
      params: v1EscrowContract,
    };
  });

  return (
    await sdk.api.abi.multiCall({
      calls: balanceCalls,
      abi: "erc20:balanceOf",
      block,
    })
  );
}

/*==================================================
  V2 TVL
==================================================*/

async function v2TVL(timestamp, block) {
  if (block <= v2LaunchBlock) return {}

  const maxCurrencyId = (
    await sdk.api.abi.call({
      block,
      target: v2ProxyContract,
      abi: v2abi["getMaxCurrencyId"],
    })
  ).output;

  const addressCalls = [];
  for (let i = 1; i <= maxCurrencyId; i++) {
    addressCalls.push({
      target: v2ProxyContract,
      params: i,
    });
  }

  const supportedTokens = (
    await sdk.api.abi.multiCall({
      calls: addressCalls,
      target: v2ProxyContract,
      abi: v2abi["getCurrency"],
      block,
    })
  ).output;

  const cTokenToUnderlying = {}
  const cTokenBalanceCalls = supportedTokens
    .filter((s) => s.output[0][3] === TokenType.cToken || s.output[0][3] === TokenType.cETH)
    .map((s) => {
      cTokenToUnderlying[s.output[0][0]] = s.output[1][0] // underlying token address
      return {
        target: s.output[0][0], // asset token address
        params: v2ProxyContract,
      };
    });

  const cTokenResults = (
    await sdk.api.abi.multiCall({
      calls: cTokenBalanceCalls,
      abi: cTokenABI["balanceOfUnderlying"],
      block,
    })
  ).output.map((r) => {
    const remappedR = r;
    remappedR.input.target = cTokenToUnderlying[r.input.target]
    return remappedR
  });

  const erc20BalanceCalls = supportedTokens
    .filter((s) => s.output[0][3] === TokenType.NonMintable)
    .map((s) => {
      return {
        target: s.output[0][0], // asset token address
        params: v2ProxyContract,
      };
    });

  const erc20Results = (
    await sdk.api.abi.multiCall({
      calls: erc20BalanceCalls,
      abi: "erc20:balanceOf",
      block,
    })
  ).output

  const allResults = cTokenResults.concat(erc20Results)
  return allResults.reduce((obj, b) => {
    obj[b.input.target] = b.output
    return obj
  }, {})
}

/*==================================================
  Main
==================================================*/

async function tvl(timestamp, block) {
  const v1BalanceMap = await v1TVL(timestamp, block);
  const v2BalanceMap = await v2TVL(timestamp, block);

  sdk.util.sumMultiBalanceOf(v2BalanceMap, v1BalanceMap)
  return v2BalanceMap
}

/*==================================================
  Exports
==================================================*/

module.exports = {
  name: "Notional",
  token: null,
  category: "lending",
  start: 1602115200, // Oct-08-2020 12:00:00 AM +UTC
  tvl,
};
