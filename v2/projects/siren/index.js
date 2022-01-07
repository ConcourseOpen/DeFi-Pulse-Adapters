/*==================================================
  Modules
  ==================================================*/
const { request, gql } = require('graphql-request');
const BigNumber = require('bignumber.js');
const sdk = require('../../../sdk');

const GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/sirenmarkets/protocol';

/*==================================================
  TVL
  ==================================================*/

async function getTokens(amms) {
  const tokens = [];
  for (let i = 0; i < amms.length; i++) {
    let amm = amms[i];
    tokens.push(amm['collateralToken']['id']);
  }
  return tokens;
}

async function getHolders(amms) {
  const holders = [];

  for (let i = 0; i < amms.length; i++) {
    let amm = amms[i];

    holders.push(amm['id']);
    for (let im = 0; im < amm.markets.length; im++) {
      const market = amm.markets[im];

      holders.push(market['id']);
    }
  }

  return holders;
}

async function calculateMainnetTVL(timestamp, block, mainnet_amms) {
  const mainnet_result = {
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': '0'
  };

  for (let i = 0; i < mainnet_amms.length; i++) {
    const amm = mainnet_amms[i];
    const collateralToken = amm['collateralToken']['id'];
    // Get collateral in AMM
    let response;
    try {
      response = await sdk.api.erc20.balanceOf({
        block,
        target: collateralToken,
        owner: amm['id']
      });
    } catch (err) {
      console.log(err);
    }
    if (!mainnet_result[collateralToken]) {
      mainnet_result[collateralToken] = '0';
    }
    mainnet_result[collateralToken] = BigNumber(mainnet_result[collateralToken]).plus(response.output).toFixed();

    // Get collateral in Markets
    for (let im = 0; im < amm.markets.length; im++) {
      const market = amm.markets[im];

      const response = await sdk.api.erc20.balanceOf({
        block: block,
        target: collateralToken,
        owner: market['id']
      });

      mainnet_result[collateralToken] = BigNumber(mainnet_result[collateralToken]).plus(response.output).toFixed();
    }
  }
  return mainnet_result;
}

const GET_POOLS = gql`
  query Pools($block: Int) {
    amms(block: { number: $block }) {
      id
      collateralToken {
        id
      }
      markets {
        id
      }
    }
  }`;

let tokenHolderMap = [];

async function tvl(timestamp, block) {
  const { amms } = await request(GRAPH_URL, GET_POOLS, {
    block
  });
  const tokens = await getTokens(amms);
  const holders = await getHolders(amms);
  const balances = await calculateMainnetTVL(timestamp, block, amms);
  tokenHolderMap = [
    {
      tokens,
      holders
    }
  ];
  return balances;
}

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Siren',
  token: 'SI',
  category: 'Derivatives',
  start: 1605574800, // Nov-17-2020 01:00:00 AM +UTC
  chain: 'ethereum',
  tvl,
  tokenHolderMap
};
