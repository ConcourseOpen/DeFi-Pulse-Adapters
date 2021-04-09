/*==================================================
  Modules
  ==================================================*/

const sdk = require("./");
const moment = require("moment");

/*==================================================
  Run
  ==================================================*/

async function Run(runFunction, project, timeUnit = "day", timeOffset = 0) {
  try {
    let timestamp;

    if (typeof timeUnit == "number") {
      timestamp = timeUnit;
    } else {
      timestamp = moment().utcOffset(0).startOf(timeUnit).add(timeOffset, timeUnit).unix();
    }

    let point = { block: 12202080 };

    let output = await project[runFunction](point.timestamp, point.block);
    if (runFunction == "tvl") {
      output = (await sdk.api.util.toSymbols(output)).output;
      output = { output: output, ethCallCount: 0 };
    }

    return output;
  } catch (error) {
    console.log(error);
  }
}

/*==================================================
  Exports
  ==================================================*/

module.exports = Run;
