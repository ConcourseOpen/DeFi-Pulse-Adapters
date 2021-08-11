const sdk = require("../../sdk");
const abi = require("./abi");
const { default: BigNumber } = require("bignumber.js");

const earnYieldPoolProxyManagerAddressesIncludingLegacy = [
  '0x35DDEFa2a30474E64314aAA7370abE14c042C6e8',
  '0x6dd8e1Df9F366e6494c2601e515813e0f9219A88',
  '0x626d6979F3607d13051594d8B27a0A64E413bC11'
]
const earnETHPoolFundControllerAddressesIncludingLegacy = [
  '0xD9F223A36C2e398B0886F945a7e556B41EF91A3C',
  '0xa422890cbBE5EAa8f1c88590fBab7F319D7e24B6',
  '0x3f4931a8e9d4cdf8f56e7e8a8cfe3bede0e43657',
]
const earnDAIPoolControllerAddressesIncludingLegacy = [
  '0x7C332FeA58056D1EF6aB2B2016ce4900773DC399',
  '0x3F579F097F2CE8696Ae8C417582CfAFdE9Ec9966'
]
const earnStablePoolAddressesIncludingLegacy = [
  '0x4a785fa6fcd2e0845a24847beb7bddd26f996d4d',
  '0x27C4E34163b5FD2122cE43a40e3eaa4d58eEbeaF',
  '0x318cfd99b60a63d265d2291a4ab982073fbf245d',
  '0xb6b79D857858004BF475e4A57D4A446DA4884866',
  '0xD4be7E211680e12c08bbE9054F0dA0D646c45228',
  '0xB202cAd3965997f2F5E67B349B2C5df036b9792e',
  '0xe4deE94233dd4d7c2504744eE6d34f3875b3B439'
]
const fusePoolLensAddress = '0x8dA38681826f4ABBe089643D2B3fE4C6e4730493'
const fusePoolDirectoryAddress = '0x835482FE0532f169024d5E9410199369aAD5C77E'
const sushiETHRGTPairAddress = '0x18a797c7c70c1bf22fdee1c09062aba709cacf04'
const WETHTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const RGTTokenAddress = '0xD291E7a03283640FDc51b121aC401383A46cC623'
const ETHAddress = '0x0000000000000000000000000000000000000000'
const bigNumZero = BigNumber('0')


async function tvl(timestamp, block) {
  const balances = {}
  const tokenList = await sdk.api.util.tokenList()

  // useful for quick lookups of token info based on symbol as opposed to iterating through the tokenList
  const tokenMapWithKeysAsSymbol = tokenList.reduce((result, item) => {
    result[item.symbol] = item;
    return result;
  }, {})

  const updateBalance = (token, amount) => {
    if (balances[token] !== undefined) {
      balances[token] = balances[token].plus(amount)
    } else {
      balances[token] = amount
    }
  }
  const getBalancesFromEarnPool = async (addresses) => {
    const earnPoolData = (await sdk.api.abi.multiCall({
      calls: addresses.map((address) => ({
        target: address
      })),
      block,
      abi: abi['getRawFundBalancesAndPrices']
    })).output.filter(resp => resp.success === true).map((resp) => resp.output).flat()
    for (let j = 0; j < earnPoolData.length; j++) {
      if (earnPoolData[j] && earnPoolData[j]['0'] && earnPoolData[j]['0'].length > 0) {
        for (let i = 0; i < earnPoolData[j]['0'].length; i++) {
          const tokenSymbol = earnPoolData[j]['0'][i].toUpperCase()
          const tokenContractAddress = tokenMapWithKeysAsSymbol[tokenSymbol].contract ?? null
          if (tokenContractAddress) {
            const tokenAmount = BigNumber(earnPoolData[j]['1'][i])
            if (tokenAmount.isGreaterThan(bigNumZero)) {
              updateBalance(tokenContractAddress, tokenAmount)
            }
            const pools = earnPoolData[j]['2'][i]
            const poolBalances = earnPoolData[j]['3'][i]
            if (pools && poolBalances && pools.length === poolBalances.length) {
              for (let k = 0; k < pools.length; k++) {
                const poolBalance = BigNumber(poolBalances[k])
                if (poolBalance.isGreaterThan(bigNumZero)) {
                  updateBalance(tokenContractAddress, poolBalance)
                }
              }
            }
          }
        }
      }
    }
  }

  // Earn yield pool
  try {
    await getBalancesFromEarnPool(earnYieldPoolProxyManagerAddressesIncludingLegacy)
  } catch(e) {
   // ignore error
  }

  // Earn ETH pool
  try {
    const ethPoolData = (await sdk.api.abi.multiCall({
      block,
      abi: abi['getRawFundBalances'],
      calls: earnETHPoolFundControllerAddressesIncludingLegacy.map((address) => ({
        target: address
      }))
    })).output.filter(resp => resp.success === true).map((resp) => resp.output).flat()
    for (let i = 0; i < ethPoolData.length; i++) {
      const ethAmount = BigNumber(ethPoolData[i]['0'])
      if (ethAmount.isGreaterThan(bigNumZero)) {
        updateBalance(ETHAddress, ethAmount)
      }
    }
  } catch(e) {
    // ignore error
  }

  // Earn DAI pool
  try {
    await getBalancesFromEarnPool(earnDAIPoolControllerAddressesIncludingLegacy)
  } catch(e) {
    // ignore error
  }

  // Earn stable pool
  try {
    await getBalancesFromEarnPool(earnStablePoolAddressesIncludingLegacy)
  } catch(e) {
    // ignore error
  }

  // Fuse
  try {
    const fusePools = (await sdk.api.abi.call({
      target: fusePoolDirectoryAddress,
      block,
      abi: abi['getAllPools']
    })).output ?? []
    if (fusePools.length > 0) {
      const fusePoolsTokenData = (
        await sdk.api.abi.multiCall({
          abi: abi['getPoolAssetsWithData'],
          target: fusePoolLensAddress,
          calls: fusePools.map((poolInfo) => ({
            params: [poolInfo[2]]
          })),
          block,
        })).output.filter((resp) => resp.success === true).map((resp) => resp.output).flat()

      for (let i = 0; i < fusePoolsTokenData.length; i++) {
        const underlyingTokenAddress = fusePoolsTokenData[i][1]
        if (fusePoolsTokenData[i][14] === '0') {
          continue
        }
        const exchangeRate = BigNumber(fusePoolsTokenData[i][14])
        const decimals = BigNumber('1000000000000000000')
        const underlyingBalance = BigNumber(fusePoolsTokenData[i][7]).multipliedBy(exchangeRate).dividedBy(decimals)
        if (underlyingBalance.isGreaterThan(bigNumZero)) {
          updateBalance(underlyingTokenAddress, underlyingBalance)
        }
      }

    }
  } catch(e) {
    // ignore error
  }

  // Sushiswap LP data
  try {
    const rgtETHPairData = await sdk.api.abi.call({
      target: sushiETHRGTPairAddress,
      block,
      abi: abi['getReserves']
    })

    if (rgtETHPairData && rgtETHPairData.output) {
      const reserve0Balanace = BigNumber(rgtETHPairData.output._reserve0)
      const reserve1Balance = BigNumber(rgtETHPairData.output._reserve1)
      if (reserve0Balanace.isGreaterThan(bigNumZero)) {
        updateBalance(WETHTokenAddress, BigNumber(rgtETHPairData.output._reserve0))
      }
      if (reserve1Balance.isGreaterThan(bigNumZero)) {
        updateBalance(RGTTokenAddress, BigNumber(rgtETHPairData.output._reserve1))
      }
    }
  }
  catch(e) {
    // ignore error
  }

  return balances
}

module.exports = {
  name: 'Rari Capital', // project name
  token: "RGT",             // null, or token symbol if project has a custom token
  category: 'Assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1596236058,        // July 14, 2020
  tvl                       // tvl adapter
}
