const _ = require('underscore');
const moment = require('moment');
const args = require('../args');
const run = require('../run');
const spotTestCount = 10;

_.each(args.validators, function(stakingAdapter) {
  describe(`${stakingAdapter.name} eth2.0 staking adapter running & output format`, function () {
    describe('runs for a variety of points at different times', function() {
      this.bail(true);

      const latestDay = moment().utcOffset(0).add(-10, 'days').startOf('day').unix();
      const startDay = moment.unix(stakingAdapter.start).utcOffset(0).startOf('day').unix();
      const diff = latestDay - startDay;
      const step = diff / spotTestCount;
      let spotTests = _.range(latestDay, startDay + 10, -step);
      spotTests = _.map(spotTests, (spotTest) => {
        return moment.unix(spotTest).utcOffset(0).startOf('day').unix();
      });

      spotTests = _.uniq(spotTests);

      run(stakingAdapter, 'hour', 0);
      run(stakingAdapter, 'hour', -12);
      run(stakingAdapter, 'hour', -36);
      run(stakingAdapter, 'hour', -72);

      _.each(spotTests, (timestamp) => {
        run(stakingAdapter, timestamp, 0,);
      });

      run(stakingAdapter, startDay < stakingAdapter.start ? startDay + 86400 : startDay);
    });
  });
});
