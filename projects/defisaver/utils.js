require('dotenv').config();

const retry = require('async-retry');
const axios = require('axios');

const defisaverABIs = require('./abis');

const getContractAddress = (contractName) => defisaverABIs[contractName].networks[1].address;

const getContractMethod = (methodName, contractName) => defisaverABIs[contractName].abi.find(i => i.name === methodName);

const getTokenPrices = async (addresses) => retry(bail => axios.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addresses.join(',')}&vs_currencies=usd`));

const getEthPrice = async () => retry(bail => axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`));

module.exports = {
  getContractAddress,
  getContractMethod,
  getTokenPrices,
  getEthPrice,
}
