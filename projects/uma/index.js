const { request, gql } = require("graphql-request");
const sdk = require('../../sdk')

const endpoint = 'https://api.thegraph.com/subgraphs/name/umaprotocol/mainnet-contracts'
const query = gql`
query get_tvl($block: Int) {
  financialContracts(
    block: { number: $block }
  ) {
    address
    collateralToken{
      address
    }
  }
}
`;

async function tvl(timestamp, block) {
  const balances = {};
  const results = await await request(endpoint, query, {block})
  await Promise.all(
    results.financialContracts.map(async contract => {
      const collateral = contract.collateralToken.address
      const amount = await sdk.api.erc20.balanceOf({
        target: collateral,
        owner: contract.address,
        block
      })
      sdk.util.sumSingleBalance(balances, collateral, amount.output)
    })
  )

  return balances;
}

module.exports = {
  name: 'UMA',
  token: 'UMA',
  category: 'derivatives',
  start: 1578581061, // Jan-09-2020 02:44:21 PM +UTC
  tvl
}
