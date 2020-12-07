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
    'fTUSD':         {underlying: 'TUSD', decimals: 18, contract: '0x7674622c63Bee7F46E86a4A5A18976693D54441b', created: 10997721 },
    'fDAIv0':        {underlying: 'DAI',  decimals: 18, contract: '0xe85C8581e60D7Cd32Bbfd86303d2A4FA6a951Dac', created: 10770103 },
    'fWBTCv0':       {underlying: 'WBTC', decimals: 8,  contract: '0xc07EB91961662D275E2D285BdC21885A4Db136B0', created: 10802976 },
    'fRENBTCv0':     {underlying: 'RENBTC', decimals: 8, contract: '0xfBe122D0ba3c75e1F7C80bd27613c9f35B81FEeC', created: 10802986 },
    'fCRV-RENWBTCv0': {underlying: 'CRVRENWBTC', decimals: 18, contract: '0x192E9d29D43db385063799BC239E772c3b6888F3', created: 10815917 },
    'fUNI-DAI:WETHv0':  {underlying: 'UNI-DAI:WETH', decimals: 18, contract: '0x1a9F22b4C385f78650E7874d64e442839Dc32327', created: 10883048, type:'UNI' },
    'fUNI-USDC:WETHv0': {underlying: 'UNI-USDC:WETH', decimals: 18, contract: '0x63671425ef4D25Ec2b12C7d05DE855C143f16e3B', created: 10883030, type:'UNI' },
    'fUNI-WETH:USDTv0': {underlying: 'UNI-WETH:USDT', decimals: 18, contract: '0xB19EbFB37A936cCe783142955D39Ca70Aa29D43c', created: 10883026, type:'UNI' },
    'fUNI-WBTC:WETHv0': {underlying: 'UNI-WBTC:WETH', decimals: 18, contract: '0xb1FeB6ab4EF7d0f41363Da33868e85EB0f3A57EE', created: 10883054, type:'UNI' },
    'fUNI-DAI:WETH':    {underlying: 'UNI-DAI:WETH', decimals: 18, contract: '0x307E2752e8b8a9C29005001Be66B1c012CA9CDB7', created: 11041674, type:'UNI' },
    'fUNI-USDC:WETH':   {underlying: 'UNI-USDC:WETH', decimals: 18, contract: '0xA79a083FDD87F73c2f983c5551EC974685D6bb36', created: 11041667, type:'UNI' },
    'fUNI-WETH:USDT':   {underlying: 'UNI-WETH:USDT', decimals: 18, contract: '0x7DDc3ffF0612E75Ea5ddC0d6Bd4e268f70362Cff', created: 11011433, type:'UNI' },
    'fUNI-WBTC:WETH':   {underlying: 'UNI-WBTC:WETH', decimals: 18, contract: '0x01112a60f427205dcA6E229425306923c3Cc2073', created: 11041683, type:'UNI' },
    'fUNI-DPI:WETH':    {underlying: 'UNI-DPI:WETH', decimals: 18, contract: '0x2a32dcBB121D48C106F6d94cf2B4714c0b4Dfe48', created: 11374134, type:'UNI' },
    'fWETH':         {underlying: 'WETH',   decimals: 18, contract: '0xFE09e53A81Fe2808bc493ea64319109B5bAa573e', created: 11086824 },
    'fUSDC':         {underlying: 'USDC',   decimals: 6,  contract: '0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE', created: 11086842 },
    'fUSDT':         {underlying: 'USDT',   decimals: 6,  contract: '0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C', created: 11086849 },
    'fDAI':          {underlying: 'DAI',    decimals: 18, contract: '0xab7FA2B2985BCcfC13c6D86b1D5A17486ab1e04C', created: 11086832 },
    'fWBTC':         {underlying: 'WBTC',   decimals: 8,  contract: '0x5d9d25c7C457dD82fc8668FFC6B9746b674d4EcB', created: 11068089 },
    'fRENBTC':       {underlying: 'RENBTC', decimals: 8, contract: '0xC391d1b08c1403313B0c28D47202DFDA015633C4', created: 11086855 },
    'fCRV-RENWBTC':  {underlying: 'CRVRENWBTC', decimals: 18, contract: '0x9aA8F427A17d6B0d91B6262989EdC7D45d6aEdf8', created: 11086865 },
    'fCRV-TBTC':  {underlying: 'CRV-TBTC',  decimals: 18, contract: '0x640704D106E79e105FDA424f05467F005418F1B5', created: 11230944 },
    'fCRV-HBTC':  {underlying: 'CRV-HBTC',  decimals: 18, contract: '0xCC775989e76ab386E9253df5B0c0b473E22102E2', created: 11380817 },
    'fCRV-HUSD':  {underlying: 'CRV-HUSD',  decimals: 18, contract: '0x29780C39164Ebbd62e9DDDE50c151810070140f2', created: 11380823 },
    'fCRV-BUSD':  {underlying: 'CRV-BUSD',  decimals: 18, contract: '0x4b1cBD6F6D8676AcE5E412C78B7a59b4A1bbb68a', created: 11257802 },
    'fCRV-COMP':  {underlying: 'CRV-COMP',  decimals: 18, contract: '0x998cEb152A42a3EaC1f555B1E911642BeBf00faD', created: 11257781 },
    'fCRV-USDN':  {underlying: 'CRV-USDN',  decimals: 18, contract: '0x683E683fBE6Cf9b635539712c999f3B3EdCB8664', created: 11257784 }, 
    'fCRV-YPOOL': {underlying: 'CRV-YPOOL', decimals: 18, contract: '0x0FE4283e0216F94f5f9750a7a11AC54D3c9C38F3', created: 11152258 },
    'fCRV-3POOL': {underlying: 'CRV-3POOL', decimals: 18, contract: '0x71B9eC42bB3CB40F017D8AD8011BE8e384a95fa5', created: 11159005 },
    'fSUSHI-WBTC:TBTC': {underlying: 'SUSHI-WBTC:TBTC', decimals: 18, contract: '0xF553E1f826f42716cDFe02bde5ee76b2a52fc7EB', created: 11036219 },
    'fSUSHI-WBTC:WETH': {underlying: 'SUSHI-WBTC:WETH', decimals: 18, contract: '0x5C0A3F55AAC52AA320Ff5F280E77517cbAF85524', created: 11269739 },
    'fSUSHI-USDC:WETH': {underlying: 'SUSHI-USDC:WETH', decimals: 18, contract: '0x01bd09A1124960d9bE04b638b142Df9DF942b04a', created: 11269722 },
    'fSUSHI-WETH:USDT': {underlying: 'SUSHI-WETH:USDT', decimals: 18, contract: '0x64035b583c8c694627A199243E863Bb33be60745', created: 11269716 },
    'fSUSHI-DAI:WETH':  {underlying: 'SUSHI-DAI:WETH',  decimals: 18, contract: '0x203E97aa6eB65A1A02d9E80083414058303f241E', created: 11269733 },
  };

  const uniPools = {
    'UNI-DAI:WETH': {contract: '0xA478c2975Ab1Ea89e8196811F51A7B7Ade33eB11', created: 10042267,
                    token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'UNI-USDC:WETH': {contract: '0xB4e16d0168e52d35CaCD2c6185b44281Ec28C9Dc', created: 10008355,
                    token0: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'UNI-WETH:USDT': {contract: '0x0d4a11d5EEaaC28EC3F61d100daF4d40471f1852', created: 10093341,
                    token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    'UNI-WBTC:WETH': {contract: '0xBb2b8038a1640196FbE3e38816F3e67Cba72D940', created: 10091097,
                    token0: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'UNI-DPI:WETH': {contract: '0x4d5ef58aAc27d99935E5b6B4A6778ff292059991', created: 10836224,
                    token0: '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'SUSHI-WBTC:TBTC': {contract: '0x2Dbc7dD86C6cd87b525BD54Ea73EBeeBbc307F68', created: 10994541,
                    token0: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', token1: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa' },
    'SUSHI-DAI:WETH': {contract: '0xC3D03e4F041Fd4cD388c549Ee2A29a9E5075882f', created: 0,
                    token0: '0x6B175474E89094C44Da98b954EedeAC495271d0F', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'SUSHI-USDC:WETH': {contract: '0x397FF1542f962076d0BFE58eA045FfA2d347ACa0', created: 0,
                    token0: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
    'SUSHI-WETH:USDT': {contract: '0x06da0fd433C1A5d7a4faa01111c044910A184553', created: 0,
                    token0: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', token1: '0xdAC17F958D2ee523a2206206994597C13D831ec7' },
    'SUSHI-WBTC:WETH': {contract: '0xCEfF51756c56CeFFCA006cD410B03FFC46dd3a58', created: 0,
                    token0: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', token1: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' },
  };

  async function tvl(timestamp, block) {
    const promises = [
      getUnderlying('fWETHv0',block),                 // 0
      getUnderlying('fDAIv0',block),
      getUnderlying('fUSDCv0',block),
      getUnderlying('fUSDTv0',block),
      getUnderlying('fTUSD',block),
      getUnderlying('fWBTCv0',block),                 // 5
      getUnderlying('fRENBTCv0',block),
      getUnderlying('fCRV-RENWBTCv0',block),
      getUniswapUnderlying('fUNI-DAI:WETHv0',block),
      getUniswapUnderlying('fUNI-USDC:WETHv0',block),
      getUniswapUnderlying('fUNI-WETH:USDTv0',block), // 10
      getUniswapUnderlying('fUNI-WBTC:WETHv0',block),
      getUniswapUnderlying('fUNI-DAI:WETH',block),
      getUniswapUnderlying('fUNI-USDC:WETH',block),
      getUniswapUnderlying('fUNI-WETH:USDT',block),
      getUniswapUnderlying('fUNI-WBTC:WETH',block),   // 15
      getUnderlying('fWETH',block),
      getUnderlying('fDAI',block),
      getUnderlying('fUSDC',block),
      getUnderlying('fUSDT',block),
      getUnderlying('fWBTC',block),                   // 20
      getUnderlying('fRENBTC',block),
      getUnderlying('fCRV-RENWBTC',block),
      getUniswapUnderlying('fSUSHI-WBTC:TBTC',block),
      getUniswapUnderlying('fSUSHI-DAI:WETH',block),
      getUniswapUnderlying('fSUSHI-USDC:WETH',block), // 25
      getUniswapUnderlying('fSUSHI-WETH:USDT',block),
      getUniswapUnderlying('fSUSHI-WBTC:WETH',block),
      getUniswapUnderlying('fUNI-DPI:WETH',block),
      getUnderlying('fCRV-HBTC',block),
      getUnderlying('fCRV-HUSD',block),               // 30
      getUnderlying('fCRV-BUSD',block),
      getUnderlying('fCRV-COMP',block),
      getUnderlying('fCRV-USDN',block),
      getUnderlying('fCRV-YPOOL',block),
      getUnderlying('fCRV-3POOL',block),              // 35
      getUnderlying('fCRV-TBTC',block),
    ];

    let results = await Promise.all(promises);

    let balances = {
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2':                         // asset: WETH
	      BigNumber(results[0])                                         // fWETHv0
	      .plus(BigNumber(results[16]))                                 // fWETH
              .plus(BigNumber(results[8][1]))                               // fUNI-DAI:WETHv0
	      .plus(BigNumber(results[9][1]))                               // fUNI-USDC:WETHv0
	      .plus(BigNumber(results[10][0]))                              // fUNI-WETH:USDTv0
	      .plus(BigNumber(results[11][1]))                              // fUNI-WBTC:WETHv0
              .plus(BigNumber(results[12][1]))                              // fUNI-DAI:WETH
	      .plus(BigNumber(results[13][1]))                              // fUNI-USDC:WETH
	      .plus(BigNumber(results[14][0]))                              // fUNI-WETH:USDT
	      .plus(BigNumber(results[15][1]))                              // fUNI-WBTC:WETH
              .plus(BigNumber(results[24][1]))                              // fSUSHI-DAI:WETH
	      .plus(BigNumber(results[25][1]))                              // fSUSHI-USDC:WETH
	      .plus(BigNumber(results[26][0]))                              // fSUSHI-WETH:USDT
	      .plus(BigNumber(results[27][1]))                              // fSUSHI-WBTC:WETH
	      .plus(BigNumber(results[28][1]))                              // fSUSHI-DPI:WETH
              .toFixed(0), // 18 decimals
      '0x6B175474E89094C44Da98b954EedeAC495271d0F':                         // asset: DAI
	      BigNumber(results[1])                                         // fDAIv0
	      .plus(results[17])                                            // fDAI
              .plus(results[8][0])                                          // fUNI-DAI:WETHv0
              .plus(results[12][0])                                         // fUNI-DAI:WETH
              .plus(BigNumber(results[24][0]))                              // fSUSHI-DAI:WETH
	      .toFixed(0), // 18 decimals
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48':                         // asset: USDC
	      BigNumber(results[2])                                         // fUSDCv0
	      .plus(results[18])                                            // fUSDC
              .plus(results[9][0])                                          // fUNI-USDC:WETHv0
              .plus(results[13][0])                                         // fUNI-USDC:WETH
	      .plus(BigNumber(results[25][0]))                              // fSUSHI-USDC:WETH
	      .plus(BigNumber(results[32]))                                 // fCRV-COMP, estimate
	      .plus(BigNumber(results[34]))                                 // fCRV-YPOOL, estimate
	      .plus(BigNumber(results[35]))                                 // fCRV-3POOl, estimate
	      .toFixed(0), // 6 decimals
      '0xdAC17F958D2ee523a2206206994597C13D831ec7':                         // asset: USDT
	      BigNumber(results[3])                                         // fUSDTv0
	      .plus(BigNumber(results[19]))                                 // fUSDT
              .plus(BigNumber(results[10][1]))                              // fUNI-WETH:USDTv0
              .plus(BigNumber(results[14][1]))                              // fUNI-WETH:USDT
	      .plus(BigNumber(results[26][1]))                              // fSUSHI-WETH:USDT
	      .toFixed(0), // 6 decimals
      '0x0000000000085d4780B73119b644AE5ecd22b376':                         // asset: TUSD
	      BigNumber(results[4])                                         // fTUSD
	      .toFixed(0), // 18 decimals
      '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599':                         // asset: WBTC
	      BigNumber(results[5])                                         // fWBTCv0
	      .plus(BigNumber(results[20]))                                 // fWBTC
              .plus(BigNumber(results[11][0]))                              // fUNI-WBTC:WETHv0
              .plus(BigNumber(results[15][0]))                              // fUNI-WBTC:WETH
              .plus(BigNumber(results[23][0]))                              // fSUSHI-WBTC:TBTC
	      .plus(BigNumber(results[27][0]))                              // fSUSHI-WBTC:WETH
	      .toFixed(0), // 8 decimals
      '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D':                         // asset: renBTC
	      BigNumber(results[6])                                         // fRENBTCv0
              .plus(BigNumber(results[21]))                                 // fRENBTC
              .plus(BigNumber(results[7]).times(BigNumber("10").pow(-10)))  // fCRV-RENWBTCv0, estimate
              .plus(BigNumber(results[22]).times(BigNumber("10").pow(-10))) // fCRV-RENWBTC, estimate
	      .toFixed(0), // 8 decimals
      '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa':                         // asset: TBTC
              BigNumber(results[23][1])                                     // fSUSHI-WBTC:TBTC SUSHI
	      .plus(BigNumber(results[36]))                                 // fCRV-TBTC, estimate
              .toFixed(0), // 18 decimals
      '0xdF574c24545E5FfEcb9a659c229253D4111d87e1':                         // asset: HUSD
	      BigNumber(results[30]).times(BigNumber("10").pow(-10))        // fCRV-HUSD, estimate
	      .toFixed(0), // 8 decimals
      '0x4fabb145d64652a948d72533023f6e7a623c7c53':                         // asset: BUSD
	      BigNumber(results[31])                                        // fCRV-BUSD, estimate
	      .toFixed(0), // 18 decimals
      '0x0316EB71485b0Ab14103307bf65a021042c6d380':                         // asset: HBTC
	      BigNumber(results[29])                                        // fCRV-HBTC, estimate
	      .toFixed(0), // 18 decimals
      '0x1494CA1F11D487c2bBe4543E90080AeBa4BA3C2b':                         // asset: DPI
	      BigNumber(results[28][0])                                     // fSUSHI-DPI:WETH
              .toFixed(0), // 18 decimals
      // TODO don't attribute CRV pools 1:1, factor virtualprice
      // TODO don't attribute all of CRV-RENWBTC to renBTC
      // TODO don't attribute all of CRV-TBTC to TBTC
      // TODO don't attribute all of CRV-YPOOL to USDC
      // TODO don't attribute all of CRV-3POOL to USDC
      // TODO don't attribute all of CRV-COMP to USDC
      // TODO don't attribute all of CRV-HUSD to HUSD
      // TODO don't attribute all of CRV-BUSD to BUSD
      // TODO don't attribute all of CRV-HBTC to HBTC
    };
    console.table(balances);
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
	else {
          // if shareprice is ERROR, assume shareprice is 1
	  return fBalance;
	}
      } catch (error) { return 0 }
      // if shareprice unavailable, assume shareprice is 0
    }
    return 0;
  }

  async function getUniswapUnderlying(token,block) {
    if (block > fTokens[token].created) {
      const underlyingPool = uniPools[fTokens[token].underlying];
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
	if (!poolSharePrice.isEqualTo(ERROR)) {
          let poolFraction = poolBalance.times(poolSharePrice).div(poolUnderlyingUnit).div(poolUnderlyingBalance);
          if (!poolFraction.isNaN()) {
            return [ poolFraction.times(poolUnderlyingReservesToken0), poolFraction.times(poolUnderlyingReservesToken1) ];
          }
	}
	else {
        // if shareprice is ERROR, assume shareprice is 1
          let poolFraction = poolBalance.div(poolUnderlyingBalance);
          if (!poolFraction.isNaN()) {
            return [ poolFraction.times(poolUnderlyingReservesToken0), poolFraction.times(poolUnderlyingReservesToken1) ];
          }
	}
      } catch (error) { return [0, 0] } // if shareprice unavailable, assume shareprice is 0
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
