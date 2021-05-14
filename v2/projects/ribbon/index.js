module.exports = {
    /* Project Metadata */
    name: 'Ribbon Finance',
    token: null,
    category: 'Derivatives',
    start: 1618185600,
    /* required for fetching token balances */
    tokenHolderMap: [{
        tokens: [
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
          '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'  // USDC
        ],
        holders: [
          '0x0fabaf48bbf864a3947bdd0ba9d764791a60467a', // ETH Call Vault
          '0x8b5876f5B0Bf64056A89Aa7e97511644758c3E8c', // WBTC Call Vault
          '0x16772a7f4a3ca291C21B8AcE76F9332dDFfbb5Ef'  // ETH Put Vault
        ]
      }
    ],
  };