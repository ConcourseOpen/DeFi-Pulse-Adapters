module.exports = {
    /* Project Metadata */
    name: "Beta Finance", // token project name
    token: null, // protocol token symbol (if exists any)
    category: "Lending", // allowed values can be 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1629295200, // Aug-18-2021 02:00:00 AM +UTC
    tokenHolderMap: [
      {
        holders: {
          pullFromLogs: true,
          logConfig: {
            target: "0x972a785b390D05123497169a04c72dE652493BE1",
            topic: "Create(address,address)",
            fromBlock: 13004429,
          },
          transform: (poolLog) => `0x${poolLog.slice(26)}`,
        },
        tokens: {
          pullFromPools: true,
          abi: {
            constant: true,
            inputs: [],
            name: "underlying",
            outputs: [
              {
                internalType: "contract ERC20",
                name: "",
                type: "address",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        },
      },
      {
        holders: ["0x972a785b390D05123497169a04c72dE652493BE1"],
        tokens: [
          "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
          "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", // USDC
          "0x6b175474e89094c44da98b954eedeac495271d0f", // DAI
          "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2", // WETH
        ],
      },
    ],
  };