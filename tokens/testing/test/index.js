const _ = require('underscore');
const args = require('../args');
const run = require('../run');

_.each(args.tokens, (tokenAdapter) => {
  describe(`${tokenAdapter.token} token adapter running & output format`, function () {
    describe(`runs for specified time: ${args.timestamp || 'latest hour'}`, function() {
      this.bail(true);

      run(tokenAdapter, args.timestamp || 'hour', 0);
    });
  });
});

