module.exports = {
    name: 'CompliFi',
    token: 'COMFI',
    chain: 'polygon',
    category: 'Derivatives',
    start: 1621938255,  // May-25-2021 10:24:15 AM UTC
    tokenHolderMap: [
      {
        tokens: [
          '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',   // USD Coin (PoS)
        ],
        holders: [
          "0xBC8822d5db2ae80686727345fB6818064d1e6D00",
          "0x0121314498462e3Eae63C3E0F9bB7b9d25302070",
          "0x298881F0E5962CC1E6e8ce330EB9D72f4FC26b30",
          "0x6D97fCF8Ca60d125ec61F60428ae084CC4559b74"
        ],
        // holders: {
        //   pullFromLogs: true,
        //   logConfig: {
        //     target: '0xE970b0B1a2789e3708eC7DfDE88FCDbA5dfF246a', // CompliFi Vault Factory
        //     topic: 'VaultCreated(bytes32,address,address)',
        //     keys: ['topics'],
        //     fromBlock: 14908452
        //   },
        //   transform: (poolLog) => {
        //     return `0x${poolLog}` // can't receive access to event.data field
        //   },
        // }
      }
    ],
  };
