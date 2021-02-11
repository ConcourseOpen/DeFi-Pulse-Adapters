/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const pools = {
    ETH: '0x878f15ffc8b894a1ba7647c7176e4c01f74e140b',
    WBTC: '0x20DD9e22d22dd0a6ef74a520cb08303B5faD5dE7',
  }

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {

    const WBTCRequest = sdk.api.erc20.balanceOf({
      block,
      target: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      owner: pools.WBTC,
    })

    const ETHRequest = sdk.api.eth.getBalance({
      block,
      target: pools.ETH,
    })

    const [ETHResponse, WBTCResponse] = await Promise.all([ETHRequest, WBTCRequest])

    return {
      '0x0000000000000000000000000000000000000000': ETHResponse.output,
      '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': WBTCResponse.output,
    };
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Hegic',
    token: 'HEGIC',
    category: 'derivatives',
    start: 1602360000, // Oct-10-2020 08:00:00 PM +UTC,
    tvl
  }
