/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const abi = require('./abi.json');
  const BigNumber = require('bignumber.js');
  const ERROR = BigNumber("3963877391197344453575983046348115674221700746820753546331534351508065746944")

/*==================================================
  TVL
  ==================================================*/

  const fTokens = {
    'fWETHv0':       {underlying: 'WETH', decimals: 18, contract: '0x8e298734681adbfC41ee5d17FF8B0d6d803e7098', created: 10861886 },
    'fUSDCv0':       {underlying: 'USDC', decimals: 6,  contract: '0xc3F7ffb5d5869B3ade9448D094d81B0521e8326f', created: 10770105 },
    'fUSDTv0':       {underlying: 'USDT', decimals: 6,  contract: '0xc7EE21406BB581e741FBb8B21f213188433D9f2F', created: 10770108 },
    'fTUSD':       {underlying: 'TUSD', decimals: 18, contract: '0x7674622c63Bee7F46E86a4A5A18976693D54441b', created: 10997721 },
    'fDAIv0':        {underlying: 'DAI',  decimals: 18, contract: '0xe85C8581e60D7Cd32Bbfd86303d2A4FA6a951Dac', created: 10770103 },
    'fWBTCv0':       {underlying: 'WBTC', decimals: 8,  contract: '0xc07EB91961662D275E2D285BdC21885A4Db136B0', created: 10802976 },
    'fRENBTCv0':     {underlying: 'RENBTC', decimals: 8, contract: '0xfBe122D0ba3c75e1F7C80bd27613c9f35B81FEeC', created: 10802986 },
    'fCRVRENWBTCv0': {underlying: 'CRVRENWBTC', decimals: 18, contract: '0x192E9d29D43db385063799BC239E772c3b6888F3', created: 10815917 },
    'fUNI_ETH-DAI_v0': {underlying: 'UNI_ETH-DAI', decimals: 18, contract: '0x1a9F22b4C385f78650E7874d64e442839Dc32327', created: 10883048, type:'UNI' },
    'fUNI_ETH-USDC_v0': {underlying: 'UNI_ETH-USDC', decimals: 18, contract: '0x63671425ef4D25Ec2b12C7d05DE855C143f16e3B', created: 10883030, type:'UNI' },
    'fUNI_ETH-USDT_v0': {underlying: 'UNI_ETH-USDT', decimals: 18, contract: '0xB19EbFB37A936cCe783142955D39Ca70Aa29D43c', created: 10883026, type:'UNI' },
    'fUNI_ETH-WBTC_v0': {underlying: 'UNI_ETH-WBTC', decimals: 18, contract: '0xb1FeB6ab4EF7d0f41363Da33868e85EB0f3A57EE', created: 10883054, type:'UNI' },
    'fUNI_ETH-DAI': {underlying: 'UNI_ETH-DAI', decimals: 18, contract: '0x307E2752e8b8a9C29005001Be66B1c012CA9CDB7', created: 11041674, type:'UNI' },
    'fUNI_ETH-USDC': {underlying: 'UNI_ETH-USDC', decimals: 18, contract: '0xA79a083FDD87F73c2f983c5551EC974685D6bb36', created: 11041667, type:'UNI' },
    'fUNI_ETH-USDT': {underlying: 'UNI_ETH-USDT', decimals: 18, contract: '0x7DDc3ffF0612E75Ea5ddC0d6Bd4e268f70362Cff', created: 11011433, type:'UNI' },
    'fUNI_ETH-WBTC': {underlying: 'UNI_ETH-WBTC', decimals: 18, contract: '0x01112a60f427205dcA6E229425306923c3Cc2073', created: 11041683, type:'UNI' },
    'fWETH':       {underlying: 'WETH', decimals: 18, contract: '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e', created: 11086824 },
    'fUSDC':       {underlying: 'USDC', decimals: 6,  contract: '0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE', created: 11086842 },
    'fUSDT':       {underlying: 'USDT', decimals: 6,  contract: '0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C', created: 11086849 },
    'fDAI':        {underlying: 'DAI',  decimals: 18, contract: '0xab7FA2B2985BCcfC13c6D86b1D5A17486ab1e04C', created: 11086832 },
    'fWBTC':       {underlying: 'WBTC', decimals: 8,  contract: '0x5d9d25c7C457dD82fc8668FFC6B9746b674d4EcB', created: 11068089 },
    'fRENBTC':     {underlying: 'RENBTC', decimals: 8, contract: '0xC391d1b08c1403313B0c28D47202DFDA015633C4', created: 11086855 },
    'fCRVRENWBTC': {underlying: 'CRVRENWBTC', decimals: 18, contract: '0x9aA8F427A17d6B0d91B6262989EdC7D45d6aEdf8', created: 11086865 },
    'fSUSHI_WBTC-TBTC': {underlying: 'SUSHI_WBTC-TBTC', decimals: 18, contract: '0xF553E1f826f42716cDFe02bde5ee76b2a52fc7EB', created: 11036219 },
  };

  const uniPools = {
    'UNI_ETH-DAI': {contract: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11', created: 10042267,
                    token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'UNI_ETH-USDC': {contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc', created: 10008355,
                    token0: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'UNI_ETH-USDT': {contract: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852', created: 10093341,
                    token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    'UNI_ETH-WBTC': {contract: '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940', created: 10091097,
                    token0: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'SUSHI_WBTC-TBTC': {contract: '0x2Dbc7dD86C6cd87b525BD54Ea73EBeeBbc307F68', created: 10994541,
                    token0: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', token1: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa' },
  };

  async function tvl(timestamp, block) {
    const promises = [
      getUnderlying('fWETHv0',block),
      getUnderlying('fDAIv0',block),
      getUnderlying('fUSDCv0',block),
      getUnderlying('fUSDTv0',block),
      getUnderlying('fTUSD',block),
      getUnderlying('fWBTCv0',block),
      getUnderlying('fRENBTCv0',block),
      getUnderlying('fCRVRENWBTCv0',block),
      getUniswapUnderlying('fUNI_ETH-DAI_v0',block),
      getUniswapUnderlying('fUNI_ETH-USDC_v0',block),
      getUniswapUnderlying('fUNI_ETH-USDT_v0',block),
      getUniswapUnderlying('fUNI_ETH-WBTC_v0',block),
      getUniswapUnderlying('fUNI_ETH-DAI',block),
      getUniswapUnderlying('fUNI_ETH-USDC',block),
      getUniswapUnderlying('fUNI_ETH-USDT',block),
      getUniswapUnderlying('fUNI_ETH-WBTC',block),
      getUnderlying('fWETH',block),
      getUnderlying('fDAI',block),
      getUnderlying('fUSDC',block),
      getUnderlying('fUSDT',block),
      getUnderlying('fWBTC',block),
      getUnderlying('fRENBTC',block),
      getUnderlying('fCRVRENWBTC',block),
      getUniswapUnderlying('fSUSHI_WBTC-TBTC',block),
    ];

    let results = await Promise.all(promises);

    let balances = {
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': BigNumber(results[0]).plus(results[16])        // WETH
              .plus(results[8][1]).plus(results[9][1]).plus(results[10][0]).plus(results[11][1])   // WETH UNIv0
              .plus(results[12][1]).plus(results[13][1]).plus(results[14][0]).plus(results[15][1]) // WETH UNI
              .toFixed(18),
      '0x6B175474E89094C44Da98b954EedeAC495271d0F': BigNumber(results[1]).plus(results[17])        // DAI
              .plus(results[8][0])                                                    // DAI UNIv0
              .plus(results[12][0])                                                   // DAI UNI
	      .toFixed(18),
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': BigNumber(results[2]).plus(results[18])        // USDC
              .plus(results[9][0])                                                    // USDC UNIv0
              .plus(results[13][0])                                                   // USDC UNI
	      .toFixed(6),
      '0xdAC17F958D2ee523a2206206994597C13D831ec7': BigNumber(results[3]).plus(results[19])        // USDT
              .plus(results[10][1])                                                   // USDT UNIv0
              .plus(results[14][1])                                                   // USDT UNI
	      .toFixed(6),
      '0x0000000000085d4780B73119b644AE5ecd22b376': BigNumber(results[4])             // TUSD
	      .toFixed(18),
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': BigNumber(results[5]).plus(results[20])        // WBTC
              .plus(results[11][0])                                                   // WBTC UNIv0
              .plus(results[15][0])                                                   // WBTC UNI
              .plus(BigNumber(results[23][0]).times(BigNumber("10").pow(-10)))        // WBTC SUSHI
	      .plus(BigNumber(results[23][1]).times(BigNumber("10").pow(-10)))
	      .toFixed(8),                                                            // TBTC SUSHI
      '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D': BigNumber(results[6])             // RENBTCv0
              .plus(results[21])                                                      // RENBTC
              .plus(BigNumber(results[7]).times(BigNumber("10").pow(-10)))            // crvRENWBTCv0, estimate
              .plus(BigNumber(results[22]).times(BigNumber("10").pow(-10)))           // crvRENWBTC, estimate
	      .toFixed(8),
       // TODO attribute TBTC when supported
    };

    return balances;
  }

  async function getUnderlying(token, block) {
    if (block > fTokens[token].created) {
      const promises = [
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: 'erc20:totalSupply', }),
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: abi['fABISharePrice'], }),
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: abi['fABIUnderlyingUnit'], })
      ];

      try {
	let results = await Promise.all(promises);
        if (results.length === 0) {
          return 0;
        }

        let fBalance = BigNumber(results[0].output);
        let fSharePrice = BigNumber(results[1].output);
        let fUnderlyingUnit = BigNumber(results[2].output);

        if (!fSharePrice.isEqualTo(ERROR)) {
          return fBalance.times(fSharePrice).div(fUnderlyingUnit);
        }
      }
      catch {
        // if shareprice unavailable, assume shareprice is 1
        const abridged_promises = [
          sdk.api.abi.call({ block, target: fTokens[token].contract, abi: 'erc20:totalSupply', }),
        ];
	try {
          let abridged_results = await Promise.all(abridged_promises);
          if (abridged_results.length === 0) {
            return 0;
          }
          let fBalance = BigNumber(abridged_results[0].output);
          return fBalance;
        }
        catch { }
      }
    }
    return 0;
  }

  async function getUniswapUnderlying(token,block) {
    if (block > fTokens[token].created) {
      underlyingPool = uniPools[fTokens[token].underlying];
      const promises = [
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: 'erc20:totalSupply', }),
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: abi['fABISharePrice'], }),
        sdk.api.abi.call({ block, target: fTokens[token].contract, abi: abi['fABIUnderlyingUnit'], }),
        sdk.api.abi.call({ block, target: underlyingPool.contract, abi: 'erc20:totalSupply', }),
        sdk.api.abi.call({ block, target: underlyingPool.contract, abi: abi['uniABIReserves'], }),
      ];

      try {
        let results = await Promise.all(promises);
        if (results.length === 0) {
          return [0, 0];
        }

        let poolBalance = BigNumber(results[0].output);
        let poolSharePrice = BigNumber(results[1].output);
        let poolUnderlyingUnit = BigNumber(results[2].output);
        let poolUnderlyingBalance = BigNumber(results[3].output);
        let poolUnderlyingReservesToken0 = BigNumber(results[4].output[0]);
        let poolUnderlyingReservesToken1 = BigNumber(results[4].output[1]);
        let poolFraction = poolBalance.times(poolSharePrice).div(poolUnderlyingUnit).div(poolUnderlyingBalance);

        if (!poolFraction.isNaN() && !poolSharePrice.isEqualTo(ERROR)) {
          return [ poolFraction.times(poolUnderlyingReservesToken0), poolFraction.times(poolUnderlyingReservesToken1) ];
        }
      }
      catch {
        // if shareprice unavailable, assume shareprice is 1
        const abridged_promises = [
          sdk.api.abi.call({ block, target: fTokens[token].contract, abi: 'erc20:totalSupply', }),
          sdk.api.abi.call({ block, target: underlyingPool.contract, abi: 'erc20:totalSupply', }),
          sdk.api.abi.call({ block, target: underlyingPool.contract, abi: abi['uniABIReserves'], }),
        ];
	try {
          let abridged_results = await Promise.all(abridged_promises);
          if (abridged_results.length === 0) {
            return [0, 0];
          }
          let poolBalance = BigNumber(results[0].output);
          let poolUnderlyingBalance = BigNumber(results[1].output);
          let poolUnderlyingReservesToken0 = BigNumber(results[2].output[0]);
          let poolUnderlyingReservesToken1 = BigNumber(results[2].output[1]);
          let poolFraction = poolBalance.div(poolUnderlyingBalance);
          if ( !poolFraction.isNaN() ) {
            return [ poolFraction.times(poolUnderlyingReservesToken0), poolFraction.times(poolUnderlyingReservesToken1) ];
          }
        }
        catch { }
      }
    }
    return [0, 0];
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Harvest Finance', // project name
    website: 'https://harvest.finance',
    token: 'FARM',            // null, or token symbol if project has a custom token
    category: 'assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1598893200,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
    tvl                       // tvl adapter
  };
