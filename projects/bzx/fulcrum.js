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

  // 20200416231940
  // https://artifacts.fulcrum.trade/mainnet/iToken.json
  iToken_ABI: [
      {
        "constant": true,
        "inputs": [

        ],
        "name": "name",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_spender",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "approve",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "burntTokenReserved",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "totalSupply",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "initialPrice",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "baseRate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "totalAssetBorrow",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "name": "loanOrderData",
        "outputs": [
          {
            "name": "loanOrderHash",
            "type": "bytes32"
          },
          {
            "name": "leverageAmount",
            "type": "uint256"
          },
          {
            "name": "initialMarginAmount",
            "type": "uint256"
          },
          {
            "name": "maintenanceMarginAmount",
            "type": "uint256"
          },
          {
            "name": "maxDurationUnixTimestampSec",
            "type": "uint256"
          },
          {
            "name": "index",
            "type": "uint256"
          },
          {
            "name": "marginPremiumAmount",
            "type": "uint256"
          },
          {
            "name": "collateralTokenAddress",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "decimals",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "rateMultiplier",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "wethContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "tokenizedRegistry",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "burntTokenReserveList",
        "outputs": [
          {
            "name": "lender",
            "type": "address"
          },
          {
            "name": "amount",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "loanTokenAddress",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "checkpointSupply",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "bZxVault",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "owner",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "symbol",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "bZxOracle",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "bZxContract",
        "outputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "leverageList",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "spreadMultiplier",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          },
          {
            "name": "_spender",
            "type": "address"
          }
        ],
        "name": "allowance",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [

        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "address"
          }
        ],
        "name": "burntTokenReserveListIndex",
        "outputs": [
          {
            "name": "index",
            "type": "uint256"
          },
          {
            "name": "isSet",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "name": "loanOrderHashes",
        "outputs": [
          {
            "name": "",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "fallback"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "from",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "to",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Transfer",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "owner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "spender",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "value",
            "type": "uint256"
          }
        ],
        "name": "Approval",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "minter",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "tokenAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "assetAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "price",
            "type": "uint256"
          }
        ],
        "name": "Mint",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "burner",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "tokenAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "assetAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "price",
            "type": "uint256"
          }
        ],
        "name": "Burn",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "borrower",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "borrowAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "interestRate",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "collateralTokenAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "tradeTokenToFillAddress",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "withdrawOnOpen",
            "type": "bool"
          }
        ],
        "name": "Borrow",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "loanOrderHash",
            "type": "bytes32"
          },
          {
            "indexed": true,
            "name": "borrower",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "closer",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "amount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "isLiquidation",
            "type": "bool"
          }
        ],
        "name": "Repay",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "claimant",
            "type": "address"
          },
          {
            "indexed": false,
            "name": "tokenAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "assetAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "remainingTokenAmount",
            "type": "uint256"
          },
          {
            "indexed": false,
            "name": "price",
            "type": "uint256"
          }
        ],
        "name": "Claim",
        "type": "event"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "receiver",
            "type": "address"
          }
        ],
        "name": "mintWithEther",
        "outputs": [
          {
            "name": "mintAmount",
            "type": "uint256"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "receiver",
            "type": "address"
          },
          {
            "name": "depositAmount",
            "type": "uint256"
          }
        ],
        "name": "mint",
        "outputs": [
          {
            "name": "mintAmount",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "receiver",
            "type": "address"
          },
          {
            "name": "burnAmount",
            "type": "uint256"
          }
        ],
        "name": "burnToEther",
        "outputs": [
          {
            "name": "loanAmountPaid",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "receiver",
            "type": "address"
          },
          {
            "name": "burnAmount",
            "type": "uint256"
          }
        ],
        "name": "burn",
        "outputs": [
          {
            "name": "loanAmountPaid",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "borrowAmount",
            "type": "uint256"
          },
          {
            "name": "borrower",
            "type": "address"
          },
          {
            "name": "target",
            "type": "address"
          },
          {
            "name": "signature",
            "type": "string"
          },
          {
            "name": "data",
            "type": "bytes"
          }
        ],
        "name": "flashBorrowToken",
        "outputs": [

        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "borrowAmount",
            "type": "uint256"
          },
          {
            "name": "leverageAmount",
            "type": "uint256"
          },
          {
            "name": "initialLoanDuration",
            "type": "uint256"
          },
          {
            "name": "collateralTokenSent",
            "type": "uint256"
          },
          {
            "name": "borrower",
            "type": "address"
          },
          {
            "name": "receiver",
            "type": "address"
          },
          {
            "name": "collateralTokenAddress",
            "type": "address"
          },
          {
            "name": "loanDataBytes",
            "type": "bytes"
          }
        ],
        "name": "borrowTokenFromDeposit",
        "outputs": [
          {
            "name": "loanOrderHash",
            "type": "bytes32"
          }
        ],
        "payable": true,
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "borrowAmount",
            "type": "uint256"
          },
          {
            "name": "leverageAmount",
            "type": "uint256"
          },
          {
            "name": "interestInitialAmount",
            "type": "uint256"
          },
          {
            "name": "loanTokenSent",
            "type": "uint256"
          },
          {
            "name": "collateralTokenSent",
            "type": "uint256"
          },
          {
            "name": "tradeTokenSent",
            "type": "uint256"
          },
          {
            "name": "borrower",
            "type": "address"
          },
          {
            "name": "receiver",
            "type": "address"
          },
          {
            "name": "collateralTokenAddress",
            "type": "address"
          },
          {
            "name": "tradeTokenAddress",
            "type": "address"
          },
          {
            "name": "loanDataBytes",
            "type": "bytes"
          }
        ],
        "name": "borrowTokenAndUse",
        "outputs": [
          {
            "name": "loanOrderHash",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "depositAmount",
            "type": "uint256"
          },
          {
            "name": "leverageAmount",
            "type": "uint256"
          },
          {
            "name": "loanTokenSent",
            "type": "uint256"
          },
          {
            "name": "collateralTokenSent",
            "type": "uint256"
          },
          {
            "name": "tradeTokenSent",
            "type": "uint256"
          },
          {
            "name": "trader",
            "type": "address"
          },
          {
            "name": "depositTokenAddress",
            "type": "address"
          },
          {
            "name": "collateralTokenAddress",
            "type": "address"
          },
          {
            "name": "tradeTokenAddress",
            "type": "address"
          },
          {
            "name": "loanDataBytes",
            "type": "bytes"
          }
        ],
        "name": "marginTradeFromDeposit",
        "outputs": [
          {
            "name": "loanOrderHash",
            "type": "bytes32"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_from",
            "type": "address"
          },
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transferFrom",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "tokenPrice",
        "outputs": [
          {
            "name": "price",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_user",
            "type": "address"
          }
        ],
        "name": "checkpointPrice",
        "outputs": [
          {
            "name": "price",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "marketLiquidity",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "protocolInterestRate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "borrowInterestRate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "borrowAmount",
            "type": "uint256"
          }
        ],
        "name": "nextBorrowInterestRate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "borrowAmount",
            "type": "uint256"
          },
          {
            "name": "useFixedInterestModel",
            "type": "bool"
          }
        ],
        "name": "nextBorrowInterestRateWithOption",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "avgBorrowInterestRate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "supplyInterestRate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "supplyAmount",
            "type": "uint256"
          }
        ],
        "name": "nextSupplyInterestRate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "assetSupply",
            "type": "uint256"
          }
        ],
        "name": "totalSupplyInterestRate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "totalAssetSupply",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "leverageAmount",
            "type": "uint256"
          }
        ],
        "name": "getMaxEscrowAmount",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [

        ],
        "name": "getLeverageList",
        "outputs": [
          {
            "name": "",
            "type": "uint256[]"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "loanOrderHash",
            "type": "bytes32"
          }
        ],
        "name": "getLoanData",
        "outputs": [
          {
            "components": [
              {
                "name": "loanOrderHash",
                "type": "bytes32"
              },
              {
                "name": "leverageAmount",
                "type": "uint256"
              },
              {
                "name": "initialMarginAmount",
                "type": "uint256"
              },
              {
                "name": "maintenanceMarginAmount",
                "type": "uint256"
              },
              {
                "name": "maxDurationUnixTimestampSec",
                "type": "uint256"
              },
              {
                "name": "index",
                "type": "uint256"
              },
              {
                "name": "marginPremiumAmount",
                "type": "uint256"
              },
              {
                "name": "collateralTokenAddress",
                "type": "address"
              }
            ],
            "name": "",
            "type": "tuple"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "assetBalanceOf",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "borrowAmount",
            "type": "uint256"
          },
          {
            "name": "leverageAmount",
            "type": "uint256"
          },
          {
            "name": "initialLoanDuration",
            "type": "uint256"
          },
          {
            "name": "collateralTokenAddress",
            "type": "address"
          }
        ],
        "name": "getDepositAmountForBorrow",
        "outputs": [
          {
            "name": "depositAmount",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "depositAmount",
            "type": "uint256"
          },
          {
            "name": "leverageAmount",
            "type": "uint256"
          },
          {
            "name": "initialLoanDuration",
            "type": "uint256"
          },
          {
            "name": "collateralTokenAddress",
            "type": "address"
          }
        ],
        "name": "getBorrowAmountForDeposit",
        "outputs": [
          {
            "name": "borrowAmount",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "assetBorrow",
            "type": "uint256"
          },
          {
            "name": "assetSupply",
            "type": "uint256"
          }
        ],
        "name": "_supplyInterestRate",
        "outputs": [
          {
            "name": "",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "components": [
              {
                "name": "loanTokenAddress",
                "type": "address"
              },
              {
                "name": "interestTokenAddress",
                "type": "address"
              },
              {
                "name": "collateralTokenAddress",
                "type": "address"
              },
              {
                "name": "oracleAddress",
                "type": "address"
              },
              {
                "name": "loanTokenAmount",
                "type": "uint256"
              },
              {
                "name": "interestAmount",
                "type": "uint256"
              },
              {
                "name": "initialMarginAmount",
                "type": "uint256"
              },
              {
                "name": "maintenanceMarginAmount",
                "type": "uint256"
              },
              {
                "name": "maxDurationUnixTimestampSec",
                "type": "uint256"
              },
              {
                "name": "loanOrderHash",
                "type": "bytes32"
              }
            ],
            "name": "loanOrder",
            "type": "tuple"
          },
          {
            "components": [
              {
                "name": "trader",
                "type": "address"
              },
              {
                "name": "collateralTokenAddressFilled",
                "type": "address"
              },
              {
                "name": "positionTokenAddressFilled",
                "type": "address"
              },
              {
                "name": "loanTokenAmountFilled",
                "type": "uint256"
              },
              {
                "name": "loanTokenAmountUsed",
                "type": "uint256"
              },
              {
                "name": "collateralTokenAmountFilled",
                "type": "uint256"
              },
              {
                "name": "positionTokenAmountFilled",
                "type": "uint256"
              },
              {
                "name": "loanStartUnixTimestampSec",
                "type": "uint256"
              },
              {
                "name": "loanEndUnixTimestampSec",
                "type": "uint256"
              },
              {
                "name": "active",
                "type": "bool"
              },
              {
                "name": "positionId",
                "type": "uint256"
              }
            ],
            "name": "loanPosition",
            "type": "tuple"
          },
          {
            "name": "loanCloser",
            "type": "address"
          },
          {
            "name": "closeAmount",
            "type": "uint256"
          },
          {
            "name": "isLiquidation",
            "type": "bool"
          }
        ],
        "name": "closeLoanNotifier",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "settingsTarget",
            "type": "address"
          },
          {
            "name": "callData",
            "type": "bytes"
          }
        ],
        "name": "updateSettings",
        "outputs": [

        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
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
    // 20200416233449
    // https://artifacts.fulcrum.trade/mainnet/iToken_Chai.json
    ABI: [
        {
          "constant": true,
          "inputs": [

          ],
          "name": "name",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_spender",
              "type": "address"
            },
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "approve",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "burntTokenReserved",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "totalSupply",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "initialPrice",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "baseRate",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "totalAssetBorrow",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "bytes32"
            }
          ],
          "name": "loanOrderData",
          "outputs": [
            {
              "name": "loanOrderHash",
              "type": "bytes32"
            },
            {
              "name": "leverageAmount",
              "type": "uint256"
            },
            {
              "name": "initialMarginAmount",
              "type": "uint256"
            },
            {
              "name": "maintenanceMarginAmount",
              "type": "uint256"
            },
            {
              "name": "maxDurationUnixTimestampSec",
              "type": "uint256"
            },
            {
              "name": "index",
              "type": "uint256"
            },
            {
              "name": "marginPremiumAmount",
              "type": "uint256"
            },
            {
              "name": "collateralTokenAddress",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "decimals",
          "outputs": [
            {
              "name": "",
              "type": "uint8"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "rateMultiplier",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "wethContract",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "pot",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_owner",
              "type": "address"
            }
          ],
          "name": "balanceOf",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "tokenizedRegistry",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "burntTokenReserveList",
          "outputs": [
            {
              "name": "lender",
              "type": "address"
            },
            {
              "name": "amount",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "loanTokenAddress",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "checkpointSupply",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "bZxVault",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "owner",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "symbol",
          "outputs": [
            {
              "name": "",
              "type": "string"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "bZxOracle",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "bZxContract",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "leverageList",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "chai",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "spreadMultiplier",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_owner",
              "type": "address"
            },
            {
              "name": "_spender",
              "type": "address"
            }
          ],
          "name": "allowance",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_newOwner",
              "type": "address"
            }
          ],
          "name": "transferOwnership",
          "outputs": [

          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "dai",
          "outputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "address"
            }
          ],
          "name": "burntTokenReserveListIndex",
          "outputs": [
            {
              "name": "index",
              "type": "uint256"
            },
            {
              "name": "isSet",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "name": "loanOrderHashes",
          "outputs": [
            {
              "name": "",
              "type": "bytes32"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "fallback"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "from",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "to",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Transfer",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "owner",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "spender",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "value",
              "type": "uint256"
            }
          ],
          "name": "Approval",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "minter",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "tokenAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "assetAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "price",
              "type": "uint256"
            }
          ],
          "name": "Mint",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "burner",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "tokenAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "assetAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "price",
              "type": "uint256"
            }
          ],
          "name": "Burn",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "borrower",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "borrowAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "interestRate",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "collateralTokenAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "tradeTokenToFillAddress",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "withdrawOnOpen",
              "type": "bool"
            }
          ],
          "name": "Borrow",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "loanOrderHash",
              "type": "bytes32"
            },
            {
              "indexed": true,
              "name": "borrower",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "closer",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "amount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "isLiquidation",
              "type": "bool"
            }
          ],
          "name": "Repay",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "claimant",
              "type": "address"
            },
            {
              "indexed": false,
              "name": "tokenAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "assetAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "remainingTokenAmount",
              "type": "uint256"
            },
            {
              "indexed": false,
              "name": "price",
              "type": "uint256"
            }
          ],
          "name": "Claim",
          "type": "event"
        },
        {
          "anonymous": false,
          "inputs": [
            {
              "indexed": true,
              "name": "previousOwner",
              "type": "address"
            },
            {
              "indexed": true,
              "name": "newOwner",
              "type": "address"
            }
          ],
          "name": "OwnershipTransferred",
          "type": "event"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "receiver",
              "type": "address"
            },
            {
              "name": "depositAmount",
              "type": "uint256"
            }
          ],
          "name": "mintWithChai",
          "outputs": [
            {
              "name": "mintAmount",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "receiver",
              "type": "address"
            },
            {
              "name": "depositAmount",
              "type": "uint256"
            }
          ],
          "name": "mint",
          "outputs": [
            {
              "name": "mintAmount",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "receiver",
              "type": "address"
            },
            {
              "name": "burnAmount",
              "type": "uint256"
            }
          ],
          "name": "burnToChai",
          "outputs": [
            {
              "name": "chaiAmountPaid",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "receiver",
              "type": "address"
            },
            {
              "name": "burnAmount",
              "type": "uint256"
            }
          ],
          "name": "burn",
          "outputs": [
            {
              "name": "loanAmountPaid",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "borrowAmount",
              "type": "uint256"
            },
            {
              "name": "borrower",
              "type": "address"
            },
            {
              "name": "target",
              "type": "address"
            },
            {
              "name": "signature",
              "type": "string"
            },
            {
              "name": "data",
              "type": "bytes"
            }
          ],
          "name": "flashBorrowToken",
          "outputs": [

          ],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "borrowAmount",
              "type": "uint256"
            },
            {
              "name": "leverageAmount",
              "type": "uint256"
            },
            {
              "name": "initialLoanDuration",
              "type": "uint256"
            },
            {
              "name": "collateralTokenSent",
              "type": "uint256"
            },
            {
              "name": "borrower",
              "type": "address"
            },
            {
              "name": "receiver",
              "type": "address"
            },
            {
              "name": "collateralTokenAddress",
              "type": "address"
            },
            {
              "name": "loanDataBytes",
              "type": "bytes"
            }
          ],
          "name": "borrowTokenFromDeposit",
          "outputs": [
            {
              "name": "loanOrderHash",
              "type": "bytes32"
            }
          ],
          "payable": true,
          "stateMutability": "payable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "borrowAmount",
              "type": "uint256"
            },
            {
              "name": "leverageAmount",
              "type": "uint256"
            },
            {
              "name": "interestInitialAmount",
              "type": "uint256"
            },
            {
              "name": "loanTokenSent",
              "type": "uint256"
            },
            {
              "name": "collateralTokenSent",
              "type": "uint256"
            },
            {
              "name": "tradeTokenSent",
              "type": "uint256"
            },
            {
              "name": "borrower",
              "type": "address"
            },
            {
              "name": "receiver",
              "type": "address"
            },
            {
              "name": "collateralTokenAddress",
              "type": "address"
            },
            {
              "name": "tradeTokenAddress",
              "type": "address"
            },
            {
              "name": "loanDataBytes",
              "type": "bytes"
            }
          ],
          "name": "borrowTokenAndUse",
          "outputs": [
            {
              "name": "loanOrderHash",
              "type": "bytes32"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "depositAmount",
              "type": "uint256"
            },
            {
              "name": "leverageAmount",
              "type": "uint256"
            },
            {
              "name": "loanTokenSent",
              "type": "uint256"
            },
            {
              "name": "collateralTokenSent",
              "type": "uint256"
            },
            {
              "name": "tradeTokenSent",
              "type": "uint256"
            },
            {
              "name": "trader",
              "type": "address"
            },
            {
              "name": "depositTokenAddress",
              "type": "address"
            },
            {
              "name": "collateralTokenAddress",
              "type": "address"
            },
            {
              "name": "tradeTokenAddress",
              "type": "address"
            },
            {
              "name": "loanDataBytes",
              "type": "bytes"
            }
          ],
          "name": "marginTradeFromDeposit",
          "outputs": [
            {
              "name": "loanOrderHash",
              "type": "bytes32"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_to",
              "type": "address"
            },
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "transfer",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "_from",
              "type": "address"
            },
            {
              "name": "_to",
              "type": "address"
            },
            {
              "name": "_value",
              "type": "uint256"
            }
          ],
          "name": "transferFrom",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "dsr",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "chaiPrice",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "tokenPrice",
          "outputs": [
            {
              "name": "price",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_user",
              "type": "address"
            }
          ],
          "name": "checkpointPrice",
          "outputs": [
            {
              "name": "price",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "marketLiquidity",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "protocolInterestRate",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "borrowInterestRate",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "borrowAmount",
              "type": "uint256"
            }
          ],
          "name": "nextBorrowInterestRate",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "borrowAmount",
              "type": "uint256"
            },
            {
              "name": "useFixedInterestModel",
              "type": "bool"
            }
          ],
          "name": "nextBorrowInterestRateWithOption",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "avgBorrowInterestRate",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "supplyInterestRate",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "supplyAmount",
              "type": "uint256"
            }
          ],
          "name": "nextSupplyInterestRate",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "assetSupply",
              "type": "uint256"
            }
          ],
          "name": "totalSupplyInterestRate",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "totalAssetSupply",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "leverageAmount",
              "type": "uint256"
            }
          ],
          "name": "getMaxEscrowAmount",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [

          ],
          "name": "getLeverageList",
          "outputs": [
            {
              "name": "",
              "type": "uint256[]"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "loanOrderHash",
              "type": "bytes32"
            }
          ],
          "name": "getLoanData",
          "outputs": [
            {
              "components": [
                {
                  "name": "loanOrderHash",
                  "type": "bytes32"
                },
                {
                  "name": "leverageAmount",
                  "type": "uint256"
                },
                {
                  "name": "initialMarginAmount",
                  "type": "uint256"
                },
                {
                  "name": "maintenanceMarginAmount",
                  "type": "uint256"
                },
                {
                  "name": "maxDurationUnixTimestampSec",
                  "type": "uint256"
                },
                {
                  "name": "index",
                  "type": "uint256"
                },
                {
                  "name": "marginPremiumAmount",
                  "type": "uint256"
                },
                {
                  "name": "collateralTokenAddress",
                  "type": "address"
                }
              ],
              "name": "",
              "type": "tuple"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "_owner",
              "type": "address"
            }
          ],
          "name": "assetBalanceOf",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "borrowAmount",
              "type": "uint256"
            },
            {
              "name": "leverageAmount",
              "type": "uint256"
            },
            {
              "name": "initialLoanDuration",
              "type": "uint256"
            },
            {
              "name": "collateralTokenAddress",
              "type": "address"
            }
          ],
          "name": "getDepositAmountForBorrow",
          "outputs": [
            {
              "name": "depositAmount",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "depositAmount",
              "type": "uint256"
            },
            {
              "name": "leverageAmount",
              "type": "uint256"
            },
            {
              "name": "initialLoanDuration",
              "type": "uint256"
            },
            {
              "name": "collateralTokenAddress",
              "type": "address"
            }
          ],
          "name": "getBorrowAmountForDeposit",
          "outputs": [
            {
              "name": "borrowAmount",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [

          ],
          "name": "setupChai",
          "outputs": [

          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "assetBorrow",
              "type": "uint256"
            },
            {
              "name": "assetSupply",
              "type": "uint256"
            }
          ],
          "name": "_supplyInterestRate",
          "outputs": [
            {
              "name": "",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "view",
          "type": "function"
        },
        {
          "constant": true,
          "inputs": [
            {
              "name": "x",
              "type": "uint256"
            },
            {
              "name": "n",
              "type": "uint256"
            },
            {
              "name": "base",
              "type": "uint256"
            }
          ],
          "name": "rpow",
          "outputs": [
            {
              "name": "z",
              "type": "uint256"
            }
          ],
          "payable": false,
          "stateMutability": "pure",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "components": [
                {
                  "name": "loanTokenAddress",
                  "type": "address"
                },
                {
                  "name": "interestTokenAddress",
                  "type": "address"
                },
                {
                  "name": "collateralTokenAddress",
                  "type": "address"
                },
                {
                  "name": "oracleAddress",
                  "type": "address"
                },
                {
                  "name": "loanTokenAmount",
                  "type": "uint256"
                },
                {
                  "name": "interestAmount",
                  "type": "uint256"
                },
                {
                  "name": "initialMarginAmount",
                  "type": "uint256"
                },
                {
                  "name": "maintenanceMarginAmount",
                  "type": "uint256"
                },
                {
                  "name": "maxDurationUnixTimestampSec",
                  "type": "uint256"
                },
                {
                  "name": "loanOrderHash",
                  "type": "bytes32"
                }
              ],
              "name": "loanOrder",
              "type": "tuple"
            },
            {
              "components": [
                {
                  "name": "trader",
                  "type": "address"
                },
                {
                  "name": "collateralTokenAddressFilled",
                  "type": "address"
                },
                {
                  "name": "positionTokenAddressFilled",
                  "type": "address"
                },
                {
                  "name": "loanTokenAmountFilled",
                  "type": "uint256"
                },
                {
                  "name": "loanTokenAmountUsed",
                  "type": "uint256"
                },
                {
                  "name": "collateralTokenAmountFilled",
                  "type": "uint256"
                },
                {
                  "name": "positionTokenAmountFilled",
                  "type": "uint256"
                },
                {
                  "name": "loanStartUnixTimestampSec",
                  "type": "uint256"
                },
                {
                  "name": "loanEndUnixTimestampSec",
                  "type": "uint256"
                },
                {
                  "name": "active",
                  "type": "bool"
                },
                {
                  "name": "positionId",
                  "type": "uint256"
                }
              ],
              "name": "loanPosition",
              "type": "tuple"
            },
            {
              "name": "loanCloser",
              "type": "address"
            },
            {
              "name": "closeAmount",
              "type": "uint256"
            },
            {
              "name": "isLiquidation",
              "type": "bool"
            }
          ],
          "name": "closeLoanNotifier",
          "outputs": [
            {
              "name": "",
              "type": "bool"
            }
          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        },
        {
          "constant": false,
          "inputs": [
            {
              "name": "settingsTarget",
              "type": "address"
            },
            {
              "name": "callData",
              "type": "bytes"
            }
          ],
          "name": "updateSettings",
          "outputs": [

          ],
          "payable": false,
          "stateMutability": "nonpayable",
          "type": "function"
        }
      ],
    token: '0x06AF07097C9Eeb7fD685c692751D5C66dB49c215',
    POT: '0x197e90f9fad81970ba7976f33cbd77088e5d7cf7'
  }
};
