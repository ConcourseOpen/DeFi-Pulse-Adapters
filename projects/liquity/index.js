/*==================================================
  Modules
  ==================================================*/

const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');

/*==================================================
  TVL
  ==================================================*/

// TVL in Liquity is defined as the total ETH collateral locked in troves across the ActivePool and the DefaultPool.

const ACTIVE_POOL = "0xDf9Eb223bAFBE5c5271415C75aeCD68C21fE3D7F" // holds total active ETH collateral
const DEFAULT_POOL = "0x896a3F03176f05CFbb4f006BfCd8723F2B0D741C" // holds total accumulated ETH collateral from redistributions
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

async function tvl(timestamp, block) {
  const ethBalances = (
    await sdk.api.eth.getBalances({
      targets: [ACTIVE_POOL, DEFAULT_POOL],
      block
    })
  ).output

  const activeETH = new BigNumber(ethBalances[0].balance)
  const defaultETH = new BigNumber(ethBalances[1].balance)

  return { [ZERO_ADDRESS]: activeETH.plus(defaultETH) }
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
