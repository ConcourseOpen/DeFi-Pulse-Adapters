const fs = require('fs');
const chai = require('chai');
const _ = require('underscore');
const moment = require('moment');
const shell = require('shelljs');
const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');

const maxTokens = 1;
const balanceCallTimeLimit = 1000 * 60 * 5;
let testResult = null;

/**
 *
 * @param {Object} stakingAdapter
 * @param {String/Number} timeUnit
 * @param {Number} timeOffset
 * @returns {Promise<{output}>}
 * @private
 */
const _run = async (stakingAdapter, timeUnit = 'day', timeOffset = 0) => {
  try {
    let timestamp;

    if (typeof timeUnit === 'number') {
      timestamp = timeUnit;
    } else {
      timestamp = moment().utcOffset(0).startOf(timeUnit).add(timeOffset, timeUnit).unix();
    }

    let point = await sdk.api.util.lookupBlock(timestamp);

    let tvl = await sdk.api.util.testStakingAdapter(point.block, timestamp, stakingAdapter);
    return {
      ...point,
      tvl
    };
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @param {Object} stakingAdapter
 * @param {String/Number} timeUnit
 * @param {Number} timeOffset
 */
module.exports = async (stakingAdapter, timeUnit, timeOffset = 0) => {
  let label;

  if (typeof timeUnit === 'number') {
    label = `returns valid tvl data at ${moment.unix(timeUnit).utcOffset(0).format()}`;
  } else {
    label = `returns valid tvl data at ${timeUnit} ${timeOffset}`;
  }

  it(label, async function() {
    this.timeout(balanceCallTimeLimit);
    const projectRun = await _run(stakingAdapter, timeUnit, timeOffset);
    testResult = projectRun;
    const tvl = projectRun.tvl;
    chai.expect(Object.keys(tvl).length).to.be.at.least(maxTokens);
    chai.expect(tvl).to.be.an('array');

    _.each(tvl, (token) => {
      const balance = BigNumber(token.balance).toNumber();
      const price = BigNumber(token.price).toNumber();

      chai.expect(balance).to.be.a('number');
      chai.expect(balance).to.be.finite;
      chai.expect(balance).to.be.at.least(0);

      chai.expect(price).to.be.a('number');
      chai.expect(price).to.be.finite;
      chai.expect(price).to.be.at.least(0);

      chai.expect(token.contract).to.be.a('string');
      chai.expect(token.symbol).to.be.a('string');
    });
  });

  afterEach('save staking adapter output', () => {
    const time = moment.unix(testResult.timestamp).utcOffset(0).format();
    const path = `v2/output/${stakingAdapter.name}/staking-tvl`;
    const name = `${time}.json`;

    shell.mkdir('-p', path);
    fs.writeFileSync(`${path}/${name}`, JSON.stringify(testResult, null, 2));
  });
};
