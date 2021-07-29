/*==================================================
  Modules
  ==================================================*/

  require('dotenv').config();
  const axios = require('axios');
  const _ = require('underscore');
  const utility = require('./util');
  const Bottleneck = require('bottleneck');
  const term = require( 'terminal-kit' ).terminal;
  const $indexerHost = 'http://defipulse-indexer-sync-server-staging.us-west-1.elasticbeanstalk.com';

/*==================================================
  Helper Methods
  ==================================================*/

  /**
   *
   * @param {Object} any
   * @returns {boolean}
   * @private
   */
  const _isCallable = (any) => typeof any === 'function';

  /**
   *
   * @param {String} key
   * @param {Object} val
   * @returns {*}
   * @private
   */
  const _jsonConverter = (key, val) => {
    if (val && _isCallable(val)) {
      return `return ${String(val)}`;
    }

    return val;
  };

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

        function processRequest(chunk) {
          return new Promise(async(resolve, reject) => {
            try {
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
                    ...call.output
                  ]
                } else if(options.chunk.combine == 'balances') {
                  output.push(call.output);
                }
              }
              resolve();
            } catch(error) {
              reject(error);
            }
          });
        }

        const limiter = new Bottleneck({
          maxConcurrent: process.env.ADAPTER_CONCURRENCY || 1
        });

        await Promise.all(_.map(chunks, (chunk) => {
          return limiter.schedule(() => {
            return processRequest(chunk);
          });
        }));

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

/**
 *
 * @param {Number} block
 * @param {Number} timestamp
 * @param {Object} project
 * @param {Object} tokenBalanceMap
 * @returns {Promise<*>}
 * @private
 */
async function _testAdapter(block, timestamp, project, tokenBalanceMap) {
  project = JSON.stringify(project, _jsonConverter, 2);

  try {
    return (
      await axios({
        method: 'POST',
        url: `${$indexerHost}/test-tvl`,
        data: {
          block,
          project,
          timestamp,
          tokenBalanceMap,
        }
      })
    ).data;
  } catch(error) {
    console.error(`Error: ${error.response ? error.response.data : error}`);
    throw error.response ? error.response.data : error;
  }
}

/**
 *
 * @param {Number} timestamp
 * @param {String} chain
 * @returns {Promise<*>}
 * @private
 */
async function _lookupBlock(timestamp, chain) {
  try {
    return (
      await axios.get(`${$indexerHost}/lookup-block?chain=${chain || ''}&&timestamp=${timestamp}`)
    ).data;
  } catch(error) {
    console.error(`Error: ${error.response ? error.response.data : error}`);
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

  async function aave(endpoint, options) {
    return POST(`/cdp/aave/${endpoint}`, options);
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
      multiCall: (options) => abi('multiCall', { ...options, chunk: {param: 'calls', length: 2500, combine: 'array'} })
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
      },
      aave: {
        getAssetsLocked: (options) => aave('getAssetsLocked', { ...options, chunk: {param: 'targets', length: 1000, combine: 'balances'} })
      }
    },
    util: {
      getLogs: (options) => util('getLogs', { ...options }),
      tokenList: () => util('tokenList'),
      kyberTokens: () => util('kyberTokens'),
      getEthCallCount: () => util('getEthCallCount'),
      resetEthCallCount: () => util('resetEthCallCount'),
      toSymbols: (data) => util('toSymbols', { data }),
      unwrap: (options) => util('unwrap', { ...options }),
      lookupBlock: _lookupBlock,
      /**
       *
       * @param {Number} block
       * @param {Number} timestamp
       * @param {Object} project
       * @param {Object} tokenBalanceMap
       * @returns {Promise<*>}
       */
      testAdapter: ((block, timestamp, project, tokenBalanceMap) => {
        return _testAdapter(block, timestamp, project, tokenBalanceMap);
      }),
      /**
       *
       */
      isCallable: _isCallable,
      /**
       *
       * @param {String} str
       * @returns {boolean}
       */
      isString: (str) => typeof str === 'string',
    },
    eth: {
      getBalance: (options) => eth('getBalance', options),
      getBalances: (options) => eth('getBalances', options),
    },
    erc20: {
      info: (target) => erc20('info', { target }),
      symbol: (target) => erc20('symbol', { target }),
      decimals: (target, chain=null) => erc20('decimals', { target, chain }),
      totalSupply: (options) => erc20('totalSupply', { ...options }),
      balanceOf: (options) => erc20('balanceOf', { ...options }),
    }
  }
