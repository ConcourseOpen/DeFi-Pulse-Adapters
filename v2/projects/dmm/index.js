module.exports = {
    /* Project Metadata */
    name: 'DmmExchange',
    token: null,
    category: 'DEXes',
    start: 1617606651, // @5-Apr-2021, 7:10:51 AM+UTC 
    /*fetching token balances */
    tokenHolderMap: [
      {
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
            },
        holders: {
          pullFromLogs: true,
          logConfig: {
            target: '0x833e4083B7ae46CeA85695c4f7ed25CDAd8886dE',
            topic: 'poolCreated(address,address,address,uint32,uint256)',
            keys: [],
            fromBlock: 12178218
          },
          transform: null,
        },
        checkETHBalance: true,
      }
    ]
  };
 
