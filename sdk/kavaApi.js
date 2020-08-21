/*==================================================
  Modules
  ==================================================*/

  require('dotenv').config();
  const fetch = require("node-fetch");
  const moment = require('moment');

/*==================================================
  Constants
  ==================================================*/
  const GENESIS_TIME = 1591797600; // 2020-06-10T14:00:00+00:00
  const MILISECONDS = 1000;

/*==================================================
  Helper Methods
  ==================================================*/

  async function util(funcName, options) {
    switch(funcName) {
      case "lookupBlock":
        const timestamp = options.timestamp;
        const timeUnit = options.timeUnit;

        if(timestamp < GENESIS_TIME) {
          console.log("timestamp ", timestamp, " is before genesis time ", GENESIS_TIME)
          return;
        }

        // Fetch current BlockTime and BlockHeight
        const latestBlockResponse = await fetch("https://kava3.data.kava.io/blocks/latest");
        const latestBlockData = await latestBlockResponse.json();
        const currBlockHeight = Number(latestBlockData.block.header.height);
        const currBlockTimeUTC = latestBlockData.block.header.time;
        const currBlockTime = (Date.parse(currBlockTimeUTC)/MILISECONDS).toFixed(0);

        // Calculate average seconds per block
        const chainDuration = currBlockTime - GENESIS_TIME;
        const avgSecsPerBlock = chainDuration / currBlockHeight;

        // Set current time to the same value in TestRun
        const currTime = moment().utcOffset(0).startOf(timeUnit).unix();
        // How many blocks ago should our query target
        const intoPastTime = currTime - timestamp;
        const intoPastBlockCount = intoPastTime / avgSecsPerBlock;
        let queryHeight = currBlockHeight - intoPastBlockCount;

        // Safety check: can't query height greater than current height
        if(queryHeight > currBlockHeight) {
            queryHeight = currBlockHeight;
        }

        return queryHeight
      case "toSymbols":
        // Kava only has one collateral type at the moment, so we can hardcode it
        return {
          output: {
            borrow: { BNB: options.data.borrowed + options.data.fees},
            supply: { BNB: options.data.locked}
          }
        };
      case "unwrap":
        // Kava only has one collateral type at the moment, so we can hardcode it
        return {
          output: {
            BNB: {
              balance: options.balances.supply.BNB.toFixed(5), id: 1839
            }
          }
        }
      default:
        console.error("error: unsupported function name");
        break;
    }
  }

/*==================================================
  Exports
  ==================================================*/

  module.exports = {
    util: {
      lookupBlock: (timestamp) => util('lookupBlock', { timestamp }),
      toSymbols: (data) => util('toSymbols', { data }),
      unwrap: (options) => util('unwrap', { ...options })
    }
  }
