/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const axios = require('axios');
  const _ = require('underscore');
  const moment = require('moment');
  const BigNumber = require('bignumber.js');

/*==================================================
  Helper Functions
  ==================================================*/

  async function GenerateCallList(timestamp) {
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
      ]

      if(converters.length !== pageFetchCount) {
        moreData = false;
      }
    }

    tokenConverters = _.filter(tokenConverters, (converter) => {
      let hasLength = converter.details.length > 0;
      let isEthereum = converter.details[0].blockchain.type == 'ethereum';
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

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const ethAddress = '0x0000000000000000000000000000000000000000';
    let balances = {
      [ethAddress]: (await sdk.api.eth.getBalance({target: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315', block})).output
    };

    const calls = await GenerateCallList(timestamp);
    for (let elem of calls) {
      if (['0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee', '0xc0829421c1d260bd3cb3e0f06cfe2d52db2ce315'].includes(elem.target.toLowerCase())) {
        const ethBalance = (await sdk.api.eth.getBalance({target: elem.params, block})).output;
        balances[ethAddress] = BigNumber(balances[ethAddress]).plus(ethBalance).toFixed();
      }
    };

    const balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls,
      abi: 'erc20:balanceOf'
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

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
    tvl
  }
