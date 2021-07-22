module.exports = {
  /* Project Metadata */
  name: 'DeFireX',
  token: 'DFX',
  category: 'Assets',
  chain: 'polygon',
  start: 1622210481 , // created first strategy
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: ['0xe381c25de995d62b453af8b931aac84fccaa7a62'],
      holders: '0xfC967d141845ae9c7A01f5291eF9c96e7257Dae3',      // Strategy controller contract
      checkETHBalance: false,
    },
 ],
};
