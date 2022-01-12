const sdk = require('../../sdk');
const ethers  = require('ethers');
const _ = require('underscore');
const BigNumber = require('bignumber.js');
const abi = require('./abi.json')

function sumSingleBalance(balances, token, balance) {
    const prevBalance = ethers.BigNumber.from(balances[token] ?? "0");
    balances[token] = prevBalance.add(ethers.BigNumber.from(balance)).toString();
}

const OHM = '0x383518188c0c6d7730d91b2c03a03c837814a899';
const DAI = '0x6b175474e89094c44da98b954eedeac495271d0f';
const OHM_DAI_SLP = '0x34d7d7aaf50ad4944b70b320acb24c95fa2def7c';
const FRAX = '0x853d955acef822db058eb8505911ed77f175b99e';
const OHM_FRAX_UNIV2 = '0x2dce0dda1c2f98e0f171de8333c3c6fe1bbf4877';
const WETH = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const LUSD = '0x5f98805A4E8be255a32880FDeC7F6728C6568bA0';
const LUSD_LP = '0xfdf12d1f85b5082877a6e070524f50f6c84faa6b';
const aDAI = '0x028171bca77440897b824ca71d1c56cac55b68a3';

const treasuryCoins = [
  DAI,
  OHM_DAI_SLP,
  FRAX,
  OHM_FRAX_UNIV2,
  WETH,
  LUSD,
  LUSD_LP
];

const treasuryAddresses = [
  '0x886CE997aa9ee4F8c2282E182aB72A705762399D', // Treasury v1
  '0x31F8Cc382c9898b273eff4e0b7626a6987C846E8', // Treasury v2
];

const stakingAddresses = [
  '0x0822F3C03dcc24d200AFF33493Dc08d0e1f274A2', // Old Staking
  '0xFd31c7d00Ca47653c6Ce64Af53c1571f9C36566a', // New Staking
];

const aaveAllocator = '0x0e1177e47151be72e5992e0975000e73ab5fd9d4';
const onsenAllocator = '0x0316508a1b5abf1CAe42912Dc2C8B9774b682fFC';
const sushiMasterchef = '0xc2EdaD668740f1aA35E4D8f227fB8E17dcA888Cd';
const convexAllocator = '0x408a9A09d97103022F53300A3A14Ca6c3FF867E8';

async function tvl(timestamp, block) {
  const balances = {};

  // Staking of native token TVL portion
  for (const stakings of stakingAddresses) {
    const stakingBalance = await sdk.api.erc20.balanceOf({ target: OHM, owner: stakings, block });
    sumSingleBalance(balances, OHM, stakingBalance.output);
  }

  // Tokens held by Olympus treasury v1 or v2
  for (const treasury of treasuryAddresses) {
    const treasuryBalances = await sdk.api.abi.multiCall({
      abi: 'erc20:balanceOf',
      calls: treasuryCoins.map(coin=>({
        target: coin,
        params: [treasury]
      }))
    });

    for (const balance of treasuryBalances.output) {
      sumSingleBalance(balances, balance.input.target, balance.output);
    }
  }

  // Aave DAI controlled by Olympus Aave Allocator
  const treasuryADai = await sdk.api.erc20.balanceOf({ target: aDAI, owner: aaveAllocator, block });
  sumSingleBalance(balances, aDAI, treasuryADai.output);

  // FRAX allocated by Olympus Convex Allocator
  const fraxAllocated = await sdk.api.abi.call({
    target: convexAllocator,
    abi: abi.totalValueDeployed,
    block
  });
  sumSingleBalance(balances, FRAX, BigNumber(fraxAllocated.output).times(1e9).toFixed(0));

  // OHM-DAI-SLP controlled in Sushi Masterchef
  const onsenLps = await sdk.api.abi.call({
    target: sushiMasterchef,
    abi: abi.userInfo,
    params: [185, onsenAllocator],
    block
  });
  sumSingleBalance(balances, OHM_DAI_SLP, onsenLps.output.amount);

  return balances;
}

module.exports = {
  name: 'Olympus',
  token: 'OHM',
  category: 'assets',
  start: 1616569200, // March 24th, 2021
  tvl
}