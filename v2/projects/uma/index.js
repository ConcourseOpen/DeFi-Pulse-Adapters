module.exports = {
  name: 'UMA',
  token: 'UMA',
  category: 'Derivatives',
  start: 1578581061, // Jan-09-2020 02:44:21 PM +UTC
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: {
        pullFromPools: true,
        abi: {
          inputs: [],
          name: "collateralCurrency",
          outputs: [
            {
              internalType: "contract IERC20",
              name: "",
              type: "address",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
      },
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: '0x3e532e6222afe9Bcf02DCB87216802c75D5113aE',
          topic: 'NewContractRegistered(address,address,address[])',
          keys: ['topics'],
          fromBlock: 9937650,
        },
        transform: (poolLog) => `0x${poolLog[1].slice(26)}`,
      },
    },
  ],
};
