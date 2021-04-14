const { POST } = require("./external");
const tokenList = require("./data/bscTokenLists.json");

const commonOptions = {
  baseUrl: process.env.BSC_TVL_API_URL,
  logProgress: process.env.BSC_LOG_PROGRESS === "true",
  adapterConcurrency: process.env.BSC_ADAPTER_CONCURRENCY
};

async function bep20(endpoint, options) {
  return POST(`/erc20/${endpoint}`, { ...commonOptions, ...options });
}

async function bnb(endpoint, options) {
  return POST(`/eth/${endpoint}`, { ...commonOptions, ...options });
}

async function util(endpoint, options) {
  return POST(`/util/${endpoint}`, { ...commonOptions, ...options });
}

async function abi(endpoint, options) {
  return POST(`/abi/${endpoint}`, { ...commonOptions, ...options });
}

async function cdp(endpoint, options) {
  return POST(`/cdp/${endpoint}`, { ...commonOptions, ...options });
}

module.exports = {
  api: {
    abi: {
      call: options => abi("call", { ...options }),
      multiCall: options => abi("multiCall", { ...options, chunk: { param: "calls", length: 400, combine: "array" } })
    },
    cdp: {
      getAssetsLocked: options =>
        cdp("getAssetsLocked", { ...options, chunk: { param: "targets", length: 1000, combine: "balances" } })
    },
    util: {
      getLogs: options => util("getLogs", { ...options, chunk: { length: 200000 } }),
      tokenList: () => Promise.resolve(tokenList),
      // kyberTokens: () => util("kyberTokens"),
      toSymbols: data => util("toSymbols", { data })
    },
    bnb: {
      getBalance: options => bnb("getBalance", options),
      getBalances: options => bnb("getBalances", options)
    },
    bep20: {
      info: target => bep20("info", { target }),
      symbol: target => bep20("symbol", { target }),
      decimals: target => bep20("decimals", { target }),
      totalSupply: options => bep20("totalSupply", { ...options }),
      balanceOf: options => bep20("balanceOf", { ...options })
    }
  }
};
