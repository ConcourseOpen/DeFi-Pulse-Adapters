const BigNumber = require('bignumber.js');
const utils = require('web3-utils');
const sdk = require('../../sdk');
const MakerSCDConstants = require("./abis/makerdao.js");
const MakerMCDConstants = require("./abis/maker-mcd.js");

async function getJoins(block) {
  let rely = utils.sha3("rely(address)").substr(0, 10);
  let relyTopic = utils.padRight(rely, 64);
  const joins = {};

  // get list of auths

  const logs = (
    await sdk.api.util
      .getLogs({
        keys: [],
        toBlock: block,
        target: MakerMCDConstants.VAT,
        fromBlock: MakerMCDConstants.STARTBLOCK,
        topics: [relyTopic],
      })
  ).output;

  let auths = logs.map(auth => {
    return `0x${auth.topics[1].substr(26)}`;
  });

  let ilks = (await sdk.api.abi.multiCall({
    abi: MakerMCDConstants.ilk,
    calls: auths.map((auth) => ({
      target: auth,
    })),
    block
  })).output;

  ilks = ilks.filter((ilk) => ilk.output);

  await Promise.all(ilks.map(async (ilk) => {
    try {
      let gem = (await sdk.api.abi.call({
        block,
        target: ilk.input.target,
        abi: MakerMCDConstants.gem
      })).output;

      let name = utils.hexToString(ilk.output);
      joins[name.toString()] = ilk.input.target;
    } catch (e) {}
  }));

  return joins;
}

async function tvl(timestamp, block) {
  let balances = {};
  balances[MakerSCDConstants.WETH_ADDRESS] = new BigNumber((await sdk.api.erc20.balanceOf({
    block,
    target: MakerSCDConstants.WETH_ADDRESS,
    owner: MakerSCDConstants.TUB_ADDRESS
  })).output);

  if (block >= MakerMCDConstants.STARTBLOCK) {
    let joins = await getJoins(block);

    await Promise.all(Object.keys(joins).map(async (join) => {
      try {
        let gem = (await sdk.api.abi.call({
          block,
          target: joins[join],
          abi: MakerMCDConstants.gem
        })).output;

        let balance = (await sdk.api.erc20.balanceOf({
          target: gem,
          owner: joins[join],
          block
        })).output;

        balances[gem] = balances[gem] ? balances[gem].plus(balance) : new BigNumber(balance);
      } catch (error) {
        console.log(error.message);
      }
    }));

    let pie = (await sdk.api.abi.call({
      block,
      target: MakerMCDConstants.POT,
      abi: MakerMCDConstants.Pie
    })).output;

    balances[MakerMCDConstants.DAI] = balances[MakerMCDConstants.DAI] ? balances[MakerMCDConstants.DAI].plus(pie) : new BigNumber(pie);
  }

  return balances;
}

module.exports = {
  name: 'Maker',
  token: 'MKR',
  category: 'lending',
  start: 1513566671, // 12/18/2017 @ 12:00am (UTC)
  tvl,
};
