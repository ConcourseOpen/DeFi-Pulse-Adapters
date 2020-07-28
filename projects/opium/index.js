/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');

/*==================================================
  Settings
  ==================================================*/

  const tokenAddresses = [
    '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', // SAI
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',  // USDC
    '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',  // WETH
  ];

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    const balances = {};

    const balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(tokenAddresses, (address) => ({
        target: address,
        params: '0xafda317cb15967c2fd379885de227ca236e59cd3'
      })),
      abi: 'erc20:balanceOf'
    });

    _.each(balanceOfResults.output, (balanceOf) => {
      if(balanceOf.success) {
        const balance = balanceOf.output;
        const address = balanceOf.input.target;

        balances[address] = balance;
      }
    });

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Opium Network',
    token: null,
    category: 'derivatives',
    start: 1579601633, // 2020-01-21T10:13:53+00:00
    tvl
  }
