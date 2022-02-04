const sdk = require("../../../sdk");
const axios = require("axios");

const abi = {
  "balance": {
    "inputs": [],
    "name": "balance",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
}

/*==================================================
  TVL
  ==================================================*/
async function getBalance(vaultInfo, block) {
  try {
    const token = vaultInfo.token;
    const target = vaultInfo.vault_address;
    let getBalance = await sdk.api.abi.call({
      target,
      abi: abi['balance'],
      block
    });
    const balance = parseInt(getBalance.output);
    return { token, balance };
  } catch (error) {
    return { token: vaultInfo.token, balance: 0 };
  }
}

async function fetchVaultsInfo() {
  // off-chain api to fetch available Mushrooms Vaults https://github.com/mushroomsforest/deployment/blob/main/apis.md
  let addressListResponse = await axios.get('https://vjeieiw4tf.execute-api.us-east-1.amazonaws.com/apy');
  return addressListResponse.data.result.vaults;
}

async function tvl(timestamp, block) {
  const vaultsInfo = await fetchVaultsInfo();
  let res = await Promise.all(vaultsInfo.map(info => getBalance(info, block)));
  let balances = {};
  for (let i = 0; i < res.length; i++) {
    let result = res[i];
    balances[result.token] = balances[result.token] || 0;
    balances[result.token] += result.balance;
  }
  return balances;
}

module.exports = {
    /* Project Metadata */
    name: 'Mushrooms Finance', // project name
    token: "MM",              // null, or token symbol if project has a custom token
    category: 'Assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1604160000,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
    tvl,
  };

