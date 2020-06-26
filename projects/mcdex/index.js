/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {
      "0x0000000000000000000000000000000000000000": (await sdk.api.eth.getBalance({ target: '0x220a9f0DD581cbc58fcFb907De0454cBF3777f76', block })).output,
    };
    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'MCDEX',
    website: 'https://mcdex.io',
    token: 'MCB',
    category: 'derivatives',  // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1592478136,        // block 10289316
    tvl
  }
