/*==================================================
  Modules
  ==================================================*/

const _ = require('underscore');
const sdk = require('../../sdk');
const abi = require('./abi.json');
const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  // cache some data
  const markets = [
    {
      underlying: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      symbol: 'USDC',
      decimals: 6,
      sToken: '0x3774E825d567125988Fb293e926064B6FAa71DAB',
    },
    {
      underlying: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      symbol: 'USDT',
      decimals: 6,
      sToken: '0x69702cfd7DAd8bCcAA24D6B440159404AAA140F5',
    },
    {
      underlying: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
      symbol: 'BUSD',
      decimals: 18,
      sToken: '0x18A908eD663823C908A900b934D6249d4befbE44',
    },
    {
      underlying: '0x74232704659ef37c08995e386A2E26cc27a8d7B1',
      symbol: 'STRK',
      decimals: 18,
      sToken: '0x4164e5b047842Ad7dFf18fc6A6e63a1e40610f46',
    },
    {
      underlying: '0x8CE9137d39326AD0cD6491fb5CC0CbA0e089b6A9',
      symbol: 'SXP',
      decimals: 18,
      sToken: '0xdBee1d8C452c781C17Ea20115CbaD0d5f627a680',
    },
    {
      underlying: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
      symbol: 'WBTC',
      decimals: 8,
      sToken: '0x9d1C2A187cf908aEd8CFAe2353Ef72F06223d54D',
    },
    {
      underlying: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'ETH',
      decimals: 18,
      sToken: '0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92',
    },
    {
      underlying: '0x514910771AF9Ca656af840dff83E8264EcF986CA',
      symbol: 'LINK',
      decimals: 18,
      sToken: '0x3F3B3B269d9f7088B022290906acff8710914be1',
    },
    {
      underlying: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
      symbol: 'COMP',
      decimals: 18,
      sToken: '0xb7E11002228D599F2a64b0C44D2299C9c644ff26',
    },
    {
      underlying: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
      symbol: 'UNI',
      decimals: 18,
      sToken: '0x280f76a218DDC8d56B490B5835e251E55a2e8F8d',
    },
  ];

/*==================================================
  TVL
  ==================================================*/

// ask comptroller for all markets array
async function getAllSTokens(block) {
  return (await sdk.api.abi.call({
    block,
    target: '0xe2e17b2CBbf48211FA7eB8A875360e5e39bA2602',
    params: [],
    abi: abi['getAllMarkets'],
  })).output;
}

async function getUnderlying(block, sToken) {
  if (sToken === '0xbEe9Cf658702527b0AcB2719c1FAA29EdC006a92') {
    return '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';//sETH => WETH
  }

  return (await sdk.api.abi.call({
    block,
    target: sToken,
    abi: abi['underlying'],
  })).output;
}

// returns {[underlying]: {sToken, decimals, symbol}}
async function getMarkets(block) {
  let allSTokens = await getAllSTokens(block);
  // if not in cache, get from the blockchain
  await (
    Promise.all(allSTokens.map(async (sToken) => {
      let foundMarket = false;
      for (let market of markets) {
        if (market.sToken.toLowerCase() === sToken.toLowerCase()) {
          foundMarket = true;
        }
      }
      if (!foundMarket) {
        let underlying = await getUnderlying(block, sToken);
        let info = await sdk.api.erc20.info(underlying);
        markets.push({ underlying, sToken, decimals: info.output.decimals, symbol: info.output.symbol })
      }
    }))
  );

  return markets;
}

async function tvl(timestamp, block) {
  let balances = {};
  let markets = await getMarkets(block);

  let locked = await sdk.api.abi.multiCall({
    block,
    calls: _.map(markets, (market) => ({
      target: market.sToken,
    })),
    abi: abi['getCash'],
  });

  _.each(markets, (market) => {
    let getCash = _.find(locked.output, (result) => result.success && result.input.target === market.sToken);

    if (getCash) {
      balances[market.underlying] = BigNumber(balances[market.underlying] || 0)
        .plus(getCash.output)
        .toFixed();
    }
  });
  return balances;
}

/*==================================================
  Rates
  ==================================================*/

async function rates(timestamp, block) {
  let rates = {
    lend: {},
    borrow: {},
    supply: {},
  };

  const markets = await getMarkets();

  const calls = _.map(markets, (data) => ({
    target: data.sToken,
  }));

  const supplyResults = (await sdk.api.abi.multiCall({
    block,
    calls,
    abi: abi['supplyRatePerBlock'],
  })).output;

  const borrowResults = (await sdk.api.abi.multiCall({
    block,
    calls,
    abi: abi['borrowRatePerBlock'],
  })).output;

  const totalBorrowsResults = (await sdk.api.abi.multiCall({
    block,
    calls,
    abi: abi['totalBorrows'],
  })).output;

  _.each(markets, (data) => {
    let supplyRate = _.find(
      supplyResults,
      (result) => result.success && result.input.target == data.sToken
    );
    let borrowRate = _.find(
      borrowResults,
      (result) => result.success && result.input.target == data.sToken
    );
    let totalBorrows = _.find(
      totalBorrowsResults,
      (result) => result.success && result.input.target == data.sToken
    );

    if (supplyRate && borrowRate && totalBorrows) {
      let symbol = data.symbol;
      rates.lend[symbol] = String(
        ((1 + supplyRate.output / 1e18) ** (365 * 28800) - 1) * 100
      );
      rates.borrow[symbol] = String(
        ((1 + borrowRate.output / 1e18) ** (365 * 28800) - 1) * 100
      );
      rates.supply[symbol] = BigNumber(totalBorrows.output)
        .div(10 ** data.decimals)
        .toFixed();
    }
  });

  return rates;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Strike',
  website: 'https://strike.org',
  token: null,
  category: 'lending',
  start: 1617004800, // 03/29/2021 @ 11:00am (UTC)
  tvl,
  rates,
  term: '1 block',
  permissioning: 'Open',
  variability: 'Medium',
};
