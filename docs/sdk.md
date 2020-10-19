# SDK

The SDK module contains all endpoints and functions needed to write a project adapter, including methods for querying the blockchain, and formatting data output. Additional methods and helpers will be added over time to help simplify more complex contract integration, and assist with commonly used patterns that may turn up as more projects are added.

```js
const  sdk = require('../../sdk');
```

# Standards

## Balances & Decimals

For consistency, we treat balances associated with token addresses as raw/wei values (before decimal conversion) and balances associated with token symbols as decimal converted values.

Addresses:

```js
let addressBalances = {
  '0x0000000000000000000000000000000000000000': '1000000000000000000', // ETH
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': '2000000000000000000'  // DAI
}
```

Symbols:

```js
let symbolBalances = {
  ETH: '1',
  DAI: '2'
}
```

**NOTE:** as shown above, the all 0 address is used to indicate ETH

## Ethereum Node Calls

For the purpose of debugging and to assist with optimization, any api calls that require querying an Ethereum Node (ie, Infura) will return an *'ethCallCount'* specifying the number of network calls that were needed to generate the returned result. In some cases no calls may actually be needed due to caching/optimization.

Example:

```js
{
  ethCallCount: 1,
  output: {...}
}
```

# Methods

## Utility - *sdk.api.util.___*
  
### toSymbols(*object*)

Convert a key/value list of token addresses/balances to decimal converted key/value list of symbols/balances.

###### Arguments
| Type                           | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| *object*                       | *(address)*: *number/string*                                 |

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *object*                       | *(symbol)*: *number/string*                                  |

For consistency, we treat balances associated with token addresses as raw/wei values (before decimal conversion) and balances associated with token symbols as decimal converted values. **toSymbols** accepts key/value pairs of token addresses and balances, and will return the resulting key/value pairs of symbols and decimal converted balances.

the SDK server maintains an extensive list of symbol and decimal values for popular token addresses, but if no stored information is available a fallback is used to call erc20 contract methods to retrieve symbol and decimal values. In most cases this means no Ethereum node calls will need to be made to convert addresses to symbols - If you need to work with an address/symbol that doesn't have data listed, please advise the DeFi Pulse team so we can add it.

###### Example Call

```js
let result = await sdk.api.util.toSymbols({
  '0x0000000000000000000000000000000000000000': '1000000000000000000', // ETH
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': '2000000000000000000'  // DAI
});
```

###### Result

```js
{
  ethCallCount: 0,
  output: {
    ETH: '1',
    DAI: '2'
  }
}
```

### getLogs(*object*)

Get a list of event logs thrown by the smart contracts for a given set of arguments.

###### Arguments
| Type                           | Description                                                                                                              |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------ |
| *object*                       | *(target)*: *string*, *(topic)*: *string*, *(keys)*: *array[*string*]*, *(fromBlock)*: *number*, *(toBlock)*: *number*   |

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *array*                        | List of event logs                                           |

###### Example Call

```js
let result = await sdk.api.util.getLogs({
  target: '0x9424B1412450D0f8Fc2255FAf6046b98213B76Bd',
  topic: 'LOG_NEW_POOL(address,address)',
  keys: ['topics'],
  fromBlock: 9562480,
  toBlock: 10411347,
});
```

###### Result

```js
{
  ethCallCount: 0,
  output: [
    [
      "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
      "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
      "0x000000000000000000000000165a50bc092f6870dc111c349bae5fc35147ac86"
    ],
    [
      "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
      "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
      "0x00000000000000000000000057755f7dec33320bca83159c26e93751bfd30fbe"
    ],
    [
      "0x8ccec77b0cb63ac2cafd0f5de8cdfadab91ce656d262240ba8a6343bccc5f945",
      "0x00000000000000000000000018fa2ac3c88112e36eff15370346f9aff3161fd1",
      "0x000000000000000000000000e5d1fab0c5596ef846dcc0958d6d0b20e1ec4498"
    ],
    .....
    .....
  ]
}
```

### kyberTokens()

Get a list of tokens supported by Kyber Network.

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| output                         | *object*                       | *(address)*: *object(decimals, ethPrice, symbol)*            |


###### Example Call

```js
let result = await sdk.api.util.kyberTokens();
```

###### Result

```js
{
  output: {
    "0x41e5560054824ea6b0732e656e3ad64e20e94e45": {
      "symbol": "CVC",
      "decimals": 8,
      "ethPrice": 0.000110522618759956
    },
    "0x6b175474e89094c44da98b954eedeac495271d0f": {
      "symbol": "DAI",
      "decimals": 18,
      "ethPrice": 0.004182208587061177
    },
    "0x4f3afec4e5a3f2a6a1a411def7d7dfe50ee057bf": {
      "symbol": "DGX",
      "decimals": 9,
      "ethPrice": 0.22848731971224634
    },
    .......
    .......
}
```

### tokenList()

Get DefiPulse supported token list.

###### Example Call

```js
let result = await sdk.api.util.tokenList();
```

###### Result

```js
[
  {
    "symbol": "DAI",
    "contract": "0x6b175474e89094c44da98b954eedeac495271d0f"
  },
  {
    "symbol": "WETH",
    "contract": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
  },
  {
    "symbol": "WBTC",
    "contract": "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
  },
  .......
  .......
]
```

### lookupBlock(*number*)

Get the nearest block data for a given timestamp

###### Arguments
| Type                           | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| *number*                       | unix timestamp                                               |


###### Example Call

```js
let result = await sdk.api.util.lookupBlock(1594115200);
```

###### Result

```js
{
  "timestamp": 1594112400,
  "block": 10411347
}
```

## ERC20 - *sdk.api.erc20.___*

### symbol(*string*)

Get the symbol for a given token address.

###### Arguments
| Type                           | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| *string*                       | **(address)**                                                |

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *string*                       | Symbol                                                       |

###### Example

```js
let result = await sdk.api.erc20.symbol('0x6B175474E89094C44Da98b954EedeAC495271d0F');
```

###### Result:

```js
{
  ethCallCount: 0,
  output: 'DAI'
}
```

### decimals(*string*)

Get the decimals for a given token address.

###### Arguments
| Type                           | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| *string*                       | **(address)**                                                |

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *number*                       | Decimals                                                     |

###### Example

```js
let result = await sdk.api.erc20.decimals('0x6B175474E89094C44Da98b954EedeAC495271d0F');
```

###### Result:

```js
{
  ethCallCount: 0,
  output: 18
}
```

### info(*string*)

Get the symbol & decimals for a given token address.

###### Arguments
| Type                           | Description                                                  |
| ------------------------------ | ------------------------------------------------------------ |
| *string*                       | **(address)**                                                |

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output (keys ▼)                | *object* (values ▼)            |                                                              |
| -- symbol                      | *string*                       | Symbol                                                       |
| -- decimals                    | *number*                       | Decimals                                                     |

###### Example

```js
let result = await sdk.api.erc20.info('0x6B175474E89094C44Da98b954EedeAC495271d0F');
```

###### Result:

```js
{
  ethCallCount: 0,
  output: {
    symbol: 'DAI',
    decimals: 18
  }
}
```

### totalSupply(*object*)

Call the erc20 contract method totalSupply.

###### Options Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| target (required)              | *string* **(address)**         | Target address to make the call on                           |
| block (optional)               | *number*                       | Block number for the call                                    |
| decimals (optional)            | *number*                       | Will return a decimal converted result using this value      |

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *number/string*                | Result of the totalSupply call                               |

###### Example

```js
let result = await sdk.api.erc20.totalSupply({
  target: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  block: 9424366 
});
```

###### Result:

```js
{
  ethCallCount: 1,
  output: '62182748267'
}
```

### balanceOf(*object*)

Call the erc20 contract method balanceOf.

###### Options Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| target (required)              | *string* **(address)**         | Target address to make the call on                           |
| owner (required)               | *string* **(address)**         | Owner/wallet to check the balance of target token            |
| block (optional)               | *number*                       | Block number for the call                                    |
| decimals (optional)            | *number*                       | Will return a decimal converted result using this value      |

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *number/string*                | Result of the balanceOf call                                 |

###### Example

```js
let result = await sdk.api.erc20.balanceOf({
  target: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  owner: '0x3FfBa143f5e69Aa671C9f8e3843C88742b1FA2D9',
  block: 9424627
});
```

###### Result:

```js
{
  ethCallCount: 1,
  output: '3914724000000000000'
}
```

## ETH - *sdk.api.eth.___*

### getBalance(*object*)

get the ETH/wei balance for a given address.

###### Options Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| target (required)              | *string* **(address)**         | Target address to make the call on                           |
| block (optional)               | *number*                       | Block number for the call                                    |
| decimals (optional)            | *number*                       | Will return a decimal converted result using this value      |

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *number/string*                | ETH/wei balance                                              |

###### Example

```js
let result = await sdk.api.eth.getBalance({
  target: '0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b',
  block: 9424627
});
```

###### Result:

```js
{
  ethCallCount: 1,
  output: '2694789147548299731168'
}
```

### getBalances(*object*)

get the ETH/wei balances for a given list of addresses.

###### Options Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| targets (required)             | *array* **([address])**        | Target addresses to make the call on                           |
| block (optional)               | *number*                       | Block number for the call                                    |
| decimals (optional)            | *number*                       | Will return a decimal converted result using this value      |

###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *array/object*                 | ETH/wei balance                                              |

###### Example

```js
let result = await sdk.api.eth.getBalances({
  targets: ['0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b', '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359'],
  block: 9424627
});
```

###### Result:

```js
{
  ethCallCount: 2,
  output: [
    {
      target: '0xd5524179cB7AE012f5B642C1D6D700Bbaa76B96b',
      balance: '2694789147548299731168'
    },
    {
      target: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
      balance: '2694789147548299731168'
    }
  ]
}
```

## ABI - *sdk.api.abi.___*

Make Ethereum network calls using a provided ABI object.

For both single and multi ABI call methods, ABI's can be provided as a raw object, or for select cached methods, just a name string.

The following cached ABI's are available:
`erc20:symbol`
`erc20:decimals`
`erc20:balanceOf`
`erc20:totalSupply`

Even though equivelent api methods already exist for each of these, the are exposed here so they can also be used in batch calls as well.


### call(*object*)

Make a single ABI call.

###### Options Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| target (required)              | *string* **(address)**         | Target address to make the call on                           |
| abi (required)                 | *object* or *string*           | ABI object, or a string naming one of the pre-cached options |
| block (optional)               | *number*                       | Block number for the call                                    |
| params (optional)              | *string* or *array*            | Argument or list of arguments for the call                   |


###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *object* or *value*            | parsed object from the ABI, or just a value if only one output|

###### Example

```js
let result = await sdk.api.abi.call({
  target: '0x89d24a6b4ccb1b6faa2625fe562bdd9a23260359',
  params: '0x3FfBa143f5e69Aa671C9f8e3843C88742b1FA2D9',
  abi: 'erc20:balanceOf',
  block: 9424627
});
```

###### Result:

```js
{
  ethCallCount: 1,
  output: '3914724000000000000'
}
```

### multiCall(*object*)

Make a multiple calls in a batch sharing one ABI.

###### Options Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| abi (required)                 | *object* or *string*           | ABI object, or a string naming one of the pre-cached options |
| calls (required)               | *array*                        | Array of call objects                                        |
| block (optional)               | *number*                       | block number for the call                                    |
| target (optional)              | *string* **(address)**         | Target address to make all calls on, can be specified in call object instead if more than one target is in the batch |

###### Call Objects
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| params (optional)              | *string* or *array*            | Argument or list of arguments for the call                   |
| target (required)              | *string* **(address)**         | Target address to make all calls on, can instead be specified just once in the main options |


###### Return Object
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| ethCallCount                   | *number*                       | Number of Ethereum network calls used                        |
| output                         | *array*                        | Array of output objects                                      |

###### Output Objects
| Name                           | Type                           | Description                                                  |
| ------------------------------ | ------------------------------ | ------------------------------------------------------------ |
| input                          | *object*                       | object containing the target & array of parameters for the call|
| success                        | *bool*                         | true if the results could be parsed according to the ABI     |
| output                         | *object* or *value*            | parsed object from the ABI, or just a value if only one output|

###### Example

```js
let result = await sdk.api.abi.multiCall({
  calls: [
    {
      target: '0x0000000000085d4780B73119b644AE5ecd22b376',
      params: '0x802275979B020F0ec871c5eC1db6e412b72fF20b'
    },
    {
      target: '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359',
      params: '0xaf38668f4719ecf9452dc0300be3f6c83cbf3721'
    }
  ],
  abi: 'erc20:balanceOf',
  block: 9424627 
});
```

###### Result:

```js
{ 
  "ethCallCount":1,
  "output":[ 
    { 
      "input":{ 
        "target":"0x0000000000085d4780B73119b644AE5ecd22b376",
        "params":[ 
          "0x802275979B020F0ec871c5eC1db6e412b72fF20b"
        ]
      },
      "success":true,
      "output":"9075930471597257944363"
    },
    { 
      "input":{ 
        "target":"0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359",
        "params":[ 
          "0xaf38668f4719ecf9452dc0300be3f6c83cbf3721"
        ]
      },
      "success":true,
      "output":"14182595309792052635843"
    }
  ]
}
```

  

