const { call, multiCall } = require("./abi");
const { totalSupply, decimals, symbol, balanceOf, info } = require("./erc20");
const { getBalance, getBalances } = require("./eth");
const { toSymbols, getLogs, kyberTokens, tokenList, lookupBlock } = require("./util");

async function toSymbolsHandler(event) {
  let data;
  try {
    ({ data } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await toSymbols(data);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function getLogsHandler(event) {
  let target, topic, keys, fromBlock, toBlock;
  try {
    ({ target, topic, keys, fromBlock, toBlock } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await getLogs(target, topic, keys, fromBlock, toBlock);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function kyberTokensHandler() {
  const result = await kyberTokens();

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function tokenListHandler() {
  const result = tokenList();

  return {
    statusCode: 200,
    body: JSON.stringify(result),
  };
}

async function lookupBlockHandler(event) {
  let timestamp;
  try {
    ({ timestamp } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await lookupBlock(timestamp);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function getBalanceHandler(event) {
  let target, block, decimals;
  try {
    ({ target, block, decimals } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await getBalance(target, block, decimals);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function getBalancesHandler(event) {
  let targets, block, decimals;
  try {
    ({ targets, block, decimals } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await getBalances(targets, block, decimals);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function totalSupplyHandler(event) {
  let target, block, decimals;
  try {
    ({ target, block, decimals } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await totalSupply(target, block, decimals);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function decimalsHandler(event) {
  let target;
  try {
    ({ target } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await decimals(target);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function symbolHandler(event) {
  let target;
  try {
    ({ target } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await symbol(target);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function infoHandler(event) {
  let target;
  try {
    ({ target } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await info(target);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function balanceOfHandler(event) {
  let target, owner, block, decimals;
  try {
    ({ target, owner, block, decimals } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await balanceOf(target, owner, block, decimals);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function callHandler(event) {
  let target, abi, block, params;
  try {
    ({ target, abi, block, params } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await call(target, abi, block, params);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

async function multiCallHandler(event) {
  let abi, calls, block, target;
  try {
    ({ abi, calls, block, target } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      body: "Missing body content",
    };
  }
  const result = await multiCall(abi, calls, block, target);

  return {
    statusCode: 200,
    body: JSON.stringify({ ethCallCount: 0, output: result }),
  };
}

module.exports.callHandler = callHandler;
module.exports.multiCallHandler = multiCallHandler;

module.exports.totalSupplyHandler = totalSupplyHandler;
module.exports.decimalsHandler = decimalsHandler;
module.exports.symbolHandler = symbolHandler;
module.exports.balanceOfHandler = balanceOfHandler;
module.exports.infoHandler = infoHandler;

module.exports.getBalanceHandler = getBalanceHandler;
module.exports.getBalancesHandler = getBalancesHandler;

module.exports.toSymbolsHandler = toSymbolsHandler;
module.exports.getLogsHandler = getLogsHandler;
module.exports.kyberTokensHandler = kyberTokensHandler;
module.exports.tokenListHandler = tokenListHandler;
module.exports.lookupBlockHandler = lookupBlockHandler;
