/*==================================================
  Modules
  ==================================================*/

const BigNumber = require("bignumber.js");
const _ = require("underscore");
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

  const logs = (await sdk.api.util
    .getLogs({
      keys: [],
      toBlock: block,
      target: DISPATCHER,
      fromBlock: START_BLOCK,
      topic: 'VaultProxyDeployed(address,address,address,address,address,string)',
    })).output;

  /* pull melon fund holding addresses */
  const vaultProxies = (
    logs
      .map((log) =>         // sometimes the full log is emitted
        typeof log === 'string' ? log.toLowerCase() : `0x${log.data.slice(64 - 40 + 2, 64 + 2)}`.toLowerCase()
      )
  );

  const holdingTokensResults = (await sdk.api.abi
    .multiCall({
      block,
      calls: _.map(vaultProxies, (vaultProxy) => {
        target: vaultProxy
      }),
      abi: abi['getTrackedAssets'],
    })).output;

  const balanceOfCalls = holdingTokensResults
    .filter(result => (result.success && supportedTokens.includes(result.output.toLowerCase())))
    .map(result => (
      result.output.map(token => ({ target: result.input.target, params: token }))
    ))
    .reduce((a, b) => a.concat(b), []);

  const balanceOfResult = await sdk.api.abi.multiCall({
    block,
    calls: balanceOfCalls,
    abi: abi['getBalance'],
  });

  /* combine token volumes on multiple funds */
  _.forEach(balanceOfResult.output, (result) => {
    let balance = new BigNumber(result.output || 0);
    if (balance <= 0) return;

    let asset = result.input.params[0];
    let total = balances[asset];

    if (total) {
      balances[asset] = balance.plus(total).toFixed();
    } else {
      balances[asset] = balance.toFixed();
    }
  });

  return balances;
}
