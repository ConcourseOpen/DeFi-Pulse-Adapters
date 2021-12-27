/*==================================================
  Modules
  ==================================================*/

const _ = require('underscore');
const sdk = require('../../sdk');
const utils = require('../../sdk/util');

/*==================================================
  Settings
  ==================================================*/

const addressV2 = '0x498b3BfaBE9F73db90D252bCD4Fa9548Cd0Fd981';
const dsaIndexAddress = '0x2971AdFa57b20E5a416aE5a708A8655A9c74f723';

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  let smartWallets = (await sdk.api.util.getLogs({
    target: addressV2,
    topic: 'Created(address,address,address)',
    decodeParameter: 'address',
    fromBlock: 7523220,
    toBlock: block
  })).output;

  let dsaEvents = (await sdk.api.util.getLogs({
    target: dsaIndexAddress,
    topic: 'LogAccountCreated(address,address,address,address)',
    keys: ['topics'],
    fromBlock: 9747240,
    toBlock: block
  }));

  let dsaWallets = _.map(dsaEvents.output, (event) => {
    return `0x${event[2].slice(26)}`
  });

  let allWallets = smartWallets.concat(dsaWallets);

  let makerBalances = (await sdk.api.cdp.maker.getAssetsLocked({
    block,
    targets: allWallets,
  })).output;

  let compoundBalances = (await sdk.api.cdp.compound.getAssetsLocked({
    block,
    targets: allWallets
  })).output;

  let aaveBalances = (await sdk.api.cdp.aave.getAssetsLocked({
    block,
    targets: allWallets
  })).output;

  let balances = utils.sum([makerBalances, compoundBalances, aaveBalances]);
  if (Object.keys(balances).length === 0) {
    balances = {
      "0x0000000000000000000000000000000000000000": "0"
    }
  }

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'InstaDApp',
  token: 'INST',
  category: 'Lending',
  contributesTo: ['Maker', 'Compound'],
  start: 1543622400,  // 12/01/2018 @ 12:00am (UTC)
  tvl,
};
