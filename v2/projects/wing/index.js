module.exports = {
  /* Project Metadata */
  name: 'Wing Finance',
  token: 'WING',
  category: 'Lending',
  start: 1617717600,
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: '0xDb0f18081b505A7DE20B18ac41856BCB4Ba86A1a', // pWING
      holders: '0x4FA2425edf435B52016447Ab897d300d78c0Afe4',
    },
    {
      tokens: null, // ETH
      holders: '0xD93F4cf882D7d576a8Dc09e606B38CaF18Eda796',
      checkETHBalance: true,
      
    },
    {
      tokens: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
      holders: '0x3c22f604CC8b422F43becA8D8CdEF9922B96F454',
    },
    {
      tokens: '0xcb46c550539ac3db72dc7af7c89b11c306c727c2', // pONT
      holders: '0x65d999ddaaA6b0424BE37a53d5574E43e9433788',
    },
    {
      tokens: '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
      holders: '0x47dac542c5B9377E3A5d30992a6c32a3ad7f33db',
    },
    {
      tokens: '0x8F041A3940a5e6FB580075C3774E15FcFA0E1618', // oneWING
      holders: '0x363838fa35711EA3F8c8f95151203723cC6eE535',
    },
    {
      tokens: '0xa47c8bf37f92aBed4A126BDA807A7b7498661acD', // UST
      holders: '0xdB79f131acAc4Bd38B320E36c60aC542468a3B89',
    },
    {
      tokens: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
      holders: '0x12eE9b2e5F8746CA8a4a36260799301d03a066A4',
    },
    {
      tokens: '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
      holders: '0x0A705821cd494DfaB4C09603460126Cc05eb894f',
    }
  ],
};
