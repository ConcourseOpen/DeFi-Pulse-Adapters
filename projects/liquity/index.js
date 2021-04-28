/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');

/*==================================================
  TVL
  ==================================================*/

/*
* TVL in Liquity is defined as the total LUSD in the Stability Pool plus the total USD value of ETH collateral locked in 
* troves across the ActivePool and the DefaultPool.
*/

const LUSD_TOKEN = "0x5f98805a4e8be255a32880fdec7f6728c6568ba0"  
const ACTIVE_POOL = "0xDf9Eb223bAFBE5c5271415C75aeCD68C21fE3D7F"     // holds total active ETH collateral
const DEFAULT_POOL = "0x896a3F03176f05CFbb4f006BfCd8723F2B0D741C"    // holds total accumulated ETH collateral from redistributions
const STABILITY_POOL = "0x66017D22b0f8556afDd19FC67041899Eb65a21bb"  // holds total LUSD Stability Deposits
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

async function tvl(timestamp, block) {
  const toBN = num => new BigNumber(num)

  const ethBalances = (
    await sdk.api.eth.getBalances({
      targets: [ACTIVE_POOL, DEFAULT_POOL],
      block
    })
  ).output

  const activeETH = toBN(ethBalances[0].balance)
  const defaultETH = toBN(ethBalances[1].balance)

  const stabilityPoolLUSD = toBN(
      (await sdk.api.erc20.balanceOf({
        target: LUSD_TOKEN,
        owner: STABILITY_POOL,
      })
    ).output 
  )

  let balances = {
    [ZERO_ADDRESS]: activeETH.plus(defaultETH),
    [STABILITY_POOL]: stabilityPoolLUSD
  }
  
  return balances
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Liquity',
  token: 'LQTY',
  category: 'lending',
  start: 1617611590,
  tvl
}
