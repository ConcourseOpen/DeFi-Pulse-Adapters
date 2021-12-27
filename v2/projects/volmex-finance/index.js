module.exports = {
    /* Project Metadata */
    name: 'Volmex Finance', // project name
    token: null, // null, or token symbol if project has a custom token
    category: 'Derivatives', // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1623344178, // June 10, 2021 04:56:18 PM +UTC (ETHV)
    /* required for fetching token balances */
    tokenHolderMap: [
      {
        tokens: [
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',  // USDC
          '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // DAI
        ],
        holders: [
          '0xa57fC404f69fCE71CA26e26f0A4DF7F35C8cd5C3', // ETHV DAI
          '0x187922d4235D10239b2c6CCb2217aDa724F56DDA', // BTCV DAI
          '0x1BB632a08936e17Ee3971E6Eeb824910567e120B', // ETHV USDC
          '0x054FBeBD2Cb17205B57fb56a426ccc54cAaBFaBC'  // BTCV USDC
        ],
      },
    ],
  };
