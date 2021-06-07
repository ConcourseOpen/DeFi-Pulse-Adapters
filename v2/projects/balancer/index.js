module.exports = {
  /* Project Metadata */
  name: 'Balancer',
  token: null,
  category: 'DEXes',
  start: 1582761600, // 02/27/2020 @ 12:00am (UTC)
  /* required for fetching token balances */
  tokenHolderMap: [
    {
      holders: {
        pullFromLogs: true,
        logConfig: {
          target: '0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd',
          topic: 'LOG_NEW_POOL(address,address)',
          keys: ['topics'],
          fromBlock: 9562480
        },
        transform: null,
      },
      tokens: {
        pullFromPools: true,
        abi: {
          constant: true,
          inputs: [],
          name: 'getCurrentTokens',
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
      }
    }
  ]
};
