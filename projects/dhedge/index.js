/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const utils = require('web3-utils');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');
  const { synthetix } = require('@synthetixio/js');

  const abi = require('./abi');

/*==================================================
  TVL
  ==================================================*/
  const snxjs = synthetix({ network: 'mainnet' });
  const syntheticAssets = snxjs.tokens.map(({ symbol, address }) => {
    return {
      symbol,
      address
    }
  })

  async function tvl(timestamp, block) {
    let logs = (await sdk.api.util.getLogs({
      target: '0x03D20ef9bdc19736F5e8Baf92D02C8661a5941F7',
      topic: 'FundCreated(address,bool,string,string,address,uint256,uint256,uint256)',
      fromBlock: 11106315 ,
      toBlock: block,
    })).output;

    // Fund Addresses
    const fundAddresses = logs
    .map((log) =>
      typeof log === 'string' ? log : `0x${log.data.slice(64 - 40 + 2, 64 + 2)}`
    )
    .map((address) => address.toLowerCase());

    // this fetches raw token composition for every fund address
    const fundData = (await sdk.api.abi.multiCall({
      calls: _.map(fundAddresses, (address) => ({ target: address })),
      abi: abi.getFundComposition,
    })).output;
   
    const formattedFund = {}
    _.forEach(fundData, (fund) => {
      const fundAddress = fund.input.target;

      if (fund.output) {
        const synths = fund.output[0]
        const amounts = fund.output[1]
        
        const formattedSynthsList = synths.map(synth =>  {
          const synthName = utils.hexToUtf8(synth)
          const matchedSymbol = syntheticAssets.find(asset => asset.symbol === synthName)
          const { address } = matchedSymbol;
          return address
        });
        
        const fundComposition = amounts.reduce((result, field, index) => {
          const value = Number(field)          
          result[formattedSynthsList[index]] = value;
          return result; 
        }, {})

        formattedFund[fundAddress] = {
          fundComposition: fundComposition
        }
      }

      return fundAddress;
    })
    
    const sumKeys = (acc, [key, value]) => {
      if (acc[key]) return {...acc, [key]: acc[key] + value }
      return {...acc, [key]: value }
    }

    const obj = Object.values(formattedFund).reduce((acc, {fundComposition}) => {
      const items = Object.entries(fundComposition)
      return items.reduce(sumKeys, acc)
    }, {})
    
    const balances =  Object.keys(obj).reduce((acc, next) => {
      acc[next] = BigNumber(obj[next]).toFixed()
      return acc;
    }, {});
        
    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'dHEDGE',
    token: 'DHT',
    category: 'assets',
    start : 1603256400, // (October 21, 2020 @ 12:00:00 am)
    tvl
  }
