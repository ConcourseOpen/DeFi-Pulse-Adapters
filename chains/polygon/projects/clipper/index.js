/**
*
* This is generated template may be used as a guide to build your own adapter.
*
* Project: Clipper
* Chain: Polygon
* Tech Lead: Edo#9130  edo@shipyardsoftware.org 
* Docs: https://docs.clipper.exchange/ https://github.com/shipyard-software
* Factory: 
* Treasury: 0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270
* Deposit: 0xD01e3549160c62Acabc4D0EB89F67aAFA3de8EEd

*/

module.exports = {
  /* Project Metadata */
  name: "Clipper", // Token project name. Ex. 'MakerDAO'
  token: null, // Token symbol (if exists). Ex. 'MKR', or NULL
  category: "DEX/AMM", // Project category. Ex. 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1636161600, // Unix timestamp (utc 0) specifying when the project began, or where live data begins
  chain: "polygon",

  /* Fetching token balances */
  tokenHolderMap: [
    {
      /* Tokens */
      tokens: [
        "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270", // WMATIC
        "0x7ceb23fd6bc0add59e62ac25578270cff1b9f619", // WETH
        "0x2791bca1f2de4661ed88a30c99a7a9449aa84174", // USDC
        "0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6", // WBTC
        "0xc2132d05d31c914a87c6611c10748aeb04b58e8f", // USDT
        "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063", // DAI
        "0x482bc619ee7662759cdc0685b4e78f464da39c73", // GYEN
      ],

      /* Contracts that hold value */
      holders: "0xd01e3549160c62acabc4d0eb89f67aafa3de8eed",
    },
  ],
};
