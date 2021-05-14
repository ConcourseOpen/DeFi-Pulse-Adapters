const ethers = require('ethers');
const { request, gql } = require("graphql-request");
const sdk = require('../../sdk');

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

function sumSingleBalance(
  balances,
  token,
  balance
) {
  if (typeof balance === 'number') {
    const prevBalance = balances[token] ?? 0
    if (typeof prevBalance !== 'number') {
      throw new Error(`Trying to merge token balance and CoinGecko amount for ${token}`)
    }
    (balances[token]) = prevBalance + balance;
  } else {
    const prevBalance = ethers.BigNumber.from(balances[token] ?? "0");
    balances[token] = prevBalance.add(ethers.BigNumber.from(balance)).toString();
  }
}

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
      sumSingleBalance(balances, collateral, amount.output)
    })
  )

  return balances;
}

module.exports = {
  name: 'UMA',
  token: 'UMA',
  category: 'Derivatives',
  start: 1578581061, // Jan-09-2020 02:44:21 PM +UTC
  tvl
}
