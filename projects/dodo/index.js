const sdk = require("../../sdk");
const _ = require("underscore");
const BigNumber = require("bignumber.js");
const axios = require('axios');
const v1TVL = require('./v1');

const tokens = async () => {
  let tokens = (await axios.get('https://i-op.dodoex.io/erc-20-s?chains.name=mainnet'))
    .data.map(item => item.address);
  return tokens;
}

const DSP_FACTORY = "0x6fdDB76c93299D985f4d3FC7ac468F9A168577A4";
const DVM_FACTORY = "0x72d220cE168C4f361dD4deE5D826a01AD8598f6C";
const DVM_START_BLOCK = 12049617;
const DPP_FACTORY = "0x6B4Fa0bc61Eddc928e0Df9c7f01e407BfcD3e5EF";
const DPP_START_BLOCK = 11730391;

async function tvl(timestamp, block)
{
  let balances  = await(v1TVL(timestamp, block));
  const logs_dsp = (
    await sdk.api.util
      .getLogs({
        keys: [],
        toBlock: block,
        target: DSP_FACTORY,
        fromBlock: 12430370,
        // base token, quote token, creator, Pool addr
        topic: 'NewDSP(address,address,address,address)',
      })
  ).output;


  let balanceCalls = [];
  for(log of logs_dsp)
  {
    let token0 = `0x${log.data.substr(26, 40)}`;
    let token1 = `0x${log.data.substr(90, 40)}`;
    let poolAddr = `0x${log.data.substr(log.data.length - 40, 40)}`;
    balanceCalls.push({
      target: token0,
      params: poolAddr
    });
    balanceCalls.push({
      target: token1,
      params: poolAddr
    });
  }

  let logs_dvm = (
    await sdk.api.util
      .getLogs({
        keys: [],
        toBlock: block,
        target: DVM_FACTORY,
        fromBlock: DVM_START_BLOCK,
        // base token, quote token, creator, Pool addr
        topic: 'NewDVM(address,address,address,address)',
      })
  ).output;

  for(log of logs_dvm)
  {
    if(log.data)
    {
      log = log.data;
    }
    let token0 = `0x${log.substr(26, 40)}`;
    let token1 = `0x${log.substr(90, 40)}`;
    let poolAddr = `0x${log.substr(log.length - 40, 40)}`;
    balanceCalls.push({
      target: token0,
      params: poolAddr
    });
    balanceCalls.push({
      target: token1,
      params: poolAddr
    });
  }

  let logs_dpp = (
    await sdk.api.util
      .getLogs({
        keys: [],
        toBlock: block,
        target: DPP_FACTORY,
        fromBlock: DPP_START_BLOCK,
        // base token, quote token, creator, Pool addr
        topic: 'NewDPP(address,address,address,address)',
      })
  ).output;

  for(log of logs_dpp)
  {
    if(log.data)
    {
      log = log.data;
    }
    let token0 = `0x${log.substr(26, 40)}`;
    let token1 = `0x${log.substr(90, 40)}`;
    let poolAddr = `0x${log.substr(log.length - 40, 40)}`;
    balanceCalls.push({
      target: token0,
      params: poolAddr
    });
    balanceCalls.push({
      target: token1,
      params: poolAddr
    });
  }
  const balanceOfResult = (
    await sdk.api.abi.multiCall({
      block,
      calls: balanceCalls,
      abi: "erc20:balanceOf",
    })
  ).output;

  /* combine token volumes on multiple contracts */
  _.forEach(balanceOfResult, (result) => {
    let balance = new BigNumber(result.output || 0);
    if (balance <= 0) return;
    let asset = result.input.target;
    let total = balances[asset];
    if (total) {
      balances[asset] = balance.plus(total).toFixed();
    } else {
      balances[asset] = balance.toFixed();
    }
  });

  return balances;
}

module.exports = {
  name: "DODO",
  token: 'DODO',
  category: "DEXes",
  start: 1597126986, // Aug-07-2020 03:56:08 PM +UTC
  tvl,
};
