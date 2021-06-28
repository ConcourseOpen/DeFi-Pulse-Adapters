module.exports = {
    /* Project Metadata */
    name: 'Alchemix',         // Alchemix
    token: 'ALCX',            // ALCX token
    category: 'Lending',      // Allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1614418082,        // Feb-27-2021 04:28:02 AM +UTC
    /* required for fetching token balances */
    tokenHolderMap: [
      {
        tokens: [
          '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
          '0x19D3364A399d251E894aC732651be8B0E4e85001', // yvDAI
          '0x6c3F90f043a72FA612cbac8115EE7e52BDe6E490', // 3Crv
          '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
          '0xBC6DA0FE9aD5f3b0d58160288917AA56653660E9', // alUSD
          '0xdBdb4d16EdA451D0503b854CF79D55697F90c8DF', // ALCX
          '0xa258c4606ca8206d8aa700ce2143d7db854d168c', // yvWETH
        ],
        holders: [

          // alUSD
          '0xc21D353FF4ee73C572425697f4F5aaD2109fe35b', // Alchemist
          '0x014dE182c147f8663589d77eAdB109Bf86958f13', // YearnVaultAdapter
          '0xaB7A49B971AFdc7Ee26255038C82b4006D122086', // Transmuter
          '0xf3cFfaEEa177Db444b68FB6f033d4a82f6D8C82d', // TransmuterB
          '0x491EAFC47D019B44e13Ef7cC649bbA51E15C61d7', // TransmuterVaultAdapter

          // alETH
          '0x6B566554378477490ab040f6F757171c967D03ab', // AlchemistEth
          '0xEBA649E0010818Aa4321088D34bD6162d65E7971', // YearnVaultAdapterEth
          '0x45f81eF5F2ae78f49851f7A62e4061FF54Ff674B', // TransmuterEth
          '0x54dc35eb8c2E2E20f3657Af6F84cd9949C08CF38', // TransmuterEthYearnVaultAdapter
          
          // Uncomment this to include the alUSD-3crv pool
          //'0x43b4FdFD4Ff969587185cDB6f0BD875c5Fc83f8c', // alUSD3CRV-f

          // Uncomment this to include the ALCX-WETH pool
          //'0xC3f279090a47e80990Fe3a9c30d24Cb117EF91a8', // ALCX-WETH SLP

          // Uncomment this to include staked alUSD and staked ALCX
          //'0xAB8e74017a8Cc7c15FFcCd726603790d26d7DeCa', // StakingPools
        ],
        checkETHBalance: true,
      }
    ],
  };
  