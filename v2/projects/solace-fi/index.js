/**
*
* Project: solace.fi
* Chain: Ethereum
* Tech Lead: Andrew | Solace#4854 @SolaceAndrew andrew@solace.fi leonardishere
* Docs: https://docs.solace.fi/ https://github.com/solace-fi
*/

module.exports = {
    /* Project Metadata */
    name: 'solace.fi',
    token: 'SOLACE',
    category: 'Derivatives',
    start: 1638056715,
    /* Fetching token balances */
    tokenHolderMap: [
      {

        /* Tokens */
        tokens: [
            '0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40', // solace (SOLACE)
            '0x501AcE5aC3Af20F49D53242B6D208f3B91cfc411', // xsolace (SOLACE)
            '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
            '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2', // WETH
            '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', // USDC
            '0x9C051F8A6648a51eF324D30C235da74D060153aC', // SOLACE-USDC SLP
            '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', // WBTC
            '0xdAC17F958D2ee523a2206206994597C13D831ec7', // USDT
            '0x501AcEe83a6f269B77c167c6701843D454E2EFA0', // Solace SCP
        ],

        /* Contracts that hold value */
        holders: [
            '0x501AcE5aC3Af20F49D53242B6D208f3B91cfc411', // xSOLACE, holds users staked SOLACE
            '0x501AcE5FEe0337e13A442Cb5e15728EE0e8b3F29', // DAI bond teller, users deposit DAI and receive vested SOLACE or xSOLACE
            '0x501ace68E20c29629E690D86E54E79719e2Fc5e8', // ETH bond teller
            '0x501aCE044AE4E11183026659EE3B0E3b0Df04d7F', // USDC bond teller
            '0x501acEb253483BD58773365334DEf095304CddAE', // SOLACE-USDC bond teller
            '0x501aCE2f3b5B8f645E67556Df77ac4c3081D84C7', // WBTC bond teller
            '0x501acE6061D6176Da12FCBa36Bc85B2fc3FFd5e3', // USDT bond teller
            '0x501aCE163FfaCDa6584D75b274eD23155BFf4812', // SCP bond teller
            '0x501AcEe83a6f269B77c167c6701843D454E2EFA0', // Vault (V1 underwriting pool, in process of being deprecated)
            '0x501ACeb4D4C2CB7E4b07b53fbe644f3e51D25A3e', // CP Farm, rewards users for providing ETH to Vault (being deprecated)
            '0x5efC0d9ee3223229Ce3b53e441016efC5BA83435', // V2 underwriting pool, pays out claims,0x5efC0d9ee3223229Ce3b53e441016efC5BA83435, // V2 underwriting pool, pays out claims,0x5efC0d9ee3223229Ce3b53e441016efC5BA83435, // V2 underwriting pool
        ],
        checkNativeBalance: true, // Boolean
      },
    ],
  };
