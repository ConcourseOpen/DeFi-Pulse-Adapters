module.exports = {
    /* Project Metadata */
    name: 'volmex.finance', // project name
    token: null, // null, or token symbol if project has a custom token
    chain: 'polygon',
    category: 'Derivatives', // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
    start: 1626263484,
    /* required for fetching token balances */
    tokenHolderMap: [
        {
          tokens: [
            '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',  // USDC
            '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',  // DAI
          ],
          holders: [
            '0x164c668204Ce54558431997A6DD636Ee4E758b19', // ETHV DAI
            '0x90E6c403c02f72986a98E8a361Ec7B7C8BC29259', // BTCV DAI
            '0xEeb6f0C2261E21b657A27582466e5aD9acC072D7', // ETHV USDC
            '0xA2b3501d34edA289F0bEF1cAf95E5D0111032F36'  // BTCV USDC
          ],
        },
      ],
    };
  