/*
  Modules
*/
const sdk = require('../../../../sdk')
const abi = require('./abi')
const _ = require('underscore')
const BigNumber = require('bignumber.js')

/*
  Settings
*/
// arbitrum-mainnet addresses
const token = [
  '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1', // WETH
]

const targetAddresses = [
  '0xc7b2ad78fded2bbc74b50dc1881ce0f81a7a0cca', // from mcdex
]

const targetAddressWithHolder = {
  '0xc7b2ad78fded2bbc74b50dc1881ce0f81a7a0cca': { // from mcdex
    holder: '0x3092ed676e1c59ee5ab6eb4bf19a11bca84d67bd', // MCDEXLemma wrapper holder
  }
}

/*
  TVL
*/
async function tvl (timestamp, block) {
  const balances = 0

  const marginReturn = await sdk.api.abi.multiCall({
    block,
    calls: _.map(targetAddresses, (address) => ({
      target: address,
      params: [0, targetAddressWithHolder[address].holder]
    })),
    abi: abi.getMarginAccount
  })

  _.each(marginReturn.output, (marginData) => {
    if (marginData.success) {
      balances = BigNumber(balances).plus(marginData[0])
    }
  });

  return balances
}

/*
  Exports
*/
module.exports = {
  name: 'Lemma-finance',
  token: 'lemma',
  chain: 'arbitrum-mainnet',
  category: 'Derivatives',
  start: 1635939990,
  tvl,
}
