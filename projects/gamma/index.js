/*==================================================
  Modules
  ==================================================*/

  const BigNumber = require('bignumber.js');
  const sdk = require('../../sdk');
  const hypervisorABI = require('./abis/hypervisor.json');

/*==================================================
  Constants
  ==================================================*/

  const HYPE_REGISTRY = "0x31CcDb5bd6322483bebD0787e1DABd1Bf1f14946" 

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {

  // Set ETH placeholder in balances
  const ethAddress = '0x0000000000000000000000000000000000000000';
  let balances = {
    [ethAddress]: '0', // ETH
  };

  const hypervisorCalls = await sdk.api.util.getLogs({
    keys: ['data'],
    toBlock: block,
    target: HYPE_REGISTRY,
    fromBlock: 13659998,
    topic: 'HypeAdded(address,uint256)',
  }).then(
    ({output}) => output.map(
      logItem => ({
        target: `0x${logItem.data.substr(26, 40)}`.toLowerCase()
      })
    )
  );

  // Make call to hypervisor to get token and balance
  const hypeData = await Promise.all([
    sdk.api.abi.multiCall({
      abi: hypervisorABI.token0,
      calls: hypervisorCalls,
      block,
    }).then(
      ({output}) => output.map(
        item => item.output
      )
    ),
    sdk.api.abi.multiCall({
      abi: hypervisorABI.token1,
      calls: hypervisorCalls,
      block,
    }).then(
      ({output}) => output.map(
        item => item.output
      )
    ),
    sdk.api.abi.multiCall({
      abi: hypervisorABI.getTotalAmounts,
      calls: hypervisorCalls,
      block,
    }).then(
      ({output}) => output.map(
        (item) => ({
          success: item.success,
          total0: item.success ? item.output.total0 : 0,
          total1: item.success ? item.output.total1 : 0,
        })
      )
    )
  ])

  let token0Addresses = hypeData[0]
  let token1Addresses = hypeData[1]
  let tokenAmounts = hypeData[2]

  for (const [index, amounts]  of tokenAmounts.entries()) {
    if (amounts.success) {
      let address0 = token0Addresses[index]
      let address1 = token1Addresses[index]
      let balance0 = amounts.total0
      let balance1 = amounts.total1

      balances[address0] = BigNumber(balances[address0] || 0).plus(balance0).toFixed()
      balances[address1] = BigNumber(balances[address1] || 0).plus(balance1).toFixed()
    }
  }

  return balances;
}

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Gamma',
    token: 'GAMMA',
    category: 'Assets',     // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1623078120,      // June 7, 2021 23:02
    tvl
  }
