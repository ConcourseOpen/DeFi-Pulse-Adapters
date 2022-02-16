const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');
const factoryAbi = require("./abis/v1factory.json");

const START_BLOCK = 6627917;
const FACTORY = '0xc0a47dFe034B400B47bDaD5FecDa2621de6c4d95';
const ETH = '0x0000000000000000000000000000000000000000'.toLowerCase();

module.exports = async function tvl(timestamp, block) {
  const supportedTokens = await (
    sdk
      .api
      .util
      .tokenList()
      .then((supportedTokens) => supportedTokens.map(({ contract }) => contract))
  );

  const logs = (await sdk.api.util
    .getLogs({
      keys: [],
      toBlock: block,
      target: FACTORY,
      fromBlock: START_BLOCK,
      topic: 'NewExchange(address,address)',
    })).output;
  //
  // const pairLength = (await sdk.api.abi.call({
  //   target: FACTORY,
  //   abi: factoryAbi.tokenCount,
  //   block
  // })).output;
  //
  // const pairNums = Array.from(Array(Number(pairLength)).keys());
  // const tokens = (await sdk.api.abi.multiCall({
  //   abi: factoryAbi.getToken,
  //   calls: pairNums.map(num => ({
  //     target: FACTORY,
  //     params: [num]
  //   })),
  //   block
  // })).output;
  //
  // const pools = (await sdk.api.abi.multiCall({
  //   abi: factoryAbi.allPairs,
  //   calls: pairNums.map(num => ({
  //     target: FACTORY,
  //     params: [num]
  //   })),
  //   block
  // })).output
  //
  //

  const exchanges = {};
  logs.forEach((log) => {
    const tokenAddress = `0x${log.topics[1].substring(26)}`.toLowerCase();

    // only consider supported tokens
    if (supportedTokens.includes(tokenAddress)) {
      const exchangeAddress = `0x${log.topics[2].substring(26)}`.toLowerCase();
      exchanges[exchangeAddress] = tokenAddress;
    }
  });

  const tokenBalances = (
    await sdk.api.abi
      .multiCall({
        abi: 'erc20:balanceOf',
        calls: Object.keys(exchanges).map((exchangeAddress) => ({
          target: exchanges[exchangeAddress],
          params: exchangeAddress,
        })),
        block,
      })
  ).output;

  // note that this undercounts ETH locked
  // it only measures ETH in exchanges for supported tokens
  const ETHBalances = (
    await sdk.api.eth
      .getBalances({
        targets: Object.keys(exchanges).map((exchangeAddress) => exchangeAddress),
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
