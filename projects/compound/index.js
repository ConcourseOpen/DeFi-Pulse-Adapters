/*==================================================
  Modules
  ==================================================*/

  const sdk = require('../../sdk');
  const _ = require('underscore');
  const BigNumber = require('bignumber.js');

  const abi = require('./abi.json');

/*==================================================
  TVL
  ==================================================*/

  async function tvl(timestamp, block) {
    let balances = {};

    let tokens = (await sdk.api.cdp.compound.tokens()).output;

    // V1

    let balanceOfResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(tokens, (token, address) => ({
        target: address,
        params: '0x3FDA67f7583380E67ef93072294a7fAc882FD7E7'
      })),
      abi: 'erc20:balanceOf'
    });

    await sdk.util.sumMultiBalanceOf(balances, balanceOfResults);

    // V2

    let getCashResults = await sdk.api.abi.multiCall({
      block,
      calls: _.map(tokens, (token, address) => ({
        target: token.cToken
      })),
      abi: {
        "constant":true,
        "inputs":[

        ],
        "name":"getCash",
        "outputs":[
          {
            "name":"",
            "type":"uint256"
          }
        ],
        "payable":false,
        "signature":"0x3b1d21a2",
        "stateMutability":"view",
        "type":"function"
      }
    });

    _.each(tokens, (token, address) => {
      let getCash = _.find(getCashResults.output, (result) => { return result.success && result.input.target == token.cToken});

      if(getCash) {
        balances[address] = BigNumber(balances[address] || 0).plus(getCash.output).toFixed();
      }
    });

    return balances;
  }

/*==================================================
  Rates
  ==================================================*/

  async function rates(timestamp, block) {
    let rates = {
      lend: {},
      borrow: {},
      supply: {}
    }

    let v1Tokens = {};

    // V2
    const tokens = (await sdk.api.cdp.compound.tokens()).output;

    const calls = _.map(tokens, (token, address) => ({
      target: token.cToken
    }));

    const supplyResults = (await sdk.api.abi.multiCall({
      block,
      calls,
      abi: abi["supplyRatePerBlock"]
    })).output;

    const borrowResults = (await sdk.api.abi.multiCall({
      block,
      calls,
      abi: abi["borrowRatePerBlock"]
    })).output;

    const totalBorrowsResults = (await sdk.api.abi.multiCall({
      block,
      calls,
      abi: abi["totalBorrows"]
    })).output;

    _.each(tokens, (token, address) => {
      let supplyRate = _.find(supplyResults, (result) => (result.success && result.input.target == token.cToken));
      let borrowRate = _.find(borrowResults, (result) => (result.success && result.input.target == token.cToken));
      let totalBorrows = _.find(totalBorrowsResults, (result) => (result.success && result.input.target == token.cToken));

      if(supplyRate && borrowRate && totalBorrows) {
        rates.lend[token.symbol] = String(((1 + supplyRate.output / 1e18) ** (365*5760) - 1) * 100);
        rates.borrow[token.symbol] = String(((1 + borrowRate.output / 1e18) ** (365*5760) - 1) * 100);
        rates.supply[token.symbol] = BigNumber(totalBorrows.output).div(10 ** token.decimals).toFixed();
      } else {
        v1Tokens[address] = token;
      }
    });

    // V1
    if(_.keys(v1Tokens).length) {
      const blocksPerYear = 2102400;

      const marketsResults = (await sdk.api.abi.multiCall({
        block,
        calls: _.map(v1Tokens, (token, address) => ({
          target: '0x3FDA67f7583380E67ef93072294a7fAc882FD7E7',
          params: token.cToken
        })),
        abi: abi["markets"]
      })).output;

      _.each(marketsResults, (market) => {
        if(market.success && market.output.isSupported) {
          const token = _.findWhere(v1Tokens, {cToken: market.input.params[0]});
          rates.lend[token.symbol] = String(market.supplyRateMantissa / 1e18 * blocksPerYear * 100);
          rates.borrow[token.symbol] = String(market.borrowRateMantissa / 1e18 * blocksPerYear * 100);
          rates.supply[token.symbol] = String(market.totalBorrows / 1e18);
        }
      });
    }

    return rates;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'Compound',
    website: 'https://compound.finance',
    token: null,
    category: 'lending',
    start: 1538006400, // 09/27/2018 @ 12:00am (UTC)
    tvl,
    rates,
    term: '1 block',
    permissioning: 'open',
    variability: 'medium'
  }


