/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

  const opportunityAbi = require('./abis/Opportunity.json');

/*==================================================
  Settings
  ==================================================*/

  const ETH_ADDRESS = '0x0000000000000000000000000000000000000000';
  const WETH_ADDRESS = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const SAI_ADDRESS = '0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359';
  const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';
  const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

  const tokenAddresses = [
    WETH_ADDRESS,
    SAI_ADDRESS,
    DAI_ADDRESS,
    USDC_ADDRESS
  ];

  const allOpportunities = [
    {
      address: '0xEa5ee32F3A63c3FaBb311c6E8c985D308A53dcC1', beginTimestamp: 1568057588, endTimestamp: null,
      coins: [SAI_ADDRESS, DAI_ADDRESS, USDC_ADDRESS, WETH_ADDRESS]
    },
    {
      address: '0xEB6394f817b498c423C44bD72c3D7f8ED5DeeC6e', beginTimestamp: 1568057609, endTimestamp: null,
      coins: [SAI_ADDRESS, DAI_ADDRESS, USDC_ADDRESS, WETH_ADDRESS], added: [0, 1575650224, 1568341399, 0]

    },
    {
      address: '0x759A728653C4d0483D897DCCf3a343fe2bBbb54A', beginTimestamp: 1570466036, endTimestamp: null,
      coins: [SAI_ADDRESS, DAI_ADDRESS, USDC_ADDRESS, WETH_ADDRESS]
    },
    {
      address: '0xC830217BD3000E92CE846C549de6a2A36AEa8954', beginTimestamp: 1575649643, endTimestamp: null,
      coins: [DAI_ADDRESS]
    },
  ];

  const allPortfolioManagers = [
    {
      address: '0x06a5Bf70BfF314177488864Fe03576ff608e6aec', beginTimestamp: 1568274392, endTimestamp: null
    }
  ];

/*==================================================
  Helper Functions
  ==================================================*/

  function getPmCalls(timestamp) {

    let pmCalls = [];
    let portfolioManagers = [];

    for (let i = 0 ; i < allPortfolioManagers.length; i++) {

      if (timestamp >= allPortfolioManagers[i].beginTimestamp &&
         ((allPortfolioManagers[i].endTimestamp == null) ||
           timestamp <= allPortfolioManagers[i].endTimestamp)) {

         let calls = _.reduce(tokenAddresses, (accum, tokenAddress) => [...accum, {
             target: tokenAddress,
             params: allPortfolioManagers[i].address
         }], []);

         for (let call of calls) {
           pmCalls.push(call);
         }

         portfolioManagers.push(allPortfolioManagers[i].address);
      }

    }

    return { pmCalls, portfolioManagers };
  }

  function getOpportunityCalls(timestamp) {

    let opportunityCalls = [];

    for (let i = 0 ; i < allOpportunities.length; i++) {

      if (timestamp >= allOpportunities[i].beginTimestamp &&
         ((allOpportunities[i].endTimestamp == null) ||
           timestamp <= allOpportunities[i].endTimestamp)) {

         let supportedTokens = allOpportunities[i].coins;

         if (allOpportunities[i].added) {
           supportedTokens = removeTokens(timestamp, supportedTokens, allOpportunities[i].added);
         }

         let calls = _.reduce(supportedTokens, (accum, tokenAddress) => [...accum,
           {
             target: allOpportunities[i].address,
             params: tokenAddress
         }], []);

          for (let call of calls) {
            opportunityCalls.push(call);
          }

      }
    }

    return opportunityCalls;
  }

  function removeTokens(timestamp, tokens, timestamps) {
    let offset = 0;

    for (let j = 0; j < timestamps.length; j++) {
      if (timestamp < timestamps[j]) {
        tokens.splice(j - offset, 1);
        offset++;
      }
    }

    return tokens;
  }

  function handlePmEthBalance(result, balances) {

    balances[WETH_ADDRESS] = BigNumber(balances[WETH_ADDRESS] || 0).plus(result.output).toFixed();
  }

  function handlePmErc20Balance(result, balances) {

    _.each(result.output, (balanceOf) => {

      if (balanceOf.success) {

        let balance = balanceOf.output;
        let address = balanceOf.input.target;

        if (BigNumber(balance).toNumber() <= 0) {
          return;
        }

        balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
      }
    });
  }

  function handleOpportunityBalance(result, balances) {

    _.each(result.output, (getBalance) => {

      if (getBalance.success) {

        let balance = getBalance.output;
        let address = getBalance.input.params;

        if (BigNumber(balance).toNumber() <= 0) {
          return;
        }

        balances[address] = BigNumber(balances[address] || 0).plus(balance).toFixed();
      }
    });
  }

/*==================================================
  Main
  ==================================================*/

  async function run(timestamp, block) {

    let balances = {};
    let promises = [];
    let calls;
    let { pmCalls, portfolioManagers } = getPmCalls(timestamp);
    let opportunityCalls = getOpportunityCalls(timestamp);

    for (let i = 0; i < portfolioManagers.length; i++) {
      promises.push(
        sdk.api.eth.getBalance({target: portfolioManagers[i], block})
        .then(result => {
                return {
                  type: 'pmEthBalance',
                  result: result
                }
              })
        );
    }

    calls = pmCalls;
    promises.push(
      sdk.api.abi.multiCall({
        block,
        calls,
        abi: 'erc20:balanceOf'
      }).then(result => {
        return {
          type: 'pmErc20Balance',
          result: result
        }
      })
    );

    calls = opportunityCalls;

    promises.push(
      sdk.api.abi.multiCall({
        block,
        calls,
        abi: opportunityAbi.getBalance
      }).then(result => {
        return {
          type: 'opportunityBalance',
          result: result
        }
      })
    );

    await Promise.all(promises).then( (results) => {
      for (let i = 0; i < results.length; i++) {

        switch (results[i].type) {
          case 'pmEthBalance':

            handlePmEthBalance(results[i].result, balances);
            break;

          case 'pmErc20Balance':

            handlePmErc20Balance(results[i].result, balances);
            break;

          case 'opportunityBalance':

            handleOpportunityBalance(results[i].result, balances);
            break;

          default:
            throw new Error(`${results[i].type} is an invalid case!`);

        }
      }
    });

    balances[ETH_ADDRESS] = balances[WETH_ADDRESS];
    delete balances[WETH_ADDRESS];

    return (await sdk.api.util.toSymbols(balances)).output;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Robo-Advisor for Yield',
    token: 'RAY',
    category: 'Lending',
    start: 1568274392,  // 09/12/2019 @ 7:46am (UTC)
    run
  }
