module.exports = {
  name: "Warp Finance",
  token: "WARP",
  category: "Lending",
  start: 1610650220,
  tokenHolderMap: [
    {
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: "0x6C74E2A1074ABe18969Be37210B93e681A40b35A",
          topic: "NewLPVault(address)",
          fromBlock: 11803584,
        },
        transform: (poolLog) => `0x${poolLog.substr(26, 40)}`,
      },
      tokens: {
        pullFromPools: true,
        abi: {
          inputs: [],
          name: "LPtoken",
          outputs: [
            {
              internalType: "contract IUniswapV2ERC20",
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
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: "0x6C74E2A1074ABe18969Be37210B93e681A40b35A",
          topic: "NewSCVault(address,address)",
          fromBlock: 11803584,
        },
        transform: (poolLog) => `0x${poolLog.substr(26, 40)}`,
      },
      tokens: {
        pullFromPools: true,
        abi: {
          inputs: [],
          name: "stablecoin",
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
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: "0x8E0Fa7c5C7Fa86A059e865A90b50a90351df716a",
          topic: "NewLPVault(address)",
          fromBlock: 11654924,
        },
        transform: (poolLog) => `0x${poolLog.substr(26, 40)}`,
      },
      tokens: {
        pullFromPools: true,
        abi: {
          inputs: [],
          name: "LPtoken",
          outputs: [
            {
              internalType: "contract IUniswapV2ERC20",
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
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: "0x8E0Fa7c5C7Fa86A059e865A90b50a90351df716a",
          topic: "NewSCVault(address,address)",
          fromBlock: 11654924,
        },
        transform: (poolLog) => `0x${poolLog.substr(26, 40)}`,
      },
      tokens: {
        pullFromPools: true,
        abi: {
          inputs: [],
          name: "stablecoin",
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
  ],
};
