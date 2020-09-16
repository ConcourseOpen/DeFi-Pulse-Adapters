module.exports = {
  name: 'WBTC',
  token: null,
  category: 'Assets',
  start: 1543095952,  // Nov-24-2018 09:45:52 PM +UTC
  /* required for indexing token balances */
  tokenHolderMap: [
    {
      tokens: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      abi: 'erc20:totalSupply'
    }
  ],
  projectId: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599'
};
