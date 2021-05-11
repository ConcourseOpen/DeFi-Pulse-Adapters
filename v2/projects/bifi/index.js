module.exports = {
  /* Project Metadata */
  name: 'BiFi',
  token: 'BIFI',
  category: 'Lending',
  start: 1609792137, // using Bifi contract creation date
  /* required for fetching token balances */
  tokenHolderMap: [{
    tokens: '0x0000000000000000000000000000000000000000',
    holders: '0x13000c4a215efe7e414bb329b2f11c39bcf92d78',      // ETH Pool
    checkETHBalance: true,
  }, {
    tokens: '0x0c7d5ae016f806603cb1782bea29ac69471cab9c',       // Bifrost: BFC Token
    holders: '0x488933457E89656D7eF7E69C10F2f80C7acA19b5',      // BFC Staking Pool
  }, {
    tokens: '0x01688e1a356c38a8ed7c565bf6c6bfd59543a560',       // BFCLP Token
    holders: '0xeaCE4E60F68E20797Fc696c870066f1E19C2b37d',      // BFCLP Pool
  }, {
    tokens: '0x1ec9b867b701c1e5ce9a6567ecc4b71838497c27',       // BIFILP Token
    holders: '0x18740cea640cba9Ce836DC80cE61c7b9ca4f11cb',      // BIFILP Pool
  }, {
    tokens: '0xdac17f958d2ee523a2206206994597c13d831ec7',       // USDT Token
    holders: '0x808c3ba97268dbf9695b1ec10729e09c7e67a9e3',      // USDT Pool
  }, {
    tokens: '0x6b175474e89094c44da98b954eedeac495271d0f',       // DAI Token
    holders: '0xd76b7060f1b646fa14740ff6ac670a4f0a6fc5e3',      // DAI Pool
  }, {
    tokens: '0x514910771af9ca656af840dff83e8264ecf986ca',       // Link Token
    holders: '0x25567603eb61a4a49f27e433652b5b8940d10682',      // Link Pool
  }, {
    tokens: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',       // USDC Token
    holders: '0x128647690C7733593aA3Dd149EeBC5e256E79217',      // USDC Pool
  }],
};
