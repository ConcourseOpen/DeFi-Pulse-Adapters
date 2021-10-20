/*==================================================
  Modules
  ==================================================*/

  const BigNumber = require('bignumber.js');
  const sdk = require('../../sdk');
  const getTotalAmounts = require('./abis/getTotalAmounts.json');

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {

  // Set ETH placeholder in balances
  const ethAddress = '0x0000000000000000000000000000000000000000';
  let balances = {
    [ethAddress]: '0', // ETH
  };

  // One off hypervisors that are not created from the main factory
  const standaloneHypervisors = [
    {
        'address': '0x9a98bFfAbc0ABf291d6811C034E239e916bBceC0',  // ETH-USDT
        'token0': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',   // WETH
        'token1': '0xdAC17F958D2ee523a2206206994597C13D831ec7',   // USDT
        'fromBlock': 12590301,
        'toBlock': block,
    },
    {
        'address': '0x8cd73cb1e1fa35628e36b8c543c5f825cd4e77f1',  // TCR-ETH
        'token0': '0x9C4A4204B79dd291D6b6571C5BE8BbcD0622F050',   // TCR
        'token1': '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',   // WETH
        'fromBlock': 13328071,
        'toBlock': block,
    }
  ]

  const logs = await Promise.all([
    sdk.api.util.getLogs({
      keys: ['data'],
      toBlock: block,
      target: '0xC878c38F0Df509a833D10De892e1Cf7D361e3A67',  // Open beta factory
      fromBlock: 12615883,
      topic: 'HypervisorCreated(address,address,uint24,address,uint256)',
    }).then(({ output }) => output),
    sdk.api.util.getLogs({
      keys: ['data'],
      toBlock: block,
      target: '0xd12fa3E3B60CFb96a735aB57a071F0f324860929',
      fromBlock: 12767944,
      topic: 'HypervisorCreated(address,address,uint24,address,uint256)',
    }).then(({ output }) => output)
  ]).then((output) => output.reduce((acc, val) => acc.concat(val), []));

  const hypervisorAddresses = []
  const token0Addresses = []
  const token1Addresses = []

  for (let log of logs) {
    token0Addresses.push(`0x${log.substr(26, 40)}`.toLowerCase())
    token1Addresses.push(`0x${log.substr(90, 40)}`.toLowerCase())
    hypervisorAddresses.push(`0x${log.substr(218, 40)}`.toLowerCase())
  }

  // Add standalone hypervisors
  for (let standaloneHypervisor of standaloneHypervisors) {
    if (block >= standaloneHypervisor.fromBlock && block <= standaloneHypervisor.toBlock) {
      token0Addresses.push(standaloneHypervisor.token0.toLowerCase())
      token1Addresses.push(standaloneHypervisor.token1.toLowerCase())
      hypervisorAddresses.push(standaloneHypervisor.address.toLowerCase())
    }
  }

  const hypervisors = {}
  // add token0Addresses
  token0Addresses.forEach((token0Address, i) => {
    const hypervisorAddress = hypervisorAddresses[i]
    hypervisors[hypervisorAddress] = {
      token0Address: token0Address
    }
  })

  // add token1Addresses
  token1Addresses.forEach((token1Address, i) => {
    const hypervisorAddress = hypervisorAddresses[i]
    hypervisors[hypervisorAddress] = {
      ...(hypervisors[hypervisorAddress] || {}),
      token1Address: token1Address,
    }
  })

  let hypervisorCalls = []

  for (let hypervisor of Object.keys(hypervisors)) {
    hypervisorCalls.push({
      target: hypervisor
    })
  }

  // Call getTotalAmounts on hypervisor contract
  const hypervisorBalances = (
    await sdk.api.abi.multiCall({
      abi: getTotalAmounts,
      calls: hypervisorCalls,
      block,
    })
  )

  // Sum up balance0 and balance1 for each hypervisor
  for (let balance of hypervisorBalances.output) {
    if (balance.success) {
      let hypervisorAddress = balance.input.target
      let address0 = hypervisors[hypervisorAddress].token0Address
      let address1 = hypervisors[hypervisorAddress].token1Address
      let balance0 = balance.output.total0
      let balance1 = balance.output.total1

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
    name: 'Visor Finance',
    token: 'VISR',
    category: 'assets',     // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1623078120,      // June 7, 2021 23:02
    tvl
  }
