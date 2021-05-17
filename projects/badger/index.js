/*==================================================
  Modules
  ==================================================*/

const sdk = require("../../sdk");
const settAbi = require("./abis/Sett.json");
const yearnAbi = require("./abis/YearnWrapper.json");
const _ = require("underscore");
const axios = require("axios");
const BigNumber = require("bignumber.js");

/*==================================================
    Settings
    ==================================================*/

const renCrv = "0x49849C98ae39Fff122806C06791Fa73784FB3675";
const sbtcCrv = "0x075b1bb99792c9E1041bA13afEf80C91a1e70fB3";
const tbtcCrv = "0x64eda51d3Ad40D56b9dFc5554E06F94e1Dd786Fd";
const uniBadgerWbtc = "0xcd7989894bc033581532d2cd88da5db0a4b12859";
const uniDiggWbtc = "0xe86204c4eddd2f70ee00ead6805f917671f56c52";
const sushiBadgerWbtc = "0x110492b31c59716ac47337e616804e3e3adc0b4a";
const sushiWbtcEth = "0xceff51756c56ceffca006cd410b03ffc46dd3a58";
const sushiDiggWbtc = "0x9a13867048e01c663ce8ce2fe0cdae69ff9f35e3";
const digg = "0x798d1be841a82a273720ce31c822c61a67a601c3";
const wbtc = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
const sushiibBTCwBTC = "0x18d98D452072Ac2EB7b74ce3DB723374360539f1";

const UNI_SUBGRAPH = "uniswap/uniswap-v2";
const SUSHI_SUBGRAPH = "sushiswap/exchange";

// Platforms are used to find the underlying balances / values of LP tokens
const platforms = {
  curve: [renCrv, sbtcCrv, tbtcCrv],
  uniswap: [uniBadgerWbtc, uniDiggWbtc],
  sushi: [sushiBadgerWbtc, sushiWbtcEth, sushiDiggWbtc, sushiibBTCwBTC],
};

// Setts are the badger vaults that users invest in
const setts = {
  "0x6dEf55d2e18486B9dDfaA075bc4e4EE0B28c1545": renCrv, // native.renCrv sett
  "0xd04c48A53c111300aD41190D63681ed3dAd998eC": sbtcCrv, // native.sbtcCrv sett
  "0xb9D076fDe463dbc9f915E5392F807315Bf940334": tbtcCrv, // native.tbtcCrv sett
  "0x235c9e24D3FB2FAFd58a2E49D454Fdcd2DBf7FF1": uniBadgerWbtc, // native.uniBadgerWbtc sett
  "0xC17078FDd324CC473F8175Dc5290fae5f2E84714": uniDiggWbtc, // uni.diggWbtc
  "0xAf5A1DECfa95BAF63E0084a35c62592B774A2A87": renCrv, // harvest.renCrv sett
  "0x758a43ee2bff8230eeb784879cdcff4828f2544d": sushiWbtcEth, // sushi.wbtcEth sett
  "0x1862A18181346EBd9EdAf800804f89190DeF24a5": sushiBadgerWbtc, // sushi.badgerWbtc sett
  "0x88128580ACdD9c04Ce47AFcE196875747bF2A9f6": sushiDiggWbtc, // sushi.diggWbtc
  "0x7e7E112A68d8D2E221E11047a72fFC1065c38e1a": digg, // native.digg
  "0x4b92d19c11435614CD49Af1b589001b7c08cD4D5": wbtc, // yearn.wBTC
  "0x8a8FFec8f4A0C8c9585Da95D9D97e8Cd6de273DE": sushiibBTCwBTC, // sushi.ibBTCwBTC
};

const crvTokens = {
  [renCrv]: "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d",
  [sbtcCrv]: "0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6",
  [tbtcCrv]: "0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa",
};

const decimals = {
  "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599": 8, // wBTC
  "0xeb4c2781e4eba804ce9a9803c67d0893436bb27d": 8, // renBTC
  "0x3472A5A71965499acd81997a54BBA8D852C6E53d": 18, // badger
  "0xfe18be6b3bd88a2d2a7f928d00292e7a9963cfc6": 18, // sBTC
  "0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa": 18, // tBTC
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": 18, // eth
  "0x798d1be841a82a273720ce31c822c61a67a601c3": 9, // digg
  "0xc4E15973E6fF2A35cC804c2CF9D2a1b817a8b40F": 18, // ibBTC
};

let balances = {};

/*==================================================
    PLATFORM SPECIFIC
    ==================================================*/
async function _getPairValue(url, address, holdings) {
  let response = await axios.post(
    "https://api.thegraph.com/subgraphs/name/" + url,
    JSON.stringify({
      query: `
          {
            pair(id:"${address.toLowerCase()}") {
              reserve0
              reserve1
              token0 {
                id
              }
              token1 {
                id
              }
              totalSupply
            }
          }`,
    })
  );
  let data = response.data;

  const holdingsRatio =
    parseFloat(holdings) / parseFloat(data.data.pair.totalSupply);
  const token0Holdings = parseFloat(data.data.pair.reserve0) * holdingsRatio;
  const token1Holdings = parseFloat(data.data.pair.reserve1) * holdingsRatio;
  const token0address = data.data.pair.token0.id;
  const token1address = data.data.pair.token1.id;

  let returnValue = [
    { [token0address]: token0Holdings },
    { [token1address]: token1Holdings },
  ];
  return returnValue;
}

async function _getCurveVirtualPrice(token, holdings) {
  let url = "https://stats.curve.fi/raw-stats/rens-1m.json";
  if (token === tbtcCrv) {
    url = "https://stats.curve.fi/raw-stats/tbtc-1m.json";
  }
  let response = await axios.get(url);
  let data = response.data;
  return BigNumber(holdings).multipliedBy(
    BigNumber(data[0].virtual_price).div(10 ** 18)
  );
}

async function _handleCurve(token, underlyingAmounts) {
  let crvBalance = await _getCurveVirtualPrice(token, underlyingAmounts);
  if (balances[crvTokens[token]] > 0) {
    balances[crvTokens[token]] = BigNumber(balances[crvTokens[token]]).plus(
      crvBalance
    );
  } else {
    balances[crvTokens[token]] = crvBalance;
  }
  return;
}

/*==================================================
    TVL
    ==================================================*/
async function tvl(timestamp, block) {
  // We calculate the TVL for badger by retrieving the total minted wrapped tokens * their
  // respective Price Per Full Share.  This gives the amount of the underlying tokens.  To
  // find the value of the underlying tokens, we retrieve the pool composition from their
  // respective platforms and multiply by the percentage holdings

  let settPpfs = {};
  let underlyingAmounts = {};

  // Get Price Per Full Share for each sett token
  const bTokenPpfs = await sdk.api.abi.multiCall({
    block,
    calls: _.map(setts, (underlying, address) => ({
      target: address,
    })),
    abi: settAbi["getPricePerFullShare"],
  });

  bTokenPpfs.output.forEach((ppfs) => {
    if (ppfs.success) {
      const bTokenAddress = ppfs.input.target;
      settPpfs[setts[bTokenAddress]] = BigNumber(ppfs.output).div(10 ** 18);
    }
  });

  // Get total supply of all wrapped tokens
  const bTokenSupplies = await sdk.api.abi.multiCall({
    block,
    calls: _.map(setts, (underlying, bTokenAddress) => ({
      target: bTokenAddress,
    })),
    abi: settAbi["totalSupply"],
  });

  bTokenSupplies.output.forEach((bTokenSupply) => {
    if (bTokenSupply.success) {
      let valueInToken = bTokenSupply.output;
      const underlyingAddress = setts[bTokenSupply.input.target];
      if (underlyingAmounts[underlyingAddress] > 0) {
        underlyingAmounts[underlyingAddress] = BigNumber(valueInToken)
          .multipliedBy(settPpfs[underlyingAddress])
          .plus(underlyingAmounts[underlyingAddress]);
      } else {
        underlyingAmounts[underlyingAddress] = BigNumber(
          valueInToken
        ).multipliedBy(settPpfs[underlyingAddress]);
      }
    }
  });

  try {
    // Digg setts handle price per full share differently
    const diggVaultBalance = await sdk.api.abi.call({
      block,
      target: "0x7e7E112A68d8D2E221E11047a72fFC1065c38e1a",
      abi: settAbi["balance"],
    });
    const diggVaultTotalSupply = await sdk.api.abi.call({
      block,
      target: "0x7e7E112A68d8D2E221E11047a72fFC1065c38e1a",
      abi: settAbi["totalSupply"],
    });

    if (diggVaultBalance.success) {
      let diggPpfs = BigNumber(diggVaultBalance.output)
        .div(10 ** 9)
        .div(diggVaultTotalSupply.output.div(10 ** 18));
      balances[digg] = underlyingAmounts[digg].multipliedBy(diggPpfs);
    }
  } catch (err) {}

  try {
    // Yearn Wrapper has "pricePerShare" rather than "getPricePerFullShare"
    const yearnPpfs = await sdk.api.abi.call({
      block: block,
      target: "0x4b92d19c11435614CD49Af1b589001b7c08cD4D5",
      abi: yearnAbi["pricePerShare"],
    });
    const yearnTotalSupply = await sdk.api.abi.call({
      block: block,
      target: "0x4b92d19c11435614CD49Af1b589001b7c08cD4D5",
      abi: settAbi["totalSupply"],
    });

    if (!!yearnPpfs.output) {
      const ppfs = BigNumber(yearnPpfs.output).div(10 ** 8);
      console.log("ppfs:", ppfs);
      balances[wbtc] = BigNumber(yearnTotalSupply.output).multipliedBy(ppfs);
    }

    console.log("balances:", balances, balances[wbtc].toString());
  } catch (err) {}

  // For each platform, iterate through the contracts and find their underlying
  await Promise.all(
    platforms["curve"].map(async (token) => {
      await _handleCurve(token, underlyingAmounts[token]);
    })
  );

  await Promise.all(
    platforms["sushi"].map(async (token) => {
      let underlyingTokenBalance = await _getPairValue(
        SUSHI_SUBGRAPH,
        token,
        !!underlyingAmounts[token] ? underlyingAmounts[token] : 0
      );
      underlyingTokenBalance.forEach((pair) => {
        if (balances[Object.keys(pair)[0]] > 0) {
          balances[Object.keys(pair)[0]] = BigNumber(
            balances[Object.keys(pair)[0]]
          ).plus(pair[Object.keys(pair)[0]]);
        } else {
          balances[Object.keys(pair)[0]] = pair[Object.keys(pair)[0]];
        }
      });
    })
  );

  await Promise.all(
    platforms["uniswap"].map(async (token) => {
      let underlyingTokenBalance = await _getPairValue(
        UNI_SUBGRAPH,
        token,
        !!underlyingAmounts[token] ? underlyingAmounts[token] : 0
      );
      underlyingTokenBalance.forEach((pair) => {
        if (balances[Object.keys(pair)[0]] > 0) {
          balances[Object.keys(pair)[0]] = BigNumber(
            balances[Object.keys(pair)[0]]
          ).plus(pair[Object.keys(pair)[0]]);
        } else {
          balances[Object.keys(pair)[0]] = pair[Object.keys(pair)[0]];
        }
      });
    })
  );

  _.map(balances, (value, key) => {
    if (decimals[key] < 18) {
      let divisor = 10 ** (18 - decimals[key]);
      balances[key] = BigNumber(value).div(divisor);
      console.log(key, ": ", balances[key].toString());
    } else {
      console.log(key, ": ", balances[key].toString());
    }
  });
  return balances;
}

/*==================================================
    Exports
    ==================================================*/

module.exports = {
  name: "BadgerDAO", // project name
  token: "BADGER", // null, or token symbol if project has a custom token
  category: "assets", // allowed values as shown on DefiPulse: 'Derivatives', 'DEXes', 'Lending', 'Payments', 'Assets'
  start: 1607059800, // unix timestamp (utc 0) specifying when the project began, or where live data begins
  tvl, // tvl adapter
};
