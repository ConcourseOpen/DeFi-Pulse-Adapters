const abi = require('./abi');
const sdk = require('../../sdk');

const assetContracts = {
  dpi: '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b',
  eth_fli: '0xaa6e8127831c9de45ae56bb1b0d4d4da6e5665bd',
  btc_fli: '0x0b498ff89709d3838a063f1dfa463091f9801c2b',
  cgi: '0xada0a1202462085999652dc5310a7a9e2bf3ed42',
  mvi: '0x72e364f2abdc788b7e918bc238b21f109cd634d7',
  bed: '0x2aF1dF3AB0ab157e1E2Ad8F88A7D04fbea0c7dc6',
  data: '0x33d63ba1e57e54779f7ddaeaa7109349344cf5f1'
};

async function getBalances(block, target) {
  // Underlying assets
  let components = (await sdk.api.abi.call({
    block,
    target,
    abi: abi['getComponents'],
  })).output;

  // Remove DPI as a component from BED index so we don't double count it towards TVL
  if(target == assetContracts.bed){
    components = components.filter(function(address) { return address.toLowerCase() !== assetContracts.dpi.toLowerCase();})
  }

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

  // Same as CGI, we need to start getting balances since the inception timestamp
  let eth_fliBalances = (block >= 12035541 || timestamp >= 1615709597) ? await getBalances(block, assetContracts.eth_fli) : {};

  // btc fli timestamp
  let btc_fliBalances = (block >= 12375760  || timestamp >= 1620238070) ? await getBalances(block, assetContracts.btc_fli) : {};

  // CGI was launched later then DPI, but since we are aggregating two different balances unders one asset
  // we need to start it from a later timestamp, otherwise the test breaks
  let cgiBalances = (block >= 11826294 || timestamp >= 1613028914) ? await getBalances(block, assetContracts.cgi) : {};

  // MVI inception timestamp
  let mviBalances = (block >= 12184150 || timestamp >= 1617688800) ? await getBalances(block, assetContracts.mvi) : {};

  // BED inception timestamp
  let bedBalances = (block >= 12819917 || timestamp >= 1626210000) ? await getBalances(block, assetContracts.bed) : {};

  // DATA inception timestamp
  let dataBalances = (block >= 13239311  || timestamp >= 1631844000) ? await getBalances(block, assetContracts.data) : {};

  balances = Object.assign(balances, dpiBalances, cgiBalances, eth_fliBalances, mviBalances, btc_fliBalances, bedBalances, dataBalances);

  return balances;
};

module.exports = {
  name: 'Index Coop',
  symbol: 'INDEX',
  category: 'assets',
  start: 1599769488,  // Sep-10-2020 08:24:48 PM +UTC, block: 10836209
  tvl,
};
