const _ = require('underscore');
const moment = require('moment');
const args = require('../args');
const run = require('../run');

const spotTestCount = 10;

_.each(args.tokens, (tokenAdapter) => {
  describe(`${tokenAdapter.token} token adapter running & output format`, function () {
    describe('runs for a variety of points at different times', function() {
      this.bail(true);

      const latestDay = moment().utcOffset(0).add(-10, 'days').startOf('day').unix();
      const startDay = moment.unix(tokenAdapter.start).utcOffset(0).startOf('day').unix();
      const diff = latestDay - startDay;
      const step = diff / spotTestCount;
      let spotTests = _.range(latestDay, startDay + 10, -step);
      spotTests = _.map(spotTests, (spotTest) => {
        return moment.unix(spotTest).utcOffset(0).startOf('day').unix();
      });

      spotTests = _.uniq(spotTests);


      run(tokenAdapter, 'hour', 0);
      run(tokenAdapter, 'hour', -6);
      run(tokenAdapter, 'hour', -12);
      run(tokenAdapter, 'hour', -36);
      run(tokenAdapter, 'hour', -72);

      _.each(spotTests, (timestamp) => {
        run(tokenAdapter, timestamp);
      });
      run(tokenAdapter, startDay < tokenAdapter.start ? startDay + 86400 : startDay);
    });
  });
});
