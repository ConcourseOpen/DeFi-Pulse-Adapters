/*==================================================
  Modules
==================================================*/

const sdk = require('../../sdk');
const _ = require('underscore');
const BigNumber = require('bignumber.js');

/*==================================================
  Settings
==================================================*/

const START_BLOCK = 13977497;
const ETH = '0x0000000000000000000000000000000000000000'.toLowerCase();

const controller = "0x0344f8706947321fa87881d3dad0eb1b8c65e732".toLowerCase();

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