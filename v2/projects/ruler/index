const axios = require('axios');

const oldPools = [
  '0x1Daf17e6d1d9ed6aa9Fe9910AE17Be98C2C4e6BA',
  '0x52890A0c018fbab21794AD18e15f87fdb57fb975',
  '0x910A00594DC16dD699D579A8F7811d465Dfa2752',
  '0xf085c77B66cD32182f3573cA2B10762DF3Caaa50',
  '0x6Df2B0855060439251fee7eD34952b87b68EeEd9',
  '0xaFcc5DADcDcFc4D353Ab2d36fbd57b80513a34e6',
  '0x4AcE85cF348F316384A96b4739A1ab58f5123E7a',
  '0x23078d5BC3AAD79aEFa8773079EE703168F15cF5',
  '0xaF47f0877A9b26FfF12ec8253E07f92F89c6805D',
  '0x273AfbF6E257aae160749a61D4b83E06A841c3eB',
  '0xfB51e37CebC5D6f1569004206629BB7e47b6843f',
  '0xaC63c167955007D5166Fec43255AD5675EfC3102',
  '0xE764Fb1f870D621a197951F1A27aaC6d4F930329',
  '0xbe735E6dd6c47d86BF8510D3c36Cba1a359B8dDc',
  '0x2009f19A8B46642E92Ea19adCdFB23ab05fC20A6',
  '0x421CB018b91b4048FaAC1760Cee3B66026B940f2'
]

module.exports = {
  /* Project Metadata */
  name: 'Ruler Protocol',
  token: 'RULER',
  category: 'Lending',      // Allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1614757648,         // Wednesday, March 3, 2021 7:47:28 AM UTC
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      tokens: {
        pullFromPools: true,
        abi: {
          constant: true,
          inputs: [],
          name: 'getCollaterals',
          outputs: [
            {
              internalType: 'address[]',
              name: 'tokens',
              type: 'address[]'
            }
          ],
          payable: false,
          stateMutability: 'view',
          type: 'function'
        }
      },
      holders: '0xF19f4490A7fCCfEf2DaB8199ACDB2Dc1B9027C18',
    },
    {
      tokens: ['0x6b175474e89094c44da98b954eedeac495271d0f', '0x6c3f90f043a72fa612cbac8115ee7e52bde6e490'], // Dai + 3crv
      holders: async () => {
        const data = await axios.get('https://api.rulerprotocol.com/backend_data/production');
        return Object.values(data.data.rewards).map(reward => reward.poolAddress).concat(oldPools);
      },
    }
  ],
};

