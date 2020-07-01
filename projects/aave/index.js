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

  const aaveReserves = [
    { address: "0x6b175474e89094c44da98b954eedeac495271d0f", symbol: "DAI", decimals: 18 },
    { address: "0x0000000000085d4780B73119b644AE5ecd22b376", symbol: "TUSD", decimals: 18 },
    { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", decimals: 6 },
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", decimals: 6 },
    { address: "0x57ab1ec28d129707052df4df418d58a2d46d5f51", symbol: "SUSD", decimals: 18 },
    { address: "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03", symbol: "LEND", decimals: 18 },
    { address: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF", symbol: "BAT", decimals: 18 },
    { address: "0x1985365e9f78359a9B6AD760e32412f4a445E862", symbol: "REP", decimals: 18 },
    { address: "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2", symbol: "MKR", decimals: 18 },
    { address: "0x514910771AF9Ca656af840dff83E8264EcF986CA", symbol: "LINK", decimals: 18 },
    { address: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200", symbol: "KNC", decimals: 18 },
    { address: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599", symbol: "WBTC", decimals: 8 },
    { address: "0x0F5D2fB29fb7d3CFeE444a200298f468908cC942", symbol: "MANA", decimals: 18 },
    { address: "0xE41d2489571d322189246DaFA5ebDe1F4699F498", symbol: "ZRX", decimals: 18 },
    { address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F", symbol: "SNX", decimals: 18 },
    { address: "0x4Fabb145d64652a948d72533023f6E7A623C7C53", symbol: "BUSD", decimals: 18 },
  ];

  const aaveLendingPoolCore = "0x3dfd23A6c5E8BbcFc9581d2E864a68feb6a076d3";
  const aaveLendingPool = "0x398eC7346DcD622eDc5ae82352F02bE94C62d119";

  const uniswapReserves = [
    { address: "0x6B175474E89094C44Da98b954EedeAC495271d0F", symbol: "DAI", decimals: 18 },
    { address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", symbol: "USDC", decimals: 6 },
    { address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", symbol: "USDT", decimals: 18 },
    { address: "0x97dec872013f6b5fb443861090ad931542878126", symbol: "UNI_USDC_ETH", decimals: 18 },
    { address: "0xF173214C720f58E03e194085B1DB28B50aCDeeaD", symbol: "UNI_LINK_ETH", decimals: 18 },
    { address: "0x2a1530C4C41db0B0b2bB646CB5Eb1A67b7158667", symbol: "UNI_DAI_ETH", decimals: 18 },
    { address: "0xcaA7e4656f6A2B59f5f99c745F91AB26D1210DCe", symbol: "UNI_LEND_ETH", decimals: 18 },
    { address: "0x2C4Bd064b998838076fa341A83d007FC2FA50957", symbol: "UNI_MKR_ETH", decimals: 18 },
    { address: "0xe9Cf7887b93150D4F2Da7dFc6D502B216438F244", symbol: "UNI_SETH_ETH", decimals: 18 },
  ];

  const uniswapLendingPoolCore = "0x1012cfF81A1582ddD0616517eFB97D02c5c17E25";
  const uniswapLendingPool = "0x2F60C3EB259D63dcCa81fDE7Eaa216D9983D7C60";

/*==================================================
  Helper Functions
  ==================================================*/

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

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = await _multiMarketTvl(aaveLendingPoolCore, aaveReserves, block);
    
    const uniswapMarketTvlBalances = await _multiMarketTvl(
      uniswapLendingPoolCore,
      uniswapReserves,
      block
    );

    // Combine TVL values into one dict
    Object.keys(uniswapMarketTvlBalances).map(address => {
      if (balances[address]) {
        balances[address] = BigNumber(
          balances[address]
        ).plus(uniswapMarketTvlBalances[address]).toFixed();
      } else {
        balances[address] = uniswapMarketTvlBalances[address];
      }
    });

    console.log(balances)
    return balances;
  }

/*==================================================
  Rates
  ==================================================*/

  async function rates(timestamp, block) {
    // DeFi Pulse only supports single market atm, so no rates from Uniswap market (e.g. Dai on Uniswap market)
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
