const { POST } = require("./external");
const tokenList = require("./data/ethTokenLists.json");

const commonOptions = {
  baseUrl: process.env.ETH_TVL_API_URL,
  logProgress: process.env.ETH_LOG_PROGRESS === "true",
  adapterConcurrency: process.env.ETH_ADAPTER_CONCURRENCY
};

async function erc20(endpoint, options) {
  return POST(`/erc20/${endpoint}`, { ...commonOptions, ...options });
}

async function eth(endpoint, options) {
  return POST(`/eth/${endpoint}`, { ...commonOptions, ...options });
}

async function util(endpoint, options) {
  return POST(`/util/${endpoint}`, { ...commonOptions, ...options });
}

async function abi(endpoint, options) {
  return POST(`/abi/${endpoint}`, { ...commonOptions, ...options });
}

async function maker(endpoint, options) {
  return POST(`/cdp/maker/${endpoint}`, { ...commonOptions, ...options });
}

async function compound(endpoint, options) {
  return POST(`/cdp/compound/${endpoint}`, { ...commonOptions, ...options });
}

async function aave(endpoint, options) {
  return POST(`/cdp/aave/${endpoint}`, { ...commonOptions, ...options });
}

async function cdp(endpoint, options) {
  return POST(`/cdp/${endpoint}`, { ...commonOptions, ...options });
}

module.exports = {
  abi: {
    call: options => abi("call", { ...options }),
    multiCall: options => abi("multiCall", { ...options, chunk: { param: "calls", length: 400, combine: "array" } })
  },
  cdp: {
    getAssetsLocked: options =>
      cdp("getAssetsLocked", { ...options, chunk: { param: "targets", length: 1000, combine: "balances" } }),
    maker: {
      tokens: options => maker("tokens", { ...options }),
      getAssetsLocked: options =>
        maker("getAssetsLocked", { ...options, chunk: { param: "targets", length: 3000, combine: "balances" } })
    },
    compound: {
      tokens: options => compound("tokens", { ...options }),
      getAssetsLocked: options =>
        compound("getAssetsLocked", { ...options, chunk: { param: "targets", length: 1000, combine: "balances" } })
    },
    aave: {
      getAssetsLocked: options =>
        aave("getAssetsLocked", { ...options, chunk: { param: "targets", length: 1000, combine: "balances" } })
    }
  },
  util: {
    getLogs: options => util("getLogs", { ...options, chunk: { length: 200000 } }),
    tokenList: () => Promise.resolve(tokenList),
    kyberTokens: () => util("kyberTokens"),
    // not used by any adapters
    // getEthCallCount: () => util("getEthCallCount"),
    // resetEthCallCount: () => util("resetEthCallCount"),
    toSymbols: data => util("toSymbols", { data }),
    // unwrap: options => util("unwrap", { ...options }),
    lookupBlock: timestamp => util("lookupBlock", { timestamp })
  },
  eth: {
    getBalance: options => eth("getBalance", options),
    getBalances: options => eth("getBalances", options)
  },
  erc20: {
    info: target => erc20("info", { target }),
    symbol: target => erc20("symbol", { target }),
    decimals: target => erc20("decimals", { target }),
    totalSupply: options => erc20("totalSupply", { ...options }),
    balanceOf: options => erc20("balanceOf", { ...options })
  }
};
