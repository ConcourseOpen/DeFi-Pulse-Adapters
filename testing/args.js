/*==================================================
  Modules
  ==================================================*/

  const argv = require('argv');
  const _ = require('underscore');
  const { lstatSync, readdirSync } = require('fs');
  const { join } = require('path');

/*==================================================
  Helper Methods
  ==================================================*/

  const isDirectory = source => lstatSync(source).isDirectory();
  const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

/*==================================================
  Init
  ==================================================*/

  var args = argv.option([
    {
      name: 'function',
      short: 'f',
      type: 'string',
      description: 'Function to run, tvl or rates.',
      example: "'npm run test -- --project=nuo-network --function=tvl'"
    },
    {
      name: 'project',
      short: 'p',
      type: 'string',
      description: 'When available, an individual project (specified by directory name in projects) to run test on, defaults to all.',
      example: "'npm run test -- --project=augur' or 'npm run test -- --project=connext'"
    },
    {
      name: 'timestamp',
      short: 't',
      type: 'number',
      description: 'When available, defines a unix timestamp to run the test at, defaults to latest.',
      example: "'npm run test -- --project=augur -- --timestamp=1583020800'"
    }
  ]).run();

  let directories = args.options.project ? ['projects/' + args.options.project] : getDirectories('projects');

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    projects: _.map(directories, (directory) => {
      return {
        path: directory,
        slug: directory.replace('projects/', ''),
        ...require('../' + directory)
      };
    }),
    timestamp: args.options.timestamp ? Number(args.options.timestamp) : undefined,
    function: args.options.function || undefined
  }
