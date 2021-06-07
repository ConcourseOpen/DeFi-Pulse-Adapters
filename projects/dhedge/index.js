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
  // const snxjs = synthetix({ network: 'mainnet' });
  // const syntheticAssets = snxjs.tokens.map(({ symbol, address }) => {
  //   return {
  //     symbol,
  //     address
  //   }
  // })

  async function tvl(timestamp, block) {
    const syntheticAssets = [];
    let currencyKeys = (await sdk.api.abi.call({
      target: '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f',
      block,
      abi: abi['availableCurrencyKeys']
    })).output;

    for (let key of currencyKeys) {
      let asset = (await sdk.api.abi.call({
        target: '0x4E3b31eB0E5CB73641EE1E65E7dCEFe520bA3ef2',
        block,
        abi: abi['getSynth'],
        params: key
      })).output;

      let address = (await sdk.api.abi.call({
        target: asset,
        block,
        abi: abi['proxy'],
      })).output;

      syntheticAssets.push({
        symbol: utils.hexToUtf8(key),
        address
      })
    }

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
      block
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

    if(!Object.keys(balances).length) {
      return (await sdk.api.util.toSymbols({
        '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': "0"
      })).output;
    }

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'dHEDGE',
    token: 'DHT',
    category: 'assets',
    start : 1603430647, // (Oct-22-2020 01:37:27 PM +UTC)
    tvl
  };
