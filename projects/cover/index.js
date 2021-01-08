const BigNumber = require("bignumber.js");
const _ = require('underscore');

const sdk = require('../../sdk');
const abi = require('./abi');

/**
 * Cover Protocol V1 TVL calculation
 * https://github.com/CoverProtocol/cover-core-v1/wiki
 */
const COVER_PROTOCOL_FACTORY = "0xedfC81Bf63527337cD2193925f9C0cF2D537AccA";

async function tvl(timestamp, block) {
  const protocols = (await sdk.api.abi.call({
    block,
    target: COVER_PROTOCOL_FACTORY,
    abi: abi['getAllProtocolAddresses'],
  })).output;
  
  const covers = _.flatten(await sdk.api.abi.multiCall({
    block,
    abi: abi['getProtocolDetails'],
    calls: protocols.map((protocol) => ({
      target: protocol,
    })),
  }).then(({ output }) => output.map(value => value.output.allCovers)));

  const collaterals = await sdk.api.abi.multiCall({
    block,
    abi: abi['collateral'],
    calls: covers.map((cover) => ({
      target: cover,
    })),
  }).then(({ output }) => output.map(value => value.output));

  const collateralBals = await sdk.api.abi.multiCall({
    block,
    abi: 'erc20:balanceOf',
    calls: covers.map((cover, index) => ({
      target: collaterals[index],
      params: cover
    })),
  }).then(({ output }) => output.map(value => value.output));

  const balances = {};
  collateralBals.forEach((balance, index) => {
    if (balances[collaterals[index]] > 0) {
      balances[collaterals[index]].plus(balance);
    } else {
      balances[collaterals[index]] = new BigNumber(balance);
    }
  })

  return balances;
}

module.exports = {
  name: 'Cover Protocol',
  token: 'COVER',
  category: 'derivatives',
  start: 1605830400, // Nov-20-2020 12am UTC
  tvl
}
