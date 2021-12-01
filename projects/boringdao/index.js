const sdk = require('../../sdk');
const _ = require('underscore');
const BigNumber = require("bignumber.js");
const abi = require('./abi.json')

const tunnels = [
  "0x258a1eb6537ae84cf612f06b557b6d53f49cc9a1", // obtc tunnel
  "0xD7D997Dd57114E1e2d64ab8c0d767A0d6b2426F0", // ltc tunnel
  "0x22b1AC6B2d55ade358E5b7f4281ed1Dd2f6f0077"  // odoge tunnel
];

const obtc = "0x8064d9ae6cdf087b1bcd5bdf3531bd5d8c537a68";
const oltc = "0x07C44B5Ac257C2255AA0933112c3b75A6BFf3Cb1";
const odoge = "0x9c306A78b1a904e83115c05Ac67c1Ef07C653651";
const bor = "0x3c9d6c1C73b31c837832c72E04D3152f051fc1A9";
const oracle = "0xf9d6ab5faad5dEa4d15B35ECa0B72FfaE8A7104A";

const btcKey = "0x4254430000000000000000000000000000000000000000000000000000000000"
const ltcKey = "0x4c54430000000000000000000000000000000000000000000000000000000000"

const tokenList = [
  '0x6B175474E89094C44Da98b954EedeAC495271d0F', // DAI
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
  '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', // WETH
  '0x0bc529c00C6401aEF6D220BE8C6Ea1667F6Ad93e', // YFI
  '0xa1d0E215a23d7030842FC67cE582a6aFa3CCaB83', // YFII
  '0x514910771af9ca656af840dff83e8264ecf986ca', // LINK
  '0x04abeda201850ac0124161f037efd70c74ddc74c', // NEST
  '0xba11d00c5f74255f56a5e366f4f77f5a186d7f55', // BAND
  '0x0316EB71485b0Ab14103307bf65a021042c6d380', // HBTC
];
const holderList = [
  '0x41edC2C7212367FC59983890aad48B92b0Fe296d', // DAI Pool
  '0x89F0112A9c75D987686C608ca1840f9C7344B7fF', // USDC Pool
  '0xA6172034B1750842f12de7722Bb6cD5D4f107761', // USDT Pool
  '0xe42b6deA46AA64120b95e75D084f42579ED8a384', // WETH Pool
  '0xb035Dd8e7Ebb8B73A99270A12DE9D448d15de2bf', // YFI Pool
  '0xC80DBede0E3CabC52c5a4a3bc9611913e49b8dCc', // YFII Pool
  '0xEa8BBbb296D9d15e91E65ea2b189663805BB5916', // LINK Pool
  '0xfaacABc2468736f43eDC57f5e6080B8b48BbD050', // NEST Pool
  '0xF99125968D45f88d625ADCF79700628ACDA65D6b', // BAND Pool
  '0xb09a612Ebe2AA5750C51eb317820C6f2866A9ca6', // HBTC Pool
];

async function tvl(timestamp, block) {
  let balances = {};
  const calls = [];
  for (let i = 0; i < tokenList.length; i++)
  {
    calls.push({
      target: tokenList[i],
      params: holderList[i]
    });
  }
  _.each(tunnels, (tunnel) => {
    calls.push({
      target: bor,
      params: tunnel
    })
  });

  const balanceOfResults = await sdk.api.abi.multiCall({
    block,
    calls,
    abi: 'erc20:balanceOf'
  });

  _.each(balanceOfResults.output, (balanceOf) => {
    if(balanceOf.success) {
      const address = balanceOf.input.target;
      const balance = balances[address] ? BigNumber(balanceOf.output).plus(BigNumber(balances[address])).toFixed().toString(): balanceOf.output;

      balances[address] = balance;
    }
  });

  let obtcSupply;
  if (block >= 11241743){
    obtcSupply = await sdk.api.erc20.totalSupply({
      target: obtc,
      block,
    });
    balances[obtc] = obtcSupply.output;
  }

  let oltcSupply;
  if (block >= 11867991){
    oltcSupply = await sdk.api.erc20.totalSupply({
      target: oltc,
      block,
    });
    balances[oltc] = oltcSupply.output;
  }

  let odogeSupply;
  if (block >= 12300340){
    odogeSupply = await sdk.api.erc20.totalSupply({
      target: odoge,
      block,
    });
    balances[odoge] = odogeSupply.output;
  }

  return balances;
}

module.exports = {
  name: 'BoringDAO',
  token: null,
  category: 'Assets',
  start: 1607745161,  // Dec-12-2020
  tvl,
};
