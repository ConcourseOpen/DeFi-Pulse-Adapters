require('dotenv').config();

const defisaverABIs = require('./abis');

const getContractAddress = (contractName) => defisaverABIs[contractName].networks[1].address;

const getContractBlock = (contractName) => defisaverABIs[contractName].networks[1].createdBlock;

const getContractMethod = (methodName, contractName) => defisaverABIs[contractName].abi.find(i => i.name === methodName);

module.exports = {
  getContractAddress,
  getContractMethod,
  getContractBlock,
}
