module.exports = {
    /* Project Metadata */
    name: 'DmmExchange',
    token: null,
    category: 'DEXes',
    start: 1622961237, // @6-Jun-2021, 6:33:57 AM+UTC 
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
            target: '0x5f1fe642060b5b9658c15721ea22e982643c095c',
            topic: 'poolCreated(address,address,address,uint32,uint256)',
            keys: [],
            fromBlock: 15968294
          },
          transform: null,
        },
        checkETHBalance: true,
      }
    ]
  };
 
