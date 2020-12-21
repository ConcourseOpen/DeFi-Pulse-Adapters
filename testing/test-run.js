/*==================================================
  Modules
  ==================================================*/

  const _ = require('underscore');
  const chai = require('chai');
  const BigNumber = require('bignumber.js');
  const moment = require('moment');
  const args = require('../testing/args');
  const fs = require('fs');
  const shell = require('shelljs');

  const Run = require('../sdk/run');

/*==================================================
  Settings
  ==================================================*/

  const tvlTimeLimit = 1000 * 60 * 5;
  const ratesTimeLimit = 30 * 1000;
  const symbolLengthLimit = 30;
  const ethCallCountLimit = 2000;

/*==================================================
  TestRun
  ==================================================*/

  function TestRun(project, timeUnit, timeOffset) {
    let label;

    let functions = [];

    if(args.function) {
      if(project[args.function]) {
        functions.push(args.function);
      } else {
        throw `${args.function} does not exist`;
      }
    } else {
      functions.push('tvl');
      if(project['rates']) {
        functions.push('rates');
      }
    }

    for(let runFunction of functions) {
      if(typeof timeUnit == 'number') {
        label = `returns valid ${runFunction} data at ${moment.unix(timeUnit).utcOffset(0).format()}`;
      } else {
        label = `returns valid ${runFunction} data at ${timeUnit} ${timeOffset}`;
      }

      it(label, async function() {
        if(runFunction == 'tvl') {
          this.timeout(tvlTimeLimit);
          let projectRun = await Run(runFunction, project, timeUnit, timeOffset);
          this.test.value = projectRun;
          chai.expect(projectRun.output).to.be.an('object');

          _.each(projectRun.output, ({ balance: value }, symbol) => {
            let balance = BigNumber(value).toNumber();
            chai.expect(balance).to.be.a('number');
            chai.expect(balance).to.be.finite;
            chai.expect(balance).to.be.at.least(0);
            chai.expect(symbol).to.be.a('string');
            chai.expect(symbol.length).to.be.at.most(symbolLengthLimit);
          });

          chai.expect(projectRun.ethCallCount).to.be.at.most(ethCallCountLimit);
        } else if(runFunction == 'rates') {
          this.timeout(ratesTimeLimit);
          let projectRun = await Run(runFunction, project, timeUnit, timeOffset);
          this.test.value = projectRun;
        }
      });

      afterEach('save output', async function() {
        let time = moment.unix(this.currentTest.value.timestamp).utcOffset(0).format('YYYY-MM-DD_HH-mm-ss');
        let path = `output/${project.slug}/${runFunction}`;
        let name = `${time}.json`;

        shell.mkdir('-p', path);
        fs.writeFileSync(`${path}/${name}`, JSON.stringify(this.currentTest.value, null, 2));
      });
    }
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = TestRun
