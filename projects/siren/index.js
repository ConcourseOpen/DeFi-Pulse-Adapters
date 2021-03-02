/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const pools = {
    USDC: '0x25bc339170AdBfF2B7b9edE682072577Fa9d96E8',
    WBTC: '0x87a3eF113C210Ab35AFebe820fF9880bf0DD4bfC',
  }
  const assets = {
    USDC: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    WBTC: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'
  }

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const WBTCRequest = sdk.api.erc20.balanceOf({
      block,
      target: assets.WBTC,
      owner: pools.WBTC,
    })

    const USDCRequest = sdk.api.erc20.balanceOf({
      block,
      target: assets.USDC,
      owner: pools.USDC,
    })

    const [USDCResponse, WBTCResponse] = await Promise.all([USDCRequest, WBTCRequest])

    return {
      [assets.USDC]: USDCResponse.output,
      [assets.WBTC]: WBTCResponse.output,
    };
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Siren',
    token: 'SI',
    category: 'derivatives',
    start: 1605574800, // Nov-17-2020 01:00:00 AM +UTC
    tvl
  }
