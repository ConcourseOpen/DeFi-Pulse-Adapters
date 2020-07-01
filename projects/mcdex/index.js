/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const ethBalance = (await sdk.api.eth.getBalance({ target: '0x220a9f0DD581cbc58fcFb907De0454cBF3777f76', block })).output;

    return (await sdk.api.util.toSymbols({
      "0x0000000000000000000000000000000000000000": ethBalance,
    })).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'MCDEX',
    website: 'https://mcdex.io',
    token: 'MCB',
    category: 'Derivatives',  // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1592478252,        // block 10289326
    tvl,
  };
