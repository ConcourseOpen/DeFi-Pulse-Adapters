/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const utils = require('web3-utils');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');
  const abi = require('./abi');


/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const availableCurrencyKeys = (await sdk.api.abi.call({
      target: "0x6eB3aC83701f624bAEfBc50db654b53d1F51dC94",
      abi: abi['availableCurrencyKeys']
    })).output;

    let syntheticAssets = (await sdk.api.abi.multiCall({
      block,
      abi: abi['getSynth'],
      calls: _.map(availableCurrencyKeys, currencyKey => ({
        target: "0x823bE81bbF96BEc0e25CA13170F5AaCb5B79ba83", params: currencyKey
      }))
    })).output;

    syntheticAssets =   syntheticAssets.map((token) => ({
      symbol: utils.hexToUtf8(token.input.params[0]),
      address: token.output
    }));

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
          const { address } = matchedSymbol || {address: '0x'};
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

    return (await sdk.api.util.toSymbols(balances)).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'dHEDGE',
    token: 'DHT',
    category: 'Assets',
    start : 1603330647, // (Oct-22-2020 01:37:27 PM +UTC)
    tvl
  }
