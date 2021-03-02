require('dotenv').config();

const sdk = require('../../sdk');
const utils = require('../../sdk/util');

const { getContractAddress, getContractMethod, getContractBlock  } = require('./utils');

async function tvl(timestamp, block) {
  let makerSubs = [];
  let compoundSubs = [];
  let aaveSubs = [];

  if (block >= getContractBlock('McdSubscriptions')) makerSubs = (await sdk.api.abi.call({
    block,
    target: getContractAddress('McdSubscriptions'),
    abi: getContractMethod('getSubscribers', 'McdSubscriptions'),
  })).output;

  if (block >= getContractBlock('CompoundSubscriptions')) compoundSubs = (await sdk.api.abi.call({
    block,
    target: getContractAddress('CompoundSubscriptions'),
    abi: getContractMethod('getSubscribers', 'CompoundSubscriptions'),
  })).output;

  if (block >= getContractBlock('AaveSubscriptions')) aaveSubs = (await sdk.api.abi.call({
    block,
    target: getContractAddress('AaveSubscriptions'),
    abi: getContractMethod('getSubscribers', 'AaveSubscriptions'),
  })).output;

  const makerSubscribers = new Set();
  const compoundSubscribers = new Set();
  const aaveSubscribers = new Set();

  for (const sub of makerSubs) { makerSubscribers.add(sub[4]); }
  for (const sub of compoundSubs) { compoundSubscribers.add(sub[0]); }
  for (const sub of aaveSubs) { aaveSubscribers.add(sub[0]); }

  let makerBalances = (await sdk.api.cdp.maker.getAssetsLocked({
    block,
    targets: [...makerSubscribers]
  })).output;

  let compoundBalances = (await sdk.api.cdp.compound.getAssetsLocked({
    block,
    targets: [...compoundSubscribers]
  })).output;

  let aaveBalances = (await sdk.api.cdp.aave.getAssetsLocked({
    block,
    targets: [...aaveSubscribers]
  })).output;

  let balances = utils.sum([makerBalances, compoundBalances, aaveBalances]);

  return balances;
}

module.exports = {
  tvl,
  name: 'DeFi Saver',
  token: null,
  website: 'https://defisaver.com/',
  category: 'lending',
  start: 1586430640, // 09/04/2020 @ 11:10 (UTC)
  contributesTo: ['Maker', 'Compound', 'Aave'],
};
