module.exports = {
    /* Project Metadata */
    name: "Dfyn Network",
    token: "DFYN",
    chain: 'polygon',
    category: "DEXes",
    start:  1594319400,
    /* required for fetching token balances */
    tokenHolderMap: [{
        holders: {
          pullFromLogs: true,
          logConfig: {
            target: '0xE7Fb3e833eFE5F9c441105EB65Ef8b261266423B',
            topic: 'PairCreated(address,address,address,uint256)',
            keys: [],
            fromBlock: 5436831
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
  