/*==================================================
  Modules
  ==================================================*/

// const { result } = require('underscore');
const sdk = require('../../sdk');

const abi = require('./abi');

const axios = require('axios');
/*==================================================
  TVL
  ==================================================*/

async function getBalance(vaultsInfo, timestamp, block) {
  try {
    let result = await sdk.api.abi.call({
      target: vaultsInfo.vault_address,
      abi: abi['balance'],
      block
    });
    return { token: vaultsInfo.token, balance: parseInt(result.output) };
  } catch (error) {
    return { token: vaultsInfo.token, balance: 0 };
  }
}

async function tvl(timestamp, block) {

  // off-chain api to fetch available Mushrooms Vaults https://github.com/mushroomsforest/deployment/blob/main/apis.md
  let addressListResponse = await axios.get('https://vjeieiw4tf.execute-api.us-east-1.amazonaws.com/apy');


  let vaultsInfo = addressListResponse.data.result.vaults;

  let res = await Promise.all(vaultsInfo.map(info => getBalance(info, timestamp, block)));
  let balances = {};
  for (let i = 0; i < res.length; i++) {
    let result = res[i];
    balances[result.token] = balances[result.token] || 0;
    balances[result.token] += result.balance;
  }


  console.log(balances);
  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Mushrooms Finance', // project name
  token: "MM",              // null, or token symbol if project has a custom token
  category: 'assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1604160000,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
  tvl                       // tvl adapter
}
