require('dotenv').config();

const sdk = require('../../sdk');

const { getContractAddress, getContractMethod  } = require('./utils');

async function tvl(timestamp, block) {
  const { output: makerSubs } = (await sdk.api.abi.call({
    block,
    target: getContractAddress('McdSubscriptions'),
    abi: getContractMethod('getSubscribers', 'McdSubscriptions'),
  }));
  const { output: compoundSubs } = (await sdk.api.abi.call({
    block,
    target: getContractAddress('CompoundSubscriptions'),
    abi: getContractMethod('getSubscribers', 'CompoundSubscriptions'),
  }));
  const { output: aaveSubs } = (await sdk.api.abi.call({
    block,
    target: getContractAddress('AaveSubscriptions'),
    abi: getContractMethod('getSubscribers', 'AaveSubscriptions'),
  }));

  const subscribers = new Set();

  for (const sub of makerSubs) { subscribers.add(sub[4]); }
  for (const sub of compoundSubs) { subscribers.add(sub[0]); }
  for (const sub of aaveSubs) { subscribers.add(sub[0]); }

  const { output: assetsLocked } = await sdk.api.cdp.getAssetsLocked({
    block,
    targets: [...subscribers]
  });

  return assetsLocked;
}

module.exports = {
  tvl,
  name: 'DeFi Saver',
  token: null,
  website: 'https://defisaver.com/',
  category: 'lending',
  start: 1588723200, // 06/05/2020 @ 02:00 (UTC)
  contributesTo: ['Maker', 'Compound', 'Aave'],
};
