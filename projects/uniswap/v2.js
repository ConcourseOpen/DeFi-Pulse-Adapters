const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');
const v2pools = require('./univ2pools.json');
const ETH = '0x0000000000000000000000000000000000000000'.toLowerCase();

module.exports = async function tvl(timestamp, block) {
  const supportedTokens = await (
    sdk
      .api
      .util
      .tokenList()
      .then((supportedTokens) => supportedTokens.map(({ contract }) => contract.toLowerCase()))
  );

  let poolData = v2pools;
  let tokenCalls = [];

  for (let exchange of Object.keys(poolData)) {
    let exchangeData = poolData[exchange];
    if (exchangeData.block > block) break;
    if (supportedTokens.includes(exchangeData.tokens[0].toLowerCase())) {
      tokenCalls.push({
        target: exchangeData.tokens[0],
        params: exchange
      })
    }
    if (supportedTokens.includes(exchangeData.tokens[1].toLowerCase())) {
      tokenCalls.push({
        target: exchangeData.tokens[1],
        params: exchange
      })
    }
  }

  const tokenBalances = (
    await sdk.api.abi
      .multiCall({
        abi: 'erc20:balanceOf',
        calls: tokenCalls,
        block,
      })
  ).output;

  return tokenBalances.reduce(
    (accumulator, tokenBalance) => {
      if (tokenBalance.success) {
        console.log(tokenBalance)
        const balanceBigNumber = new BigNumber(tokenBalance.output)
        if (!balanceBigNumber.isZero()) {
          const tokenAddress = tokenBalance.input.target.toLowerCase()
          accumulator[tokenAddress] = accumulator[tokenAddress] ? accumulator[tokenAddress].plus(balanceBigNumber) : balanceBigNumber
        }
      }
      return accumulator
    },
    {
      [ETH]: 0
    }
  )
};
