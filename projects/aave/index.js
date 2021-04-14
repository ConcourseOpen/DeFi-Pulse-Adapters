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
  const aaveBalancerContractImp = "0xC697051d1C6296C24aE3bceF39acA743861D9A81";
  const aaveTokenAddress = "0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9";
  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";

  const addressesProviderRegistry = "0x52D306e36E3B6B02c153d0266ff0f85d18BCD413";
  let v2Atokens = [];
  let v2ReserveTokens = [];
  let addressSymbolMapping = {};

/*==================================================
  Helper Functions
  ==================================================*/

  async function _stakingTvl(block) {
    return (
      await sdk.api.abi.call({
        target: aaveTokenAddress,
        params: aaveStakingContract,
        abi: "erc20:balanceOf",
        block
      })
    ).output;
  }

  async function _stakingBalancerTvl(block) {
    const aaveBal = (
      await sdk.api.abi.call({
        target: aaveTokenAddress,
        params: aaveBalancerContractImp,
        abi: "erc20:balanceOf",
        block,
      })
    ).output;

    const wethBal = (
      await sdk.api.abi.call({
        target: wethTokenAddress,
        params: aaveBalancerContractImp,
        abi: "erc20:balanceOf",
        block,
      })
    ).output;

    return {
      [aaveTokenAddress]: aaveBal,
      [wethTokenAddress]: wethBal,
    };
  }

  async function _getV1Assets(lendingPoolCore, block) {
    const reserves = (
      await sdk.api.abi.call({
        target: lendingPoolCore,
        abi: abi["getReserves"],
        block
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

  async function _multiMarketV1Tvl(lendingPoolCore, reserves, block) {
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

  async function _multiMarketV1Rates(lendingPool, reserves, block) {
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
      const symbol = reserveDict.symbol + "_V1";

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
      const symbol = reserveDict.symbol + "_V1";

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

  async function getV1Reserves(block) {
    if (aaveReserves.length === 0) {
      aaveReserves = await _getV1Assets(aaveLendingPoolCore, block);
    }

    if (uniswapReserves.length === 0) {
      // Does not take into account Uniswap LP assets (not yet supported on DeFiPulse)
      uniswapReserves = await _getV1Assets(uniswapLendingPoolCore, block);
    }
  }

  async function getV2Reserves(block) {
    if (v2Atokens.length !== 0 && v2ReserveTokens.length !== 0) return

    const addressesProviders = (
      await sdk.api.abi.call({
        target: addressesProviderRegistry,
        abi: abi["getAddressesProvidersList"],
        block
      })
    ).output;

    const protocolDataHelpers = (
      await sdk.api.abi.multiCall({
        calls: _.map(addressesProviders, (provider) => ({
          target: provider,
          params: "0x0100000000000000000000000000000000000000000000000000000000000000",
        })),
        abi: abi["getAddress"],
        block
      })
    ).output;

    const validProtocolDataHelpers = protocolDataHelpers.filter(
      (helper) =>
        helper.output !== "0x0000000000000000000000000000000000000000"
    );

    const aTokenMarketData = (
      await sdk.api.abi.multiCall({
        calls: _.map(validProtocolDataHelpers, (dataHelper) => ({
          target: dataHelper.output,
        })),
        abi: abi["getAllATokens"],
        block,
      })
    ).output;

    let aTokenAddresses = [];
    aTokenMarketData.map((aTokensData) => {
      if (aTokensData.output) {
        aTokenAddresses = [
          ...aTokenAddresses,
          ...aTokensData.output.map((aToken) => aToken[1]),
        ];
      }
    });

    const underlyingAddressesData = (
      await sdk.api.abi.multiCall({
        calls: _.map(aTokenAddresses, (aToken) => ({
          target: aToken,
        })),
        abi: abi["getUnderlying"],
        block
      })
    ).output;

    let reserveAddresses = [];
    underlyingAddressesData.map((reserveData) => {
      reserveAddresses.push(reserveData.output)
    });

    v2Atokens = aTokenAddresses
    v2ReserveTokens = reserveAddresses;

    // Fetch associated token info
    const symbolsOfReserves = (
      await sdk.api.abi.multiCall({
        calls: _.map(v2ReserveTokens, (underlying) => ({
          target: underlying,
        })),
        abi: "erc20:symbol",
        block
      })
    ).output;

    const decimalsOfReserves = (
      await sdk.api.abi.multiCall({
        calls: _.map(v2ReserveTokens, (underlying) => ({
          target: underlying,
        })),
        abi: "erc20:decimals",
        block
      })
    ).output

    symbolsOfReserves.map((r) => {
      const address = r.input.target;
      let symbol;

      if (address == "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2") {
        symbol = "MKR";
      } else {
        symbol = r.output;
      }

      addressSymbolMapping[address] = { symbol };
    });

    decimalsOfReserves.map((r) => {
      const address = r.input.target;
      const existingAddress = addressSymbolMapping[address];
      addressSymbolMapping[address] = {
        ...existingAddress,
        decimals: r.output,
      };
    });
  }

  async function getV2Tvl(block) {
    const underlyingAddressesDict = Object.keys(v2ReserveTokens).map(
      (key) => v2ReserveTokens[key]
    );

    const balanceOfUnderlying = (
      await sdk.api.abi.multiCall({
        calls: _.map(v2Atokens, (aToken, index) => ({
          target: underlyingAddressesDict[index],
          params: aToken,
        })),
        abi: "erc20:balanceOf",
        block
      })
    ).output;

    const v2Data = balanceOfUnderlying.map((underlying, index) => {
      const address = underlying.input.target
      return {
        aToken: v2Atokens[index],
        underlying: address,
        symbol: addressSymbolMapping[address].symbol,
        decimals: addressSymbolMapping[address].decimals,
        balance: underlying.output,
      };
    })

    return v2Data
  }

  async function getV2Rates(block) {
    const addressesProviders = (
      await sdk.api.abi.call({
        target: addressesProviderRegistry,
        abi: abi["getAddressesProvidersList"],
        block
      })
    ).output;

    const protocolDataHelpers = (
      await sdk.api.abi.multiCall({
        calls: _.map(addressesProviders, (provider) => ({
          target: provider,
          params: "0x0100000000000000000000000000000000000000000000000000000000000000",
        })),
        abi: abi["getAddress"],
        block
      })
    ).output;

    const reserveData = (
      await sdk.api.abi.multiCall({
        calls: _.map(v2ReserveTokens, (reserve) => ({
          target: protocolDataHelpers[0].output,
          params: reserve,
        })),
        abi: abi["getReserveDataV2"],
        block
      })
    ).output

    let ratesData = { lend: {}, borrow: {}, supply: {}, borrow_stable: {} };

    reserveData.map(result => {
      if (!result || !result.success) return;
      const address = result.input.params[0]
      const reserveDetails = addressSymbolMapping[address]
      const symbol = reserveDetails.symbol + "_V2";
      const details = result.output;

      const outStandingBorrows = BigNumber(details.totalStableDebt)
        .plus(BigNumber(details.totalVariableDebt))
        .div(10 ** reserveDetails.decimals)
        .toFixed();
      const lendRate = BigNumber(details.liquidityRate)
        .div(10 ** 25)
        .toFixed();
      const borrowRate = BigNumber(details.variableBorrowRate)
        .div(10 ** 25)
        .toFixed();
      const borrowStableRate = BigNumber(details.stableBorrowRate)
        .div(10 ** 25)
        .toFixed();

      ratesData.lend[symbol] = lendRate;
      ratesData.borrow[symbol] = borrowRate;
      ratesData.borrow_stable[symbol] = borrowStableRate;
      ratesData.supply[symbol] = outStandingBorrows;
    })

    return ratesData
  }

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    // V1 TVLs
    await getV1Reserves(block)
    let balances = await _multiMarketV1Tvl(aaveLendingPoolCore, aaveReserves, block);

    const uniswapMarketTvlBalances = await _multiMarketV1Tvl(
      uniswapLendingPoolCore,
      uniswapReserves,
      block
    );

    // ...add v1 uniswap market TVL
    Object.keys(uniswapMarketTvlBalances).forEach(address => {
      if (balances[address]) {
        balances[address] = BigNumber(
          balances[address]
        ).plus(uniswapMarketTvlBalances[address]).toFixed();
      } else {
        balances[address] = uniswapMarketTvlBalances[address];
      }
    });

    // Staking TVLs
    if (block >= 10926829) {
      const stakedAaveAmount = await _stakingTvl(block);
      balances[aaveTokenAddress] = balances[aaveTokenAddress]
        ? BigNumber(balances[aaveTokenAddress]).plus(stakedAaveAmount).toFixed()
        : BigNumber(stakedAaveAmount).toFixed()

      const stakedBalancerAmounts = await _stakingBalancerTvl(block);
      Object.keys(stakedBalancerAmounts).forEach((address) => {
        balances[address] = balances[address]
          ? BigNumber(balances[address])
              .plus(stakedBalancerAmounts[address])
              .toFixed()
          : BigNumber(stakedBalancerAmounts[address]).toFixed();
      });
    }

    // V2 TVLs
    if (block >= 11360925) {
      await getV2Reserves(block)
      const v2Tvl = await getV2Tvl(block);
      v2Tvl.map(data => {
        if (balances[data.underlying]) {
          balances[data.underlying] = BigNumber(balances[data.underlying])
            .plus(data.balance)
            .toFixed();
        } else {
          balances[data.underlying] = data.balance;
        }
      })
    }

    return balances;
  }

/*==================================================
  Rates
  ==================================================*/

  async function rates(timestamp, block) {
    await getV1Reserves(block)
    const aaveReservesWithEth = aaveReserves
    aaveReservesWithEth.push({
      address: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
      symbol: "ETH",
      decimals: 18,
    });

    const ratesV1 = await _multiMarketV1Rates(aaveLendingPool, aaveReserves, block)

    await getV2Reserves(block)
    const ratesV2 = await getV2Rates(block)

    if (Object.keys(ratesV2.lend).length > 0) {
      return {
        lend: { ...ratesV1.lend, ...ratesV2.lend },
        borrow: { ...ratesV1.borrow, ...ratesV2.borrow },
        borrow_stable: { ...ratesV1.borrow_stable, ...ratesV2.borrow_stable },
        supply: { ...ratesV1.supply, ...ratesV2.supply },
      };
    } else {
      return ratesV1
    }
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: "Aave",
    website: "https://aave.com",
    token: "AAVE",
    category: "lending",
    start: 1578355200, // 01/07/2020 @ 12:00am (UTC)
    tvl,
    rates,
    term: "1 block",
    variability: "medium",
  };
