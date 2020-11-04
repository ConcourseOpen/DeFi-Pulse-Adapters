/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

/*==================================================
  Settings
  ==================================================*/

  const leverContracts = [
    {
      collateralAddress: "0xF7990E822b3e54578F705EC56726a20F8819C0e0",
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    {
      collateralAddress: "0x307ce78d979064785af8398918437580ffedf76e",
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    {
      collateralAddress: "0xdb6b0b4b65ac90f6f17414d5d415f0d5e84a2646",
      tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    {
      collateralAddress: "0x330abe83f9a0a1dea5ed5f9d856707065118f14b",
      tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    {
      collateralAddress: "0xF2615eAb6DFDf74882d2D1d60f5e7217Bd2ab221",
      tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    {
      collateralAddress: "0x3f320a0b08b93d7562c1f2d008d8154c44147620",
      tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    {
      collateralAddress: "0xEddc4cc4Eadf5a36E2A9d488FBc28Be02dc77aa6",
      tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    {
      collateralAddress: "0xa61F589E41f5e4D3bd7341540c500B661fC981bD",
      tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
    },
    {
      collateralAddress: "0x22A11B64Cb34F23330dFC0eB16bc86cD73333a31",
      tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    },
    {
      collateralAddress: "0x28A8dFFeE450fE04EC15519a4Ded2921Ec71845E",
      tokenAddress: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"
    },
    {
      collateralAddress: "0xe2338ad2d71E06b002fc31B79A85007D3FD81F3e",
      tokenAddress: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"
    },
    {
      collateralAddress: "0x391a12Ab01e6a4F8C3d2E7EcA8AF931bec704F15",
      tokenAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    }
  ];

  const walletTokens = [
    {
      "address": "0x0000000000000000000000000000000000000000",
      "keys": ['cEtherUnderlyingEtherBalance', 'etherBalance']
    },
    {
      "address": "0x6B175474E89094C44Da98b954EedeAC495271d0F",
      "keys": ['cDaiUnderlyingDaiBalance', 'daiBalance']
    },
    {
      "address": "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      "keys": ['cUsdcUnderlyingUsdcBalance', 'usdcBalance']
    },
  ]

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {
      '0x0000000000000000000000000000000000000000': '0', // ETH
    };

    // v1 *********************************************************************

    let kyberTokens = (await sdk.api.util.kyberTokens()).output;

    let collateralizerCalls = [];

    _.each(kyberTokens, (data, address) => {
      if(data.ethPrice) {
        collateralizerCalls.push({
          target: address,
          params: '0xEcC718386176D714DC9E4E35e177396B291499eE'
        });
      }
    });

    let collateralizerBalances = (await sdk.api.abi.multiCall({
      block,
      calls: collateralizerCalls,
      abi: 'erc20:balanceOf'
    })).output;

    _.each(collateralizerBalances, (balanceOf) => {
      if(balanceOf.success) {
        let balance = balanceOf.output;
        let address = balanceOf.input.target;

        if (BigNumber(balance).toNumber() <= 0) {
          return;
        }

        let kyberToken = kyberTokens[address];

        balances['0x0000000000000000000000000000000000000000'] = BigNumber(balances['0x0000000000000000000000000000000000000000']).plus(BigNumber(balance).times(kyberToken.ethPrice)).toFixed();

        balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
      }
    });

    let leverCalls = [];

    _.each(leverContracts, (leverContract) => {
      leverCalls.push({
        target: leverContract.tokenAddress,
        params: leverContract.collateralAddress
      });
    });

    let leverBalances = (await sdk.api.abi.multiCall({
      block,
      calls: leverCalls,
      abi: 'erc20:balanceOf'
    })).output;

    _.each(leverBalances, (balanceOf) => {
      if(balanceOf.success) {
        let balance = balanceOf.output;
        let address = balanceOf.input.target;

        if (BigNumber(balance).toNumber() <= 0) {
          return;
        }

        balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
      }
    });

    // v2 *********************************************************************

    if (block < 9518500) {
      let wallets = (await sdk.api.util.getLogs({
        target: '0xfc00C80b0000007F73004edB00094caD80626d8D',
        decodeParameter: 'address',
        topic: 'SmartWalletDeployed(address,address)',
        fromBlock: 8400000,
        toBlock: block
      })).output;

      let walletCalls = _.map(wallets, (wallet) => {
        return {
          target: wallet
        }
      });

      let walletBalances = (await sdk.api.abi.multiCall({
        block,
        calls: walletCalls,
        abi: {
          "inputs":[],
          "payable":false,
          "stateMutability":"view",
          "type":"function",
          "constant":true,
          "name":"getBalances",
          "outputs":[
            {
              "internalType":"uint256",
              "name":"daiBalance",
              "type":"uint256"
            },
            {
              "internalType":"uint256",
              "name":"usdcBalance",
              "type":"uint256"
            },
            {
              "internalType":"uint256",
              "name":"etherBalance",
              "type":"uint256"
            },
            {
              "internalType":"uint256",
              "name":"cDaiUnderlyingDaiBalance",
              "type":"uint256"
            },
            {
              "internalType":"uint256",
              "name":"cUsdcUnderlyingUsdcBalance",
              "type":"uint256"
            },
            {
              "internalType":"uint256",
              "name":"cEtherUnderlyingEtherBalance",
              "type":"uint256"
            }
          ]
        }
      })).output;

      _.each(walletBalances, (walletBalance) => {
        if(walletBalance.success) {
          _.each(walletTokens, (walletToken) => {
            let address = walletToken.address;

            _.each(walletToken.keys, (key) => {
              let balance = walletBalance.output[key];

              if (BigNumber(balance).toNumber() <= 0) {
                return;
              }

              balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
            });
          });
        }
      });
    } else {
      let dharmaDaiAddress = "0x00000000001876eB1444c986fD502e618c587430";
      let daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
      let dharmaUSDCAddress = "0x00000000008943c65cAf789FFFCF953bE156f6f8";
      let usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
      let totalSupplyUnderlyingABI = {
        "constant": true,
        "inputs": [],
        "name": "totalSupplyUnderlying",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "dTokenTotalSupplyInUnderlying",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      };

      let dharmaDaiUnderlyingBalance = (await sdk.api.abi.call({
        block,
        target: dharmaDaiAddress,
        abi: totalSupplyUnderlyingABI
      })).output;

      let dharmaDaiUnderlyingBalanceBN = BigNumber(
        dharmaDaiUnderlyingBalance || 0
      );
      if (dharmaDaiUnderlyingBalanceBN.toNumber() > 0) {
        balances[daiAddress] = dharmaDaiUnderlyingBalanceBN.toFixed();
      }

      let dharmaUSDCUnderlyingBalance = (await sdk.api.abi.call({
        block,
        target: dharmaUSDCAddress,
        abi: totalSupplyUnderlyingABI
      })).output;

      let dharmaUSDCUnderlyingBalanceBN = BigNumber(
        dharmaUSDCUnderlyingBalance || 0
      );
      if (dharmaUSDCUnderlyingBalanceBN.toNumber() > 0) {
        balances[usdcAddress] = dharmaUSDCUnderlyingBalanceBN.toFixed();
      }
    }

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Dharma',
    token: null,
    category: 'lending',
    contributesTo: ['Compound'],
    start: 1526947200, // 05/22/2018 @ 12:00am (UTC)
    tvl
  }
