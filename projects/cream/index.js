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
  const yETH = '0xe1237aA7f535b0CC33Fd973D66cBf830354D16c7';
  const CRETH2 = '0xcBc1065255cBc3aB41a6868c22d1f1C573AB89fd';

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

  const yETHPirce = (await sdk.api.abi.call({
    block,
    target: yETH,
    params: [],
    abi: abi['getPricePerFullShare']
  })).output;

  const creth2Price =
    block > 11282434 ?
      (await sdk.api.abi.call({
        block,
        target: '0xbc338CA728a5D60Df7bc5e3AF5b6dF9DB697d942',
        params: [wETH, CRETH2],
        abi: abi['getSpotPrice']
    })).output : 0;


  _.each(markets, (data, underlying) => {
    let getCash = _.find(cashes.output, (result) => result.success && result.input.target === data.cToken);
    if (getCash) {
      if (underlying === yETH) {
        const ethCash = BigNumber(balances[wETH] || 0);
        const yETHCash = BigNumber(getCash.output).multipliedBy(yETHPirce).div(1e18).integerValue();
        balances[wETH] = ethCash.plus(yETHCash).toFixed();
        delete balances[underlying];
      } else if (underlying === CRETH2) {
        const ethCash = BigNumber(balances[wETH] || 0);
        const creth2Cash = BigNumber(getCash.output).multipliedBy(creth2Price).div(1e18).integerValue();
        balances[wETH] = ethCash.plus(creth2Cash).toFixed();
        delete balances[underlying];
      } else {
        balances[underlying] = BigNumber(getCash.output).toFixed();
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
