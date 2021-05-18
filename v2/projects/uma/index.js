module.exports = {
  name: 'UMA',
  token: 'UMA',
  category: 'Derivatives',
  start: 1578581061, // Jan-09-2020 02:44:21 PM +UTC
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      // tokens: [
      //   '0xdac17f958d2ee523a2206206994597c13d831ec7',  // USDT
      //   '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // DAI
      //   '0x514910771AF9Ca656af840dff83E8264EcF986CA',  // LINK
      //   '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',  // USDC
      //   '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',  // WBTC
      //   '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',  // MKR
      // ],
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: '0x3e532e6222afe9Bcf02DCB87216802c75D5113aE',
          topic: 'NewContractRegistered(address,address,address[])',
          fromBlock: 9937650,
        },
        transform: (poolLog) => `0x${poolLog.substr(26, 40)}`,
      },
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
    }
  ]
}
