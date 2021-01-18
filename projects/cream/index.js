/*==================================================
  Modules
  ==================================================*/

const _ = require('underscore');
const sdk = require('../../sdk');
const abi = require('./abi.json');
const BigNumber = require('bignumber.js');
const v2TVL = require('./v2');



/*==================================================
  Settings
  ==================================================*/

const comptroller = '0x3d5BC3c8d13dcB8bF317092d84783c2697AE9258';
const marketsToIgnore = ['0xBdf447B39D152d6A234B4c02772B8ab5D1783F72'];
const crETH = '0xD06527D5e56A3495252A528C4987003b712860eE';
const wETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const yETH = '0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7';
const yCrv = '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8';
const ySwap = '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51';
const yUSD = '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c';
const usdc = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';
const CRETH2 = '0xcBc1065255cBc3aB41a6868c22d1f1C573AB89fd';
const CRETH2SLP = '0x71817445d11f42506f2d7f54417c935be90ca731';

/*==================================================
  TVL
  ==================================================*/

// ask comptroller for all markets array
async function getAllCTokens(block) {
  let cTokens = (await sdk.api.abi.call({
    block,
    target: comptroller,
    params: [],
    abi: abi['getAllMarkets'],
  })).output;
  return cTokens.filter(function (cToken) {
    return marketsToIgnore.indexOf(cToken) === -1;
  })
}

async function getAllUnderlying(block, cTokens) {
  const cErc20s = cTokens.filter(cToken => cToken !== crETH)
  let allUnderlying = (await sdk.api.abi.multiCall({
    block,
    calls: _.map(cErc20s, (cErc20) => ({
      target: cErc20
    })),
    abi: abi['underlying']
  })).output;

  allUnderlying.push({
    input: {
      target: crETH
    },
    success: true,
    output: wETH
  });
  return allUnderlying;
}

async function getCashes(block, cTokens) {
  return (await sdk.api.abi.multiCall({
    block,
    calls: _.map(cTokens, (cToken) => ({
      target: cToken
    })),
    abi: abi['getCash']
  })).output;
}

// returns {[underlying]: {cToken, decimals, symbol}}
async function getMarkets(block) {
  const allCTokens = await getAllCTokens(block);
  const allUnderlying = await getAllUnderlying(block, allCTokens);
  let [
    underlyingDecimals,
    underlyingSymbols
  ] = await Promise.all([
    sdk.api.abi.multiCall({
      block,
      calls: _.map(allUnderlying, (underlying) => ({
        target: underlying.output
      })),
      abi: abi['decimals']
    }),
    sdk.api.abi.multiCall({
      block,
      calls: _.map(allUnderlying, (underlying) => ({
        target: underlying.output
      })),
      abi: abi['symbol']
    })
  ])

  let markets = {};
  _.each(allUnderlying, (underlying) => {
    let decimals = _.find(underlyingDecimals.output, (decimals) => decimals.success && decimals.input.target === underlying.output);
    let symbol = _.find(underlyingSymbols.output, (symbol) => symbol.success && symbol.input.target === underlying.output);
    if (symbol && decimals) {
      const cToken = underlying.input.target;
      decimals = decimals.output;
      symbol = symbol.output;
      markets[underlying.output] = {
        cToken,
        decimals,
        symbol
      }
    }
  });

  return markets;
}

async function tvl(timestamp, block) {
  let balances = {};

  const cTokens = await getAllCTokens(block);
  let [
    allUnderlying,
    cashes,
    v2Balances,
    yETHPirce,
    yUSDPrice,
    yCrvPrice,
    creth2Reserve
  ] = await Promise.all([
    getAllUnderlying(block, cTokens),
    getCashes(block, cTokens),
    v2TVL(timestamp, block),
    (block > 	10774539 ? sdk.api.abi.call({
      block,
      target: yETH,
      params: [],
      abi: abi['getPricePerFullShare']
    }) : {
      output: 1e18
    }),
    sdk.api.abi.call({
      block,
      target: yUSD,
      params: [],
      abi: abi['getPricePerFullShare']
    }),
    sdk.api.abi.call({
      block,
      target: ySwap,
      params: [],
      abi: abi['get_virtual_price']
    }),
    (block > 11508720 ? sdk.api.abi.call({
      block,
      target: CRETH2SLP,
      params: [],
      abi: abi['getReserves']
    }) : {
        output: {
          _reserve0: 1,
          _reserve1: 1
        }
      })
  ]);

  yETHPirce = yETHPirce.output;
  yUSDPrice = yUSDPrice.output;
  yCrvPrice = yCrvPrice.output;
  creth2Reserve = creth2Reserve.output;
  balances = v2Balances;

  // CRETH2 price = (WETH amount / CRETH2 amount) in Sushiswap pool
  const creth2Price = BigNumber(creth2Reserve._reserve0).multipliedBy(1e18).div(creth2Reserve._reserve1).integerValue();

  _.each(cTokens, (cToken) => {
    let getCash = _.find(cashes, (result) => result.success && result.input.target === cToken);
    let underlying = _.find(allUnderlying, (result) => result.success && result.input.target === cToken);
    if (getCash && underlying) {
      getCash = getCash.output;
      underlying = underlying.output;
      if (underlying === yETH) {
        const ethCash = BigNumber(balances[wETH] || 0);
        const yETHCash = BigNumber(getCash).multipliedBy(yETHPirce).div(1e18).integerValue();
        balances[wETH] = ethCash.plus(yETHCash).toFixed();
        delete balances[underlying];
      } else if (underlying === CRETH2) {
        const ethCash = BigNumber(balances[wETH] || 0);
        const creth2Cash = BigNumber(getCash).multipliedBy(creth2Price).div(1e18).integerValue();
        balances[wETH] = ethCash.plus(creth2Cash).toFixed();
        delete balances[underlying];
      } else if (underlying === yCrv) {
        const usdcCash = BigNumber(balances[usdc] || 0);
        const yCrvCash = BigNumber(getCash).multipliedBy(yCrvPrice).div(1e18).div(1e12).integerValue();
        balances[usdc] = usdcCash.plus(yCrvCash).toFixed();
        delete balances[underlying];
      } else if (underlying === yUSD) {
        const usdcCash = BigNumber(balances[usdc] || 0);
        const yUSDCash = BigNumber(getCash).multipliedBy(yUSDPrice).div(1e18).multipliedBy(yCrvPrice).div(1e18).div(1e12).integerValue();
        balances[usdc] = usdcCash.plus(yUSDCash).toFixed();
        delete balances[underlying];
      } else {
        const cash = BigNumber(balances[underlying] || 0);
        balances[underlying] = cash.plus(BigNumber(getCash)).toFixed();
      }
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


  const markets = await getMarkets(block);

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
  name: 'C.R.E.A.M. Finance',
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
