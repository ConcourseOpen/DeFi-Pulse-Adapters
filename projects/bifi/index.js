const sdk = require("../../sdk");

const stakingPool = '0x488933457E89656D7eF7E69C10F2f80C7acA19b5';
const bfcAddr = '0x0c7D5ae016f806603CB1782bEa29AC69471CAb9c';

const ethPool = '0x13000c4a215efe7e414bb329b2f11c39bcf92d78';
const ethTokenPools = {
    'usdt': {
        'pool': '0x808c3ba97268dbf9695b1ec10729e09c7e67a9e3',
        'token': '0xdac17f958d2ee523a2206206994597c13d831ec7'
    },
    'dai': {
        'pool': '0xd76b7060f1b646fa14740ff6ac670a4f0a6fc5e3',
        'token': '0x6b175474e89094c44da98b954eedeac495271d0f'
    },
    'link': {
        'pool': '0x25567603eb61a4a49f27e433652b5b8940d10682',
        'token': '0x514910771af9ca656af840dff83e8264ecf986ca'
    },
    'usdc': {
        'pool': '0x128647690C7733593aA3Dd149EeBC5e256E79217',
        'token': '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
    }
}

const BFCLPPool = '0xeaCE4E60F68E20797Fc696c870066f1E19C2b37d';
const BFCLPToken = '0x01688e1a356c38A8ED7C565BF6c6bfd59543a560';

const BIFILPPool = '0x18740cea640cba9Ce836DC80cE61c7b9ca4f11cb';
const BIFILPToken = '0x1ec9b867b701c1e5ce9a6567ecc4b71838497c27';


async function tvl(timestamp, block) {
  let balances = {};

  const coinAddress = '0x0000000000000000000000000000000000000000'
  // eth
  balances[coinAddress] = (await sdk.api.eth.getBalance({
    target: ethPool,
    block
  })).output

  // staking pool
  let tokenStaked = await sdk.api.erc20.balanceOf({
    target: bfcAddr,
    owner: stakingPool,
    block
  });
  balances[bfcAddr] = tokenStaked.output;

  // staking pool
  let bfcLPTokenPooled = await sdk.api.erc20.balanceOf({
    target: BFCLPToken,
    owner: BFCLPPool,
    block
  });
  balances[BFCLPToken] = bfcLPTokenPooled.output;

  // staking pool
  let bifiLPTokenPooled = await sdk.api.erc20.balanceOf({
    target: BIFILPToken,
    owner: BIFILPPool,
    block
  });
  balances[BIFILPToken] = bifiLPTokenPooled.output;

  // eth tokens
  for (token in ethTokenPools) {
    tokenPool = ethTokenPools[token];
    let tokenLocked = await sdk.api.erc20.balanceOf({
      target: tokenPool.token,
      owner: tokenPool.pool,
      block
    });
    balances[tokenPool.token] = tokenLocked.output;
  }

  return balances
}

module.exports = {
  tvl
}
