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

    await Promise.all(projectAdapter.tokenHolderMap.map(async (thm) => {
      if (sdk.api.util.isCallable(thm.tokens)) {
        thm.tokens = await thm.tokens();
      }
      if (_isCallable(thm.holders)) {
        thm.holders = await thm.holders();
      }
    }));

    let point = await sdk.api.util.lookupBlock(timestamp);
    let output = await sdk.api.util.testAdapter(point.block, timestamp, projectAdapter);
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
  let label;

  if (typeof timeUnit === 'number') {
    label = `returns valid tvl data at ${moment.unix(timeUnit).utcOffset(0).format()}`;
  } else {
    label = `returns valid tvl data at ${timeUnit} ${timeOffset}`;
  }

  it(label, async function() {
    this.timeout(balanceCallTimeLimit);
    const projectRun = await _run(projectAdapter, timeUnit, timeOffset);
    testResult = projectRun;
    chai.expect(Object.keys(projectRun.output).length).to.be.at.least(maxTokens);
    chai.expect(projectRun.output).to.be.an('object');

    _.each(Object.keys(projectRun.output), (contract) => {
      let balance = BigNumber(projectRun.output[contract]).toNumber();
      chai.expect(balance).to.be.a('number');
      chai.expect(balance).to.be.finite;
      chai.expect(balance).to.be.at.least(0);
      chai.expect(contract).to.be.a('string');
    });
  });

  afterEach('save project adapter output', () => {
    const time = moment.unix(testResult.timestamp).utcOffset(0).format();
    const path = `projects/output/${projectAdapter.name}/tvl`;
    const name = `${time}.json`;

    shell.mkdir('-p', path);
    fs.writeFileSync(`${path}/${name}`, JSON.stringify(testResult, null, 2));
  });
};
