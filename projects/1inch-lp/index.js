/*==================================================
  Modules
  ==================================================*/
const BigNumber = require('bignumber.js');
const sdk = require('../../sdk');

/*==================================================
  Settings
  ==================================================*/
const V1_START_BLOCK = 11517708;
const V1_FACTORY = '0xc4a8b7e29e3c8ec560cd4945c1cf3461a85a148d';
const V1_1_START_BLOCK = 11607841;
const V1_1_FACTORY = '0xbaf9a5d4b0052359326a6cdab54babaa3a3a9643';
const ETH_BALANCE = '0x42f527f50f16a103b6ccab48bccca214500c1021';
const ETH = '0x0000000000000000000000000000000000000000';

/*==================================================
  TVL
  ==================================================*/

async function tvl(timestamp, block) {
  if (block <= V1_START_BLOCK) {
    return (
      await sdk.api.util.toSymbols({
        "0x0000000000000000000000000000000000000000": "0",
      })
    ).output;
  } else if (block <= V1_1_START_BLOCK) {
    const [v1] = await Promise.all([
      tvlByVersion(V1_FACTORY, V1_START_BLOCK, block),
    ]);

    const tokenAddresses = new Set(Object.keys(v1));

    let balances = Array.from(tokenAddresses).reduce(
      (accumulator, tokenAddress) => {
        const v1Balance = new BigNumber(v1[tokenAddress] || "0");
        accumulator[tokenAddress] = v1Balance.toFixed();

        return accumulator;
      },
      {}
    );
    if (Object.keys(balances).length < 1) {
      balances["0x0000000000000000000000000000000000000000"] = "0";
    }

    return (await sdk.api.util.toSymbols(balances)).output;
  } else {
    const [v1, v1_1] = await Promise.all([
      tvlByVersion(V1_FACTORY, V1_START_BLOCK, block),
      tvlByVersion(V1_1_FACTORY, V1_1_START_BLOCK, block),
    ]);

    const tokenAddresses = new Set(Object.keys(v1).concat(Object.keys(v1_1)));

    return Array.from(tokenAddresses).reduce((accumulator, tokenAddress) => {
      const v1Balance = new BigNumber(v1[tokenAddress] || "0");
      const v1_1Balance = new BigNumber(v1_1[tokenAddress] || "0");
      accumulator[tokenAddress] = v1Balance.plus(v1_1Balance).toFixed();

      return accumulator;
    }, {});
  }
}

async function tvlByVersion(factory, startBlock, block) {
  const supportedTokens = await (
    sdk
      .api
      .util
      .tokenList()
      .then((supportedTokens) => supportedTokens.map(({contract}) => contract.toLowerCase()))
  );

  const logs = (
    await sdk.api.util
      .getLogs({
        keys: ['topics'],
        toBlock: block,
        target: factory,
        fromBlock: startBlock,
        topic: 'Deployed(address,address,address)'
      })
  ).output;

  const pairs = (
    logs.reduce((acc, topics) => {
      const pair = '0x' + topics[1].substr(26);
      const token0 = '0x' + topics[2].substr(26).toLowerCase();
      const token1 = '0x' + topics[3].substr(26).toLowerCase();

      if (!isETH(token0) && !supportedTokens.includes(token0) && !supportedTokens.includes(token1)) {
        return acc;
      }

      acc[pair] = {};

      if (isETH(token0) || supportedTokens.includes(token0)) {
        acc[pair].token0Address = token0;
      }

      if (supportedTokens.includes(token1)) {
        acc[pair].token1Address = token1;
      }

      return acc;
    }, {})
  );

  const reserves = (
    await sdk
      .api
      .abi
      .multiCall({
        abi: 'erc20:balanceOf',
        calls: Object.keys(pairs).map((pairAddress) => {
          const calls = [];

          if (pairs[pairAddress].token0Address) {
            calls.push({
              target: isETH(pairs[pairAddress].token0Address) ? ETH_BALANCE : pairs[pairAddress].token0Address,
              params: pairAddress
            });
          }

          if (pairs[pairAddress].token1Address) {
            calls.push({
              target: pairs[pairAddress].token1Address,
              params: pairAddress
            });
          }

          return calls;
        }).reduce((flat, elem) => flat.concat(elem), []),
        block,
      })
  ).output;

  return reserves.reduce((accumulator, res) => {
    if (!res.success) {
      return accumulator;
    }

    const token = replaceToETHIfNeeded(res.input.target.toLowerCase());

    const balance = new BigNumber(res.output);
    if (balance.isZero()) {
      return accumulator;
    }

    const existingBalance = new BigNumber(
      accumulator[token] || '0'
    );

    accumulator[token] = existingBalance
      .plus(balance)
      .toFixed()

    return accumulator;
  }, {});
}

function isETH(token) {
  return token === ETH;
}

function replaceToETHIfNeeded(token) {
  return token === ETH_BALANCE ? ETH : token;
}

module.exports = {
  name: '1inch Liquidity Protocol',
  token: '1INCH',
  category: 'dexes',
  start: 1608831515, // Dec-24-2020 05:38:35 PM +UTC
  tvl
};
