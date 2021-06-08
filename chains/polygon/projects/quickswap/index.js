module.exports = {
    /* Project Metadata */
    name: "QuickSwap",
    token: "QUICK",
    chain: 'polygon',
    category: "DEXes",
    start: 1602171600,
    /* required for fetching token balances */
    tokenHolderMap: [{
        holders: {
          pullFromLogs: true,
          logConfig: {
            target: '0x5757371414417b8C6CAad45bAeF941aBc7d3Ab32',
            topic: 'PairCreated(address,address,address,uint256)',
            keys: [],
            fromBlock: 5484576
          },
          transform: (poolLog) => `0x${poolLog.data.slice(64 - 40 + 2, 64 + 2)}`,
        },
        tokens: {
          pullFromPools: true,
          abi: [
            {
              constant: true,
              inputs: [],
              name: "token1",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address"
                }
              ],
              payable: false,
              stateMutability: "view",
              type: "function"
            },
            {
              constant: true,
              inputs: [],
              name: "token0",
              outputs: [
                {
                  internalType: "address",
                  name: "",
                  type: "address"
                }
              ],
              payable: false,
              stateMutability: "view",
              type: "function"
            }
          ]
        }
      }
    ]
  };
  