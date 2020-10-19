/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const axios = require('axios');
  const _ = require('underscore');
  const moment = require('moment');
  const BigNumber = require('bignumber.js');

  /*==================================================
  ABIs
  ==================================================*/

  const abiContractRegistryAddressOf = {
    "inputs": [{
      "internalType": "bytes32",
      "name": "_contractName",
      "type": "bytes32"
    }],
    "name": "addressOf",
    "outputs": [{
      "internalType": "address",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  };
  const abiConverterRegistryGetPools = {
    "inputs": [],
    "name": "getLiquidityPools",
    "outputs": [{
      "internalType": "address[]",
      "name": "",
      "type": "address[]"
    }],
    "stateMutability": "view",
    "type": "function"
  };
  const abiRegistryGetConvertersBySmartTokens = {
    "inputs": [{
      "internalType": "address[]",
      "name": "_smartTokens",
      "type": "address[]"
    }],
    "name": "getConvertersBySmartTokens",
    "outputs": [{
      "internalType": "contract IConverter[]",
      "name": "",
      "type": "address[]"
    }],
    "stateMutability": "view",
    "type": "function"
  };
  const abiConverterConnectorTokens = {
    "inputs": [{
      "internalType": "uint256",
      "name": "",
      "type": "uint256"
    }],
    "name": "connectorTokens",
    "outputs": [{
      "internalType": "contract IERC20Token",
      "name": "",
      "type": "address"
    }],
    "stateMutability": "view",
    "type": "function"
  };

  /*==================================================
  Helper Functions
  ==================================================*/

  async function generateCallsByAPI(timestamp) {
    let tokenConverters = [];

    let moreData = true;
    let index = 0;
    let pageFetchCount = 300;

    while(moreData) {
      let converters = await axios.get('https://api.bancor.network/0.1/converters', {
        params: {
          skip: index,
          limit: pageFetchCount
        }
      });

      converters = converters.data.data.page;

      index += pageFetchCount;

      tokenConverters = [
        ...tokenConverters,
        ...converters
      ];

      if(converters.length !== pageFetchCount) {
        moreData = false;
      }
    }

    tokenConverters = _.filter(tokenConverters, (converter) => {
      let hasLength = converter.details.length > 0;
      let isEthereum = converter.details[0].blockchain.type === 'ethereum';
      let createdTimestamp = moment(converter.createdAt).utcOffset(0).unix();
      let existsAtTimestamp = createdTimestamp <= timestamp;

      return hasLength && isEthereum && existsAtTimestamp;
    });

    let calls = [];

    _.each(tokenConverters, (converter) => {
      let details = converter.details[0];
      let reserves = details.reserves;

      let owners = _.map(converter.converters, (converter) => {
        return converter.blockchainId;
      });

      _.each(owners, (owner) => {
        if (owner === undefined) {
          return;
        }

        _.each(reserves, (reserve) => {
          let address = reserve.blockchainId;

          calls.push({
            target: address,
            params: owner
          })
        })
      });
    });

    return calls;
  }

  async function generateCallsByBlockchain(block) {
    const registryAddress = '0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4';
    const converterRegistryHex = '0x42616e636f72436f6e7665727465725265676973747279';

    let result;

    // get converter registry address
    result = await sdk.api.abi.call({
      target: registryAddress,
      abi: abiContractRegistryAddressOf,
      params: [converterRegistryHex],
      block
    });

    const converterRegistryAddress = result.output;

    // get pool anchor addresses
    result = await sdk.api.abi.call({
      target: converterRegistryAddress,
      abi: abiConverterRegistryGetPools,
      block
    });

    // get converter addresses
    result = await sdk.api.abi.call({
      target: converterRegistryAddress,
      abi: abiRegistryGetConvertersBySmartTokens,
      params: [result.output],
      block
    });

    // get reserve token addresses (currently limited to 2)
    const converterAddresses = result.output;
    const reserveTokenCalls = [];
    for (let i = 0; i < converterAddresses.length; i++) {
      reserveTokenCalls.push({
        target: converterAddresses[i],
        params: [0]
      });
      reserveTokenCalls.push({
        target: converterAddresses[i],
        params: [1]
      });
    }

    result = await sdk.api.abi.multiCall({
      calls: reserveTokenCalls,
      abi: abiConverterConnectorTokens,
      block
    });

    // create reserve balance calls
    const balanceCalls = [];
    for (let i = 0; i < result.output.length; i++) {
      const item = result.output[i];
      balanceCalls.push({
        target: item.output,
        params: [item.input.target]
      });
    }

    return balanceCalls;
  }

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balanceCalls;
    if (timestamp < 1577836800) {
      balanceCalls = await generateCallsByAPI(timestamp);
    }
    else {
      balanceCalls = await generateCallsByBlockchain(block);
    }

    // get ETH balances
    const ethAddress = '0x0000000000000000000000000000000000000000';
    let balances = {
      [ethAddress]: (await sdk.api.eth.getBalance({target: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315', block})).output
    };

    const ethReserveAddresses = ['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315'];
    const ethBalanceCalls = balanceCalls.filter((call) => ethReserveAddresses.includes(call.target.toLowerCase()));

    await (
      Promise.all(ethBalanceCalls.map(async (call) => {
        const ethBalance = (await sdk.api.eth.getBalance({target: call.params[0], block})).output;
        balances[ethAddress] = BigNumber(balances[ethAddress]).plus(ethBalance).toFixed();
      }))
    );

    // get reserve balances
    result = await sdk.api.abi.multiCall({
      calls: balanceCalls,
      abi: 'erc20:balanceOf',
      block
    });

    // filtering out bad balances (hacky)
    result.output = result.output.filter((item) => item.success && item.output.length < 60);

    sdk.util.sumMultiBalanceOf(balances, result);

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Bancor',
    token: 'BNT',
    category: 'dexes',
    start: 1501632000,  // 08/02/2017 @ 12:00am (UTC)
    tvl,
  };
