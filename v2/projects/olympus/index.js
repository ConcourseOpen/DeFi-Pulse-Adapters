module.exports = {
    /* Project Metadata */
    name: 'Olympus',   // project name
    token: 'OHM',              // null, or token symbol if project has a custom token
    category: 'Assets',        // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1616569200,        
    /* required for fetching token balances */
    tokenHolderMap: [
      {
        tokens: [
          '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
          '0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c', // SLP-OHM-DAI
          '0x853d955acef822db058eb8505911ed77f175b99e', // frax
          '0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877', // ohm-frax
        ],
        holders: [
          '0x886CE997aa9ee4F8c2282E182aB72A705762399D', // Treasury 1
          '0x31F8Cc382c9898b273eff4e0b7626a6987C846E8', // Treasury 2
        ],
      }
    ],
  };
  