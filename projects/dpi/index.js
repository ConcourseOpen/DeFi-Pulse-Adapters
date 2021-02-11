const abi = require('./abi');
const sdk = require('../../sdk');

const dpiContract = '0x1494ca1f11d487c2bbe4543e90080aeba4ba3c2b';

async function tvl(timestamp, block) {
  let balances = {};

  // ETH balance
  let ethBalance = (await sdk.api.eth.getBalance({target: dpiContract, block})).output;

  balances = Object.assign(balances, {
    '0x0000000000000000000000000000000000000000': ethBalance
  });

  // Underlying assets
  let components = (await sdk.api.abi.call({
    block,
    target: dpiContract,
    abi: abi['getComponents'],
  })).output;

  let calls = components.map((erc20) => ({
    target: erc20,
    params: dpiContract
  }));

  let componentBalances = (await sdk.api.abi.multiCall({
    block,
    calls,
    abi: 'erc20:balanceOf'
  })).output;

  let underlyingBalances = componentBalances.reduce((r,o) => Object.assign(r, { [o.input.target]: o.output }), {});

  balances = Object.assign(balances, underlyingBalances);

  return balances;
}

module.exports = {
  name: 'Index Coop',
  symbol: 'INDEX',
  category: 'assets',
  start: 1599769488,  // Sep-10-2020 08:24:48 PM +UTC, block: 10836209
  tvl,
};
