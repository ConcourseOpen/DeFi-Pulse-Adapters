const fs = require('fs');
const chai = require('chai');
const _ = require('underscore');
const moment = require('moment');
const shell = require('shelljs');
const args = require('./args');
const sdk = require('../../sdk');
const BigNumber = require('bignumber.js');

const maxTokens = 1;
const symbolLengthLimit = 30;
const ethCallCountLimit = 500;
const balanceCallTimeLimit = 1000 * 60 * 5;
let testResult = null;

/**
 *
 * @param {Function} runFunction
 * @param {Object} tokenAdapter
 * @param {String/Number} timeUnit
 * @param {Number} timeOffset
 * @returns {Promise<{output}>}
 * @private
 */
const _run = async (runFunction, tokenAdapter, timeUnit = 'day', timeOffset = 0) => {
  try {
    let timestamp;

    if (typeof timeUnit === 'number') {
      timestamp = timeUnit;
    } else {
      timestamp = moment().utcOffset(0).startOf(timeUnit).add(timeOffset, timeUnit).unix();
    }

    let point = await sdk.api.util.lookupBlock(timestamp);
    await sdk.api.util.resetEthCallCount();
    let output = await tokenAdapter[runFunction](point.timestamp, point.block);

    if (runFunction === 'balance') {
      output = (await sdk.api.util.toSymbols(output)).output;
      output = (await sdk.api.util.unwrap({balances: output, block: point.block})).output;
    }

    let ethCallCount = await sdk.api.util.getEthCallCount();
    return {
      ...ethCallCount,
      ...point,
      output
    };
  } catch (error) {
    console.error(error);
  }
};

/**
 *
 * @param {Object} tokenAdapter
 * @param {String/Number} timeUnit
 * @param {Number} timeOffset
 */
module.exports = (tokenAdapter, timeUnit, timeOffset = 0) => {
 let label;
 const functions = [];

 if (args.function) {
   if (tokenAdapter[args.function]) {
     functions.push(args.function);
   } else {
     throw `${args.function} does not exist`;
   }
 } else {
   functions.push('balance');
 }

 for (let runFunction of functions) {
   if (typeof timeUnit === 'number') {
     label = `returns valid ${runFunction} data at ${moment.unix(timeUnit).utcOffset(0).format()}`;
   } else {
     label = `returns valid ${runFunction} data at ${timeUnit} ${timeOffset}`;
   }

   it(label, async function() {
     if (runFunction === 'balance') {
       this.timeout(balanceCallTimeLimit);
       const projectRun = await _run(runFunction, tokenAdapter, timeUnit, timeOffset);
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

       chai.expect(projectRun.ethCallCount).to.be.at.most(ethCallCountLimit);
     }
   });

   afterEach('save token adapter output', () => {
     const time = moment.unix(testResult.timestamp).utcOffset(0).format();
     const path = `tokens/output/${tokenAdapter.token}/${runFunction}`;
     const name = `${time}.json`;

     shell.mkdir('-p', path);
     fs.writeFileSync(`${path}/${name}`, JSON.stringify(testResult, null, 2));
   });
 }
};
