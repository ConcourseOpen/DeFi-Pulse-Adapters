/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  let getBalance = await sdk.api.eth.getBalance({target: '0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b', block});

  return {
    '0x0000000000000000000000000000000000000000': getBalance.output
  };
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Augur',
  token: 'REP',
  category: 'Derivatives',
  start: 1531008000, // 07/08/2018 @ 12:00am (UTC)
  tvl
}
