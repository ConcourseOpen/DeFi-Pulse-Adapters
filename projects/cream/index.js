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

  const markets = {}
  const marketsToIgnore = ['0xBdf447B39D152d6A234B4c02772B8ab5D1783F72']

/*==================================================
  TVL
  ==================================================*/

// ask comptroller for all markets array
async function getAllCTokens(block) {
  let cTokens = (await sdk.api.abi.call({
    block,
    target: '0x3d5BC3c8d13dcB8bF317092d84783c2697AE9258',
    params: [],
    abi: abi['getAllMarkets'],
  })).output;
  return cTokens.filter(function(cToken) {
    return marketsToIgnore.indexOf(cToken) === -1;
  })
}

async function getUnderlying(block, cToken) {
  if (cToken === '0xD06527D5e56A3495252A528C4987003b712860eE') {
    return '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'; //crETH => WETH
  }

  return (await sdk.api.abi.call({
    block,
    target: cToken,
    abi: abi['underlying'],
  })).output;
}

// returns {[underlying]: {cToken, decimals, symbol}}
async function getMarkets(block) {
  let allCTokens = await getAllCTokens(block);
  await (
    Promise.all(allCTokens.map(async (cToken) => {
      let underlying = await getUnderlying(block, cToken);

      if (!markets[underlying]) {
        let info = await sdk.api.erc20.info(underlying);
        markets[underlying] = { cToken, decimals: info.output.decimals, symbol: info.output.symbol };
      }
    }))
  );

  return markets;
}

async function tvl(timestamp, block) {
  let balances = {};
  let markets = await getMarkets(block);

  let cashes = await sdk.api.abi.multiCall({
    block,
    calls: _.map(markets, (data, _) => ({
      target: data.cToken,
    })),
    abi: abi['getCash'],
  });

  _.each(markets, (data, underlying) => {
    let getCash = _.find(cashes.output, (result) => result.success && result.input.target === data.cToken);
    if (getCash) {
      balances[underlying] = BigNumber(getCash.output).toFixed();
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

  const calls = _.map(markets, (data, underlying) => ({
    target: data.cToken,
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

  _.each(markets, (data, underlying) => {
    let supplyRate = _.find(
      supplyResults,
      (result) => result.success && result.input.target == data.cToken
    );
    let borrowRate = _.find(
      borrowResults,
      (result) => result.success && result.input.target == data.cToken
    );
    let totalBorrows = _.find(
      totalBorrowsResults,
      (result) => result.success && result.input.target == data.cToken
    );

    if (supplyRate && borrowRate && totalBorrows) {
      let symbol = data.symbol;
      rates.lend[symbol] = String(
        ((1 + supplyRate.output / 1e18) ** (365 * 5760) - 1) * 100
      );
      rates.borrow[symbol] = String(
        ((1 + borrowRate.output / 1e18) ** (365 * 5760) - 1) * 100
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
  name: 'Cream Finance',
  website: 'https://cream.finance',
  token: null,
  category: 'lending',
  start: 1596412800, // 08/03/2020 @ 12:00am (UTC)
  tvl,
  rates,
  term: '1 block',
  permissioning: 'Open',
  variability: 'Medium',
};
