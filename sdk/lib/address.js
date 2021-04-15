const BSC_TOKENS = require("../data/bscTokenLists.json");
const ETH_TOKENS = require("../data/ethTokenLists.json");

function mapAddressToTokenSymbol(tokenList, address) {
  const token = tokenList.find(t => t.contract.toLowerCase() === address.toLowerCase());

  return token && token.symbol;
}

function getDecimals(tokenList, address) {
  const token = tokenList.find(t => t.contract.toLowerCase() === address.toLowerCase());

  return token && parseInt(token.decimals);
}

function toSymbols(output) {
  const result = {};

  Object.keys(output).forEach(address => {
    const symbol =
      mapAddressToTokenSymbol(BSC_TOKENS, address) || mapAddressToTokenSymbol(ETH_TOKENS, address) || address;

    const decimals = getDecimals(BSC_TOKENS, address) || getDecimals(ETH_TOKENS, address) || 0;
    const numTokens = output[address] / (10 ** decimals)

    if (result[symbol]) {
      result[symbol] += numTokens;
    } else {
      result[symbol] = numTokens;
    }
  });

  return result;
}

module.exports = { mapAddressToTokenSymbol, toSymbols };
