// Adapter for Gro Protocol : https://gro.xyz

const sdk = require("../../sdk");
const groTokenAbi = require("./abi.json");

// Gro Protocol Token Addresses
const GVT = "0x3ADb04E127b9C0a5D36094125669d4603AC52a0c"; 
const PWRD = "0xf0a93d4994b3d98fb5e3a2f90dbc2d69073cb86b";


async function tvl(timestamp, ethBlock) {
  let balances = {};

  for (const token of [PWRD, GVT]) {
    const current = await sdk.api.abi.call({
      target: token,
      abi: groTokenAbi["totalSupply"],
      block: ethBlock,
    });
    sdk.util.sumSingleBalance(balances, token, current.output);
  }

  return balances;
}


module.exports = {
  name: 'Gro Protocol',
  category: 'Assets',
  token: 'GRO',
  website: 'https://www.gro.xyz',
  chain: 'ethereum',
  start: 1622204347, // 28-05-2021 12:19:07 (UTC)
  tvl,
};

