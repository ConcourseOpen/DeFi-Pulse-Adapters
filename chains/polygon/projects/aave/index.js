module.exports = {
  /* Project Metadata */
  name: "Aave_Polygon",
  token: "AAVE",
  chain: 'polygon',
  category: "Lending",
  start: 1616976000,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',   // (PoS) Dai Stablecoin
      holders: '0x27F8D03b3a2196956ED754baDc28D73be8830A6e'   // DAI Holder
    },
    {
      tokens: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',   // USD Coin (PoS)
      holders: '0x1a13F4Ca1d028320A707D99520AbFefca3998b7F'   // USDC Holder
    },
    {
      tokens: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',   // (PoS) Tether USD
      holders: '0x60D55F02A771d515e077c9C2403a1ef324885CeC'   // USDT Holder
    },
    {
      tokens: '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6',   // (PoS) Wrapped BTC
      holders: '0x5c2ed810328349100A66B82b78a1791B101C9D61'   // WBTC Holder
    },
    {
      tokens: '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',   // Wrapped Ether
      holders: '0x28424507fefb6f7f8E9D3860F56504E4e5f5f390'   // Wrapped Ether Holder
    },
    {
      tokens: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',   // Wrapped Matic
      holders: '0x8dF3aad3a84da6b69A4DA8aeC3eA40d9091B2Ac4'   // Wrapped Matic Holder
    },
    {
      tokens: '0xd6df932a45c0f255f85145f286ea0b292b21c90b',   // Aave (PoS)
      holders: '0x1d2a0E5EC8E5bBDCA5CB219e649B565d8e5c3360'   // Aave (PoS) Holder
    },
  ]
};
