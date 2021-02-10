/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');

const tbtcTokenContract = "0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa"
const bondingContract = "0x27321f84704a599aB740281E285cc4463d89A3D5"

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const btcTotalSupply = sdk.api.erc20.totalSupply({
      block,
      target: tbtcTokenContract
    });

  const totalETHBonded = sdk.api.eth.getBalance({ target: bondingContract, block });

  let balances = {
    "0x0000000000000000000000000000000000000000": (await totalETHBonded).output,
    [tbtcTokenContract]: (await btcTotalSupply).output,
  }

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'tBTC',
  token: 'KEEP',
  category: 'assets',
  start: 1600214400,   // 09/16/2020 @ 12:00am (UTC)
  tvl
}
