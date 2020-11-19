const argv = require('argv');
const _ = require('underscore');
const { join } = require('path');
const { lstatSync, readdirSync } = require('fs');
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const args = argv.option([
  {
    name: 'function',
    short: 'f',
    type: 'string',
    description: 'Function to run, balance.',
    example: "'npm run test -- --token=wbtc --function=balance'"
  },
  {
    name: 'token',
    short: 't',
    type: 'string',
    description: 'When available, an individual token (specified by directory name in tokens) to run test on, defaults to all.',
    example: "'npm run test -- --token=wbtc'"
  },
  {
    name: 'timestamp',
    short: 'ts',
    type: 'number',
    description: 'When available, defines a unix timestamp to run the test at, defaults to latest.',
    example: "'npm run test -- --token=wbtc -- --timestamp=1583020800'"
  }
]).run();

const directories = args.options.token ? [`tokens/btc/${args.options.token}`] : getDirectories('tokens/btc');

module.exports = {
  tokens: _.map(directories, (directory) => ({
    path: directory,
    token: directory.replace('tokens/btc/', ''),
    ...require('../../' + directory)
  })),
  timestamp: args.options.timestamp ? Number(args.options.timestamp) : undefined,
  function: args.options.function || undefined,
};
