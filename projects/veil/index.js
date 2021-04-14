/*==================================================
  Modules
==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  Settings
==================================================*/

  const ethAddress = '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee';
  const vethContractAddress = '0x53b04999C1FF2d77fCddE98935BB936A67209E4C';

/*==================================================
  Main
==================================================*/

  async function tvl (timestamp, block) {
    const ethBalance = (await sdk.api.eth.getBalance({
      block,
      target: vethContractAddress,
    })).output;

    return { [ethAddress]: ethBalance };
  }

/*==================================================
  Exports
==================================================*/

  module.exports = {
    name: 'Veil',
    token: null,
    category: 'derivatives',
    start: 1545177600, // 12/19/2018 @ 12:00am (UTC)
    tvl,
  };
