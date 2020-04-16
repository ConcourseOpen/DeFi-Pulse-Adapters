/*==================================================
  Modules
==================================================*/

  const sdk = require('../../sdk');
  const BigNumber = require('bignumber.js');
  const _ = require('underscore');

  const abi = require('./abi');

/*==================================================
  Main
  ==================================================*/

  async function tvl (timestamp, block) {
    let balances = {};

    const getTokensResult = await sdk.api.abi.call({
      block,
      target: '0xD8dc30d298CCf40042991cB4B96A540d8aFFE73a',
      params: [0,200,0],
      abi: abi["getTokens"]
    });

    let iTokens = [
      // sUSD
      {
        iTokenAddress: "0x49f4592E641820e928F9919Ef4aBd92a719B4b49",
        underlyingAddress: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3"
      },
      // CHAI
      {
        iTokenAddress: "0x493C57C4763932315A328269E1ADaD09653B9081",
        underlyingAddress: "0x06AF07097C9Eeb7fD685c692751D5C66dB49c215"
      }
    ];

    _.each(getTokensResult.output, (token) => {
      if(token[4] === '1') {
        iTokens.push({
          iTokenAddress: token[0],
          underlyingAddress: token[1]
        });
      }
    });

    const iTokenCalls = _.map(iTokens, (iToken) => ({
      target: iToken.iTokenAddress
    }));

    const supplyResult = await sdk.api.abi.multiCall({
      block,
      calls: iTokenCalls,
      abi: abi["totalAssetSupply"]
    });

    const borrowResult = await sdk.api.abi.multiCall({
      block,
      calls: iTokenCalls,
      abi: abi["totalAssetBorrow"]
    });

    _.each(iTokens, (iToken) => {
      const totalSupply = _.find(supplyResult.output, (result) => (result.input.target === iToken.iTokenAddress)).output;
      const totalBorrow = _.find(borrowResult.output, (result) => (result.input.target === iToken.iTokenAddress)).output;

      balances[iToken.underlyingAddress] = BigNumber(totalSupply).minus(totalBorrow).toFixed();
    });

    const kyberTokens = (await sdk.api.util.kyberTokens()).output;

    balanceOfCalls = [
      ..._.map(kyberTokens, (data, address) => ({
        target: address,
        params: '0x8b3d70d628ebd30d4a2ea82db95ba2e906c71633'
      }))
    ];

    console.log(balanceOfCalls);

    const balanceOfResult = await sdk.api.abi.multiCall({
      block,
      calls: balanceOfCalls,
      abi: 'erc20:balanceOf',
    });

    sdk.util.sumMultiCall(balances, balanceOfResult);;

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'bZx',
    token: 'BZRX',
    category: 'Lending',
    start: 1558742400,  // 05/25/2019(UTC)
    tvl
  };
