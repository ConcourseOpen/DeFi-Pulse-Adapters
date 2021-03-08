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

## Project Basic Information
```js
module.exports = {
  name: 'Loopring',         // token project name
  symbol: 'LRC',            // protocol token symbol (if exists any)
  category: 'DEXes',        // allowed values can be 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1514764800,        // unix timestamp (utc 0) specifying when the project began, or where live data begins
  ...
}
```
