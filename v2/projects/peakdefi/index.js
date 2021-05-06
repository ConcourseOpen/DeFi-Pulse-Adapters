module.exports = {
  /* Project Metadata */
  name: 'PEAKDEFI',         // Peakdefi
  token: 'PEAK',            // PEAK token
  category: 'assets',       // Allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1607405152,        // Dec-08-2020 05:25:52 PM +UTC
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: [
        '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
        '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
      ],
      holders: '0x6DE5673d00D42323Fb2E7F34ADcA156280370876',
      checkETHBalance: true,
    }
  ],
};
