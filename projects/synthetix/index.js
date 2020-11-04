/*==================================================
  Modules
==================================================*/

  const sdk = require('../../sdk');
  const BigNumber = require('bignumber.js');
  const _ = require('underscore');
  const abi = require('./abi');
  const pageResults = require('graph-results-pager');

/*==================================================
  Settings
==================================================*/

  const snxContract = '0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F';
  const stateAddress = '0x4b9Ca5607f1fF8019c1C6A3c2f0CC8de622D5B82';
  const snxGraphEndpoint = 'https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix';

/*==================================================
  Main
==================================================*/

  async function tvl (timestamp, block) {

    let totalSNXLocked = new BigNumber(0);

    const holders = await SNXHolders(block);

    const issuanceRatio = (await sdk.api.abi.call({
      block,
      target: stateAddress,
      abi: abi['issuanceRatio']
    })).output;

    const ratio = (await sdk.api.abi.multiCall({
      block,
      abi: abi['collateralisationRatio'],
      calls: _.map(holders, holder => ({ target: snxContract, params: holder.id }))
    })).output;

    _.forEach(holders, (holder) => {
      let _collateral = holder.collateral;
      let _ratio = _.find(ratio, result => result.input.params[0] === holder.id).output;
      let locked = _collateral * Math.min(1, _ratio / issuanceRatio);
      totalSNXLocked = totalSNXLocked.plus(locked);
    });

    return { [snxContract]: totalSNXLocked.toFixed() };
  }

  // Uses graph protocol to run through SNX contract. Since there is a limit of 100 results per query
  // we can use graph-results-pager library to increase the limit.
  async function SNXHolders(blockNumber) {
    return await pageResults({
      api: snxGraphEndpoint,
      query: {
        entity: 'snxholders',
        selection: {
          orderBy: 'collateral',
          orderDirection: 'desc',
          block : {
            number : blockNumber
          },
          where : {
            collateral_gt : 0
          }
        },
        properties: ['collateral', 'id'],
      },
      max: 10000, // top 10000 SNX holders with collateral. At the time of this commit, there are 51,309 SNX holders. (7/27/2020)
    });
  }

/*==================================================
  Exports
==================================================*/

  module.exports = {
    name: 'Synthetix',
    token: 'SNX',
    category: 'derivatives',
    start: 1565287200,  // Fri Aug 09 2019 00:00:00
    tvl,
  };
