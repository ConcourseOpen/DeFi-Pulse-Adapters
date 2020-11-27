/*==================================================
  Modules
  ==================================================*/
const sdk = require('../../sdk');

/*==================================================
  Settings
  ==================================================*/
const GLOBAL_CONFIG_ADDRESS = "0xa13B12D2c2EC945bCAB381fb596481735E24D585";
const SAVINGS_ADDRESS = '0x7a9E457991352F8feFB90AB1ce7488DF7cDa6ed5';
const abi = require('./abi.json');

/*==================================================
  TVL
  ==================================================*/
const utility = {
  // get the latest TokenRegistry address through the GlobalConfig contract
  async getTokenRegistryAddressByGlobalConfig (block) {
    return (await sdk.api.abi.call({
      block,
      target: GLOBAL_CONFIG_ADDRESS,
      params: [],
      abi: abi['tokenInfoRegistry'],
    })).output;
  },

  // Get the latest Bank address through the GlobalConfig contract
  async getBankAddressByGlobalConfig (block) {
    return (await sdk.api.abi.call({
      block,
      target: GLOBAL_CONFIG_ADDRESS,
      params: [],
      abi: abi['bank'],
    })).output;

  },

  // Get the TokenRegistry contract
  async getTokenRegistryContract (block, ads) {
    return (await sdk.api.abi.call({
      block,
      target: ads,
      params: [],
      abi: abi['getTokens'],
    })).output;

  },

  // Get all tokens
  async getMarkets (block) {
    // Get TokenRegistry Address
    let tokenRegistryAddress = await utility.getTokenRegistryAddressByGlobalConfig(block);

    // Get latest markets
    let currentMarkets = await utility.getTokenRegistryContract(block, tokenRegistryAddress);
    return currentMarkets;
  },

  async getBankContract (block, markets) {
    let bankAddress = await utility.getBankAddressByGlobalConfig(block);
    let callsArray = [];
    markets.forEach(element => {
      callsArray.push({
        target: bankAddress,
        params: element
      })
    });
    return (await sdk.api.abi.multiCall({
      block,
      abi: abi['getPoolAmount'],
      calls: callsArray
    })).output;
  },

  // Get Token Value
  async getCtokenValue (block,ctoken) {
    let cEthToken =  await sdk.api.abi.call({
      target: ctoken ,
      params: SAVINGS_ADDRESS,
      abi: 'erc20:balanceOf',
      block
    });
    return cEthToken.output;
  }
}

async function tvl (timestamp, block) {
  let balances = {
    '0x000000000000000000000000000000000000000E': "0",// ETH
    '0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5': '0',// cETH
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': "0",// DAI
    '0x0000000000085d4780B73119b644AE5ecd22b376': "0",
    '0xdAC17F958D2ee523a2206206994597C13D831ec7': "0",
    '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': "0",
    '0xE41d2489571d322189246DaFA5ebDe1F4699F498': "0",
    '0x1985365e9f78359a9B6AD760e32412f4a445E862': "0",
    '0x0D8775F648430679A709E98d2b0Cb6250d2887EF': "0",
    '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': "0",
    '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2': "0",
    '0x514910771AF9Ca656af840dff83E8264EcF986CA': "0"
  };
  if (block > 10819469) {
    // Get all Tokens in the market
    let markets = await utility.getMarkets(block);

    // Get Bank
    let banksContract = await utility.getBankContract(block, markets);

    banksContract.forEach(result => {
      if (result.success === true) {
        balances[result.input.params] = result.output;
      }
    });

    // cETH value
    balances['0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5'] = await utility.getCtokenValue(block,'0x4Ddc2D193948926D02f9B1fE9e1daa0718270ED5');
  }
  return balances;
}

/*==================================================
  Exports
  ==================================================*/
module.exports = {
  name: 'DeFiner',
  website: 'https://definer.org/',
  token: "FIN",
  category: 'lending',
  start: 10819493, // 09-08-2020 06:55:19 AM +UTC
  tvl,
  term: '1 block',
  permissioning: 'Open',
  variability: 'Medium',
};
