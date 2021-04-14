/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');


  /*==================================================
    Settings
    ==================================================*/

  const flexacoin = '0x4a57E687b9126435a9B19E4A802113e266AdeBde'; // Flexa Contract
  const fxcStaking = '0x12f208476f64de6e6f933e55069ba9596d818e08'; // Flexa Staking

  const amp = '0xff20817765cb7f73d4bde2e66e067e58d11095c2'; // Amp Contract
  const ampCollateralManager = '0x706D7F8B3445D8Dfc790C524E3990ef014e7C578'; // Amp Collateral Manager

  /*==================================================
    TVL
    ==================================================*/

  async function tvl(timestamp, block) {
    fxcCapacity = (await sdk.api.erc20.balanceOf({
      target: flexacoin,
      owner: fxcStaking,
      block: block,
    })).output;

    // The AMP token was deployed in block 10635417 
    if (block >= 10635417) {
      ampCapacity = (await sdk.api.erc20.balanceOf({
        target: amp,
        owner: ampCollateralManager,
        block: block,
      })).output;
    } else {
      ampCapacity = 0;
    }

    return {
      [flexacoin]: fxcCapacity,
      [amp]: ampCapacity
    };
  }
  /*==================================================
    Exports
    ==================================================*/

  module.exports = {
    name: 'Flexa',
    website: 'https://flexa.network',
    token: null,
    category: 'payments',
    start: 1546646400, // 01/05/2019
    tvl,
  };