require('dotenv').config();

const sdk = require('../../sdk');

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

  const subscribers = new Set();

  for (const sub of makerSubs) { subscribers.add(sub[4]); }
  for (const sub of compoundSubs) { subscribers.add(sub[0]); }
  for (const sub of aaveSubs) { subscribers.add(sub[0]); }

  return (await sdk.api.cdp.getAssetsLocked({
    block,
    targets: [...subscribers]
  })).output;
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
