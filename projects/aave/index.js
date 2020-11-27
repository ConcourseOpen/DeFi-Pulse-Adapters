/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require("bignumber.js");
  const abi = require('./abi.json');

/*==================================================
  Settings
  ==================================================*/

  const aaveLendingPoolCore = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";
  const aaveLendingPool = "0x398eC7346DcD622eDc5ae82352F02bE94C62d119";
  let aaveReserves = []

  const uniswapLendingPoolCore = "0x1012cfF81A1582ddD0616517eFB97D02c5c17E25";
  const uniswapLendingPool = "0x2F60C3EB259D63dcCa81fDE7Eaa216D9983D7C60";
  let uniswapReserves = []

  const aaveStakingContract = "0x4da27a545c0c5b758a6ba100e3a049001de870f5";
  const aaveTokenAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";

/*==================================================
  Helper Functions
  ==================================================*/

  async function _stakingTvl(block) {
    return (
      await sdk.api.abi.call({
        target: aaveTokenAddress,
        params: aaveStakingContract,
        abi: "erc20:balanceOf",
      })
    ).output;
  }

  async function _getAssets(lendingPoolCore) {
    const reserves = (
      await sdk.api.abi.call({
        target: lendingPoolCore,
        abi: abi["getReserves"],
      })
    ).output;

    const decimalsOfReserve = (
      await sdk.api.abi.multiCall({
      calls: _.map(reserves, (reserve) => ({
        target: reserve
      })),
      abi: "erc20:decimals"
    })
    ).output;

    const symbolsOfReserve = (
      await sdk.api.abi.multiCall({
      calls: _.map(reserves, reserve => ({
        target: reserve
      })),
      abi: "erc20:symbol"
    })
    ).output;

    let assets = []
    
    reserves.map((reserve, i) => {
      if (reserve === '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE') return;

      let symbol;
      switch(reserve) {
        case "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2": // MKR doesn't include symbol in contract 🤷‍♂️
          symbol = { output: 'MKR' }; break
        default:
          symbol = symbolsOfReserve[i]
      }
  
      const decimals = decimalsOfReserve[i]
      if (decimals.success) {
        assets.push({ address: reserve, symbol: symbol.output, decimals: decimals.output })
      }
    })
  
    return assets
  }

  async function _multiMarketTvl(lendingPoolCore, reserves, block) {
    let balances = {
      "0x0000000000000000000000000000000000000000": (
        await sdk.api.eth.getBalance({ target: lendingPoolCore, block })
      ).output,
    };

    const balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(reserves, (reserve) => ({
        target: reserve.address,
        params: lendingPoolCore,
      })),
      abi: "erc20:balanceOf",
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    return balances;
  }

  async function _multiMarketRates(lendingPool, reserves, block) {
    const calls = _.map(reserves, (reserve) => ({
      target: lendingPool,
      params: reserve.address,
    }));

    const reserveDataResults = (
      await sdk.api.abi.multiCall({
        block,
        calls,
        abi: abi["getReserveData"],
      })
    ).output;

    const reserveConfigResult = (
      await sdk.api.abi.multiCall({
        block,
        calls,
        abi: abi["getReserveConfigurationData"],
      })
    ).output;

    let ratesData = { lend: {}, borrow: {}, supply: {}, borrow_stable: {} };

    reserveDataResults.map((result) => {
      if (!result || !result.success) return;
      const address = result.input.params[0];
      const reserveData = result.output;
      const reserveDict = reserves.find(
        (reserve) => reserve.address === address
      );
      const symbol = reserveDict.symbol;

      const outStandingBorrows = BigNumber(reserveData.totalLiquidity)
        .minus(BigNumber(reserveData.availableLiquidity))
        .div(10 ** reserveDict.decimals)
        .toFixed();
      const lendRate = BigNumber(reserveData.liquidityRate)
        .div(10 ** 25)
        .toFixed();
      const borrowRate = BigNumber(reserveData.variableBorrowRate)
        .div(10 ** 25)
        .toFixed();
      const borrowStableRate = BigNumber(reserveData.stableBorrowRate)
        .div(10 ** 25)
        .toFixed();

      ratesData.lend[symbol] = lendRate;
      ratesData.borrow[symbol] = borrowRate;
      ratesData.borrow_stable[symbol] = borrowStableRate;
      ratesData.supply[symbol] = outStandingBorrows;
    });

    reserveConfigResult.map((result) => {
      if (!result || !result.success) return;
      const address = result.input.params[0];
      const reserveConfig = result.output;
      const reserveDict = reserves.find(
        (reserve) => reserve.address === address
      );
      const symbol = reserveDict.symbol;

      const isActive = reserveConfig.isActive;
      const borrowingEnabled = reserveConfig.borrowingEnabled;
      const stableBorrowRateEnabled = reserveConfig.stableBorrowRateEnabled;

      if (!isActive) {
        delete ratesData.lend[symbol];
        delete ratesData.borrow[symbol];
        delete ratesData.borrow_stable[symbol];
        delete ratesData.supply[symbol];
        return;
      }

      if (!borrowingEnabled) {
        delete ratesData.borrow[symbol];
        delete ratesData.borrow_stable[symbol];
        return;
      }

      if (!stableBorrowRateEnabled) {
        delete ratesData.borrow_stable[symbol];
      }
    });

    return ratesData;
  }

  async function getReserves() {
    if (aaveReserves.length === 0) {
      aaveReserves = await _getAssets(aaveLendingPoolCore);
    }

    if (uniswapReserves.length === 0) {
      // Does not take into account Uniswap LP assets (not yet supported on DeFiPulse)
      uniswapReserves = await _getAssets(uniswapLendingPoolCore);
    }
  }

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    await getReserves()
    let balances = await _multiMarketTvl(aaveLendingPoolCore, aaveReserves, block);
    
    const uniswapMarketTvlBalances = await _multiMarketTvl(
      uniswapLendingPoolCore,
      uniswapReserves,
      block
    );

    // Combine TVL values into one dict
    Object.keys(uniswapMarketTvlBalances).forEach(address => {
      if (balances[address]) {
        balances[address] = BigNumber(
          balances[address]
        ).plus(uniswapMarketTvlBalances[address]).toFixed();
      } else {
        balances[address] = uniswapMarketTvlBalances[address];
      }
    });

    const stakedAaveAmount = await _stakingTvl(block);
    balances[aaveTokenAddress] = stakedAaveAmount;
    return balances;
  }

/*==================================================
  Rates
  ==================================================*/

  async function rates(timestamp, block) {
    await getReserves()
  
    // DeFi Pulse only supports single market atm, so no rates from Uniswap market (e.g. Dai on Uniswap market)
    const aaveReservesWithEth = aaveReserves
    aaveReservesWithEth.push({
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      symbol: "ETH",
      decimals: 18,
    });
    return await _multiMarketRates(aaveLendingPool, aaveReserves, block)
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: "Aave",
    website: "https://aave.com",
    token: "LEND",
    category: "lending",
    start: 1578355200, // 01/07/2020 @ 12:00am (UTC)
    tvl,
    rates,
    term: "1 block",
    variability: "medium",
  };
