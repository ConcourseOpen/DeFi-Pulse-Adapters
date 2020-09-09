/*==================================================
  Modules
==================================================*/

const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');
const _ = require('underscore');

const abi = require('./abi');
const itoken = require('./itoken');
const { sum } = require('../../sdk/util');

/*==================================================
  Main
  ==================================================*/

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
  },
];

let iTokensNew = [
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
]

let bzrxTokenAddress = "0x56d811088235F11C8920698a204A5010a788f4b3";
let vbzrxTokenAddress = "0xB72B31907C1C95F3650b64b2469e08EdACeE5e8F";
let bzxLetacyProtocolAddress = "0x8b3d70d628ebd30d4a2ea82db95ba2e906c71633";
let bzxProtocolAddress = "0xd8ee69652e4e4838f2531732a46d1f7f584f0b7f";
// TODO for future staking
let bzxStakingAddress = "0x576773CD0B51294997Ec4E4ff96c93d5E3AE9038";

let mkrAddress = "0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2";
async function tvl(timestamp, block) {
  let balances = {};

  const getTokensResult = await sdk.api.abi.call({
    block,
    target: '0xD8dc30d298CCf40042991cB4B96A540d8aFFE73a',
    params: [0, 200, 0],
    abi: abi["getTokens"]
  });

  _.each(getTokensResult.output, (token) => {
    if (token[4] === '1') {
      iTokens.push({
        iTokenAddress: token[0],
        underlyingAddress: token[1]
      });
    }
  });


  iTokens = iTokens.concat(iTokensNew);
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

    if (supply.success && borrow.success) {
      const totalSupply = supply.output;
      const totalBorrow = borrow.output;
      balances[iToken.underlyingAddress.toUpperCase()] = BigNumber(totalSupply).minus(totalBorrow).toFixed();
    }
  });

  const kyberTokens = (await sdk.api.util.kyberTokens()).output;

  // Legacy bZx address
  balanceOfCallsLegacy = [
    ..._.map(kyberTokens, (data, address) => ({
      target: address,
      params: bzxLetacyProtocolAddress
    }))
  ];

  // new bZx address
  balanceOfCalls = [
    ..._.map(kyberTokens, (data, address) => ({
      target: address,
      params: bzxProtocolAddress
    }))
  ];

  const balanceOfResultLegacy = await sdk.api.abi.multiCall({
    block,
    calls: balanceOfCallsLegacy,
    abi: 'erc20:balanceOf',
  });

  const balanceOfResult = await sdk.api.abi.multiCall({
    block,
    calls: balanceOfCalls,
    abi: 'erc20:balanceOf',
  });

  let balanceOfvBZRX = await sdk.api.abi.call({
    target: vbzrxTokenAddress,
    params: bzxProtocolAddress,
    abi: 'erc20:balanceOf',
    block
  });
  console.log("balanceOfvBZRX", balanceOfvBZRX);
  function sumMultiBalanceOf(balances, results) {
    _.each(results.output, (result) => {
      if (result.success) {
        let address = result.input.target;
        let balance = result.output;

        if (BigNumber(balance).toNumber() <= 0) {
          return;
        }
        balances[address.toUpperCase()] = BigNumber(balances[address.toUpperCase()] || 0).plus(balance).toFixed();
      }
    });
  }

  sumMultiBalanceOf(balances, balanceOfResultLegacy);
  sumMultiBalanceOf(balances, balanceOfResult);

  if (balanceOfvBZRX.output) {
    balance = BigNumber(balanceOfvBZRX.output)
    balances[bzrxTokenAddress.toUpperCase()] = BigNumber(balances[bzrxTokenAddress.toUpperCase()]).plus(balance).toFixed();
  }


  console.log("json ", balances);
  return balances;
}


/*==================================================
  Rates
  ==================================================*/
async function rates(timestamp, block) {
  let ratesData = { lend: {}, borrow: {}, supply: {} };

  const iTokenCalls = _.map(iTokensNew, (iToken) => ({
    target: iToken.iTokenAddress
  }));

  const supplyInterestRate = await sdk.api.abi.multiCall({
    block,
    calls: iTokenCalls,
    abi: itoken["supplyInterestRate"]
  });

  const borrowInterestRate = await sdk.api.abi.multiCall({
    block,
    calls: iTokenCalls,
    abi: itoken["borrowInterestRate"]
  });

  const totalAssetBorrow = await sdk.api.abi.multiCall({
    block,
    calls: iTokenCalls,
    abi: itoken["totalAssetBorrow"]
  });

  const iTokenUnderlyingCalls = _.map(iTokensNew, (iToken) => ({
    target: iToken.underlyingAddress
  }));

  const underlyingSymbol = await sdk.api.abi.multiCall({
    block,
    calls: iTokenUnderlyingCalls,
    abi: 'erc20:symbol'
  });

  _.each(iTokensNew, (iToken) => {
    const supply = _.find(supplyInterestRate.output, (result) => (result.input.target === iToken.iTokenAddress));
    const borrow = _.find(borrowInterestRate.output, (result) => (result.input.target === iToken.iTokenAddress));
    const totalBorrow = _.find(totalAssetBorrow.output, (result) => (result.input.target === iToken.iTokenAddress));
    let symbol = _.find(underlyingSymbol.output, (result) => (result.input.target === iToken.underlyingAddress));

    if (iToken.underlyingAddress.toUpperCase() == mkrAddress.toUpperCase()) {
      symbol.output = "MKR";
    }

    ratesData.lend[symbol.output] = String(supply.output / 1e18);
    ratesData.borrow[symbol.output] = String(borrow.output / 1e18);
    ratesData.supply[symbol.output] = String(totalBorrow.output);
  });

  console.log("ratesData", ratesData);
  return ratesData;
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
  tvl,
  rates,
  term: "1 block",
  variability: "medium",
};
