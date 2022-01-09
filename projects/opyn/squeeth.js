/*==================================================
  Modules
==================================================*/

const sdk = require('../../sdk');
const _ = require('underscore');
const BigNumber = require('bignumber.js');

/*==================================================
  Settings
==================================================*/

const START_BLOCK = 13944813;
const ETH = '0x0000000000000000000000000000000000000000'.toLowerCase();

const controller = "0x4c1fd946a082d26b40154eabd12f7a15a0cb3020";

/*==================================================
  TVL
==================================================*/

module.exports = async function tvl(timestamp, block) {  
  let balances = {};

  if(block >= START_BLOCK) {
    
    // get ETH balance
    const balance = (await sdk.api.eth.getBalance({ target: controller, block })).output;
    balances[ETH] = BigNumber(balances[ETH] || 0).plus(BigNumber(balance)).toFixed();
  
  }

  return balances;
}