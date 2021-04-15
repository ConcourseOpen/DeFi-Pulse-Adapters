module.exports = {
  /* Project Metadata */
  name: 'Loopring',
  token: 'LRC',
  category: 'DEXes',
  start: 1574241665, // 11/20/2019 @ 09:21AM (UTC)
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: [
        '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',  // LRC
        '0xdac17f958d2ee523a2206206994597c13d831ec7',  // USDT
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // DAI
        '0x514910771AF9Ca656af840dff83E8264EcF986CA',  // LINK
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',  // USDC
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',  // WBTC
        '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',  // MKR
      ],
      holders: [
        '0x674bdf20A0F284D710BC40872100128e2d66Bd3f',
        '0x944644Ea989Ec64c2Ab9eF341D383cEf586A5777'
      ],
      checkETHBalance: true,
    }
  ]
};
