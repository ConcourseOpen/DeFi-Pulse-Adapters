module.exports = {
  /* Project Metadata */
  name: 'Wing Finance (Ethereum)',
  token: 'WING',
  category: 'Lending',
  start: 1617717600,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: [
        '0xDb0f18081b505A7DE20B18ac41856BCB4Ba86A1a', // pWING
        '0x0000000000000000000000000000000000000000', // ETH
        '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
        '0xcb46c550539ac3db72dc7af7c89b11c306c727c2', // pONT
        '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
        '0x8F041A3940a5e6FB580075C3774E15FcFA0E1618', // oneWING
      ],
      holders: '0x2F9fa63066cfA2d727F57ddf1991557bA86F12c9',
      checkETHBalance: true,
    }
  ],
};
