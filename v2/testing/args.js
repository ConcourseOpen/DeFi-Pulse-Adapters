const argv = require('argv');
const _ = require('underscore');
const { join } = require('path');
const { lstatSync, readdirSync } = require('fs');
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const args = argv.option([
  {
    name: 'project',
    short: 'p',
    type: 'string',
    description: 'When available, an individual project (specified by directory name in projects) to run test on, defaults to all.',
    example: "'npm run test-project -- --project=loopring'"
  },
  {
    name: 'timestamp',
    short: 'ts',
    type: 'number',
    description: 'When available, defines a unix timestamp to run the test at, defaults to latest.',
    example: "'npm run test-project -- --project=loopring -- --timestamp=1583020800'"
  }
]).run();

const directories = args.options.project ? [`v2/projects/${args.options.project}`] : getDirectories('v2/projects');

module.exports = {
  projects: _.map(directories, (directory) => ({
    path: directory,
    project: directory.replace('v2/projects/', ''),
    ...require('../../' + directory)
  })),
  timestamp: args.options.timestamp ? Number(args.options.timestamp) : undefined,
};
