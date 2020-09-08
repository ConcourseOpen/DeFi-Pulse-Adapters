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

    // const getTokensResult = await sdk.api.abi.call({
    //   block,
    //   target: '0xD8dc30d298CCf40042991cB4B96A540d8aFFE73a',
    //   params: [0,200,0],
    //   abi: abi["getTokens"]
    // });

    let iTokens = [
      // bZx DAI iToken
      {
        iTokenAddress: "0x14094949152EDDBFcd073717200DA82fEd8dC960",
        underlyingAddress: "0x89d24A6b4CcB1B6fAA2625fE562bDD9a23260359"
      },
      // bZx ETH iToken
      {
        iTokenAddress: "0x77f973FCaF871459aa58cd81881Ce453759281bC",
        underlyingAddress: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
      },
      // bZx USDC iToken
      {
        iTokenAddress: "0xF013406A0B1d544238083DF0B93ad0d2cBE0f65f",
        underlyingAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
      },
      // bZx WBTC iToken
      {
        iTokenAddress: "0xBA9262578EFef8b3aFf7F60Cd629d6CC8859C8b5",
        underlyingAddress: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599"
      },
      // bZx BAT iToken
      {
        iTokenAddress: "0xA8b65249DE7f85494BC1fe75F525f568aa7dfa39",
        underlyingAddress: "0x0D8775F648430679A709E98d2b0Cb6250d2887EF"
      },
      // bZx KNC iToken
      {
        iTokenAddress: "0x1cC9567EA2eB740824a45F8026cCF8e46973234D",
        underlyingAddress: "0xdd974D5C2e2928deA5F71b9825b8b646686BD200"
      },
      // bZx REP iToken
      {
        iTokenAddress: "0xBd56E9477Fc6997609Cf45F84795eFbDAC642Ff1",
        underlyingAddress: "0x1985365e9f78359a9B6AD760e32412f4a445E862"
      },
      // bZx ZRX iToken
      {
        iTokenAddress: "0xA7Eb2bc82df18013ecC2A6C533fc29446442EDEe",
        underlyingAddress: "0xE41d2489571d322189246DaFA5ebDe1F4699F498"
      },
      // sUSD
      {
        iTokenAddress: "0x49f4592E641820e928F9919Ef4aBd92a719B4b49",
        underlyingAddress: "0x57Ab1E02fEE23774580C119740129eAC7081e9D3"
      },
      // CHAI
      {
        iTokenAddress: "0x493C57C4763932315A328269E1ADaD09653B9081",
        underlyingAddress: "0x06AF07097C9Eeb7fD685c692751D5C66dB49c215"
      },
      // Those are new iTokens
      { // Fulcrum DAI iToken
        iTokenAddress: "0x6b093998d36f2c7f0cc359441fbb24cc629d5ff0",
        underlyingAddress: "0x6b175474e89094c44da98b954eedeac495271d0f"
      },
      { // Fulcrum ETH iToken
        iTokenAddress: "0xb983e01458529665007ff7e0cddecdb74b967eb6",
        underlyingAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
      },
      { // Fulcrum USDC iToken
        iTokenAddress: "0x32e4c68b3a4a813b710595aeba7f6b7604ab9c15",
        underlyingAddress: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      },
      { // Fulcrum WBTC iToken
        iTokenAddress: "0x2ffa85f655752fb2acb210287c60b9ef335f5b6e",
        underlyingAddress: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599"
      },
      { // Fulcrum LEND iToken
        iTokenAddress: "0xab45bf58c6482b87da85d6688c4d9640e093be98",
        underlyingAddress: "0x80fB784B7eD66730e8b1DBd9820aFD29931aab03"
      },
      { // Fulcrum KNC iToken
        iTokenAddress: "0x687642347a9282be8fd809d8309910a3f984ac5a",
        underlyingAddress: "0xdd974d5c2e2928dea5f71b9825b8b646686bd200"
      },
      { // Fulcrum MKR iToken
        iTokenAddress: "0x9189c499727f88f8ecc7dc4eea22c828e6aac015",
        underlyingAddress: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2"
      },
      { // Fulcrum BZRX iToken
        iTokenAddress: "0x18240bd9c07fa6156ce3f3f61921cc82b2619157",
        underlyingAddress: "0x56d811088235F11C8920698a204A5010a788f4b3"
      },
      { // Fulcrum LINK iToken
        iTokenAddress: "0x463538705e7d22aa7f03ebf8ab09b067e1001b54",
        underlyingAddress: "0x514910771AF9Ca656af840dff83E8264EcF986CA"
      },
      { // Fulcrum YFI iToken
        iTokenAddress: "0x7f3fe9d492a9a60aebb06d82cba23c6f32cad10b",
        underlyingAddress: "0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e"
      },
      { // Fulcrum USDT iToken
        iTokenAddress: "0x7e9997a38a439b2be7ed9c9c4628391d3e055d48",
        underlyingAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7"
      }
    ];
    console.log("block", block, timestamp);
    // console.log("getTokensResult", getTokensResult);
    // if (getTokensResult && getTokensResult.output) {
    //   _.each(getTokensResult.output, (token) => {
    //     if(token[4] === '1') {
    //       iTokens.push({
    //         iTokenAddress: token[0],
    //         underlyingAddress: token[1]
    //       });
    //     }
    //   });
    // }


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
      const supply = _.find(supplyResult.output, (result) => (result.input.target === iToken.iTokenAddress));
      const borrow = _.find(borrowResult.output, (result) => (result.input.target === iToken.iTokenAddress));

      if(supply.success && borrow.success) {
        const totalSupply = supply.output;
        const totalBorrow = borrow.output;
        balances[iToken.underlyingAddress] = BigNumber(totalSupply).minus(totalBorrow).toFixed();
      }
    });

    const kyberTokens = (await sdk.api.util.kyberTokens()).output;

    balanceOfCalls = [
      ..._.map(kyberTokens, (data, address) => ({
        target: address,
        params: '0x8b3d70d628ebd30d4a2ea82db95ba2e906c71633'
      }))
    ];

    const balanceOfResult = await sdk.api.abi.multiCall({
      block,
      calls: balanceOfCalls,
      abi: 'erc20:balanceOf',
    });

    sdk.util.sumMultiBalanceOf(balances, balanceOfResult);;

    return balances;
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    name: 'bZx',
    token: 'BZRX',
    category: 'lending',
    website: "https://bzx.network",
    start: 1558742400,  // 05/25/2019(UTC)
    tvl
  };
