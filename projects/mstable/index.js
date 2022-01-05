/*==================================================
  Modules
==================================================*/

const sdk = require('../../sdk');

/*==================================================
Settings
==================================================*/

const abi_v1 = require('./abi-massetv1.json');
const abi_v2 = require('./abi-massetv2.json');

const mUSD_data = {
  version: 1,
  v1_addr: '0x66126B4aA2a1C07536Ef8E5e8bD4EfDA1FdEA96D',
  addr: '0xe2f2a5C287993345a840Db3B0845fbC70f5935a5',
  start: 0,
  upgrade: 12094376,
  isFPool: false
};
const mBTC_data = {
  version: 2,
  addr: '0x945Facb997494CC2570096c74b5F66A3507330a1',
  start: 11840521,
  isFPool: false
}
const mAssets = [mUSD_data, mBTC_data];

const HBTC_data = {
  version: 2,
  addr: '0x48c59199Da51B7E30Ea200a74Ea07974e62C4bA7',
  start: 12146825,
  isFPool: true
}
const TBTC_data = {
  version: 2,
  addr: '0xb61A6F928B3f069A68469DDb670F20eEeB4921e0',
  start: 12146825,
  isFPool: true
}
const TBTCv2_data = {
  version: 2,
  addr: '0xc3280306b6218031E61752d060b091278d45c329',
  start: 13460377,
  isFPool: true
}
const BUSD_data = {
  version: 2,
  addr: '0xfE842e95f8911dcc21c943a1dAA4bd641a1381c6',
  start: 12146825,
  isFPool: true
}
const GUSD_data = {
  version: 2,
  addr: '0x4fB30C5A3aC8e85bC32785518633303C4590752d',
  start: 12146825,
  isFPool: true
}
const alUSD_data = {
  version: 2,
  addr: '0x4eaa01974b6594c0ee62ffd7fee56cf11e6af936',
  start: 12806795,
  isFPool: true
}
const RAI_data = {
  version: 2,
  addr: '0x36F944B7312EAc89381BD78326Df9C84691D8A5B',
  start: 13643595,
  isFPool: true
}
const FEI_data = {
  version: 2,
  addr: '0x2F1423D27f9B20058d9D1843E342726fDF985Eb4',
  start: 13682060,
  isFPool: true
}
const fPools = [HBTC_data, TBTC_data, TBTCv2_data, BUSD_data, GUSD_data, alUSD_data, RAI_data, FEI_data];

/*==================================================
Main
==================================================*/

async function getV1(pool, block) {
  const res = await sdk.api.abi.call({
    block,
    target: pool.v1_addr,
    abi: abi_v1['getBassets'], pool
  });

  const bAssets = res.output[0];

  const lockedTokens = {};

  bAssets.forEach(b => {
    lockedTokens[b[0]] = b[5]
  });

  return lockedTokens
}

async function getV2(pool, block) {
  const res = await sdk.api.abi.call({
    block,
    target: pool.addr,
    abi: abi_v2['getBassets'],
  });
  const bAssetPersonal = res.output[0];
  const bAssetData = res.output[1];

  const lockedTokens = {};

  bAssetPersonal.forEach((b, i) => {
    if (pool.isFPool && i == 0) return;
    lockedTokens[b[0]] = bAssetData[i][1]
  });

  return lockedTokens;
}

async function tvl(timestamp, block) {
  const tokens = await Promise.all([...mAssets, ...fPools].filter(m => block > m.start).map(m =>
    m.version == 2 || m.upgrade < block ? getV2(m, block) : getV1(m, block)
  ))

  const reduced = tokens.reduce((p, c) => ({ ...p, ...c }), {})

  return reduced;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'mStable',
  category: 'Assets',
  token: 'MTA',
  chain: 'Multichain,Ethereum-Polygon',
  start: 1590624000, // May-28-2020 00:00:00
  tvl,
};
