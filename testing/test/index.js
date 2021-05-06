/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');

  const args = require('../args');
  const TestRun = require('../test-run');

/*==================================================
  Test
  ==================================================*/

  _.each(args.projects, (project) => {
    describe(`${project.slug} project running & output format`, function () {
      describe(`runs for specified time: ${args.timestamp || 'latest hour'}`, function() {
        this.bail(true);

        TestRun(project, args.timestamp || 'hour', 0);
      });
    });
  });

