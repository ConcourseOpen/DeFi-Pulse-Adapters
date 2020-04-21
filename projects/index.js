const moment = require('moment');

let projects = {};

function AddAdapter(slug, overrides = {}) {
  let adapter = require('./' + slug);

  projects[slug] = {
    name: adapter.name,
    shortName: adapter.shortName,
    token: adapter.token,
    chain: adapter.chain || 'Ethereum',
    category: adapter.category,
    contributesTo: adapter.contributesTo,
    start: moment.unix(adapter.start).utcOffset(0).startOf('day').unix(),
    tvl: adapter.tvl,
    rates: adapter.rates,
    permissioning: adapter.permissioning,
    variability: adapter.variability,
    website: adapter.website,
  }
}

AddAdapter('aave');
AddAdapter('augur');
AddAdapter('ddex');
AddAdapter('dforce');
// AddAdapter('dharma');
// AddAdapter('erasure')
// AddAdapter('instadapp');
// AddAdapter('loopring');
// AddAdapter('melon');
// AddAdapter('nexus');
// AddAdapter('nuo-network');
// AddAdapter('opyn');
// AddAdapter('ray');
// AddAdapter('set-protocol');

module.exports = projects;
