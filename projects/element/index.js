const sdk = require('../../sdk');
const abi = require('./abi.json');
const _ = require('underscore')
const bn = require('bignumber.js')

const trancheFactory = '0x62F161BF3692E4015BefB05A03a94A40f520d1c0';
const ccpFactory_v1 = '0xb7561f547F3207eDb42A6AfA42170Cd47ADD17BD';
const ccpFactory_v1_1 = '0xE88628700eaE9213169D715148ac5A5F47B5dCd9';
const balVault = '0xBA12222222228d8Ba445958a75a0704d566BF2C8'


async function tvl(timestamp, block) {
  let balances = {};

  // tranche tvl

  let tranches = [];

  let trancheLogs = (await sdk.api.util
    .getLogs({
      keys: [],
      toBlock: block,
      target: trancheFactory,
      fromBlock: 12685768,
      topic: 'TrancheCreated(address,address,uint256)',
    })).output;

  for (let log of trancheLogs) {
    if (block < log.blockNumber) continue;
    let tranche = `0x${log.topics[1].substr(-40)}`
    tranches.push(tranche.toLowerCase());
    let underlying = (await sdk.api.abi.call({
      block,
      target: tranche,
      abi: abi['underlying']
    })).output;
    let valueSupplied = (await sdk.api.abi.call({
      block,
      target: tranche,
      abi: abi['valueSupplied']
    })).output;
    balances[underlying.toLowerCase()] = balances[underlying.toLowerCase()] ? new bn(balances[underlying.toLowerCase()]).plus(valueSupplied) : valueSupplied
  }

  // // // cc tvl

  let ccLogs_v1 = (await sdk.api.util
    .getLogs({
      keys: [],
      toBlock: block,
      target: ccpFactory_v1,
      fromBlock: 12686198, // June 22nd, 2021
      topic: 'PoolCreated(address)',
    })).output;

  let ccLogs_v1_1 = (await sdk.api.util
      .getLogs({
        keys: [],
        toBlock: block,
        target: ccpFactory_v1_1,
        fromBlock: 14366198, // March 11th, 2022
        topic: 'PoolCreated(address)',
      })).output;

  let ccLogs = [].concat(ccLogs_v1, ccLogs_v1_1);

  for (let log of ccLogs) {
    if (block < log.blockNumber) continue;
    let cc = `0x${log.topics[1].substr(-40)}`;
    let poolId = (await sdk.api.abi.call({
      block,
      target: cc,
      abi: abi['getPoolId'],
    })).output;

    let poolTokens = (await sdk.api.abi.call({
      block,
      target: balVault,
      abi: abi['getPoolTokens'],
      params: poolId
    })).output;

    for (let i = 0; i < poolTokens.tokens.length; i++) {
      let token = poolTokens.tokens[i];
      if (tranches.indexOf(token.toLowerCase()) >= 0) {
        continue;
      }

      balances[token.toLowerCase()] = balances[token.toLowerCase()] ? new bn(balances[token.toLowerCase()]).plus(poolTokens.balances[i]) : poolTokens.balances[i];
    }
  }

  if (_.isEmpty(balances)) {
    balances = {
      '0x0000000000000000000000000000000000000000': 0,
    };
  }

  return balances;
}

module.exports = {
  name: 'Element Finance',               // project name
  token: null,
  category: 'Assets',          // Lending
  start: 1624388593,            //
  tvl,                           // tvl adapter
  contributesTo: ['Curve, yearn']
}
