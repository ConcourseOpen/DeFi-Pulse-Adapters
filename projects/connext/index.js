/*==================================================
  Modules
==================================================*/

  const sdk = require('../../sdk');
  const abi = require('./abi');

/*==================================================
  Settings
==================================================*/

  const hubAddress = '0xdfa6edAe2EC0cF1d4A60542422724A48195A5071';
  const tokenDenominationAddress = '0x6b175474e89094c44da98b954eedeac495271d0f';

/*==================================================
  Main
==================================================*/

  async function tvl (timestamp, block) {
    const totalChannelToken = (await sdk.api.abi.call({
      block,
      target: hubAddress,
      abi: abi['totalChannelToken'],
    })).output;

    return {[tokenDenominationAddress]: totalChannelToken};
  }

/*==================================================
  Exports
==================================================*/

  module.exports = {
    name: 'Connext',
    token: null,
    category: 'lending',
    start: 1551916800,  // 03/07/2019 @ 12:00am (UTC)
    tvl,
  };
