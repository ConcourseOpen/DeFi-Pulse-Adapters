/*==================================================
  Modules
  ==================================================*/

const _ = require('underscore');
const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');
const liquidityAbi = require('./abi/liquidity.json');

const ETH = '0x0000000000000000000000000000000000000000';

/*==================================================
  Settings
  ==================================================*/

const liquidityPool = '0x35ffd6e268610e764ff6944d07760d0efe5e40e5'

// cache some data
let markets = {
  '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE': {
    symbol: 'ETH',
    decimals: 18,
    kToken: '0xC4c43C78fb32F2c7F8417AF5af3B85f090F1d327',
  },
  '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2': {
    symbol: 'WETH',
    decimals: 18,
    kToken: '0xac19815455C2c438af8A8b4623F65f091364be10',
  },
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48': {
    symbol: 'USDC',
    decimals: 6,
    kToken: '0xac826952bc30504359a099c3a486d44E97415c77',
  },
  '0x6B175474E89094C44Da98b954EedeAC495271d0F': {
    symbol: 'DAI',
    decimals: 18,
    kToken: '0x0314b6CC36Ea9b48f34a350828Ce98F17B76bC44',
  },
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599': {
    symbol: 'WBTC',
    decimals: 8,
    kToken: '0xDfd1B73e7635D8bDA4EF16D5f364c6B6333769C8',
  },
  '0xEB4C2781e4ebA804CE9a9803C67d0893436bB27D': {
    symbol: 'renBTC',
    decimals: 8,
    kToken: '0xDcAF89b0937c15eAb969Ea01f57AAacc92A21995',
  },
};

/*==================================================
  TVL
  ==================================================*/

async function getToken(block, index) {
  try {
    return (await sdk.api.abi.call({
      block,
      target: liquidityPool,
      params: [index],
      abi: liquidityAbi['registeredTokens'],
    })).output
  } catch {
    return null
  }
}

async function getAllTokens(block) {
  let tokens = []
  for (let i = 0 ; ; i ++) {
    const token = await getToken(block, i)

    if (!token) {
      break;
    }

    tokens.push(token)
  }

  return tokens;
}

async function getKToken(block, token) {
  return (await sdk.api.abi.call({
    block,
    target: liquidityPool,
    params: [token],
    abi: liquidityAbi['kToken'],
  })).output;
}

// returns {[underlying]: {kToken, decimals, symbol}}
async function getMarkets(block) {
  if (block < 11908288) {
    // the allMarkets getter was only added in this block.
    return markets;
  } else {
    let allTokens = await getAllTokens(block);
    // if not in cache, get from the blockchain
    for (token of allTokens) {
      let kToken = await getKToken(block, token);

      if (!markets[token]) {
        let info = await sdk.api.erc20.info(token);
        markets[token] = { kToken, decimals: info.output.decimals, symbol: info.output.symbol };
      }
    }

    return markets;
  }
}

async function tvl(timestamp, block) {
  let balances = {};
  let markets = await getMarkets(block);

  // Get V1 tokens locked
  let v1Locked = await sdk.api.abi.multiCall({
    block,
    calls: _.map(markets, (data, token) => ({
      target: token,
      params: liquidityPool,
    })),
    abi: 'erc20:balanceOf',
  });

  sdk.util.sumMultiBalanceOf(balances, v1Locked);

  let ethBalance = (await sdk.api.eth.getBalance({target: liquidityPool, block})).output;
  balances[ETH] = BigNumber(balances[ETH] || 0).plus(ethBalance).toFixed();

  return balances;
}

/*==================================================
  Rates
  ==================================================*/

async function rates(timestamp, block) {
  let rates = {
    lend: {},
    borrow: {},
    supply: {},
  };

  return rates;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'KeeperDAO',
  website: 'https://keeperdao.com',
  token: 'ROOK',
  category: 'lending',
  start: 1611991703, // 01/30/2021 @ 07:28:23 AM +UTC
  tvl,
  rates,
  term: '1 block',
  permissioning: 'Open',
  variability: 'Medium',
};
