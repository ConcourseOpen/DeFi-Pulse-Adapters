# DeFi Pulse JSON Configurable Adapter Writing Doc

# Documentation Links

[Follow These Instructions First](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/README.md) <br/>
[SDK Reference](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/docs/sdk.md)

# Writing a JSON Configurable TVL Adapter

Let's take a look at the existing [Loopring](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/v2/projects/loopring) or [Balancer](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/v2/projects/balancer) or [xDai](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/v2/projects/xdai) adapters to see a minimal example of how to write and test a JSON Configurable adapter. Each token adapter gets it's own sub-directory under `/v2/projects`, with an index.js file containing the main json configurations and settings.

```
v2
└───projects
  └───loopring
    └───index.js
```

Feel free to add additional files and folders within your project adapter directly as needed to help organize your code, but most json configurable adapters should be very simple. Please keep all code within your token adapter directory - PR's with modifications or additions outside the scope of your own project usually won't be allowed, and in cases where they are needed will need to be discussed with the DeFi Pulse team in advance.

## Project Metadata
```js
module.exports = {
  /* Metadata */
  name: 'Loopring',         // token project name
  symbol: 'LRC',            // protocol token symbol (if exists any)
  category: 'DEXes',        // allowed values can be 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1514764800,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
  ...
}
```

## The main ```tokenHolderMap``` configurations

The main tokenHolderMap part of the adapter is where you add custom configurations for your adapter. On DeFi Pulse, This tokenHolderMap configuration will be used every hour, with a unix timestamp and block number to automatically fetch token balances locked in your protocol. Please note that project adapters need to be able to run successfully for any point back to a project starting time, not just for recent points. This is necessary both to allow collection of historical data that may exist prior to the release of a newly added project, and for repairing or catching up a projects data history in the event of any errors.

Each item in the tokenHolderMap consists of 2 main parts:

#### ```tokens``` configuration
The tokens property of tokenHolderMap can be a single token, a list of tokens, an executable function that will return a single or a list of tokens, or a json configuration that can be used to pull token information from pool smart contracts.

#### ```holders``` configuration
The holders property of tokenHolderMap can be a single holder/vault/pool address, a list of addresses, an executable function that will return a single or a list of addresses, or a json configuration that can be used to pull pool address from pool smart contracts.

#### ```Loopring``` adapter `tokenHolderMap` configuration
```js
module.exports = {
  ...
  ...
  /* required for indexing token balances */
    tokenHolderMap: [
      {
        tokens: [
          '0xBBbbCA6A901c926F240b89EacB641d8Aec7AEafD',  // LRC
          '0xdac17f958d2ee523a2206206994597c13d831ec7',  // USDT
          '0x6B175474E89094C44Da98b954EedeAC495271d0F',  // DAI
          '0x514910771AF9Ca656af840dff83E8264EcF986CA',  // LINK
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',  // USDC
          '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',  // WBTC
          '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2',  // MKR
        ],
        holders: [
          '0x674bdf20A0F284D710BC40872100128e2d66Bd3f',
          '0x944644Ea989Ec64c2Ab9eF341D383cEf586A5777'
        ],
        checkETHBalance: true,
      }
    ]
}
```

Add ```checkETHBalance: true``` code snippet in case your adapter needs to track ETH balances as well.

#### ```xDai``` adapter `tokenHolderMap` configuration
```js
module.exports = {
  ...
  ...
  /* required for indexing token balances */
    tokenHolderMap: [
      {
        tokens: [
          '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359', // SAI
          '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
          '0x06af07097c9eeb7fd685c692751d5C66db49c215' // CHAI
        ],
        holders: '0x4aa42145Aa6Ebf72e164C9bBC74fbD3788045016'
      },
      {
        tokens: async () => {
          const allTokens = await sdk.api.util.tokenList();
          return allTokens.map(token => token.contract);
        },
        holders: '0x88ad09518695c6c3712AC10a214bE5109a655671'
      }
    ]
}
```

In case you need more flexibility add a function instead that will return tokens or holders addresses.

#### ```Balancer``` adapter `tokenHolderMap` configuration
```js
module.exports = {
  ...
  ...
  /* required for indexing token balances */
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
}
```

In case your protocol follows factory pattern or is based on AMM model add log configs to pull holder addresses from smart contract events.
By default we use ```(poolLog) => `0x${poolLog[2].slice(26)}`; ``` this code snippet as log ```transform``` function. Pass a different custom function if you need.


## Testing

While writing your project adapter, you'll need to run the code to check for errors, check for output etc. Some testing commands are provided for this purpose.

```
npm run validate-metadata -- --project=<projectName>
npm run test-tvl -- --project=<projectName>
```

Run `validate-metadata` command to check if you have project `Metadata` setup correctly.

sample command: `npm run validate-metadata -- --project=loopring`
sample output:
```
Checking Loopring project adapter metadata
    ✓ has a valid name
    ✓ has a valid start time
    ✓ category matches one of the defined categories
    has valid tokenHolderMap configurations
      ✓ tokenHolderMap is an array
      ✓ tokenHolderMap has valid token configurations
      ✓ tokenHolderMap has valid holder/vault/pool configurations


  6 passing (11ms)
```

After test command `validate-metadata` passes successfully run `test-tvl`. This command runs the adapter through a series of points spread over it's lifespan.

sample command: `npm run test-tvl -- --project=loopring`
sample output:
```
Loopring project adapter running & output format
    runs for a variety of points at different times
      ✓ returns valid tvl data at hour 0 (4532ms)
      ✓ returns valid tvl data at hour -12 (2647ms)
      ✓ returns valid tvl data at hour -36 (2226ms)
      ✓ returns valid tvl data at hour -72 (2335ms)
      ✓ returns valid tvl data at 2021-02-26T00:00:00Z (2350ms)
      ✓ returns valid tvl data at 2021-01-10T00:00:00Z (3563ms)
      ✓ returns valid tvl data at 2020-11-25T00:00:00Z (2582ms)
      ✓ returns valid tvl data at 2020-10-09T00:00:00Z (2243ms)
      ✓ returns valid tvl data at 2020-08-24T00:00:00Z (3284ms)
      ✓ returns valid tvl data at 2020-07-09T00:00:00Z (2628ms)
      ✓ returns valid tvl data at 2020-05-23T00:00:00Z (2918ms)
      ✓ returns valid tvl data at 2020-04-07T00:00:00Z (2514ms)
      ✓ returns valid tvl data at 2020-02-20T00:00:00Z (2396ms)
      ✓ returns valid tvl data at 2020-01-05T00:00:00Z (2631ms)
      ✓ returns valid tvl data at 2019-11-21T00:00:00Z (2265ms)


  15 passing (41s)
```

Output of tests are stored in json files under `v2/output/**project_name**/tvl` and are named based on the time they were run to fetch data for.

In the above example, the output is saved to `v2/output/Loopring/tvl/2021-03-08T13:00:00Z.json` since the project is `Loopring`, and the data the test script retrieved is tvl. It's output is shown below:
```
{
  "timestamp": 1615208400,
  "block": 11998012,
  "tvl": [
    {
      "contract": "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
      "symbol": "LRC",
      "balance": 153583047.41121337,
      "price": 0.558486958432916
    },
    {
      "contract": "0xdac17f958d2ee523a2206206994597c13d831ec7",
      "symbol": "USDT",
      "balance": 6885571.564996,
      "price": 1.0033342002521268
    },
    {
      "contract": "0x6b175474e89094c44da98b954eedeac495271d0f",
      "symbol": "DAI",
      "balance": 1798873.4626126941,
      "price": 1.0036468119444584
    },
    {
      "contract": "0x514910771af9ca656af840dff83e8264ecf986ca",
      "symbol": "LINK",
      "balance": 8898.471084705028,
      "price": 29.133499595872404
    },
    {
      "contract": "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
      "symbol": "USDC",
      "balance": 2385051.730462,
      "price": 1.0014661516590568
    },
    {
      "contract": "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
      "symbol": "WBTC",
      "balance": 139.03476935,
      "price": 50165.125085588836
    },
    {
      "contract": "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
      "symbol": "MKR",
      "balance": 68.35973257054415,
      "price": 2100.3439239324593
    },
    {
      "contract": "0x0000000000000000000000000000000000000000",
      "symbol": "ETH",
      "balance": 48299.2822487816,
      "price": 1713.3933935097111
    }
  ]
}
```


This test suite will only log verbose results and adapter output in the event of a problem.

Once both tests pass successfully your project should appear on [Defipulse Staging](https://test.defipulse.com/) leaderboard. Once you see your project on the leaderboard click on the project to review project tvl chart.
