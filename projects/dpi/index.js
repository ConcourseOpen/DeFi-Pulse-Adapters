const abi = require('./abi');
const sdk = require('../../sdk');

const assetContracts = {
  dpi: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
  cgi: '0xada0a1202462085999652dc5310a7a9e2bf3ed42'
};

async function getBalances(block, target) {
  // Underlying assets
  let components = (await sdk.api.abi.call({
    block,
    target,
    abi: abi['getComponents'],
  })).output;

  let calls = components.map((erc20) => ({
    target: erc20,
    params: target
  }));

  let componentBalances = (await sdk.api.abi.multiCall({
    block,
    calls,
    abi: 'erc20:balanceOf'
  })).output;

  return componentBalances.reduce((r,o) => Object.assign(r, { [o.input.target]: o.output }), {});
};

async function tvl(timestamp, block) {
  let balances = {};

  let dpiBalances = await getBalances(block, assetContracts.dpi);

  // CGI was launched later then DPI, but since we are aggregating two different balances unders one asset
  // we need to start it from a later timestamp, otherwise the test breaks
  let cgiBalances = (block >= 11826294 || timestamp >= 1613028914) ? await getBalances(block, assetContracts.cgi) : {};

  balances = Object.assign(balances, dpiBalances, cgiBalances);

  return balances;
};

module.exports = {
  name: 'Index Coop',
  symbol: 'INDEX',
  category: 'assets',
  start: 1599769488,  // Sep-10-2020 08:24:48 PM +UTC, block: 10836209
  tvl,
};
