/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const moment = require('moment');

  const args = require('../args');
  const TestRun = require('../test-run');

/*==================================================
  Settings
  ==================================================*/

  const spotTestCount = 10;

/*==================================================
  Test
  ==================================================*/

  _.each(args.projects, (project) => {
    describe(`${project.slug} project running & output format`, function () {
      describe('runs for a variety of points at different times', function() {
        this.bail(true);

        let latestDay = moment().utcOffset(0).add(-10, 'days').startOf('day').unix();
        let startDay = moment.unix(project.start).utcOffset(0).startOf('day').unix();
        let diff = latestDay - startDay;
        let step = diff / spotTestCount;
        let spotTests = _.range(latestDay, startDay + 10, -step);
        spotTests = _.map(spotTests, (spotTest) => {
          return moment.unix(spotTest).utcOffset(0).startOf('day').unix();
        });

        spotTests = _.uniq(spotTests);


        TestRun(project, 'hour', 0);
        TestRun(project, 'hour', -6);
        TestRun(project, 'hour', -12);
        TestRun(project, 'hour', -36);
        TestRun(project, 'hour', -72);
        _.each(spotTests, (timestamp) => {
          TestRun(project, timestamp);
        });
        TestRun(project, startDay);
      });
    });
  });

