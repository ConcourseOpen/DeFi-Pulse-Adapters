const argv = require('argv');
const _ = require('underscore');
const { join } = require('path');
const { lstatSync, readdirSync } = require('fs');
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const args = argv.option([
  {
    name: 'chain',
    short: 'c',
    type: 'string',
    description: 'When available, an individual chain (specified by directory name in chains) to run test on, defaults to ethereum mainnet.',
    example: "'npm run test-tvl -- --project=aave -- --chain=polygon'"
  },
  {
    name: 'project',
    short: 'p',
    type: 'string',
    description: 'When available, an individual project (specified by directory name in projects) to run test on, defaults to all.',
    example: "'npm run test-tvl -- --project=loopring'"
  },
  {
    name: 'timestamp',
    short: 'ts',
    type: 'number',
    description: 'When available, defines a unix timestamp to run the test at, defaults to latest.',
    example: "'npm run test-tvl -- --project=loopring -- --timestamp=1583020800'"
  }
]).run();

const chain = args.options.chain;
const projects = args.options.project ? [args.options.project] : getDirectories('v2/projects').map((dir) => dir.split('/')[dir.split('/').length - 1]);

module.exports = {
  projects: _.map(projects, (project) => {
    let path;
    let dataObj = {};

    if (chain) {
      path = `chains/${chain}/projects/${project}`;
      dataObj = {
        ...require(`../../${path}`),
        type: 'layer2',
      }
    } else {
      try {
        path = `v2/projects/${project}`;
        dataObj = {
          ...require(`../../${path}`),
          type: 'v2',
        }
      } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
          path = `projects/${project}`;
          dataObj = {
            ...require(`../../${path}`),
            type: 'v1',
          }
        }
      }
    }

    return {
      path,
      project,
      ...dataObj
    };
  }),
  timestamp: args.options.timestamp ? Number(args.options.timestamp) : undefined,
};
