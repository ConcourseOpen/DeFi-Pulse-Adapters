/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const chai = require('chai');
  const moment = require('moment');
  const mlog = require('mocha-logger');

  const args = require('../args');
  const TestRun = require('../test-run');

/*==================================================
  Settings
  ==================================================*/

  const spotTestCount = 10;
  const timestamp = args.timestamp || 'latest';

/*==================================================
  Test
  ==================================================*/

  _.each(args.projects, (project) => {
    describe(`${project.slug} project running & output format`, function () {
      describe(`runs for specified time: ${timestamp}`, function() {
        this.bail(true);

        if(args.timestamp) {
          TestRun(project, args.timestamp);
        } else {
          TestRun(project, 'hour', 0);
        }

        afterEach(function() {
          if(this.currentTest.state === 'failed') {
            mlog.error('Output:', JSON.stringify(this.currentTest.value, null, 2));
          } else {
            mlog.success('Output:', JSON.stringify(this.currentTest.value, null, 2));
          }
        });
      });
    });
  });

