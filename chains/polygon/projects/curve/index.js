module.exports = {
    /* Project Metadata */
    name: "Curve_Polygon",
    token: "CRV",
    chain: 'polygon',
    category: "DEXes",
    start: 1618858763,
    /* required for fetching token balances */
    tokenHolderMap: [
      {
        tokens: [
            '0x27f8d03b3a2196956ed754badc28d73be8830a6e',
            '0x1a13f4ca1d028320a707d99520abfefca3998b7f',
            '0x60d55f02a771d515e077c9c2403a1ef324885cec'
        ],   
        holders: '0x445FE580eF8d70FF569aB36e80c647af338db351'   // aave
      },
      {
        tokens: [
            '0x5c2ed810328349100a66b82b78a1791b101c9d61',
            '0xdbf31df14b66535af65aac99c32e9ea844e14501'
        ],
        holders: '0xC2d95EEF97Ec6C17551d45e77B590dc1F9117C67'   // ren
      },
      {
        tokens: [
            '0xe7a24ef0c5e95ffb0f6684b813a78f2a3ad7d171',
            '0x5c2ed810328349100a66b82b78a1791b101c9d61',
            '0x28424507fefb6f7f8e9d3860f56504e4e5f5f390'
        ],   
        holders: '0x751B1e21756bDbc307CBcC5085c042a0e9AaEf36'   // atricrypto
      },
    ]
  };
  