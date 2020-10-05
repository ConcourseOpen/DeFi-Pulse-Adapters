/*==================================================
  Modules
==================================================*/

  const sdk = require('../../sdk');
  const BigNumber = require('bignumber.js');
  const _ = require('underscore');
  const abi = require('./abi');
  const pageResults = require('graph-results-pager');
  const { synthetix, Network } = require('@synthetixio/js');
  const { ethers } = require('ethers');

/*==================================================
  Settings
==================================================*/
  const snxjs = synthetix(process.env.INFURA_KEY ? {
    network: Network.Mainnet,
    provider: new ethers.providers.InfuraProvider(
      'homestead',
      process.env.INFURA_KEY
    )
  }  : { network: Network.Mainnet });
  const snxGraphEndpoint = 'https://api.thegraph.com/subgraphs/name/synthetixio-team/synthetix';

/*==================================================
  Main
==================================================*/

  async function tvl (timestamp, block) {

    let totalTopStakersSNXLocked = new BigNumber(0);
    let totalTopStakersSNX = new BigNumber(0);

    const holders = await SNXHolders(block);

    const issuanceRatio = (await sdk.api.abi.call({
      block,
      target: snxjs.contracts.SynthetixState.address,
      abi: abi['issuanceRatio']
    })).output;

    const ratio = (await sdk.api.abi.multiCall({
      block,
      abi: abi['collateralisationRatio'],
      calls: _.map(holders, holder => ({ target: snxjs.contracts.Synthetix.address, params: holder.id }))
    })).output;

    _.forEach(holders, (holder) => {
      let _collateral = holder.collateral;
      let _ratio = _.find(ratio, result => result.input.params[0] === holder.id).output;
      let locked = _collateral * Math.min(1, _ratio / issuanceRatio);
      totalTopStakersSNX = totalTopStakersSNX.plus(_collateral)
      totalTopStakersSNXLocked = totalTopStakersSNXLocked.plus(locked);
    });

    const percentLocked = totalTopStakersSNXLocked.div(totalTopStakersSNX);
    const unformattedSnxTotalSupply = await snxjs.contracts.Synthetix.totalSupply();
    const snxTotalSupply = parseInt(snxjs.utils.formatEther(unformattedSnxTotalSupply));
    const totalSNXLocked = percentLocked.times(snxTotalSupply);

    return { [snxjs.contracts.Synthetix.address]: totalSNXLocked.toFixed() };
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
