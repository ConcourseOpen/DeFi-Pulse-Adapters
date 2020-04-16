module.exports = {
  fulcrum_token_registry: "0xD8dc30d298CCf40042991cB4B96A540d8aFFE73a",
  token_registry_ABI: [
    {
      constant: false,
      inputs: [
        { name: "_token", type: "address" },
        { name: "_asset", type: "address" },
        { name: "_name", type: "string" },
        { name: "_symbol", type: "string" },
        { name: "_type", type: "uint256" }
      ],
      name: "addToken",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "_name", type: "string" }],
      name: "getTokenAddressByName",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "_symbol", type: "string" }],
      name: "getTokenAddressBySymbol",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "_token", type: "address" }],
      name: "removeToken",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        { name: "_start", type: "uint256" },
        { name: "_count", type: "uint256" },
        { name: "_tokenType", type: "uint256" }
      ],
      name: "getTokens",
      outputs: [
        {
          components: [
            { name: "token", type: "address" },
            { name: "asset", type: "address" },
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "tokenType", type: "uint256" },
            { name: "index", type: "uint256" }
          ],
          name: "tokenData",
          type: "tuple[]"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "_tokens", type: "address[]" }],
      name: "removeTokens",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "_token", type: "address" }],
      name: "getTokenByAddress",
      outputs: [
        {
          components: [
            { name: "token", type: "address" },
            { name: "asset", type: "address" },
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "tokenType", type: "uint256" },
            { name: "index", type: "uint256" }
          ],
          name: "",
          type: "tuple"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        { name: "_token", type: "address" },
        { name: "_tokenType", type: "uint256" }
      ],
      name: "getTokenAsset",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "_tokens", type: "address[]" },
        { name: "_assets", type: "address[]" },
        { name: "_names", type: "string[]" },
        { name: "_symbols", type: "string[]" },
        { name: "_types", type: "uint256[]" }
      ],
      name: "addTokens",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "_token", type: "address" },
        { name: "_name", type: "string" }
      ],
      name: "setTokenName",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "", type: "address" }],
      name: "tokens",
      outputs: [
        { name: "token", type: "address" },
        { name: "asset", type: "address" },
        { name: "name", type: "string" },
        { name: "symbol", type: "string" },
        { name: "tokenType", type: "uint256" },
        { name: "index", type: "uint256" }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "", type: "uint256" }],
      name: "tokenAddresses",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "_name", type: "string" }],
      name: "getTokenByName",
      outputs: [
        {
          components: [
            { name: "token", type: "address" },
            { name: "asset", type: "address" },
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "tokenType", type: "uint256" },
            { name: "index", type: "uint256" }
          ],
          name: "",
          type: "tuple"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "getTokenAddresses",
      outputs: [{ name: "", type: "address[]" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "_symbol", type: "string" }],
      name: "getTokenBySymbol",
      outputs: [
        {
          components: [
            { name: "token", type: "address" },
            { name: "asset", type: "address" },
            { name: "name", type: "string" },
            { name: "symbol", type: "string" },
            { name: "tokenType", type: "uint256" },
            { name: "index", type: "uint256" }
          ],
          name: "",
          type: "tuple"
        }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [
        { name: "_token", type: "address" },
        { name: "_symbol", type: "string" }
      ],
      name: "setTokenSymbol",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "_newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        { name: "_token", type: "address" },
        { name: "_tokenType", type: "uint256" }
      ],
      name: "isTokenType",
      outputs: [{ name: "valid", type: "bool" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "previousOwner", type: "address" },
        { indexed: true, name: "newOwner", type: "address" }
      ],
      name: "OwnershipTransferred",
      type: "event"
    }
  ],
  iToken_ABI: [
    {
      constant: true,
      inputs: [],
      name: "name",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "burntTokenReserved",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "totalSupply",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "initialPrice",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "baseRate",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "totalAssetBorrow",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "", type: "bytes32" }],
      name: "loanOrderData",
      outputs: [
        { name: "loanOrderHash", type: "bytes32" },
        { name: "leverageAmount", type: "uint256" },
        { name: "initialMarginAmount", type: "uint256" },
        { name: "maintenanceMarginAmount", type: "uint256" },
        { name: "maxDurationUnixTimestampSec", type: "uint256" },
        { name: "index", type: "uint256" }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "decimals",
      outputs: [{ name: "", type: "uint8" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "rateMultiplier",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "wethContract",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "_owner", type: "address" }],
      name: "balanceOf",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "tokenizedRegistry",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "_newTarget", type: "address" }],
      name: "setTarget",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "", type: "uint256" }],
      name: "burntTokenReserveList",
      outputs: [
        { name: "lender", type: "address" },
        { name: "amount", type: "uint256" }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "loanTokenAddress",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "bZxVault",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "owner",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "symbol",
      outputs: [{ name: "", type: "string" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "bZxOracle",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "bZxContract",
      outputs: [{ name: "", type: "address" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "", type: "uint256" }],
      name: "leverageList",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [],
      name: "spreadMultiplier",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [
        { name: "_owner", type: "address" },
        { name: "_spender", type: "address" }
      ],
      name: "allowance",
      outputs: [{ name: "", type: "uint256" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: false,
      inputs: [{ name: "_newOwner", type: "address" }],
      name: "transferOwnership",
      outputs: [],
      payable: false,
      stateMutability: "nonpayable",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "", type: "address" }],
      name: "burntTokenReserveListIndex",
      outputs: [
        { name: "index", type: "uint256" },
        { name: "isSet", type: "bool" }
      ],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      constant: true,
      inputs: [{ name: "", type: "uint256" }],
      name: "loanOrderHashes",
      outputs: [{ name: "", type: "bytes32" }],
      payable: false,
      stateMutability: "view",
      type: "function"
    },
    {
      inputs: [{ name: "_newTarget", type: "address" }],
      payable: false,
      stateMutability: "nonpayable",
      type: "constructor"
    },
    { payable: true, stateMutability: "payable", type: "fallback" },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "from", type: "address" },
        { indexed: true, name: "to", type: "address" },
        { indexed: false, name: "value", type: "uint256" }
      ],
      name: "Transfer",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "owner", type: "address" },
        { indexed: true, name: "spender", type: "address" },
        { indexed: false, name: "value", type: "uint256" }
      ],
      name: "Approval",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "minter", type: "address" },
        { indexed: false, name: "tokenAmount", type: "uint256" },
        { indexed: false, name: "assetAmount", type: "uint256" },
        { indexed: false, name: "price", type: "uint256" }
      ],
      name: "Mint",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "burner", type: "address" },
        { indexed: false, name: "tokenAmount", type: "uint256" },
        { indexed: false, name: "assetAmount", type: "uint256" },
        { indexed: false, name: "price", type: "uint256" }
      ],
      name: "Burn",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "borrower", type: "address" },
        { indexed: false, name: "borrowAmount", type: "uint256" },
        { indexed: false, name: "interestRate", type: "uint256" },
        { indexed: false, name: "collateralTokenAddress", type: "address" },
        { indexed: false, name: "tradeTokenToFillAddress", type: "address" },
        { indexed: false, name: "withdrawOnOpen", type: "bool" }
      ],
      name: "Borrow",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "claimant", type: "address" },
        { indexed: false, name: "tokenAmount", type: "uint256" },
        { indexed: false, name: "assetAmount", type: "uint256" },
        { indexed: false, name: "remainingTokenAmount", type: "uint256" },
        { indexed: false, name: "price", type: "uint256" }
      ],
      name: "Claim",
      type: "event"
    },
    {
      anonymous: false,
      inputs: [
        { indexed: true, name: "previousOwner", type: "address" },
        { indexed: true, name: "newOwner", type: "address" }
      ],
      name: "OwnershipTransferred",
      type: "event"
    }
  ],
  tokens: [
    {
      name: "DAI",
      token: "0x6b175474e89094c44da98b954eedeac495271d0f",
      iToken: "0x493C57C4763932315A328269E1ADaD09653B9081"
    },
    {
      name: "SUSD",
      token: "0x57ab1e02fee23774580c119740129eac7081e9d3",
      iToken: "0x49f4592E641820e928F9919Ef4aBd92a719B4b49"
    }
  ],
  CHAI: {
    name: 'CHAI',
    ABI: [{"inputs":[],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"guy","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"src","type":"address"},{"indexed":true,"internalType":"address","name":"dst","type":"address"},{"indexed":false,"internalType":"uint256","name":"wad","type":"uint256"}],"name":"Transfer","type":"event"},{"constant":true,"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"usr","type":"address"}],"name":"dai","outputs":[{"internalType":"uint256","name":"wad","type":"uint256"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"daiJoin","outputs":[{"internalType":"contract JoinLike","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"daiToken","outputs":[{"internalType":"contract GemLike","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"draw","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"exit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"join","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"move","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"holder","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"nonce","type":"uint256"},{"internalType":"uint256","name":"expiry","type":"uint256"},{"internalType":"bool","name":"allowed","type":"bool"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pot","outputs":[{"internalType":"contract PotLike","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"internalType":"address","name":"src","type":"address"},{"internalType":"address","name":"dst","type":"address"},{"internalType":"uint256","name":"wad","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"vat","outputs":[{"internalType":"contract VatLike","name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"version","outputs":[{"internalType":"string","name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"}],
    token: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    POT: '0x197e90f9fad81970ba7976f33cbd77088e5d7cf7'
  }
};
