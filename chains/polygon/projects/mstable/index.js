module.exports = {
  /* Project Metadata */
  name: "mStable_Polygon",
  token: "MTA",
  chain: 'polygon',
  category: "Assets",
  start: 1619178565,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: '0x104592a158490a9228070e0a8e5343b499e125d0',
      holders: '0xb30a907084ac8a0d25dddab4e364827406fd09f0'   // Frax fPool
    },
    {
      tokens: [
        '0x27f8d03b3a2196956ed754badc28d73be8830a6e',
        '0x1a13f4ca1d028320a707d99520abfefca3998b7f',
        '0x60d55f02a771d515e077c9c2403a1ef324885cec'
      ],
      holders: '0xeab7831c96876433dB9B8953B4e7e8f66c3125c3'   // mUSD
    }
  ]
};
