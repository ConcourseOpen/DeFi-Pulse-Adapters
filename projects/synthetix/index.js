/*==================================================
  Modules
==================================================*/

  const sdk = require('../../sdk');
  const BigNumber = require('bignumber.js');
  const _ = require('underscore');
  const axios = require('axios');
  const abi = require('./abi');

/*==================================================
  Settings
==================================================*/

  const snxContract = '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F';
  const stateAddress = '0x4b9Ca5607f1fF8019c1C6A3c2f0CC8de622D5B82';

/*==================================================
  Main
==================================================*/

  async function tvl (timestamp, block) {
    let totalSNXLocked = new BigNumber(0);
    const holders = (await axios(`https://api.ethplorer.io/getTopTokenHolders/${snxContract}?apiKey=uxips4087TKQO109&limit=1000`)).data["holders"].map(holder => holder.address);
    const issuanceRatio = (await sdk.api.abi.call({
      block,
      target: stateAddress,
      abi: abi['issuanceRatio']
    })).output;

    const collateral = (await sdk.api.abi.multiCall({
      block,
      abi: abi['collateral'],
      calls: _.map(holders, holder => ({ target: snxContract, params: holder }))
    })).output;

    const ratio = (await sdk.api.abi.multiCall({
      block,
      abi: abi['collateralisationRatio'],
      calls: _.map(holders, holder => ({ target: snxContract, params: holder }))
    })).output;

    _.forEach(holders, (holder) => {
      let _collateral = _.find(collateral, result => result.input.params[0] === holder).output;
      let _ratio = _.find(ratio, result => result.input.params[0] === holder).output;
      let locked = _collateral * Math.min(1, _ratio / issuanceRatio);
      totalSNXLocked = totalSNXLocked.plus(locked);
    });

    return { [snxContract]: totalSNXLocked.toFixed() };
  }

/*==================================================
  Exports
==================================================*/

  module.exports = {
    name: 'Synthetix',
    token: 'SNX',
    category: 'Derivatives',
    start: 1551139200,  // 02/26/2019 @ 12:00am (UTC)
    tvl,
  };
