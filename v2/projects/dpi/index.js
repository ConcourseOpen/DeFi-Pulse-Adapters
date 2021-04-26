module.exports = {
    name: 'Index Coop',
    token: 'INDEX',
    category: 'Assets',
    start: 1599769488,
    
    tokenHolderMap: [
      {
        holders: [
          '0xada0a1202462085999652dc5310a7a9e2bf3ed42', // CGI
          '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b', // DPI
          '0xaa6e8127831c9de45ae56bb1b0d4d4da6e5665bd', // FLI
          '0x72e364f2abdc788b7e918bc238b21f109cd634d7'  // MVI
        ],
        tokens: {
          pullFromPools: true, 
          abi: {
            inputs: [],
            name: "getComponents",
            outputs: [
              {
                internalType: "address[]",
                name: "",
                type: "address[]",
              },
            ],
            stateMutability: "view",
            type: "function",
          },
        },
      },
    ],
  };
  