module.exports = {
  /* Project Metadata */
  name: "Tornado Cash",
  token: "TORN",
  category: "Payments",
  start: 1576497600,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: null,
      holders: [
        "0x12d66f87a04a9e220743712ce6d9bb1b5616b8fc", // 0.1 ETH
        "0x47ce0c6ed5b0ce3d3a51fdb1c52dc66a7c3c2936", // 1 ETH
        "0x910cbd523d972eb0a6f4cae4618ad62622b39dbf", // 10 ETH
        "0xa160cdab225685da1d56aa342ad8841c3b53f291", // 100 ETH
      ],
      checkETHBalance: true,
    }
  ]
};
