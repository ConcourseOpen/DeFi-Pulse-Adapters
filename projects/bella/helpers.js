const { ethers } = require('ethers')
const { abis } = require('./config/bella/abis.js')
const constants = require('./config/bella/constants.js')
const { 
  getContractInstance, 
  extractBigNumber, 
  generateCoinGeckoPricePredicate, 
  getTokenPriceCoinGecko,
  calculateTvl,
} = require('./config/bella/utilities.js')

const providerUrl = 'https://eth-mainnet.alchemyapi.io/v2/NR1gYkSQEB7lu0q-cONMsxRLwFct0luH'
const provider = new ethers.providers.JsonRpcProvider(providerUrl)
const bVaultSymbols = [ 'bUsdt', 'bUsdc', 'bArpa', 'bWbtc', 'bHbtc', 'bBusd' ]
const coinGeckoIdMap = {
  bUsdt: 'tether',
  bUsdc: 'usd-coin',
  bArpa: 'arpa-chain',
  bWbtc: 'wrapped-bitcoin',
  bHbtc: 'huobi-btc',
  bBusd: 'binance-usd',
}

const getBTokenTotalSupply = (bTokenSymbol) => (precision) =>
  getContractInstance(provider)(constants.getBTokenAddress(bTokenSymbol))(abis.bVault)
    .totalSupply()
    .then((totalSupply) => 
      extractBigNumber(totalSupply.toString())(constants.getBTokenDecimal(bTokenSymbol))(precision))

const getBTokenPricePerFullShare = (bTokenSymbol) => (decimals) => (precision) =>
  getContractInstance(provider)(constants.getBTokenAddress(bTokenSymbol))(abis.bVault)
    .getPricePerFullShare()
    .then((price) => extractBigNumber(price.toString())(decimals)(precision))

const getBVaultTvl = (baseTokenPriceInUsd) => (bTokenSymbol) => (decimals) => (precision) => {
  const bTokenPricePerFullShare = getBTokenPricePerFullShare(bTokenSymbol)(decimals)(precision)
  const bTokenTotalSupply = getBTokenTotalSupply(bTokenSymbol)(precision)
  return calculateTvl(baseTokenPriceInUsd)(bTokenPricePerFullShare)(bTokenTotalSupply)
}

const sumTvls = (bVaultSymbols) => (coinGeckoIdMap) => (precision) =>
  bVaultSymbols
  .map(
    (symbol) => {
      const baseTokenPriceInUsd = getTokenPriceCoinGecko('usd')(coinGeckoIdMap[symbol])
      const tvl = getBVaultTvl(baseTokenPriceInUsd)(symbol)(18)(precision)
      tvl.then((tvl) => console.log(symbol + ' TVL: ' + tvl))
      return tvl
    }      
  )
  .reduce(
    (tvlA, tvlB) => 
      Promise
        .all([tvlA, tvlB])
        .then(([tvlA, tvlB]) => tvlA + tvlB)
  )


  
const BigNumber = require('bignumber.js')
const { ethers } = require('ethers')
const axios = require('axios')

const coinGeckoApi = 'https://api.coingecko.com/api/v3/simple'

const getContractInstance = (provider) => (tokenAddress) => (abi) => 
  new ethers.Contract(tokenAddress, abi, provider)

const extractBigNumber = (hexString) => (decimals) => (precision) => 
  new BigNumber(hexString).div(10 ** decimals).toFixed(precision)

const generateCoinGeckoPricePredicate = (baseTokenSymbol) => (quoteTokenSymbol) => 
  '/price?ids=' + quoteTokenSymbol + '&vs_currencies=' + baseTokenSymbol

const getTokenPriceCoinGecko = (baseTokenSymbol) => (quoteTokenSymbol) => 
  axios
    .get(coinGeckoApi + generateCoinGeckoPricePredicate(baseTokenSymbol)(quoteTokenSymbol))
    .then((response) => response.data[quoteTokenSymbol][baseTokenSymbol])

const calculateTvl = (baseTokenPrice) => (bTokenPricePerFullShare) => (bTokenTotalSupply) =>
  Promise
  .all([baseTokenPrice, bTokenPricePerFullShare, bTokenTotalSupply])
  .then(
    ([baseTokenPrice, bTokenPricePerFullShare, bTokenTotalSupply]) => 
      baseTokenPrice * bTokenPricePerFullShare * bTokenTotalSupply 
  )

module.exports = {
  getContractInstance,
  extractBigNumber,
  generateCoinGeckoPricePredicate,
  getTokenPriceCoinGecko,
  calculateTvl,
}