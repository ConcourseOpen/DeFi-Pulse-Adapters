require('dotenv').config();

const sdk = require('../../sdk');
const utils = require('../../sdk/util');

const { bytesToString, getContractAddress, getContractMethod, getContractBlock } = require('./utils');

async function tvl(timestamp, block) {
  let makerSubs = [];
  let compoundSubs = [];
  let aaveSubs = [];
  let aaveV2Subs = [];

  if (block >= getContractBlock('McdSubscriptions')) makerSubs = (await sdk.api.abi.call({
    block,
    target: getContractAddress('McdSubscriptions'),
    abi: getContractMethod('getSubscribers', 'McdSubscriptions'),
  })).output;

  let calls = [];
  let cdpsDetailed = [];
  let cdpInfo = [];

  for (const cdp of makerSubs) {
    calls = [
      ...calls,
      { target: getContractAddress('MCDSaverProxy'), params: [cdp[5]] },
    ];
  }

  if (block >= getContractBlock('McdSubscriptions')) {
    cdpsDetailed = (await sdk.api.abi.multiCall({
      block,
      calls,
      abi: getContractMethod('getCdpDetailedInfo', 'MCDSaverProxy'),
    })).output;

    makerSubs.forEach((cdp, i) => {
      cdpInfo = [
        ...cdpInfo,
        {
          id: cdp[5],
          ilk: bytesToString(cdpsDetailed.find(({ input }) => input.params[0] === cdp[5]).output[3]),
        },
      ];
    });
  }

  if (block >= getContractBlock('CompoundSubscriptions')) compoundSubs = (await sdk.api.abi.call({
    block,
    target: getContractAddress('CompoundSubscriptions'),
    abi: getContractMethod('getSubscribers', 'CompoundSubscriptions'),
  })).output;

  // Aave V1 - contract destruction block: 12837601
  if ((block >= getContractBlock('AaveSubscriptions')) && (block < 12837601)) {
    aaveSubs = (await sdk.api.abi.call({
      block,
      target: getContractAddress('AaveSubscriptions'),
      abi: getContractMethod('getSubscribers', 'AaveSubscriptions'),
    })).output;
  }

  // Aave V2
  if (block >= getContractBlock('AaveV2Subscriptions')) {
    aaveV2Subs = (await sdk.api.abi.call({
      block,
      target: getContractAddress('AaveV2Subscriptions'),
      abi: getContractMethod('getSubscribers', 'AaveV2Subscriptions'),
    })).output;
  }


  const compoundSubscribers = new Set();
  const aaveSubscribers = new Set();
  const aaveV2Subscribers = new Set();

  for (const sub of aaveV2Subs) { aaveV2Subscribers.add(sub[0]); }
  for (const sub of compoundSubs) { compoundSubscribers.add(sub[0]); }
  for (const sub of aaveSubs) { aaveSubscribers.add(sub[0]); }

  let makerBalances = (await sdk.api.cdp.maker.getAssetsLocked({
    block,
    targets: cdpInfo,
    ids: true
  })).output;

  let compoundBalances = (await sdk.api.cdp.compound.getAssetsLocked({
    block,
    targets: [...compoundSubscribers]
  })).output;

  let aaveBalances = (await sdk.api.cdp.aave.getAssetsLocked({
    block,
    targets: [...aaveSubscribers]
  })).output;

  let aaveV2Balances = (await sdk.api.cdp.aave.getAssetsLocked({
    block,
    targets: [...aaveV2Subscribers]
  })).output;

  let balances = utils.sum([makerBalances, compoundBalances, aaveBalances, aaveV2Balances]);
  if (Object.keys(balances).length === 0) {
    balances = {
      "0x0000000000000000000000000000000000000000": "0"
    }
  }

  return balances;
}

module.exports = {
  tvl,
  name: 'DeFi Saver',
  token: null,
  website: 'https://defisaver.com/',
  category: 'Lending',
  start: 1586430640, // 09/04/2020 @ 11:10 (UTC)
  contributesTo: ['Maker', 'Compound', 'Aave'],
};
