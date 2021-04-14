const axios = require("axios");
const _ = require("underscore");
const utility = require("./util");
const wait = milliseconds => new Promise(resolve => setTimeout(resolve, milliseconds));
const term = require("terminal-kit").terminal;
const Bottleneck = require("bottleneck");

async function POST(endpoint, options) {
  try {
    if (options && options.chunk && endpoint === "/util/getLogs") {
      let logs = [];
      for (let i = 0; i < Math.ceil((options.toBlock - options.fromBlock) / options.chunk.length); i++) {
        const currFromBlock = options.fromBlock + i * options.chunk.length;
        let currToBlock = options.fromBlock + (i + 1) * options.chunk.length;
        currToBlock = currToBlock > options.toBlock ? options.toBlock : currToBlock;
        let opts = {
          ...options
        };
        opts.fromBlock = currFromBlock;
        opts.toBlock = currToBlock;
        opts.chunk = undefined;
        logs = logs.concat((await POST(endpoint, opts)).output);
      }
      return { ethCallCount: 0, output: logs };
    } else if (options && options.chunk && options[options.chunk.param].length > options.chunk.length) {
      let chunks = _.chunk(options[options.chunk.param], options.chunk.length);

      let ethCallCount = 0;
      let output = [];
      let complete = 0;

      if (options.logProgress == "true") {
        progressBar = term.progressBar({
          width: 80,
          title: endpoint,
          percent: true
        });
      }

      function processRequest(chunk) {
        return new Promise(async (resolve, reject) => {
          try {
            let opts = {
              ...options
            };
            opts[options.chunk.param] = chunk;

            let call = await POST(endpoint, opts);
            complete++;

            if (options.logProgress == "true") {
              progressBar.update(complete / chunks.length);
            }

            if (call.ethCallCount) {
              ethCallCount += call.ethCallCount;

              if (options.chunk.combine == "array") {
                output = [...output, ...call.output];
              } else if (options.chunk.combine == "balances") {
                output.push(call.output);
              }
            }
            resolve();
          } catch (error) {
            reject(error);
          }
        });
      }

      const limiter = new Bottleneck({
        maxConcurrent: options.adapterConcurrency || 1
      });

      await Promise.all(
        _.map(chunks, chunk => {
          return limiter.schedule(() => {
            return processRequest(chunk);
          });
        })
      );

      if (options.logProgress == "true") {
        progressBar.update(1);
      }

      if (options.chunk.combine == "balances") {
        console.log("balances combine");
        output = utility.sum(output);
      }

      return {
        ethCallCount,
        output
      };
    } else {
      // retry for max 5 times
      for (let i = 0; i < 5; i++) {
        try {
          let url = `${options.baseUrl}${endpoint}`;

          let response = await axios.post(url, options);

          return response.data;
        } catch (error) {
          if (i === 4) {
            throw error;
          }
          await wait(100);
        }
      }
    }
  } catch (error) {
    throw error.response ? error.response.data : error;
  }
}

module.exports = { POST };
