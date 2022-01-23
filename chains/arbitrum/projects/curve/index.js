module.exports = {
    /* Project Metadata */
    name: "Curve Finance_Arbitrum",
    token: "CRV",
    chain: 'arbitrum',
    category: "DEXes",
    start: 1631509200,
    /* required for fetching token balances */
    tokenHolderMap: [
      {
        tokens: [
            '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8', //USDC
            '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', //USDT
        ],   
        holders: '0x7f90122BF0700F9E7e1F688fe926940E8839F353'   // 2pool
      },
      {
        tokens: [
            '0x82af49447d8a07e3bd95bd0d56f35241523fbab1', //WETH
            '0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9', //USDT
            '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f'  //WBTC
        ],   
        holders: '0x960ea3e3C7FB317332d990873d354E18d7645590'   // 3pool
      },
      {
        tokens: [
            '0xd22a58f79e9481d1a88e00c343885a588b34b68b', //EURS
        ],   
        holders: '0xA827a652Ead76c6B0b3D19dba05452E06e25c27e'   //EURSpool
      },
      {
        tokens: [
            '0xfea7a6a0b346362bf88a9e4a88416b77a57d6c2a', //MIM
        ],   
        holders: '0x30dF229cefa463e991e29D42DB0bae2e122B2AC7'   //MIMpool
      },
      {
        tokens: [
            '0x2f2a2543b76a4166549f7aab2e75bef0aefc5b0f',  //WBTC
            '0xdbf31df14b66535af65aac99c32e9ea844e14501' //renbtc
        ],   
        holders: '0x3E01dD8a5E1fb3481F0F589056b428Fc308AF0Fb'   // btcpool
      },
      {
        tokens: [
            '0xda10009cbd5d07dd0cecc66161fc93d7c9000da1', //DAI
        ],   
        holders: '0xF92C2A3C91bf869F77f9cB221C5AB1B1ada8a586'   // daipool
      },
      {
        tokens: [
            '0x17fc002b466eec40dae837fc4be5c67993ddbd6f', //FRAX
        ],   
        holders: '0xf07d553B195080F84F582e88ecdD54bAa122b279'
      },
    ]
  };
