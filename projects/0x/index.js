/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {
      '0xe41d2489571d322189246dafa5ebde1f4699f498': (await sdk.api.abi.call({block,target: '0xe41d2489571d322189246dafa5ebde1f4699f498',params: '0xba7f8b5fb1b19c1211c5d49550fcd149177a5eaf',abi: 'erc20:balanceOf'})).output
    };

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: '0x Project', // project name
    token: 'ZRX',              // ZRX token
    category: 'dexes',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1574023865,        // Nov-17-2019 08:51:05 PM +UTC
    tvl                       // tvl adapter
  }
