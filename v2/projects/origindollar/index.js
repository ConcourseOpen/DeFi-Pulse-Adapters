module.exports = {
  name: 'Origin Dollar',
  token: 'OUSD',
  category: 'Assets',
  start: 1610000000, // Thu Jan 07 2021 06:13:20 GMT+0000
  tokenHolderMap: [
    {
      checkETHBalance: false,
      tokens: [
        '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
        '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        // '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
        '0x5d3a536E4D6DbD6114cc1Ead35777bAB948E3643', // cDAI
        '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9', // cUSDT
        '0x39aa39c021dfbae8fac545936693ac917d5e7563', // cUSDC
        '0x028171bca77440897b824ca71d1c56cac55b68a3', // aDai
        '0x4da27a545c0c5b758a6ba100e3a049001de870f5', // stkAAVE (Staked Aave)
      ],
      holders: [
        '0x9c459eeb3fa179a40329b81c1635525e9a0ef094', // CompoundStrategyProxy.sol
        '0x3c5fe0a3922777343cbd67d3732fcdc9f2fa6f2f', // ThreePoolStrategy.sol (Curve strategy)
        '0x5e3646a1db86993f73e6b74a57d8640b69f7e259', // InitializeGovernedUpgradeabilityProxy.sol (Aave Strategy),
        '0xe75d77b1865ae93c7eaa3040b038d7aa7bc02f70', // VaultProxy.sol
      ],
    },
  ],
};
