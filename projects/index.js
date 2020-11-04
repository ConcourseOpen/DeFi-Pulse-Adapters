const moment = require('moment');

let projects = {};

AddAdapter('aave');
AddAdapter('augur');
// AddAdapter('bancor');
// AddAdapter('bzx');
AddAdapter('compound');
AddAdapter('ddex');
AddAdapter('dforce');
// AddAdapter('dharma');
AddAdapter('erasure');
// AddAdapter('instadapp');
AddAdapter('loopring');
AddAdapter('melon');
AddAdapter('nexus');
// AddAdapter('nuo-network');
AddAdapter('opyn');
AddAdapter('ray');
AddAdapter('set-protocol');

function AddAdapter(slug, overrides = {}) {
  let adapter = require('./' + slug);

  projects[slug] = {
    name: adapter.name,
    chain: adapter.chain || 'Ethereum',
    category: adapter.category,
    start: moment.unix(adapter.start).utcOffset(0).startOf('day').unix(),
    tvl: adapter.tvl,
    website: adapter.website
  }

  if(adapter.token) {
    projects[slug].token = adapter.token;
  }

  if(adapter.shortName) {
    projects[slug].shortName = adapter.shortName;
  }

  if(adapter.contributesTo) {
    projects[slug].contributesTo = adapter.contributesTo;
  }

  if(adapter.rates) {
    projects[slug] = {
      ...projects[slug],
      rates: adapter.rates,
      permissioning: adapter.permissioning,
      variability: adapter.variability
    }

  }
}

module.exports = projects;
