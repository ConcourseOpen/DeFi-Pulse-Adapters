module.exports = {
    /* Project Metadata */
    name: 'Premia',         // Premia
    token: 'PREMIA',            // PREMIA token
    category: 'Derivatives',      // Allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1612272689,        // Feb-02-2021 08:31:29 AM +UTC
    /* required for fetching token balances */
    tokenHolderMap: [
      {
        tokens: [
          '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', // AAVE
          '0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF', // ALCX
          '0x3472A5A71965499acd81997a54BBA8D852C6E53d', // BADGER
          '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
          '0x4688a8b1f292fdab17e9a90c8bc379dc1dbd8713', // COVER
          '0xD533a949740bb3306d119CC777fa900bA034cd52', // CRV
          '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
          '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b', // DPI
          '0x514910771af9ca656af840dff83e8264ecf986ca', // LINK
          '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2', // MKR
          '0x6399c842dd2be3de30bf99bc7d1bbf6fa3650e70', // PREMIA
          '0x408e41876cccdc0f92210600ef50372656052a38', // REN
          '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f', // SNX
          '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', // SUSHI
          '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
          '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', // WBTC
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
          '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', // YFI
        ],
        holders: [
          '0xcb81dB76Ae0a46c6e1E378E3Ade61DaB275ff96E', // premiaMaker
          '0x45eBD0FC72E2056adb5c864Ea6F151ad943d94af', // premiaMarket
          '0x5920cb60B1c62dC69467bf7c6EDFcFb3f98548c0', // premiaOption

          // Uncomment this to include the premia staking pool
          //'0x16f9D564Df80376C61AC914205D3fDfF7057d610', // premiaStaking

          // Uncomment this to include the locked xPremia pool
          //'0xF5aae75D1AD6fDD62Cce66137F2674c96FEda854', // premiaFeeDiscount
        ],
        checkETHBalance: true,
      }
    ],
  };
