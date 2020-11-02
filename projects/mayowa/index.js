/*==================================================
  Modules
==================================================*/

const sdk = require("../../sdk");
const _ = require("underscore");
const BigNumber = require("bignumber.js");

/*==================================================
    Contracts and Tokens
 ==================================================*/
const contracts = [
  "0x75c23271661d9d143dcb617222bc4bec783eff34", //WETH-USDC
  "0x2109f78b46a789125598f5ad2b7f243751c2934d", //WBTC-USDC
];

const tokens = [
  "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", // USDC
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599", // WBTC
];

async function tvl(timestamp, block){
  try {
    const balances = {};
    let listOfCallsToGetTokenBalances = [];
    _.forEach(contracts, (contract) => {
      listOfCallsToGetTokenBalances.push(
        ..._.map(tokens, (token) => ({
          target: token,
          params: contract,
        }))
      )
    })

    const listOfTokenBalancesResults = (
      await sdk.api.abi.multiCall({
        block,
        calls: listOfCallsToGetTokenBalances,
        'abi': 'erc20:balanceOf'
      })
    ).output;

    _.forEach(listOfTokenBalancesResults, (tokenBalanceResult) => {
      let balance = new BigNumber(tokenBalanceResult.output || 0);
      if (balance <= 0) return;

      let token = tokenBalanceResult.input.target;
      let total = balances[token];

      if (total) {
        balances[token] = balance.plus(total).toFixed();
      } else {
        balances[token] = balance.toFixed();
      }
    })

    return balances;
  }catch (error){
    console.log(error);
  }
}

(async () => {
  const data = await tvl(11152850, 11152850)
  data
})()

module.exports = {
  name: "Mayowa",
  token: null,
  category: "dexes",
  start: 1597126986, // Aug-07-2020 03:56:08 PM +UTC
  tvl,
};
