module.exports = {
  /* Project Metadata */
  name: 'Element',
  token: null,
  category: 'Assets',
  start: 1624404970, // Jun-22-2021 06:36:10 PM +UTC
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: [
        '0xed279fdd11ca84beef15af5d39bb4d4bee23f0ca', // lusd3crv-f
        '0x5fA5B62c8AF877CB37031e0a3B2f34A78e3C56A6', // yvlusd3crv-f
        '0xca3d75ac011bf5ad07a98d02f18225f9bd9a6bdf', // crvtricrypto
        '0x3D980E50508CFd41a13837A60149927a11c03731',  // yvcrvtricrypto
      ],
      holders: [

        '0x53b1aeaa018da00b4f458cc13d40eb3e8d1b85d6', // wrapped position yearn lusd3crv-f
        '0x97278Ce17D4860f8f49afC6E4c1C5AcBf2584cE5', // wrapped position yearn crvtricrypto
        '0xA8D4433BAdAa1A35506804B43657B0694deA928d', // PT Pool lusd3crv-f 1632834462
        '0xDe620bb8BE43ee54d7aa73f8E99A7409Fe511084', // YT Pool lusd3crv-f 1632834462
        '0x893B30574BF183d69413717f30b17062eC9DFD8b', // PT Pool lusd3crv-f 1640620258
        '0x67F8FCb9D3c463da05DE1392EfDbB2A87F8599Ea', // YT Pool lusd3crv-f 1640620258
        '0x3A693EB97b500008d4Bb6258906f7Bbca1D09Cc5', // PT Pool crvtricrypto 1628997564
        '0xF94A7Df264A2ec8bCEef2cFE54d7cA3f6C6DFC7a', // YT Pool crvtricrypto 1628997564
        '0xBA12222222228d8Ba445958a75a0704d566BF2C8', // Balancer V2 Vault (delete this)
      
      ],
      checkETHBalance: true,
    }
  ],
};
