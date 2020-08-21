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

      let point;
      let output;
      switch(project.chain) {
        case "Kava":
          point = await sdk.kavaApi.util.lookupBlock(timestamp, timeUnit);

          output = await project[runFunction](point.timestamp, point.block);
          if(runFunction == 'tvl') {
            output = (await sdk.kavaApi.util.toSymbols(output)).output;
            output = (await sdk.kavaApi.util.unwrap({balances: output, block: point.block})).output;
          }
          break;
        default:
          point = await sdk.api.util.lookupBlock(timestamp);

          await sdk.api.util.resetEthCallCount();

          output = await project[runFunction](point.timestamp, point.block);
          if(runFunction == 'tvl') {
            output = (await sdk.api.util.toSymbols(output)).output;
            output = (await sdk.api.util.unwrap({balances: output, block: point.block})).output;
          }
          break;
      }

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
