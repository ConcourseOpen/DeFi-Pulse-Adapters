/*==================================================
  Modules
  ==================================================*/

  const abi = require('./abi');
  const sdk = require('../../sdk');

/*==================================================
  Settings
  ==================================================*/
  
  const flexaNetwork = '0x4a57E687b9126435a9B19E4A802113e266AdeBde'; // Flexa Contract
  const stakingAddress = '0x12f208476f64de6e6f933e55069ba9596d818e08'; // Flexa Staking

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const capacity = (await sdk.api.abi.call({
      target: flexaNetwork,
      params: stakingAddress,
      block: block,
      abi: abi.balanceOf,
    })).output;

    return (await sdk.api.util.toSymbols({[flexaNetwork]:capacity})).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Flexa',
    token: 'FXC',
    category: 'Payments',
    start: 1546646400,        // 01/05/2019
    tvl,
  };
