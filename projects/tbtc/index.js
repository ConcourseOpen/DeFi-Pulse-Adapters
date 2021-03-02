/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');

const tbtcTokenContract = "0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa"
const keepStakingContract = "0x1293a54e160D1cd7075487898d65266081A15458"
const keepTokenContract = "0x85Eee30c52B0b379b046Fb0F85F4f3Dc3009aFEC"
const bondingContract = "0x27321f84704a599aB740281E285cc4463d89A3D5"
const keepVaultContract = "0xCf916681a6F08fa22e9EF3e665F2966Bf3089Ff1"

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  const btcTotalSupply = sdk.api.erc20.totalSupply({
      block,
      target: tbtcTokenContract
    });

  const totalETHBonded = sdk.api.eth.getBalance({ target: bondingContract, block });

  const totalKEEPBonded = sdk.api.erc20.balanceOf({
    target: keepTokenContract,
    owner: keepStakingContract,
    block: block
  });

  const KeepStakedVault = sdk.api.erc20.balanceOf({
    target: keepTokenContract,
    owner: keepVaultContract,
    block: block
  });

  const totalKEEPStaked = BigNumber((await totalKEEPBonded).output).plus((await KeepStakedVault).output).toFixed()

  let balances = {
    "0x0000000000000000000000000000000000000000": (await totalETHBonded).output,
    [tbtcTokenContract]: (await btcTotalSupply).output,
    [keepTokenContract]: totalKEEPStaked
  }

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'KEEP Network',
  token: 'KEEP',
  category: 'assets',
  start: 1600214400,   // 09/16/2020 @ 12:00am (UTC)
  tvl
}
