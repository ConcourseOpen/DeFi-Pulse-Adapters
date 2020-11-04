/*==================================================
  Modules
==================================================*/

const sdk = require('../../sdk');

/*==================================================
Settings
==================================================*/

const abi = require('./abi.json');
const mUSD_BasketManager = '0x66126B4aA2a1C07536Ef8E5e8bD4EfDA1FdEA96D';

/*==================================================
Main
==================================================*/

async function tvl(timestamp, block) {
  const res = await sdk.api.abi.call({
    block,
    target: mUSD_BasketManager,
    abi: abi['getBassets'],
  });
  const bAssets = res.output[0];

  const lockedTokens = {};

  bAssets.forEach(b => {
    lockedTokens[b[0]] = b[5]
  });

  return lockedTokens;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'mStable',
  token: 'MTA',
  category: 'assets',
  start: 1590624000, // May-28-2020 00:00:00
  tvl
}
