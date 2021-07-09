# DeFi Pulse Project Templates

Welcome to the DeFiPulse Project Template Repository! This purpose of this repo is to allow 3rd party developers to build, validate and update their own project adapter for DeFi Pulse in order to allow a higher volume of projects to be added and maintained over time.

# How to Get Listed on DeFi Pulse

- FIRST, You must successfully apply and be listed on The DeFi List: 
  Please follow the instructions in this blog post to be listed on The DeFi List: https://defipulse.com/blog/how-to-join-the-defi-pulse-leaderboard.
- Once your project has been added to the DeFi List, please follow Step 4 in the blog post link above.
- Code an adapter as described below.
- Work with us during testing.
- Make sure your adapter stays up to date as your dApp gets upgraded over time. Outdated adapters may be delisted.

# Documentation Links

[SDK Reference](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/docs/sdk.md) <br/>
[Token Adapter Reference](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/tokens/README.md)

# Getting Started with the Adapter

Once you have the repo cloned locally, install dependencies by running:

```
npm install
```

Next you'll need to create a `.env` file. An example file `.env.example` is provided for you to use as a starting point.

```
DEFIPULSE_KEY='SDK_KEY_HERE'
```

You'll obtain your SDK key in the course of the listing process described above. Each project using the SDK requires an individual SDK key so that we can keep tabs on the web3 call volume each adapter creates in our back-end. We do not limit the number of web3 calls an adapter can make, but ask projects to optimize their call volume whenever possible. 

To verify that you have access and everything is working, try running:

```
npm run test -- --project=_template
```

The test should complete successfully.

# GitHub Collaboration
Please fork this repository before you start building your adapter and then work on a topic branch within the forked repo. Like this, you will be able to easily create pull requests against the upstream repo and if needed, you can grant us the right to make commits on your topic branch to update your pull request. Further details: https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork

# Writing a JSON Configurable Adapter

*Note: We try our best to reduce dependecies on third party APIs (The Graph, projects own TVL endpoints etc). Please utilize the DeFi Pulse SDK when writing your adapter.*

Let's take a look at the existing [Loopring](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/v2/projects/loopring) or [Balancer](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/v2/projects/balancer) or [Aave on Polygon](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/chains/polygon/projects/aave) adapters to see a minimal example of how to write and test a JSON Configurable adapter. Each token adapter (on Ethereum mainnet) gets its own sub-directory under `/v2/projects`, with an index.js file containing the main json configurations and settings. Projects on Polygon or other chains get their own adapter folder under `/chains/[chain name]/projects/`. 

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

N.B. The ```transform``` function does not create closures to it's creation contexts. When executed it will only be able to access it's own local variables, not the ones from the scope in which the function was created. 


## Testing

While writing your project adapter, you'll need to run the code to check for errors, check for output etc. Some testing commands are provided for this purpose.

Project on Ethereum:
```
npm run validate-metadata -- --project=<projectName>
npm run test-tvl -- --project=<projectName>
```

Project on Polygon:
```
npm run validate-metadata -- --project=<projectName> --chain=polygon
npm run test-tvl -- --project=<projectName> --chain=polygon
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

Output of tests are stored in json files under `output/**chain_name**/**project_name**/tvl` and are named based on the time they were run to fetch data for.

In the above example, the output is saved to `output/ethereum/Loopring/tvl/2021-03-08T13:00:00Z.json` since the project is `Loopring`, and the data the test script retrieved is tvl. It's output is shown below:
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

# In case your your adapter needs more customisations please follow below instructions:

# Writing tvl function

Let's take a look at the template project to see a minimal example of an adapter. Each project gets it's own sub-directory under `/projects`, with an index.js file containing the main code and settings.

```
projects
└───_template
    └───index.js
```

Feel free to add additional files and folders within your project adapter directly as needed to help organize your code, but most projects shouldn't be too large. Please keep all code within your project adapter directory - PR's with modifications or additions outside the scope of your own project usually won't be allowed, and in cases where they are needed will need to be discussed with the DeFi Pulse team in advance.

## The TVL Function

The main tvl function of a project adapter is where token balances are fetched. On DeFi Pulse, these functions are run every hour, with a unix timestamp and block number passed to the function. Please note that project adapters need to be able to run successfully for any point back to a projects starting time, not just for recent points. This is necessary both to allow collection of historical data that may exist prior to the release of a newly added project, and for repairing or catching up a projects data history in the event of any errors.

```js
async function tvl(timestamp, block) {
  let balances = {
    '0x0000000000000000000000000000000000000000': 1000000000000000000, // ETH
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': 2000000000000000000  // DAI
  };

  return balances;
}
```

In the case of the `_template' adapter, we're just using some hard coded values as token balances to illustrate a minimal implementation.

For consistency, we treat balances associated with token addresses as raw/wei values (before decimal conversion) and balances associated with token symbols as decimal converted values. Due to the methods most commonly available in core contracts for most projects already on Defi Pulse (and a lack of broad standardization), we've found the most effective solution is for project adapters to work internally with token addresses; symbol conversions are done automatically after the adapter runs;

The important thing is that the adapter is expected to output an object with token addresses and raw non-decimal converted balances. For the `_template` adapter, the output looks like this:

```js
{
  "ETH": "1",
  "DAI": "2"
}
```

## The SDK

Your adapter will of course need to actually fetch real values unlike the `_template` example, so let's look at the `bancor` adapter for a real world example.

```js
async function run(timestamp, block) {
  let getBalance = await sdk.api.eth.getBalance({target: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315', block});

  let balances = {
    '0x0000000000000000000000000000000000000000': getBalance.output
  };

  let calls = await GenerateCallList(timestamp);

  let balanceOfResults = await sdk.api.abi.multiCall({
    block,
    calls,
    abi: 'erc20:balanceOf'
  });

  await sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

  return balances;
}
```

To retrieve it's locked balances, the `bancor` adapter needs to check a main address for it's ETH balance, as well as check a list of token adapters for specific token balances. An SDK provides standardized methods for querying contracts for values and other common interactions, and wherever possible is the preferred method of retrieving data.

```js
const  sdk = require('../../sdk');
```

2 methods are utilized for the `bancor` adapter:

```js
let getBalance = await sdk.api.eth.getBalance({target: '0xc0829421C1d260BD3cB3E0F06cfE2D52db2cE315', block});
```

```js
let balanceOfResults = await sdk.api.abi.multiCall({
  block,
  calls,
  abi: 'erc20:balanceOf'
});
```

These illustrate the most common SDK interactions for most adapters - running one view/function on a single token/address, and running batches of a given view/function on multiple tokens/address with different parameters.

[Full documentation of available functions in the SDK](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/docs/sdk.md)

If the SDK doesn't provide required methods to implement your project adapter, please contact a member of the DeFi Pulse team so we can add necessary support where applicable, and/or collaborate to find a suitable alternative solution.

In some cases not all necessary data can be obtained on-chain and/or through the SDK, the `bancor` adapter for example hits a proprietary API to retrieve a list of tokens and addresses that need to be tracked since this information isn't available on-chain. We understand that this is sometimes necessary, and there are some unavoidable cases where off-chain data sources need to be used but wherever possible on-chain/transparent data sources should be prioritized over alternatives. Any unavoidable use of off-chain data sources should be discussed prior to implementation with the DeFi Pulse team.

## Metadata

Each project adapter needs to export the main run function, in addition to some important metadata - This is data is outlined in the `_template` adapter with accompanying descriptions:

```js
module.exports = {
  name: 'Template Project', // project name
  token: null,              // null, or token symbol if project has a custom token
  category: 'assets',       // allowed values as shown on DefiPulse: 'derivatives', 'dexes', 'lending', 'payments', 'assets'
  start: 1514764800,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
  tvl                       // tvl adapter
}
```

Here's a look at the `bancor` adapter for a practical example of this:

```js
module.exports = {
  name: 'Bancor',
  token: 'BNT',
  category: 'dexes',
  start: 1501632000,  // 08/02/2017 @ 12:00am (UTC)
  tvl
}
```

You can see the effect of these settings on [DeFi Pulse](https://defipulse.com/).

The project's name and protocol token are simple values shown in the UI and API data. Category influences how the project is classified and what section it's tvl contributes to for aggregate results on the main page. Finally the start time defines the limit for how far back data needs to be fetched to retrieve the projects full historical data.

## Testing

While writing your adapter, you'll need to run the code to check for errors, check for output etc. Some testing commands are provided for this purpose.

## Historical CSV view
After running the test suite, a historical CSV is generated containing all tracked tokens and their balances beginning the projects "start" date. You can use this folder to gain better insight into the output of your adapters and verify accuracy.

| timestamp        | date           | block  | ETH  |
| ------------- |:-------------:| -----:|-----:|
| 1538006400      | Wed Sep 26 2018 20:00:00 | 6405884 | 22.64 |
| 1549324800 | Mon Feb 04 2019 19:00:00     | 7175712 |  25452.34 |
| 1554940800      | Wed Apr 10 2019 20:00:00   | 7543456   |   53152.81 |

Check the
```
/CSV folder
```

```
npm run test -- --project=_template
npm run validate -- --project=yearn
```

The `test` command will run a project adapter once for the latest hourly point, perform some basic checks on it's output, and log the result.

```
_template project running & output format
  runs for specified time: latest hour
    ✓ returns valid tvl data at hour 0 (1172ms)


1 passing (1s)
```

Output of tests are stored in json files under `output/**chain_name**/**project_name**/**adapter_type**` and are named based on the time they were run to fetch data for.

In the above example, the output is saved to `output/ethereum/_template/tvl/2020-04-16T17:00:00Z.json` since the project is `_template`, and the adapter provided is for tvl. It's output is shown below:

```json
{
  "ethCallCount": 0,
  "timestamp": 1587481200,
  "block": 9916481,
  "output": {
    "ETH": "1",
    "DAI": "2"
  }
}
```

The test will output how many Ethereum network calls were used for the run, confirm the timestamp and block the test was run on, and provide the output generated by the adapter.

You can also provide an optional timestamp parameter to the test in order to reproduce and troubleshoot previous results:

```
npm run test -- --project=_template --timestamp=1581026400
```

When you think your project is ready, the `validate` command can be used to do a final more thorough check. This command runs the adapter through a series of points spread over it's lifespan, and also checks that valid metadata is exported by the adapter as well.

```
npm run validate -- --project=_template
```

```
  _template project export format
    ✓ has a valid name
    ✓ category matches one of the defined options
    ✓ has a valid start time
    ✓ should have a run method

  _template project running & output format
    runs for a variety of points at different times
      ✓ returns valid data at point hour 0 (789ms)
      ✓ returns valid data at point hour -6 (686ms)
      ✓ returns valid data at point hour -12 (1165ms)
      ✓ returns valid data at point hour -36 (1267ms)
      ✓ returns valid data at point hour -72 (1391ms)
      ✓ returns valid data at 2020-01-27T00:00:00Z (1644ms)
      ✓ returns valid data at 2019-11-12T00:00:00Z (1288ms)
      ✓ returns valid data at 2019-08-28T00:00:00Z (1672ms)
      ✓ returns valid data at 2019-06-14T00:00:00Z (1208ms)
      ✓ returns valid data at 2019-03-30T00:00:00Z (1564ms)
      ✓ returns valid data at 2019-01-14T00:00:00Z (1193ms)
      ✓ returns valid data at 2018-10-30T00:00:00Z (1160ms)
      ✓ returns valid data at 2018-08-15T00:00:00Z (1342ms)
      ✓ returns valid data at 2018-06-01T00:00:00Z (1120ms)
      ✓ returns valid data at 2018-03-17T00:00:00Z (1264ms)
      ✓ returns valid data at 2018-01-01T00:00:00Z (1621ms)


  20 passing (20s)
```

This test suite will only log verbose results and adapter output in the event of a problem
