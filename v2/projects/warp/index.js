module.exports = {
  name: "Warp Finance",
  token: "WARP",
  category: "Lending",
  start: 11803584,
  tokenHolderMap: [
    {
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: "0x6C74E2A1074ABe18969Be37210B93e681A40b35A",
          topic: "NewLPVault(address)",
          keys: ["topics"],
          fromBlock: 11803584,
        },
        transform: (poolLog) => `0x${poolLog[1].slice(26)}`,
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
          keys: ["topics"],
          fromBlock: 11803584,
        },
        transform: (poolLog) => `0x${poolLog[1].slice(26)}`,
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
