const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');
const factoryAbi = require("./abis/v1factory.json");

const START_BLOCK = 6627917;
const FACTORY = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95';
const ETH = '0x0000000000000000000000000000000000000000'.toLowerCase();
const v1pools = require('./univ1pools.json');

module.exports = async function tvl(timestamp, block) {
  const supportedTokens = await (
    sdk
      .api
      .util
      .tokenList()
      .then((supportedTokens) => supportedTokens.map(({ contract }) => contract.toLowerCase()))
  );

  let poolData = v1pools;
  let tokenCalls = [];
  let ethCalls = [];

  for (let exchange of Object.keys(poolData)) {
    let exchangeData = poolData[exchange];
    if (exchangeData.block > block) break;
    if (supportedTokens.includes(exchangeData.tokens[0].toLowerCase())) {
      tokenCalls.push({
        target: exchangeData.tokens[0],
        params: exchange
      })
    }

    ethCalls.push(exchange);
  }

  const tokenBalances = (
    await sdk.api.abi
      .multiCall({
        abi: 'erc20:balanceOf',
        calls: tokenCalls,
        block,
      })
  ).output;

  // note that this undercounts ETH locked
  // it only measures ETH in exchanges for supported tokens
  const ETHBalances = (
    await sdk.api.eth
      .getBalances({
        targets: ethCalls,
        block,
      })
  ).output;

  return tokenBalances.reduce(
    (accumulator, tokenBalance) => {
      if (tokenBalance.success) {
        const balanceBigNumber = new BigNumber(tokenBalance.output)
        if (!balanceBigNumber.isZero()) {
          const tokenAddress = tokenBalance.input.target.toLowerCase()
          accumulator[tokenAddress] = balanceBigNumber.toFixed()
        }
      }
      return accumulator
    },
    {
      [ETH]: ETHBalances.reduce(
        (accumulator, ETHBalance) =>
          accumulator.plus(new BigNumber(ETHBalance.balance)),
        new BigNumber('0')
      ).toFixed(),
    }
  )
};
