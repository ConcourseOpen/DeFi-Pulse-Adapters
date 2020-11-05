/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');

const tbtcTokenContract = "0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa"
const keepStakingContract = "0x1293a54e160D1cd7075487898d65266081A15458"
const keepTokenContract = "0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC"
const bondingContract = "0x27321f84704a599aB740281E285cc4463d89A3D5"

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const btcTotalSupply = (
    await sdk.api.erc20.totalSupply({
      block,
      target: tbtcTokenContract
    })
  ).output;

  const totalETHBonded = (await sdk.api.eth.getBalance({ target: bondingContract, block })).output;

  const totalKEEPBonded = (await sdk.api.erc20.balanceOf({
    target: keepTokenContract,
    owner: keepStakingContract,
    block: block
  })).output;

  let balances = {
    "0x0000000000000000000000000000000000000000": totalETHBonded,
    [tbtcTokenContract]: btcTotalSupply,
    [keepTokenContract]: totalKEEPBonded
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
  start: 1594730497,   // 07/14/2020 @ 12:41pm (UTC)
  tvl
}
