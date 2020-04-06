/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const chai = require('chai');
  const BigNumber = require('bignumber.js');
  const mlog = require('mocha-logger');
  const moment = require('moment');

  const Run = require('../sdk/run');

/*==================================================
  Settings
  ==================================================*/

  const runTimeLimit = 1000 * 60 * 5;
  const symbolLengthLimit = 6;
  const ethCallCountLimit = 1000;

/*==================================================
  TestRun
  ==================================================*/

  function TestRun(project, timeUnit, timeOffset) {
    let label;

    if(typeof timeUnit == 'number') {
      label = 'returns valid data at ' + moment.unix(timeUnit).utcOffset(0).format();
    } else {
      label = 'returns valid data at point ' + timeUnit + ' ' + timeOffset;
    }

    return it(label, async function() {
      this.timeout(runTimeLimit);

      let projectRun = await Run(project, timeUnit, timeOffset);
      this.test.value = projectRun;
      chai.expect(projectRun.output).to.be.an('object');
      // console.log('\n');
      // mlog.log('           Block:', projectRun.block);
      // mlog.log('       Timestamp:', projectRun.timestamp);
      // mlog.log('           Block:', projectRun.block);
      // mlog.log('      Node Calls:', projectRun.ethCallCount);
      // mlog.log('         Symbols:', _.keys(projectRun.output).length);

      _.each(projectRun.output, (value, symbol) => {
        let balance = BigNumber(value).toNumber();
        chai.expect(balance).to.be.a('number');
        chai.expect(balance).to.be.finite;
        chai.expect(balance).to.be.at.least(0);
        chai.expect(symbol).to.be.a('string');
        chai.expect(symbol.length).to.be.at.most(symbolLengthLimit);
      });

      chai.expect(projectRun.ethCallCount).to.be.at.most(ethCallCountLimit);
    });
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = TestRun
