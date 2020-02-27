# DeFi Pulse Project Templates

Welcome to the DeFiPulse Project Template Repository! This purpose of this repo is to allow 3rd party developers to build, validate and update their own project adapter for DeFi Pulse in order to allow a higher volume of projects to be added and maintained over time.

# Documentation Links

[SDK Reference](https://github.com/ConcourseOpen/DeFi-Pulse-Adapters/blob/master/docs/sdk.md)

# Getting Started

Before starting to build the adapter for your project, please fill out this [short form](https://forms.gle/sftGdpDq7mGrvSN38) to apply for a listing on DeFi Pulse and to sign a contributor agreement for this repository.

Once you have the repo cloned locally, install dependencies by running:

```
npm install
```

Next you'll need to create a `.env` file. An example file `.env.example` is provided for you to use as a starting point.

```
DEFIPULSE_KEY='SDK_KEY_HERE'
```

Replace the placeholder `SDK_KEY_HERE` with the key you obtained after signing the contributor ageement.

To verify that you have access and everything is working, try running:

```
npm run test -- --project=_template
```

The test should complete successfully.

# GitHub Collaboration
Please fork this repository before you start building your adapter and then work on a topic branch within the forked repo. Like this, you will be able to easily create pull requests against the upstream repo and if needed, you can grant us the right to make commits on your topic branch to update your pull request. Further details: https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request-from-a-fork

# Writing a Project Adapter

Let's take a look at the template project to see a minimal example of an adapter. Each project gets it's own sub-directory under `/projects`, with an index.js file containing the main code and settings. 

```
projects
└───_template
    └───index.js
```

Feel free to add additional files and folders within your project adapter directly as needed to help organize your code, but most projects shouldn't be too large. Please keep all code within your project adapter directory - PR's with modifications or additions outside the scope of your own project usually won't be allowed, and in cases where they are needed will need to be discussed with the DeFi Pulse team in advance.

## The Run Function

The main run function of a project adater is where token balances are fetched. On DeFi Pulse, these functions are run every hour, with a unix timestamp and block number passed to the function. Please note that project adapters need to be able to run successfully for any point back to a projects starting time, not just for recent points. This is necessary both to allow collection if historical data that may exist prior to the release of a newly added project, and for repairing or catching up a projects data history in the event of any errors.

```js
async function run(timestamp, block) {
  let balances = {
    '0x0000000000000000000000000000000000000000': 1000000000000000000, // ETH
    '0x6B175474E89094C44Da98b954EedeAC495271d0F': 2000000000000000000  // DAI
  };

  let symbolBalances = await sdk.api.util.toSymbols(balances);

  return symbolBalances.output;
}
```

In the case of the `_template' adapter, we're just using some hard coded values as token balances to illustrate a minimal implementation.

For consistency, we treat balances associated with token addresses as raw/wei values (before decimal conversion) and balances associated with token symbols as decimal converted values. Due to the methods most commonly available in core contracts for most projects already on Defi Pulse (and a lack of broad standardization), we've found the most effective solution is for project adapters to work internally with token addresses where possible, and translate those raw addresses/wei to tokens/decimal converted values as late as possible.

the `_template` project illustrates a helper function available to assist with this conversion, the `toSymbols` method accepts an object containing these raw values, and outputs the decimal converted values with proper token symbols. This is completely optional however, and depending on how your project works and the methods available it may make more sense to deal directly with symbols from the start.

The important thing is that the adapter is expected to output an object with token symbols and decimal converted values. For the `_template` adapter, the output looks like this:

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

  _.each(balanceOfResults.output, (balanceOf) => {
    if(balanceOf.success) {
      let balance = balanceOf.output;
      let address = balanceOf.input.target;

      if (BigNumber(balance).toNumber() <= 0) {
        return;
      }

      balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
    }
  });

  let symbolBalances = await sdk.api.util.toSymbols(balances);

  return symbolBalances.output;
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

In some cases not all neccessary data can be obtained on-chain and/or through the SDK, the `bancor` adapter for example hits a proprietary API to retrieve a list of tokens and addresses that need to be tracked since this information isn't available on-chain. We understand that this is sometimes necessary, and there are some unavoidable cases where off-chain data sources need to be used but wherever possible on-chain/transparent data sources should be prioritized over alternatives. Any unavoidable use of off-chain data sources should be discussed prior to implementation with the DeFi Pulse team.

## Metadata

Each project adapter needs to export the main run function, in addition to some important metadata - This is data is outlined in the `_template` adapter with accompanying descriptions:

```js
module.exports = {
  name: 'Template Project', // project name
  token: null,              // null, or token symbol if project has a custom token
  category: 'Assets',       // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1514764800,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
  run                       // adapter
}
```

Here's a look at the `bancor` adapter for a practical example of this:

```js
module.exports = {
  name: 'Bancor',
  token: 'BNT',
  category: 'DEXes',
  start: 1501632000,  // 08/02/2017 @ 12:00am (UTC)
  run
}
```

You can see the affect of these settings on [DeFi Pulse](https://defipulse.com/).

The project's name and protocol token are simple values shown in the UI and API data. Category influences how the project is classified and what section it's tvl contributes to for aggregate results on the main page. Finally the start time defines the limit for how far back data needs to be fetched to retrieve the projects full historical data.

## Testing

While writing your adapter, you'll need to run the code to check for errors, check for output etc. Some testing commands are provided for this purpose.

```
npm run test -- --project=_template
```

The `test` command will run a project adapter once for the latest hourly point, perform some basic checks on it's output, and log the result.

```
 _template project running & output format
    runs for specified time: latest
      ✓ returns valid data at point hour 0 (1600ms)
    ✔ Output: {
      "ethCallCount": 0,
      "timestamp": 1581026400,
      "block": 9431690,
      "output": {
        "ETH": "1",
        "DAI": "2"
      }
    }


  1 passing (2s)
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
    ✓ categoy matches one of the defined options
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

