module.exports = {
  /* Project Metadata */
  name: "Opium Network",
  token: "OPIUM",
  chain: 'polygon',
  category: "Derivatives",
  start: 1618869600,
  tokenHolderMap: [
    {
      tokens: [
        "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // WETH
        "0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360", // amAAVE
        "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", // WMATIC
        "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", // WBTC
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
      ],
      holders: [
        // Opium Core
      "0x461e820956223cf008051Ce8506f01583A09e006", // Opium.Core v1.2
      "0xB3F6281655276150E97e5029B607a6D4d2E21972", // Opium.Core v1.3

      /// OFI
      // Turbo
      "0xf5D690c9D61092112660FEAf62e542a670Fa886D", // Turbo ETH Staking Pool
      "0x5C1E6bc8E52cE1a262014c743508f74923a5B0d2", // Turbo BTC Staking Pool
      "0x79Fcf1813327e88e55D07b7093cb5CA3Ecfc39A3", // Turbo Weekly ETH Staking Pool V2
      "0xd051608C6Bbf32C87B268f8458D63e0BeAAF67EA", // Turbo Weekly AAVE Staking Pool V2
      "0xa716a744C9fBE990ca47f4dCD353052922300519", // Turbo Weekly MATIC Staking Pool V2
      
      // Protection
      "0xbD0375A06Afd5C3A0A0AD26F30c4B37629F00D8e", // ETH Dump Protection Staking Pool V2

      // RealT
      "0xA4fe26FcA5F20F6c4e691EF60AD55712b6B26348", // RealT 10700 Whittier Rent insurance
      "0x37baa047B4C062A2CB93fC6550011f72E36a3894", // RealT 402 S Kostner Rent insurance
      "0x20120864944fC47fed4821C1c4B1b6a7D400844b", // RealT 2661-2663 Cortland Rent insurance
      "0xCd9955ba381e408575Acca4F712573c5f6e4b174", // RealT 20160 Conant Rent insurance
      "0xcd465bedccBF1Bd89998757563f4A3b3D6bb01B6", // RealT 5517-5519 Elmhurst Rent insurance
      
      // Suspended
      "0xB3e0a40F6dFA981099879F8076B1A46C59dFe597", // Suspended: ETH Dump Protection Staking Pool
      "0x2300091326DF68309BDB7eE885de561C2C89fea9", // Suspended: Turbo AAVE Staking Pool
      "0xC1e31C2db9f238809FE58089a7Fa7cE5aA7E52c6", // Suspended: Turbo MATIC Staking Pool
      "0x020B49AE5C5f805895d4Cb0ed91236BE4345c825", // Suspended: Turbo Weekly ETH Staking Pool
      ]
    }
  ]
};
