require('dotenv').config();

const defisaverABIs = require('./abis');

const bytesToString = (hex) => Buffer.from(hex.replace(/^0x/, ''), 'hex').toString().replace(/\x00/g, '');

const getContractAddress = (contractName) => defisaverABIs[contractName].networks[1].address;

const getContractBlock = (contractName) => defisaverABIs[contractName].networks[1].createdBlock;

const getContractMethod = (methodName, contractName) => defisaverABIs[contractName].abi.find(i => i.name === methodName);

module.exports = {
  bytesToString,
  getContractAddress,
  getContractMethod,
  getContractBlock,
}
