module.exports = {
    /* Project Metadata */
    name: "Curve_Arbitrum",
    token: "CRV",
    chain: 'arbitrum',
    category: "DEXes",
    start: 1631509200,
    /* required for fetching token balances */
    tokenHolderMap: [
      {
        tokens: [
            '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', //USDC
            '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', //USDT
        ],   
        holders: '0x7f90122BF0700F9E7e1F688fe926940E8839F353'   // 2pool
      },
    ]
  };
  