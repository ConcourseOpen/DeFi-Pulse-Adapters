const fs = require('fs');
const chai = require('chai');
const _ = require('underscore');
const moment = require('moment');
const shell = require('shelljs');
const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');

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
    let addresses = [];
    let timestamp;

    if (typeof timeUnit === 'number') {
      timestamp = timeUnit;
    } else {
      timestamp = moment().utcOffset(0).startOf(timeUnit).add(timeOffset, timeUnit).unix();
    }

    if (!Array.isArray(stakingAdapter.address)) {
      addresses = [stakingAdapter.address];
    }

    const tvl = await Promise.all(addresses.map(async (address) => {
      const data = await sdk.api.util.testStakingAdapter(timestamp, address);

      return {
        depositAddress: address,
        ...data,
      }
    }));

    return {
      timestamp,
      tvl,
    }
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

    chai.expect(tvl).to.be.an('array');
    chai.expect(tvl.length).to.be.at.least(1);

    _.each(tvl, ({ depositAddress, timestamp, block, balance }) => {
      chai.expect(depositAddress).to.be.a('string');

      chai.expect(timestamp).to.be.a('number');
      chai.expect(timestamp).to.be.finite;

      chai.expect(block).to.be.a('number');
      chai.expect(block).to.be.finite;

      chai.expect(balance).to.be.a('number');
      chai.expect(balance).to.be.finite;
      chai.expect(balance).to.be.at.least(0);
    })
  });


  afterEach('save staking adapter output', () => {
    const time = moment.unix(testResult.timestamp).utcOffset(0).format();
    const path = `eth2.0/output/${stakingAdapter.name}/staking-tvl`;
    const name = `${time}.json`;

    shell.mkdir('-p', path);
    fs.writeFileSync(`${path}/${name}`, JSON.stringify(testResult, null, 2));
  });
};
