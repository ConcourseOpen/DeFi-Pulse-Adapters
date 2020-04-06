/*==================================================
  Modules
  ==================================================*/

  require('dotenv').config();
  const axios = require('axios');
  const _ = require('underscore');
  const utility = require('./util');
  const term = require( 'terminal-kit' ).terminal;

/*==================================================
  Helper Methods
  ==================================================*/

  async function POST(endpoint, options) {
    try {
      if(options && options.chunk && options[options.chunk.param].length > options.chunk.length) {
        let chunks = _.chunk(options[options.chunk.param], options.chunk.length);

        let ethCallCount = 0;
        let output = [];
        let complete = 0;

        if(process.env.LOG_PROGRESS == 'true') {
          progressBar = term.progressBar( {
            width: 80,
            title: endpoint,
            percent: true
          });
        }

        for(let chunk of chunks) {
          let opts = {
            ...options
          }
          opts[options.chunk.param] = chunk;


          let call = await POST(endpoint, opts);
          complete++;

          if(process.env.LOG_PROGRESS == 'true') {
            progressBar.update(complete / chunks.length);
          }

          if(call.ethCallCount) {
            ethCallCount += call.ethCallCount;

            if(options.chunk.combine == 'array') {
              output = [
                ...output,
                call.output
              ]
            } else if(options.chunk.combine == 'balances') {
              output.push(call.output);
            }
          }
        }

        if(process.env.LOG_PROGRESS == 'true') {
          progressBar.update(1);
        }

        if(options.chunk.combine == 'balances') {
          console.log('balances combine')
          output = utility.sum(output);
        }

        return {
          ethCallCount,
          output
        }
      } else {
        let url = `${process.env.DEFIPULSE_API_URL}/${process.env.DEFIPULSE_KEY}${endpoint}`;

        if(process.env.INFURA_KEY) {
          url = `${url}?infura-key=${process.env.INFURA_KEY}`;
        }

        let response = await axios.post(url, options);

        return response.data;
      }
    } catch(error) {
      throw error.response ? error.response.data : error;
    }
  }

  async function erc20(endpoint, options) {
    return POST(`/erc20/${endpoint}`, options);
  }

  async function eth(endpoint, options) {
    return POST(`/eth/${endpoint}`, options);
  }

  async function util(endpoint, options) {
    return POST(`/util/${endpoint}`, options);
  }

  async function abi(endpoint, options) {
    return POST(`/abi/${endpoint}`, options);
  }

  async function maker(endpoint, options) {
    return POST(`/cdp/maker/${endpoint}`, options);
  }

  async function compound(endpoint, options) {
    return POST(`/cdp/compound/${endpoint}`, options);
  }

  async function cdp(endpoint, options) {
    return POST(`/cdp/${endpoint}`, options);
  }

/*==================================================
  Exportsd
  ==================================================*/

  module.exports = {
    abi: {
      call: (options) => abi('call', { ...options }),
      multiCall: (options) => abi('multiCall', { ...options, chunk: {param: 'calls', length: 5000, combine: 'array'} })
    },
    cdp: {
      getAssetsLocked: (options) => cdp('getAssetsLocked', { ...options, chunk: {param: 'targets', length: 1000, combine: 'balances'} }),
      maker: {
        tokens: (options) => maker('tokens', { ...options }),
        getAssetsLocked: (options) => maker('getAssetsLocked', { ...options, chunk: {param: 'targets', length: 3000, combine: 'balances'} })
      },
      compound: {
        tokens: (options) => compound('tokens', { ...options }),
        getAssetsLocked: (options) => compound('getAssetsLocked', { ...options, chunk: {param: 'targets', length: 1000, combine: 'balances'} })
      }
    },
    util: {
      getLogs: (options) => util('getLogs', { ...options }),
      kyberTokens: () => util('kyberTokens'),
      getEthCallCount: () => util('getEthCallCount'),
      resetEthCallCount: () => util('resetEthCallCount'),
      toSymbols: (data) => util('toSymbols', { data }),
      lookupBlock: (timestamp) => util('lookupBlock', { timestamp })
    },
    eth: {
      getBalance: (options) => eth('getBalance', options),
    },
    erc20: {
      info: (target) => erc20('info', { target }),
      symbol: (target) => erc20('symbol', { target }),
      decimals: (target) => erc20('decimals', { target }),
      totalSupply: (options) => erc20('totalSupply', { ...options }),
      balanceOf: (options) => erc20('balanceOf', { ...options }),
    }
  }
