require('dotenv').config();

const retry = require('async-retry');
const axios = require('axios');

const defisaverABIs = require('./abis');

const timeConverter = (timestamp) => {
  const a = new Date(timestamp * 1000);
  const year = a.getFullYear();
  const month = a.getMonth() + 1;
  const date = a.getDate();
  return `${date}-${month}-${year}`;
}

const getContractAddress = (contractName) => defisaverABIs[contractName].networks[1].address;

const getContractMethod = (methodName, contractName) => defisaverABIs[contractName].abi.find(i => i.name === methodName);

const getTokenPrices = async (addresses) => retry(bail => axios.get(`https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${addresses.join(',')}&vs_currencies=usd`));

const getHistoricPrice = async (coinId, timestamp) => {
  const date = timeConverter(timestamp);
  return retry(bail => axios.get(`https://api.coingecko.com/api/v3/coins/${coinId}/history?date=${date}&localization=false`));
}

const getEthPrice = async () => retry(bail => axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`));

const getPricesForAssetsAtTimestamp = async (timestamp, idsMap) => {
  let prices = {};
  for (const key in idsMap) {
    try {
      prices[key] = (await getHistoricPrice(idsMap[key], timestamp)).data.market_data.current_price.usd;
    } catch (err) {
      console.log(err);
    }
  }
  return prices;
}

module.exports = {
  getContractAddress,
  getContractMethod,
  getTokenPrices,
  getEthPrice,
  getHistoricPrice,
  getPricesForAssetsAtTimestamp
}
