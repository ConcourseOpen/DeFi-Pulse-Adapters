/*==================================================
  Modules
  ==================================================*/

const _ = require('underscore');
const sdk = require('../../sdk');
const abi = require('./abi.json');
const BigNumber = require('bignumber.js');


/*==================================================
  Settings
  ==================================================*/

const comptroller = '0xAB1c342C7bf5Ec5F02ADEA1c2270670bCa144CbB';
const y3Crv = '0x9cA85572E6A3EbF24dEDd195623F188735A5179f';
const pool3 = '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490';

/*==================================================
  TVL
  ==================================================*/

// ask comptroller for all markets array
async function getAllCTokens(block) {
  return (await sdk.api.abi.call({
    block,
    target: comptroller,
    params: [],
    abi: abi['getAllMarkets'],
  })).output;
}

async function getUnderlyingAddresses(block, cTokens) {
  return (await sdk.api.abi.multiCall({
    block,
    calls: _.map(cTokens, (cToken) => ({
      target: cToken
    })),
    abi: abi['underlying'],
  })).output;
}

async function getCashes(block, cTokens) {
  return (await sdk.api.abi.multiCall({
    block,
    calls: _.map(cTokens, (cToken) => ({
      target: cToken
    })),
    abi: abi['getCash']
  })).output;
}

async function getY3CrvPrice(block) {
  return (await sdk.api.abi.call({
    block,
    target: y3Crv,
    params: [],
    abi
    : abi['getPricePerFullShare']
  })).output;
}

module.exports = async function tvl(timestamp, block) {
  if (block < 11384868) {
    return {};
  }

  const allCTokens = await getAllCTokens();
  const [
    underlyingAddresses,
    cashes,
    y3CrvPrice
  ] = await Promise.all([
    getUnderlyingAddresses(block, allCTokens),
    getCashes(block, allCTokens),
    getY3CrvPrice(block)
  ]);

  let balances = {};
  _.each(allCTokens, (cToken) => {
    let getCash = _.find(cashes, (result) => result.success && result.input.target === cToken);
    let underlying = _.find(underlyingAddresses, (result) => result.success && result.input.target === cToken);
    if (getCash && underlying) {
      getCash = getCash.output;
      underlying = underlying.output;
      if (underlying === y3Crv) {
        const pool3Cash = BigNumber(balances[pool3] || 0);
        const y3CrvCash = BigNumber(getCash).multipliedBy(y3CrvPrice).div(1e18).integerValue();
        balances[pool3] = pool3Cash.plus(y3CrvCash).toFixed();
        delete balances[underlying];
      } else {
        balances[underlying] = BigNumber(getCash).toFixed();
      }
    }
  })

  return balances;
};
