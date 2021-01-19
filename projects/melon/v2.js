/*==================================================
  Modules
  ==================================================*/

const BigNumber = require("bignumber.js");
const abi = require('./abi');
const sdk = require("../../sdk");

/*==================================================
  Settings
  ==================================================*/

const DISPATCHER = "0xC3DC853dD716bd5754f421ef94fdCbac3902ab32";
const START_BLOCK = 11639906;

/*==================================================
  TVL
  ==================================================*/

module.exports = async function tvl(timestamp, block) {
  let balances = {};

  const supportedTokens = await (
    sdk
      .api
      .util
      .tokenList()
      .then((supportedTokens) => supportedTokens.map(({ contract }) => contract))
  );

  /* pull melon fund holding addresses */
  const logs = (await sdk.api.util
    .getLogs({
      keys: [],
      toBlock: block,
      target: DISPATCHER,
      fromBlock: START_BLOCK,
      topic: 'VaultProxyDeployed(address,address,address,address,address,string)',
    })).output;

  const vaultProxies = (
    logs
      .map((log) =>         // sometimes the full log is emitted
        typeof log === 'string' ? log.toLowerCase() : `0x${log.data.slice(64 - 40 + 2, 64 + 2)}`.toLowerCase()
      )
  );

  const holdingTokensResults = (await sdk.api.abi
    .multiCall({
      block,
      calls: vaultProxies.map(vaultProxy => ({ target: vaultProxy })),
      abi: abi['getTrackedAssets'],
    })).output;

  const balanceOfCalls = holdingTokensResults
    .filter(result => result.success)
    .map(result => (
      result.output
      .filter(token => supportedTokens.includes(token.toLowerCase()))
      .map(token => ({ target: token, params: result.input.target }))
    ))
    .reduce((a, b) => a.concat(b), []);

  const balanceOfResult = await sdk.api.abi.multiCall({
    block,
    calls: balanceOfCalls,
    abi: 'erc20:balanceOf',
  });

  /* combine token volumes on multiple funds */
  balanceOfResult.output.forEach(result => {
    let balance = new BigNumber(result.output || 0);
    if (balance <= 0) return;

    let asset = result.input.target;
    let total = balances[asset];

    if (total) {
      balances[asset] = balance.plus(total).toFixed();
    } else {
      balances[asset] = balance.toFixed();
    }
  });

  return balances;
}
