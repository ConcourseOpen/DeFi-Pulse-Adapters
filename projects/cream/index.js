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

  const markets = {};
  const marketsToIgnore = ['0xBdf447B39D152d6A234B4c02772B8ab5D1783F72'];
  const wETH = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const usdt = '0xdAC17F958D2ee523a2206206994597C13D831ec7';
  const yCrv = '0xdF5e0e81Dff6FAF3A7e52BA697820c5e32D806A8';
  const yyCrv = '0x5dbcF33D8c2E976c6b560249878e6F1491Bca25c';
  const yETH = '0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7';

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

  const yVaultPrices = (await sdk.api.abi.multiCall({
    block,
    calls: [{target: yETH}, {target: yyCrv}],
    abi: abi['getPricePerFullShare'],
  })).output;

  const yCrvPrice = (await sdk.api.abi.call({
    block,
    target: '0x45F783CCE6B7FF23B2ab2D70e416cdb7D6055f51',
    params: [],
    abi: abi['get_virtual_price']
  })).output;


  _.each(markets, (data, underlying) => {
    let getCash = _.find(cashes.output, (result) => result.success && result.input.target === data.cToken);
    if (getCash) {
      if (underlying === yETH) {
        const ethCash = BigNumber(balances[wETH] || 0);
        const yETHCash = BigNumber(getCash.output).multipliedBy(yVaultPrices[0].output).div(1e18).integerValue();
        balances[wETH] = ethCash.plus(yETHCash).toFixed();
      } else if (underlying === yCrv) {
        const usdtCash = BigNumber(balances[usdt] || 0);
        const yCrvCash = BigNumber(getCash.output).multipliedBy(yCrvPrice).div(1e18).div(1e12).integerValue();
        balances[usdt] = usdtCash.plus(yCrvCash).toFixed();
      } else if (underlying === yyCrv) {
        const usdtCash = BigNumber(balances[usdt] || 0);
        const yyCrvCash = BigNumber(getCash.output).multipliedBy(yCrvPrice).div(1e18).div(1e12).multipliedBy(yVaultPrices[1].output).div(1e18).integerValue();
        balances[usdt] = usdtCash.plus(yyCrvCash).toFixed();
      } else {
        if (underlying === usdt) {
          const usdtCash = BigNumber(balances[usdt] || 0);
          balances[underlying] = usdtCash.plus(getCash.output).toFixed();
        } else {
          balances[underlying] = BigNumber(getCash.output).toFixed();
        }
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
