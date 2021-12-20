const sdk = require('../../sdk');
const abi = require("./abi.json");

const G_UNI_Factory = "0xEA1aFf9dbFfD1580F6b81A3ad3589E66652dB7D9";

const tvl = async (timestamp, block, chainBlocks) => {
  const getAllDeplores = (
    await sdk.api.abi.call({
      abi: abi.getDeployers,
      target: G_UNI_Factory,
      block,
    })
  ).output;

  const getAllPools = (
    await sdk.api.abi.multiCall({
      abi: abi.getPools,
      calls: getAllDeplores.map((deployer) => ({
        target: G_UNI_Factory,
        params: deployer,
      })),
      block,
    })
  ).output.map((pool) => pool.output);

  const allGelatoPools = [].concat.apply([], getAllPools);

  const token0 = (
    await sdk.api.abi.multiCall({
      abi: abi.token0,
      calls: allGelatoPools.map((pool) => ({
        target: pool,
      })),
      block,
    })
  ).output.map((t0) => t0.output);

  const token1 = (
    await sdk.api.abi.multiCall({
      abi: abi.token1,
      calls: allGelatoPools.map((pool) => ({
        target: pool,
      })),
      block,
    })
  ).output.map((t1) => t1.output);

  const balanceOfPools = (
    await sdk.api.abi.multiCall({
      abi: abi.getUnderlyingBalances,
      calls: allGelatoPools.map((pool) => ({
        target: pool,
      })),
      block,
    })
  ).output.map((bal) => bal.output);
  
  let balanceArray = [];
  for (let i = 0; i < allGelatoPools.length; i++) {
    balanceArray.push(balanceOfPools[i].amount0Current, token0[i]);
    balanceArray.push(balanceOfPools[i].amount1Current, token1[i]);
  }

  return sdk.util.sum(balanceArray)
}

module.exports = {
  name: 'G-UNI',
  category: 'assets',
  start: 1625112000, // 7/01/2021 @ 10:00am GMT+4
  tvl,
};