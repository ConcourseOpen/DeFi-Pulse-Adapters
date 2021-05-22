module.exports = {
    name: 'CompliFi',
    token: 'COMFI',
    category: 'Derivatives',
    start: 1616484124, // Mar-23-2021 07:22:04 AM +UTC
    tokenHolderMap: [
      {
        tokens: [
          '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' // USDC
        ],
        holders: [
          '0xac72F4Ec02EdF994C18b208B99C2ffBE505418c7',
          '0x2E17509724dbE94D9cB03c3ecDaB6a49bC78AF94',
          '0x817e30fD53b2fE30F87A4Dc450811029961bAbF9',
          '0xc8D05aC9bE57779b0F46AC12313567f7359A8495',
          '0xD6f361320E61D0A912AcF10c53e2D5C43aa79dc2',
          '0xea5b9650f6c47D112Bb008132a86388B594Eb849',
          '0x4eba099F97ffeD8de47a14f835820815f141Ea08',
          '0xd498bF281262e04b0Dc8A1c6D14877Cee46AAAAE'
        ]
        // holders: {
        //   pullFromLogs: true,
        //   logConfig: {
        //     target: '0x3269DeB913363eE58E221808661CfDDa9d898127', // CompliFi Vault Factory
        //     topic: 'VaultCreated(bytes32,address,address)',
        //     fromBlock: 12093712,
        //     keys: ['data'],
        //   },
        //   transform: (data) => `0x${data}`, // can't receive access to event.data field
        // }
      }
    ],
  };
