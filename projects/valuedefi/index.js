/*==================================================
  Modules
==================================================*/

const sdk = require('../../sdk');
const getCurrentTokens = require('./abis/getCurrentTokens.json');
const getReserves = require('./abis/getReserves.json');
const token0 = require('./abis/token0.json');
const token1 = require('./abis/token1.json');
const balance = require('./abis/balance.json');
const _ = require('underscore');
const BigNumber = require("bignumber.js");

/*==================================================
    Settings
 ==================================================*/
const configs = {
  seed: [
    {
      // Seed pool v2
      stakingContract: "0xC2D55CE14a8e04AEF9B6bCfD105079b63C6a0AC8",
      tokens: ['0xdAC17F958D2ee523a2206206994597C13D831ec7', '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', '0x0000000000085d4780B73119b644AE5ecd22b376', '0x6B175474E89094C44Da98b954EedeAC495271d0F']
    },
    {
      // YFV Governance Vault
      stakingContract: "0x07eb8CB8AEdB581a2d73cc29F6c7860226808Ca2",
      tokens: ["0x45f24BaEef268BB6d63AEe5129015d69702BCDfa"],
    }

  ],
  vault: {
    single: [
      {
        // WETH
        contract: "0x3f72Aad4Be55A7a0BFc1E572501A90B0C864CEEE",
        underlyingToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
      }
    ],
    uniV2LP: [
      {
        // ETH-USDC uniV2
        contract: "0xa2b8c86aBfdb1C8C117E10616Eb9f21B2488D82E",
        underlyingToken: "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"
      },
      {
        // ETH-WBTC uniV2
        contract: "0xcBf57fE64075340B54769FAa594dF279aE99c370",
        underlyingToken: "0xBb2b8038a1640196FbE3e38816F3e67Cba72D940"
      }
    ],
    cVaultUniV2LP: [
      {
        // ETH-USDC
        contract: "0x7c175a3Fd4d2f14E40Ac418a1e004Dfc8Edd3ba8",
        underlyingToken: "0x397ff1542f962076d0bfe58ea045ffa2d347aca0"
      },
      {
        // ETH-WBTC
        contract: "0x555DdD7C3999010cfF0AE3671D31Cb376fa638f0",
        underlyingToken: "0xceff51756c56ceffca006cd410b03ffc46dd3a58"
      }
    ],
    cVaultBalancer: [
      {
        // ETH-USDC
        contract: "0x53Aa48B2AC0071A6ce61Ddb3BA4e41D395B2DB51",
        underlyingToken: "0x8a649274e4d777ffc6851f13d23a86bbfa2f2fbf"
      },
      {
        // ETH-WBTC
        contract: "0x0A62cC5ebfa79B155b4Ec90E74c00E0176692772",
        underlyingToken: "0x1efF8aF5D577060BA4ac8A29A13525bb0Ee2A3D5"
      }
    ],
    cVaultSeed: [
      {
        // Barn Bridge
        contract: "0xD897B5458afE7e2DC26D94Ec33CF7d09a9158568",
        underlyingToken: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
      }
    ]
  }

}

/*==================================================
  Main
==================================================*/
async function singleVaultTvl(timestamp, block) {
  const totalSupplies = (await sdk.api.abi.multiCall({
    block,
    calls: _.map(configs.vault.single, vaultToken => ({
      target: vaultToken.contract
    })),
    abi: 'erc20:totalSupply',
  })).output.map(value => value.output);
  const balances = {};
  _.forEach(totalSupplies, (totalSupply, index) => {
    let balance = new BigNumber(totalSupply || 0);
    let asset = configs.vault.single[index].underlyingToken;
    let total = new BigNumber(balances[asset] || 0);
    balances[asset] = balance.plus(total).toFixed();
  });
  return balances
}

async function uniSwapPairInfo(pairAddresses, timestamp, block) {
  const [token0Addresses, token1Addresses, reserves, totalSupplies] = await Promise.all([
    sdk.api.abi.multiCall({
      abi: token0,
      calls: pairAddresses.map((pairAddress) => ({
        target: pairAddress,
      })),
      block,
    })
      .then(({output}) => output.map(value => value.output)),
    sdk.api.abi.multiCall({
      abi: token1,
      calls: _.map(pairAddresses, (pairAddress) => ({
        target: pairAddress,
      })),
      block,
    })
      .then(({output}) => output.map(value => value.output)),
    sdk.api.abi.multiCall({
      abi: getReserves,
      calls: _.map(pairAddresses, (pairAddress) => ({
        target: pairAddress,
      })),
      block,
    })
      .then(({output}) => output.map(value => value.output)),
    sdk.api.abi.multiCall({
      block,
      calls: _.map(pairAddresses, pairAddress => ({
        target: pairAddress
      })),
      abi: 'erc20:totalSupply',
    }).then(({output}) => output.map(value => value.output))
  ]);
  return pairAddresses.map((value, index) => {
    return {
      reserve0: reserves[index] ? reserves[index]['_reserve0'] : null,
      reserve1: reserves[index] ? reserves[index]['_reserve1'] : null,
      token0: token0Addresses[index],
      token1: token1Addresses[index],
      totalSupply: totalSupplies[index],
    }
  })
}

async function mergeBalance(array) {
  const globalBalances = {}
  for (const balances of array) {
    for (const asset in balances) {
      const balance = new BigNumber(balances[asset] || 0)
      let total = new BigNumber(globalBalances[asset.toLowerCase()] || 0);
      globalBalances[asset.toLowerCase()] = balance.plus(total).toFixed();
    }
  }
  return globalBalances
}

async function cuNIv2LPVaultTvl(timestamp, block) {
  const vaultBalance = (await sdk.api.abi.multiCall({
    block,
    calls: _.map(configs.vault.cVaultUniV2LP, vaultToken => ({
      target: vaultToken.contract
    })),
    abi: balance,
  })).output.map(value => value.output);

  const pairs = configs.vault.cVaultUniV2LP.map(value => value.underlyingToken);
  const pairInfos = await uniSwapPairInfo(pairs, timestamp, block)
  const balanceOfResult = []
  for (let index = 0; index < configs.vault.uniV2LP.length; index++) {
    let vaultSupply = new BigNumber(vaultBalance[index] || 0)
    let {reserve0, reserve1, token0, token1, totalSupply} = pairInfos[index];
    if (reserve0 && reserve1 && token0 && token1 && totalSupply) {
      balanceOfResult.push({
        address: token0,
        balance: new BigNumber(reserve0).times(vaultSupply).div(totalSupply).toFixed()
      })
      balanceOfResult.push({
        address: token1,
        balance: new BigNumber(reserve1).times(vaultSupply).div(totalSupply).toFixed()
      })
    }
  }
  const balances = {};
  _.forEach(balanceOfResult, (result) => {
    let balance = new BigNumber(result.balance || 0);
    let asset = result.address;
    let total = new BigNumber(balances[asset] || 0);
    balances[asset] = balance.plus(total).toFixed();
  });
  return balances
}

async function cVaultSeedTvl(timestamp, block) {
  const vaultBalances = (await sdk.api.abi.multiCall({
    block,
    calls: _.map(configs.vault.cVaultSeed, vaultToken => ({
      target: vaultToken.contract
    })),
    abi: balance,
  })).output.map(value => value.output);
  const balances = {};
  _.forEach(vaultBalances, (totalSupply, index) => {
    let balance = new BigNumber(totalSupply || 0);
    let asset = configs.vault.cVaultSeed[index].underlyingToken;
    let total = new BigNumber(balances[asset] || 0);
    balances[asset] = balance.plus(total).toFixed();
  });
  return balances
}

async function cVaultBalancerTvl(timestamp, block) {
  const vaultBalances = (await sdk.api.abi.multiCall({
    block,
    calls: _.map(configs.vault.cVaultBalancer, vaultToken => ({
      target: vaultToken.contract
    })),
    abi: balance,
  })).output.map(value => value.output);
  const pools = configs.vault.cVaultBalancer.map(value => value.underlyingToken);
  let poolCalls = [];
  const poolTokenData = (await sdk.api.abi.multiCall({
    calls: _.map(pools, (poolAddress) => ({target: poolAddress})),
    abi: getCurrentTokens,
  })).output;
  const totalSupplies = (await sdk.api.abi.multiCall({
    block,
    calls: _.map(pools, poolAddress => ({
      target: poolAddress
    })),
    abi: 'erc20:totalSupply',
  })).output;

  _.forEach(poolTokenData, (poolToken, index) => {
    let poolTokens = poolToken.output;
    let poolAddress = poolToken.input.target;

    _.forEach(poolTokens, (token) => {
      poolCalls.push({
        target: token,
        vaultBalance: vaultBalances[index] || 0,
        totalSupply: totalSupplies[index].output || 0,
        params: poolAddress,
      });
    })
  });
  let poolBalances = (await sdk.api.abi.multiCall({
    block,
    calls: poolCalls,
    abi: 'erc20:balanceOf'
  })).output;
  let balances = {};
  _.each(poolBalances, (balanceOf, index) => {
    if (balanceOf.success) {
      let balance = balanceOf.output;
      let address = balanceOf.input.target;

      if (new BigNumber(balance).toNumber() <= 0) {
        return;
      }
      let vaultBalance = poolCalls[index].vaultBalance || 0;
      let totalSupply = poolCalls[index].totalSupply || 0;
      if (vaultBalance > 0 && totalSupply > 0) {
        balance = new BigNumber(balance).times(vaultBalance).div(totalSupply).toFixed();
        balances[address] = new BigNumber(balances[address] || 0).plus(balance).toFixed();
      }
    }
  });
  return balances;
}

async function uNIv2LPVaultTvl(timestamp, block) {
  const totalVaultSupplies = (await sdk.api.abi.multiCall({
    block,
    calls: _.map(configs.vault.uniV2LP, vaultToken => ({
      target: vaultToken.contract
    })),
    abi: 'erc20:totalSupply',
  })).output.map(value => value.output);

  const pairs = configs.vault.uniV2LP.map(value => value.underlyingToken);
  const pairInfos = await uniSwapPairInfo(pairs, timestamp, block)
  const balanceOfResult = []
  for (let index = 0; index < configs.vault.uniV2LP.length; index++) {
    let vaultSupply = new BigNumber(totalVaultSupplies[index] || 0)
    let {reserve0, reserve1, token0, token1, totalSupply} = pairInfos[index];
    if (reserve0 && reserve1 && token0 && token1 && totalSupply) {
      balanceOfResult.push({
        address: token0,
        balance: new BigNumber(reserve0).times(vaultSupply).div(totalSupply).toFixed()
      })
      balanceOfResult.push({
        address: token1,
        balance: new BigNumber(reserve1).times(vaultSupply).div(totalSupply).toFixed()
      })
    }
  }
  const balances = {};
  _.forEach(balanceOfResult, (result) => {
    let balance = new BigNumber(result.balance || 0);
    let asset = result.address;
    let total = new BigNumber(balances[asset] || 0);
    balances[asset] = balance.plus(total).toFixed();
  });
  return balances
}

async function vaultTvl(timestamp, block) {
  return mergeBalance([
      await singleVaultTvl(timestamp, block),
      await uNIv2LPVaultTvl(timestamp, block),
      await cuNIv2LPVaultTvl(timestamp, block),
      await cVaultBalancerTvl(timestamp, block),
      await cVaultSeedTvl(timestamp, block)
    ]
  )
}

async function seedPoolStakeTvl(timestamp, block) {
  const balances = {};
  const pools = configs.seed
  let balanceOfCalls = [];
  _.forEach(pools, (pool) => {
    balanceOfCalls = [
      ...balanceOfCalls,
      ..._.map(pool.tokens, (token) => ({
        target: token,
        params: pool.stakingContract
      }))
    ];
  });

  const balanceOfResult = (await sdk.api.abi.multiCall({
    block,
    calls: balanceOfCalls,
    abi: 'erc20:balanceOf',
  })).output;
  _.forEach(balanceOfResult, (result) => {
    let balance = new BigNumber(result.output || 0);
    let asset = result.input.target;
    let total = new BigNumber(balances[asset] || 0);
    balances[asset] = balance.plus(total).toFixed();
  });
  return balances;
}


async function tvl(timestamp, block) {
  const seedPoolStake = await seedPoolStakeTvl(timestamp, block);
  const vault = await vaultTvl(timestamp, block)
  return await mergeBalance([seedPoolStake, vault]);
}

/*==================================================
  Exports
==================================================*/
module.exports = {
  name: 'valuedefi',
  token: null,
  category: 'dexes',
  start: 1601440616,  // 09/30/2020 @ 4:36am (UTC)
  tvl,
};
