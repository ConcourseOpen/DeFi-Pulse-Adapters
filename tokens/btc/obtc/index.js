/*==================================================
  Modules
==================================================*/

const sdk = require('../../../sdk');

/*==================================================
  Settings
==================================================*/

const oBTCContract = '0x8064d9ae6cdf087b1bcd5bdf3531bd5d8c537a68';

/*==================================================
  Main
==================================================*/

async function balance (timestamp, block) {
  const oBTCTotalSupply = (
    await sdk.api.erc20.totalSupply({
      block,
      target: oBTCContract
    })
  ).output;

  return { [oBTCContract]: oBTCTotalSupply };
}

/*==================================================
  Exports
==================================================*/

module.exports = {
  name: 'BoringDAO BTC',
  symbol: "oBTC",
  type: 'custodial',
  start: 1605269554,  // Nov-12-2020 08:25:54 AM +UTC
  balance,
};
