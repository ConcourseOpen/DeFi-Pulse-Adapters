const argv = require('argv');
const _ = require('underscore');
const { join } = require('path');
const { lstatSync, readdirSync } = require('fs');
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source => readdirSync(source).map(name => join(source, name)).filter(isDirectory);

const args = argv.option([
  {
    name: 'validator',
    short: 'v',
    type: 'string',
    description: 'When available, an individual validator (specified by directory name in validators) to run test on, defaults to all.',
    example: "'npm run test-validator -- --validator=piedao'"
  },
  {
    name: 'timestamp',
    short: 'ts',
    type: 'number',
    description: 'When available, defines a unix timestamp to run the test at, defaults to latest.',
    example: "'npm run test-validator -- --validator=piedao -- --timestamp=1602667372'"
  }
]).run();

const validators = args.options.validator ? [args.options.validator] : getDirectories('eth2.0/validators').map((dir) => dir.split('/')[dir.split('/').length - 1]);

module.exports = {
  validators: _.map(validators, (validator) => {
    let path = `eth2.0/validators/${validator}`;
    let dataObj = {};

    try {
      dataObj = {
        ...require(`../../${path}`)
      }
    } catch (error) {
      console.log(error.message);
    }

    return {
      path,
      validator,
      ...dataObj
    };
  }),
  timestamp: args.options.timestamp ? Number(args.options.timestamp) : undefined,
};
