const fs = require('fs');
const chai = require('chai');
const _ = require('underscore');
const moment = require('moment');
const shell = require('shelljs');
const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');

const maxTokens = 1;
const symbolLengthLimit = 30;
const balanceCallTimeLimit = 1000 * 60 * 5;
let testResult = null;

/**
 *
 * @param {Object} projectAdapter
 * @param {String/Number} timeUnit
 * @param {Number} timeOffset
 * @returns {Promise<{output}>}
 * @private
 */
const _run = async (projectAdapter, timeUnit = 'day', timeOffset = 0) => {
  try {
    let timestamp;
    if (typeof timeUnit === 'number') {
      timestamp = timeUnit;
    } else {
      timestamp = moment().utcOffset(0).startOf(timeUnit).add(timeOffset, timeUnit).unix();
    }

    let point = await sdk.api.util.lookupBlock(timestamp);
    let output = await sdk.api.util.testAdapter(point.block, projectAdapter);
    return {
      ...point,
      output
    };
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @param {Object} projectAdapter
 * @param {String/Number} timeUnit
 * @param {Number} timeOffset
 */
module.exports = async (projectAdapter, timeUnit, timeOffset = 0) => {
  this.timeout(balanceCallTimeLimit);
  const projectRun = await _run(projectAdapter, timeUnit, timeOffset);
  testResult = projectRun;
  chai.expect(Object.keys(projectRun.output).length).to.equal(maxTokens);
  chai.expect(projectRun.output).to.be.an('object');

  _.each(projectRun.output, ({ balance: value }, symbol) => {
    let balance = BigNumber(value).toNumber();
    chai.expect(balance).to.be.a('number');
    chai.expect(balance).to.be.finite;
    chai.expect(balance).to.be.at.least(0);
    chai.expect(symbol).to.be.a('string');
    chai.expect(symbol.length).to.be.at.most(symbolLengthLimit);
  });

  afterEach('save project adapter output', () => {
    const time = moment.unix(testResult.timestamp).utcOffset(0).format();
    const path = `projects/output/${projectAdapter.name}/tvl`;
    const name = `${time}.json`;

    shell.mkdir('-p', path);
    fs.writeFileSync(`${path}/${name}`, JSON.stringify(testResult, null, 2));
  });
};
