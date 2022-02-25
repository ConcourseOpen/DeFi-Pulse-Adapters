module.exports = {
  /* Project Metadata */
  name: "DFX Finance",
  token: "DFX",
  chain: "polygon",
  category: "DEXes",
  start: 1626404432, // CADC pool creation timestamp
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: [
        "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC
        "0x5d146d8B1dACb1EBBA5cb005ae1059DA8a1FbF57", // CADC
        "0xE111178A87A3BFf0c8d18DECBa5798827539Ae99", // EURS
        "0x769434dcA303597C8fc4997Bf3DAB233e961Eda2", // XSGD
      ],
      holders: [
        // v0.5 / v1.0 pools
        "0x288Ab1b113C666Abb097BB2bA51B8f3759D7729e", // CADC-USDC pool
        "0xB72d390E07F40D37D42dfCc43E954Ae7c738Ad44", // EURS-USDC pool
        "0x8e3e9cB46E593Ec0CaF4a1Dcd6DF3A79a87b1fd7", // XSGD-USDC pool
      ],
    },
  ],
};
