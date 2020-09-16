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
  projectId: 'fce88319535826b883103e26ae2f262f7a0776a6d4f23b6ceace35795d4d'
};
