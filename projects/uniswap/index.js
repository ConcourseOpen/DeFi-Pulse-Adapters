/*==================================================
  Modules
==================================================*/

  const sdk = require('../../sdk');

/*==================================================
  Settings
==================================================*/

  const startBlock = 6627917;
  const factory = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95';

/*==================================================
  Main
==================================================*/

  async function tvl (timestamp, block) {
    const allExchanges = [];
    let events = (await sdk.api.util.getLogs({
      keys: [],
      toBlock: block,
      target: factory,
      fromBlock: startBlock,
      topic: 'NewExchange(address,address)',
    })).output;

    events.forEach((event) => {
      allExchanges.push({
        tokenAddress: `0x${event.topics[1].substring(26)}`,
        exchangeAddress: `0x${event.topics[2].substring(26)}`,
      });
    });

    const balances = (await sdk.api.abi.multiCall({
      block: block,
      abi: 'erc20:balanceOf',
      calls: allExchanges.map(exchange => ({ target: exchange.tokenAddress, params: exchange.exchangeAddress })),
    })).output;

    return balances;
  }

/*==================================================
  Exports
==================================================*/

  module.exports = {
    name: 'Uniswap',
    token: null,
    category: 'dexes',
    start: 1541116800, // 11/02/2018 @ 12:00am (UTC)
    tvl,
  };
