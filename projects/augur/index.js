/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  let getBalance = await sdk.api.eth.getBalance({target: '0xd5524179cb7ae012f5b642c1d6d700bbaa76b96b', block});

  console.log(getBalance.output);
  return {
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': getBalance.output
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
