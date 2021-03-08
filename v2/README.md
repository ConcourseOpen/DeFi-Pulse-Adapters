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
  name: 'Loopring',         // token project name
  symbol: 'LRC',            // protocol token symbol (if exists any)
  category: 'DEXes',        // allowed values can be 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1514764800,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
  ...
}
```

## The ```tokenHolderMap``` configurations

The main tokenHolderMap part of the adapter is where you add custom configurations for your adapter. On DeFi Pulse, This tokenHolderMap configuration will be used every hour, with a unix timestamp and block number to automatically fetch token balances locked in your protocol. Please note that project adapters need to be able to run successfully for any point back to a project starting time, not just for recent points. This is necessary both to allow collection of historical data that may exist prior to the release of a newly added project, and for repairing or catching up a projects data history in the event of any errors.

Each item in the tokenHolderMap consists of 2 main parts:
#### ```tokens``` property
The tokens property of tokenHolderMap can be a single token, a list of tokens, an executable function that will return a single or a list of tokens, or a json configuration that can be used to pull token information from pool smart contracts.
