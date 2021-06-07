const fs = require('fs');
const path = require('path');
const sdk = require('../../sdk');
const abi = require('./abi.json');

const { vaults, pools, singleAssetVaults, liquidityPools, oldMooniswapVaults, getVaultByContractName } = require('./config');

async function getLiquidityPoolInfo(vaultName) {
  const vault = getVaultByContractName(vaultName)

  const [token0, token1] = await Promise.all([
    sdk.api.abi.call({ target: vault.underlying.address, abi: abi['token0'] }),
    sdk.api.abi.call({ target: vault.underlying.address, abi: abi['token1'] })
  ])

  return [
    vault.underlying.address,
    {
      token0: token0.output,
      token1: token1.output
    }
  ]
}

async function main() {
  let liquidityPoolInfo = {}

  const liquidityPoolValues = await Promise.all(
    [...liquidityPools, ...oldMooniswapVaults].map(
      (vaultName) => getLiquidityPoolInfo(vaultName)
    )
  )

  liquidityPoolValues.forEach((val) => {
    liquidityPoolInfo[val[0]] = val[1]
  })

  fs.writeFileSync(path.resolve(__dirname, 'liquidity-pool-info.json'), JSON.stringify(liquidityPoolInfo));
  console.log('done!')
}

main()
