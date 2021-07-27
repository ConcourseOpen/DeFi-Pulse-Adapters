
const sdk = require("../../../sdk");
const abi = require("./abi");
const { default: BigNumber } = require("bignumber.js");

const fusePoolLens = '0x8dA38681826f4ABBe089643D2B3fE4C6e4730493'
const fusePoolDirectory = '0x835482FE0532f169024d5E9410199369aAD5C77E'
const rariGovernanceTokenSushiSwapDistributor = '0x1FA69a416bCF8572577d3949b742fBB0a9CD98c7'
const sushiETHRGTPair = '0x18a797c7c70c1bf22fdee1c09062aba709cacf04'
const WETHTokenAddress = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'
const RGTTokenAddress = '0xD291E7a03283640FDc51b121aC401383A46cC623'

const earnPoolsMinusETHPool = [
  "0xe4deE94233dd4d7c2504744eE6d34f3875b3B439", // stable pool
  "0x35DDEFa2a30474E64314aAA7370abE14c042C6e8", // yield pool
  "0x3F579F097F2CE8696Ae8C417582CfAFdE9Ec9966", // dai pool
]

async function tvl(timestamp, block) {
  const balances = {}

  const updateBalance = (token, amount) => {
    if (balances[token] !== undefined) {
      balances[token] += amount
    } else {
      balances[token] = amount
    }
  }

  const fusePools = (await sdk.api.abi.call({
    target: fusePoolDirectory,
    block,
    abi: abi['getAllPools']
  })).output ?? []

  if (fusePools.length > 0) {
    const fusePoolsTokenData = (
      await sdk.api.abi.multiCall({
        abi: abi['getPoolAssetsWithData'],
        target: fusePoolLens,
        calls: fusePools.map((poolInfo) => ({
          params: [poolInfo[2]]
        })),
        block,
      })).output.filter((resp) => resp.success === true).map((resp) => resp.output).flat()

    for (let i = 0; i < fusePoolsTokenData.length; i++) {
      const underlyingTokenAddress = fusePoolsTokenData[i][1]
      const underlyingTokenTotalSupply = BigNumber(fusePoolsTokenData[i][8])
      updateBalance(underlyingTokenAddress, underlyingTokenTotalSupply)
    }
  }


  // get sushiswap LP data
  const rgtETHPairData = (await sdk.api.abi.call({
    target: sushiETHRGTPair,
    block,
    abi: abi['getReserves']
  })).output

  updateBalance(WETHTokenAddress, BigNumber(rgtETHPairData._reserve0))
  updateBalance(RGTTokenAddress, BigNumber(rgtETHPairData._reserve1))

  return balances
}

tvl()

module.exports = {
  name: 'Rari Capital', // project name
  token: "RGT",             // null, or token symbol if project has a custom token
  category: 'Assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1600000000,        // July 14, 2020
  tvl                       // tvl adapter
}
