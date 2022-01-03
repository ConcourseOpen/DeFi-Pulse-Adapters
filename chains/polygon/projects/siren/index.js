/*==================================================
  Modules
  ==================================================*/
const { request, gql } = require('graphql-request');
const BigNumber = require('bignumber.js');
const sdk = require('../../../../sdk');

const POLYGON_GRAPH_URL = 'https://api.thegraph.com/subgraphs/name/sirenmarkets/protocol-v2-matic';

/*==================================================
  TVL
  ==================================================*/

async function getTokens(amms) {
  let tokens = [];
  for (let i = 0; i < amms['amms'].length; i++) {
    let amm = amms['amms'][i];
    tokens.push(amm['collateralToken']['id']);
  }
  return tokens;
}

async function getHolders(amms) {
  const { seriesVaults } = await request(POLYGON_GRAPH_URL, GET_SERIES_VAULT_ID);

  const holders = [];

  for (let i = 0; i < amms['amms'].length; i++) {
    let amm = amms['amms'][i];
    holders.push(amm['id']);
  }
  holders.push(seriesVaults[0]['id']);
  return holders;
}

async function calculatePolygonTVL(timestamp, block, polygon_amms) {
  const { seriesVaults } = await request(POLYGON_GRAPH_URL, GET_SERIES_VAULT_ID);

  const polygon_result = {
    'polygon:0x2791bca1f2de4661ed88a30c99a7a9449aa84174': '0'
  };

  for (let i = 0; i < polygon_amms['amms'].length; i++) {
    const amm = polygon_amms['amms'][i];
    const collateralToken = amm['collateralToken']['id'];

    // Get collateral in AMM
    const response = await sdk.api.abi.call({
      target: collateralToken,
      params: amm['id'],
      abi: 'erc20:balanceOf',
      block: block
    });

    if (!polygon_result[collateralToken]) {
      polygon_result[collateralToken] = '0';
    }
    polygon_result[collateralToken] = BigNumber(polygon_result[collateralToken]).plus(response.output).toFixed();

    // Get collateral in Series
    const response2 = await sdk.api.abi.call({
      target: collateralToken,
      params: seriesVaults[0]['id'],
      abi: 'erc20:balanceOf',
      block: block
    });
    polygon_result[collateralToken] = BigNumber(polygon_result[collateralToken]).plus(response2.output).toFixed();
  }
  return polygon_result;
}

let tokenHolderMap = [];

async function tvl(timestamp, block) {
  const amms = await request(POLYGON_GRAPH_URL, GET_POOLS_POLYGON, {
    block
  });

  const tokens = await getTokens(amms);
  const holders = await getHolders(amms);
  const balances = await calculatePolygonTVL(timestamp, block, amms);
  tokenHolderMap = [
    {
      tokens,
      holders
    }
  ];
  return balances;
}

const GET_POOLS_POLYGON = gql`
  query Pools($block: Int) {
    amms(block: { number: $block }) {
      id
      collateralToken {
        id
      }
    }
  }`;

const GET_SERIES_VAULT_ID = gql`
  query {
    seriesVaults {
      id
    }
  }`;

/*==================================================
  Exports
  ==================================================*/

module.exports = {
  name: 'Siren',
  token: 'SI',
  category: 'Derivatives',
  start: 1605574800, // Nov-17-2020 01:00:00 AM +UTC // tvl function should be kept above tokenHolderMap
  tokenHolderMap: [
    {
      tokens: [
        '0xda537104d6a5edd53c6fbba9a898708e465260b6',
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
        '0x85955046df4668e1dd369d2de9f3aeb98dd2a369',
        '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        '0x0b3f868e0be5597d5db7feb59e1cadbb0fdda50a',
        '0x1c954e8fe737f99f68fa1ccda3e51ebdb291948c',
        '0x7ceb23fd6bc0add59e62ac25578270cff1b9f619',
        '0xb33eaad8d922b1083446dc23f610c2567fb5180f',
        '0x1bfd67037b42cf73acf2047067bd4f2c47d9bfd6'
      ],
      holders: [
        '0x3deceb065c2d0aad57dca083e946f2e05a89580b',
        '0x41667758d84c1a6c89e4422fce6453bb376ddb8d',
        '0x5848311b010fb960f2aa1354833d3a887cb44fb6',
        '0xa42e6396c4a66c764d5e86f1ba6b68c3b6427f64',
        '0xa77c6917b2399cb99391f7ce32a4d9658de6ae4e',
        '0xb16bfebfbebf7b5f91bf04782b1eaaeeb400b9d4',
        '0xb54dfba46af632e865c3cec53f4e631307fa22ef',
        '0xc3f7250f458e86a4bd19d0819550ac0b17902bdc',
        '0xedd2a39b0a4770e61eb7998f371522169d253905',
        '0xc40a31bd9fed1569ce647bb7de7ff93facca36e9'
      ]
    }
  ],
  chain: 'polygon'
};
