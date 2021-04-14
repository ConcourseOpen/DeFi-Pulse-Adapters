const BigNumber = require("bignumber.js");
const _ = require('underscore');

const sdk = require('../../sdk');
const abi = require('./abi');

/**
 * Cover Protocol V1 TVL calculation
 * https://github.com/CoverProtocol/cover-core-v1/wiki
 */
const COVER_PROTOCOL_FACTORY = "0xedfC81Bf63527337cD2193925f9C0cF2D537AccA";
const YDAI_ADDRESS = '0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01';
const DAI_ADDRESS = '0x6B175474E89094C44Da98b954EedeAC495271d0F';

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

  const yDaiPrice = await getyDaiPrice(block);

  const balances = {};
  collateralBals.forEach((balance, index) => {
    // replace yDai with Dai
    let collateral = collaterals[index];
    if (collateral === YDAI_ADDRESS) {
      collateral = DAI_ADDRESS;
      balance *= yDaiPrice;
    }

    if (balances[collateral]) {
      balances[collateral] = balances[collateral].plus(balance);
    } else {
      balances[collateral] = new BigNumber(balance);
    }
  });
  return balances;
}

async function getyDaiPrice(block) {
  const poolValueInToken = (await sdk.api.abi.call({
    block,
    abi: abi['calcPoolValueInToken'],
    target: YDAI_ADDRESS
  })).output;
  const totalSupply = (await sdk.api.abi.call({
    block,
    target: YDAI_ADDRESS,
    abi: 'erc20:totalSupply',
  })).output;
  return poolValueInToken / totalSupply;
}

module.exports = {
  name: 'Cover Protocol',
  token: 'COVER',
  category: 'derivatives',
  start: 1605830400, // Nov-20-2020 12am UTC
  tvl
}
