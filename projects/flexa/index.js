/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const abi = require('./abi');

/*==================================================
  Settings
  ==================================================*/
  
  const flexaContract = '0x4a57E687b9126435a9B19E4A802113e266AdeBde'; // Flexa Contract
  const stakingAddress = '0x12f208476f64de6e6f933e55069ba9596d818e08'; // Flexa Staking


/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {

    const capacity = (await sdk.api.abi.call({
      target: flexaContract,
      params: stakingAddress,
      abi: abi.balanceOf,
    })).output;

    return {[flexaContract]:capacity};
  
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Flexa',
    token: 'FXC',
    category: 'payments',
    start: 1546639415,        // Jan-04-2019 10:03:35 PM +UTC
    tvl
  }
