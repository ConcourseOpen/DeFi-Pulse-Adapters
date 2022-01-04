/**
 * Project: solace.fi
 * Chain: Ethereum
 * Tech Lead: Andrew | Solace#4854 @SolaceAndrew andrew@solace.fi leonardishere
 * Docs:
 * - https://docs.solace.fi/
 * - https://github.com/solace-fi
 */

const ADDRESS = {
  ETH: "0x0000000000000000000000000000000000000000",
  SOLACE: "0x501acE9c35E60f03A2af4d484f49F9B1EFde9f40",
  // xSOLACE, holds users staked SOLACE
  XSOLACE: "0x501AcE5aC3Af20F49D53242B6D208f3B91cfc411",
  DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  WETH: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  WBTC: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
  USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  SOLACE_USDC_SLP: "0x9C051F8A6648a51eF324D30C235da74D060153aC",
  // Vault (V1 underwriting pool, in process of being deprecated)
  SOLACE_SCP_VAULT_V1: "0x501AcEe83a6f269B77c167c6701843D454E2EFA0",
  // Solace DAI Bond Teller (SBT), users deposit DAI and receive vested SOLACE or xSOLACE
  SOLACE_DAI_BOND_SBT: "0x501AcE5FEe0337e13A442Cb5e15728EE0e8b3F29",
  // Solace ETH Bond Teller (SBT)
  SOLACE_ETH_BOND_SBT: "0x501ace68E20c29629E690D86E54E79719e2Fc5e8",
  // Solace USDC Bond Teller (SBT)
  SOLACE_USDC_BOND_SBT: "0x501aCE044AE4E11183026659EE3B0E3b0Df04d7F",
  // Solace SOLACE-USDC SLP Bond Teller (SBT)
  SOLACE_SOLACE_USDC_BOND_SBT: "0x501acEb253483BD58773365334DEf095304CddAE",
  // Solace WBTC Bond Teller (SBT)
  SOLACE_WBTC_BOND_SBT: "0x501aCE2f3b5B8f645E67556Df77ac4c3081D84C7",
  // Solace USDT Bond Teller (SBT)
  SOLACE_USDT_BOND_SBT: "0x501acE6061D6176Da12FCBa36Bc85B2fc3FFd5e3",
  // Solace SCP Bond Teller (SBT)
  SOLACE_SCP_BOND_SBT: "0x501aCE163FfaCDa6584D75b274eD23155BFf4812",
  // CP Farm, rewards users for providing ETH to Vault (being deprecated)
  SOLACE_CP_FARM: "0x501ACeb4D4C2CB7E4b07b53fbe644f3e51D25A3e",
  // V2 underwriting pool, pays out claims
  SOLACE_UNDERWRITTING_POOL_V2: "0x5efC0d9ee3223229Ce3b53e441016efC5BA83435",
};

module.exports = {
  /* Project Metadata */
  name: "solace.fi",
  token: "SOLACE",
  category: "Derivatives",
  start: 1638056715,
  /* Fetching token balances */
  tokenHolderMap: [
    {
      tokens: ADDRESS.SOLACE,
      holders: [
        ADDRESS.XSOLACE,
        ADDRESS.SOLACE_DAI_BOND_SBT,
        ADDRESS.SOLACE_ETH_BOND_SBT,
        ADDRESS.SOLACE_UNDERWRITTING_POOL_V2,
      ],
      checkNativeBalance: true,
    },
    {
      tokens: ADDRESS.XSOLACE,
      holders: [ADDRESS.SOLACE_DAI_BOND_SBT, ADDRESS.SOLACE_ETH_BOND_SBT],
      checkNativeBalance: true,
    },
    {
      tokens: ADDRESS.DAI,
      holders: [
        ADDRESS.SOLACE_UNDERWRITTING_POOL_V2,
        ADDRESS.SOLACE_DAI_BOND_SBT,
      ],
      checkNativeBalance: true,
    },
    {
      tokens: ADDRESS.WETH,
      holders: [
        ADDRESS.SOLACE_UNDERWRITTING_POOL_V2,
        ADDRESS.SOLACE_ETH_BOND_SBT,
      ],
      checkNativeBalance: true,
    },
    {
      tokens: ADDRESS.USDC,
      holders: [
        ADDRESS.SOLACE_UNDERWRITTING_POOL_V2,
        ADDRESS.SOLACE_USDC_BOND_SBT,
      ],
      checkNativeBalance: true,
    },
    {
      tokens: ADDRESS.SOLACE_USDC_SLP,
      holders: [
        ADDRESS.SOLACE_UNDERWRITTING_POOL_V2,
        ADDRESS.SOLACE_SOLACE_USDC_BOND_SBT,
      ],
      checkNativeBalance: true,
    },
    {
      tokens: ADDRESS.WBTC,
      holders: [
        ADDRESS.SOLACE_UNDERWRITTING_POOL_V2,
        ADDRESS.SOLACE_WBTC_BOND_SBT,
      ],
      checkNativeBalance: true,
    },
    {
      tokens: ADDRESS.USDT,
      holders: [
        ADDRESS.SOLACE_UNDERWRITTING_POOL_V2,
        ADDRESS.SOLACE_USDT_BOND_SBT,
      ],
      checkNativeBalance: true,
    },
    {
      tokens: ADDRESS.SOLACE_SCP_VAULT_V1,
      holders: [
        ADDRESS.SOLACE_UNDERWRITTING_POOL_V2,
        ADDRESS.SOLACE_SCP_BOND_SBT,
        ADDRESS.SOLACE_CP_FARM,
      ],
      checkNativeBalance: true,
    },
    {
      tokens: ADDRESS.ETH,
      holders: ADDRESS.SOLACE_SCP_VAULT_V1,
      checkETHBalance: true,
    },
  ],
};
