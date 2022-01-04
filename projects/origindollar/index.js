/*==================================================
  Modules
  ==================================================*/
const sdk = require('../../sdk');
const abi = require("./abi.json");
const BigNumber = require("bignumber.js");

/*==================================================
  Settings
  ==================================================*/
const holders = [
  '0x9c459eeb3fa179a40329b81c1635525e9a0ef094', // CompoundStrategyProxy.sol
  '0x3c5fe0a3922777343cbd67d3732fcdc9f2fa6f2f', // ThreePoolStrategy.sol (Curve strategy)
  '0x5e3646a1db86993f73e6b74a57d8640b69f7e259', // InitializeGovernedUpgradeabilityProxy.sol (Aave Strategy),
  '0xe75d77b1865ae93c7eaa3040b038d7aa7bc02f70', // VaultProxy.sol
  '0x689440f2ff927e1f24c72f1087e1faf471ece1c8', // CVX rewards staker
]

const usdtToken = '0xdac17f958d2ee523a2206206994597c13d831ec7'

const tokens = [
  '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
  usdtToken, // USDT
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  // '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
  '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // cDAI
  '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', // cUSDT
  '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
  '0x028171bca77440897b824ca71d1c56cac55b68a3', // aDai
  '0x4da27a545c0c5b758a6ba100e3a049001de870f5', // stkAAVE (Staked Aave)
  '0xd533a949740bb3306d119cc777fa900ba034cd52', // CRV
  '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b', // CVX
  '0x30d9410ed1d5da1f6c8391af5338c93ab8d4035c', // cvx3Crv (Curve.fi DAI/USDC/USDT Convex Deposit)
]

const ethAddress = '0x0000000000000000000000000000000000000000';
const crvRewardsPool = '0x689440f2Ff927E1f24c72F1087E1FAF471eCe1c8';
const convexStrategyProxy = '0xea2ef2e2e5a749d4a66b41db9ad85a38aa264cb3';
const threePoolToken = '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490'; //
const threePool = "0xbEbc44782C7dB0a1A60Cb6fe97d0b483032FF1C7";

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const balances = {}

  const convexStaked3poolLpTokens = (await sdk.api.abi.call({
    target: crvRewardsPool,
    params: convexStrategyProxy,
    block,
    abi: abi["balanceOf"],
  })).output;

  const strategy3poolLptokens = (await sdk.api.abi.call({
    target: threePoolToken,
    params: convexStrategyProxy,
    abi: "erc20:balanceOf",
    block
  })).output;

  const virtualPrice = (await sdk.api.abi.call({
    target: threePool,
    block,
    abi: abi["get_virtual_price"],
  })).output;

  const allConvexTokens = BigNumber.sum(BigNumber(convexStaked3poolLpTokens), BigNumber(strategy3poolLptokens));

  /* 1e30 = 1e6 / 1e18 / 1e18
   * - 1e6 USDT decimals
   * - 1e18 as virtual price has 18 decimals
   * - the other 1e18 because LP tokens have 18 decimals
   */
  const convexTokensUsdtPrice = allConvexTokens.times(BigNumber(virtualPrice)) / 1e30;
  balances[usdtToken] = convexTokensUsdtPrice;

  /*
   * Check all holdings the same way V2 adapters do it.
   */
  const holdings = await sdk
    .api
    .abi
    .multiCall({
      abi: 'erc20:balanceOf',
      calls: tokens.map(token => {
        return holders.map(holder => {
          return {
            target: token,
            params: holder
          }
        })
      }).reduce((prev, curr) => prev.concat(curr), []),
      block,
    });

  sdk.util.sumMultiBalanceOf(balances, holdings, true);
  return balances;
}

module.exports = {
  name: 'Origin Dollar',
  token: 'OUSD',
  category: 'Assets',
  start: 1610000000, // Thu Jan 07 2021 06:13:20 GMT+0000
  tvl,
};