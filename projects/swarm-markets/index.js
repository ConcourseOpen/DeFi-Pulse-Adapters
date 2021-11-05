/*==================================================
  Modules
==================================================*/

const sdk = require("../../sdk");
const BigNumber = require("bignumber.js");
const { request, gql } = require("graphql-request");

const SUBGRAPH_URL =
  "https://api.thegraph.com/subgraphs/name/protofire/swarm-markets";
const XTokenWrapperContractAddress =
  "0x2b9dc65253c035eb21778cb3898eab5a0ada0cce";

/*==================================================
  TVL
  ==================================================*/

async function getTokens() {
  let tokens = [];

  try {
    const tokensQuery = gql`
      query Tokens {
        tokens(where: { symbol_not: "SPT" }) {
          id
        }
      }
    `;
    const tokensResponse = await request(SUBGRAPH_URL, tokensQuery);
    tokens = tokensResponse.tokens.map((token) => token.id);
  } catch (e) {
    console.log(e);
    throw e;
  }

  return tokens;
}

async function getBalances(tokens, block) {
  const balanceCalls = tokens.map((token) => ({
    target: token,
    params: XTokenWrapperContractAddress,
  }));

  let balanceResponses;
  try {
    balanceResponses = (
      await sdk.api.abi.multiCall({
        block,
        calls: balanceCalls,
        abi: "erc20:balanceOf",
      })
    ).output;
  } catch (e) {
    console.log(e);
    throw e;
  }

  let balances = {};
  balanceResponses.forEach((response) => {
    if (response.success) {
      const token = response.input.target;
      const balance = BigNumber(response.output);

      if (balance > 0) {
        balances[token] = balance.toFixed();
      }
    }
  });

  return balances;
}

let tokenHolderMap = [];
async function tvl(timestamp, block) {
  const tokens = await getTokens();
  const balances = await getBalances(tokens, block);

  tokenHolderMap = [
    {
      tokens,
      holders: [XTokenWrapperContractAddress],
    },
  ];

  return balances;
}

/*==================================================
  Exports
==================================================*/

module.exports = {
  name: "Swarm Markets",
  token: "SMT",
  category: "dexes",
  start: 1627776000, // Sunday, Aug 01, 2021 12:00:00.000 AM +UTC
  tvl, // tvl function should be kept above tokenHolderMap
  tokenHolderMap,
};
