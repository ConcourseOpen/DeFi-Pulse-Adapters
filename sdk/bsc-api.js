const Eth = require("web3-eth");
const Etherscan = require("./lib/etherscan");
const Bottleneck = require("bottleneck");
const BEP20 = require("./abis/bep20.json");
const tokenList = require("./data/bscTokenLists.json");
const { getBalance, getBalances, getLogs, singleCall, multiCall } = require("./lib/web3");
const { toSymbols } = require("./lib/address");
const debug = require("debug")("bsc-api");

if (!process.env.BSC_RPC_URL) {
  throw new Error(`Please set environment variable BSC_RPC_URL`);
}

if (!process.env.BSC_SCAN_KEY) {
  throw new Error(`Please set environment variable BSC_SCAN_KEY`);
}

const BSC_RPC_URL = process.env.BSC_RPC_URL;
const BSC_SCAN_KEY = process.env.BSC_SCAN_KEY;

const BSC_WEB3 = new Eth(BSC_RPC_URL);
const BSC_SCAN = new Etherscan(BSC_SCAN_KEY, "https://api.bscscan.com/api");
const BSC_LIMITER = new Bottleneck({ maxConcurrent: 10, minTime: 50 });

async function bep20(method, target, params = []) {
  const abi = BEP20.find(item => item.type === "function" && item.name === method);

  return singleCall({
    web3: BSC_WEB3,
    limiter: BSC_LIMITER,
    target,
    abi,
    params
  });
}

async function cdp(endpoint, options) {
  return "TODO";
}

module.exports = {
  abi: {
    call: ({ target, abi, block, params }) => {
      debug("bsc.api.abi.call", { target, abi, block, params });

      return singleCall({ web3: BSC_WEB3, limiter: BSC_LIMITER, target, abi, block, params });
    },
    multiCall: ({ target, abi, block, calls }) => {
      debug("bsc.api.abi.multiCall", { target, abi, block, calls });

      return multiCall({ web3: BSC_WEB3, limiter: BSC_LIMITER, target, abi, block, calls });
    }
  },
  cdp: {
    getAssetsLocked: options =>
      cdp("getAssetsLocked", { ...options, chunk: { param: "targets", length: 1000, combine: "balances" } })
  },
  util: {
    getLogs: ({ target, topic, keys, fromBlock, toBlock }) => {
      debug("bsc.api.util.getLogs", { target, topic, fromBlock, toBlock });

      return getLogs({
        web3: BSC_WEB3,
        scan: BSC_SCAN,
        limiter: BSC_LIMITER,
        target,
        topic,
        keys,
        fromBlock,
        toBlock
      });
    },
    tokenList: () => {
      debug("bsc.api.util.tokenList");

      return Promise.resolve(tokenList);
    },
    toSymbols: addressesBalances => {
      debug("bsc.api.util.toSymbols", addressesBalances);

      return Promise.resolve({
        callCount: 0,
        output: toSymbols(addressesBalances)
      });
    }
  },
  bnb: {
    getBalance: async ({ target, block, decimals }) => {
      debug("bsc.api.bnb.getBalance", { target, block, decimals });

      const { callCount, output } = await getBalance({
        web3: BSC_WEB3,
        limiter: BSC_LIMITER,
        target,
        block
      });

      const balance = parseInt(output, 10);

      if (decimals) {
        return { callCount, output: balance / 10 ** decimals };
      }

      return { callCount, output: balance };
    },
    getBalances: async ({ targets, block, decimals }) => {
      debug("bsc.api.bnb.getBalances", { targets, block, decimals });

      const { callCount, output } = await getBalances({
        web3: BSC_WEB3,
        limiter: BSC_LIMITER,
        targets,
        block
      });

      const balances = output.map(o => parseInt(o, 10));

      if (decimals) {
        return { callCount, output: balances.map(b => b / 10 ** decimals) };
      }

      return { callCount, output: balances };
    }
  },
  bep20: {
    info: async target => {
      debug("bsc.api.bep20.info", { target });

      const { callCount: symbolCallCount, output: symbol } = await bep20("symbol", target);
      const { callCount: decimalsCallCount, output: decimals } = await bep20("decimals", target);

      return {
        callCount: symbolCallCount + decimalsCallCount,
        output: {
          symbol,
          decimals
        }
      };
    },
    symbol: target => {
      debug("bsc.api.bep20.symbol", { target });

      return bep20("symbol", target);
    },
    decimals: target => {
      debug("bsc.api.bep20.decimals", { target });

      return bep20("decimals", target);
    },
    totalSupply: async ({ target, block, decimals }) => {
      debug("bsc.api.bep20.totalSupply", { target, block, decimals });

      const { callCount, output } = await bep20("totalSupply", target);

      const totalSupply = parseInt(output, 10);

      // ignore block for now

      if (decimals) {
        return {
          callCount,
          output: totalSupply / 10 ** decimals
        };
      }

      return { callCount, output: totalSupply };
    },
    balanceOf: async ({ target, owner, block, decimals }) => {
      debug("bsc.api.bep20.balanceOf", { target, owner, block, decimals });

      const { callCount, output } = await bep20("balanceOf", target, [owner]);

      const balance = parseInt(output, 10);

      // ignore block for now

      if (decimals) {
        return { callCount, output: balance / 10 ** decimals };
      }

      return { callCount, output: balance };
    }
  }
};
