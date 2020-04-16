/*==================================================
  Modules
  ==================================================*/

  const sdk = require('./');
  const moment = require('moment');

/*==================================================
  Run
  ==================================================*/

  async function Run(runFunction, project, timeUnit = 'day', timeOffset = 0) {
    try {
      let timestamp;

      if(typeof timeUnit == 'number') {
        timestamp = timeUnit;
      } else {
        timestamp = moment().utcOffset(0).startOf(timeUnit).add(timeOffset, timeUnit).unix();
      }

      let point = await sdk.api.util.lookupBlock(timestamp);

      await sdk.api.util.resetEthCallCount();
      let balances = await project[runFunction](point.timestamp, point.block);
      let output = (await sdk.api.util.toSymbols(balances)).output;
      let ethCallCount = await sdk.api.util.getEthCallCount();

      return {
        ...ethCallCount,
        ...point,
        output
      }

    } catch(error) {
      console.log(error);
    }
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = Run;
